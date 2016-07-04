from django.contrib import admin
from .models import Member
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserChangeForm


class MemberChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = Member

class MemberAdmin(UserAdmin):
    form = MemberChangeForm

    fieldsets = fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_superuser',
                                       'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
    ordering = ('email',)
    list_display = ('email', 'first_name', 'last_name')
    list_filter = ('is_superuser', 'is_active', 'groups')
    search_fields = ('email', 'first_name', 'last_name', 'email')


# Register your models here.
admin.site.register(Member, MemberAdmin)
