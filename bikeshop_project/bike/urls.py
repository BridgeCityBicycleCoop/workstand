from django.conf.urls import url, include
from rest_framework import routers

from bike import views
from .views import BikesView, BikeViewSet

apiRoutes = (
    (r'bikes', BikeViewSet),
)

urlpatterns = [
    url(r'^$', BikesView.as_view(), name='bikes')
]
