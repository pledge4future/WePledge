#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""GraphQL endpoints"""

__email__ = "infopledge4future.org"

import os
import traceback

import graphene
import datetime as dt
import pandas as pd
from django.core.exceptions import ValidationError
from django.db.models import Sum, F
import numpy as np

from django.db.models.functions import TruncMonth, TruncYear
from graphene_django.types import DjangoObjectType, ObjectType
from graphql import GraphQLError
from graphql_auth.schema import UserQuery, MeQuery
from graphql_auth import mutations
from emissions.models import (
    BusinessTrip,
    CustomUser,
    Electricity,
    WorkingGroup,
    Heating,
    Institution,
    Commuting,
    CommutingGroup,
    BusinessTripGroup,
    ResearchField,
    WorkingGroupJoinRequest
)
from emissions.decorators import representative_required

from co2calculator.co2calculator.calculate import (
    calc_co2_electricity,
    calc_co2_heating,
    calc_co2_businesstrip,
    calc_co2_commuting,
)
from co2calculator.co2calculator.constants import ElectricityFuel

from graphql_jwt.decorators import login_required
import warnings

from emissions.email_client import EmailClient
from django.conf import settings

# -------------- GraphQL Types -------------------

WEEKS_PER_MONTH = 4.34524
WEEKS_PER_YEAR = 52.1429


class UserType(DjangoObjectType):
    """GraphQL User Type"""

    class Meta:
        """Assign django model"""

        model = CustomUser


class WorkingGroupType(DjangoObjectType):
    """GraphQL Working Group Type"""

    class Meta:
        """Assign django model"""

        model = WorkingGroup

class WorkingGroupJoinRequestType(DjangoObjectType):
    """GraphQL Working Group Type"""

    class Meta:
        """Assign django model"""

        model = WorkingGroupJoinRequest



class InstitutionType(DjangoObjectType):
    """GraphQL Institution"""

    class Meta:
        """Assign django model"""

        model = Institution


class ResearchFieldType(DjangoObjectType):
    """GraphQL Research Field"""

    class Meta:
        """Assign django model"""

        model = ResearchField


class BusinessTripType(DjangoObjectType):
    """GraphQL Business Trip Type"""

    class Meta:
        """Assign django model"""

        model = BusinessTrip


class CommutingType(DjangoObjectType):
    """GraphQL Commuting Type"""

    class Meta:
        """Assign django model"""

        model = Commuting


class ElectricityType(DjangoObjectType):
    """GraphQL Electricity Type"""

    class Meta:
        """Assign django model"""

        model = Electricity


class HeatingType(DjangoObjectType):
    """GraphQL Heating Type"""

    class Meta:
        """Assign django model"""

        model = Heating


class HeatingAggregatedType(ObjectType):
    """GraphQL Heating aggregated by month or year"""

    date = graphene.String(description="Date")
    co2e = graphene.Float(description="Total CO2e emissions [tco2e]")
    co2e_cap = graphene.Float(description="CO2e emissions per capita [tco2e]")

    class Meta:
        """Assign django model"""

        name = "HeatingAggregated"
        filter_fields = ["id"]


class ElectricityAggregatedType(ObjectType):
    """GraphQL Electricity aggregated by month or year"""

    date = graphene.String(description="Date")
    co2e = graphene.Float(description="Total CO2e emissions [tco2e]")
    co2e_cap = graphene.Float(description="CO2e emissions per capita [tco2e]")

    class Meta:
        """Assign django model"""

        name = "ElectricityAggregated"


class BusinessTripAggregatedType(ObjectType):
    """GraphQL Business Trips aggregated by month or year"""

    date = graphene.String(description="Date")
    co2e = graphene.Float(description="Total CO2e emissions [tco2e]")
    co2e_cap = graphene.Float(description="CO2e emissions per capita [tco2e]")

    class Meta:
        """Assign django model"""

        name = "BusinessTripAggregated"


class CommutingAggregatedType(ObjectType):
    """GraphQL Commuting aggregated by month or year"""

    date = graphene.String(description="Date")
    co2e = graphene.Float(description="Total CO2e emissions [tco2e]")
    co2e_cap = graphene.Float(description="CO2e emissions per capita [tco2e]")

    class Meta:
        """Assign django model"""

        name = "CommutingAggregated"


class TotalEmissionType(ObjectType):
    """GraphQL total emissions"""

    working_group_name = graphene.String(description="Name of the working group")
    working_group_institution_name = graphene.String(
        description="Name of the institution the working group belongs to"
    )
    co2e = graphene.Float(description="Total CO2e emissions [tco2e]")
    co2e_cap = graphene.Float(description="CO2e emissions per capita [tco2e]")

    class Meta:
        """Assign django model"""

        name = "TotalEmission"


# -------------------- Query types -----------------

# Create a Query type
class Query(UserQuery, MeQuery, ObjectType):
    """GraphQL Queries"""

    businesstrips = graphene.List(BusinessTripType)
    electricities = graphene.List(ElectricityType)
    heatings = graphene.List(HeatingType)
    commutings = graphene.List(CommutingType)
    workinggroups = graphene.List(WorkingGroupType)
    researchfields = graphene.List(ResearchFieldType)
    institutions = graphene.List(InstitutionType)
    workinggroup_users = graphene.List(UserType)
    join_requests = graphene.List(WorkingGroupJoinRequestType)

    # Aggregated data
    heating_aggregated = graphene.List(
        HeatingAggregatedType,
        level=graphene.String(
            description="Aggregation level: group or institution. Default: group"
        ),
        time_interval=graphene.String(
            description="Time interval for aggregation (month or year)"
        ),
    )
    electricity_aggregated = graphene.List(
        ElectricityAggregatedType,
        level=graphene.String(
            description="Aggregation level: group or institution. Default: group"
        ),
        time_interval=graphene.String(
            description="Time interval for aggregation (month or year)"
        ),
    )
    businesstrip_aggregated = graphene.List(
        BusinessTripAggregatedType,
        level=graphene.String(
            description="Aggregation level: personal, group or institution. Default: group"
        ),
        time_interval=graphene.String(
            description="Time interval for aggregation (month or year)"
        ),
    )
    commuting_aggregated = graphene.List(
        CommutingAggregatedType,
        level=graphene.String(
            description="Aggregation level: personal, group or institution. Default: group"
        ),
        time_interval=graphene.String(
            description="Time interval for aggregation (month or year)"
        ),
    )
    total_emission = graphene.List(
        TotalEmissionType,
        start=graphene.Date(
            description="Start date for calculation of total emissions"
        ),
        end=graphene.Date(description="End date for calculation of total emissions"),
        level=graphene.String(
            description="Aggregate by 'group' or 'institution'. Default: 'group')"
        ),
    )

    @login_required
    def resolve_workinggroups(self, info, **kwargs):
        """Yields all working group objects"""
        return WorkingGroup.objects.filter(is_public=True)

    @login_required
    @representative_required
    def resolve_workinggroup_users(self, info, **kawrgs):
        """Returns the users of a certain working group."""
        id = info.context.user.working_group.id
        return CustomUser.objects.filter(working_group__id=id)

    @login_required
    @representative_required
    def resolve_join_requests(self, info, **kwargs):
        """Yields all institution objects"""
        id = info.context.user.working_group.id
        return WorkingGroupJoinRequest.objects.filter(working_group__id=id)

    def resolve_institutions(self, info, **kwargs):
        """Yields all institution objects"""
        return Institution.objects.all()

    def resolve_researchfields(self, info, **kwargs):
        """Yields all reseach field objects"""
        return ResearchField.objects.all()

    @login_required
    def resolve_businesstrips(self, info, **kwargs):
        """Yields all heating consumption objects"""
        user = info.context.user
        return BusinessTrip.objects.all(user__id=user.id)

    @login_required
    def resolve_electricities(self, info, **kwargs):
        """Yields all heating consumption objects"""
        user = info.context.user
        return Electricity.objects.all(working_group__id=user.working_group.id)

    @login_required
    def resolve_heatings(self, info, **kwargs):
        """Yields all heating consumption objects"""
        user = info.context.user
        return Heating.objects.all(working_group__id=user.working_group.id)

    @login_required
    def resolve_commutings(self, info, **kwargs):
        """Yields all heating consumption objects"""
        user = info.context.user
        return Commuting.objects.all(user__id=user.id)

    @login_required
    def resolve_heating_aggregated(
        self, info, level="group", time_interval="month", **kwargs
    ):
        """
        Yields monthly co2e emissions (per capita) of heating consumption, for the user, their group or their institution
        param: level: Aggregation level: personal, group or institution. Default: group
        param: time_interval: Aggregate co2e per "month" or "year"
        """
        #if not info.context.user.is_authenticated:
        #    raise GraphQLError("User is not authenticated.")
        user = info.context.user

        if user.working_group is None:
            raise GraphQLError("No heating data available, since user is not assigned to any working group yet.")

        # Get relevant data entries
        if level == "personal":
            entries = Heating.objects.filter(working_group__id=user.working_group.id)
            # Use the average co2e emissions per capital as total emissons for one person
            metrics = {"co2e": Sum("co2e_cap"), "co2e_cap": Sum("co2e_cap")}
        elif level == "group":
            entries = Heating.objects.filter(working_group__id=user.working_group.id)
            metrics = {"co2e": Sum("co2e"), "co2e_cap": Sum("co2e_cap")}
        elif level == "institution":
            entries = Heating.objects.filter(
                working_group__institution__id=user.working_group.institution.id
            )
            metrics = {"co2e": Sum("co2e"), "co2e_cap": Sum("co2e_cap")}
        else:
            raise GraphQLError(f"Invalid value for parameter 'level': {level}")

        if time_interval == "month":
            return (
                entries.annotate(date=TruncMonth("timestamp"))
                .values("date")
                .annotate(**metrics)
                .order_by("date")
            )
        elif time_interval == "year":
            return (
                entries.annotate(date=TruncYear("timestamp"))
                .values("date")
                .annotate(**metrics)
                .order_by("date")
            )
        else:
            raise GraphQLError(f"Invalid option {time_interval} for 'time_interval'.")

    @login_required
    def resolve_electricity_aggregated(
        self, info, level="group", time_interval="month", **kwargs
    ):
        """
        Yields monthly co2e emissions (per capita) of electricity consumption, for the user, their group or their institution
        param: level: Aggregation level: group or institution. Default: group
        param: time_interval: Aggregate co2e per "month" or "year"
        """
        user = info.context.user
        if user.working_group is None:
            raise GraphQLError("No heating data available, since user is not assigned to any working group yet.")

        # Get relevant data entries
        if level == "personal":
            entries = Electricity.objects.filter(working_group__id=user.working_group.id)
            # Use the average co2e emissions per capital as total emissons for one person
            metrics = {"co2e": Sum("co2e_cap"), "co2e_cap": Sum("co2e_cap")}
        elif level == "group":
            entries = Electricity.objects.filter(working_group__id=user.working_group.id)
            metrics = {"co2e": Sum("co2e"), "co2e_cap": Sum("co2e_cap")}
        elif level == "institution":
            entries = Electricity.objects.filter(
                working_group__institution__id=user.working_group.institution.id
            )
            metrics = {"co2e": Sum("co2e"), "co2e_cap": Sum("co2e_cap")}
        else:
            raise GraphQLError(f"Invalid value for parameter 'level': {level}")

        if time_interval == "month":
            return (
                entries.annotate(date=TruncMonth("timestamp"))
                .values("date")
                .annotate(**metrics)
                .order_by("date")
            )
        elif time_interval == "year":
            return (
                entries.annotate(date=TruncYear("timestamp"))
                .values("date")
                .annotate(**metrics)
                .order_by("date")
            )
        else:
            raise GraphQLError(f"Invalid option {time_interval} for 'time_interval'.")

    @login_required
    def resolve_businesstrip_aggregated(
        self,
        info,
        level="group",
        time_interval="month",
        **kwargs,
    ):
        """
        Yields monthly co2e emissions of businesstrips
        - for a user,
        - for a group (if group_id is given),
        - for an institution (if inst_id is given)
        param: level: Aggregation level: personal, group or institution. Default: group
        param: time_interval: Aggregate co2e per "month" or "year"
        """
        user = info.context.user
        # Get relevant data entries
        if level == "personal":
            entries = BusinessTrip.objects.filter(user__id=user.id)
            entries = entries.annotate(co2e_cap=F("co2e"))
        elif level == "group":
            entries = BusinessTripGroup.objects.filter(
                working_group__id=user.working_group.id
            )
        elif level == "institution":
            entries = BusinessTripGroup.objects.filter(
                working_group__institution__id=user.working_group.institution.id
            )
        else:
            raise GraphQLError(f"Invalid value for parameter 'level': {level}")

        metrics = {"co2e": Sum("co2e"), "co2e_cap": Sum("co2e_cap")}

        if time_interval == "month":
            return (
                entries.annotate(date=TruncMonth("timestamp"))
                .values("date")
                .annotate(**metrics)
                .order_by("date")
            )
        elif time_interval == "year":
            return (
                entries.annotate(date=TruncYear("timestamp"))
                .values("date")
                .annotate(**metrics)
                .order_by("date")
            )
        else:
            raise GraphQLError(f"Invalid option {time_interval} for 'time_interval'.")

    @login_required
    def resolve_commuting_aggregated(
        self,
        info,
        level="group",
        time_interval="month",
        **kwargs,
    ):
        """
        Yields monthly co2e emissions of businesstrips
        - for a user,
        - for a group (if group_id is given),
        - for an institution (if inst_id is given)
        param: level: Aggregation level: group or institution. Default: group
        param: time_interval: Aggregate co2e per "month" or "year"
        """
        user = info.context.user
        # Get relevant data entries
        if level == "personal":
            entries = Commuting.objects.filter(user__id=user.id)
            entries = entries.annotate(co2e_cap=F("co2e"))
        elif level == "group":
            entries = CommutingGroup.objects.filter(
                working_group__id=user.working_group.id
            )
        elif level == "institution":
            entries = CommutingGroup.objects.filter(
                working_group__institution__id=user.working_group.institution.id
            )
        else:
            raise GraphQLError(f"Invalid value for parameter 'level': {level}")

        metrics = {"co2e": Sum("co2e"), "co2e_cap": Sum("co2e_cap")}

        if time_interval == "month":
            return (
                entries.annotate(date=TruncMonth("timestamp"))
                .values("date")
                .annotate(**metrics)
                .order_by("date")
            )
        elif time_interval == "year":
            return (
                entries.annotate(date=TruncYear("timestamp"))
                .values("date")
                .annotate(**metrics)
                .order_by("date")
            )
        else:
            raise GraphQLError(f"Invalid option {time_interval} for 'time_interval'.")

    def resolve_total_emission(
        self, info, start=None, end=None, level="group", **kwargs
    ):
        """
        Yields total emissions on monthly or yearly basis
        param: start: Start date for calculation of total emissions. If none is given, the last 12 months will be used.
        param: end: end date for calculation of total emission If none is given, the last 12 months will be used.
        """
        metrics = {
            "co2e": Sum("co2e"),
            "co2e_cap": Sum("co2e_cap"),
        }

        if not end and not start:
            end = dt.datetime(
                day=1,
                month=dt.datetime.today().month - 1,
                year=dt.datetime.today().year,
            )
            start = dt.datetime(
                day=1,
                month=dt.datetime.today().month,
                year=dt.datetime.today().year - 1,
            )

        if level == "group":
            aggregate_on = ["working_group__name", "working_group__institution__name"]
        elif level == "institution":
            aggregate_on = ["working_group__institution__name"]
        else:
            raise GraphQLError(f"Invalid value for parameter 'level': {level}")

        heating_emissions = (
            Heating.objects.filter(timestamp__gte=start, timestamp__lte=end)
            .values(*aggregate_on)
            .annotate(**metrics)
        )
        heating_df = pd.DataFrame(list(heating_emissions))

        electricity_emissions = (
            Electricity.objects.filter(timestamp__gte=start, timestamp__lte=end)
            .values(*aggregate_on)
            .annotate(**metrics)
        )
        electricity_df = pd.DataFrame(list(electricity_emissions))

        businesstrips_emissions = (
            BusinessTripGroup.objects.filter(timestamp__gte=start, timestamp__lte=end)
            .values(*aggregate_on)
            .annotate(**metrics)
        )
        businesstrips_df = pd.DataFrame(list(businesstrips_emissions))

        commuting_emissions = (
            CommutingGroup.objects.filter(timestamp__gte=start, timestamp__lte=end)
            .values(*aggregate_on)
            .annotate(**metrics)
        )
        commuting_df = pd.DataFrame(list(commuting_emissions))

        total_emissions = (
            pd.concat([heating_df, electricity_df, commuting_df, businesstrips_df])
            .groupby(aggregate_on)
            .sum()
        )
        total_emissions.reset_index(inplace=True)

        emissions_for_groups = []
        if level == "group":
            for _, row in total_emissions.iterrows():
                section = TotalEmissionType(
                    working_group_name=row["working_group__name"],
                    working_group_institution_name=row[
                        "working_group__institution__name"
                    ],
                    co2e=row["co2e"],
                    co2e_cap=row["co2e_cap"],
                )
                emissions_for_groups.append(section)
        elif level == "institution":
            for _, row in total_emissions.iterrows():
                section = TotalEmissionType(
                    working_group_name=None,
                    working_group_institution_name=row[
                        "working_group__institution__name"
                    ],
                    co2e=row["co2e"],
                    co2e_cap=row["co2e_cap"],
                )
                emissions_for_groups.append(section)
        return emissions_for_groups


# -------------- Input Object Types --------------------------

class JoinRequestInput(graphene.InputObjectType):
    """GraphQL Input type for sending request to join a working group"""

    workinggroup_id = graphene.String(reqired=True, description="ID of the working group")


class CommutingInput(graphene.InputObjectType):
    """GraphQL Input type for commuting"""

    from_timestamp = graphene.Date(required=True, description="Start date")
    to_timestamp = graphene.Date(required=True, description="End date")
    transportation_mode = graphene.String(
        required=True, description="Transportation mode"
    )
    workweeks = graphene.Int(description="Number of work weeks")
    distance = graphene.Float(description="Distance [meter]")
    size = graphene.String(description="Size of the vehicle")
    fuel_type = graphene.String(description="Fuel type of the vehicle")
    occupancy = graphene.Float(description="Occupancy of the vehicle")
    passengers = graphene.Int(description="Number of passengers in the vehicle")


class PlanTripInput(graphene.InputObjectType):
    """GraphQL Input type for the trip planner"""

    transportation_mode = graphene.String(
        required=True, description="Transportation mode"
    )
    start_address = graphene.String(description="Start address")
    start_city = graphene.String(description="Start city")
    start_country = graphene.String(description="Start country")
    destination_address = graphene.String(description="Destination address")
    destination_city = graphene.String(description="Destination city")
    destination_country = graphene.String(description="Destination country")
    distance = graphene.Float(description="Distance [meter]")
    size = graphene.String(description="Size of the vehicle")
    fuel_type = graphene.String(description="Fuel type of the vehicle")
    occupancy = graphene.Float(description="Occupancy")
    seating_class = graphene.String(description="Seating class in plane")
    passengers = graphene.Int(description="Number of passengers")
    roundtrip = graphene.Boolean(description="Roundtrip [True/False]")


class BusinessTripInput(graphene.InputObjectType):
    """GraphQL Input type for Business trips"""

    timestamp = graphene.Date(required=True, description="Date")
    transportation_mode = graphene.String(
        required=True, description="Transportation mode"
    )
    start = graphene.String(description="Start address")
    destination = graphene.String(description="Destination address")
    distance = graphene.Float(description="Distance [meter]")
    size = graphene.String(description="Size of the vehicle")
    fuel_type = graphene.String(description="Fuel type of the vehicle")
    occupancy = graphene.Float(description="Occupancy")
    seating_class = graphene.String(description="Seating class in plane")
    passengers = graphene.Int(description="Number of passengers")
    roundtrip = graphene.Boolean(description="Roundtrip [True/False]")


class ElectricityInput(graphene.InputObjectType):
    """GraphQL Input type for electricity"""

    timestamp = graphene.Date(required=True, description="Date")
    consumption = graphene.Float(description="Consumption")
    fuel_type = graphene.String(required=True, description="Fuel type")
    building = graphene.String(
        required=True, description="Number of Building if there are several ones"
    )
    group_share = graphene.Float(
        required=True, description="Share of the building beloning to the working group"
    )


class HeatingInput(graphene.InputObjectType):
    """GraphQL Input type for heating"""

    timestamp = graphene.Date(required=True, description="Date")
    consumption = graphene.Float(required=True, description="Consumption")
    unit = graphene.String(required=True, description="Unit of fuel type")
    fuel_type = graphene.String(required=True, description="Fuel type")
    building = graphene.String(
        required=True, description="Number of Building if there are several ones"
    )
    group_share = graphene.Float(
        required=True, description="Share of the building beloning to the working group"
    )


class CreateWorkingGroupInput(graphene.InputObjectType):
    """GraphQL Input type for creating a new working group"""

    name = graphene.String(reqired=True, description="Name of the working group")
    institution_id = graphene.String(
        required=True, description="UUID of institution the working group belongs to"
    )
    research_field_id = graphene.Int(
        required=True, description="ID of Research field of working group"
    )
    n_employees = graphene.Int(
        required=True, description="Number of employees of working group"
    )
    is_public = graphene.Boolean(required=True,
                              description="If true, the group will be publicly visible.")
    
class DeleteWorkingGroupInput(graphene.InputObjectType):
    """GraphQL Input type for deleting an existing working group"""
    
    id = graphene.String(required=True, description="ID of the working group")


class SetWorkingGroupInput(graphene.InputObjectType):
    """GraphQL Input type for setting working group"""

    id = graphene.String(reqired=True, description="ID of the working group")
    
class RemoveUserFromWorkingGroupInput(graphene.InputObjectType):
    """GraphQL input type for removing a user from a working group"""
    
    user_id = graphene.String(required=True, description="ID of the user that should be removed")


class AnswerJoinRequestInput(graphene.InputObjectType):
    """GraphQL Input type for setting working group"""

    request_id = graphene.String(required=True, description="ID of join request")
    approve = graphene.Boolean(reqired=True, description="Approve (true) or decline (false) join request")
    
class AddUserToWorkingGroupInput(graphene.InputObjectType):
    """GraphQL input type for adding a user to a working group"""
    
    user_email = graphene.String(required=True, description="eMail of the user that should be added to the working group")


# --------------- Mutations ------------------------------------

class AuthMutation(graphene.ObjectType):
    """Authentication mutations"""

    register = mutations.Register.Field()
    verify_account = mutations.VerifyAccount.Field()
    resend_activation_email = mutations.ResendActivationEmail.Field()
    send_password_reset_email = mutations.SendPasswordResetEmail.Field()
    password_reset = mutations.PasswordReset.Field()
    password_set = mutations.PasswordSet.Field()
    archive_account = mutations.ArchiveAccount.Field()
    delete_account = mutations.DeleteAccount.Field()
    password_change = mutations.PasswordChange.Field()
    update_account = mutations.UpdateAccount.Field()
    send_secondary_email_activation = mutations.SendSecondaryEmailActivation.Field()
    verify_secondary_email = mutations.VerifySecondaryEmail.Field()
    swap_emails = mutations.SwapEmails.Field()
    remove_secondary_email = mutations.RemoveSecondaryEmail.Field()

    token_auth = mutations.ObtainJSONWebToken.Field()
    verify_token = mutations.VerifyToken.Field()
    refresh_token = mutations.RefreshToken.Field()
    revoke_token = mutations.RevokeToken.Field()


class CreateWorkingGroup(graphene.Mutation):
    """Mutation to create a new working group"""

    class Arguments:
        """Assign input type"""
        input = CreateWorkingGroupInput()

    success = graphene.Boolean()
    workinggroup = graphene.Field(WorkingGroupType)

    @staticmethod
    @login_required
    def mutate(root, info, input=None):
        """Process incoming data"""
        user = info.context.user
        success = True

        institution_found = Institution.objects.filter(
            id=input.institution_id
        )
        if len(institution_found) == 0:
            raise GraphQLError("Institution not found.")
        else:
            institution = institution_found[0]

        field_found = ResearchField.objects.filter(id=input.research_field_id)
        if len(field_found) == 0:
            raise GraphQLError("Research field is invalid.")
        else:
            research_field = field_found[0]

        # Check if working group already exists
        exists = WorkingGroup.objects.filter(name=input.name, institution=institution)
        if len(exists) > 0:
            raise GraphQLError(
                "This working group cannot be created, because it already exists."
            )
        elif user.is_representative is True:
            raise GraphQLError(
                "This user cannot create a new working group, since they are already the representative of another working group."
            )
        new_workinggroup = WorkingGroup(
            name=input.name,
            institution=institution,
            representative=user,
            field=research_field,
            n_employees=input.n_employees,
            is_public=input.is_public
        )
        new_workinggroup.save()

        user.working_group = new_workinggroup
        user.is_representative = True
        user.save()

        return CreateWorkingGroup(success=success, workinggroup=new_workinggroup)
    
class LeaveWorkingGroup(graphene.Mutation):
    """Mutation to create a new working group"""

    success = graphene.Boolean()
    
    @staticmethod
    @login_required
    def mutate(root, info):
        user = info.context.user
        
        if user.is_representative is True:
            raise GraphQLError(
                "Users that are representatives can not leave their working groups. Please delete the working group instead."
            )
        
        try:
            setattr(user, "working_group", None)
            user.save()
            return LeaveWorkingGroup(success=True)
        except ValidationError as e:
            return LeaveWorkingGroup(success=False, errors=e)
class DeleteWorkingGroup(graphene.Mutation):
    """Mutatino to delete an existing working group"""
    
    class Arguments:
        """Assign input type"""
        input = DeleteWorkingGroupInput()

    success = graphene.Boolean()
    
    @staticmethod
    @login_required
    @representative_required
    def mutate(root, info, input=None):
        
        user = info.context.user
        
        working_groups = WorkingGroup.objects.filter(
            id=input.id
        )
        
        if len(working_groups) == 0:
            raise GraphQLError("Working group not found.")
        if len(working_groups) > 1:
            raise GraphQLError("More then one working group found, invalid ID")
        
        group_to_delete = working_groups[0]
        
        if info.context.user.id != group_to_delete.representative.id:
            raise GraphQLError("You are not the representative of the specified working group. Unable to delete")
        
        try:
            setattr(user, "is_representative", False)
            user.save()
            working_groups[0].delete()
            return DeleteWorkingGroup(success=True)
        except ValidationError as e:
            return DeleteWorkingGroup(success=False, errors=e)
        

        
class SetWorkingGroup(graphene.Mutation):
    """GraphQL mutation to set working group of user"""

    class Arguments:
        """Assign input type"""

        input = SetWorkingGroupInput()

    success = graphene.Boolean()
    user = graphene.Field(UserType)

    @staticmethod
    @login_required
    def mutate(root, info, input=None):
        """Process incoming data"""
        user = info.context.user
        success = True

        # Search matching working groups
        matching_working_groups = WorkingGroup.objects.filter(
            id=input.id
        )
        if len(matching_working_groups) == 0:
            raise GraphQLError("Working group not found.")
        else:
            working_group = matching_working_groups[0]

        setattr(user, "working_group", working_group)
        user.save()

        try:
            user.full_clean()
            user.save()
            return SetWorkingGroup(user=user, success=success)
        except ValidationError as e:
            return SetWorkingGroup(user=user, success=success, errors=e)
        

class RemoveUserFromWorkingGroup(graphene.Mutation):
    """GraphQL mutation to remove a user from a working group"""
    
    class Arguments:
        """Input structure defined by input type"""
        
        input = RemoveUserFromWorkingGroupInput()
        
    success = graphene.Boolean()
    
    @staticmethod
    @login_required
    @representative_required
    def mutate(root, info, input):
        """Process incoming data"""
        user = info.context.user
        
        user_subset = CustomUser.objects.filter(id=input.user_id)
        
        if len(user_subset) == 0:
            raise GraphQLError(
                "The user you were trying to remove was not found. Please contact your administrator."
            )
        else:
            user_to_remove = user_subset[0]
        
        if user_to_remove.is_representative is True:
            raise GraphQLError(
                "Users that are representatives of the working group can not be removed from the groups."
            )
            
        if user_to_remove.working_group != user.working_group:
                raise GraphQLError(
                    "The user you are trying to remove is not part of your working group!"
                )
        
        try:
            setattr(user_to_remove, "working_group", None)
            user_to_remove.save()
            return RemoveUserFromWorkingGroup(success=True)
        except ValidationError as e:
            return RemoveUserFromWorkingGroup(success=False, errors=e)
        
        
class AddUserToWorkingGroup(graphene.Mutation):
    """GraphQL mutaiton to add a user to a working group"""
    
    class Arguments:
        """Input strucutred defined by input type"""
        
        input = AddUserToWorkingGroupInput()
        
    success= graphene.Boolean()
        
    @staticmethod
    @login_required
    @representative_required
    def mutate(root, info, input):
        """Process incoming data"""
        
        user = info.context.user
        
        working_group_set = WorkingGroup.objects.filter(id=user.working_group.id)
        
        if len(working_group_set) == 0:
            raise GraphQLError("You are not part of a working group. You can only add users to your own working group.")
        else:
            working_group = working_group_set[0]
            if info.context.user.id != working_group.representative.id:
                raise GraphQLError("You are not the representative of the specified working group. Unable to delete")

        user_to_add_query_set = CustomUser.objects.filter(email=input.user_email)
        
        if len(user_to_add_query_set) > 1:
            raise GraphQLError(f"Invalid email address input. Multiple users found.") # this should never happen as email addresses should be unique in the database
        elif len(user_to_add_query_set) == 0:
            raise GraphQLError(f"The user that you are trying to add is not registered.")
        else:
            user_to_add = user_to_add_query_set[0]
            if user_to_add.working_group != None:
                raise GraphQLError(f"The user you are trying to add already has a working group assigned.")
            
            # assign working group to user
            try:
                setattr(user_to_add, "working_group", working_group)
                user_to_add.save()
                return AddUserToWorkingGroup(success=True)
            except ValidationError as e:
                return AddUserToWorkingGroup(success=False, errors=e)
    

class AnswerJoinRequest(graphene.Mutation):
    """GraphQL mutation to set working group of user"""

    class Arguments:
        """Assign input type"""

        input = AnswerJoinRequestInput()

    success = graphene.Boolean()
    requesting_user = graphene.Field(UserType)

    @staticmethod
    @login_required
    @representative_required
    def mutate(root, info, input: AnswerJoinRequestInput = None):
        """Process incoming data"""
        success = True
        user = info.context.user

        # Search for join request
        matching_join_request = WorkingGroupJoinRequest.objects.filter(id=input.request_id)
        if len(matching_join_request) == 0:
            raise GraphQLError("Join request not found.")
        else:
            join_request = matching_join_request[0]

        # Check if the current user is the representative of the working group
        if not user.working_group == join_request.working_group:
            raise GraphQLError(f"You are not authorized to answer this join request, because you are "
                               f"not the representative of the {join_request.working_group.name}.")

        if not input.approve:
            requesting_user = join_request.user
            join_request.status = 'Declined'
            join_request.save()
            return AnswerJoinRequest(success=True, requesting_user=requesting_user)
        elif input.approve:
            requesting_user = join_request.user
            setattr(join_request.user, "working_group", join_request.working_group)
            requesting_user.save()
            join_request.status = 'Approved'
            join_request.save()

            try:
                requesting_user.full_clean()
                requesting_user.save()
                return AnswerJoinRequest(success=success, requesting_user=requesting_user)
            except ValidationError as e:
                return SetWorkingGroup(success=success, requesting_user=None, errors=e)


class RequestJoinWorkingGroup(graphene.Mutation):
    """GraphQL mutation to request to join a working group"""

    class Arguments:
        """Assign input type"""

        input = JoinRequestInput()

    success = graphene.Boolean()
    join_request = graphene.Field(WorkingGroupJoinRequestType)

    @staticmethod
    @login_required
    def mutate(root, info, input=None):
        """Process incoming data"""
        user = info.context.user
        success = True

        # Search matching working groups
        matching_working_groups = WorkingGroup.objects.filter(
            id=input.workinggroup_id
        )
        if len(matching_working_groups) == 0:
            raise GraphQLError("Working group not found.")
        else:
            working_group = matching_working_groups[0]

        # Create entry in workinggroup join requests tabel
        new_request = WorkingGroupJoinRequest(user=user,
                                              working_group=working_group,
                                              status='Pending')
        new_request.save()

        # Send email to group representative
        representative = working_group.representative
        values = {'representative_first_name': representative.first_name,
                  'representative_last_name': representative.last_name,
                  'user_first_name': user.first_name,
                  'user_last_name': user.last_name,
                  'working_group_name': working_group.name,
                  'path': os.getenv("PUBLIC_URL", "https://localhost") + "/working-group-details"
                  }
        TEMPLATE_DIR = settings.TEMPLATES[0]['DIRS'][0]
        email_client = EmailClient(template_dir=TEMPLATE_DIR)
        text, html = email_client.get_template_email('join_request', values)
        subject = email_client.get_template_subject('join_request', values)
        email_client.send_email(subject,
                                html,
                                from_email="no-reply@pledge4future.org",
                                to_email=representative.email)


        return RequestJoinWorkingGroup(success=success, join_request=new_request)


class CreateElectricity(graphene.Mutation):
    """GraphQL mutation for electricity"""

    class Arguments:
        """Assign input type"""

        input = ElectricityInput(required=True)

    success = graphene.Boolean()
    electricity = graphene.Field(ElectricityType)

    @staticmethod
    @login_required
    @representative_required
    def mutate(root, info, input=None):
        """Process incoming data"""
        user = info.context.user
        success = True

        if input.fuel_type:
            input.fuel_type = input.fuel_type.lower().replace(" ", "_")
        # Calculate co2
        co2e = calc_co2_electricity(
            input.consumption,
            input.fuel_type,
            input.group_share,
        )
        
        co2e_cap = co2e / user.working_group.n_employees

        # Store in database
        new_electricity = Electricity(
            working_group=user.working_group,
            timestamp=input.timestamp,
            consumption=input.consumption,
            fuel_type=ElectricityFuel[input.fuel_type.upper()].name,
            group_share=input.group_share,
            building=input.building,
            co2e=round(co2e, 1),
            co2e_cap=round(co2e_cap, 1),
        )
        new_electricity.save()
        return CreateElectricity(success=success, electricity=new_electricity)


class CreateHeating(graphene.Mutation):
    """GraphQL mutation for heating"""

    class Arguments:
        """Assign input type"""

        input = HeatingInput(required=True)

    success = graphene.Boolean()
    heating = graphene.Field(HeatingType)

    @staticmethod
    @login_required
    @representative_required
    def mutate(root, info, input=None):
        """Process incoming data"""
        success = True
        user = info.context.user

        # Calculate co2e
        co2e = calc_co2_heating(
            consumption=input.consumption,
            unit=input.unit.lower().replace(" ", "_"),
            fuel_type=input.fuel_type.lower().replace(" ", "_"),
            area_share=input.group_share,
        )
        co2e_cap = co2e / user.working_group.n_employees

        # Store in database
        new_heating = Heating(
            working_group=user.working_group,
            timestamp=input.timestamp,
            consumption=input.consumption,
            fuel_type=input.fuel_type.upper().replace(" ", "_"),
            unit=input.unit.lower().replace(" ", "_"),
            building=input.building,
            group_share=input.group_share,
            co2e=round(co2e, 1),
            co2e_cap=round(co2e_cap, 1),
        )
        new_heating.save()
        return CreateHeating(success=success, heating=new_heating)


class PlanTrip(graphene.Mutation):
    """GraphQL mutation for business trips"""

    class Arguments:
        """Assign input type"""

        input = PlanTripInput(required=True)

    success = graphene.Boolean()
    co2e = graphene.Float()
    message = graphene.String()

    @staticmethod
    def mutate(root, info, input=None):
        """Process incoming data"""
        success = True
        message = "success"
        if input.seating_class:
            input.seating_class = input.seating_class.lower().replace(" ", "_")
        if input.fuel_type:
            input.fuel_type = input.fuel_type.lower().replace(" ", "_")
        if input.size:
            input.size = input.size.lower().replace(" ", "_")
        if input.transportation_mode:
            input.transportation_mode = input.transportation_mode.lower().replace(
                " ", "_"
            )
        # CO2e calculation
        start_dict = {"address": input.start_address,
                      "locality": input.start_city,
                      "country": input.start_country}
        destination_dict = {"address": input.destination_address,
                            "locality": input.destination_city,
                            "country": input.destination_country}

        try:
            co2e, distance, range_category, _ = calc_co2_businesstrip(
                start=start_dict,
                destination=destination_dict,
                distance=input.distance,
                transportation_mode=input.transportation_mode,
                size=input.size,
                fuel_type=input.fuel_type,
                occupancy=input.occupancy,
                seating=input.seating_class,
                passengers=input.passengers,
                roundtrip=input.roundtrip,
            )
            print(co2e, distance, range_category, _)
        except Exception as e:
            traceback.print_exc()
            return PlanTrip(success=False, message=str(e), co2e=None)
        except RuntimeWarning as e:
            message = e
        return PlanTrip(success=success, message=message, co2e=co2e)


class CreateBusinessTrip(graphene.Mutation):
    """GraphQL mutation for business trips"""

    class Arguments:
        """Assign input type"""

        input = BusinessTripInput(required=True)

    success = graphene.Boolean()
    businesstrip = graphene.Field(BusinessTripType)

    @staticmethod
    @login_required
    def mutate(root, info, input=None):
        """Process incoming data"""
        success = True
        user = info.context.user
        if input.seating_class:
            input.seating_class = input.seating_class.lower().replace(" ", "_")
        if input.fuel_type:
            input.fuel_type = input.fuel_type.lower().replace(" ", "_")
        if input.size:
            input.size = input.size.lower().replace(" ", "_")
        if input.transportation_mode:
            input.transportation_mode = input.transportation_mode.lower().replace(
                " ", "_"
            )
        # CO2e calculation
        co2e, distance, range_category, _ = calc_co2_businesstrip(
            start=input.start,
            destination=input.destination,
            distance=input.distance,
            transportation_mode=input.transportation_mode,
            size=input.size,
            fuel_type=input.fuel_type,
            occupancy=input.occupancy,
            seating=input.seating_class,
            passengers=input.passengers,
            roundtrip=input.roundtrip,
        )
        # Write data to database
        businesstrip_instance = BusinessTrip(
            timestamp=input.timestamp,
            distance=distance,
            range_category=range_category,
            transportation_mode=input.transportation_mode,
            co2e=co2e,
            user=user,
            working_group=user.working_group,
        )
        businesstrip_instance.save()

        return CreateBusinessTrip(success=success, businesstrip=businesstrip_instance)


class CreateCommuting(graphene.Mutation):
    """GraphQL mutation for commuting"""

    class Arguments:
        """Assign input type"""

        input = CommutingInput(required=True)

    success = graphene.Boolean()
    # commute = graphene.Field(CommutingType)

    @staticmethod
    @login_required
    def mutate(root, info, input=None):
        """Process incoming data"""
        success = True
        user = info.context.user
        if input.workweeks is None:
            input.workweeks = WEEKS_PER_YEAR
        if input.transportation_mode:
            input.transportation_mode = input.transportation_mode.lower().replace(
                " ", "_"
            )
        if input.fuel_type:
            input.fuel_type = input.fuel_type.lower().replace(" ", "_")
        if input.size:
            input.size = input.size.lower().replace(" ", "_")
        # Calculate co2
        weekly_co2e = calc_co2_commuting(
            transportation_mode=input.transportation_mode,
            weekly_distance=input.distance,
            size=input.size,
            fuel_type=input.fuel_type,
            occupancy=input.occupancy,
            passengers=input.passengers,
        )

        # Calculate monthly co2
        monthly_co2e = (
            WEEKS_PER_MONTH * (input.workweeks / WEEKS_PER_YEAR) * weekly_co2e
        )
        dates = np.arange(
            np.datetime64(input.from_timestamp, "M"),
            np.datetime64(input.to_timestamp, "M") + np.timedelta64(1, "M"),
            np.timedelta64(1, "M"),
        ).astype("datetime64[D]")
        for d in dates:
            commuting_instance = Commuting(
                timestamp=str(d),
                distance=input.distance,
                transportation_mode=input.transportation_mode,
                co2e=monthly_co2e,
                user=user,
                working_group=user.working_group,
            )
            commuting_instance.save()

            # Update emissions of working group for date and transportation mode
            if user.working_group is None:
                continue

            entries = Commuting.objects.filter(
                working_group=user.working_group,
                transportation_mode=input.transportation_mode,
                timestamp=str(d),
            )
            metrics = {"co2e": Sum("co2e"), "distance": Sum("distance")}
            group_data = entries.aggregate(**metrics)

            co2e_cap = group_data["co2e"] / user.working_group.n_employees
            commuting_group_instance = CommutingGroup(
                working_group=user.working_group,
                timestamp=str(d),
                transportation_mode=input.transportation_mode,
                n_employees=user.working_group.n_employees,
                co2e=group_data["co2e"],
                co2e_cap=co2e_cap,
                distance=group_data["distance"],
            )
            commuting_group_instance.save()

        return CreateCommuting(success=success)


class Mutation(AuthMutation, graphene.ObjectType):
    """GraphQL Mutations"""

    create_businesstrip = CreateBusinessTrip.Field()
    create_electricity = CreateElectricity.Field()
    create_heating = CreateHeating.Field()
    create_commuting = CreateCommuting.Field()
    request_join_working_group = RequestJoinWorkingGroup.Field()
    set_working_group = SetWorkingGroup.Field()
    remove_user_from_working_group = RemoveUserFromWorkingGroup.Field()
    add_user_to_working_group = AddUserToWorkingGroup.Field()
    delete_working_group = DeleteWorkingGroup.Field()
    create_working_group = CreateWorkingGroup.Field()
    leave_working_group = LeaveWorkingGroup.Field()
    plan_trip = PlanTrip.Field()
    answer_join_request = AnswerJoinRequest.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
