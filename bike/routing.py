from channels.routing import route

from .consumers import check_cpic

channel_routing = [
    route('check-cpic', check_cpic),
]