from django.contrib import admin
from emissions.models import User, WorkingGroup, BusinessTrip, Heating, Electricity, Institution, Commuting, \
    CommutingGroup, BusinessTripGroup
from django.apps import apps

# Register your models here.
admin.site.register(User)
admin.site.register(WorkingGroup)
admin.site.register(Institution)
admin.site.register(Heating)
admin.site.register(Electricity)
admin.site.register(Commuting)
admin.site.register(CommutingGroup)
admin.site.register(BusinessTrip)
admin.site.register(BusinessTripGroup)

app = apps.get_app_config('graphql_auth')

for model_name, model in app.models.items():
    admin.site.register(model)
