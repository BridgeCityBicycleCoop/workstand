from django.contrib import messages
from django.http import HttpResponseRedirect
from django.template.response import TemplateResponse
from django.views.generic import TemplateView, View
from django.core.urlresolvers import reverse

from core.forms import MembershipForm


class DashboardView(View):
    def get(self, request):
        return TemplateResponse(request, "dashboard.html")


class NewMembershipView(TemplateView):
    template_name = "membership_form.html"

    def get(self, request):
        form = MembershipForm()
        return self.render_to_response(dict(form=form))

    def post(self, request):
        form = MembershipForm(request.POST)

        if form.is_valid():
            member = form.save()
            messages.add_message(
                request,
                messages.SUCCESS,
                "Successfully created our newest member, {first} {last}".format(
                    first=member.first_name, last=member.last_name
                ),
            )
            return HttpResponseRedirect(reverse("new_membership"))

        return self.render_to_response(dict(form=form))
