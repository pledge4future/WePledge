#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""Polulate database with dummy data"""

from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group
from django.db.models import Sum
from django.db.utils import IntegrityError
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
    calc_co2_businesstrip,
)

import numpy as np
import pandas as pd
import os
import logging
from django.contrib.auth.management.commands import createsuperuser
from co2calculator.co2calculator.constants import (
    TransportationMode,
    HeatingFuel,
    ElectricityFuel,
)
from dotenv import load_dotenv, find_dotenv

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

        # LOAD INSTITUTIONS - GERMAN ONLY RIGHT NOW --------------------------------------------------------
        print("Loading institutions ...")
        grid = pd.read_csv(f"{script_path}/../../data/grid.csv")
        grid = grid.loc[grid.Country == "Germany"]
        for inst in grid.iterrows():
            try:
                new_institution = Institution(
                    name=inst[1].Name,
                    city=inst[1].City,
                    state=inst[1].State,
                    country=inst[1].Country,
                )
                new_institution.save()
            except IntegrityError:
                print("Institutions already loaded.")
                break
        del grid
