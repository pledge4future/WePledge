import graphene
from graphql_jwt.decorators import login_required
from graphql import GraphQLError
from django.core.exceptions import ValidationError

from .types import WorkingGroupType, CreateWorkingGroupInput, SetWorkingGroupInput
from emissions.schema.types import Institution, UserType, ResearchField
from emissions.models import WorkingGroup



class CreateWorkingGroup(graphene.Mutation):
	"""Mutation to create a new working group"""

	class Arguments:
		"""Assign input type"""
		input = CreateWorkingGroupInput()

	success = graphene.Boolean()
	workinggroup = graphene.Field(WorkingGroupType)

	@staticmethod
	@login_required
	def mutate(root, info, input=None):
		"""Process incoming data"""
		user = info.context.user
		success = True

		institution_found = Institution.objects.filter(id=input.institution_id)
		if len(institution_found) == 0:
			raise GraphQLError("Institution not found.")
		else:
			institution = institution_found[0]

		field_found = ResearchField.objects.filter(id=input.research_field_id)
		if len(field_found) == 0:
			raise GraphQLError("Research field is invalid.")
		else:
			research_field = field_found[0]

		# Check if working group already exists
		exists = WorkingGroup.objects.filter(name=input.name, institution=institution)
		if len(exists) > 0:
			raise GraphQLError(
				"This working group cannot be created, because it already exists."
			)
		elif user.is_representative is True:
			raise GraphQLError(
				"This user cannot create a new working group, since they are already the representative of another working group."
			)
		new_workinggroup = WorkingGroup(
			name=input.name,
			institution=institution,
			representative=user,
			field=research_field,
			n_employees=input.n_employees,
			is_public=input.is_public
		)
		new_workinggroup.save()

		user.working_group = new_workinggroup
		user.is_representative = True
		user.save()

		return CreateWorkingGroup(success=success, workinggroup=new_workinggroup)


class SetWorkingGroup(graphene.Mutation):
	"""GraphQL mutation to set working group of user"""

	class Arguments:
		"""Assign input type"""

		input = SetWorkingGroupInput()

	success = graphene.Boolean()
	user = graphene.Field(UserType)

	@staticmethod
	@login_required
	def mutate(root, info, input=None):
		"""Process incoming data"""
		user = info.context.user
		success = True

		# Search matching working groups
		matching_working_groups = WorkingGroup.objects.filter(
			id=input.id
		)
		if len(matching_working_groups) == 0:
			raise GraphQLError("Working group not found.")
		else:
			working_group = matching_working_groups[0]

		setattr(user, "working_group", working_group)
		user.save()

		try:
			user.full_clean()
			user.save()
			return SetWorkingGroup(user=user, success=success)
		except ValidationError as e:
			return SetWorkingGroup(user=user, success=success, errors=e)