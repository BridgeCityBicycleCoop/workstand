from rest_framework import serializers

from .models import Member
from core.serializers import MembershipSerializer

class ListMultipleChoiceFieldSerializer(serializers.MultipleChoiceField):
    def to_representation(self, value):
        return list(super().to_representation(value))

class MemberSerializer(serializers.HyperlinkedModelSerializer):
    involvement = ListMultipleChoiceFieldSerializer(
        choices=Member.involvement_choices
    )

    class Meta:
        model = Member
        fields = (
            "banned",
            "city",
            "country",
            "date_of_birth",
            "email_consent",
            "email_consent",
            "email",
            "first_name",
            "gender",
            "guardian_name",
            "id",
            "involvement",
            "is_active",
            "last_name",
            "notes",
            "phone",
            "post_code",
            "preferred_name",
            "preferred_pronoun",
            "province",
            "self_identification",
            "street",
            "suspended",
            "waiver",
        )
        id = serializers.ReadOnlyField()
