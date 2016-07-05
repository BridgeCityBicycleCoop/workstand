# from django.contrib import admin
# from .models import CustomUser
# from django.contrib.auth.admin import UserAdmin
# from django.contrib.auth.forms import UserChangeForm
#
#
# class CustomUserChangeForm(UserChangeForm):
#     class Meta(UserChangeForm.Meta):
#         model = CustomUser
#
#
# class CustomUserAdmin(UserAdmin):
#     form = CustomUserChangeForm
#
#     fieldsets = (
#         (None, {'fields': ('email', 'password')}),
#         ('Permissions', {'fields': ('is_active', 'is_superuser',
#                                     'groups', 'user_permissions')}),
#         ('Important dates', {'fields': ('last_login',)}),
#     )
#     add_fieldsets = (
#         (None, {
#             'classes': ('wide',),
#             'fields': ('email', 'password1', 'password2'),
#         }),
#     )
#     ordering = ('email',)
#     list_display = ('email',)
#     list_filter = ('is_superuser', 'is_active', 'groups')
#     search_fields = ('email',)
#
#
# # Register your models here.
# admin.site.register(CustomUser, CustomUserAdmin)
