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

logger = logging.basicConfig()


script_path = os.path.dirname(os.path.realpath(__file__))



class Command(BaseCommand):
    def __init__(self, *args, **kwargs):
        super(Command, self).__init__(*args, **kwargs)

    help = 'Seeds the database.'

    def handle(self, *args, **options):

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
                             email=f"{usr[1].first_name}.{usr[1].last_name}@some-university.com",
                             password="super")
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
                                        representative=User.objects.get(username="LarsWiese"))
            wg_environmental.save()
        else:
            wg_environmental = environmental_search[0]

        biomed_search = WorkingGroup.objects.filter(name="Biomedical Research Group")
        if len(biomed_search) == 0:
            wg_biomed = WorkingGroup(name="Biomedical Research Group",
                                  institution=Institution.objects.filter(name="Heidelberg University",
                                                                         city="Heidelberg",
                                                                         country="Germany")[0],
                                  representative=User.objects.get(username="KarenAnderson"))
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

        # CREATE ELECTRICITY OBJECTS --------------------------------------------------------
        if len(Electricity.objects.all()) == 0:
            consumptions = np.random.uniform(low=8000, high=12000, size=24).astype("int")
            dates = np.arange(np.datetime64('2019-01'), np.datetime64('2021-01'), np.timedelta64(1, "M")).astype('datetime64[D]')
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
            consumptions = np.random.uniform(low=1400000, high=2200000, size=24).astype("int")
            dates = np.arange(np.datetime64('2019-01'), np.datetime64('2021-01'), np.timedelta64(1, "M")).astype('datetime64[D]')
            for c, d in zip(consumptions, dates):
                new_heating = Heating(working_group=wg_biomed,
                                      timestamp=str(d),
                                      consumption_kwh=c,
                                      fuel_type=Heating.PUMPWATER,
                                      co2e=calc_co2_heating(c, "heatpump_water"))
                new_heating.save()

        # CREATE BUSINESS TRIPS --------------------------------------------------------

        new_trip = BusinessTrip(user=User.objects.get(username="KarenAnderson"),
                                distance=3000,
                                co2e=200,
                                timestamp="2020-05-10",
                                transportation_mode=BusinessTrip.PLANE)
        new_trip.save()

        new_trip = BusinessTrip(user=User.objects.get(username="KarenAnderson"),
                                    distance=300,
                                    co2e= 50,
                                    timestamp="2020-02-01",
                                    transportation_mode=BusinessTrip.TRAIN)
        new_trip.save()