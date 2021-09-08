from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import Group
from django.core.exceptions import ValidationError

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



class BusinessTrip(models.Model):
    """
    Business trip
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    working_group = models.ForeignKey(WorkingGroup, on_delete=models.CASCADE)
    timestamp = models.DateField()
    distance = models.FloatField()
    co2e = models.DecimalField(max_digits=10, decimal_places=1)

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

    PUMPAIR = 'PUMPAIR'
    PUMPGROUND = 'PUMPGROUND'
    PUMPWATER = 'PUMPWATER'
    LIQUID = 'LIQUID'
    OIL = 'OIL'
    PELLETS = 'PELLETS'
    SOLAR = 'SOLAR'
    WOODCHIPS = 'WOODCHIPS'
    ELECTRICITY = 'ELECTRICITY'
    GAS = 'GAS'
    fuel_type_choices = [(PUMPAIR, 'Pump air'), (PUMPGROUND, 'Pump ground'), (PUMPWATER, 'Pump water'),
                         (LIQUID, 'Liquid'), (OIL, 'Oil'), (PELLETS, 'Pellets'), (SOLAR, 'Solar'),
                         (WOODCHIPS, 'Woodchips'),
                         (ELECTRICITY, 'Electricity'), (GAS, 'Gas')]
    fuel_type = models.CharField(max_length=20, choices=fuel_type_choices, blank=False)
    co2e = models.DecimalField(max_digits=10, decimal_places=1)

    def __str__(self):
        return f"{self.working_group.name}, {self.timestamp}"


class Electricity(models.Model):
    """
    Electricity consumption per year
    """
    working_group = models.ForeignKey(WorkingGroup, on_delete=models.CASCADE)
    consumption_kwh = models.FloatField(null=False)
    timestamp = models.DateField(null=False)

    GERMAN_ELECTRICITY_MIX = 'german energy mix' # must be same as in data of co2calculator
    #GREEN_ENERGY = 'GREEN_ENERGY'
    SOLAR = 'solar'
    fuel_type_choices = [(GERMAN_ELECTRICITY_MIX, 'German Energy Mix'),
                         #(GREEN_ENERGY, 'Green energy'),
                         (SOLAR, 'Solar')]
    fuel_type = models.CharField(max_length=30, choices=fuel_type_choices, blank=False)

    co2e = models.DecimalField(max_digits=10, decimal_places=1)

    def __str__(self):
        return f"{self.working_group.name}, {self.timestamp}"


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
    fuel_type_choices = [(PUMPAIR, 'Pump air'), (PUMPGROUND, 'Pump ground'), (PUMPWATER, 'Pump water'),
                         (LIQUID, 'Liquid'), (OIL, 'Oil'), (PELLETS, 'Pellets'), (SOLAR, 'Solar'),
                         (WOODCHIPS, 'Woodchips'),
                         (ELECTRICITY, 'Electricity'), (GAS, 'Gas')]
    fuel_type = models.CharField(max_length=20, choices=fuel_type_choices, blank=False)
    co2e = models.FloatField()

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
    fuel_type_choices = [(GERMAN_ELECTRICITY_MIX, 'German Energy Mix'),
                         #(GREEN_ENERGY, 'Green energy'),
                         (SOLAR, 'Solar')]
    fuel_type = models.CharField(max_length=30, choices=fuel_type_choices, blank=False)

    co2e = models.FloatField()

    class Meta:
        unique_together = ("working_group", "timestamp", "fuel_type")


    def __str__(self):
        return f"{self.working_group.name}, {self.timestamp}"

'''
class CarTrip(models.Model):
    """
    Additional data for business trips by car
    """
    passengers = models.IntegerField()

    ELECTRIC = 'ELECTRIC'
    NATURAL = 'NATURAL'
    GAS = 'GAS'
    GASOLINE = 'GASOLINE'
    DIESEL = 'DIESEL'
    UNKNOWN = 'UNKNOWN'
    fuel_type_choices = [(ELECTRIC, "Electric"),
                         (NATURAL, "Natural"),
                         (GAS, "Gas"),
                         (GASOLINE, "Gasoline"),
                         (DIESEL, 'Diesel'),
                         (UNKNOWN, 'Unknown')]

    fuel_type = models.CharField(max_length=10, choices=fuel_type_choices, default=UNKNOWN, blank=False)

    SMALL = 'SMALL'
    MEDIUM = 'MEDIUM'
    LARGE = 'LARGE'
    UNKNOWN = 'UNKNOWN'
    size_choices = [(SMALL, "Small"),
                    (MEDIUM, "Medium"),
                    (LARGE, "Large"),
                    (UNKNOWN, 'Unknown')]

    size = models.CharField(max_length=10, choices=size_choices, default=UNKNOWN, blank=False)

    business_trip = models.ForeignKey(BusinessTrip, on_delete=models.CASCADE, blank=False)

    def __str__(self):
        return self.id
'''


'''
class BusTrip(models.Model):
    """
    Additional data for business trips by bus
    """
    capacity = models.FloatField(null=True)
    occupancy = models.IntegerField(null=True)

    ELECTRIC = 'ELECTRIC'
    NATURAL = 'NATURAL'
    GAS = 'GAS'
    GASOLINE = 'GASOLINE'
    DIESEL = 'DIESEL'
    UNKNOWN = 'UNKNOWN'
    fuel_type_choices = [(ELECTRIC, "Electric"),
                         (NATURAL, "Natural"),
                         (GAS, "Gas"),
                         (GASOLINE, "Gasoline"),
                         (DIESEL, 'Diesel'),
                         (UNKNOWN, 'Unknown')]
    fuel_type = models.CharField(max_length=10, choices=fuel_type_choices, default=UNKNOWN, blank=False)

    SMALL = 'SMALL'
    MEDIUM = 'MEDIUM'
    LARGE = 'LARGE'
    UNKNOWN = 'UNKNOWN'
    size_choices = [(SMALL, "Small"),
                    (MEDIUM, "Medium"),
                    (LARGE, "Large"),
                    (UNKNOWN, 'Unknown')]
    size = models.CharField(max_length=10, choices=size_choices, default=UNKNOWN, blank=False)

    business_trip = models.ForeignKey(BusinessTrip, on_delete=models.CASCADE, blank=False)
'''


'''
class TrainTrip(models.Model):
    """
    Additional data for business trips by train
    """
    ELECTRIC = 'ELECTRIC'
    DIESEL = 'DIESEL'
    UNKNOWN = 'UNKNOWN'
    fuel_type_choices = [(ELECTRIC, "Electric"),
                         (DIESEL, 'Diesel'),
                         (UNKNOWN, 'Unknown')]
    fuel_type = models.CharField(max_length=10, choices=fuel_type_choices, default=UNKNOWN, blank=False)

    business_trip = models.ForeignKey(BusinessTrip, on_delete=models.CASCADE, blank=False)
'''


'''
class PlaneTrip(models.Model):
    """
    Additional data for business trips by plane
    """
    IATA_start = models.CharField(max_length=3)
    IATA_destination = models.CharField(max_length=3)
    ECONOMY = 'ECONOMY'
    BUSINESS = 'BUSINESS'
    FIRST = 'FIRST'
    UNKNOWN = 'UNKNOWN'
    flight_class_choices = [(ECONOMY, "Economy"),
                            (BUSINESS, "Business"),
                            (FIRST, 'First Class'),
                            (UNKNOWN, 'Unknown')]

    flight_class = models.CharField(max_length=15, choices=flight_class_choices, default=UNKNOWN, blank=False)
    round_trip = models.BooleanField(default=True)

    business_trip = models.ForeignKey(BusinessTrip, on_delete=models.CASCADE, blank=False)

    def __str__(self):
        return "{} - {} on {}".format(self.IATA_start, self.IATA_destination, str(self.business_trip.timestamp))
'''

