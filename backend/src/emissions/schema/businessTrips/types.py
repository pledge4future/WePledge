import graphene
from graphene_django.types import DjangoObjectType, ObjectType

from emissions.models import BusinessTrip


class BusinessTripType(DjangoObjectType):
    """GraphQL Business Trip Type"""

    class Meta:
        """Assign django model"""

        model = BusinessTrip


class BusinessTripAggregatedType(ObjectType):
    """GraphQL Business Trips aggregated by month or year"""

    date = graphene.String(description="Date")
    co2e = graphene.Float(description="Total CO2e emissions [tco2e]")
    co2e_cap = graphene.Float(description="CO2e emissions per capita [tco2e]")

    class Meta:
        """Assign django model"""

        name = "BusinessTripAggregated"


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
    seating_class = graphene.String(description="Seating class in plane")
    passengers = graphene.Int(description="Number of passengers")
    roundtrip = graphene.Boolean(description="Roundtrip [True/False]")


class PlanTripInput(graphene.InputObjectType):
    """GraphQL Input type for the trip planner"""

    transportation_mode = graphene.String(
        required=True, description="Transportation mode"
    )
    start_address = graphene.String(description="Start address")
    start_city = graphene.String(description="Start city")
    start_country = graphene.String(description="Start country")
    destination_address = graphene.String(description="Destination address")
    destination_city = graphene.String(description="Destination city")
    destination_country = graphene.String(description="Destination country")
    distance = graphene.Float(description="Distance [meter]")
    size = graphene.String(description="Size of the vehicle")
    fuel_type = graphene.String(description="Fuel type of the vehicle")
    occupancy = graphene.Float(description="Occupancy")
    seating_class = graphene.String(description="Seating class in plane")
    passengers = graphene.Int(description="Number of passengers")
    roundtrip = graphene.Boolean(description="Roundtrip [True/False]")
