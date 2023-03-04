import graphene
import traceback

from graphql_jwt.decorators import login_required

from co2calculator.co2calculator.calculate import calc_co2_businesstrip


from emissions.models import BusinessTrip
from .types import BusinessTripType, BusinessTripInput, PlanTripInput

class CreateBusinessTrip(graphene.Mutation):
    """GraphQL mutation for business trips"""

    class Arguments:
        """Assign input type"""

        input = BusinessTripInput(required=True)

    success = graphene.Boolean()
    businesstrip = graphene.Field(BusinessTripType)

    @staticmethod
    @login_required
    def mutate(root, info, input=None):
        """Process incoming data"""
        success = True
        user = info.context.user
        if input.seating_class:
            input.seating_class = input.seating_class.lower().replace(" ", "_")
        if input.fuel_type:
            input.fuel_type = input.fuel_type.lower().replace(" ", "_")
        if input.size:
            input.size = input.size.lower().replace(" ", "_")
        if input.transportation_mode:
            input.transportation_mode = input.transportation_mode.lower().replace(
                " ", "_"
            )
        # CO2e calculation
        co2e, distance, range_category, _ = calc_co2_businesstrip(
            start=input.start,
            destination=input.destination,
            distance=input.distance,
            transportation_mode=input.transportation_mode,
            size=input.size,
            fuel_type=input.fuel_type,
            occupancy=input.occupancy,
            seating=input.seating_class,
            passengers=input.passengers,
            roundtrip=input.roundtrip,
        )
        # Write data to database
        businesstrip_instance = BusinessTrip(
            timestamp=input.timestamp,
            distance=distance,
            range_category=range_category,
            transportation_mode=input.transportation_mode,
            co2e=co2e,
            user=user,
            working_group=user.working_group,
        )
        businesstrip_instance.save()

        return CreateBusinessTrip(success=success, businesstrip=businesstrip_instance)

class PlanTrip(graphene.Mutation):
    """GraphQL mutation for business trips"""

    class Arguments:
        """Assign input type"""

        input = PlanTripInput(required=True)

    success = graphene.Boolean()
    co2e = graphene.Float()
    message = graphene.String()

    @staticmethod
    def mutate(root, info, input=None):
        """Process incoming data"""
        success = True
        message = "success"
        if input.seating_class:
            input.seating_class = input.seating_class.lower().replace(" ", "_")
        if input.fuel_type:
            input.fuel_type = input.fuel_type.lower().replace(" ", "_")
        if input.size:
            input.size = input.size.lower().replace(" ", "_")
        if input.transportation_mode:
            input.transportation_mode = input.transportation_mode.lower().replace(
                " ", "_"
            )
        # CO2e calculation
        start_dict = {"address": input.start_address,
                      "locality": input.start_city,
                      "country": input.start_country}
        destination_dict = {"address": input.destination_address,
                            "locality": input.destination_city,
                            "country": input.destination_country}

        try:
            co2e, distance, range_category, _ = calc_co2_businesstrip(
                start=start_dict,
                destination=destination_dict,
                distance=input.distance,
                transportation_mode=input.transportation_mode,
                size=input.size,
                fuel_type=input.fuel_type,
                occupancy=input.occupancy,
                seating=input.seating_class,
                passengers=input.passengers,
                roundtrip=input.roundtrip,
            )
            print(co2e, distance, range_category, _)
        except Exception as e:
            traceback.print_exc()
            return PlanTrip(success=False, message=str(e), co2e=None)
        except RuntimeWarning as e:
            message = e
        return PlanTrip(success=success, message=message, co2e=co2e)
