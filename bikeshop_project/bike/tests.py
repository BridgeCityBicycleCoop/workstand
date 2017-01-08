from decimal import Decimal
from django.test import TestCase
from model_mommy import timezone

from rest_framework.test import APIClient
from model_mommy import mommy
from rest_framework import status
from .models import Bike, BikeState


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
