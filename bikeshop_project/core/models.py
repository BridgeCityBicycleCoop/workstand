from django.db import models
from django.utils import timezone
from django.utils.functional import cached_property

from dateutil.relativedelta import relativedelta


class Membership(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    renewed_at = models.DateTimeField(default=timezone.now)
    self_identification = models.CharField(max_length=255, null=True, blank=True)
    gender = models.CharField(max_length=255, null=True, blank=True)
    involvement = models.CharField(max_length=255, null=True, blank=True)
    member = models.ForeignKey(
        "registration.Member",
        on_delete=models.CASCADE,
        related_name="memberships",
        blank=True,
        null=True,
    )
    payment = models.OneToOneField(
        "Payment",
        on_delete=models.CASCADE,
        related_name="membership",
        blank=False,
        null=True,
    )

    @cached_property
    def expires_at(self):
        return self.renewed_at + relativedelta(years=1)


class Payment(models.Model):
    payment_choices = (
        ("NONE", "None"),
        ("CASH", "Cash"),
        ("CHEQUE", "Cheque"),
        ("VOLUNTEERING", "Volunteering"),
        ("SQUARE", "Square"),
        ("PAYPAL", "PayPal"),
        ("UNKNOWN", "Unknown"),
    )
    type = models.CharField(max_length=12, choices=payment_choices, default="NONE")
    created_at = models.DateTimeField(auto_now_add=True)


class Visit(models.Model):
    VOLUNTEER = "VOLUNTEER"
    FIX = "FIX"
    WORKSHOP = "WORKSHOP"
    VISIT = "VISIT"
    DONATE = "DONATE"
    STAFF = "STAFF"

    visit_choices = (
        (VOLUNTEER, "volunteer"),
        (FIX, "fix bike"),  # fix
        (WORKSHOP, "workshop"),
        (VISIT, "visit"),
        (DONATE, "donate"),
        (STAFF, "staff"),
    )

    member = models.ForeignKey("registration.Member", on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    purpose = models.CharField(max_length=50, choices=visit_choices)

    def __str__(self):
        return "<Visit purpose: {purpose} created_at: {created_at}>".format(
            purpose=self.purpose, created_at=self.created_at.isoformat()
        )
