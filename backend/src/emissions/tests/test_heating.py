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


def test_query_heating_aggregated(test_user3_rep_token):
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
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"JWT {test_user3_rep_token}",
    }
    response = requests.post(
        GRAPHQL_URL, json={"query": query, "variables": variables}, headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data["data"]["heatingAggregated"][0]["date"], str)
    assert isinstance(data["data"]["heatingAggregated"][0]["co2e"], float)
    assert isinstance(data["data"]["heatingAggregated"][0]["co2eCap"], float)
    assert len(data["data"]["heatingAggregated"]) == 1


def test_query_heating_aggregated_personal(test_user3_rep_token):
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
    variables = {"level": "personal"}
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"JWT {test_user3_rep_token}",
    }
    response = requests.post(
        GRAPHQL_URL, json={"query": query, "variables": variables}, headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data["data"]["heatingAggregated"][0]["date"], str)
    assert isinstance(data["data"]["heatingAggregated"][0]["co2e"], float)
    assert isinstance(data["data"]["heatingAggregated"][0]["co2eCap"], float)
    assert len(data["data"]["heatingAggregated"]) == 1
    assert data["data"]["heatingAggregated"][0]["co2eCap"] == data["data"]["heatingAggregated"][0]["co2e"]

def test_query_heating_aggregated_no_workinggroup(test_user1_token):
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
    variables = {"level": "personal"}
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"JWT {test_user1_token}",
    }
    response = requests.post(
        GRAPHQL_URL, json={"query": query, "variables": variables}, headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["errors"][0]["message"] == 'No heating data available, since user is not assigned to any working group yet.'
