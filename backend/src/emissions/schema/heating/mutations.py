import graphene
from graphql_jwt.decorators import login_required
from emissions.decorators import representative_required

from .types import HeatingInput, Heating, HeatingType
from co2calculator.co2calculator.calculate import calc_co2_heating

class CreateHeating(graphene.Mutation):
    """GraphQL mutation for heating"""

    class Arguments:
        """Assign input type"""

        input = HeatingInput(required=True)

    success = graphene.Boolean()
    heating = graphene.Field(HeatingType)

    @staticmethod
    @login_required
    @representative_required
    def mutate(root, info, input=None):
        """Process incoming data"""
        success = True
        user = info.context.user

        # Calculate co2e
        co2e = calc_co2_heating(
            consumption=input.consumption,
            unit=input.unit.lower().replace(" ", "_"),
            fuel_type=input.fuel_type.lower().replace(" ", "_"),
            area_share=input.group_share,
        )
        co2e_cap = co2e / user.working_group.n_employees

        # Store in database
        new_heating = Heating(
            working_group=user.working_group,
            timestamp=input.timestamp,
            consumption=input.consumption,
            fuel_type=input.fuel_type.upper().replace(" ", "_"),
            unit=input.unit.lower().replace(" ", "_"),
            building=input.building,
            group_share=input.group_share,
            co2e=round(co2e, 1),
            co2e_cap=round(co2e_cap, 1),
        )
        new_heating.save()
        return CreateHeating(success=success, heating=new_heating)
