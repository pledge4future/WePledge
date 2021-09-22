import graphene
from django.db.models import Sum, CharField, Value
from django.db.models.functions import TruncMonth, TruncYear
from graphene_django.types import DjangoObjectType, ObjectType
from graphql import GraphQLError
from graphql_auth.schema import UserQuery, MeQuery
from graphql_auth import mutations
from emissions.models import BusinessTrip, User, Electricity, WorkingGroup, Heating, Institution, Commuting, CommutingGroup
from co2calculator.co2calculator.calculate import calc_co2_electricity, calc_co2_heating, calc_co2_businesstrip, calc_co2_commuting
from graphene_django.filter import DjangoFilterConnectionField
from emissions.graphene_utils import get_fields

import numpy as np

# -------------- GraphQL Types -------------------

WEEKS_PER_MONTH = 4.34524
WEEKS_PER_YEAR = 52.1429

class UserType(DjangoObjectType):
    class Meta:
        model = User


class WorkingGroupType(DjangoObjectType):
    class Meta:
        model = WorkingGroup


class InstitutionType(DjangoObjectType):
    class Meta:
        model = Institution


class BusinessTripType(DjangoObjectType):
    class Meta:
        model = BusinessTrip

class CommutingType(DjangoObjectType):
    class Meta:
        model = Commuting

class ElectricityType(DjangoObjectType):
    class Meta:
        model = Electricity


class HeatingType(DjangoObjectType):
    class Meta:
        model = Heating


class HeatingAggregatedType(ObjectType):
    date = graphene.String()
    co2e = graphene.Float()
    co2e_cap = graphene.Float()

    class Meta:
        name = "HeatingAggregated"
        filter_fields = ['group_id']


class ElectricityAggregatedType(ObjectType):
    date = graphene.String()
    co2e = graphene.Float()
    co2e_cap = graphene.Float()

    class Meta:
        name = "ElectricityAggregated"


class BusinessTripAggregatedType(ObjectType):
    date = graphene.String()
    co2e = graphene.Float()
    co2e_cap = graphene.Float()

    class Meta:
        name = "BusinessTripAggregated"


class CommutingAggregatedType(ObjectType):
    date = graphene.String()
    co2e = graphene.Float()
    co2e_cap = graphene.Float()

    class Meta:
        name = "CommutingAggregated"

# -------------------- Query types -----------------

# Create a Query type
class Query(UserQuery, MeQuery, ObjectType):
    businesstrips = graphene.List(BusinessTripType)
    electricities = graphene.List(ElectricityType)
    heatings = graphene.List(HeatingType)
    commutings = graphene.List(CommutingType)
    working_groups = graphene.List(WorkingGroupType)

    # Aggregated data
    heating_aggregated = graphene.List(HeatingAggregatedType,
                                    group_id=graphene.UUID(),
                                    inst_id=graphene.UUID(),
                                    time_interval=graphene.String())
    electricity_aggregated = graphene.List(ElectricityAggregatedType,
                                        group_id=graphene.UUID(),
                                        inst_id=graphene.UUID(),
                                        time_interval=graphene.String())
    businesstrip_aggregated = graphene.List(BusinessTripAggregatedType,
                                         username=graphene.String(),
                                         group_id=graphene.UUID(),
                                         inst_id=graphene.UUID(),
                                         time_interval=graphene.String())
    commuting_aggregated = graphene.List(CommutingAggregatedType,
                                         username=graphene.String(),
                                         group_id=graphene.UUID(),
                                         inst_id=graphene.UUID(),
                                         time_interval=graphene.String())

    def resolve_businesstrips(self, info, **kwargs):
        """ Yields all heating consumption objects"""
        return BusinessTrip.objects.all()

    def resolve_electricities(self, info, **kwargs):
        """ Yields all heating consumption objects"""
        return Electricity.objects.all()

    def resolve_heatings(self, info, **kwargs):
        """ Yields all heating consumption objects"""
        return Heating.objects.all()

    def resolve_commutingss(self, info, **kwargs):
        """ Yields all heating consumption objects"""
        return Commuting.objects.all()

    def resolve_working_groups(self, info, **kwargs):
        """ Yields all working group objects """
        return WorkingGroup.objects.all()

    def resolve_heating_aggregated(self, info, group_id=None, inst_id=None, time_interval="month", **kwargs):
        """
        Yields monthly co2e emissions (per capita) of heating consumption
        - for a group (if group_id is given),
        - for an institution (if inst_id is given)
        param: username: username of user model (str)
        param: group_id: UUID id of WorkingGroup model (str)
        param: inst_id: UUID id of Institute model (str)
        param: time_interval: Aggregate co2e per "month" or "year"
        """
        # Get relevant data entries
        if group_id:
            entries = Heating.objects.filter(working_group__group_id=group_id)
        elif inst_id:
            entries = Heating.objects.filter(working_group__institution__inst_id=inst_id)
        else:
            entries = Heating.objects.all()

        metrics = {
            'co2e': Sum('co2e'),
            'co2e_cap': Sum('co2e_cap')
        }

        # Annotate based on groupby
        #if groupby == "total":
        #    return not entries.annotate(date=Value('total', output_field=CharField()))\
        #        .values('date')\
        #        .annotate(co2e=Sum("co2e"))\
        #        .order_by('date')
        #        #.annotate(co2e_cap=Sum("co2e_cap"))\
         #       #.order_by('date')
        if time_interval == "month":
            return entries.annotate(date=TruncMonth('timestamp')).values('date').annotate(**metrics).order_by('date')
        elif time_interval == "year":
            return entries.annotate(date=TruncYear('timestamp'))\
                .values('date')\
                .annotate(**metrics) \
                .order_by('date')
        else:
            raise GraphQLError(f"Invalid option {time_interval} for 'time_interval'.")

    def resolve_electricity_aggregated(self, info, group_id=None, inst_id=None, time_interval="month", **kwargs):
        """
        Yields monthly co2e emissions of electricity consumption
        - for a group (if group_id is given),
        - for an institutions (if inst_id is given)
        param: username: username of user model (str)
        param: group_id: UUID id of WorkingGroup model (str)
        param: inst_id: UUID id of Institute model (str)
        param: time_interval: Aggregate co2e per "month" or "year"
        """
        if group_id:
            entries = Electricity.objects.filter(working_group__group_id=group_id)
        elif inst_id:
            entries = Electricity.objects.filter(working_group__institution__inst_id=inst_id)
        else:
            entries = Electricity.objects.all()
        metrics = {
            'co2e': Sum('co2e'),
            'co2e_cap': Sum('co2e_cap')
        }
        if time_interval == "month":
            return entries.annotate(date=TruncMonth('timestamp')).values('date').annotate(**metrics).order_by('date')
        elif time_interval == "year":
            return entries.annotate(date=TruncYear('timestamp'))\
                .values('date')\
                .annotate(**metrics) \
                .order_by('date')
        else:
            raise GraphQLError(f"Invalid option {time_interval} for 'time_interval'.")

    def resolve_businesstrip_aggregated(self, info, username=None, group_id=None, inst_id=None, time_interval="monthly", **kwargs):
        """
        Yields monthly co2e emissions of businesstrips
        - for a user (if username is given),
        - for a group (if group_id is given),
        - for an institution (if inst_id is given)
        param: username: username of user model (str)
        param: group_id: UUID id of WorkingGroup model (str)
        param: inst_id: UUID id of Institute model (str)
        param: time_interval: Aggregate co2e per "month" or "year"
        """
        if group_id:
            entries = BusinessTrip.objects.filter(working_group__group_id=group_id)
        elif username:
            entries = BusinessTrip.objects.filter(user__username=username)
        elif inst_id:
            entries = BusinessTrip.objects.filter(working_group__institution__inst_id=inst_id)
        else:
            entries = BusinessTrip.objects.all()

        metrics = {
            'co2e': Sum('co2e'),
        }

        if time_interval == "month":
            return entries.annotate(date=TruncMonth('timestamp')).values('date').annotate(**metrics).order_by('date')
        elif time_interval == "year":
            return entries.annotate(date=TruncYear('timestamp'))\
                .values('date')\
                .annotate(**metrics) \
                .order_by('date')
        else:
            raise GraphQLError(f"Invalid option {time_interval} for 'time_interval'.")


    def resolve_commuting_aggregated(self, info, username=None, group_id=None, inst_id=None, time_interval="monthly", **kwargs):
        """
        Yields monthly co2e emissions of businesstrips
        - for a user (if username is given),
        - for a group (if group_id is given),
        - for an institution (if inst_id is given)
        param: username: username of user model (str)
        param: group_id: UUID id of WorkingGroup model (str)
        param: inst_id: UUID id of Institute model (str)
        param: time_interval: Aggregate co2e per "month" or "year"
        """
        if group_id:
            entries = Commuting.objects.filter(working_group__group_id=group_id)
        elif username:
            entries = Commuting.objects.filter(user__username=username)
        elif inst_id:
            entries = Commuting.objects.filter(working_group__institution__inst_id=inst_id)
        else:
            entries = Commuting.objects.all()

        metrics = {
            'co2e': Sum('co2e'),
        }

        if time_interval == "month":
            return entries.annotate(date=TruncMonth('timestamp')).values('date').annotate(**metrics).order_by('date')
        elif time_interval == "year":
            return entries.annotate(date=TruncYear('timestamp'))\
                .values('date')\
                .annotate(**metrics) \
                .order_by('date')
        else:
            raise GraphQLError(f"Invalid option {time_interval} for 'time_interval'.")







# -------------- Input Object Types --------------------------


class CommutingInput(graphene.InputObjectType):
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
    id = graphene.ID()
    username = graphene.String(required=True)
    group_id = graphene.Int(required=False)
    start = graphene.String()
    destination = graphene.String()
    distance = graphene.Float()
    timestamp = graphene.Date(required=True)
    transportation_mode = graphene.String(required=True)
    car_size = graphene.Int()
    car_fuel_type = graphene.String()
    bus_size = graphene.Int()
    bus_fuel_type = graphene.String()
    capacity = graphene.Int()
    occupancy = graphene.Float()
    passengers = graphene.Int()
    roundtrip = graphene.Boolean()


class ElectricityInput(graphene.InputObjectType):
    id = graphene.ID()
    username = graphene.String()
    consumption_kwh = graphene.Float()
    timestamp = graphene.Date(required=True)
    fuel_type = graphene.String(required=True)


class HeatingInput(graphene.InputObjectType):
    id = graphene.ID()
    username = graphene.String()
    consumption_kwh = graphene.Float()
    consumption_kg = graphene.Float()
    consumption_liter = graphene.Float()
    timestamp = graphene.Date(required=True)
    fuel_type = graphene.String(required=True)


class UserInput(graphene.InputObjectType):
    id = graphene.ID()
    workinggroupid = graphene.Int()
    email = graphene.String()
    username = graphene.String()
    first_name = graphene.String()
    last_name = graphene.String()
    is_representative = graphene.Boolean()


# --------------- Mutations ------------------------------------

class AuthMutation(graphene.ObjectType):
   register = mutations.Register.Field()
   verify_account = mutations.VerifyAccount.Field()
   token_auth = mutations.ObtainJSONWebToken.Field()
   update_account = mutations.UpdateAccount.Field()
   resend_activation_email = mutations.ResendActivationEmail.Field()
   send_password_reset_email = mutations.SendPasswordResetEmail.Field()
   password_reset = mutations.PasswordReset.Field()
   password_change = mutations.PasswordChange.Field()


class CreateElectricity(graphene.Mutation):
    class Arguments:
        input = ElectricityInput(required=True)

    ok = graphene.Boolean()
    electricity = graphene.Field(ElectricityType)

    @staticmethod
    def mutate(root, info, input=None):
        ok = True
        usr = User.objects.filter(username=input.username)[0]
        matches = WorkingGroup.objects.filter(representative=usr)
        if len(matches) == 0:
            raise GraphQLError(f"Permission denied: Could add electricity data, because user '{input.username}' is not a group representative.")
        else:
            workinggroup = matches[0]

        print(workinggroup)

        # calculate co2
        co2e = calc_co2_electricity(input.consumption_kwh, input.fuel_type)
        new_electricity = Electricity(working_group=workinggroup,
                                      timestamp=input.timestamp,
                                      consumption_kwh=input.consumption_kwh,
                                      fuel_type=input.fuel_type,
                                      co2e=round(co2e, 1))
        new_electricity.save()
        return CreateElectricity(ok=ok, electricity=new_electricity)


class CreateHeating(graphene.Mutation):
    class Arguments:
        input = HeatingInput(required=True)

    ok = graphene.Boolean()
    heating = graphene.Field(HeatingType)

    @staticmethod
    def mutate(root, info, input=None):
        ok = True
        usr = User.objects.filter(username=input.username)[0]
        matches = WorkingGroup.objects.filter(representative=usr)
        if len(matches) == 0:
            raise GraphQLError(f"Permission denied: Could add heating data, because user '{input.username}' is not a group representative.")
        else:
            workinggroup = matches[0]

        # calculate co2
        co2e = calc_co2_heating(input.consumption_kwh, input.fuel_type)
        new_heating = Heating(working_group=workinggroup,
                              timestamp=input.timestamp,
                              consumption_kwh=input.consumption_kwh,
                              fuel_type=input.fuel_type,
                              co2e=round(co2e, 1))
        new_heating.save()
        return CreateHeating(ok=ok, heating=new_heating)


class CreateBusinessTrip(graphene.Mutation):
    class Arguments:
        input = BusinessTripInput(required=True)

    ok = graphene.Boolean()
    businesstrip = graphene.Field(BusinessTripType)

    @staticmethod
    def mutate(root, info, input=None):
        ok = True
        user = User.objects.filter(id=input.userid)
        if len(user) == 0:
            print("{} user not found".format(input.userid))

        co2e = calc_co2_businesstrip(start=input.start,
                                    destination=input.destination,
                                    distance=input.distance,
                                    transportation_mode=input.transportation_mode,
                                    car_size=input.car_size,
                                    car_fuel_type=input.car_fuel_type,
                                    bus_size=input.bus_size,
                                    bus_fuel_type=input.bus_fuel_type,
                                    capacity=input.capacity,
                                    occupancy=input.occupancy,
                                    passengers=input.passengers,
                                    roundtrip=input.roundtrip)
        businesstrip_instance = BusinessTrip(timestamp=input.timestamp,
                                             distance=input.distance,
                                             co2e=co2e,
                                             user=user[0],
                                             working_group=user[0].working_group)
        businesstrip_instance.save()
        return CreateBusinessTrip(ok=ok, businesstrip=businesstrip_instance)



class CreateCommuting(graphene.Mutation):
    class Arguments:
        input = CommutingInput(required=True)

    ok = graphene.Boolean()
    #commute = graphene.Field(CommutingType)

    @staticmethod
    def mutate(root, info, input=None):
        ok = True
        user = User.objects.filter(username=input.username)
        if len(user) == 0:
            raise GraphQLError(f"{input.username} user not found")
        user = user[0]
        dates = np.arange(np.datetime64(input.from_timestamp, "M"),
                            np.datetime64(input.to_timestamp, "M") + np.timedelta64(1, 'M'),
                            np.timedelta64(1, "M")).astype('datetime64[D]')

        weekly_co2e = calc_co2_commuting(transportation_mode=input.transportation_mode,
                                         weekly_distance=input.distance,
                                         size=input.size,
                                         fuel_type=input.fuel_type,
                                         occupancy=input.occupancy,
                                         passengers=input.passengers
                                         )
        if input.workweeks is None:
            input.workweeks = WEEKS_PER_YEAR
        monthly_co2e = WEEKS_PER_MONTH * (input.workweeks / WEEKS_PER_YEAR) * weekly_co2e

        for d in dates:
            commuting_instance = Commuting(timestamp=str(d),
                                            distance=input.distance,
                                            transportation_mode=input.transportation_mode,
                                            co2e=monthly_co2e,
                                            user=user,
                                            working_group=user.working_group)
            commuting_instance.save()

            # Update emissions of working group for date and transportation mode
            entries = Commuting.objects.filter(working_group=user.working_group,
                                               transportation_mode=input.transportation_mode,
                                               timestamp=str(d))
            metrics = {
                "co2e": Sum("co2e"),
                "distance": Sum("distance")
            }
            group_data = entries.aggregate(**metrics)

            co2e_cap = group_data["co2e"] / user.working_group.n_employees
            commuting_group_instance = CommutingGroup(working_group=user.working_group,
                                                      timestamp=str(d),
                                                      transportation_mode=input.transportation_mode,
                                                      n_employees=user.working_group.n_employees,
                                                      co2e=group_data["co2e"],
                                                      co2e_cap=co2e_cap,
                                                      distance=group_data["distance"])
            commuting_group_instance.save()


        return CreateCommuting(ok=ok)



class Mutation(AuthMutation, graphene.ObjectType):
    create_businesstrip = CreateBusinessTrip.Field()
    create_electricity = CreateElectricity.Field()
    create_heating = CreateHeating.Field()
    create_commuting = CreateCommuting.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)