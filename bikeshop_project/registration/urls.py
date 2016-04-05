from django.conf.urls import url

from .views import MemberFormView

urlpatterns = [
    url(r"^new/$", MemberFormView.as_view(), name="signup"),
]
