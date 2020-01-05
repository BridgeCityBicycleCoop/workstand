from rest_framework import serializers

from .models import Membership, Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ('id', 'type', 'created_at')
        id = serializers.ReadOnlyField()
        created_at = serializers.ReadOnlyField()

class MembershipSerializer(serializers.ModelSerializer):
    payment = PaymentSerializer()
    depth = 2
    class Meta:
        model = Membership
        fields = ('id', 'renewed_at', 'member', 'payment', 'expires_at')
        id = serializers.ReadOnlyField()
    
    def create(self, validated_data):
        payment_data = validated_data.pop('payment')
        payment = Payment.objects.create(**payment_data)
        instance = Membership.objects.create(**validated_data, payment=payment)
        return instance

