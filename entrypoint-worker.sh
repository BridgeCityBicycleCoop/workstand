#!/bin/bash
PYTHONUNBUFFERED=TRUE python
DJANGO_SETTINGS_MODULE=bikeshop.settings.production
cd /code &&
python manage.py runworker