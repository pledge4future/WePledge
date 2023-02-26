import graphene
from graphene_django.types import DjangoObjectType, ObjectType

from emissions.models import (
    BusinessTrip,
    CustomUser,
    Electricity,
    WorkingGroup,
    Heating,
    Institution,
    Commuting,
    ResearchField,
)


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


class ResearchFieldType(DjangoObjectType):
    """GraphQL Research Field"""

    class Meta:
        """Assign django model"""

        model = ResearchField


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

    date = graphene.String(description="Date")
    co2e = graphene.Float(description="Total CO2e emissions [tco2e]")
    co2e_cap = graphene.Float(description="CO2e emissions per capita [tco2e]")

    class Meta:
        """Assign django model"""

        name = "HeatingAggregated"
        filter_fields = ["id"]


class ElectricityAggregatedType(ObjectType):
    """GraphQL Electricity aggregated by month or year"""

    date = graphene.String(description="Date")
    co2e = graphene.Float(description="Total CO2e emissions [tco2e]")
    co2e_cap = graphene.Float(description="CO2e emissions per capita [tco2e]")

    class Meta:
        """Assign django model"""

        name = "ElectricityAggregated"


class BusinessTripAggregatedType(ObjectType):
    """GraphQL Business Trips aggregated by month or year"""

    date = graphene.String(description="Date")
    co2e = graphene.Float(description="Total CO2e emissions [tco2e]")
    co2e_cap = graphene.Float(description="CO2e emissions per capita [tco2e]")

    class Meta:
        """Assign django model"""

        name = "BusinessTripAggregated"


class CommutingAggregatedType(ObjectType):
    """GraphQL Commuting aggregated by month or year"""

    date = graphene.String(description="Date")
    co2e = graphene.Float(description="Total CO2e emissions [tco2e]")
    co2e_cap = graphene.Float(description="CO2e emissions per capita [tco2e]")

    class Meta:
        """Assign django model"""

        name = "CommutingAggregated"


class TotalEmissionType(ObjectType):
    """GraphQL total emissions"""

    working_group_name = graphene.String(description="Name of the working group")
    working_group_institution_name = graphene.String(
        description="Name of the institution the working group belongs to"
    )
    co2e = graphene.Float(description="Total CO2e emissions [tco2e]")
    co2e_cap = graphene.Float(description="CO2e emissions per capita [tco2e]")

    class Meta:
        """Assign django model"""

        name = "TotalEmission"
