import uuid

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError

from co2calculator.co2calculator import CommutingTransportationMode, HeatingFuel, ElectricityFuel


class User(AbstractUser):
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
    representative = models.ForeignKey(User, on_delete=models.PROTECT, null=True)
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


class Commuting(models.Model):
    """
    CO2 emissions from commuting
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    working_group = models.ForeignKey(WorkingGroup, on_delete=models.CASCADE, null=True)
    from_timestamp = models.DateField(null=False)
    to_timestamp = models.DateField(null=False)
    co2e = models.FloatField()
    co2e_cap = models.FloatField()
    distance = models.FloatField()
    transportation_choices = [(x.name, x.value) for x in CommutingTransportationMode]
    transportation_mode = models.CharField(max_length=15,
                                           choices=transportation_choices,
                                           blank=False,
                                           )

    def __str__(self):
        return f"{self.user.username}, {self.transportation_mode}"


class BusinessTrip(models.Model):
    """
    Business trip
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    working_group = models.ForeignKey(WorkingGroup, on_delete=models.CASCADE, null=True)
    timestamp = models.DateField(null=False)
    distance = models.FloatField()
    co2e = models.FloatField()
    co2e_cap = models.FloatField()

    CAR = 'CAR'
    BUS = 'BUS'
    TRAIN = 'TRAIN'
    PLANE = 'PLANE'
    transportation_choices = [(CAR, "Car"),
                              (BUS, "Bus"),
                              (TRAIN, "Train"),
                              (PLANE, "Plane")]
    transportation_mode = models.CharField(max_length=10,
                                           choices=transportation_choices,
                                           blank=False,
                                           )

    def __str__(self):
        return f"{self.user.username}, {self.timestamp}"


class Heating(models.Model):
    """
    Heating consumption per year
    """
    working_group = models.ForeignKey(WorkingGroup, on_delete=models.CASCADE)
    consumption_kwh = models.FloatField(null=False)
    timestamp = models.DateField(null=False)

    PUMPAIR = 'pump air'
    PUMPGROUND = 'pump ground'
    PUMPWATER = 'pump water'
    LIQUID = 'liquid'
    OIL = 'oil'
    PELLETS = 'pellets'
    SOLAR = 'solar'
    WOODCHIPS = 'woodchips'
    ELECTRICITY = 'electricity'
    GAS = 'gas'
    fuel_type_choices = [(x.name, x.value) for x in HeatingFuel]
    fuel_type = models.CharField(max_length=20, choices=fuel_type_choices, blank=False)
    co2e = models.FloatField()
    co2e_cap = models.FloatField()

    class Meta:
        unique_together = ("working_group", "timestamp", "fuel_type")

    def __str__(self):
        return f"{self.working_group.name}, {self.timestamp}"


class Electricity(models.Model):
    """
    Electricity consumption for a timestamp
    """
    working_group = models.ForeignKey(WorkingGroup, on_delete=models.CASCADE)
    consumption_kwh = models.FloatField(null=False)
    timestamp = models.DateField(null=False)

    GERMAN_ELECTRICITY_MIX = 'german energy mix' # must be same as in data of co2calculator
    #GREEN_ENERGY = 'GREEN_ENERGY'
    SOLAR = 'solar'
    fuel_type_choices = [(x.name, x.value) for x in ElectricityFuel]
    fuel_type = models.CharField(max_length=30, choices=fuel_type_choices, blank=False)

    co2e = models.FloatField()
    co2e_cap = models.FloatField()

    class Meta:
        unique_together = ("working_group", "timestamp", "fuel_type")

    def __str__(self):
        return f"{self.working_group.name}, {self.timestamp}"

