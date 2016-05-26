from django.shortcuts import get_object_or_404
from django.template.response import TemplateResponse
from django.utils import timezone
from django.views.generic import View

from .forms import MemberForm
from .models import Member
import logging

logger = logging.getLogger(__file__)


class MemberFormView(View):
    def get(self, request, member_id=None):
        try:
            logger.debug(member_id)
            member = Member.objects.get(id=member_id)
            form = MemberForm(instance=member)
        except Member.DoesNotExist:
            form = MemberForm()

        context = dict(form=form)
        if form.instance:
            return TemplateResponse(request, "edit_member_form.html", context=context)
        return TemplateResponse(request, "member_form.html", context=context)

    def post(self, request):
        form = MemberForm(request.POST)

        if form.is_valid():
            form.save()
            return TemplateResponse(request, "member_created.html")

        context = {"form": form}
        return TemplateResponse(request, "member_form.html", context=context)
