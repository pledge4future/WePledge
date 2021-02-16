from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Flight(models.Model):
    From = models.CharField(max_length=3)
    To = models.CharField(max_length=3)
    flight_class = models.CharField(max_length=10)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
