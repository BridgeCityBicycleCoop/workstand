from collections import Set
from datetime import timedelta
from django.db import models
from django.utils import timezone

from django_fsm import FSMField, transition
from rest_framework.exceptions import ValidationError

from registration.models import Member


class BikeState(object):
    RECEIVED = 'RECEIVED'
    ASSESSED = 'ASSESSED'
    AVAILABLE = 'AVAILABLE'
    CLAIMED = 'CLAIMED'
    PURCHASED = 'PURCHASED'
    SCRAPPED = 'SCRAPPED'
    TRANSFERRED_TO_POLICE = 'TRANSFERRED_TO_POLICE'
    CHOICES = (
        (RECEIVED, 'Received'),
        (ASSESSED, 'Assessed'),
        (AVAILABLE, 'CPIC Searched'),
        (CLAIMED, 'Claimed'),
        (SCRAPPED, 'Scrapped'),
        (PURCHASED, 'Purchased'),
        (TRANSFERRED_TO_POLICE, 'Transferred to police')
    )


class Bike(models.Model):
    CHILD = 'C'
    SMALL = 'S'
    MEDIUM = 'M'
    LARGE = 'L'
    EXTRA_LARGE = 'XL'

    size_choices = (
        (CHILD, 'child'),
        (SMALL, 'small'),
        (MEDIUM, 'medium'),
        (LARGE, 'large'),
        (EXTRA_LARGE, 'extra large'),
    )

    COS_BIKE_DIVERSION_PILOT = 'COS_BIKE_DIVERSION_PILOT'
    UOFS = 'UOFS'
    DROP_OFF = 'DROP_OFF'

    source_choices = (
        (COS_BIKE_DIVERSION_PILOT, 'City of Saskatoon Bike Diversion Pilot'),
        (UOFS, 'University of Saskatchewan'),
        (DROP_OFF, 'Drop Off'),
    )

    field_errors_required = {
        'colour': 'Required.',
        'make': 'Required.',
        'size': 'Required.',
        'source': 'Required',
        'price': 'Required',
        'stripped': 'Bike must be stripped first.',
        'cpic_searched_at': 'This bike has not been checked in CPIC. Please dispatch a check now.'

    }

    @property
    def CLAIMED_ERROR(self):
        return f'This bike is already claimed by ${self.claimed_by.full_name} and was last worked on less than four weeks ago.'

    colour = models.TextField(blank=False, null=False)
    make = models.TextField(blank=False, null=False)
    size = models.TextField(choices=size_choices, blank=True, null=True, max_length=2)
    serial_number = models.TextField(blank=False, null=False)
    source = models.TextField(blank=False, null=False, choices=source_choices)
    stripped = models.NullBooleanField()
    price = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    state = FSMField(default=BikeState.RECEIVED, choices=BikeState.CHOICES, protected=True)
    claimed_by = models.ForeignKey(Member, on_delete=models.SET_NULL, null=True, related_name='claimed_bike')
    stolen = models.NullBooleanField()
    purchased_by = models.ForeignKey(Member, on_delete=models.SET_NULL, null=True, related_name='purchased_bike')
    donated_by = models.TextField(blank=True, null=True)
    donated_at = models.DateTimeField(blank=False, null=False, default=timezone.now)
    created_at = models.DateTimeField(default=timezone.now)
    modified_at = models.DateTimeField(auto_now=True)
    cpic_searched_at = models.DateTimeField(blank=True, null=True)
    claimed_at = models.DateTimeField(blank=True, null=True)
    last_worked_on = models.DateTimeField(blank=True, null=True)
    purchased_at = models.DateTimeField(blank=True, null=True)

    def __validate_required(self, required_fields: list) -> dict:
        """
        Checks the instance for attribute values.
        :param required_fields: list string
        :return: dict
        """
        validated_fields = [getattr(self, field) for field in required_fields]
        validated_pairs = zip(required_fields, validated_fields)
        if None not in validated_fields:
            return {}

        return {
            'field_errors': {pair[0]: self.field_errors_required[pair[0]] for pair in validated_pairs if not pair[1]}}

    def __can_assessed(self) -> bool:
        try:
            return self.can_assessed()
        except ValidationError:
            return False

    def can_assessed(self) -> bool:
        """
        Check to see if we can change state to assessed.
        :return: bool
        :raise: rest_framework.exceptions.ValidationError
        """
        required_fields = [
            'colour',
            'make',
            'size',
            'source',
            'price'
        ]
        result = self.__validate_required(required_fields)
        if not result:
            return True

        raise ValidationError(result)

    def __can_available(self) -> bool:
        try:
            return self.can_available()
        except ValidationError:
            return False

    def can_available(self):
        required_fields = ['cpic_searched_at']
        form_errors = []
        if self.stolen:
            form_errors.append('This bike may be stolen and is not available.')

        if self.claimed_by and self.last_worked_on and self.last_worked_on > timezone.now() - timedelta(weeks=4):
            form_errors.append(self.CLAIMED_ERROR)

        result = self.__validate_required(required_fields)
        if not result and not form_errors:
            return True

        if form_errors:
            raise ValidationError({'field_errors': {}, 'form_errors': form_errors})

        raise ValidationError(result)

    def __can_claimed(self):
        try:
            return self.can_claimed()
        except ValidationError:
            return False

    def can_claimed(self):
        if self.claimed_by is None or self.last_worked_on is None:
            return True
        elif self.last_worked_on > timezone.now() - timedelta(weeks=4):
            return True

        field_errors = {'field_errors': {'claimed_by': self.CLAIMED_ERROR}}
        raise ValidationError({'field_errors': field_errors, 'form_errors': []})

    def can_purchase(self):
        return self.can_claimed()

    def __can_scrapped(self):
        try:
            return self.can_scrapped()
        except ValidationError:
            return False

    def can_scrapped(self):
        required_fields = ['stripped']

        result = self.__validate_required(required_fields)
        if not result:
            return True

        raise ValidationError(result)

    def can_transfer_to_police(self):
        return self.stolen

    @transition(field=state, source=[BikeState.RECEIVED], target=BikeState.ASSESSED)
    def assessed(self):
        pass

    @transition(field=state, source=[BikeState.ASSESSED, BikeState.CLAIMED], target=BikeState.AVAILABLE
                )
    def available(self):
        self.claimed_by = None
        self.claimed_at = None

    @transition(field=state, source=[BikeState.AVAILABLE], target=BikeState.CLAIMED)
    def claimed(self, member):
        self.claimed_by = member
        self.claimed_at = timezone.now()
        self.last_worked_on = timezone.now()

    @transition(field=state, source=[BikeState.AVAILABLE], target=BikeState.PURCHASED,
                )
    def purchased(self, member):
        self.purchased_at = timezone.now()
        self.purchased_by = member
        self.claimed_at = None
        self.claimed_by = None

    @transition(field=state, source=[BikeState.ASSESSED, BikeState.AVAILABLE],
                target=BikeState.SCRAPPED)
    def scrapped(self):
        self.claimed_at = None
        self.claimed_by = None

    @transition(field=state, source=[BikeState.ASSESSED, BikeState.RECEIVED])
    def transfer_to_police(self):
        self.claimed_at = None
        self.claimed_by = None

    @property
    def available_states(self):
        omit = ['transfer_to_police', 'purchased']
        states = {state_transition.name
                  for state_transition in self.get_available_state_transitions() if state_transition.name not in omit}

        return states
