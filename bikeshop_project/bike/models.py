from datetime import timedelta
from django.db import models
from django.utils import timezone

from django_fsm import FSMField, transition

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
    donated_by = models.TextField()
    donated_at = models.DateField(blank=False, null=False)
    created_at = models.DateTimeField(default=timezone.now)
    modified_at = models.DateTimeField(auto_now=True)
    cpic_searched_at = models.DateTimeField(blank=True, null=True)
    claimed_at = models.DateTimeField(blank=True, null=True)
    last_worked_on = models.DateTimeField(blank=True, null=True)
    purchased_at = models.DateTimeField(blank=True, null=True)

    def can_assessed(self):
        return self.colour is not None and self.make is not None and self.size is not None and self.source is not None \
               and self.price is not None

    def can_available(self):
        return self.stolen is False and self.cpic_searched_at is not None and self.serial_number is not None

    def can_claim(self):
        return self.claimed_by is None or not (self.claimed_by is not None and self.last_worked_on > timezone.now() + timedelta(
            weeks=4)) or self.last_worked_on is None

    def can_purchase(self):
        if self.claimed_by:
            return self.can_claim()

        return self.purchased_by is None

    def can_scrap(self):
        return self.stripped is not None

    def can_transfer_to_police(self):
        return self.stolen

    @transition(field=state, source=[BikeState.RECEIVED], target=BikeState.ASSESSED, conditions=[can_assessed])
    def assessed(self):
        pass

    @transition(field=state, source=[BikeState.ASSESSED, BikeState.RECEIVED], target=BikeState.AVAILABLE,
                conditions=[can_available])
    def available(self):
        pass

    @transition(field=state, source=[BikeState.AVAILABLE], target=BikeState.CLAIMED, conditions=[can_claim])
    def claim(self, member):
        self.claimed_by = member
        self.claimed_at = timezone.now()
        self.last_worked_on = timezone.now()

    @transition(field=state, source=[BikeState.AVAILABLE, BikeState.CLAIMED], target=BikeState.PURCHASED,
                conditions=[can_purchase])
    def purchase(self, member):
        self.purchased_at = timezone.now()
        self.purchased_by = member

    @transition(field=state, source=[BikeState.ASSESSED, BikeState.AVAILABLE, BikeState.CLAIMED],
                target=BikeState.SCRAPPED, conditions=[can_scrap])
    def scrap(self):
        pass

    @transition(field=state, source=[BikeState.ASSESSED, BikeState.RECEIVED], conditions=[can_transfer_to_police])
    def transfer_to_police(self):
        pass
