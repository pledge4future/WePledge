#!/usr/bin/env python
# -*- coding: utf-8 -*-

""" Commuting Models """


from django.db import models

from emissions.models import (CustomUser, WorkingGroup)

from co2calculator.co2calculator.constants import TransportationMode


class CommutingGroup(models.Model):
    """Monthly emissions from commuting per working group"""

    working_group = models.ForeignKey(WorkingGroup, on_delete=models.CASCADE, null=True)
    timestamp = models.DateField(null=False)
    n_employees = models.IntegerField(null=False)
    transportation_mode = models.CharField(max_length=30)
    distance = models.FloatField(null=True)
    co2e = models.FloatField()
    co2e_cap = models.FloatField()

    def __str__(self):
        return (
            f"{self.working_group.name}, {self.transportation_mode}, {self.timestamp}"
        )


class Commuting(models.Model):
    """Monthly emissions from commuting of an employee"""

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    working_group = models.ForeignKey(WorkingGroup, on_delete=models.CASCADE, null=True)
    timestamp = models.DateField(null=False)
    co2e = models.FloatField()
    distance = models.FloatField()
    transportation_choices = [(x.name, x.value) for x in TransportationMode]
    transportation_mode = models.CharField(
        max_length=15,
        choices=transportation_choices,
        blank=False,
    )

    class Meta:
        """Specifies which attributes must be unique together"""

        unique_together = ("user", "timestamp", "transportation_mode")

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}, {self.transportation_mode}, {self.timestamp}"
