from django.contrib import admin

# Register your models here.

from django.contrib import admin
from .models import Bike

# Register your models here.
admin.site.register([Bike])
