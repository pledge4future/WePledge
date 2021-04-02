import graphene
from graphene_django.types import DjangoObjectType, ObjectType
from .models import BusinessTrip, User, Electricity, WorkingGroup, Heating
from co2calculator.co2calculator.calculate import calc_co2_electricity, calc_co2_heating


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
class Query(ObjectType):
    businesstrip = graphene.Field(BusinessTripType, id=graphene.Int())
    businesstrips = graphene.List(BusinessTripType)
    electricity = graphene.Field(ElectricityType, id=graphene.Int())
    electricities = graphene.List(ElectricityType)
    heating = graphene.Field(HeatingType, id=graphene.Int())
    heatings = graphene.List(HeatingType)
    user = graphene.Field(UserType, id=graphene.Int())

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
        return None


# -------------- Input Object Types --------------------------

class BusinessTripInput(graphene.InputObjectType):
    id = graphene.ID()
    userid = graphene.Int()
    date = graphene.Date()
    distance = graphene.Float()
    co2e = graphene.Float()


class ElectricityInput(graphene.InputObjectType):
    id = graphene.ID()
    userid = graphene.Int()
    workinggroupid = graphene.Int()
    consumption_kwh = graphene.Float()
    year = graphene.Int()
    fuel_type = graphene.String()
    co2e = graphene.Int()


class HeatingInput(graphene.InputObjectType):
    id = graphene.ID()
    userid = graphene.Int()
    workinggroupid = graphene.Int()
    consumption_kwh = graphene.Float()
    year = graphene.Int()
    fuel_type = graphene.String()
    cost_kwh = graphene.String()
    co2e = graphene.Int()


class UserInput(graphene.InputObjectType):
    id = graphene.ID()
    workinggroupid = graphene.Int()
    email = graphene.String()
    first_name = graphene.String()
    last_name = graphene.String()
    is_representative = graphene.Boolean()
    password = graphene.String()
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
            if input.password:
                user_instance.password = input.password
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
        matches = WorkingGroup.objects.filter(id=input.workinggroupid)
        if len(matches) == 0:
            print("{} working group not found".format(input.workinggroupid))
        else:
            workinggroup = matches[0]

        # calculate co2
        co2e = calc_co2_electricity(input.consumption_kwh, input.fuel_type)
        new_electricity = Electricity(working_group=workinggroup,
                                  year=input.year,
                                  consumption_kwh=input.consumption_kwh,
                                  fuel_type=input.fuel_type,
                                  co2e=co2e)
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
        matches = WorkingGroup.objects.filter(id=input.workinggroupid)
        if len(matches) == 0:
            print("{} working group not found".format(input.workinggroupid))
        else:
            workinggroup = matches[0]

        # calculate co2
        co2e = calc_co2_heating(input.consumption_kwh, input.fuel_type)
        new_electricity = Electricity(working_group=workinggroup,
                                  year=input.year,
                                  consumption_kwh=input.consumption_kwh,
                                  fuel_type=input.fuel_type,
                                  co2e=co2e)
        new_electricity.save()
        return CreateElectricity(ok=ok, electricity=new_electricity)



class CreateBusinessTrip(graphene.Mutation):
    class Arguments:
        input = BusinessTripInput(required=True)

    ok = graphene.Boolean()
    businesstrip = graphene.Field(BusinessTripType)

    @staticmethod
    def mutate(root, info, input=None):
        ok = True
        # <--------------------- calculate co2e here ----------->
        co2e = input.distance / 10
        user = User.objects.filter(id=input.userid)
        if len(user) == 0:
            print("{} user not found".format(input.userid))

        businesstrip_instance = BusinessTrip(date=input.date, distance=input.distance, co2e=co2e,
                                             user=user[0])
        businesstrip_instance.save()
        return CreateBusinessTrip(ok=ok, businesstrip=businesstrip_instance)


class Mutation(graphene.ObjectType):
    create_businesstrip = CreateBusinessTrip.Field()
    create_electricity = CreateElectricity.Field()
    update_user = UpdateUser.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)