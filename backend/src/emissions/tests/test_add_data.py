#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""Testing of GraphQL API queries related to adding data by user"""

import requests
import logging
from dotenv import load_dotenv
import os

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
logger.addHandler(logging.StreamHandler())

# Load settings from ./.env file
load_dotenv("../../../../.env")
GRAPHQL_URL = os.environ.get("GRAPHQL_URL")
logger.info(GRAPHQL_URL)


def test_add_electricity_data_not_representative(test_user_token):
    """Add electricity data by authenticated user"""
    query = """
        mutation createElectricity {
          createElectricity (input: {
            timestamp: "2020-10-01"
            consumption: 3000
            fuelType: "solar"
            building: "348"
            groupShare: 1
          }) {
            ok
            electricity {
              timestamp
              consumption
              building
              fuelType
              co2e
            }
          }
        }
    """
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"JWT {test_user_token}",
    }
    response = requests.post(GRAPHQL_URL, json={"query": query}, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert (
        data["errors"][0]["message"]
        == "Electricity data was not added, since you are not the representative of your working group."
    )


def test_add_electricity_data(test_user_representative_token):
    """Add electricity data by authenticated group representative"""
    query = """
        mutation createElectricity {
          createElectricity (input: {
            timestamp: "2020-12-01"
            consumption: 3000
            fuelType: "Solar"
            building: "348"
            groupShare: 1
          }) {
            ok
            electricity {
              timestamp
              consumption
              building
              fuelType
              co2e
            }
          }
        }
    """
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"JWT {test_user_representative_token}",
    }
    response = requests.post(GRAPHQL_URL, json={"query": query}, headers=headers)
    assert response.status_code == 200
    data = response.json()
    logger.warning(data)
    assert data["data"]["createElectricity"]["ok"]
    assert data["data"]["createElectricity"]["electricity"]["consumption"] == 3000.0


def test_add_heating_data(test_user_representative_token):
    """Add heating data by authenticated group representative"""
    query = """
        mutation createHeating{
          createHeating (input: {
            building: "348"
            timestamp: "2022-10-01"
            consumption: 3000
            unit: "l"
            fuelType: "Oil"
            groupShare: 1
          }) {
            ok
            heating {
              timestamp
              consumption
              fuelType
              co2e
            }
          }
        }
    """
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"JWT {test_user_representative_token}",
    }
    response = requests.post(GRAPHQL_URL, json={"query": query}, headers=headers)
    logger.warning(response.content)
    assert response.status_code == 200
    data = response.json()
    # logger.warning(data)
    assert data["data"]["createHeating"]["ok"]
    assert data["data"]["createHeating"]["heating"]["consumption"] == 3000.0


def test_add_businesstrip_data(test_user_token):
    """Add businesstrip data by authenticated user"""
    query = """
        mutation createBusinesstrip {
            createBusinesstrip (input: {
              timestamp: "2020-01-01"
              transportationMode: "Car"
              distance: 200
              size: "Medium"
              fuelType: "Gasoline"
              passengers: 1
              roundtrip: false
            }) {
                ok
                businesstrip {
                    distance
                }
              }
        }
    """
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"JWT {test_user_token}",
    }
    response = requests.post(GRAPHQL_URL, json={"query": query}, headers=headers)
    logger.warning(response.content)
    assert response.status_code == 200
    data = response.json()
    logger.warning(data)
    assert data["data"]["createBusinesstrip"]["ok"]
    assert data["data"]["createBusinesstrip"]["businesstrip"]["distance"] == 200.0


def test_add_commuting_data(test_user_token):
    """Add commuting data by authenticated user"""
    query = """
        mutation createCommuting {
          createCommuting (input: {
            transportationMode: "Car"
            distance: 30
            fromTimestamp: "2017-01-01"
            toTimestamp: "2017-06-01"
            fuelType: "Gasoline"
            size: "Medium"
            passengers: 1
            workweeks: 40
          }) {
            ok
          }
        }
    """
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"JWT {test_user_token}",
    }
    response = requests.post(GRAPHQL_URL, json={"query": query}, headers=headers)
    logger.warning(response.content)
    assert response.status_code == 200
    data = response.json()
    logger.warning(data)
    assert data["data"]["createCommuting"]["ok"]
