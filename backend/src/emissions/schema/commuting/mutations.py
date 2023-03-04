import graphene
import numpy as np
from django.db.models import Sum
from graphql_jwt.decorators import login_required

from .types import CommutingInput
from emissions.models import Commuting, CommutingGroup

from co2calculator.co2calculator.calculate import calc_co2_commuting


WEEKS_PER_MONTH = 4.34524
WEEKS_PER_YEAR = 52.1429

class CreateCommuting(graphene.Mutation):
    """GraphQL mutation for commuting"""

    class Arguments:
        """Assign input type"""

        input = CommutingInput(required=True)

    success = graphene.Boolean()
    # commute = graphene.Field(CommutingType)

    @staticmethod
    @login_required
    def mutate(root, info, input=None):
        """Process incoming data"""
        success = True
        user = info.context.user
        if input.workweeks is None:
            input.workweeks = WEEKS_PER_YEAR
        if input.transportation_mode:
            input.transportation_mode = input.transportation_mode.lower().replace(
                " ", "_"
            )
        if input.fuel_type:
            input.fuel_type = input.fuel_type.lower().replace(" ", "_")
        if input.size:
            input.size = input.size.lower().replace(" ", "_")
        # Calculate co2
        weekly_co2e = calc_co2_commuting(
            transportation_mode=input.transportation_mode,
            weekly_distance=input.distance,
            size=input.size,
            fuel_type=input.fuel_type,
            occupancy=input.occupancy,
            passengers=input.passengers,
        )

        # Calculate monthly co2
        monthly_co2e = (
            WEEKS_PER_MONTH * (input.workweeks / WEEKS_PER_YEAR) * weekly_co2e
        )
        dates = np.arange(
            np.datetime64(input.from_timestamp, "M"),
            np.datetime64(input.to_timestamp, "M") + np.timedelta64(1, "M"),
            np.timedelta64(1, "M"),
        ).astype("datetime64[D]")
        for d in dates:
            commuting_instance = Commuting(
                timestamp=str(d),
                distance=input.distance,
                transportation_mode=input.transportation_mode,
                co2e=monthly_co2e,
                user=user,
                working_group=user.working_group,
            )
            commuting_instance.save()

            # Update emissions of working group for date and transportation mode
            if user.working_group is None:
                continue

            entries = Commuting.objects.filter(
                working_group=user.working_group,
                transportation_mode=input.transportation_mode,
                timestamp=str(d),
            )
            metrics = {"co2e": Sum("co2e"), "distance": Sum("distance")}
            group_data = entries.aggregate(**metrics)

            co2e_cap = group_data["co2e"] / user.working_group.n_employees
            commuting_group_instance = CommutingGroup(
                working_group=user.working_group,
                timestamp=str(d),
                transportation_mode=input.transportation_mode,
                n_employees=user.working_group.n_employees,
                co2e=group_data["co2e"],
                co2e_cap=co2e_cap,
                distance=group_data["distance"],
            )
            commuting_group_instance.save()

        return CreateCommuting(success=success)
