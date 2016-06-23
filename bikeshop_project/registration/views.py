import logging

from django.contrib import messages
from django.utils.decorators import method_decorator
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.template.response import TemplateResponse
from django.views.generic import View
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers

import json
from haystack.query import SearchQuerySet

from .forms import MemberForm
from .models import Member
from core.models import Visit

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


class MemberSearchView(View):
    def get(self, request, query):
        sqs = SearchQuerySet().models(Member).autocomplete(text=query)[:5]
        results = [
            dict(
                name=result.object.get_full_name(),
                email=result.object.email,
                id=result.object.id,
            )
            for result in sqs
        ]

        data = json.dumps(dict(results=results))

        return HttpResponse(data, content_type="application/json")


class MemberSignIn(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(MemberSignIn, self).dispatch(request, *args, **kwargs)

    def post(self, request):
        member = get_object_or_404(Member, id=request.POST.get("id"))
        Visit.objects.create(member=member, purpose=request.POST.get("purpose"))

        data = json.dumps(dict(results=dict(id=member.id)))
        # logger.debug(data)

        return JsonResponse(data=data, safe=False, status=201)
