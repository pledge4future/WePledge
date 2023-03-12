import graphene

from graphene_django.types import ObjectType



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
