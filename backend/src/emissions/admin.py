#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Admin settings"""


from django.contrib import admin
from django.apps import apps
from emissions.models import (
    CustomUser,
    WorkingGroup,
    Institution,
    Heating,
    Electricity,
    Commuting,
    CommutingGroup,
    BusinessTrip,
    BusinessTripGroup,
    ResearchField,
)

# Register your models here.
admin.site.register(CustomUser)
admin.site.register(WorkingGroup)
admin.site.register(Institution)
admin.site.register(Heating)
admin.site.register(Electricity)
admin.site.register(Commuting)
admin.site.register(CommutingGroup)
admin.site.register(BusinessTrip)
admin.site.register(BusinessTripGroup)
admin.site.register(ResearchField)

app = apps.get_app_config("graphql_auth")

for _, model in app.models.items():
    admin.site.register(model)
