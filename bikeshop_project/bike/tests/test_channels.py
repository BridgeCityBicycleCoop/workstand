from unittest.mock import patch

from channels import Channel
from channels.test import ChannelTestCase
from model_mommy import mommy

from bike.consumers import check_cpic
from bike.models import Bike


class TestBikeCheckCpic(ChannelTestCase):
    @patch('bike.consumers._is_stolen')
    def test_start_check(self, is_stolen_mock):
        is_stolen_mock.return_value = False
        bike = mommy.make(Bike)
        message = {'bike_id': bike.id, 'serial_number': bike.serial_number}

        Channel('check-cpic').send(message)
        check_cpic(self.get_next_message('check-cpic', require=True))

        result = self.get_next_message('result-cpic', require=True)

        updated_bike = Bike.objects.get(id=bike.id)

        self.assertFalse(updated_bike.stolen)
        self.assertIsNotNone(updated_bike.cpic_searched_at)
        self.assertFalse(result['stolen'])
        self.assertEqual(result['bike_id'], message['bike_id'])
        self.assertEqual(result['serial_number'], message['serial_number'])