import os
import sys
from .base import *  # noqa


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = ")8(+b48*njk+e^8-l!6s3k4d=z(#g$v=)i^=_p-l*#-kk=!v_d"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# Covers regular testing and django-coverage
if "test" in sys.argv or "test_coverage" in sys.argv:
    DATABASES["default"]["ENGINE"] = "django.db.backends.sqlite3"  # noqa

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
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

if DEBUG:
    # make all loggers use the console.
    for logger in LOGGING["loggers"]:
        LOGGING["loggers"][logger]["handlers"] = ["console"]

INSTALLED_APPS += [  # noqa
    "corsheaders",
]

MIDDLEWARE.insert(0, "django.middleware.common.CommonMiddleware")  # noqa

# MIDDLEWARE += [
#     'debug_toolbar.middleware.DebugToolbarMiddleware'
# ]

CORS_ORIGIN_ALLOW_ALL = True

ALLOWED_HOSTS = ["workstand.docker", "localhost", "192.168.99.100"]

MAILCHIMP_API_KEY = None
MAILCHIMP_USERNAME = "drew@bcbc.bike"

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {"hosts": [("127.0.0.1", 6379)],},
    },
}
