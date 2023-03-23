
from django.db import models
from django.db.models import Sum


from emissions.models import (CustomUser, WorkingGroup)

from co2calculator.co2calculator.constants import TransportationMode


class BusinessTripGroup(models.Model):
    """Monthly business trip emissions per working group"""

    working_group = models.ForeignKey(WorkingGroup, on_delete=models.CASCADE, null=True)
    timestamp = models.DateField(null=False)
    n_employees = models.IntegerField(null=False)
    transportation_choices = [(x.name, x.value) for x in TransportationMode]
    transportation_mode = models.CharField(
        max_length=10,
        choices=transportation_choices,
        blank=False,
    )
    distance = models.FloatField()
    co2e = models.FloatField()
    co2e_cap = models.FloatField()

    class Meta:
        """Specifies which attributes must be unique together"""

        unique_together = ("working_group", "timestamp", "transportation_mode")

    def __str__(self):
        return (
            f"{self.working_group.name}, {self.timestamp}, {self.transportation_mode}"
        )


class BusinessTrip(models.Model):
    """Business trip of an employee"""

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    working_group = models.ForeignKey(WorkingGroup, on_delete=models.CASCADE, null=True)
    timestamp = models.DateField(null=False)
    distance = models.FloatField()
    co2e = models.FloatField()
    transportation_choices = [(x.name, x.value) for x in TransportationMode]
    transportation_mode = models.CharField(
        max_length=10,
        choices=transportation_choices,
        blank=False,
    )
    range_category = models.CharField(max_length=50)

    def save(self, *args, **kwargs):
        """Recalculate the emission of the respective working group when a user adds a business trip"""
        # Calculate monthly co2
        super(BusinessTrip, self).save(*args, **kwargs)
        if self.working_group is None:
            return

        year = self.timestamp.year
        month = self.timestamp.month
        entries = BusinessTrip.objects.filter(
            working_group=self.working_group,
            timestamp__year=year,
            timestamp__month=month,
            transportation_mode=self.transportation_mode,
        )
        metrics = {"co2e": Sum("co2e"), "distance": Sum("distance")}
        group_data = entries.aggregate(**metrics)
        co2e_cap = group_data["co2e"] / self.working_group.n_employees

        try:
            obj = BusinessTripGroup.objects.get(
                working_group=self.working_group,
                timestamp="{0}-{1}-01".format(year, month),
                transportation_mode=self.transportation_mode,
            )
            obj.n_employees = self.working_group.n_employees
            obj.distance = group_data["distance"]
            obj.co2e = group_data["co2e"]
            obj.co2e_cap = co2e_cap
            obj.save()
        except BusinessTripGroup.DoesNotExist:
            BusinessTripGroup(
                working_group=self.working_group,
                timestamp="{0}-{1}-01".format(year, month),
                transportation_mode=self.transportation_mode,
                n_employees=self.working_group.n_employees,
                distance=group_data["distance"],
                co2e=group_data["co2e"],
                co2e_cap=co2e_cap,
            ).save()

    def delete(self):
        """Recalculate the emission of the respective working group when a user delets a business trip"""
        # Calculate monthly co2
        super(BusinessTrip, self).delete()
        entries = BusinessTrip.objects.filter(
            working_group=self.working_group,
            timestamp__year=self.timestamp.year,
            timestamp__month=self.timestamp.month,
            transportation_mode=self.transportation_mode,
        )
        print(entries)
        if len(entries) == 0:
            co2e = 0
            co2e_cap = 0
            distance = 0
        else:
            metrics = {"co2e": Sum("co2e"), "distance": Sum("distance")}
            group_data = entries.aggregate(**metrics)
            co2e = group_data["co2e"]
            distance = group_data["distance"]
            co2e_cap = co2e / self.working_group.n_employees

        try:
            obj = BusinessTripGroup.objects.get(
                working_group=self.working_group,
                timestamp="{0}-{1}-01".format(
                    self.timestamp.year, self.timestamp.month
                ),
                transportation_mode=self.transportation_mode,
            )
            obj.n_employees = self.working_group.n_employees
            obj.distance = distance
            obj.co2e = co2e
            obj.co2e_cap = co2e_cap
            obj.save()
        except BusinessTripGroup.DoesNotExist:
            BusinessTripGroup(
                working_group=self.working_group,
                timestamp="{0}-{1}-01".format(
                    self.timestamp.year, self.timestamp.month
                ),
                transportation_mode=self.transportation_mode,
                n_employees=self.working_group.n_employees,
                distance=distance,
                co2e=co2e,
                co2e_cap=co2e_cap,
            ).save()

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}, {self.transportation_mode}, {self.timestamp}"