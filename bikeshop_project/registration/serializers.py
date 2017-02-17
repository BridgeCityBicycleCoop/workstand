from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from .models import Member


class MemberSerializer(ModelSerializer):
    first_name = serializers.CharField(allow_blank=True, required=False)
    last_name = serializers.CharField(allow_blank=True, required=False)

    class Meta:
        model = Member
        fields = ("first_name", "last_name", "email", "id", "banned", "suspended")
