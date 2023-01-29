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


def test_query_electricity_aggregated_institution(test_user3_rep_token):
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
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"JWT {test_user3_rep_token}",
    }
    response = requests.post(
        GRAPHQL_URL, json={"query": query, "variables": variables}, headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data["data"]["electricityAggregated"][0]["date"], str)
    assert isinstance(data["data"]["electricityAggregated"][0]["co2e"], float)
    assert isinstance(data["data"]["electricityAggregated"][0]["co2eCap"], float)
    assert len(data["data"]["electricityAggregated"]) == 1


def test_query_businesstrip_aggregated_personal(test_user1_token):
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
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"JWT {test_user1_token}",
    }
    response = requests.post(
        GRAPHQL_URL, json={"query": query, "variables": variables}, headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    logger.warning(data)
    assert isinstance(data["data"]["businesstripAggregated"][0]["date"], str)
    assert isinstance(data["data"]["businesstripAggregated"][0]["co2e"], float)
    assert isinstance(data["data"]["businesstripAggregated"][0]["co2eCap"], float)


def test_query_commuting_aggregated_group(test_user1_token):
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
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"JWT {test_user1_token}",
    }
    response = requests.post(
        GRAPHQL_URL, json={"query": query, "variables": variables}, headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    logger.warning(data)
    assert isinstance(data["data"]["commutingAggregated"][0]["date"], str)
    assert isinstance(data["data"]["commutingAggregated"][0]["co2e"], float)
    assert isinstance(data["data"]["commutingAggregated"][0]["co2eCap"], float)


def test_query_electricity_aggregated_with_invalid_token():
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
    headers = {
        "Content-Type": "application/json",
        "Authorization": "JWT invalid_token",
    }
    response = requests.post(
        GRAPHQL_URL, json={"query": query, "variables": variables}, headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert (
        data["errors"][0]["message"]
        == "You do not have permission to perform this action"
    )




def test_resolve_institutions():
    """List all institutions"""
    query = """
        query {
          institutions {
            id
            name
            city
            state
            country
          }
        }
     """
    response = requests.post(GRAPHQL_URL, json={"query": query})
    assert response.status_code == 200
    data = response.json()
    # logger.warning(data)
    assert len(data["data"]["institutions"]) > 0


def test_resolve_research_fields():
    """List all research fields"""
    query = """
        query {
          researchfields {
            field
            subfield
          }
        }
     """
    response = requests.post(GRAPHQL_URL, json={"query": query})
    assert response.status_code == 200
    data = response.json()
    # logger.warning(data)
    assert data["data"]["researchfields"][0]["field"] == "Natural Sciences"

