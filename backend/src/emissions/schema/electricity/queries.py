import graphene
from graphene_django.types import ObjectType
from graphql_auth.schema import UserQuery, MeQuery
from graphql import GraphQLError
from graphql_jwt.decorators import login_required
from django.db.models import Sum
from django.db.models.functions import TruncMonth, TruncYear

from .types import ElectricityType, ElectricityAggregatedType

from emissions.models import Electricity


class Query(UserQuery, MeQuery, ObjectType):

	electricities = graphene.List(ElectricityType)

	electricity_aggregated = graphene.List(
        ElectricityAggregatedType,
        level=graphene.String(
            description="Aggregation level: group or institution. Default: group"
        ),
        time_interval=graphene.String(
            description="Time interval for aggregation (month or year)"
        ),
    )

	@login_required
	def resolve_electricities(self, info, **kwargs):
		"""Yields all heating consumption objects"""
		user = info.context.user
		return Electricity.objects.all(working_group__id=user.working_group.id)
	
	@login_required
	def resolve_electricity_aggregated(
		self, info, level="group", time_interval="month", **kwargs
	):
		"""
		Yields monthly co2e emissions (per capita) of electricity consumption, for the user, their group or their institution
		param: level: Aggregation level: group or institution. Default: group
		param: time_interval: Aggregate co2e per "month" or "year"
		"""
		user = info.context.user
		if user.working_group is None:
			raise GraphQLError("No heating data available, since user is not assigned to any working group yet.")

		# Get relevant data entries
		if level == "personal":
			entries = Electricity.objects.filter(working_group__id=user.working_group.id)
			# Use the average co2e emissions per capital as total emissons for one person
			metrics = {"co2e": Sum("co2e_cap"), "co2e_cap": Sum("co2e_cap")}
		elif level == "group":
			entries = Electricity.objects.filter(working_group__id=user.working_group.id)
			metrics = {"co2e": Sum("co2e"), "co2e_cap": Sum("co2e_cap")}
		elif level == "institution":
			entries = Electricity.objects.filter(
				working_group__institution__id=user.working_group.institution.id
			)
			metrics = {"co2e": Sum("co2e"), "co2e_cap": Sum("co2e_cap")}
		else:
			raise GraphQLError(f"Invalid value for parameter 'level': {level}")

		if time_interval == "month":
			return (
				entries.annotate(date=TruncMonth("timestamp"))
				.values("date")
				.annotate(**metrics)
				.order_by("date")
			)
		elif time_interval == "year":
			return (
				entries.annotate(date=TruncYear("timestamp"))
				.values("date")
				.annotate(**metrics)
				.order_by("date")
			)
		else:
			raise GraphQLError(f"Invalid option {time_interval} for 'time_interval'.")



