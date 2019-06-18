from unittest.mock import patch

from channels.test import ChannelTestCase
from django.test import TestCase
from model_mommy import mommy

from bike.consumers import check_cpic
from bike.models import Bike


class TestBikeSignals(ChannelTestCase):
    @patch("bike.consumers._is_stolen")
    def test_check_cpic_stolen_bike(self, is_stolen_mock):
        bike = mommy.make(Bike)
        message = {"bike_id": bike.id, "serial_number": bike.serial_number}
        is_stolen_mock.return_value = True
        check_cpic(message)

        updated_bike = Bike.objects.get(id=bike.id)

        self.assertTrue(updated_bike.stolen)
        self.assertIsNotNone(updated_bike.cpic_searched_at)

    @patch("bike.consumers._is_stolen")
    def test_check_cpic_not_stolen_bike(self, is_stolen_mock):
        bike = mommy.make(Bike)
        message = {"bike_id": bike.id, "serial_number": bike.serial_number}
        is_stolen_mock.return_value = False
        check_cpic(message)

        updated_bike = Bike.objects.get(id=bike.id)

        self.assertFalse(updated_bike.stolen)
        self.assertIsNotNone(updated_bike.cpic_searched_at)
