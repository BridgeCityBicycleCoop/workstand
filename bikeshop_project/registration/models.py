from django.contrib.auth.models import (AbstractBaseUser, BaseUserManager,
                                        PermissionsMixin)
from django.db import models
from multiselectfield import MultiSelectField


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None):
        """
        Creates and saves a User with the given email and password.
        :param email: str
        :param password: str
        :return: object `CustomUser`
        """
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
            )

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


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
        )
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'

    @property
    def is_staff(self):
        # Simplest possible answer: All admins are staff
        return self.is_admin

    def get_short_name(self):
        return self.email

    def get_full_name(self):
        return self.email

    def __str__(self):  # __unicode__ on Python 2
        return self.email

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'


class Member(models.Model):
    involvement_choices = (
        ('21cd9799b6', 'General (receive email)'),
        ('3a5a719017', 'Volunteering'),
        ('0ebb0b5468', 'Events'),
        ('84309225e7', 'Workshops'),
        ('c96d389517', 'Shop'),
    )

    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE,
                                null=True, blank=True)
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=False,
        null=True,
        blank=True,
        )
    email_consent = models.BooleanField(default=False, blank=False)
    first_name = models.CharField(max_length=255, null=False, blank=False)
    last_name = models.CharField(max_length=255, null=False, blank=False)
    preferred_name = models.CharField(max_length=255, null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    guardian_name = models.CharField(max_length=255, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    street = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=255, null=True, blank=True)
    province = models.CharField(max_length=255, null=True, blank=True)
    country = models.CharField(max_length=255, null=True, blank=True)
    post_code = models.CharField(max_length=20, null=True, blank=False)
    waiver = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    notes = models.TextField(null=True, blank=True)
    suspended = models.BooleanField(default=False)
    banned = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    involvement = MultiSelectField(choices=involvement_choices, null=True, blank=True)

    @property
    def full_name(self):
        return self.get_full_name()

    def get_full_name(self):
        # The user is identified by their email address
        return '{0} {1}'.format(self.first_name, self.last_name)

    def get_short_name(self):
        # The user is identified by their email address
        if self.email:
            return self.email
        else:
            return self.last_name

    def __str__(self):              # __unicode__ on Python 2
        return self.email
