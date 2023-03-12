import graphene

from graphql import GraphQLError

from django.db.models import Sum
import datetime as dt
import pandas as pd

from emissions.models import Electricity, Heating, CommutingGroup, BusinessTripGroup
from .types import TotalEmissionType
from ...utils.base import BaseQuery


class TotalEmissionsQuery(BaseQuery):

	total_emission = graphene.List(
		TotalEmissionType,
		start=graphene.Date(
			description="Start date for calculation of total emissions"
		),
		end=graphene.Date(description="End date for calculation of total emissions"),
		level=graphene.String(
			description="Aggregate by 'group' or 'institution'. Default: 'group')"
		),
	)

	def resolve_total_emission(
		self, info, start=None, end=None, level="group", **kwargs
	):
		"""
		Yields total emissions on monthly or yearly basis
		param: start: Start date for calculation of total emissions. If none is given, the last 12 months will be used.
		param: end: end date for calculation of total emission If none is given, the last 12 months will be used.
		"""
		metrics = {
			"co2e": Sum("co2e"),
			"co2e_cap": Sum("co2e_cap"),
		}

		if not end and not start:
			end = dt.datetime(
				day=1,
				month=dt.datetime.today().month - 1,
				year=dt.datetime.today().year,
			)
			start = dt.datetime(
				day=1,
				month=dt.datetime.today().month,
				year=dt.datetime.today().year - 1,
			)

		if level == "group":
			aggregate_on = ["working_group__name", "working_group__institution__name"]
		elif level == "institution":
			aggregate_on = ["working_group__institution__name"]
		else:
			raise GraphQLError(f"Invalid value for parameter 'level': {level}")

		heating_emissions = (
			Heating.objects.filter(timestamp__gte=start, timestamp__lte=end)
			.values(*aggregate_on)
			.annotate(**metrics)
		)
		heating_df = pd.DataFrame(list(heating_emissions))

		electricity_emissions = (
			Electricity.objects.filter(timestamp__gte=start, timestamp__lte=end)
			.values(*aggregate_on)
			.annotate(**metrics)
		)
		electricity_df = pd.DataFrame(list(electricity_emissions))

		businesstrips_emissions = (
			BusinessTripGroup.objects.filter(timestamp__gte=start, timestamp__lte=end)
			.values(*aggregate_on)
			.annotate(**metrics)
		)
		businesstrips_df = pd.DataFrame(list(businesstrips_emissions))

		commuting_emissions = (
			CommutingGroup.objects.filter(timestamp__gte=start, timestamp__lte=end)
			.values(*aggregate_on)
			.annotate(**metrics)
		)
		commuting_df = pd.DataFrame(list(commuting_emissions))

		total_emissions = (
			pd.concat([heating_df, electricity_df, commuting_df, businesstrips_df])
			.groupby(aggregate_on)
			.sum()
		)
		total_emissions.reset_index(inplace=True)

		emissions_for_groups = []
		if level == "group":
			for _, row in total_emissions.iterrows():
				section = TotalEmissionType(
					working_group_name=row["working_group__name"],
					working_group_institution_name=row[
						"working_group__institution__name"
					],
					co2e=row["co2e"],
					co2e_cap=row["co2e_cap"],
				)
				emissions_for_groups.append(section)
		elif level == "institution":
			for _, row in total_emissions.iterrows():
				section = TotalEmissionType(
					working_group_name=None,
					working_group_institution_name=row[
						"working_group__institution__name"
					],
					co2e=row["co2e"],
					co2e_cap=row["co2e_cap"],
				)
				emissions_for_groups.append(section)
		return emissions_for_groups
