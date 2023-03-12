import graphene
from graphene_django.types import DjangoObjectType

from emissions.models import WorkingGroup


class WorkingGroupType(DjangoObjectType):
	"""GraphQL Working Group Type"""

	class Meta:
		"""Assign django model"""

		model = WorkingGroup

class CreateWorkingGroupInput(graphene.InputObjectType):
	"""GraphQL Input type for creating a new working group"""

	name = graphene.String(reqired=True, description="Name of the working group")
	institution_id = graphene.String(required=True, description="UUID of institution the working group belongs to")
	research_field_id = graphene.Int(required=True, description="ID of Research field of working group")
	n_employees = graphene.Int(required=True, description="Number of employees of working group")
	is_public = graphene.Boolean(required=True, description="If true, the group will be publicly visible.")


class SetWorkingGroupInput(graphene.InputObjectType):
	"""GraphQL Input type for setting working group"""

	id = graphene.Int(reqired=True, description="ID of the working group")