#!/usr/bin/env python
# -*- coding: utf-8 -*-

# create test users from JSON files
import json
import logging
import os
from django.core.management.base import BaseCommand
from django.core.exceptions import ValidationError
from django.db.utils import IntegrityError
from emissions.models import CustomUser, WorkingGroup, Institution, ResearchField, Heating

from co2calculator.co2calculator import calc_co2_heating

logger = logging.basicConfig()
script_path = os.path.dirname(os.path.realpath(__file__))


ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD")


class Command(BaseCommand):
    """Base Command to populate data"""

    def __init__(self, *args, **kwargs):
        """Init class"""
        super(Command, self).__init__(*args, **kwargs)

    help = "Creates users for unit tests"

    def handle(self, *args, **options):
        """Populate database"""

        # Create super user
        try:
            CustomUser.objects.create_superuser(
                username=ADMIN_USERNAME,
                first_name='admin',
                last_name='admin',
                email=ADMIN_EMAIL,
                password=ADMIN_PASSWORD
            )
        except IntegrityError:
            pass

        config_path = f"{script_path}/../../data/test_data.json"

        with open(config_path) as source:
            config_data = json.load(source)

        # Create test users
        users = config_data["users"]
        for user, user_data in users.items():
            try:
                new_user = CustomUser(
                    username=user_data["username"],
                    first_name=user_data["first_name"],
                    last_name=user_data["last_name"],
                    email=user_data["email"],
                )
                new_user.set_password(user_data["password"])
                new_user.save()
                # Set user status to verified
                status = new_user.status
                setattr(status, "verified", True)
                status.save(update_fields=["verified"])
                new_user.save()
            except IntegrityError as e:
                print(e)
            except Exception as e:
                print(e)

        # Create institutions
        institutions = config_data["institutions"]
        for institution, institution_data in institutions.items():
            try:
                new_institution = Institution(
                    id=institution_data["id"],
                    name=institution_data["name"],
                    city=institution_data["city"],
                    country=institution_data["country"],
                )
                new_institution.save()

            except IntegrityError as e:
                print(e)

        # Create working groups
        working_groups = config_data["working_groups"]
        for working_group, workinggroup_data in working_groups.items():
            try:
                representative_user = CustomUser.objects.get(username=workinggroup_data["representative"])
                working_group = WorkingGroup(
                    id=workinggroup_data['id'],
                    name=workinggroup_data["name"],
                    institution=Institution.objects.filter(
                        id=workinggroup_data["institution"]["id"])[0],
                    representative=representative_user,
                    n_employees=workinggroup_data["n_employees"],
                    field=ResearchField.objects.filter(
                        id=workinggroup_data["research_field"]["id"]
                    )[0],
                    #public=workinggroup_data["public"]
                )
                working_group.save()
                # Set a representative for the group
                representative_user.is_representative = True
                representative_user.working_group = working_group
                representative_user.save()
            except IntegrityError as e:
                print(e)
            except ValidationError as e:
                print(e)

        # Create heating entries
        print("Loading heating entries...")
        heating_entries = config_data["heatings"]
        for data in heating_entries:
            try:
                working_group = WorkingGroup.objects.filter(id=data["working_group_id"])[0]

                # Calculate co2e
                co2e = calc_co2_heating(
                    consumption=data["consumption"],
                    unit=data["unit"],
                    fuel_type=data["fuel_type"],
                    area_share=data["group_share"],
                )
                co2e_cap = co2e / working_group.n_employees

                # Store in database
                new_heating = Heating(
                    working_group=working_group,
                    timestamp=data["timestamp"],
                    consumption=data["consumption"],
                    fuel_type=data["fuel_type"],
                    building=data["building"],
                    group_share=data["group_share"],
                    co2e=co2e,
                    co2e_cap=co2e_cap
                )
                new_heating.save()
            except IntegrityError as e:
                print(e)

        # Create business trips
        # business_trips = config_data["business_trips"]
        # for business_trip, businesstrip_data in business_trips.items():
        #     try:
        #         transportation_mode = ...,
        #         start = ...,
        #         destination = ...,
        #         distance = ...,
        #         size = ...,
        #         fuel_type = ...,
        #         occupancy = ...,
        #         seating = ...,
        #         passengers = ...,
        #         roundtrip = ...