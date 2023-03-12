import graphene

from emissions.models import ResearchField
from .types import ResearchFieldType
from ...utils.base import BaseQuery


class ResearchFieldsQuery(BaseQuery):

	researchfields = graphene.List(ResearchFieldType)

	def resolve_researchfields(self, info, **kwargs):
		"""Yields all reseach field objects"""
		return ResearchField.objects.all()
