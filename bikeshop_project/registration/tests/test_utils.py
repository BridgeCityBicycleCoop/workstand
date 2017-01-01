from datetime import timedelta

from django.test import TestCase
from django.utils import timezone
from model_mommy import mommy

from core.models import Visit
from registration.models import Member
from registration.utils import signin_member, AlreadySignedInError, member_signed_in, get_signed_in_members


class GetSignedInMembersTests(TestCase):
    def setUp(self):
        self.now = timezone.now()

        self.member1 = mommy.make(model=Member)
        self.member2 = mommy.make(model=Member)
        self.member3 = mommy.make(model=Member)

        three_hours_ago = self.now - timedelta(hours=3)
        five_hours_ago = self.now - timedelta(hours=5)

        self.visit1 = Visit.objects.create(member=self.member1, purpose=Visit.DONATE, created_at=self.now)
        self.visit2 = Visit.objects.create(member=self.member2, purpose=Visit.DONATE, created_at=three_hours_ago)
        self.visit3 = Visit.objects.create(member=self.member3, purpose=Visit.DONATE, created_at=five_hours_ago)

    def test_get_signed_in_members(self):
        """
        Only members signed-in in the window are returned
        """
        result1 = get_signed_in_members(end=self.now)  # default window=4
        self.assertEqual(len(result1), 2)

        result2 = get_signed_in_members(window=2, end=self.now)
        self.assertEqual(len(result2), 1)

        result3 = get_signed_in_members(window=5, end=self.now)
        self.assertEqual(len(result3), 3)


class SigninMember(TestCase):
    def test_not_signed_in(self):
        """
        A member who hasn't signed-in in 4 hours is signed-in.
        """
        member = mommy.make(Member)
        purpose = Visit.FIX
        visit = signin_member(member, purpose)

        self.assertIsInstance(visit, Visit)

    def test_signed_in(self):
        """
        A member who has signed-in in 4 hours is not signed-in.
        """
        member = mommy.make(Member)
        purpose = Visit.FIX
        signin_member(member, purpose)

        with self.assertRaises(AlreadySignedInError):
            signin_member(member, purpose)


class CheckMemberSignedIn(TestCase):
    def test_member_not_signed_in(self):
        """
        Returns false when member is not signed-in
        """
        not_signed_member = mommy.make(model=Member)
        result = member_signed_in(not_signed_member)

        self.assertFalse(result)

    def test_member_signed_in(self):
        """
        Returns true when member is signed-in
        """

        member = mommy.make(model=Member)
        Visit.objects.create(member=member, purpose=Visit.DONATE)
        result = member_signed_in(member)

        self.assertTrue(result)
