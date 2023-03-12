import graphene
from graphene_django.types import DjangoObjectType, ObjectType

from emissions.models import Commuting


class CommutingType(DjangoObjectType):
    """GraphQL Commuting Type"""

    class Meta:
        """Assign django model"""

        model = Commuting

class CommutingAggregatedType(ObjectType):
    """GraphQL Commuting aggregated by month or year"""

    date = graphene.String(description="Date")
    co2e = graphene.Float(description="Total CO2e emissions [tco2e]")
    co2e_cap = graphene.Float(description="CO2e emissions per capita [tco2e]")

    class Meta:
        """Assign django model"""

        name = "CommutingAggregated"


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
