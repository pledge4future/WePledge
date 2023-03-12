import graphene
from graphql_jwt.decorators import login_required


from .types import WorkingGroupType
from emissions.models import WorkingGroup
from ...utils.base import BaseQuery


class WorkingGroupQuery(BaseQuery):

	workinggroups = graphene.List(WorkingGroupType)

	@login_required
	def resolve_workinggroups(self, info, **kwargs):
		"""Yields all working group objects"""
		return WorkingGroup.objects.all()


