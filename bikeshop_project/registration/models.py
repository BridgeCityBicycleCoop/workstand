from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models


class CustomMemberManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password=None):
        """
        Creates and saves a User with the given email and password.
        :param email: str
        :param password: str
        :param first_name: str
        :param last_name: str
        :return: object `CustomUser`
        """
        if not email:
            raise ValueError("Users must have an email address")

        user = self.model(email=self.normalize_email(email),)

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        """
        Creates and saves a superuser with the given email, date of
        birth and password.
        :param email: str
        :param password: str
        :return: object `CustomUser`
        """
        user = self.create_user(email, password=password)
        user.is_admin = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class Member(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(
        verbose_name="email address", max_length=255, unique=True,
    )
    email_consent = models.BooleanField(default=False)
    first_name = models.CharField(max_length=255, null=False)
    last_name = models.CharField(max_length=255, null=False)
    preferred_name = models.CharField(max_length=255, null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=False)
    guardian_name = models.CharField(max_length=255, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    street = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=255, null=True, blank=True)
    province = models.CharField(max_length=255, null=True, blank=True)
    country = models.CharField(max_length=255, null=True, blank=True)
    post_code = models.CharField(max_length=20, null=True, blank=False)
    self_identification = models.CharField(max_length=255, null=True, blank=True)
    gender = models.CharField(max_length=255, null=True, blank=True)
    involvement = models.CharField(max_length=255, null=True, blank=True)
    waiver = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = CustomMemberManager()

    USERNAME_FIELD = "email"
    # REQUIRED_FIELDS = []

    def get_full_name(self):
        # The user is identified by their email address
        if self.first_name and self.last_name:
            return "{0} {1}".format(self.first_name, self.last_name)
        else:
            return self.email

    def get_short_name(self):
        # The user is identified by their email address
        return self.email

    def __str__(self):  # __unicode__ on Python 2
        return self.email

    @property
    def is_staff(self):
        # Simplest possible answer: All admins are staff
        return self.is_admin
