#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""Testing of GraphQL API queries related to user authentication"""

import os
import requests
from dotenv import load_dotenv

# Load settings from ./.env file
load_dotenv()

GRAPHQL_URL = os.environ.get("GRAPHQL_URL")
TEST_USERNAME = os.environ.get("TEST_USERNAME")
TEST_EMAIL = os.environ.get("TEST_EMAIL")
TEST_PASSWORD = os.environ.get("TEST_PASSWORD")
TOKEN = ""
REFRESH_TOKEN = ""


def test_register():
    """Test user registration"""

    register_query = """
            mutation ($email: String!, $username: String!, $password1: String! $password2: String!) {
            register (
            email: $email,
            username: $username,
            password1: $password1,
            password2: $password2
          ) {
             success
            errors
          }
        }
        """
    variables = {
        "username": TEST_USERNAME,
        "email": TEST_EMAIL,
        "password1": TEST_PASSWORD,
        "password2": TEST_PASSWORD,
    }
    response = requests.post(
        GRAPHQL_URL, json={"query": register_query, "variables": variables}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["register"]["success"]


def test_verify():
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
    token_from_email = "eyJlbWFpbCI6InRlc3RAcGxlZGdlNGZ1dHVyZS5vcmciLCJhY3Rpb24iOiJhY3RpdmF0aW9uIn0:1mxwDA:vf9qO0ZVpLU7PMs1aZ4s2dittneWLixlwzahka-qUwk"
    variables = {"token": token_from_email}
    response = requests.post(
        GRAPHQL_URL, json={"query": verify_query, "variables": variables}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["verifyAccount"]["success"]


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
    variables = {"email": TEST_EMAIL, "password": TEST_PASSWORD}
    response = requests.post(GRAPHQL_URL, json={"query": query, "variables": variables})
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["tokenAuth"]["success"]

    global TOKEN
    TOKEN = data["data"]["tokenAuth"]["token"]
    global REFRESH_TOKEN
    REFRESH_TOKEN = data["data"]["tokenAuth"]["refreshToken"]


def test_verify_token():
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
    variables = {"token": TOKEN}
    response = requests.post(
        GRAPHQL_URL, json={"query": verify_token_query, "variables": variables}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["verifyToken"]["success"]


def test_me_query():
    """Test whether me query returns the currently logged in user"""
    me_query = """
        query {
          me {
            username,
            verified
            workingGroup {
                groupId
                name
            }
          }
    }
    """
    headers = {"Content-Type": "application/json", "Authorization": f"JWT {TOKEN}"}
    response = requests.post(GRAPHQL_URL, json={"query": me_query}, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["me"]["username"] == TEST_USERNAME
    assert data["data"]["me"]["verified"]


def test_update_query():
    """Test whether user data can be updated"""
    update_query = """
        mutation {
        updateAccount (
            firstName: "Louise"
            isRepresentative: "False"
            workingGroup: "30e8d77e-9861-4e0e-8eaa-98ba8cad24ae"
      ) {
        success
        errors
      }
    }
    """
    headers = {"Content-Type": "application/json", "Authorization": f"JWT {TOKEN}"}
    response = requests.post(GRAPHQL_URL, json={"query": update_query}, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["updateAccount"]["success"]


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


def test_delete_account():
    """Test whether account is deleted"""
    # Archive account
    delete_query = """mutation ($password: String!)
    {
        deleteAccount(
            password: $password,
    ) {
        success,
        errors
    }
    }"""
    headers = {"Content-Type": "application/json", "Authorization": f"JWT {TOKEN}"}
    variables = {"password": TEST_PASSWORD}
    response = requests.post(
        GRAPHQL_URL,
        json={"query": delete_query, "variables": variables},
        headers=headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["deleteAccount"]["success"]


def test_groups():
    """Test whether working groups can be queried (not implemented yet)"""

    group_query = """
        query {
            workingGroups {
              name
              groupId
            }
        }
     """
    headers = {"Content-Type": "application/json", "Authorization": f"JWT {TOKEN}"}
    response = requests.post(GRAPHQL_URL, json={"query": group_query}, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data["data"]["workingGroups"]) == 2


def test_list_users():
    """Test to query all users"""
    query = """
        query {
      users {
        edges {
          node {
            username
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
