from channels import Channel
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Bike


@receiver(post_save, sender=Bike)
def bike_save_handler(sender, instance, created, **kwargs):
    if created:
        message = {
            "bike_id": instance.id,
            "serial_number": instance.serial_number,
        }

        Channel("check-cpic").send(message)
