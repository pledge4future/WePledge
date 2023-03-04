import graphene

from graphql_jwt.decorators import login_required
from graphql import GraphQLError

from django.db.models.functions import TruncMonth, TruncYear
from django.db.models import Sum, F

from .types import BusinessTripType, BusinessTripAggregatedType
from emissions.models import BusinessTrip, BusinessTripGroup


class Query():

	businesstrips = graphene.List(BusinessTripType)

	businesstrip_aggregated = graphene.List(
		BusinessTripAggregatedType,
		level=graphene.String(
			description="Aggregation level: personal, group or institution. Default: group"
		),
		time_interval=graphene.String(
			description="Time interval for aggregation (month or year)"
		),
	)

	@login_required
	def resolve_businesstrips(self, info, **kwargs):
		"""Yields all heating consumption objects"""
		user = info.context.user
		return BusinessTrip.objects.all(user__id=user.id)

	@login_required
	def resolve_businesstrip_aggregated(
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
		param: level: Aggregation level: personal, group or institution. Default: group
		param: time_interval: Aggregate co2e per "month" or "year"
		"""
		user = info.context.user
		# Get relevant data entries
		if level == "personal":
			entries = BusinessTrip.objects.filter(user__id=user.id)
			entries = entries.annotate(co2e_cap=F("co2e"))
		elif level == "group":
			entries = BusinessTripGroup.objects.filter(
				working_group__id=user.working_group.id
			)
		elif level == "institution":
			entries = BusinessTripGroup.objects.filter(
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
