import logging

from django.contrib import messages
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.template.response import TemplateResponse
from django.views.generic import TemplateView, View

from registration.models import Member

from .forms import MembershipForm

logger = logging.getLogger(__name__)


class DashboardView(View):
    def get(self, request):
        return TemplateResponse(request, 'dashboard.html')


class NewMembershipView(TemplateView):
    template_name = 'membership_form.html'

    def get(self, request, member_id):
        form = MembershipForm(initial=dict(member=member_id))
        return self.render_to_response(dict(form=form))

    def post(self, request, member_id):
        form = MembershipForm(request.POST, initial=dict(member=member_id))
        member = Member.objects.get(id=member_id)

        if form.is_valid():
            form.save()
            messages.add_message(request, messages.SUCCESS, 'Successfully created our newest member, {first} {last}'
                                 .format(first=member.first_name, last=member.last_name))
            return HttpResponseRedirect(reverse('member_edit', kwargs=dict(member_id=member_id)))
        return self.render_to_response(dict(form=form))
