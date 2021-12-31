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
    assert len(data["data"]["heatingAggregated"]) > 1

