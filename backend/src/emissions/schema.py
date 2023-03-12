#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""GraphQL endpoints"""

__email__ = "infopledge4future.org"


import graphene

# Import Mutations
from .schemas.auth.mutations import AuthMutation
from .schemas.heating.mutations import CreateHeating
from .schemas.electricity.mutations import CreateElectricity
from .schemas.commuting.mutations import CreateCommuting
from .schemas.businessTrip.mutations import CreateBusinessTrip, PlanTrip
from .schemas.workingGroup.mutations import CreateWorkingGroup, SetWorkingGroup


# Import Queries
from graphql_auth.schema import UserQuery, MeQuery
from .schemas.researchField.queries import ResearchFieldsQuery
from .schemas.institution.queries import InstitutionQuery
from .schemas.businessTrip.queries import BusinessTripQuery
from .schemas.commuting.queries import CommutingQuery
from .schemas.electricity.queries import ElectricityQuery
from .schemas.heating.queries import HeatingQuery
from .schemas.workingGroup.queries import WorkingGroupQuery

from .schemas.totalEmissions.queries import TotalEmissionsQuery


# -------------------- Query types -----------------

# Create a Query type
class Query(
    UserQuery,
    MeQuery,
    ResearchFieldsQuery,
    InstitutionQuery,
    BusinessTripQuery,
    CommutingQuery,
    ElectricityQuery,
    HeatingQuery,
    WorkingGroupQuery,
    TotalEmissionsQuery
    ):
    pass


class Mutation(AuthMutation, graphene.ObjectType):
    """GraphQL Mutations"""

    create_businesstrip = CreateBusinessTrip.Field()
    create_electricity = CreateElectricity.Field()
    create_heating = CreateHeating.Field()
    create_commuting = CreateCommuting.Field()
    set_working_group = SetWorkingGroup.Field()
    create_working_group = CreateWorkingGroup.Field()
    plan_trip = PlanTrip.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
