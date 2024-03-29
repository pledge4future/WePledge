#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""Polulate database with dummy data"""

from django.core.management.base import BaseCommand
from django.db.models import Sum
from django.db.utils import IntegrityError

import numpy as np
import pandas as pd
import os
import logging

from emissions.models import (
    CustomUser,
    WorkingGroup,
    BusinessTrip,
    Heating,
    Electricity,
    Institution,
    Commuting,
    CommutingGroup,
    ResearchField,
)

from co2calculator.co2calculator.calculate import (
    calc_co2_heating,
    calc_co2_electricity,
    calc_co2_commuting,
)

from co2calculator.co2calculator.constants import (
    TransportationMode,
    HeatingFuel,
    ElectricityFuel,
)

# Load settings from ./.env file
#load_dotenv(find_dotenv())

logger = logging.basicConfig()

script_path = os.path.dirname(os.path.realpath(__file__))


class Command(BaseCommand):
    """Base Command to populate data"""

    def __init__(self, *args, **kwargs):
        """Init class"""
        super(Command, self).__init__(*args, **kwargs)

    help = "Seeds the database."

    def handle(self, *args, **options):
        """Populate database"""

        # CREATE USERS --------------------------------------------------------
        print("Loading users ...")
        user_data = pd.read_csv(f"{script_path}/../../data/users.csv")
        for usr in user_data.iterrows():
            try:
                new_user = CustomUser(
                    first_name=usr[1].first_name,
                    last_name=usr[1].last_name,
                    email=f"{usr[1].first_name}.{usr[1].last_name}@uni-hd.de",
                )
                new_user.set_password("test_password")
                new_user.save()
                status = new_user.status
                setattr(status, "verified", True)
                status.save(update_fields=["verified"])
                new_user.save()
            except IntegrityError:
                print("Users already exist.")
                break

        # CREATE WORKING GROUPS --------------------------------------------------------
        environmental_search = WorkingGroup.objects.filter(
            name="Environmental Research Group"
        )
        if len(environmental_search) == 0:
            wg_environmental = WorkingGroup(
                name="Environmental Research Group",
                institution=Institution.objects.filter(
                    name="Heidelberg University", city="Heidelberg", country="Germany"
                )[0],
                representative=CustomUser.objects.get(email="Lars.Wiese@uni-hd.de"),
                n_employees=20,
                field=ResearchField.objects.filter(
                    field="Natural Sciences",
                    subfield="Earth and related environmental sciences",
                )[0],
                is_public=True
            )
            wg_environmental.save()

        else:
            wg_environmental = environmental_search[0]

        biomed_search = WorkingGroup.objects.filter(name="Biomedical Research Group")
        if len(biomed_search) == 0:
            testuser_representative = CustomUser.objects.get(email="test3@pledge4future.org")
            wg_biomed = WorkingGroup(
                name="Biomedical Research Group",
                institution=Institution.objects.filter(
                    name="Heidelberg University", city="Heidelberg", country="Germany"
                )[0],
                representative=testuser_representative,
                n_employees=15,
                field=ResearchField.objects.filter(
                    field="Natural Sciences", subfield="Biological sciences"
                )[0],
            )
            wg_biomed.save()
            testuser_representative.is_representative = True
            testuser_representative.working_group = wg_biomed
            testuser_representative.save()
        else:
            wg_biomed = biomed_search[0]

        # Update working groups of users
        for usr in user_data.iterrows():
            user_found = CustomUser.objects.filter(
                first_name=usr[1].first_name, last_name=usr[1].last_name
            )[0]
            wg_search = WorkingGroup.objects.filter(name=usr[1].working_group)
            user_found.working_group = wg_search[0]
            user_found.save()
        del user_data

        # CREATE FAKE DATA
        dates = np.arange(
            np.datetime64("2019-01"), np.datetime64("2021-01"), np.timedelta64(1, "M")
        ).astype("datetime64[D]")

        # CREATE ELECTRICITY OBJECTS --------------------------------------------------------
        if len(Electricity.objects.all()) == 0:
            print("Loading electricity data ...")
            consumptions = np.random.uniform(low=8000, high=12000, size=24).astype(
                "int"
            )
            for c, d in zip(consumptions, dates):
                co2e = calc_co2_electricity(c, "german_energy_mix")
                co2e_cap = co2e / wg_biomed.n_employees
                new_electricity = Electricity(
                    working_group=wg_biomed,
                    timestamp=str(d),
                    consumption=c,
                    fuel_type=ElectricityFuel.GERMAN_ENERGY_MIX.name.lower(),
                    building="348",
                    group_share=1,
                    co2e=co2e,
                    co2e_cap=co2e_cap,
                )
                new_electricity.save()

            consumptions = np.random.uniform(low=11000, high=15000, size=24).astype(
                "int"
            )
            for c, d in zip(consumptions, dates):
                co2e = calc_co2_electricity(
                    consumption=c, fuel_type="german_energy_mix"
                )
                co2e_cap = co2e / wg_environmental.n_employees
                new_electricity = Electricity(
                    working_group=wg_environmental,
                    timestamp=str(d),
                    consumption=c,
                    fuel_type=ElectricityFuel.GERMAN_ENERGY_MIX.name.lower(),
                    building="348",
                    group_share=1,
                    co2e=co2e,
                    co2e_cap=co2e_cap,
                )
                new_electricity.save()

        # CREATE HEATING OBJECTS --------------------------------------------------------
        if len(Heating.objects.all()) == 0:
            print("Loading heating data ...")

            consumptions = np.random.uniform(low=1400, high=2200, size=24).astype("int")
            for c, d in zip(consumptions, dates):
                co2e = calc_co2_heating(
                    consumption=c, unit="l", fuel_type="oil", area_share=1
                )
                co2e_cap = co2e / wg_biomed.n_employees
                new_heating = Heating(
                    working_group=wg_biomed,
                    timestamp=str(d),
                    consumption=c,
                    fuel_type=HeatingFuel.OIL.name.lower(),
                    building="348",
                    group_share=1,
                    co2e=co2e,
                    co2e_cap=co2e_cap,
                )
                new_heating.save()

            consumptions = np.random.uniform(low=1000, high=1500, size=24).astype("int")
            for c, d in zip(consumptions, dates):
                co2e = calc_co2_heating(
                    consumption=c, unit="l", fuel_type="oil", area_share=1
                )
                co2e_cap = co2e / wg_environmental.n_employees
                new_heating = Heating(
                    working_group=wg_environmental,
                    timestamp=str(d),
                    consumption=c,
                    fuel_type=HeatingFuel.OIL.name.lower(),
                    building="348",
                    group_share=1,
                    co2e=co2e,
                    co2e_cap=co2e_cap,
                )
                new_heating.save()

        # CREATE BUSINESS TRIPS --------------------------------------------------------
        if len(BusinessTrip.objects.all()) == 0:
            print("Loading business trip data ...")

            modes = [
                TransportationMode.PLANE,
                TransportationMode.CAR,
                TransportationMode.TRAIN,
                TransportationMode.BUS,
            ]

            dates = np.arange(
                np.datetime64("2019-01-15"),
                np.datetime64("2021-01-15"),
                np.timedelta64(30, "D"),
            ).astype("datetime64[D]")

            for usr in CustomUser.objects.all():
                # if usr.working_group is None:
                #    continue

                for d in dates:
                    co2e = co2e_cap = float(np.random.randint(50, 1000, 1))
                    new_trip = BusinessTrip(
                        user=usr,
                        working_group=usr.working_group,
                        distance=np.random.randint(100, 10000, 1),
                        co2e=co2e,
                        timestamp=str(d),
                        transportation_mode=np.random.choice(modes, 1),
                    )
                    new_trip.save()

        if len(Commuting.objects.all()) == 0:

            print("Loading commuting data ...")
            workweeks = 40
            WEEKS_PER_MONTH = 4.34524
            WEEKS_PER_YEAR = 52.1429

            dates_2019 = np.arange(
                np.datetime64("2019-01", "M"),
                np.datetime64("2020-01", "M"),
                np.timedelta64(1, "M"),
            ).astype("datetime64[D]")
            dates_2020 = np.arange(
                np.datetime64("2020-01", "M"),
                np.datetime64("2021-01", "M"),
                np.timedelta64(1, "M"),
            ).astype("datetime64[D]")
            #print(dates_2019)

            for usr in CustomUser.objects.all():
                if usr.is_superuser:
                    continue

                distance = np.random.randint(0, 20, 1)
                transportation_mode = "bicycle"

                for d_2019 in range(len(dates_2019) - 1):
                    timestamp = dates_2019[d_2019]

                    # calculate co2
                    weekly_co2e = calc_co2_commuting(
                        transportation_mode=transportation_mode,
                        weekly_distance=distance,
                    )
                    # Calculate monthly co2
                    monthly_co2e = (
                        WEEKS_PER_MONTH * (workweeks / WEEKS_PER_YEAR) * weekly_co2e
                    )

                    commuting_instance = Commuting(
                        timestamp=str(timestamp),
                        distance=distance,
                        transportation_mode=transportation_mode,
                        co2e=monthly_co2e,
                        user=usr,
                        working_group=usr.working_group,
                    )
                    commuting_instance.save()

                    if usr.working_group is None:
                        continue

                    # Update emissions of working group for date and transportation mode
                    entries = Commuting.objects.filter(
                        working_group=usr.working_group,
                        transportation_mode=transportation_mode,
                        timestamp=str(timestamp),
                    )
                    metrics = {"co2e": Sum("co2e"), "distance": Sum("distance")}
                    group_data = entries.aggregate(**metrics)

                    co2e_cap = group_data["co2e"] / usr.working_group.n_employees
                    commuting_group_instance = CommutingGroup(
                        working_group=usr.working_group,
                        timestamp=str(timestamp),
                        transportation_mode=transportation_mode,
                        n_employees=usr.working_group.n_employees,
                        co2e=group_data["co2e"],
                        co2e_cap=co2e_cap,
                        distance=group_data["distance"],
                    )
                    commuting_group_instance.save()

                transportation_mode = "car"
                for d_2020 in range(len(dates_2020) - 1):
                    timestamp = dates_2020[d_2020]
                    # to_timestamp = dates_2020[d_2020 + 1]

                    # calculate co2
                    weekly_co2e = calc_co2_commuting(
                        transportation_mode=transportation_mode,
                        weekly_distance=distance,
                        passengers=1,
                        size="medium",
                        fuel_type="gasoline",
                    )

                    # Calculate monthly co2
                    monthly_co2e = (
                        WEEKS_PER_MONTH * (workweeks / WEEKS_PER_YEAR) * weekly_co2e
                    )

                    commuting_instance = Commuting(
                        timestamp=str(timestamp),
                        distance=distance,
                        transportation_mode=transportation_mode,
                        co2e=monthly_co2e,
                        user=usr,
                        working_group=usr.working_group,
                    )
                    commuting_instance.save()

                    if usr.working_group is None:
                        continue

                    # Update emissions of working group for date and transportation mode
                    entries = Commuting.objects.filter(
                        working_group=usr.working_group,
                        transportation_mode=transportation_mode,
                        timestamp=str(timestamp),
                    )
                    metrics = {"co2e": Sum("co2e"), "distance": Sum("distance")}
                    group_data = entries.aggregate(**metrics)

                    co2e_cap = group_data["co2e"] / usr.working_group.n_employees
                    commuting_group_instance = CommutingGroup(
                        working_group=usr.working_group,
                        timestamp=str(timestamp),
                        transportation_mode=transportation_mode,
                        n_employees=usr.working_group.n_employees,
                        co2e=group_data["co2e"],
                        co2e_cap=co2e_cap,
                        distance=group_data["distance"],
                    )
                    commuting_group_instance.save()
