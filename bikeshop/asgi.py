import os
import django
from channels.routing import get_default_application

os.environ.get("DJANGO_SETTINGS_MODULE", "bikeshop.settings.production")
os.environ["ASGI_THREADS"] = "4"  # See https://stackoverflow.com/a/54272368/1179222
django.setup()
application = get_default_application()
