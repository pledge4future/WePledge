#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Create permission groups"""

from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group
from django.contrib.auth.models import Permission
import logging


class Command(BaseCommand):
    """Command"""

    def __init__(self, *args, **kwargs):
        """Init object"""
        super(Command, self).__init__(*args, **kwargs)

    help = "Creates default groups"

    def handle(self, *args, **options):
        """Define groups to be created"""

        group_researcher, created = Group.objects.get_or_create(name="Researcher")
        PERMISSIONS = ["add", "change", "delete", "view"]
        MODELS = ["business trip"]
        if created:
            for model in MODELS:
                for permission in PERMISSIONS:
                    name = f"Can {permission} {model}"
                    try:
                        model_add_perm = Permission.objects.get(name=name)
                    except Exception:
                        logging.warning(f"Permission not found with name '{name}'.")
                        continue
                    group_researcher.permissions.add(model_add_perm)

        group_representative, created = Group.objects.get_or_create(
            name="Representative"
        )
        PERMISSIONS = ["add", "change", "delete", "view"]
        MODELS = ["heating", "electricity", "business trip"]
        if created:
            for model in MODELS:
                for permission in PERMISSIONS:
                    name = f"Can {permission} {model}"
                    # print("Creating {}".format(name))
                    try:
                        model_add_perm = Permission.objects.get(name=name)
                    except Exception:
                        logging.warning(f"Permission not found with name '{name}'.")
                        continue
                    group_representative.permissions.add(model_add_perm)
