from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from .models import Member


class MemberSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Member
        fields = ('email', 'email_consent', 'email_consent', 'first_name', 'last_name', 'preferred_name',
                  'date_of_birth', 'guardian_name', 'phone', 'street', 'city', 'province', 'country', 'post_code',
                  'waiver', 'is_active', 'banned', 'suspended')