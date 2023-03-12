#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""Testing of GraphQL API queries related to Commuting data"""

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
