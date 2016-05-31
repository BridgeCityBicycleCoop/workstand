from django.conf.urls import url

from .views import MemberFormView

urlpatterns = [
    url(r"^new/$", MemberFormView.as_view(), name="signup"),
    url(r"^edit/(?P<member_id>[0-9]+)/$", MemberFormView.as_view(), name="member_edit"),
]
