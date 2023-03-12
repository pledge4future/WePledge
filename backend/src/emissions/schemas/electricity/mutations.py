import graphene
from graphql_jwt.decorators import login_required

from .types import ElectricityType, ElectricityInput
from emissions.models import Electricity
from emissions.decorators import representative_required

from co2calculator.co2calculator.constants import ElectricityFuel
from co2calculator.co2calculator.calculate import calc_co2_electricity



class CreateElectricity(graphene.Mutation):
    """GraphQL mutation for electricity"""

    class Arguments:
        """Assign input type"""

        input = ElectricityInput(required=True)

    success = graphene.Boolean()
    electricity = graphene.Field(ElectricityType)

    @staticmethod
    @login_required
    @representative_required
    def mutate(root, info, input=None):
        """Process incoming data"""
        user = info.context.user
        success = True

        if input.fuel_type:
            input.fuel_type = input.fuel_type.lower().replace(" ", "_")
        # Calculate co2
        co2e = calc_co2_electricity(
            input.consumption,
            input.fuel_type,
            input.group_share,
        )
        
        co2e_cap = co2e / user.working_group.n_employees

        # Store in database
        new_electricity = Electricity(
            working_group=user.working_group,
            timestamp=input.timestamp,
            consumption=input.consumption,
            fuel_type=ElectricityFuel[input.fuel_type.upper()].name,
            group_share=input.group_share,
            building=input.building,
            co2e=round(co2e, 1),
            co2e_cap=round(co2e_cap, 1),
        )
        new_electricity.save()
        return CreateElectricity(success=success, electricity=new_electricity)