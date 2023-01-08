#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""Testing of GraphQL API queries related to user authentication"""
import logging
import os
import requests
from dotenv import load_dotenv, find_dotenv
import json

logger = logging.getLogger(__file__)

# Load settings from ./.env file
load_dotenv(find_dotenv())

GRAPHQL_URL = os.environ.get("GRAPHQL_URL")
TEST_EMAIL = os.environ.get("TEST_EMAIL")
TEST_PASSWORD = os.environ.get("TEST_PASSWORD")
TOKEN = ""
REFRESH_TOKEN = ""

with open("../data/test_data.json") as f:
    test_data_users = json.load(f)["users"]


def test_login(test_user1_token):
    """Test user login"""
    query = """
            mutation ($email: String!, $password: String!){
            tokenAuth (
            email: $email
            password: $password
          ) {
             success
            errors
            token
            refreshToken
          }
        }
    """
    variables = {"email": test_data_users["test_user1"]["email"],
                 "password": test_data_users["test_user1"]["password"]}
    response = requests.post(GRAPHQL_URL, json={"query": query, "variables": variables})
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["tokenAuth"]["success"]

    assert data["data"]["tokenAuth"]["token"] == test_user1_token
    global REFRESH_TOKEN
    REFRESH_TOKEN = data["data"]["tokenAuth"]["refreshToken"]


def test_verify_token(test_user1_token):
    """Test if token can be verified"""
    verify_token_query = """
            mutation ($token: String!){
              verifyToken(
                token: $token
              ) {
                success,
                errors,
                payload
              }
            }
    """
    variables = {"token": test_user1_token}
    response = requests.post(
        GRAPHQL_URL, json={"query": verify_token_query, "variables": variables}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["verifyToken"]["success"]


def test_me_query(test_user3_rep_token):
    """Test whether me query returns the currently logged in user"""
    me_query = """
        query {
          me {
            verified
            firstName
            workingGroup {
                id
                name
            }
          }
    }
    """
    headers = {"Content-Type": "application/json", "Authorization": f"JWT {test_user3_rep_token}"}
    response = requests.post(GRAPHQL_URL, json={"query": me_query}, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["me"]["firstName"] == test_data_users["test_user3_representative"]["first_name"]
    assert data["data"]["me"]["verified"]
    assert data["data"]["me"]["workingGroup"] is not None


def test_update_query(test_user1_token):
    """Test whether user data can be updated"""
    update_query = """
        mutation {
        updateAccount (
            firstName: "Louise"
            lastName: "Ise"
      ) {
        success
        errors
      }
    }
    """
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"JWT {test_user1_token}",
    }
    response = requests.post(GRAPHQL_URL, json={"query": update_query}, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["updateAccount"]["success"]

    # reset user data
    update_query = """
            mutation ($first_name: String!, $last_name: String!) {
            updateAccount (
                firstName: $first_name
                lastName: $last_name
          ) {
            success
            errors
          }
        }
        """
    variables = {
        "first_name": test_data_users["test_user1"]["first_name"],
        "last_name": test_data_users["test_user1"]["last_name"],
    }
    response = requests.post(GRAPHQL_URL, json={"query": update_query, "variables": variables}, headers=headers)
    assert response.status_code == 200


def test_change_password(test_user1_token):
    """Test whether password can be changed"""
    new_password = "123456super"
    change_password_query = """
        mutation ($password: String!, $new_password: String!) {
         passwordChange(
            oldPassword: $password,
            newPassword1: $new_password,
            newPassword2: $new_password
          ) {
            success,
            errors,
            token,
            refreshToken
          }
        }"""
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"JWT {test_user1_token}",
    }
    variables = {
        "password": test_data_users["test_user1"]["password"],
        "new_password": new_password
    }
    response = requests.post(
        GRAPHQL_URL, json={"query": change_password_query, "variables": variables}, headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["passwordChange"]["success"]
    global TOKEN
    TOKEN = data["data"]["passwordChange"]["token"]

    # reset changes (cleanup)
    change_back_password_query = """
            mutation ($password: String!,  $new_password: String!) {
             passwordChange(
                oldPassword: $new_password,
                newPassword1: $password,
                newPassword2: $password
              ) {
                success,
                errors,
                token,
                refreshToken
              }
            }"""
    response = requests.post(
        GRAPHQL_URL, json={"query": change_back_password_query, "variables": variables}, headers=headers
    )
    assert response.status_code == 200


def test_list_users():
    """Test to query all users"""
    query = """
        query {
      users {
        edges {
          node {
            email
          }
        }
      }
    }
    """
    response = requests.post(GRAPHQL_URL, json={"query": query})
    assert response.status_code == 200
    data = response.json()
    assert len(data["data"]["users"]["edges"]) > 1


def test_query_dropdown_options():
    """Test if querying dropdown options"""
    query = """
    { __type(name: "ElectricityFuelType") {
          enumValues {
            name
            description
          }
        }
    }
    """
    response = requests.post(GRAPHQL_URL, json={"query": query})
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["__type"]["enumValues"][0]["name"] == "GERMAN_ENERGY_MIX"

    query = """
    {__type(name: "Unit") {
        enumValues
    {
        name
    description
    }
    }
    }
    """
    response = requests.post(GRAPHQL_URL, json={"query": query})
    assert response.status_code == 200
    response.json()
