"""bikeshop URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.auth.views import logout_then_login, LoginView
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from rest_framework import routers
from rest_framework_jwt.views import obtain_jwt_token

import bike
import registration
from bike import urls as bike_urls
from core import urls as core_urls
from registration import urls as member_urls

routeLists = [
    bike.urls.apiRoutes,
    registration.urls.apiRoutes,
]

router = routers.DefaultRouter()
for routeList in routeLists:
    for route in routeList:
        router.register(route[0], route[1])

urlpatterns = [
    url(r"^", include(core_urls)),
    url(r"^login/", LoginView.as_view(), {"template_name": "login.html"}, name="login"),
    url(r"^logout/", logout_then_login, name="logout"),
    url(r"^members/", include(member_urls)),
    url(r"^bikes/", include(bike_urls)),
    url(r"^admin/", admin.site.urls),
    url(r"^api/v1/", include(router.urls)),
    url(r"^api/v1/token-auth/", obtain_jwt_token),
]

if getattr(settings, "DEBUG"):
    urlpatterns += staticfiles_urlpatterns()
