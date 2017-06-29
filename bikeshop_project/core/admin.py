from django.contrib import admin
from .models import Membership, Payment, Visit

# Register your models here.
admin.site.register([Membership, Payment])


@admin.register(Visit)
class VisitAdmin(admin.ModelAdmin):
    list_select_related = ("member",)
    fields = ("member", "purpose", "created_at")
    ordering = ("created_at",)
    list_display = ("full_name", "purpose", "created_at")
    list_filter = (("purpose", admin.ChoicesFieldListFilter),)

    search_fields = ["member__email", "member__last_name", "member__first_name"]

    def full_name(self, obj):
        return obj.member.full_name

    full_name.admin_order_field = "member__last_name"
