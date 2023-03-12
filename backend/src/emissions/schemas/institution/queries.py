import graphene

from emissions.models import Institution
from .types import InstitutionType
from ...utils.base import BaseQuery


class InstitutionQuery(BaseQuery):

	institutions = graphene.List(InstitutionType)

	def resolve_institutions(self, info, **kwargs):
		"""Yields all institution objects"""
		return Institution.objects.all()
