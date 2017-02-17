import os
import sys
from .base import *  # noqa


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = ")8(+b48*njk+e^8-l!6s3k4d=z(#g$v=)i^=_p-l*#-kk=!v_d"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []

# Covers regular testing and django-coverage
if "test" in sys.argv or "test_coverage" in sys.argv:
    DATABASES["default"]["ENGINE"] = "django.db.backends.sqlite3"  # noqa

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {"class": "logging.StreamHandler", "formatter": "verbose"},
    },
    "formatters": {
        "verbose": {"format": "%(levelname)s %(asctime)s %(pathname)s %(message)s"},
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": os.getenv("DJANGO_LOG_LEVEL", "INFO"),
        },
        "bikeshop": {
            "handlers": ["console"],
            "level": os.getenv("DJANGO_LOG_LEVEL", "DEBUG"),
        },
    },
}

INSTALLED_APPS += [  # noqa
    "corsheaders",
]

MIDDLEWARE_CLASSES.insert(0, "django.middleware.common.CommonMiddleware")  # noqa

# MIDDLEWARE_CLASSES += [
#     'debug_toolbar.middleware.DebugToolbarMiddleware'
# ]

CORS_ORIGIN_ALLOW_ALL = True

ALLOWED_HOSTS = ["workstand.docker", "localhost"]
