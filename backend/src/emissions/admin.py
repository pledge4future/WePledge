from django.contrib import admin
from .models import User, WorkingGroup, BusinessTrip, CarTrip, BusTrip, PlaneTrip, \
    TrainTrip, Heating, Electricity


# Register your models here.
admin.site.register(User)
admin.site.register(WorkingGroup)
admin.site.register(BusinessTrip)
admin.site.register(CarTrip)
admin.site.register(BusTrip)
admin.site.register(TrainTrip)
admin.site.register(PlaneTrip)
admin.site.register(Heating)
admin.site.register(Electricity)



