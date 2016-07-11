from django.test import TestCase


from ..models import CustomUser, Member


class TestCustomUserManager(TestCase):
    def test_create_user(self):
        new_user = CustomUser.objects.create_user("test@example.com")
        self.assertTrue(new_user.pk)

    def test_create_user_no_email(self):
        with self.assertRaises(ValueError):
            CustomUser.objects.create_user(email=None)

    def test_create_superuser(self):
        new_user = CustomUser.objects.create_superuser(
            email="super@example.com", password="password"
        )
        self.assertTrue(new_user.is_admin)
        self.assertTrue(new_user.is_staff)
        self.assertTrue(new_user.check_password("password"))
        self.assertTrue(new_user.pk)


class TestCustomUser(TestCase):
    def setUp(self):
        self.new_user = CustomUser.objects.create_user("test@example.com")

    def test_get_short_name(self):
        self.assertEqual(self.new_user.get_short_name(), "test@example.com")

    def test_get_full_name(self):
        self.assertEqual(self.new_user.get_full_name(), "test@example.com")


class TestMember(TestCase):
    def setUp(self):
        self.new_member = Member.objects.create(
            first_name="First", last_name="Last", post_code="H0H0H0"
        )

    def test_get_full_name(self):
        self.assertEqual(self.new_member.get_full_name(), "First Last")
        self.assertEqual(self.new_member.get_short_name(), "Last")

        # add email to instance
        self.new_member.email = "member@example.com"
        self.assertEqual(self.new_member.get_short_name(), "member@example.com")
