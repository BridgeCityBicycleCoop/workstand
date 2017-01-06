from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView
from rest_framework import viewsets

from bike.models import Bike
from bike.serializers import BikeSerializer


@method_decorator(login_required, name='dispatch')
class BikesView(TemplateView):
    template_name = 'bikes.html'

    def get(self, request):
        return self.render_to_response({})


class BikeViewSet(viewsets.ModelViewSet):
    queryset = Bike.objects.all()
    serializer_class = BikeSerializer
