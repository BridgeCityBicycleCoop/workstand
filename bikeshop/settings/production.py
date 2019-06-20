import os
import re
import sys
import rollbar

import dj_database_url

from .base import *  # noqa


# SECURITY WARNING: keep the secret key used in production secret!
WSGI_APPLICATION = 'bikeshop.wsgi.application'

SECRET_KEY = os.environ['SECRET_KEY']

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

DATABASES = {
    'default': dj_database_url.config(conn_max_age=600, ssl_require=True)
}

ALLOWED_HOSTS = ['shop.bcbc.bike', 'warm-wildwood-83351.herokuapp.com']

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        },
    },
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(pathname)s %(message)s'
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': os.getenv('DJANGO_LOG_LEVEL', 'ERROR'),
        },
        'bikeshop': {
            'handlers': ['console'],
            'level': os.getenv('DJANGO_LOG_LEVEL', 'INFO'),
        }
    },
}

WEBPACK_LOADER = {
    'DEFAULT': {
        'CACHE': True,
        'BUNDLE_DIR_NAME': 'dist/',  # must end with slash
        'STATS_FILE': os.path.join(BASE_DIR, '../webpack-stats-prod.json'),  # noqa
        'POLL_INTERVAL': 0.1,
        'IGNORE': ['.+\.hot-update.js', '.+\.map']
    }
}

CACHES = {
    "default": {
         "BACKEND": "redis_cache.RedisCache",
         "LOCATION": os.environ.get('REDIS_URL'),
    }
}

CHANNEL_LAYERS = {
   "default": {
       "BACKEND": "asgi_redis.RedisChannelLayer",
       "CONFIG": {
           "hosts": [os.environ.get('REDIS_URL')],
       },
       "ROUTING": "bike.routing.channel_routing",
   },
}

# Covers regular testing and django-coverage
if 'test' in sys.argv or 'test_coverage' in sys.argv:
    DATABASES['default']['ENGINE'] = 'django.db.backends.sqlite3'  # noqa

MIDDLEWARE_CLASSES += [
    # https://warehouse.python.org/project/whitenoise/
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'rollbar.contrib.django.middleware.RollbarNotifierMiddleware'
]

ROLLBAR = {
    'access_token': os.environ.get('ROLLBAR_ACCESS_TOKEN'),
    'environment': 'production',
    'root': BASE_DIR,
    'ignorable_404_urls': (
        re.compile('/members/signin/'),
    ),
}

HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'haystack_algolia.algolia_backend.AlgoliaEngine',
        'APP_ID': 'I0KTPJJPRU',
        'API_KEY': os.environ.get('ALGOLIA_API_KEY'),
        'INDEX_NAME_PREFIX': 'prod_workstand_',
        'TIMEOUT': 60 * 5
    }
}

COMPRESS_ENABLED = True
COMPRESS_OFFLINE = True

rollbar.init(**ROLLBAR)

MAILCHIMP_API_KEY = os.environ.get('MAILCHIMP_API_KEY')
MAILCHIMP_USERNAME = os.environ.get('MAILCHIMP_USERNAME')
