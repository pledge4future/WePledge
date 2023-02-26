
#!/usr/bin/env python
# -*- coding: utf-8 -*-

""" Electricity Model """

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

from emissions.models import WorkingGroup

from co2calculator.co2calculator.constants import ElectricityFuel


class Electricity(models.Model):
    """Monthly emissions from electricity consumption of a working group"""

    working_group = models.ForeignKey(WorkingGroup, on_delete=models.CASCADE)
    consumption = models.FloatField(null=False)
    timestamp = models.DateField(null=False)
    building = models.CharField(null=False, max_length=30)
    group_share = models.FloatField(
        null=False, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)]
    )
    fuel_type_choices = [(x.name, x.value) for x in ElectricityFuel]
    fuel_type = models.CharField(max_length=40, choices=fuel_type_choices, blank=False)

    co2e = models.FloatField()
    co2e_cap = models.FloatField()

    class Meta:
        """Specifies which attributes must be unique together"""

        unique_together = ("working_group", "timestamp", "fuel_type", "building")

    def __str__(self):
        return f"{self.working_group.name}, {self.timestamp}, {self.fuel_type}, {self.building}"