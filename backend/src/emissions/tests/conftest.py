#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Conftest for shared pytest fixtures"""

import logging
from pathlib import Path

import requests
import pytest
import os
from dotenv import load_dotenv

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
logger.addHandler(logging.StreamHandler())

# Load settings from ./.env file
load_dotenv("../../../../.env")
GRAPHQL_URL = os.environ.get("GRAPHQL_URL")
logger.info(GRAPHQL_URL)


@pytest.fixture(scope="session")
def test_user_token():
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
    variables = {"email": "test2@pledge4future.org", "password": "test_password"}
    response = requests.post(GRAPHQL_URL, json={"query": query, "variables": variables})
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["tokenAuth"]["success"]

    yield data["data"]["tokenAuth"]["token"]


@pytest.fixture(scope="session")
def test_user_token2():
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
    variables = {"email": "Sebastian.Mueller@uni-hd.de", "password": "test_password"}
    response = requests.post(GRAPHQL_URL, json={"query": query, "variables": variables})
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["tokenAuth"]["success"]

    yield data["data"]["tokenAuth"]["token"]


@pytest.fixture(scope="session")
def test_user_representative_token():
    """Log in test user representative and yield token"""

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
    variables = {"email": "test3@pledge4future.org", "password": "test_password"}
    response = requests.post(GRAPHQL_URL, json={"query": query, "variables": variables})
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["tokenAuth"]["success"]

    yield data["data"]["tokenAuth"]["token"]
