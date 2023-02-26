#!/usr/bin/env python
# -*- coding: utf-8 -*-

""" Research Field Model """

from django.db import models


class ResearchField(models.Model):
    """Research field"""

    id = models.IntegerField(primary_key=True, null=False, blank=False)
    field = models.CharField(max_length=100, null=False, blank=False)
    subfield = models.CharField(max_length=100, null=False, blank=False)

    class Meta:
        """Specifies which attributes must be unique together"""

        unique_together = ("field", "subfield")

    def __str__(self):
        return f"{self.field} - {self.subfield}"