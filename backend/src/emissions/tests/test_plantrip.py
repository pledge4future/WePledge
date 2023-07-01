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

@pytest.mark.parametrize('transportation_mode', ['Car'])
@pytest.mark.parametrize('size', ['small', 'medium', 'large', 'average'])
@pytest.mark.parametrize('fuel_type', ['diesel', 'gasoline', 'cng', 'electric', 'hybrid', 'plug-in_hybrid', 'average'])
@pytest.mark.parametrize('passengers', [1])
@pytest.mark.parametrize('round_trip', [False])
def test_plan_trip_car(transportation_mode, size, fuel_type, passengers, round_trip):
    """Test whether trip planner throws error for different parameter combinations for car trips"""
    query = """
        mutation planTrip ($transportationMode: String!, $size: String!, $fuelType: String!, $passengers: Int!, $roundTrip: Boolean!) {
            planTrip (input: {
                transportationMode: $transportationMode
                distance: 200
                size: $size
                fuelType: $fuelType
                passengers: $passengers
                roundtrip: $roundTrip
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
    variables = {"transportationMode": transportation_mode, "size": size, "fuelType": fuel_type, "passengers": passengers, "roundTrip": round_trip}
    response = requests.post(GRAPHQL_URL, json={"query": query, "variables": variables}, headers=headers)
    logger.warning(response.content)
    assert response.status_code == 200
    data = response.json()
    logger.warning(data)
    assert data["data"]["planTrip"]["success"]

@pytest.mark.parametrize('transportation_mode', ['Bus'])
@pytest.mark.parametrize('size', ['medium', 'large', 'average'])
@pytest.mark.parametrize('fuel_type', ['diesel'])
@pytest.mark.parametrize('occupancy', [20., 50., 80., 100.])
@pytest.mark.parametrize('roundtrip', [True, False])
def test_plan_trip_bus(transportation_mode, size, fuel_type, occupancy, roundtrip):
    """Test whether trip planner throws error for different parameter combinations for bus trips"""
    query = """
        mutation planTrip ($transportationMode: String!, $size: String!, $fuelType: String!, $occupancy: Float!, 
        $roundtrip: Boolean!) {
            planTrip (input: {
                transportationMode: $transportationMode
                size: $size
                fuelType: $fuelType
                occupancy: $occupancy
                roundtrip: $roundtrip
                distance: 200.0
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
    variables = {"transportationMode": transportation_mode, "size": size, "fuelType": fuel_type,
                 "occupancy": occupancy, "roundtrip": roundtrip}
    response = requests.post(GRAPHQL_URL, json={"query": query, "variables": variables}, headers=headers)
    logger.warning(response.content)
    assert response.status_code == 200
    data = response.json()
    logger.warning(data)
    assert data["data"]["planTrip"]["success"]


@pytest.mark.parametrize('transportation_mode', ['Train'])
@pytest.mark.parametrize('fuel_type', ['diesel', 'electric', 'average'])
@pytest.mark.parametrize('roundtrip', [True, False])
def test_plan_trip_train(transportation_mode, fuel_type, roundtrip):
    """Test whether trip planner throws error for different parameter combinations for train trips"""
    query = """
        mutation planTrip ($transportationMode: String!, $fuelType: String!, $roundtrip: Boolean!) {
            planTrip (input: {
                transportationMode: $transportationMode
                fuelType: $fuelType
                roundtrip: $roundtrip
                distance: 200
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
    variables = {"transportationMode": transportation_mode, "fuelType": fuel_type, "roundtrip": roundtrip}
    response = requests.post(GRAPHQL_URL, json={"query": query, "variables": variables}, headers=headers)
    logger.warning(response.content)
    assert response.status_code == 200
    data = response.json()
    logger.warning(data)
    assert data["data"]["planTrip"]["success"]


@pytest.mark.parametrize('transportation_mode', ['Plane'])
@pytest.mark.parametrize('seating_class', ['average', 'Economy class', 'Premium economy class', 'Business class', 'First class'])
@pytest.mark.parametrize('roundtrip', [True, False])
def test_plan_trip_plane(transportation_mode, seating_class, roundtrip):
    """Test whether trip planner throws error for different parameter combinations for plane trips"""
    query = """
        mutation planTrip ($transportationMode: String!, $seatingClass: String!, $roundtrip: Boolean!) {
            planTrip (input: {
                transportationMode: $transportationMode
                seatingClass: $seatingClass
                roundtrip: $roundtrip
                distance: 500
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
    variables = {"transportationMode": transportation_mode, "seatingClass": seating_class, "roundtrip": roundtrip}
    response = requests.post(GRAPHQL_URL, json={"query": query, "variables": variables}, headers=headers)
    logger.warning(response.content)
    assert response.status_code == 200
    data = response.json()
    logger.warning(data)
    assert data["data"]["planTrip"]["success"]


@pytest.mark.parametrize('transportation_mode', ['Ferry'])
@pytest.mark.parametrize('seating_class', ['average', 'Foot passenger', 'Car passenger'])
@pytest.mark.parametrize('roundtrip', [True, False])
def test_plan_trip_ferry(transportation_mode, seating_class, roundtrip):
    """Test whether trip planner throws error for different parameter combinations for ferry trips"""
    query = """
        mutation planTrip ($transportationMode: String!, $seatingClass: String!, $roundtrip: Boolean!) {
            planTrip (input: {
                transportationMode: $transportationMode
                seatingClass: $seatingClass
                roundtrip: $roundtrip
                distance: 200
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
    variables = {"transportationMode": transportation_mode, "seatingClass": seating_class, "roundtrip": roundtrip}
    response = requests.post(GRAPHQL_URL, json={"query": query, "variables": variables}, headers=headers)
    logger.warning(response.content)
    assert response.status_code == 200
    data = response.json()
    logger.warning(data)
    assert data["data"]["planTrip"]["success"]