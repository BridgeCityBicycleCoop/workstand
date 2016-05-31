# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-05-31 02:36
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0012_auto_20160531_0234"),
    ]

    operations = [
        migrations.RemoveField(model_name="payment", name="membership",),
        migrations.AddField(
            model_name="membership",
            name="payment",
            field=models.OneToOneField(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="membership",
                to="core.Payment",
            ),
        ),
    ]
