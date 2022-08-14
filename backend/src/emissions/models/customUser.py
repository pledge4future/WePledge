#!/usr/bin/env python
# -*- coding: utf-8 -*-

from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    """Custom user model"""

    email = models.EmailField(max_length=200, verbose_name="email", unique=True)
    username = models.CharField(max_length=200, blank=True)
    first_name = models.CharField(max_length=25)
    last_name = models.CharField(max_length=25)
    title_choices = [("PROF", "Prof."), ("DR", "Dr.")]
    academic_title = models.CharField(max_length=10, choices=title_choices, blank=True)
    working_group = models.ForeignKey("WorkingGroup", on_delete=models.SET_NULL, null=True, blank=True)
    is_representative = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.first_name} {self.last_name}"