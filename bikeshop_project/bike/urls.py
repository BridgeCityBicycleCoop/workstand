from django.conf.urls import url

from .views import BikesView

urlpatterns = [
    url(r'^$', BikesView.as_view(), name='bikes')
]
