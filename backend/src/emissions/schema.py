#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""GraphQL endpoints"""

__email__ = "infopledge4future.org"


import graphene
from django.db.models import Sum
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
)
from co2calculator.co2calculator.calculate import (
    calc_co2_electricity,
    calc_co2_heating,
    calc_co2_businesstrip,
    calc_co2_commuting,
)

import numpy as np

# -------------- GraphQL Types -------------------
from graphql_jwt.decorators import login_required

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

    date = graphene.String()
    co2e = graphene.Float()
    co2e_cap = graphene.Float()

    class Meta:
        """Assign django model"""
        name = "HeatingAggregated"
        filter_fields = ["id"]


class ElectricityAggregatedType(ObjectType):
    """GraphQL Electricity aggregated by month or year"""

    date = graphene.String()
    co2e = graphene.Float()
    co2e_cap = graphene.Float()

    class Meta:
        """Assign django model"""

        name = "ElectricityAggregated"


class BusinessTripAggregatedType(ObjectType):
    """GraphQL Business Trips aggregated by month or year"""

    date = graphene.String()
    co2e = graphene.Float()
    co2e_cap = graphene.Float()

    class Meta:
        """Assign django model"""

        name = "BusinessTripAggregated"


class CommutingAggregatedType(ObjectType):
    """GraphQL Commuting aggregated by month or year"""

    date = graphene.String()
    co2e = graphene.Float()
    co2e_cap = graphene.Float()

    class Meta:
        """Assign django model"""

        name = "CommutingAggregated"


# -------------------- Query types -----------------

# Create a Query type
class Query(UserQuery, MeQuery, ObjectType):
    """GraphQL Queries"""

    businesstrips = graphene.List(BusinessTripType)
    electricities = graphene.List(ElectricityType)
    heatings = graphene.List(HeatingType)
    commutings = graphene.List(CommutingType)
    working_groups = graphene.List(WorkingGroupType)

    # Aggregated data
    heating_aggregated = graphene.List(
        HeatingAggregatedType,
        group_id=graphene.ID(),
        inst_id=graphene.ID(),
        time_interval=graphene.String(),
    )
    electricity_aggregated = graphene.List(
        ElectricityAggregatedType,
        group_id=graphene.ID(),
        inst_id=graphene.ID(),
        time_interval=graphene.String(),
    )
    businesstrip_aggregated = graphene.List(
        BusinessTripAggregatedType,
        username=graphene.String(),
        group_id=graphene.ID(),
        inst_id=graphene.ID(),
        time_interval=graphene.String(),
    )
    commuting_aggregated = graphene.List(
        CommutingAggregatedType,
        username=graphene.String(),
        group_id=graphene.ID(),
        inst_id=graphene.ID(),
        time_interval=graphene.String(),
    )

    def resolve_businesstrips(self, info, **kwargs):
        """Yields all heating consumption objects"""
        # if not info.context.user.is_authenticated:
        #    return None
        return BusinessTrip.objects.all()

    def resolve_electricities(self, info, **kwargs):
        """Yields all heating consumption objects"""
        # if not info.context.user.is_authenticated:
        #    return None
        return Electricity.objects.all()

    def resolve_heatings(self, info, **kwargs):
        """Yields all heating consumption objects"""
        # if not info.context.user.is_authenticated:
        #    return None
        return Heating.objects.all()

    def resolve_commutingss(self, info, **kwargs):
        """Yields all heating consumption objects"""
        # if not info.context.user.is_authenticated:
        #    return None
        return Commuting.objects.all()

    def resolve_working_groups(self, info, **kwargs):
        """Yields all working group objects"""
        # if not info.context.user.is_authenticated:
        #    return None
        return WorkingGroup.objects.all()

    def resolve_heating_aggregated(
        self, info, group_id=None, inst_id=None, time_interval="month", **kwargs
    ):
        """
        Yields monthly co2e emissions (per capita) of heating consumption
        - for a group (if group_id is given),
        - for an institution (if inst_id is given)
        param: group_id:  id of WorkingGroup model (str)
        param: inst_id:  id of Institute model (str)
        param: time_interval: Aggregate co2e per "month" or "year"
        """
        # Get relevant data entries
        if group_id:
            entries = Heating.objects.filter(working_group__id=group_id)
        elif inst_id:
            entries = Heating.objects.filter(
                working_group__institution__id=inst_id
            )
        else:
            entries = Heating.objects.all()

        metrics = {"co2e": Sum("co2e"), "co2e_cap": Sum("co2e_cap")}

        # Annotate based on groupby
        # if groupby == "total":
        #    return not entries.annotate(date=Value('total', output_field=CharField()))\
        #        .values('date')\
        #        .annotate(co2e=Sum("co2e"))\
        #        .order_by('date')
        #        #.annotate(co2e_cap=Sum("co2e_cap"))\
        #       #.order_by('date')
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

    def resolve_electricity_aggregated(
        self, info, group_id=None, inst_id=None, time_interval="month", **kwargs
    ):
        """
        Yields monthly co2e emissions of electricity consumption
        - for a group (if group_id is given),
        - for an institutions (if inst_id is given)
        param: group_id: id of WorkingGroup model (str)
        param: inst_id: id of Institute model (str)
        param: time_interval: Aggregate co2e per "month" or "year"
        """
        if group_id:
            entries = Electricity.objects.filter(working_group__id=group_id)
        elif inst_id:
            entries = Electricity.objects.filter(
                working_group__institution__id=inst_id
            )
        else:
            entries = Electricity.objects.all()
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

    def resolve_businesstrip_aggregated(
        self,
        info,
        username=None,
        group_id=None,
        inst_id=None,
        time_interval="monthly",
        **kwargs,
    ):
        """
        Yields monthly co2e emissions of businesstrips
        - for a user (if username is given),
        - for a group (if group_id is given),
        - for an institution (if inst_id is given)
        param: username: username of user model (str)
        param: group_id: id of WorkingGroup model (str)
        param: inst_id: id of Institute model (str)
        param: time_interval: Aggregate co2e per "month" or "year"
        """
        if username:
            entries = BusinessTrip.objects.filter(user__username=username)
        elif group_id:
            entries = BusinessTripGroup.objects.filter(working_group__id=group_id)
        elif inst_id:
            entries = BusinessTripGroup.objects.filter(
                working_group__institution__id=inst_id
            )
        else:
            entries = BusinessTrip.objects.all()

        metrics = {
            "co2e": Sum("co2e"),
        }
        if not username:
            metrics["co2e_cap"] = Sum("co2e_cap")

        if time_interval.lower() == "month":
            return (
                entries.annotate(date=TruncMonth("timestamp"))
                .values("date")
                .annotate(**metrics)
                .order_by("date")
            )
        elif time_interval.lower() == "year":
            return (
                entries.annotate(date=TruncYear("timestamp"))
                .values("date")
                .annotate(**metrics)
                .order_by("date")
            )
        else:
            raise GraphQLError(
                f"'{time_interval}' is not a valid option for parameter 'time_interval'."
            )

    def resolve_commuting_aggregated(
        self,
        info,
        username=None,
        group_id=None,
        inst_id=None,
        time_interval="monthly",
        **kwargs,
    ):
        """
        Yields monthly co2e emissions of businesstrips
        - for a user (if username is given),
        - for a group (if group_id is given),
        - for an institution (if inst_id is given)
        param: username: username of user model (str)
        param: group_id: id of WorkingGroup model (str)
        param: inst_id: id of Institute model (str)
        param: time_interval: Aggregate co2e per "month" or "year"
        """
        metrics = {
            "co2e": Sum("co2e"),
            "co2e_cap": Sum("co2e_cap"),
        }
        if username:
            entries = Commuting.objects.filter(user__username=username)
            metrics.pop("co2e_cap")
        elif group_id:
            entries = CommutingGroup.objects.filter(working_group__id=group_id)
        elif inst_id:
            entries = CommutingGroup.objects.filter(
                working_group__institution__id=inst_id
            )
        else:
            entries = Commuting.objects.all()

        if time_interval.lower() == "month":
            return (
                entries.annotate(date=TruncMonth("timestamp"))
                .values("date")
                .annotate(**metrics)
                .order_by("date")
            )
        elif time_interval.lower() == "year":
            return (
                entries.annotate(date=TruncYear("timestamp"))
                .values("date")
                .annotate(**metrics)
                .order_by("date")
            )
        else:
            raise GraphQLError(
                f"'{time_interval}' is not a valid option for parameter 'time_interval'."
            )


# -------------- Input Object Types --------------------------


class CommutingInput(graphene.InputObjectType):
    """GraphQL Input type for commuting"""

    id = graphene.ID()
    username = graphene.String(required=True)
    from_timestamp = graphene.Date(required=True)
    to_timestamp = graphene.Date(required=True)
    transportation_mode = graphene.String(required=True)
    workweeks = graphene.Int()
    distance = graphene.Float()
    size = graphene.String()
    fuel_type = graphene.String()
    occupancy = graphene.Float()
    passengers = graphene.Int()


class BusinessTripInput(graphene.InputObjectType):
    """GraphQL Input type for Business trips"""

    id = graphene.ID()
    username = graphene.String(required=True)
    group_id = graphene.ID(required=True)
    timestamp = graphene.Date(required=True)
    transportation_mode = graphene.String(required=True)
    start = graphene.String()
    destination = graphene.String()
    distance = graphene.Float()
    size = graphene.String()
    fuel_type = graphene.String()
    occupancy = graphene.Float()
    seating_class = graphene.Int()
    passengers = graphene.Int()
    roundtrip = graphene.Boolean()


class ElectricityInput(graphene.InputObjectType):
    """GraphQL Input type for electricity"""

    id = graphene.ID()
    group_id = graphene.ID(reqired=True)
    timestamp = graphene.Date(required=True)
    consumption = graphene.Float()
    fuel_type = graphene.String(required=True)
    building = graphene.String(required=True)
    group_share = graphene.Float(required=True)


class HeatingInput(graphene.InputObjectType):
    """GraphQL Input type for heating"""

    id = graphene.ID()
    group_id = graphene.ID(reqired=True)
    timestamp = graphene.Date(required=True)
    consumption = graphene.Float(required=True)
    unit = graphene.String(required=True)
    fuel_type = graphene.String(required=True)
    building = graphene.String(required=True)
    group_share = graphene.Float(required=True)


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


class SetWorkingGroup(graphene.Mutation):
    """GraphQL mutation to set working group of user"""

    class Arguments:
        """Assign input type"""

        pass

    def mutate(root, info, input=None):
        """Process incoming data"""
        pass


class CreateElectricity(graphene.Mutation):
    """GraphQL mutation for electricity"""

    class Arguments:
        """Assign input type"""
        input = ElectricityInput(required=True)

    ok = graphene.Boolean()
    electricity = graphene.Field(ElectricityType)

    # @login_required
    @staticmethod
    def mutate(root, info, input=None):
        """Process incoming data"""
        ok = True
        matches = WorkingGroup.objects.filter(id=input.group_id)
        if len(matches) == 0:
            raise GraphQLError(
                f"Permission denied: Could add electricity data, because user '{input.username}' "
                f"is not a group representative."
            )
        else:
            working_group = matches[0]

        # Calculate co2
        co2e = calc_co2_electricity(
            input.consumption, input.fuel_type, input.group_share
        )
        new_electricity = Electricity(
            working_group=working_group,
            timestamp=input.timestamp,
            consumption=input.consumption,
            fuel_type=input.fuel_type,
            group_share=input.group_share,
            building=input.building,
            co2e=round(co2e, 1),
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

    # @login_required
    @staticmethod
    def mutate(root, info, input=None):
        """Process incoming data"""
        ok = True
        matches = WorkingGroup.objects.filter(id=input.group_id)
        if len(matches) == 0:
            raise GraphQLError(
                f"Permission denied: Could add electricity data, because user '{input.username}' "
                f"is not a group representative."
            )
        else:
            working_group = matches[0]

        # calculate co2
        co2e = calc_co2_heating(
            input.consumption, input.unit, input.fuel_type, input.group_share
        )
        new_heating = Heating(
            working_group=working_group,
            timestamp=input.timestamp,
            consumption=input.consumption,
            fuel_type=input.fuel_type,
            building=input.building,
            group_share=input.group_share,
            co2e=round(co2e, 1),
        )
        new_heating.save()
        return CreateHeating(ok=ok, heating=new_heating)

class CreateBusinessTrip(graphene.Mutation):
    """GraphQL mutation for business trips"""

    class Arguments:
        """Assign input type"""

        input = BusinessTripInput(required=True)

    ok = graphene.Boolean()
    # businesstrip = graphene.Field(BusinessTripType)

    # @login_required
    @staticmethod
    def mutate(root, info, input=None):
        """Process incoming data"""
        ok = True
        user = CustomUser.objects.filter(username=input.username)
        if len(user) == 0:
            print(f"{input.username} user not found")

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
            user=user[0],
            working_group=user[0].working_group,
        )
        businesstrip_instance.save()

        return CreateBusinessTrip(ok=ok)


class CreateCommuting(graphene.Mutation):
    """GraphQL mutation for commuting"""

    class Arguments:
        """Assign input type"""

        input = CommutingInput(required=True)

    ok = graphene.Boolean()
    # commute = graphene.Field(CommutingType)

    # @login_required
    @staticmethod
    def mutate(root, info, input=None):
        """Process incoming data"""
        ok = True
        user = CustomUser.objects.filter(username=input.username)
        if len(user) == 0:
            raise GraphQLError(f"{input.username} user not found")
        user = user[0]
        if input.workweeks is None:
            input.workweeks = WEEKS_PER_YEAR

        # calculate co2
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


schema = graphene.Schema(query=Query, mutation=Mutation)
