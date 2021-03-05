import graphene
from graphene_django.types import DjangoObjectType, ObjectType
from .models import BusinessTrip, User


# Create a GraphQL type for the actor model
class BusinessTripType(DjangoObjectType):
    class Meta:
        model = BusinessTrip


# Create a Query type
class Query(ObjectType):
    businesstrip = graphene.Field(BusinessTripType, id=graphene.Int())
    businesstrips = graphene.List(BusinessTripType)

    def resolve_businesstrip(self, info, **kwargs):
        id = kwargs.get('id')

        if id is not None:
            return BusinessTrip.objects.get(pk=id)

        return None

    def resolve_businesstrips(self, info, **kwargs):
        return BusinessTrip.objects.all()


# Create Input Object Types
class BusinessTripInput(graphene.InputObjectType):
    id = graphene.ID()
    userid = graphene.Int()
    date = graphene.Date()
    distance = graphene.Float()
    co2e = graphene.Float()


# Create mutations for actors
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
    #update_actor = UpdateB.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)