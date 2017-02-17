import logging

from django.conf import settings
from django.contrib import messages
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.template.response import TemplateResponse
from django.views.generic import TemplateView, View
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required

from registration.models import Member

from .forms import MembershipForm, PaymentForm

logger = logging.getLogger(__name__)


@method_decorator(login_required, name="dispatch")
class DashboardView(View):
    def get(self, request):
        return TemplateResponse(
            request, "dashboard.html", context={"DEBUG": settings.DEBUG}
        )


@method_decorator(login_required, name="dispatch")
class NewMembershipView(TemplateView):
    template_name = "membership_form.html"

    def get(self, request, member_id, **kwargs):
        membership_form = MembershipForm(initial=dict(member=member_id))
        payment_form = PaymentForm()
        return self.render_to_response(
            dict(membership_form=membership_form, payment_form=payment_form)
        )

    def post(self, request, member_id):
        membership_form = MembershipForm(request.POST, initial=dict(member=member_id))
        payment_form = PaymentForm(request.POST)
        member = Member.objects.get(id=member_id)

        if membership_form.is_valid() and payment_form.is_valid():
            new_payment = payment_form.save()
            new_membership = membership_form.save()
            new_membership.payment = new_payment
            new_membership.save()
            messages.add_message(
                request,
                messages.SUCCESS,
                "Successfully created our newest member, {first} {last}".format(
                    first=member.first_name, last=member.last_name
                ),
            )
            return HttpResponseRedirect(
                reverse("member_edit", kwargs=dict(member_id=member_id))
            )
        return self.render_to_response(
            dict(membership_form=membership_form, payment_form=payment_form)
        )
