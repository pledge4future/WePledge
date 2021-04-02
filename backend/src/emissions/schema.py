import graphene
from graphene_django.types import DjangoObjectType, ObjectType
from .models import BusinessTrip, User, Electricity, WorkingGroup, Heating
from co2calculator.co2calculator.calculate import calc_co2_electricity


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


# -------------------- Query types -----------------

# Create a Query type
class Query(ObjectType):
    businesstrip = graphene.Field(BusinessTripType, id=graphene.Int())
    businesstrips = graphene.List(BusinessTripType)
    electricity = graphene.List(ElectricityType, id=graphene.Int())
    electricities = graphene.List(ElectricityType)
    heating = graphene.List(HeatingType, id=graphene.Int())
    heatings = graphene.List(HeatingType)

    def resolve_businesstrips(self, info, **kwargs):
        return BusinessTrip.objects.all()

    def resolve_electricities(self, info, **kwargs):
        return Electricity.objects.all()

    def resolve_heatings(self, info, **kwargs):
        return Heating.objects.all()


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


# --------------- Mutations ------------------------------------

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


schema = graphene.Schema(query=Query, mutation=Mutation)