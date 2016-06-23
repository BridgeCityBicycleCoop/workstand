from django.contrib import admin
from .models import Membership, Payment, Visit

# Register your models here.
admin.site.register([Membership, Payment, Visit])
