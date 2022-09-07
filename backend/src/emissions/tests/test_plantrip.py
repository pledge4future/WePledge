#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""__description__"""

__author__ = "Christina Ludwig, GIScience Research Group, Heidelberg University"
__email__ = "christina.ludwig@uni-heidelberg.de"


import pytest
import requests
from dotenv import load_dotenv
import os
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
logger.addHandler(logging.StreamHandler())

# Load settings from ./.env file
load_dotenv("../../../../.env")
GRAPHQL_URL = os.environ.get("GRAPHQL_URL")
logger.info(GRAPHQL_URL)

# See pytest parameterization: https://docs.pytest.org/en/7.1.x/example/parametrize.html#different-options-for-test-ids
# Todo: add all combinations of parameters. Should be possible to do this automatially by defining all options
#  in separate lists and then combine them using some python function
test_data = [
    ("Car", "Medium", "gasoline", True),
    ("Car", "Large", "gasoline", True)
]


@pytest.mark.parametrize("transportation_mode, size, fueltype, expected", test_data)
def test_plan_trip(transportation_mode, size, fueltype, expected):
    """Test whether trip planner throws error for different parameter combinations"""
    query = """
        mutation planTrip ($transportationMode: String!, $size: String!, $fueltype: String!) {
            planTrip (input: {
              transportationMode: $transportationMode
              distance: 200
              size: $size
              fuelType: $fueltype
              passengers: 1
              roundtrip: false
            }) {
                success
                message
                co2e
            }
        }
    """
    headers = {
        "Content-Type": "application/json",
    }
    variables = {"transportationMode": transportation_mode, "size": size, "fueltype": fueltype }
    response = requests.post(GRAPHQL_URL, json={"query": query, "variables": variables}, headers=headers)
    logger.warning(response.content)
    assert response.status_code == 200
    data = response.json()
    logger.warning(data)
    assert data["data"]["planTrip"]["success"] == expected

