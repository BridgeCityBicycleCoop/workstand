# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-05-31 02:31
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('core', '0009_remove_membership_member'),
    ]

    operations = [
        migrations.AddField(
            model_name='membership',
            name='member',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='membership', to=settings.AUTH_USER_MODEL),
        ),
    ]