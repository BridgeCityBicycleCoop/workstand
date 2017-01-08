from decimal import Decimal
from django.test import TestCase
from model_mommy import timezone

from rest_framework.test import APIClient
from model_mommy import mommy
from rest_framework import status

from bike.consumers import check_cpic
from registration.models import Member
from .models import Bike, BikeState
from unittest.mock import patch


class TestGet(TestCase):
    def setUp(self):
        self.user = mommy.make('registration.CustomUser', is_admin=True, is_superuser=True)

    def test_endpoint_exists(self):
        client = APIClient()
        result = client.get('/api/v1/bikes/')

        self.assertEqual(result.status_code, status.HTTP_200_OK)

    def test_returns_bikes(self):
        mommy.make('bike.bike', 10)
        client = APIClient()
        result = client.get('/api/v1/bikes/')

        self.assertEqual(result.status_code, status.HTTP_200_OK)
        self.assertEqual(len(result.data), 10)

    def test_create_new_bike(self):
        client = APIClient()
        client.force_authenticate(user=self.user, token='blah')
        data = {
            "colour": "black",
            "make": "Miyata",
            "serial_number": "12345676",
            "source": Bike.COS_BIKE_DIVERSION_PILOT,
            "donated_by": "Greg",
            "donated_at": "2017-01-01",
          }
        result = client.post('/api/v1/bikes/', data=data)

        self.assertEqual(result.status_code, status.HTTP_201_CREATED)
        self.assertEqual(result.data['colour'], data['colour'])
        self.assertEqual(result.data['make'], data['make'])
        self.assertEqual(result.data['serial_number'], data['serial_number'])
        self.assertEqual(result.data['source'], data['source'])
        self.assertEqual(result.data['donated_by'], data['donated_by'])
        self.assertEqual(result.data['donated_at'], data['donated_at'])

    def test_update_partial_created_at(self):
        bike = mommy.make('bike.Bike')
        client = APIClient()
        client.force_authenticate(user=self.user, token='blah')
        data = {'created_at': timezone.now().isoformat()}
        result = client.put(f'/api/v1/bikes/{bike.id}/', data=data)

        self.assertEqual(result.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_partial_state(self):
        bike = mommy.make('bike.Bike')
        client = APIClient()
        client.force_authenticate(user=self.user, token='blah')
        data = {'state': BikeState.CLAIMED}
        result = client.put(f'/api/v1/bikes/{bike.id}/', data=data)

        self.assertEqual(result.status_code, status.HTTP_400_BAD_REQUEST)

    def test_assessed_cannot_transition(self):
        bike = mommy.make('bike.Bike')
        client = APIClient()
        client.force_authenticate(user=self.user, token='blah')
        result = client.put(f'/api/v1/bikes/{bike.id}/assessed/')

        self.assertEqual(result.status_code, status.HTTP_400_BAD_REQUEST)


    def test_assessed_cannot_transition(self):
        data = {
            "colour": "black",
            "make": "Miyata",
            "serial_number": "12345676",
            "source": Bike.COS_BIKE_DIVERSION_PILOT,
            "donated_by": "Greg",
            "donated_at": "2017-01-01",
        }
        bike = Bike.objects.create(**data)
        client = APIClient()
        client.force_authenticate(user=self.user, token='blah')
        result = client.put(f'/api/v1/bikes/{bike.id}/assessed/')

        self.assertEqual(result.status_code, status.HTTP_400_BAD_REQUEST)

    def test_assessed_can_transition(self):
        data = {
            "colour": "black",
            "make": "Miyata",
            "serial_number": "12345676",
            "source": Bike.COS_BIKE_DIVERSION_PILOT,
            "donated_by": "Greg",
            "donated_at": "2017-01-01",
            "size": Bike.SMALL,
            "price": Decimal('68.00')
        }
        bike = Bike.objects.create(**data)
        client = APIClient()
        client.force_authenticate(user=self.user, token='blah')
        result = client.put(f'/api/v1/bikes/{bike.id}/assessed/')

        self.assertEqual(result.status_code, status.HTTP_200_OK)
        self.assertEqual(result.data['state'], BikeState.ASSESSED)

    def test_available_cannot_transition(self):
        data = {
            "colour": "black",
            "make": "Miyata",
            "serial_number": "12345676",
            "source": Bike.COS_BIKE_DIVERSION_PILOT,
            "donated_by": "Greg",
            "donated_at": "2017-01-01",
            "size": Bike.SMALL,
            "price": Decimal('68.00'),
            "state": BikeState.ASSESSED
        }
        bike = Bike.objects.create(**data)
        client = APIClient()
        client.force_authenticate(user=self.user, token='blah')
        result = client.put(f'/api/v1/bikes/{bike.id}/available/')

        self.assertEqual(result.status_code, status.HTTP_400_BAD_REQUEST)

    def test_available_can_transition(self):
        data = {
            "colour": "black",
            "make": "Miyata",
            "serial_number": "12345676",
            "source": Bike.COS_BIKE_DIVERSION_PILOT,
            "donated_by": "Greg",
            "donated_at": "2017-01-01",
            "size": Bike.SMALL,
            "price": Decimal('68.00'),
            "state": BikeState.ASSESSED,
            "stolen": False,
            "cpic_searched_at": timezone.now(),
        }

        bike = Bike.objects.create(**data)
        client = APIClient()
        client.force_authenticate(user=self.user, token='blah')
        result = client.put(f'/api/v1/bikes/{bike.id}/available/')

        self.assertEqual(result.status_code, status.HTTP_200_OK)
        self.assertEqual(result.data['state'], BikeState.AVAILABLE)

    def test_claim_cannot_transition_wrong_state(self):
        member = mommy.make(Member)

        data = {
            "colour": "black",
            "make": "Miyata",
            "serial_number": "12345676",
            "source": Bike.COS_BIKE_DIVERSION_PILOT,
            "donated_by": "Greg",
            "donated_at": "2017-01-01",
            "size": Bike.SMALL,
            "price": Decimal('68.00'),
            "state": BikeState.ASSESSED,
            "stolen": False,
            "cpic_searched_at": timezone.now(),
        }
        bike = Bike.objects.create(**data)
        client = APIClient()
        client.force_authenticate(user=self.user, token='blah')
        result = client.put(f'/api/v1/bikes/{bike.id}/claim/', data={'member': member.id}, format='json')

        self.assertEqual(result.status_code, status.HTTP_400_BAD_REQUEST)

    def test_claim_cannot_transition_claimed(self):
        member = mommy.make(Member)

        data = {
            "colour": "black",
            "make": "Miyata",
            "serial_number": "12345676",
            "source": Bike.COS_BIKE_DIVERSION_PILOT,
            "donated_by": "Greg",
            "donated_at": "2017-01-01",
            "size": Bike.SMALL,
            "price": Decimal('68.00'),
            "state": BikeState.CLAIMED,
            "stolen": False,
            "cpic_searched_at": timezone.now(),
            "claimed_by": member,
            "last_worked_on": timezone.now()
        }
        bike = Bike.objects.create(**data)
        client = APIClient()
        client.force_authenticate(user=self.user, token='blah')
        result = client.put('/api/v1/bikes/{bike_id}/claim/'.format(bike_id=bike.id), data={'member': member.id}, format='json')

        self.assertEqual(result.status_code, status.HTTP_400_BAD_REQUEST)

    def test_claim_can_transition(self):
        member = mommy.make(Member)

        data = {
            "colour": "black",
            "make": "Miyata",
            "serial_number": "12345676",
            "source": Bike.COS_BIKE_DIVERSION_PILOT,
            "donated_by": "Greg",
            "donated_at": "2017-01-01",
            "size": Bike.SMALL,
            "price": Decimal('68.00'),
            "state": BikeState.AVAILABLE,
            "stolen": False,
            "cpic_searched_at": timezone.now(),
        }

        bike = Bike.objects.create(**data)
        self.assertEqual(bike.state, BikeState.AVAILABLE)
        client = APIClient()
        client.force_authenticate(user=self.user, token='blah')
        result = client.put(f'/api/v1/bikes/{bike.id}/claim/', data={'member': member.id}, format='json')

        self.assertEqual(result.status_code, status.HTTP_200_OK)
        self.assertEqual(result.data['state'], BikeState.CLAIMED)

    def test_purchase_can_transition_from_available(self):
        member = mommy.make(Member)

        data = {
            "colour": "black",
            "make": "Miyata",
            "serial_number": "12345676",
            "source": Bike.COS_BIKE_DIVERSION_PILOT,
            "donated_by": "Greg",
            "donated_at": "2017-01-01",
            "size": Bike.SMALL,
            "price": Decimal('68.00'),
            "state": BikeState.AVAILABLE,
            "stolen": False,
            "cpic_searched_at": timezone.now(),
        }

        bike = Bike.objects.create(**data)
        self.assertEqual(bike.state, BikeState.AVAILABLE)
        client = APIClient()
        client.force_authenticate(user=self.user, token='blah')
        result = client.put(f'/api/v1/bikes/{bike.id}/purchase/', data={'member': member.id}, format='json')

        self.assertEqual(result.status_code, status.HTTP_200_OK)
        self.assertEqual(result.data['state'], BikeState.PURCHASED)

    def test_purchase_cannot_transition_wrong_state(self):
        member = mommy.make(Member)

        data = {
            "colour": "black",
            "make": "Miyata",
            "serial_number": "12345676",
            "source": Bike.COS_BIKE_DIVERSION_PILOT,
            "donated_by": "Greg",
            "donated_at": "2017-01-01",
            "size": Bike.SMALL,
            "price": Decimal('68.00'),
            "state": BikeState.ASSESSED,
            "stolen": False,
            "cpic_searched_at": timezone.now(),
        }
        bike = Bike.objects.create(**data)
        client = APIClient()
        client.force_authenticate(user=self.user, token='blah')
        result = client.put(f'/api/v1/bikes/{bike.id}/purchase/', data={'member': member.id}, format='json')

        self.assertEqual(result.status_code, status.HTTP_400_BAD_REQUEST)

    def test_purchase_cannot_transition_when_claimed(self):
        member = mommy.make(Member)

        data = {
            "colour": "black",
            "make": "Miyata",
            "serial_number": "12345676",
            "source": Bike.COS_BIKE_DIVERSION_PILOT,
            "donated_by": "Greg",
            "donated_at": "2017-01-01",
            "size": Bike.SMALL,
            "price": Decimal('68.00'),
            "state": BikeState.CLAIMED,
            "stolen": False,
            "cpic_searched_at": timezone.now(),
            "claimed_by": member,
            "last_worked_on": timezone.now()
        }
        bike = Bike.objects.create(**data)
        client = APIClient()
        client.force_authenticate(user=self.user, token='blah')
        result = client.put('/api/v1/bikes/{bike_id}/purchase/'.format(bike_id=bike.id), data={'member': member.id}, format='json')

        self.assertEqual(result.status_code, status.HTTP_400_BAD_REQUEST)

    def test_scrap_transition(self):
        data = {
            "colour": "black",
            "make": "Miyata",
            "serial_number": "12345676",
            "source": Bike.COS_BIKE_DIVERSION_PILOT,
            "donated_by": "Greg",
            "donated_at": "2017-01-01",
            "size": Bike.SMALL,
            "price": Decimal('68.00'),
            "state": BikeState.ASSESSED,
            "stolen": False,
            "cpic_searched_at": timezone.now(),
            "stripped": False
        }
        bike = Bike.objects.create(**data)
        client = APIClient()
        client.force_authenticate(user=self.user, token='blah')
        result = client.put(f'/api/v1/bikes/{bike.id}/scrap/')

        self.assertEqual(result.status_code, status.HTTP_200_OK)

    def test_transfer_to_police_transition(self):
        data = {
            "colour": "black",
            "make": "Miyata",
            "serial_number": "12345676",
            "source": Bike.COS_BIKE_DIVERSION_PILOT,
            "donated_by": "Greg",
            "donated_at": "2017-01-01",
            "size": Bike.SMALL,
            "price": Decimal('68.00'),
            "state": BikeState.ASSESSED,
            "stolen": False,
            "cpic_searched_at": timezone.now(),
            "stolen": True
        }
        bike = Bike.objects.create(**data)
        client = APIClient()
        client.force_authenticate(user=self.user, token='blah')
        result = client.put(f'/api/v1/bikes/{bike.id}/stolen/')

        self.assertEqual(result.status_code, status.HTTP_200_OK)


class TestBikeSignals(TestCase):
    @patch('bike.consumers._is_stolen')
    def test_check_cpic_stolen_bike(self, is_stolen_mock):
        bike = mommy.make(Bike)
        message = {'bike_id': bike.id, 'serial_number': bike.serial_number}
        is_stolen_mock.return_value = True
        check_cpic(message)

        updated_bike = Bike.objects.get(id=bike.id)

        self.assertTrue(updated_bike.stolen)
        self.assertIsNotNone(updated_bike.cpic_searched_at)

    @patch('bike.consumers._is_stolen')
    def test_check_cpic_not_stolen_bike(self, is_stolen_mock):
        bike = mommy.make(Bike)
        message = {'bike_id': bike.id, 'serial_number': bike.serial_number}
        is_stolen_mock.return_value = False
        check_cpic(message)

        updated_bike = Bike.objects.get(id=bike.id)

        self.assertFalse(updated_bike.stolen)
        self.assertIsNotNone(updated_bike.cpic_searched_at)
