#!/usr/bin/env python
# -*- coding: utf-8 -*-

# create test users from JSON files
import json
import logging
import os
from django.core.management.base import BaseCommand
from django.db.utils import IntegrityError
from emissions.models import CustomUser, WorkingGroup, Institution, ResearchField

logger = logging.basicConfig()
script_path = os.path.dirname(os.path.realpath(__file__))


class Command(BaseCommand):
    """Base Command to populate data"""

    def __init__(self, *args, **kwargs):
        """Init class"""
        super(Command, self).__init__(*args, **kwargs)

    help = "Creates users for unit tests"

    def handle(self, *args, **options):
        """Populate database"""

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


        # Create working groups
        working_groups = config_data["working_groups"]
        for working_group, workinggroup_data in working_groups.items():
            try:
                wg_environmental = WorkingGroup(
                    name=workinggroup_data["name"],
                    institution=Institution.objects.filter(
                        name=workinggroup_data["institution"]["name"], city=workinggroup_data["institution"]["city"],
                        country=workinggroup_data["institution"]["country"]
                    )[0],
                    representative=CustomUser.objects.get(username=workinggroup_data["representative"]),
                    n_employees=workinggroup_data["n_employees"],
                    field=ResearchField.objects.filter(
                        field=workinggroup_data["research_field"]["field"],
                        subfield=workinggroup_data["research_field"]["subfield"],
                    )[0],
                    public=workinggroup_data["public"]
                )
                wg_environmental.save()
                # Set a representative for the group

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
