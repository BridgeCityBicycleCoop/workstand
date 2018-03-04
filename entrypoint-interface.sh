#!/bin/bash
PYTHONUNBUFFERED=TRUE python
DJANGO_SETTINGS_MODULE=bikeshop.settings.production
cd /code
python manage.py migrate --no-input &&
python manage.py collectstatic --no-input &&
python manage.py rebuild_index --noinput &&
daphne -b 0.0.0.0 -p 8000 bikeshop.asgi:channel_layer