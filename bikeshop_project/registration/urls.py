from django.conf.urls import url

from .views import MemberFormView, MemberSearchView
urlpatterns = [
    url(r'^new/$', MemberFormView.as_view(), name='signup'),
    url(r'^search/(?P<query>[\w@\.\+]+)/$', MemberSearchView.as_view(), name='member_search'),
    url(r'^edit/(?P<member_id>[0-9]+)/$', MemberFormView.as_view(), name='member_edit')
]
