#!/usr/bin/env python
# -*- coding: utf-8 -*-

""" Custom User Model """

from django.db import models
from django.contrib.auth.models import AbstractUser

import uuid

class CustomUser(AbstractUser):
    """Custom user model"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(
        blank=False, max_length=255, verbose_name="email", unique=True
    )
    username = models.CharField(max_length=100, unique=True)
    first_name = models.CharField(max_length=25, blank=True)
    last_name = models.CharField(max_length=25, blank=True)
    title_choices = [("PROF", "Prof."), ("DR", "Dr.")]
    academic_title = models.CharField(max_length=10, choices=title_choices, blank=True)
    working_group = models.ForeignKey("WorkingGroup", on_delete=models.SET_NULL, null=True, blank=True)
    is_representative = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.first_name} {self.last_name}"