# -*- coding: utf-8 -*-
# Generated by Django 1.11.20 on 2019-06-27 01:51
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_auto_20170502_0120'),
    ]

    operations = [
        migrations.AlterField(
            model_name='visit',
            name='purpose',
            field=models.CharField(choices=[('VOLUNTEER', 'volunteer'), ('FIX', 'fix bike'), ('BUILD', 'build bike'), ('WORKSHOP', 'workshop'), ('VISIT', 'visit'), ('DONATE', 'donate'), ('STAFF', 'staff'), ('PARTS', 'parts'), ('BUY_BIKE', 'buy bike'), ('TOUR', 'tour / visit')], max_length=50),
        ),
    ]
