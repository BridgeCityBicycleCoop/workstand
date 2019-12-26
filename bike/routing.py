from channels.routing import ChannelNameRouter, ProtocolTypeRouter
from django.conf.urls import url
from .consumers import Cpic

application = ProtocolTypeRouter({"channel": ChannelNameRouter({"check-cpic": Cpic,})})
