from rest_framework import serializers

from bike.models import Bike


class BikeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Bike
        fields = '__all__'

    id = serializers.ReadOnlyField()
    created_at = serializers.ReadOnlyField()
    state = serializers.ReadOnlyField()
    available_states = serializers.ReadOnlyField()
