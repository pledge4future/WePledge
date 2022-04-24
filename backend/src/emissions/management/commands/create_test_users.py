#!/usr/bin/env python
# -*- coding: utf-8 -*-

# create test users from JSON files
import json
import logging
import os
from django.core.management.base import BaseCommand
from django.db.utils import IntegrityError
from backend.src.emissions.models import CustomUser

logger = logging.basicConfig()
script_path = os.path.dirname(os.path.realpath(__file__))

class Command(BaseCommand):
    """Base Command to populate data"""

    def __init__(self, *args, **kwargs):
        """Init class"""
        super(Command, self).__init__(*args, **kwargs)

    help = "Seeds the database."

    def handle(self, *args, **options):
        """Populate database"""

        config_path = f"{script_path}/config.json"

        with open(config_path) as source:
            config_data = json.load(source)
            print(source[0])

        # Create user for unit tests -----------------------------------------------------
        try:
            new_user = CustomUser(
                username="testuser",
                first_name="test",
                last_name="user",
                email="test2@pledge4future.org",
            )
            new_user.set_password("test_password")
            new_user.save()
            status = new_user.status
            setattr(status, "verified", True)
            status.save(update_fields=["verified"])
            new_user.save()
        except IntegrityError:
            pass

        try:
            testuser_representative = CustomUser(
                username="testuser_representative",
                first_name="test",
                last_name="user",
                email="test3@pledge4future.org",
            )
            testuser_representative.set_password("test_password")
            # setattr(new_user, "is_representative", True)
            testuser_representative.save()
            status = testuser_representative.status
            setattr(status, "verified", True)
            status.save(update_fields=["verified"])
            testuser_representative.save()
        except IntegrityError:
            pass