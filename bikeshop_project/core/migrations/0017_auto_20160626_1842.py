# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-06-26 18:42
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0016_auto_20160531_0416'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payment',
            name='type',
            field=models.CharField(choices=[('NONE', 'None'), ('CASH', 'Cash'), ('CHEQUE', 'Cheque'), ('VOLUNTEERING', 'Volunteering'), ('SQUARE', 'Square'), ('PAYPAL', 'PayPal')], default='NONE', max_length=12),
        ),
    ]
