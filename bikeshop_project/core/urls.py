from django.conf.urls import url

from .views import DashboardView, NewMembershipView
urlpatterns = [
    url(r'^membership/new/$', NewMembershipView.as_view()),
    url(r'^$', DashboardView.as_view()),
]
