#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""Testing of GraphQL API queries related to querying data"""

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


def test_set_workinggroup(test_user_token):
    """Test whether user data can be updated"""
    query = """
        mutation ($name: String!, $institution: String!, $city: String!, $country: String!){
          setWorkingGroup (input: {
              name: $name
              institution: $institution
              city: $city
              country: $country
            }
          ) { 
            ok
            user {
                username
              workingGroup {
                name
              }
            }
            }
        }
    """
    variables = {"name": "Environmental Research Group",
                 "institution": "Heidelberg University",
                 "city": "Heidelberg",
                 "country": "Germany"
                 }
    headers = {"Content-Type": "application/json", "Authorization": f"JWT {test_user_token}"}
    response = requests.post(GRAPHQL_URL, json={"query": query, "variables": variables}, headers=headers)
    assert response.status_code == 200
    data = response.json()
    logger.info(data["data"])
    assert data["data"]["setWorkingGroup"]["ok"]
    assert data["data"]["setWorkingGroup"]["user"]["workingGroup"]["name"] == variables["name"]


def test_query_heating_aggregated(test_user_token):
    """Query aggregated heating data by authenticated user"""
    query = """
        query ($level: String!) {
          heatingAggregated (level: $level) {
            date
            co2e
            co2eCap
          }
    }
    """
    variables = {"level": "group"}
    headers = {"Content-Type": "application/json", "Authorization": f"JWT {test_user_token}"}
    response = requests.post(
        GRAPHQL_URL, json={"query": query, "variables": variables}, headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data["data"]["heatingAggregated"][0]["date"], str)
    assert isinstance(data["data"]["heatingAggregated"][0]["co2e"], float)
    assert isinstance(data["data"]["heatingAggregated"][0]["co2eCap"], float)



def test_query_electricity_aggregated_institution(test_user_token):
    """Query aggregated electricity data by authenticated user"""
    query = """
        query ($level: String!) {
          electricityAggregated (level: $level) {
            date
            co2e
            co2eCap
          }
    }
    """
    variables = {"level": "institution"}
    headers = {"Content-Type": "application/json", "Authorization": f"JWT {test_user_token}"}
    response = requests.post(
        GRAPHQL_URL, json={"query": query, "variables": variables}, headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data["data"]["electricityAggregated"][0]["date"], str)
    assert isinstance(data["data"]["electricityAggregated"][0]["co2e"], float)
    assert isinstance(data["data"]["electricityAggregated"][0]["co2eCap"], float)


def test_query_businesstrip_aggregated_personal(test_user_token):
    """Query aggregated businesstrip data by authenticated user"""
    query = """
        query ($level: String!) {
          businesstripAggregated (level: $level) {
            date
            co2e
            co2eCap
          }
    }
    """
    variables = {"level": "personal"}
    headers = {"Content-Type": "application/json", "Authorization": f"JWT {test_user_token}"}
    response = requests.post(
        GRAPHQL_URL, json={"query": query, "variables": variables}, headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    logger.warning(data)
    assert isinstance(data["data"]["businesstripAggregated"][0]["date"], str)
    assert isinstance(data["data"]["businesstripAggregated"][0]["co2e"], float)
    assert isinstance(data["data"]["businesstripAggregated"][0]["co2eCap"], float)


def test_query_commuting_aggregated_group(test_user_token):
    """Query aggregated commuting data by authenticated user"""
    query = """
        query ($level: String!) {
          commutingAggregated (level: $level) {
            date
            co2e
            co2eCap
          }
    }
    """
    variables = {"level": "group"}
    headers = {"Content-Type": "application/json", "Authorization": f"JWT {test_user_token}"}
    response = requests.post(
        GRAPHQL_URL, json={"query": query, "variables": variables}, headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    logger.warning(data)
    assert isinstance(data["data"]["commutingAggregated"][0]["date"], str)
    assert isinstance(data["data"]["commutingAggregated"][0]["co2e"], float)
    assert isinstance(data["data"]["commutingAggregated"][0]["co2eCap"], float)


def test_query_electricity_aggregated_with_invalid_token(test_user_token):
    """Query aggregated electricity data by non authenticated user should return an error message but no data"""
    query = """
        query ($level: String!) {
          electricityAggregated (level: $level) {
            date
            co2e
            co2eCap
          }
    }
    """
    variables = {"level": "institution"}
    headers = {"Content-Type": "application/json", "Authorization": f"JWT invalid_token"}
    response = requests.post(
        GRAPHQL_URL, json={"query": query, "variables": variables}, headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["errors"][0]["message"] == 'You do not have permission to perform this action'

