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
        mutation ($id: Int!){
          setWorkingGroup (input: {
              id: $id
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
        "id": test_workinggroups['working_group1']['id']
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
        == test_workinggroups['working_group1']["name"]
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


def test_create_workinggroup(test_user1_token):
    """Create a new working group"""
    query = """
        mutation ($name: String!, $institution_id: Int!, $research_field_id: Int!, $nemployees: Int!, $is_public: Boolean!){
            createWorkingGroup (input: {
                name: $name
                institutionId: $institution_id
                researchFieldId: $research_field_id
                nEmployees: $nemployees
                isPublic: $is_public
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
    variables = {
        "name": test_workinggroups['working_group1']['name'] + "test",
        "institution_id": test_workinggroups['working_group1']['institution']['id'],
        "research_field_id": test_workinggroups['working_group1']['research_field']['id'],
        "nemployees": test_workinggroups['working_group1']['n_employees'],
        "is_public": test_workinggroups['working_group1']['is_public'],
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"JWT {test_user1_token}",
    }
    response = requests.post(GRAPHQL_URL, json={"query": query, "variables": variables}, headers=headers)
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
        mutation ($name: String!, $institution_id: Int!, $research_field_id: Int!, $nemployees: Int!, $is_public: Boolean!){
            createWorkingGroup (input: {
                name: $name
                institutionId: $institution_id
                researchFieldId: $research_field_id
                nEmployees: $nemployees
                isPublic: $is_public
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
    variables = {
        "name": test_workinggroups['working_group1']['name'] + "test2",
        "institution_id": test_workinggroups['working_group1']['institution']['id'],
        "research_field_id": test_workinggroups['working_group1']['research_field']['id'],
        "nemployees": test_workinggroups['working_group1']['n_employees'],
        "is_public": test_workinggroups['working_group1']['is_public'],
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"JWT {test_user3_rep_token}",
    }
    response = requests.post(GRAPHQL_URL, json={"query": query, "variables": variables}, headers=headers)
    assert response.status_code == 200
    logger.warning(response.content)
    data = response.json()
    assert (
        data["errors"][0]["message"]
        == "This user cannot create a new working group, since they are already the representative of another working group."
    )
