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

with open("config.json") as f:
    test_data_users = json.load(f)["users"]


def test_register():
    """Test user registration"""
    pass
    register_query = """
            mutation ($email: String!, $username: String!, $password1: String! $password2: String!) {
            register (
            email: $email,
            password1: $password1,
            password2: $password2
          ) {
             success
            errors
          }
        }
        """
    variables = {
        "username": test_data_users["test_user1"]["username"],
        "email": test_data_users["test_user1"]["email"],
        "password1": test_data_users["test_user1"]["password"],
        "password2": test_data_users["test_user1"]["password"],
    }
    response = requests.post(
        GRAPHQL_URL, json={"query": register_query, "variables": variables}
    )
    logger.info(response)
    assert response.status_code == 200
    # data = response.json()
    # assert data["data"]["register"]["success"]'''


def test_verify(test_user_token):
    """Test if account verification works"""
    verify_query = """
            mutation ($token: String!){
                verifyAccount (
                    token: $token
                ) {
                    success
                    errors
                }
            }
    """
    variables = {"token": test_user_token}
    response = requests.post(
        GRAPHQL_URL, json={"query": verify_query, "variables": variables}
    )
    logger.info(response)
    print(response)
    assert response.status_code == 200
    # data = response.json()
    # assert data["data"]["verifyAccount"]["success"]


def test_login():
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
    variables = {"email": test_data_users["test_user"]["email"],
                 "password": test_data_users["test_user"]["password"]}
    response = requests.post(GRAPHQL_URL, json={"query": query, "variables": variables})
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["tokenAuth"]["success"]

    global TOKEN
    TOKEN = data["data"]["tokenAuth"]["token"]
    global REFRESH_TOKEN
    REFRESH_TOKEN = data["data"]["tokenAuth"]["refreshToken"]


def test_verify_token(test_user_token):
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
    variables = {"token": test_user_token}
    response = requests.post(
        GRAPHQL_URL, json={"query": verify_token_query, "variables": variables}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["verifyToken"]["success"]


def test_me_query(test_user_token):
    """Test whether me query returns the currently logged in user"""
    me_query = """
        query {
          me {
            verified
            workingGroup {
                id
                name
            }
          }
    }
    """
    headers = {"Content-Type": "application/json", "Authorization": f"JWT {test_user_token}"}
    response = requests.post(GRAPHQL_URL, json={"query": me_query}, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["me"]["username"] == test_data_users["test_user"]["username"]
    assert data["data"]["me"]["verified"]


def test_update_query(test_user_token):
    """Test whether user data can be updated"""
    update_query = """
        mutation {
        updateAccount (
            firstName: "Louise"
            lastName: "Ise"
            username: "lou123"
            academicTitle: "DR"
      ) {
        success
        errors
      }
    }
    """
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"JWT {test_user_token}",
    }
    response = requests.post(GRAPHQL_URL, json={"query": update_query}, headers=headers)
    assert response.status_code == 200
    data = response.json()
    print(data)
    assert data["data"]["updateAccount"]["success"]

    # reset user data
    update_query = """
            mutation ($first_name: String!, $last_name: String!, $username: String!, $academic_title: String!) {
            updateAccount (
                firstName: $first_name
                lastName: $last_name
                username: $username
                academicTitle: $academic_title
          ) {
            success
            errors
          }
        }
        """
    variables = {
        "first_name": test_data_users["test_user"]["first_name"],
        "last_name": test_data_users["test_user"]["last_name"],
        "username": test_data_users["test_user"]["username"],
        "academic_title": test_data_users["test_user"]["academic_title"]
    }
    response = requests.post(GRAPHQL_URL, json={"query": update_query, "variables": variables}, headers=headers)
    assert response.status_code == 200


def test_refresh_token():
    """Test whether new token can be queried"""
    refresh_token_query = """
        mutation ($refreshtoken: String!) {
      refreshToken(
        refreshToken: $refreshtoken
      ) {
        success,
        errors,
        payload,
        token,
        refreshToken
      }
    }"""
    variables = {"refreshtoken": REFRESH_TOKEN}
    response = requests.post(
        GRAPHQL_URL, json={"query": refresh_token_query, "variables": variables}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["refreshToken"]["success"]
    global TOKEN
    TOKEN = data["data"]["refreshToken"]["token"]


def test_change_password(test_user_token):
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
        "Authorization": f"JWT {test_user_token}",
    }
    variables = {
        "password": test_data_users["test_user"]["password"],
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


def test_delete_account():
    """Test whether account is deleted (not applied atm)"""
    pass
    # Archive account
    # delete_query = """mutation ($password: String!)
    # {
    #    deleteAccount(
    #        password: $password,
    # ) {
    #    success,
    #    errors
    # }
    # }"""
    # headers = {"Content-Type": "application/json", "Authorization": f"JWT {TOKEN}"}
    # variables = {"password": TEST_PASSWORD}
    # response = requests.post(
    #    GRAPHQL_URL,
    #    json={"query": delete_query, "variables": variables},
    #    headers=headers,
    # )
    # assert response.status_code == 200
    # data = response.json()
    # assert data["data"]["deleteAccount"]["success"]


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
