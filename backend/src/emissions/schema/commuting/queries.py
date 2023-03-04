import graphene
from graphene_django.types import ObjectType
from graphql_auth.schema import UserQuery, MeQuery
from graphql import GraphQLError
from graphql_jwt.decorators import login_required
from django.db.models import Sum, F
from django.db.models.functions import TruncMonth, TruncYear

from .types import CommutingType, CommutingAggregatedType
from emissions.models import Commuting, CommutingGroup


class Query(UserQuery, MeQuery, ObjectType):

	commutings = graphene.List(CommutingType)

	commuting_aggregated = graphene.List(
		CommutingAggregatedType,
		level=graphene.String(
			description="Aggregation level: personal, group or institution. Default: group"
		),
		time_interval=graphene.String(
			description="Time interval for aggregation (month or year)"
		),
	)

	@login_required
	def resolve_commutings(self, info, **kwargs):
		"""Yields all heating consumption objects"""
		user = info.context.user
		return Commuting.objects.all(user__id=user.id)

	@login_required
	def resolve_commuting_aggregated(
		self,
		info,
		level="group",
		time_interval="month",
		**kwargs,
	):
		"""
		Yields monthly co2e emissions of businesstrips
		- for a user,
		- for a group (if group_id is given),
		- for an institution (if inst_id is given)
		param: level: Aggregation level: group or institution. Default: group
		param: time_interval: Aggregate co2e per "month" or "year"
		"""
		user = info.context.user
		# Get relevant data entries
		if level == "personal":
			entries = Commuting.objects.filter(user__id=user.id)
			entries = entries.annotate(co2e_cap=F("co2e"))
		elif level == "group":
			entries = CommutingGroup.objects.filter(
				working_group__id=user.working_group.id
			)
		elif level == "institution":
			entries = CommutingGroup.objects.filter(
				working_group__institution__id=user.working_group.institution.id
			)
		else:
			raise GraphQLError(f"Invalid value for parameter 'level': {level}")

		metrics = {"co2e": Sum("co2e"), "co2e_cap": Sum("co2e_cap")}

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
