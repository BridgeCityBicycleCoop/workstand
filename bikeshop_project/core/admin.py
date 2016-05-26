from django.contrib import admin
from .models import Membership, Payment

# Register your models here.
admin.site.register([Membership, Payment])
