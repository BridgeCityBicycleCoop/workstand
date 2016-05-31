from django.db import models
from django.utils import timezone


class Membership(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    renewed_at = models.DateTimeField(default=timezone.now)
    self_identification = models.CharField(max_length=255, null=True, blank=True)
    gender = models.CharField(max_length=255, null=True, blank=True)
    involvement = models.CharField(max_length=255, null=True, blank=True)
    member = models.ForeignKey(
        'registration.Member',
        on_delete=models.CASCADE,
        related_name='memberships',
        blank=True,
        null=True
    )
    payment = models.OneToOneField(
        'Payment',
        on_delete=models.CASCADE,
        related_name='membership',
        blank=False,
        null=True
    )


class Payment(models.Model):
    payment_choices = (
        ('NONE', 'None'),
        ('CASH', 'Cash'),
        ('CHEQUE', 'Cheque'),
        ('VOLUNTEERING', 'Volunteering'),
        ('STRIPE', 'Stripe'),
        ('PAYPAL', 'PayPal')
    )
    type = models.CharField(max_length=12, choices=payment_choices, default='NONE')
    created_at = models.DateTimeField(auto_now_add=True)


class Visit(models.Model):
    visit_choices = (
        ('VOLUNTEER', 'volunteer'),
        ('FIX', 'fix bike'), # fix
        ('WORKSHOP', 'workshop'),
        ('VISIT', 'visit'),
        ('DONATE', 'donate'),
        ('STAFF', 'staff'),
    )
    
    member = models.ForeignKey(
        'registration.Member',
        on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    purpose = models.CharField(max_length=50, choices=visit_choices)
