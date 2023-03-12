#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""Testing of GraphQL API queries related to Business Trip data"""

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
