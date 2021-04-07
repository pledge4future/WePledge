"""
Create permission groups
Create permissions (read only) to models for a set of groups
"""

from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group
from django.contrib.auth.models import Permission
import logging


class Command(BaseCommand):
    def __init__(self, *args, **kwargs):
        super(Command, self).__init__(*args, **kwargs)

    help = "Create default groups"

    def handle(self, *args, **options):

        group_researcher, created = Group.objects.get_or_create(name='Researcher')
        PERMISSIONS = ["add", "change", "delete", "view"]
        MODELS = ["business trip", "car trip", "bus trip", "train trip", "plane trip"]
        if created:
            for model in MODELS:
                for permission in PERMISSIONS:
                    name = 'Can {} {}'.format(permission, model)
                    #print("Creating {}".format(name))
                    try:
                        model_add_perm = Permission.objects.get(name=name)
                    except Exception:
                        logging.warning("Permission not found with name '{}'.".format(name))
                        continue
                    group_researcher.permissions.add(model_add_perm)

        group_representative, created = Group.objects.get_or_create(name='Representative')
        PERMISSIONS = ["add", "change", "delete", "view"]
        MODELS = ["heating", "electricity", "business trip", "car trip", "bus trip", "train trip", "plane trip"]
        if created:
            for model in MODELS:
                for permission in PERMISSIONS:
                    name = 'Can {} {}'.format(permission, model)
                    #print("Creating {}".format(name))
                    try:
                        model_add_perm = Permission.objects.get(name=name)
                    except Exception:
                        logging.warning("Permission not found with name '{}'.".format(name))
                        continue
                    group_representative.permissions.add(model_add_perm)