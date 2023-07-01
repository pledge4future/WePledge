#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Conftest for shared pytest fixtures"""

import logging
from pathlib import Path

import requests
import pytest
import os
from dotenv import load_dotenv
import json

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
logger.addHandler(logging.StreamHandler())

# Load settings from ./.env file
load_dotenv("../../../../.env")
GRAPHQL_URL = os.environ.get("GRAPHQL_URL")
logger.info(GRAPHQL_URL)

with open("../data/test_data.json") as f:
    test_data_users = json.load(f)["users"]


@pytest.fixture(scope="session")
def test_user1_token():
    """Log in test user and yield token"""

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
                 "password": test_data_users["test_user1"]["password"]
                 }
    response = requests.post(GRAPHQL_URL, json={"query": query, "variables": variables})
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["tokenAuth"]["success"]

    yield data["data"]["tokenAuth"]["token"]



@pytest.fixture(scope="session")
def test_user2_token():
    """Log in test user and yield token"""

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
    variables = {"email": test_data_users["test_user2"]["email"],
                 "password": test_data_users["test_user2"]["password"]
                 }
    response = requests.post(GRAPHQL_URL, json={"query": query, "variables": variables})
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["tokenAuth"]["success"]

    yield data["data"]["tokenAuth"]["token"]



@pytest.fixture(scope="session")
def test_user3_rep_token():
    """Log in test user and yield token"""

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
    variables = {"email": test_data_users["test_user3_representative"]["email"],
                 "password": test_data_users["test_user3_representative"]["password"]
                 }
    response = requests.post(GRAPHQL_URL, json={"query": query, "variables": variables})
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["tokenAuth"]["success"]

    yield data["data"]["tokenAuth"]["token"]




@pytest.fixture(scope="session")
def test_user4_rep_token():
    """Log in test user and yield token"""

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
    variables = {"email": test_data_users["test_user4_representative"]["email"],
                 "password": test_data_users["test_user4_representative"]["password"]
                 }
    response = requests.post(GRAPHQL_URL, json={"query": query, "variables": variables})
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["tokenAuth"]["success"]

    yield data["data"]["tokenAuth"]["token"]


