import graphene
from graphene_django.types import DjangoObjectType, ObjectType

from emissions.models import Heating

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