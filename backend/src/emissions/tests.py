from django.test import TestCase

# Create your tests here.
import json
from graphene_django.utils.testing import GraphQLTestCase


from graphql_jwt.shortcuts import get_token
from django.contrib.auth import get_user_model
from sgqlc.types import String, Type, Field
from sgqlc.operation import Operation
from sgqlc.endpoint.http import HTTPEndpoint

import requests

GRAPHQL_URL = "http://localhost:8000/graphql/"
TEST_USERNAME = "test_user"
TEST_EMAIL = "test@pledge4future.org"
TEST_PASSWORD = "dasisteintest!"
TOKEN = ""
REFRESH_TOKEN = ""


def test_create_user():

    register_query = '''
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
        '''
    variables = {"username": TEST_USERNAME,
                 "email": TEST_EMAIL,
                 "password1": TEST_PASSWORD,
                 "password2": TEST_PASSWORD}
    response = requests.post(GRAPHQL_URL, json={'query': register_query, 'variables': variables})
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["register"]["success"]


def test_verify():
    """
    Test if verification works (not implemented since token is sent by email)
    """
    verify_query = '''
            mutation ($token: String!){
                verifyAccount (
                    token: $token
                ) {
                    success
                    errors
                }
            }
    '''
    token_from_email = "eyJ1c2VybmFtZSI6InRlc3RfdXNlciIsImFjdGlvbiI6ImFjdGl2YXRpb24ifQ:1mtaae:3YqWW-l10wf1eONm1nz0qtJFZ53ueWbxITh_5P0lcF4"
    variables = {"token": token_from_email}
    response = requests.post(GRAPHQL_URL, json={'query': verify_query, 'variables': variables})
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["verifyAccount"]["success"]


def test_login():
    """
    Test user login
    """
    query = '''
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
    '''
    variables = {"email": TEST_EMAIL,
                 "password": TEST_PASSWORD}
    response = requests.post(GRAPHQL_URL, json={'query': query,
                                                'variables': variables})
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["tokenAuth"]["success"]

    global TOKEN
    TOKEN = data["data"]["tokenAuth"]["token"]
    global REFRESH_TOKEN
    REFRESH_TOKEN = data["data"]["tokenAuth"]["refreshToken"]


def test_verify_token():
    """
    Test if token can be verified
    """
    verify_token_query = '''
            mutation ($token: String!){
              verifyToken(
                token: $token
              ) {
                success,
                errors,
                payload
              }
            }
    '''
    variables = {'token': TOKEN}
    response = requests.post(GRAPHQL_URL, json={'query': verify_token_query, 'variables': variables})
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["verifyToken"]["success"]


def test_update_query():
    """
    Test whether user data can be updated
    """
    update_query = '''
        mutation {
        updateAccount (
        firstName: "Louise"
      ) {
        success
        errors
      }
    }
    '''
    headers = {"Content-Type": "application/json",
               'Authorization': f'JWT {TOKEN}'}
    response = requests.post(GRAPHQL_URL, json={'query': update_query}, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["updateAccount"]["success"]


def test_refresh_token():
    """
    Test whether new token can be queried
    """
    refresh_token_query = '''
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
    }'''
    variables = {'refreshtoken': REFRESH_TOKEN}
    response = requests.post(GRAPHQL_URL, json={'query': refresh_token_query, 'variables': variables})
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["refreshToken"]["success"]
    global TOKEN
    TOKEN = data["data"]["refreshToken"]["token"]


def test_delete_account():
    """
    Test whether account can be deleted
    """
    # Archive account
    delete_query = '''mutation ($password: String!)
    {
        deleteAccount(
            password: $password,
    ) {
        success,
        errors
    }
    }'''
    headers = {"Content-Type": "application/json",
               'Authorization': f'JWT {TOKEN}'}
    variables = {'password': TEST_PASSWORD}
    response = requests.post(GRAPHQL_URL, json={'query': delete_query, 'variables': variables}, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["deleteAccount"]["success"]


def test_working_groups():
    """
    Test whether working groups can be queried
    """

    group_query = '''
        query {
            workingGroups {
              name
            }
        }
    '''
    headers = {"Content-Type": "application/json",
               'Authorization': f'Token {TOKEN}'}
    #response = requests.post(GRAPHQL_URL, json={'query': group_query}, headers=headers)
    #assert response.status_code == 200
    #data = response.json()
    #assert data["data"]["workingGroups"]



def list_users():
    """
    Queries all registered users
    """
    query = '''
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
    '''
    response = requests.post(GRAPHQL_URL, json={'query': query})
    assert response.status_code == 200
    data = response.json()
    assert len(data["data"]["users"]["edges"]) > 1


