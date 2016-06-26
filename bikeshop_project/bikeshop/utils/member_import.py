import csv
import json
import sys
import os

import requests
from django.utils import timezone
from django.db import IntegrityError
import dateutil.parser

from core.models import Membership, Payment
from registration.models import Member


def email_generator():
    url = "http://randomword.setgetgo.com/get.php"
    local = []
    for idx in range(2):
        r = requests.get(url)
        local.append(r.text)

    return "{0}.{1}@example.com".format(*local)


def payment_type(pt):
    types = Payment.payment_choices
    try:
        return [type for type in types if type[1].lower() == pt.lower()][0]
    except IndexError:
        return ("UNKNOWN", "Unknown")


def member_import():
    filename = os.path.join(
        os.getcwd(), "2016 BCBC Membership Agreement (Responses) - Form Responses 1.csv"
    )
    with open(filename, newline="") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            try:
                dob = dateutil.parser.parse(row.get("dob", None))
            except ValueError:
                dob = None

            try:
                waiver = dateutil.parser.parse(row.get("signed", None))
            except ValueError:
                dob = None

            try:
                renewed_at = dateutil.parser.parse(row.get("timestamp", None))
            except ValueError:
                renewed_at = timezone.now()

            try:
                new_member = Member.objects.create(
                    email=row.get("email", None) or email_generator(),
                    email_consent=row.get("email_consent", False),
                    first_name=row.get("first_name"),
                    last_name=row.get("last_name"),
                    preferred_name=row.get("handle", None),
                    date_of_birth=dob,
                    guardian_name=row.get("guardian", None),
                    phone=row.get("phone", None),
                    street=row.get("address", None),
                    city=row.get("city", None),
                    province=row.get("province", None),
                    country=row.get("country", None),
                    post_code=row.get("postal", None),
                    waiver=waiver,
                )

                payment = Payment.objects.create(
                    type=payment_type(row.get("payment"))[0],
                )

                membership = Membership.objects.create(
                    renewed_at=renewed_at,
                    self_identification=row.get("self_identification", None),
                    gender=row.get("gender", None),
                    member=new_member,
                    payment=payment,
                )
            except IntegrityError as e:
                print(e)
                print(row.get("first_name"), row.get("last_name"), row.get("email"))
