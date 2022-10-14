#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""Testing of GraphQL API queries related to management of working groups"""

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


def test_set_workinggroup(test_user_token2):
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
            success
            user {
                email
              workingGroup {
                name
              }
            }
            }
        }
    """
    variables = {
        "name": "Biomedical Research Group",
        "institution": "Heidelberg University",
        "city": "Heidelberg",
        "country": "Germany",
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"JWT {test_user_token2}",
    }
    response = requests.post(
        GRAPHQL_URL, json={"query": query, "variables": variables}, headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    logger.info(data["data"])
    assert data["data"]["setWorkingGroup"]["success"]
    assert (
        data["data"]["setWorkingGroup"]["user"]["workingGroup"]["name"]
        == variables["name"]
    )


def test_resolve_working_groups(test_user_token):
    """List all working groups"""
    query = """
        query {
          workinggroups {
            id
            name
            field {
              field
              subfield
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
    # logger.warning(data)
    assert len(data["data"]["workinggroups"]) > 0


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


def test_create_workinggroup(test_user_token):
    """Create a new working group"""
    query = """
        mutation {
            createWorkingGroup (input: {
                name: "Geology"
                institution: "Heidelberg University"
                city: "Heidelberg"
                country: "Germany"
                field: "Natural Sciences"
                subfield: "Earth and related environmental sciences"
                nEmployees: 5
                is_public: false
            }) {
                success
                workinggroup {
                    name
                    representative {
                        email
                    }
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
    logger.warning(response.content)
    data = response.json()
    logger.warning(data)
    assert data["data"]["createWorkingGroup"]["success"]
    assert (
        data["data"]["createWorkingGroup"]["workinggroup"]["representative"]["email"] is not None
    )


def test_create_workinggroup_by_representative(test_user_representative_token):
    """Create a new working group"""
    query = """
        mutation {
            createWorkingGroup (input: {
                name: "Hydrology"
                institution: "Heidelberg University"
                city: "Heidelberg"
                country: "Germany"
                field: "Natural Sciences"
                subfield: "Earth and related environmental sciences"
                nEmployees: 5
                is_public: false
            }) {
                success
                workinggroup {
                    name
                    representative {
                        email
                    }
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
    logger.warning(response.content)
    data = response.json()
    # logger.warning(data)
    assert (
        data["errors"][0]["message"]
        == "This user cannot create a new working group, since they are already the representative of another working group."
    )
