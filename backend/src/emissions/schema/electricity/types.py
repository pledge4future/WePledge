import graphene
from graphene_django.types import DjangoObjectType, ObjectType

from emissions.models import Electricity

class ElectricityType(DjangoObjectType):
    """GraphQL Electricity Type"""

    class Meta:
        """Assign django model"""

        model = Electricity


class ElectricityAggregatedType(ObjectType):
    """GraphQL Electricity aggregated by month or year"""

    date = graphene.String(description="Date")
    co2e = graphene.Float(description="Total CO2e emissions [tco2e]")
    co2e_cap = graphene.Float(description="CO2e emissions per capita [tco2e]")

    class Meta:
        """Assign django model"""

        name = "ElectricityAggregated"

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