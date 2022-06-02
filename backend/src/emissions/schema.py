#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""GraphQL endpoints"""

__email__ = "infopledge4future.org"


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
)
from co2calculator.co2calculator.calculate import (
    calc_co2_electricity,
    calc_co2_heating,
    calc_co2_businesstrip,
    calc_co2_commuting,
)
from co2calculator.co2calculator.constants import ElectricityFuel

from graphql_jwt.decorators import login_required

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
        return WorkingGroup.objects.all()

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
        Yields monthly co2e emissions (per capita) of heating consumption
        - for a group (if group_id is given),
        - for an institution (if inst_id is given)
        param: level: Aggregation level: group or institution. Default: group
        param: time_interval: Aggregate co2e per "month" or "year"
        """
        if not info.context.user.is_authenticated:
            raise GraphQLError("User is not authenticated.")

        # Get relevant data entries
        if level == "group":
            entries = Heating.objects.filter(
                working_group__id=info.context.user.working_group.id
            )
        elif level == "institution":
            entries = Heating.objects.filter(
                working_group__institution__id=info.context.user.working_group.institution.id
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
    def resolve_electricity_aggregated(
        self, info, level="group", time_interval="month", **kwargs
    ):
        """
        Yields monthly co2e emissions of electricity consumption
        - for a group (if group_id is given),
        - for an institutions (if inst_id is given)
        param: level: Aggregation level: group or institution. Default: group
        param: time_interval: Aggregate co2e per "month" or "year"
        """
        user = info.context.user
        # Get relevant data entries
        if level == "group":
            entries = Heating.objects.filter(working_group__id=user.working_group.id)
        elif level == "institution":
            entries = Heating.objects.filter(
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
    def resolve_businesstrip_aggregated(
        self,
        info,
        level="group",
        time_interval="month",
        **kwargs,
    ):
        """
        Yields monthly co2e emissions of businesstrips
        - for a user (if username is given),
        - for a group (if group_id is given),
        - for an institution (if inst_id is given)
        param: level: Aggregation level: personal, group or institution. Default: group
        param: time_interval: Aggregate co2e per "month" or "year"
        """
        user = info.context.user
        # Get relevant data entries
        if level == "personal":
            entries = BusinessTrip.objects.filter(user__username=user.username)
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
        - for a user (if username is given),
        - for a group (if group_id is given),
        - for an institution (if inst_id is given)
        param: level: Aggregation level: group or institution. Default: group
        param: time_interval: Aggregate co2e per "month" or "year"
        """
        user = info.context.user
        # Get relevant data entries
        if level == "personal":
            entries = Commuting.objects.filter(user__username=user.username)
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
    seating_class = graphene.Int(description="Seating class in plane")
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
    institution = graphene.String(
        required=True, description="Name of institution the working group belongs to"
    )
    city = graphene.String(
        required=True, description="City of institution the working group belongs to"
    )
    country = graphene.String(
        required=True, description="Country of institution the working group belongs to"
    )
    field = graphene.String(
        required=True, description="Research field of working group"
    )
    subfield = graphene.String(
        required=True, description="Research subfield of working group"
    )
    n_employees = graphene.Int(
        required=True, description="Number of employees of working group"
    )
    public = graphene.Boolean(required=True,
                              description="If true, the group will be publicly visible.")


class WorkingGroupInput(graphene.InputObjectType):
    """GraphQL Input type for setting working group"""

    name = graphene.String(reqired=True, description="Name of the working group")
    institution = graphene.String(
        required=True, description="Name of institution of working group"
    )
    city = graphene.String(required=True, description="City of working group")
    country = graphene.String(required=True, description="Country of working group")


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

    ok = graphene.Boolean()
    workinggroup = graphene.Field(WorkingGroupType)

    @staticmethod
    @login_required
    def mutate(root, info, input=None):
        """Process incoming data"""
        user = info.context.user
        ok = True

        institution_found = Institution.objects.filter(
            name=input.institution, city=input.city, country=input.country
        )
        if len(institution_found) == 0:
            raise GraphQLError("Institution not found.")
        elif len(institution_found) > 1:
            raise GraphQLError("Multiple institutions found.")
        else:
            institution = institution_found[0]

        field_found = ResearchField.objects.filter(
            field=input.field, subfield=input.subfield
        )
        if len(field_found) == 0:
            raise GraphQLError("Research field is invalid.")
        elif len(field_found) > 1:
            raise GraphQLError("Multiple research field were found. Please specify further.")
        else:
            field = field_found[0]

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
            field=field,
            n_employees=input.n_employees,
            public=input.public
        )
        new_workinggroup.save()

        user.is_representative = True
        user.save()

        return CreateWorkingGroup(ok=ok, workinggroup=new_workinggroup)


class SetWorkingGroup(graphene.Mutation):
    """GraphQL mutation to set working group of user"""

    class Arguments:
        """Assign input type"""

        input = WorkingGroupInput()

    ok = graphene.Boolean()
    user = graphene.Field(UserType)

    @staticmethod
    @login_required
    def mutate(root, info, input=None):
        """Process incoming data"""
        user = info.context.user
        ok = True
        # Search matching working groups
        matching_working_groups = WorkingGroup.objects.filter(
            name=input.name,
            institution__name=input.institution,
            institution__city=input.city,
            institution__country=input.country,
        )
        if len(matching_working_groups) > 1:
            raise GraphQLError(
                "There are more than one matching working groups. Please further specify."
            )
        elif len(matching_working_groups) == 0:
            raise GraphQLError("Working group not found.")
        else:
            working_group = matching_working_groups[0]

        setattr(user, "working_group", working_group)
        user.save()

        try:
            user.full_clean()
            user.save()
            return SetWorkingGroup(user=user, ok=ok)
        except ValidationError as e:
            return SetWorkingGroup(user=user, ok=ok, errors=e)


class CreateElectricity(graphene.Mutation):
    """GraphQL mutation for electricity"""

    class Arguments:
        """Assign input type"""

        input = ElectricityInput(required=True)

    ok = graphene.Boolean()
    electricity = graphene.Field(ElectricityType)

    @staticmethod
    @login_required
    def mutate(root, info, input=None):
        """Process incoming data"""
        user = info.context.user
        ok = True
        if not user.is_representative:
            raise GraphQLError(
                "Electricity data was not added, since you are not the representative of your working group."
            )
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
        return CreateElectricity(ok=ok, electricity=new_electricity)


class CreateHeating(graphene.Mutation):
    """GraphQL mutation for heating"""

    class Arguments:
        """Assign input type"""

        input = HeatingInput(required=True)

    ok = graphene.Boolean()
    heating = graphene.Field(HeatingType)

    @staticmethod
    @login_required
    def mutate(root, info, input=None):
        """Process incoming data"""
        ok = True
        user = info.context.user
        if not user.is_representative:
            raise GraphQLError(
                "Heating data was not added, since you are not the representative of your working group."
            )

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
        return CreateHeating(ok=ok, heating=new_heating)


class CreateBusinessTrip(graphene.Mutation):
    """GraphQL mutation for business trips"""

    class Arguments:
        """Assign input type"""

        input = BusinessTripInput(required=True)

    ok = graphene.Boolean()
    businesstrip = graphene.Field(BusinessTripType)

    @staticmethod
    @login_required
    def mutate(root, info, input=None):
        """Process incoming data"""
        ok = True
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

        return CreateBusinessTrip(ok=ok, businesstrip=businesstrip_instance)


class CreateCommuting(graphene.Mutation):
    """GraphQL mutation for commuting"""

    class Arguments:
        """Assign input type"""

        input = CommutingInput(required=True)

    ok = graphene.Boolean()
    # commute = graphene.Field(CommutingType)

    @staticmethod
    @login_required
    def mutate(root, info, input=None):
        """Process incoming data"""
        ok = True
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

        return CreateCommuting(ok=ok)


class Mutation(AuthMutation, graphene.ObjectType):
    """GraphQL Mutations"""

    create_businesstrip = CreateBusinessTrip.Field()
    create_electricity = CreateElectricity.Field()
    create_heating = CreateHeating.Field()
    create_commuting = CreateCommuting.Field()
    set_working_group = SetWorkingGroup.Field()
    create_working_group = CreateWorkingGroup.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
