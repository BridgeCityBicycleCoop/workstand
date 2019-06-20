import factory

from . import signals
from . import models


@factory.django.mute_signals(signals.post_save)
class BikeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Bike
