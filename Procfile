release: sh ./release-tasks.sh
web: daphne bikeshop.asgi:application --port $PORT --bind 0.0.0.0 -v2
worker: python manage.py runworker -v2 check-cpic