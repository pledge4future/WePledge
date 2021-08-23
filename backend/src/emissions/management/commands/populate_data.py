"""
Create permission groups
Create permissions (read only) to models for a set of groups
"""

from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group
from django.db.utils import IntegrityError
from emissions.models import User, WorkingGroup, BusinessTrip, Heating, Electricity, Institution
from co2calculator.co2calculator import calc_co2_heating, calc_co2_electricity
import numpy as np
import pandas as pd
import os
import logging
from django.contrib.auth.management.commands import createsuperuser

logger = logging.basicConfig()


script_path = os.path.dirname(os.path.realpath(__file__))



class Command(BaseCommand):
    def __init__(self, *args, **kwargs):
        super(Command, self).__init__(*args, **kwargs)

    help = 'Seeds the database.'

    def handle(self, *args, **options):

        # Create super user
        User.objects.create_superuser("admin", 'admin@admin.com', 'adminpass')

        # LOAD INSTITUTIONS - GERMAN ONLY RIGHT NOW --------------------------------------------------------
        print("Loading institutions ...")
        grid = pd.read_csv(f"{script_path}/../../data/grid.csv")
        grid = grid.loc[grid.Country == "Germany"]
        for inst in grid.iterrows():
            try:
                new_institution = Institution(name=inst[1].Name,
                                              city=inst[1].City,
                                              state=inst[1].State,
                                              country=inst[1].Country)
                new_institution.save()
            except IntegrityError:
                print("Institutions already loaded.")
                break
        del grid

        # CREATE USERS --------------------------------------------------------
        print("Loading users ...")
        user_data = pd.read_csv(f"{script_path}/../../data/users.csv")
        for usr in user_data.iterrows():
            try:
                new_user = User(username=usr[1].first_name + usr[1].last_name,
                             first_name=usr[1].first_name,
                             last_name=usr[1].last_name,
                             email=f"{usr[1].first_name}.{usr[1].last_name}@uni-hd.de",
                             password="password1234")
                new_user.save()
            except IntegrityError:
                print("Users already exist.")
                break

        # CREATE WORKING GROUPS --------------------------------------------------------
        environmental_search = WorkingGroup.objects.filter(name="Environmental Research Group")
        if len(environmental_search) == 0:
            wg_environmental = WorkingGroup(name="Environmental Research Group",
                                        institution=Institution.objects.filter(name="Heidelberg University",
                                                                               city="Heidelberg",
                                                                               country="Germany")[0],
                                        representative=User.objects.get(username="LarsWiese"),
                                            n_employees=20)
            wg_environmental.save()
        else:
            wg_environmental = environmental_search[0]

        biomed_search = WorkingGroup.objects.filter(name="Biomedical Research Group")
        if len(biomed_search) == 0:
            wg_biomed = WorkingGroup(name="Biomedical Research Group",
                                  institution=Institution.objects.filter(name="Heidelberg University",
                                                                         city="Heidelberg",
                                                                         country="Germany")[0],
                                  representative=User.objects.get(username="KarenAnderson"),
                                     n_employees=15)
            wg_biomed.save()
        else:
            wg_biomed = biomed_search[0]

        # Update working groups of users
        for usr in user_data.iterrows():
            user_found = User.objects.filter(username=usr[1].first_name + usr[1].last_name)[0]
            wg_search = WorkingGroup.objects.filter(name=usr[1].working_group)
            user_found.working_group = wg_search[0]
            user_found.save()
        del user_data

        # CREATE FAKE DATA
        dates = np.arange(np.datetime64('2019-01'), np.datetime64('2021-01'), np.timedelta64(1, "M")).astype(
            'datetime64[D]')

        # CREATE ELECTRICITY OBJECTS --------------------------------------------------------
        if len(Electricity.objects.all()) == 0:
            print("Loading electricity data ...")
            consumptions = np.random.uniform(low=8000, high=12000, size=24).astype("int")
            for c, d in zip(consumptions, dates):
                new_electricity = Electricity(working_group=wg_biomed,
                                      timestamp=str(d),
                                      consumption_kwh=c,
                                      fuel_type=Electricity.GERMAN_ELECTRICITY_MIX,
                                      co2e=calc_co2_electricity(c, "german energy mix"))
                new_electricity.save()

            consumptions = np.random.uniform(low=11000, high=15000, size=24).astype("int")
            for c, d in zip(consumptions, dates):
                new_electricity = Electricity(working_group= wg_environmental,
                                      timestamp=str(d),
                                      consumption_kwh=c,
                                      fuel_type=Electricity.GERMAN_ELECTRICITY_MIX,
                                      co2e=calc_co2_electricity(c, "german energy mix"))
                new_electricity.save()

        # CREATE HEATING OBJECTS --------------------------------------------------------
        if len(Heating.objects.all()) == 0:
            print("Loading heating data ...")

            consumptions = np.random.uniform(low=1400, high=2200, size=24).astype("int")
            for c, d in zip(consumptions, dates):
                new_heating = Heating(working_group=wg_biomed,
                                      timestamp=str(d),
                                      consumption_kwh=c,
                                      fuel_type=Heating.PUMPWATER,
                                      co2e=calc_co2_heating(c, "heatpump_water"))
                new_heating.save()

            consumptions = np.random.uniform(low=1000, high=1500, size=24).astype("int")
            for c, d in zip(consumptions, dates):
                new_heating = Heating(working_group=wg_environmental,
                                      timestamp=str(d),
                                      consumption_kwh=c,
                                      fuel_type=Heating.PUMPWATER,
                                      co2e=calc_co2_heating(c, "heatpump_water"))
                new_heating.save()

        # CREATE BUSINESS TRIPS --------------------------------------------------------
        if len(BusinessTrip.objects.all()) == 0:
            print("Loading business trip data ...")

            modes = [BusinessTrip.PLANE, BusinessTrip.CAR, BusinessTrip.TRAIN, BusinessTrip.BUS]

            for usr in User.objects.all():
                dates = np.arange(np.datetime64('2019-01-15'), np.datetime64('2021-01-15'), np.timedelta64(30, "D")).astype('datetime64[D]')

                for d in dates:
                    new_trip = BusinessTrip(user=usr,
                                            working_group=usr.working_group,
                                        distance=np.random.randint(100, 10000, 1),
                                        co2e=float(np.random.randint(50, 1000, 1)),
                                        timestamp=str(d),
                                        transportation_mode=np.random.choice(modes, 1)[0])
                    new_trip.save()
