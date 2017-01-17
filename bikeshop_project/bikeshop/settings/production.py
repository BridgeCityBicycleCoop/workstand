from .base import *


# SECURITY WARNING: keep the secret key used in production secret!
WSGI_APPLICATION = "bikeshop.wsgi.application"

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "secret")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ["shop.bcbc.bike"]

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
            "level": os.getenv("DJANGO_LOG_LEVEL", "ERROR"),
        },
        "bikeshop": {
            "handlers": ["console"],
            "level": os.getenv("DJANGO_LOG_LEVEL", "INFO"),
        },
    },
}

WEBPACK_LOADER = {
    "DEFAULT": {
        "CACHE": True,
        "BUNDLE_DIR_NAME": "dist/",  # must end with slash
        "STATS_FILE": os.path.join(BASE_DIR, "assets/webpack-stats-prod.json"),
        "POLL_INTERVAL": 0.1,
        "IGNORE": [".+\.hot-update.js", ".+\.map"],
    }
}
