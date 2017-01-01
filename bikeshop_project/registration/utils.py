from datetime import datetime, timedelta
from typing import Optional

from django.db.models import QuerySet
from django.utils import timezone

from core.models import Visit
from registration.models import Member


class AlreadySignedInError(ValueError):
    pass


def signin_member(member: Member, purpose: str) -> Visit:
    """
    Signs in a member, creating a new `Visit`
    :param member: the member to be signed in
    :param purpose: The reason for visit. E.g. Fix a bike or volunteer
    :return: a new `Visit`
    :raise: `AlreadySignedInError` or `ValidationError`
    """
    if not member_signed_in(member):
        return Visit.objects.create(member=member, purpose=purpose)

    raise AlreadySignedInError


def member_signed_in(member: Member, window: int = 4) -> bool:
    return get_signed_in_members(window=window).filter(id__in=[member.id]).exists()


def get_signed_in_members(window: int = 4, end: Optional[datetime] = None) -> QuerySet:
    new_end = end if end else timezone.now()
    start = new_end - timedelta(hours=window)
    visits = Visit.objects.filter(created_at__lte=new_end, created_at__gte=start)
    return visits
