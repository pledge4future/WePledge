#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Functions to catch signals when models are being edited"""

from django.dispatch import receiver
from django.db.models.signals import pre_save

from emissions.models import CustomUser, WorkingGroup

import logging

logger = logging.getLogger(__name__)


@receiver(pre_save, sender=CustomUser)
def set_id_as_username(sender, instance, **kwargs):
    """Sets the id of the user as its username since django.contrib.auth.models.AbstractUser requires one."""
    if not instance.username:
        instance.username = instance.id
    print(instance.username)


@receiver(pre_save, sender=WorkingGroup)
def update_representatives(sender, instance, **kwargs):
    """Updates the info of the old and new representatives of the working group"""
    # Update old representative
    try:
        old_instance = WorkingGroup.objects.get(id=instance.id)
        old_representative = old_instance.representative
        old_representative.is_representative = False
        old_representative.save()
    except WorkingGroup.DoesNotExist:
        logger.info("Group does not exist yet")

    # Update new representative
    new_representative = instance.representative
    new_representative.is_representative = True
    new_representative.save()


