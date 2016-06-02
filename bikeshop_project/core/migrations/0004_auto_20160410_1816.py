# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-04-10 18:16
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_visit'),
    ]

    operations = [
        migrations.AddField(
            model_name='membership',
            name='gender',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='membership',
            name='involvement',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='membership',
            name='self_identification',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]