from rest_framework import serializers

from bike.models import Bike


class BikeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Bike
