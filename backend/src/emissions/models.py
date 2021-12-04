import uuid

from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models import Sum
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError

from co2calculator.co2calculator import CommutingTransportationMode, BusinessTripTransportationMode, HeatingFuel, \
    ElectricityFuel, Unit


class CustomUser(AbstractUser):
    """
    Researcher. May be normal user or a group representative
    """
    email = models.EmailField(blank=False, max_length=255, verbose_name="email", unique=True)
    username = models.CharField(max_length=100, unique=True)
    first_name = models.CharField(max_length=25, blank=True)
    last_name = models.CharField(max_length=25, blank=True)
    working_group = models.ForeignKey('WorkingGroup', on_delete=models.SET_NULL, null=True, blank=True)
    is_representative = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username


class Institution(models.Model):
    """
    Top level research institution, e.g. Heidelberg University
    """
    name = models.CharField(max_length=200, null=False, blank=False)
    city = models.CharField(max_length=100, null=False, blank=False)
    state = models.CharField(max_length=100, null=True)
    country = models.CharField(max_length=100, null=False, blank=False)
    inst_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    readonly_fields = ('inst_id',)

    class Meta:
        unique_together = ("name", "city", "country")

    def __str__(self):
        return f"{self.name}, {self.city}, {self.country}"


class WorkingGroup(models.Model):
    """
    Working group
    """
    name = models.CharField(max_length=200, blank=False)
    institution = models.ForeignKey(Institution, on_delete=models.PROTECT, null=True)
    representative = models.ForeignKey(CustomUser, on_delete=models.PROTECT, null=True)
    n_employees = models.IntegerField(null=True, blank=True)
    research_field = models.CharField(null=True, blank=True, max_length=200)
    group_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    readonly_fields = ('group_id',)

    class Meta:
        unique_together = ("name", "institution")

    def clean(self, *args, **kwargs):
        """
        Validate that the representative of the working group is member of the working group
        :param args:
        :param kwargs:
        :return:
        """
        # add custom validation here
        if (self.representative.working_group != self) and (self.representative.working_group is not None):
            raise ValidationError(_('New representative is not a member of this working group.'), code='invalid')
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


class CommutingGroup(models.Model):
    """
    Monthly emissions from commuting per working group
    """
    working_group = models.ForeignKey(WorkingGroup, on_delete=models.CASCADE, null=True)
    timestamp = models.DateField(null=False)
    n_employees = models.IntegerField(null=False)
    transportation_mode = models.CharField(max_length=30)
    distance = models.FloatField(null=True)
    co2e = models.FloatField()
    co2e_cap = models.FloatField()

    def __str__(self):
        return f"{self.working_group.name}, {self.transportation_mode}, {self.timestamp}"


class Commuting(models.Model):
    """
    CO2 emissions from commuting per month
    """
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    working_group = models.ForeignKey(WorkingGroup, on_delete=models.CASCADE, null=True)
    timestamp = models.DateField(null=False)
    co2e = models.FloatField()
    distance = models.FloatField()
    transportation_choices = [(x.name, x.value) for x in CommutingTransportationMode]
    transportation_mode = models.CharField(max_length=15,
                                           choices=transportation_choices,
                                           blank=False,
                                           )

    def __str__(self):
        return f"{self.user.username}, {self.transportation_mode}, {self.timestamp}"


class BusinessTripGroup(models.Model):
    """
    Monthly business trip emissions per working group
    """
    working_group = models.ForeignKey(WorkingGroup, on_delete=models.CASCADE, null=True)
    timestamp = models.DateField(null=False)
    n_employees = models.IntegerField(null=False)
    transportation_choices = [(x.name, x.value) for x in BusinessTripTransportationMode]
    transportation_mode = models.CharField(max_length=10,
                                           choices=transportation_choices,
                                           blank=False,
                                           )
    distance = models.FloatField()
    co2e = models.FloatField()
    co2e_cap = models.FloatField()

    class Meta:
        unique_together = ("working_group", "timestamp", "transportation_mode")

    def __str__(self):
        return f"{self.working_group.name}, {self.timestamp}, {self.transportation_mode}"


class BusinessTrip(models.Model):
    """
    Business trip
    """
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    working_group = models.ForeignKey(WorkingGroup, on_delete=models.CASCADE, null=True)
    timestamp = models.DateField(null=False)
    distance = models.FloatField()
    co2e = models.FloatField()
    transportation_choices = [(x.name, x.value) for x in BusinessTripTransportationMode]
    transportation_mode = models.CharField(max_length=10,
                                           choices=transportation_choices,
                                           blank=False,
                                           )
    range_category = models.CharField(max_length=50)

    def save(self, *args, **kwargs):
        # Calculate monthly co2
        super(BusinessTrip, self).save(*args, **kwargs)
        if self.working_group is None:
            return

        year = self.timestamp[:4]
        month = self.timestamp[5:7]
        entries = BusinessTrip.objects.filter(working_group=self.working_group,
                                              timestamp__year=year,
                                              timestamp__month=month,
                                              transportation_mode=self.transportation_mode)
        metrics = {
            "co2e": Sum("co2e"),
            "distance": Sum("distance")
        }
        group_data = entries.aggregate(**metrics)
        co2e_cap = group_data["co2e"] / self.working_group.n_employees

        try:
            obj = BusinessTripGroup.objects.get(working_group=self.working_group,
                                                timestamp="{0}-{1}-01".format(year, month),
                                                transportation_mode=self.transportation_mode)
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
                co2e_cap=co2e_cap).save()

    def delete(self):
        # Calculate monthly co2
        super(BusinessTrip, self).delete()
        entries = BusinessTrip.objects.filter(working_group=self.working_group,
                                              timestamp__year=self.timestamp.year,
                                              timestamp__month=self.timestamp.month,
                                              transportation_mode=self.transportation_mode)
        print(entries)
        if len(entries) == 0:
            co2e = 0
            co2e_cap = 0
            distance = 0
        else:
            metrics = {
                "co2e": Sum("co2e"),
                "distance": Sum("distance")
            }
            group_data = entries.aggregate(**metrics)
            co2e = group_data["co2e"]
            distance = group_data["distance"]
            co2e_cap =  co2e / self.working_group.n_employees

        try:
            obj = BusinessTripGroup.objects.get(working_group=self.working_group,
                                                timestamp="{0}-{1}-01".format(self.timestamp.year,
                                                                              self.timestamp.month),
                                                transportation_mode=self.transportation_mode)
            obj.n_employees = self.working_group.n_employees
            obj.distance = distance
            obj.co2e = co2e
            obj.co2e_cap = co2e_cap
            obj.save()
        except BusinessTripGroup.DoesNotExist:
            BusinessTripGroup(
                working_group=self.working_group,
                timestamp="{0}-{1}-01".format(self.timestamp.year, self.timestamp.month),
                transportation_mode=self.transportation_mode,
                n_employees=self.working_group.n_employees,
                distance=distance,
                co2e=co2e,
                co2e_cap=co2e_cap).save()


    def __str__(self):
        return f"{self.user.username}, {self.timestamp}"


class Heating(models.Model):
    """
    Heating consumption per year
    """
    working_group = models.ForeignKey(WorkingGroup, on_delete=models.CASCADE)
    consumption = models.FloatField(null=False, validators=[MinValueValidator(0.0)])
    timestamp = models.DateField(null=False)
    building = models.CharField(null=False, max_length=30)
    group_share = models.FloatField(null=False, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)])
    fuel_type_choices = [(x.name, x.value) for x in HeatingFuel]
    fuel_type = models.CharField(max_length=20, choices=fuel_type_choices, blank=False)
    co2e = models.FloatField()
    co2e_cap = models.FloatField()

    class Meta:
        unique_together = ("working_group", "timestamp", "fuel_type", "building")

    def __str__(self):
        return f"{self.working_group.name}, {self.timestamp}, {self.fuel_type}, {self.building}"


class Electricity(models.Model):
    """
    Electricity consumption for a timestamp
    """
    working_group = models.ForeignKey(WorkingGroup, on_delete=models.CASCADE)
    consumption = models.FloatField(null=False)
    timestamp = models.DateField(null=False)
    building = models.CharField(null=False, max_length=30)
    group_share = models.FloatField(null=False, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)])
    fuel_type_choices = [(x.name, x.value) for x in ElectricityFuel]
    fuel_type = models.CharField(max_length=40, choices=fuel_type_choices, blank=False)

    co2e = models.FloatField()
    co2e_cap = models.FloatField()

    class Meta:
        unique_together = ("working_group", "timestamp", "fuel_type", "building")

    def __str__(self):
        return f"{self.working_group.name}, {self.timestamp}, {self.fuel_type}, {self.building}"

