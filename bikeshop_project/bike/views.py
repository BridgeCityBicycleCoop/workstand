import logging
from channels import Channel
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

logger = logging.getLogger('bikeshop')


@method_decorator(login_required, name='dispatch')
class BikesView(TemplateView):
    template_name = 'bikes.html'

    def get(self, request):
        return self.render_to_response({})


class BikeViewSet(viewsets.ModelViewSet):
    queryset = Bike.objects.all()
    serializer_class = BikeSerializer

    @detail_route(methods=['get'])
    def validate(self, request, pk):
        bike = get_object_or_404(Bike, pk=pk)
        getattr(bike, 'can_{0}'.format(request.query_params['transition']))()  # Raises ValidationError
        return Response(None, status=status.HTTP_204_NO_CONTENT)

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
            raise ValidationError(detail=f'Transition from {bike.state} to {state} failed.')

        bike.available()
        bike.save()

        serializer = BikeSerializer(bike, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @detail_route(methods=['put'])
    def claim(self, request, pk):
        bike = get_object_or_404(Bike, pk=pk)
        member = get_object_or_404(Member, id=request.data.get('member'))
        state = BikeState.CLAIMED
        if not can_proceed(bike.claimed):
            raise ValidationError(detail=f'Transition from {bike.state} to {state}')

        bike.claimed(member)
        bike.save()

        serializer = BikeSerializer(bike, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @detail_route(methods=['put'])
    def purchase(self, request, pk):
        bike = get_object_or_404(Bike, pk=pk)
        member = get_object_or_404(Member, id=request.data.get('member'))
        state = BikeState.CLAIMED
        if not can_proceed(bike.purchased):
            raise ValidationError(detail=f'Transition from {bike.state} to {state}')

        bike.purchased(member)
        bike.save()

        serializer = BikeSerializer(bike, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @detail_route(methods=['put'])
    def scrap(self, request, pk):
        bike = get_object_or_404(Bike, pk=pk)
        state = BikeState.SCRAPPED
        if not can_proceed(bike.scrapped):
            raise ValidationError(detail=f'Transition from {bike.state} to {state}')

        bike.scrapped()
        bike.save()

        serializer = BikeSerializer(bike, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @detail_route(methods=['put'])
    def stolen(self, request, pk):
        bike = get_object_or_404(Bike, pk=pk)
        state = BikeState.TRANSFERRED_TO_POLICE
        if not can_proceed(bike.transfer_to_police):
            raise ValidationError(detail=f'Transition from {bike.state} to {state}')

        bike.transfer_to_police()
        bike.save()

        serializer = BikeSerializer(bike, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @detail_route(methods=['put'])
    def check(self, request, pk):
        bike = get_object_or_404(Bike, pk=pk)
        message = {'bike_id': pk, 'serial_number': bike.serial_number}
        Channel('check-cpic').send(message)

        return Response({'status': 'pending'})
