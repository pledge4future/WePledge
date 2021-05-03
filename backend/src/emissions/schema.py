import graphene
from graphene_django.types import DjangoObjectType, ObjectType
from graphql import GraphQLError
from graphql_auth.schema import UserQuery, MeQuery
from emissions.models import BusinessTrip, User, Electricity, WorkingGroup, Heating
from co2calculator.co2calculator.calculate import calc_co2_electricity, calc_co2_heating, calc_co2_businesstrip


# -------------- GraphQL Types -------------------
# Create a GraphQL type for the business trip model
class BusinessTripType(DjangoObjectType):
    class Meta:
        model = BusinessTrip


# Create a GraphQL type for the electricity model
class ElectricityType(DjangoObjectType):
    class Meta:
        model = Electricity


# Create a GraphQL type for the electricity model
class HeatingType(DjangoObjectType):
    class Meta:
        model = Heating


# Create a GraphQL type for the electricity model
class UserType(DjangoObjectType):
    class Meta:
        model = User


# -------------------- Query types -----------------

# Create a Query type
class Query(UserQuery, MeQuery, ObjectType):
    businesstrip = graphene.Field(BusinessTripType, id=graphene.Int())
    businesstrips = graphene.List(BusinessTripType)
    electricity = graphene.Field(ElectricityType, id=graphene.Int())
    electricities = graphene.List(ElectricityType)
    heating = graphene.Field(HeatingType, id=graphene.Int())
    heatings = graphene.List(HeatingType)
    user = graphene.Field(UserType, id=graphene.Int(), username=graphene.String())

    def resolve_businesstrips(self, info, **kwargs):
        return BusinessTrip.objects.all()

    def resolve_electricities(self, info, **kwargs):
        return Electricity.objects.all()

    def resolve_heatings(self, info, **kwargs):
        return Heating.objects.all()

    def resolve_user(self, info, **kwargs):
        id = kwargs.get('id')
        if id is not None:
            return User.objects.get(id=id)
        username = kwargs.get('username')
        if username is not None:
            return User.objects.get(username=username)
        return None


# -------------- Input Object Types --------------------------

class BusinessTripInput(graphene.InputObjectType):
    id = graphene.ID()
    userid = graphene.Int(required=True)
    workinggroupid = graphene.Int(required=False)
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
    first_name = graphene.String()
    last_name = graphene.String()
    is_representative = graphene.Boolean()
    username = graphene.String()


# --------------- Mutations ------------------------------------

class UpdateUser(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        input = UserInput(required=True)

    ok = graphene.Boolean()
    user = graphene.Field(UserType)

    @staticmethod
    def mutate(root, info, id, input=None):
        ok = False
        user_instance = User.objects.get(id=id)
        if user_instance:
            ok = True
            if input.first_name:
                user_instance.first_name = input.first_name
            if input.last_name:
                user_instance.last_name = input.last_name
            if input.email:
                user_instance.email = input.email
            if input.is_representative:
                user_instance.is_representative = input.is_representative
            user_instance.save()
            return UpdateUser(ok=ok, user=user_instance)
        return UpdateUser(ok=ok, user=None)


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


class Mutation(graphene.ObjectType):
    create_businesstrip = CreateBusinessTrip.Field()
    create_electricity = CreateElectricity.Field()
    create_heating = CreateHeating.Field()
    update_user = UpdateUser.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)