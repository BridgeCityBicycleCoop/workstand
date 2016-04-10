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
from django.contrib.auth.views import login
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from core import urls as core_urls
from registration import urls as member_urls

urlpatterns = [
    url(r"^", include(core_urls)),
    url(r"^login/", login, {"template_name": "login.html"}),
    url(r"^member/", include(member_urls)),
    url(r"^admin/", admin.site.urls),
]

if getattr(settings, "DEBUG"):
    urlpatterns += staticfiles_urlpatterns()
