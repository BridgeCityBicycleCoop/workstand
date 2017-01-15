import sys
from .base import *


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = ")8(+b48*njk+e^8-l!6s3k4d=z(#g$v=)i^=_p-l*#-kk=!v_d"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "postgres",
        "USER": "postgres",
        "HOST": "workstand_db_1",
        "PORT": "5432",
    }
}

if (
    "test" in sys.argv or "test_coverage" in sys.argv
):  # Covers regular testing and django-coverage
    DATABASES["default"]["ENGINE"] = "django.db.backends.sqlite3"

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

INSTALLED_APPS += [
    "corsheaders",
    # 'debug_toolbar'
]

MIDDLEWARE_CLASSES.insert(0, "django.middleware.common.CommonMiddleware")

# MIDDLEWARE_CLASSES += [
#     'debug_toolbar.middleware.DebugToolbarMiddleware'
# ]

# Don't worry about IP addresses, just show the toolbar.
DEBUG_TOOLBAR_CONFIG = {"SHOW_TOOLBAR_CALLBACK": lambda *args: True}

CORS_ORIGIN_ALLOW_ALL = True

ALLOWED_HOSTS = ["workstand.docker"]
