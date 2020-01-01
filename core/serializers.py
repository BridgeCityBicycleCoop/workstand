from rest_framework import serializers

from .models import Membership

class MembershipSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Membership
        fields = ('id', 'renewed_at')
        id = serializers.ReadOnlyField()