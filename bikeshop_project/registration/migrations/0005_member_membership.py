# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-05-26 01:50
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0009_remove_membership_member'),
        ('registration', '0004_auto_20160410_1816'),
    ]

    operations = [
        migrations.AddField(
            model_name='member',
            name='membership',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='member', to='core.Membership'),
        ),
    ]