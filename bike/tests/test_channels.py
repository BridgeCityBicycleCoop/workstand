# Don't know how to test this right now...

# from unittest.mock import patch

# import pytest
# from asgiref.sync import async_to_sync
# from channels.testing import ApplicationCommunicator
# from model_mommy import mommy

# from bike.consumers import Cpic
# from bike.models import Bike


# @pytest.mark.django_db
# def test_my_consumer():
#     with patch('bike.consumers.Cpic._is_stolen') as is_stolen_mock:
#         is_stolen_mock.return_value = False
#         bike = mommy.make(Bike)
#         message = {}
#         communicator = ApplicationCommunicator(Cpic, {"type": "channel"})
#         async_to_sync(communicator.send_input)({"type": "check-cpic", 'bike_id': bike.id, 'serial_number': bike.serial_number})
#         updated_bike = Bike.objects.get(id=bike.id)

#         print(updated_bike)

#         assert updated_bike.stolen == False
#         assert updated_bike.cpic_searched_at is not None
