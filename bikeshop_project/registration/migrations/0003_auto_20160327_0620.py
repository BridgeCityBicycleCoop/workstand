# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-03-27 06:20
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("registration", "0002_member_email_consent"),
    ]

    operations = [
        migrations.AlterField(
            model_name="member",
            name="date_of_birth",
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name="member",
            name="post_code",
            field=models.CharField(max_length=20, null=True),
        ),
    ]
