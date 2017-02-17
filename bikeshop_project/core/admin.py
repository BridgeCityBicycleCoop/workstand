from django.contrib import admin
from .models import Membership, Payment, Visit

# Register your models here.
admin.site.register([Membership, Payment])


@admin.register(Visit)
class VisitAdmin(admin.ModelAdmin):
    ordering = ("created_at",)
    list_display = ("member", "purpose", "created_at")
