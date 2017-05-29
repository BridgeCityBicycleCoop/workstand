import hashlib

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from mailchimp3 import MailChimp
from requests import HTTPError

from registration.models import Member


@receiver(post_save, sender=Member, dispatch_uid='member.save_member')
def update_mailchimp(sender, instance, **kwargs):
    if instance.email:
        involvement = {id: True for id in instance.involvement}
        client = MailChimp(settings.MAILCHIMP_USERNAME, settings.MAILCHIMP_API_KEY)
        try:
            response = client.lists.members.create_or_update('1c664549e2',
                                                             hashlib.md5(bytes(instance.email, 'utf-8')).hexdigest(), {
                'email_address': instance.email,
                'status': 'subscribed' if instance.email_consent else 'unsubscribed',
                'status_if_new': 'subscribed' if instance.email_consent else 'unsubscribed',
                'merge_fields': {
                    'FNAME': instance.first_name,
                    'LNAME': instance.last_name,
                },
                'interests': involvement
            })
        except HTTPError as error:
            pass