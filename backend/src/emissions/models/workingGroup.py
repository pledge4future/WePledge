#!/usr/bin/env python
# -*- coding: utf-8 -*-

""" Working Group Model """

from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


import uuid

from emissions.models import (CustomUser, Institution, ResearchField)


class WorkingGroup(models.Model):
    """Working group at a research institution"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    name = models.CharField(max_length=200, blank=False)
    institution = models.ForeignKey(Institution, on_delete=models.PROTECT, null=True)
    representative = models.OneToOneField(
        CustomUser, on_delete=models.PROTECT, null=True
    )
    n_employees = models.IntegerField(null=True, blank=True)
    field = models.ForeignKey(ResearchField, on_delete=models.PROTECT, null=False)
    is_public = models.BooleanField(null=False, default=False)

    class Meta:
        """Specifies which attributes must be unique together"""

        unique_together = ("name", "institution")

    def clean(self, *args, **kwargs):
        """Verify that the representative of the working group is a member of the working group"""
        # add custom validation here
        if (self.representative.working_group != self) and (
            self.representative.working_group is not None
        ):
            raise ValidationError(
                _(
                    "This user cannot become the group representative, since they are not a member of this working group."
                ),
                code="invalid",
            )
        super().clean(*args, **kwargs)

    def save(self, *args, **kwargs):
        """
        Updates the user who is the representative of the working group
        :param args:
        :param kwargs:
        :return:
        """
        self.full_clean()
        super(WorkingGroup, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.name}, {self.institution.name}, {self.institution.city}, {self.institution.country}"