#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""Testing of GraphQL API queries related to management of working groups"""

import requests
import logging
from dotenv import load_dotenv
import os
import json


logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
logger.addHandler(logging.StreamHandler())

# Load settings from ./.env file
load_dotenv("../../../../.env")
GRAPHQL_URL = os.environ.get("GRAPHQL_URL")
logger.info(GRAPHQL_URL)


with open("../data/test_data.json") as f:
    test_workinggroups = json.load(f)["working_groups"]


def test_set_workinggroup(test_user1_token):
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
        "name": test_workinggroups['working_group1']['name'],
        "institution": test_workinggroups['working_group1']['institution']['name'],
        "city": test_workinggroups['working_group1']['institution']['city'],
        "country": test_workinggroups['working_group1']['institution']['country'],
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"JWT {test_user1_token}",
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


def test_resolve_working_groups(test_user1_token):
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
        "Authorization": f"JWT {test_user1_token}",
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


def test_create_workinggroup(test_user1_token):
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
                isPublic: false
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
        "Authorization": f"JWT {test_user1_token}",
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
    # todo: delete working group after it has been created


def test_create_workinggroup_by_representative(test_user3_rep_token):
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
                isPublic: true
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
        "Authorization": f"JWT {test_user3_rep_token}",
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
