"""
Create permission groups
Create permissions (read only) to models for a set of groups
"""

from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group
from django.db.utils import IntegrityError
import logging
from ...models import User, WorkingGroup, BusinessTrip, PlaneTrip


class Command(BaseCommand):
    def __init__(self, *args, **kwargs):
        super(Command, self).__init__(*args, **kwargs)

    help = 'Seeds the database.'

    def handle(self, *args, **options):

        # Create working groups
        if len(WorkingGroup.objects.filter(name="GIScience")) == 0:
            wg_giscience = WorkingGroup(name="GIScience", organization=WorkingGroup.Organizations.UNI_HD)
            wg_giscience.save()

        if len(WorkingGroup.objects.filter(name="Planet and Star Formation")) == 0:
            wg_bio = WorkingGroup(name="Planet and Star Formation", organization=WorkingGroup.Organizations.MPIA)
            wg_bio.save()

        wg_bio = WorkingGroup.objects.filter(name="Planet and Star Formation")[0]
        wg_giscience = WorkingGroup.objects.filter(name="GIScience")[0]

        # create users
        if len(User.objects.filter(username="Karen")) == 0:
            karen = User(username="Karen",
                            first_name="Karen",
                            last_name="Anderson",
                            email="karen@mpia.com",
                            password="karen",
                            working_group=wg_bio,
                            is_representative=True)
            karen.save()
            representative_group = Group.objects.get(name='Representative')
            karen.groups.add(representative_group)

            # Creat business trip by plane
            new_trip = BusinessTrip(user=karen,
                                    distance=3000,
                                    co2e=200,
                                    date="2020-05-10",
                                    transportation_mode=BusinessTrip.PLANE)
            new_trip.save()
            plane_trip = PlaneTrip(IATA_start="MUC", IATA_destination="LAX",
                                    flight_class=PlaneTrip.ECONOMY,
                                    round_trip=True,

                                    business_trip=new_trip)
            plane_trip.save()

        if len(User.objects.filter(username="Tom")) == 0:
            new_user = User(username="Tom",
                            first_name="Tom",
                            last_name="Tom",
                            email="tom@mpia.com",
                            password="tomtom",
                            working_group=wg_bio,
                            is_representative=False)
            new_user.save()
            researcher_group = Group.objects.get(name='Researcher')
            new_user.groups.add(researcher_group)

        if len(User.objects.filter(username="Alex")) == 0:
            new_user = User(username="Alex",
                            first_name="Alex",
                            last_name="Z",
                            email="alex@giscience.com",
                            password="alex",
                            working_group=wg_giscience,
                            is_representative=False)
            new_user.save()
            researcher_group = Group.objects.get(name='Researcher')
            new_user.groups.add(researcher_group)


