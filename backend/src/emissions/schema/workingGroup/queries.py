import graphene
from graphene_django.types import ObjectType
from graphql_auth.schema import UserQuery, MeQuery
from graphql_jwt.decorators import login_required
from django.db.models import Sum, F
from django.db.models.functions import TruncMonth, TruncYear

from .types import WorkingGroupType
from emissions.models import WorkingGroup


class Query(UserQuery, MeQuery, ObjectType):

	workinggroups = graphene.List(WorkingGroupType)

	@login_required
	def resolve_workinggroups(self, info, **kwargs):
		"""Yields all working group objects"""
		return WorkingGroup.objects.all()


