from django.contrib import admin
from .models import CustomUser, Member
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserChangeForm


class CustomUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    form = CustomUserChangeForm

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
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
    list_display = ('email',)
    list_filter = ('is_superuser', 'is_active', 'groups')
    search_fields = ('email',)


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ('get_full_name',)
    ordering = ('last_name',)
    search_fields = ('email', 'first_name', 'last_name')