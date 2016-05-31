from django.contrib import messages
from django.http import HttpResponseRedirect
from django.template.response import TemplateResponse
from django.views.generic import View
from django.core.urlresolvers import reverse

from .forms import MemberForm
from .models import Member
import logging

logger = logging.getLogger("bikeshop")


class MemberFormView(View):
    def get(self, request, member_id=None):
        try:
            logger.debug(member_id)
            member = Member.objects.get(id=member_id)
            form = MemberForm(instance=member)
        except Member.DoesNotExist:
            form = MemberForm()
            member = None

        context = dict(form=form)
        if member:
            context["member"] = member
            return TemplateResponse(request, "edit_member_form.html", context=context)
        return TemplateResponse(request, "member_form.html", context=context)

    def post(self, request, member_id=None):
        try:
            logger.debug(member_id)
            member = Member.objects.get(id=member_id)
            form = MemberForm(request.POST, instance=member)
        except Member.DoesNotExist:
            member = None
            form = MemberForm(request.POST)
        logger.debug(form)
        if form.is_valid():
            member_instance = form.save()
            logger.debug(member_instance)
            return HttpResponseRedirect(
                reverse("member_edit", kwargs=dict(member_id=member_instance.id))
            )

        logger.debug(form)

        context = {"form": form}
        if member:
            context["member"] = member
        return TemplateResponse(request, "member_form.html", context=context)
