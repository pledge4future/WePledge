from django.contrib import admin
from emissions.models import User, WorkingGroup, BusinessTrip, Heating, Electricity, Institution


# Register your models here.
admin.site.register(User)
admin.site.register(WorkingGroup)
admin.site.register(Institution)
admin.site.register(BusinessTrip)
admin.site.register(Heating)
admin.site.register(Electricity)



