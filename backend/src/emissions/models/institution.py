#!/usr/bin/env python
# -*- coding: utf-8 -*-

from django.db import models

class Institution(models.Model):
    """Research institution"""

    name = models.CharField(max_length=200, null=False, blank=False)
    city = models.CharField(max_length=100, null=False, blank=False)
    state = models.CharField(max_length=100, null=True)
    country = models.CharField(max_length=100, null=False, blank=False)

    class Meta:
        """Specifies which attributes must be unique together"""

        unique_together = ("name", "city", "country")

    def __str__(self):
        return f"{self.name}, {self.city}, {self.country}"