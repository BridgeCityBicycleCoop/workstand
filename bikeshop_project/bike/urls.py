from django.conf.urls import url, include
from rest_framework import routers

from bike import views
from .views import BikesView

router = routers.DefaultRouter()
router.register(r'bikes', views.BikeViewSet)

urlpatterns = [
    url(r'^api/', include(router.urls, namespace='api')),
    url(r'^$', BikesView.as_view(), name='bikes')
]
