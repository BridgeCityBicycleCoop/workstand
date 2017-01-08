from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView
from django_fsm import can_proceed
from rest_framework import viewsets
from rest_framework.decorators import detail_route
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from bike.models import Bike, BikeState
from bike.serializers import BikeSerializer

from rest_framework import status

from registration.models import Member


@method_decorator(login_required, name='dispatch')
class BikesView(TemplateView):
    template_name = 'bikes.html'

    def get(self, request):
        return self.render_to_response({})


class BikeViewSet(viewsets.ModelViewSet):
    queryset = Bike.objects.all()
    serializer_class = BikeSerializer

    @detail_route(methods=['put'])
    def assessed(self, request, pk):
        bike = get_object_or_404(Bike, pk=pk)
        state = BikeState.ASSESSED
        if not can_proceed(bike.assessed):
            raise ValidationError(detail=f'Transition from {bike.state} to {state}')

        bike.assessed()
        bike.save()

        serializer = BikeSerializer(bike, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @detail_route(methods=['put'])
    def available(self, request, pk):
        bike = get_object_or_404(Bike, pk=pk)
        state = BikeState.AVAILABLE
        if not can_proceed(bike.available):
            raise ValidationError(detail=f'Transition from {bike.state} to {state}')

        bike.available()
        bike.save()

        serializer = BikeSerializer(bike, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @detail_route(methods=['put'])
    def claim(self, request, pk):
        bike = get_object_or_404(Bike, pk=pk)
        member = get_object_or_404(Member, id=request.data.get('member'))
        state = BikeState.CLAIMED
        if not can_proceed(bike.claim):
            raise ValidationError(detail=f'Transition from {bike.state} to {state}')

        bike.claim(member)
        bike.save()

        serializer = BikeSerializer(bike, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @detail_route(methods=['put'])
    def purchase(self, request, pk):
        bike = get_object_or_404(Bike, pk=pk)
        member = get_object_or_404(Member, id=request.data.get('member'))
        state = BikeState.CLAIMED
        if not can_proceed(bike.purchase):
            raise ValidationError(detail=f'Transition from {bike.state} to {state}')

        bike.purchase(member)
        bike.save()

        serializer = BikeSerializer(bike, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
