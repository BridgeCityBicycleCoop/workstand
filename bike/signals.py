from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
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

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.send)("check-cpic", message)
