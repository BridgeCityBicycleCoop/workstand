import json
import logging
from datetime import datetime, timedelta

from django.core.urlresolvers import reverse
from django.http import JsonResponse
from django.test import Client, TestCase

from core.models import Visit
from model_mommy import mommy

from ..models import CustomUser, Member

logger = logging.getLogger('bikeshop')


class TestMemberFormView(TestCase):
    def setUp(self):
        self.user = mommy.make(CustomUser)
        self.member = mommy.make(Member)

    def test_get_member_new(self):
        url = reverse('member_new')
        c = Client()
        c.force_login(self.user)
        response = c.get(url)
        self.assertEqual(response.status_code, 200)

    def test_post_member_new(self):
        url = reverse('member_new')
        c = Client()
        c.force_login(self.user)
        member_data = {
            'first_name': 'First',
            'last_name': 'Last',
            'post_code': 'H0H0H0',
            }
        c.post(url, data=member_data)
        new_member = Member.objects.get(first_name='First', last_name='Last')
        self.assertTrue(new_member)

    def test_get_member_edit(self):
        url = reverse('member_edit', kwargs=dict(member_id=self.member.id))
        c = Client()
        c.force_login(self.user)
        response = c.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context['form'].instance, self.member)

    def test_post_member_edit(self):
        url = reverse('member_edit', kwargs=dict(member_id=self.member.id))
        c = Client()
        c.force_login(self.user)
        member_data = {
            'first_name': 'First2',
            'last_name': 'Last',
            'post_code': 'H0H0H0',
        }
        response = c.post(url, member_data, follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context['form'].instance.first_name, 'First2')


class TestMemberSearchView(TestCase):
    def setUp(self):
        self.user = mommy.make(CustomUser)
        self.members = mommy.make(Member, _quantity=10)

    def test_search_first_name(self):
        self.query = self.members[0].first_name[0:-10]
        url = reverse('member_search', kwargs=dict(query=self.query))
        c = Client()
        c.force_login(self.user)
        response = c.get(url)

        self.assertEqual(response.status_code, 200)

        data = json.loads(response.content.decode(encoding='utf-8'))
        results = data['results']

        # Check if our made up first name is in the name returned.
        self.assertTrue([result['name'] for result in results
                        if self.query in result['name']])


class TestMemberSignIn(TestCase):
    def setUp(self):
        self.user = mommy.make(CustomUser)
        self.members = mommy.make(Member, _quantity=4)

    def test_post(self):
        """ Test to make sure a new visit is created when a member is signed in.
        """
        url = reverse('member_signin')
        c = Client()
        c.force_login(self.user)

        response = c.post(url,
                          data={
                                'id': self.members[0].id,
                                'purpose': Visit.visit_choices[0]
                                 })
        visit = Visit.objects.filter(member=self.members[0]).first()

        self.assertEqual(response.status_code, 201)
        self.assertIsInstance(response, JsonResponse)
        self.assertTrue(visit)

    def test_post_no_member(self):
        """ A non-existent member should produce a 404.
        """
        url = reverse('member_signin')
        c = Client()
        c.force_login(self.user)

        response = c.post(url, data={'id': 343})

        self.assertTrue(response.status_code, 404)

    def test_get(self):
        """ Test signed in members. Should only return three since one visit
            passed the four hour threshold.
        """
        for member in self.members:
            if member is self.members[0]:
                Visit.objects.create(member=member, purpose=Visit.visit_choices[0],
                                     created_at=datetime.now() - timedelta(hours=5))
            else:
                Visit.objects.create(member=member, purpose=Visit.visit_choices[0])

        url = reverse('member_signin')
        c = Client()
        c.force_login(self.user)

        response = c.get(url)
        data_string = response.content.decode('utf-8')
        data = json.loads(data_string)

        self.assertTrue(len(data), 3)
