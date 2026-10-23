from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Trip(models.Model):
    destination=models.CharField(max_length=100)
    start_date=models.DateField()
    end_date=models.DateField()
    budget=models.IntegerField()
    user=models.ForeignKey(User,on_delete=models.CASCADE)