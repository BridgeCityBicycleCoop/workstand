import json
import logging

from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import get_object_or_404
from django.template.response import TemplateResponse
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View
from django.views.generic import TemplateView

from core.models import Visit
from haystack.query import SearchQuerySet

from rest_framework.serializers import ModelSerializer
from rest_framework.renderers import JSONRenderer

from .forms import MemberForm
from .models import Member

logger = logging.getLogger('bikeshop')


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
            context['member'] = member
            return TemplateResponse(request, 'edit_member_form.html', context=context)
        return TemplateResponse(request, 'member_form.html', context=context)

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
            return HttpResponseRedirect(reverse('member_edit', kwargs=dict(member_id=member_instance.id)))

        logger.debug(form)

        context = {'form': form}
        if member:
            context['member'] = member
        return TemplateResponse(request, 'member_form.html', context=context)


class MemberSearchView(View):
    def get(self, request, query):
        sqs = SearchQuerySet().models(Member).autocomplete(text=query)[:5]
        results = [dict(name=result.object.get_full_name(), email=result.object.email, id=result.object.id) for result in sqs]

        data = json.dumps(dict(results=results))

        return HttpResponse(data, content_type='application/json')


class MemberSerializer(ModelSerializer):
    class Meta:
        model = Member
        fields = ('full_name', 'email', 'id')

class VisitSerializer(ModelSerializer):
    member = MemberSerializer()
    class Meta:
        model = Visit
        fields = ('created_at', 'purpose', 'member')
        depth = 1

class MemberSignIn(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(MemberSignIn, self).dispatch(request, *args, **kwargs)

    def post(self, request):
        member = get_object_or_404(Member, id=request.POST.get('id'))
        Visit.objects.create(member=member, purpose=request.POST.get('purpose'))
        data = json.dumps(dict(results=dict(id=member.id)))

        return JsonResponse(data=data, safe=False, status=201)

    def get(self, request):
        start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        end = start.replace(hour=23, minute=59, second=59, microsecond=999999)
        visits = Visit.objects.filter(created_at__lte=end, created_at__gte=start).prefetch_related()

        serializer = VisitSerializer(visits, many=True)
        json = JSONRenderer().render(serializer.data)

        return JsonResponse(data=json.decode(), safe=False, status=200)

class Members(TemplateView):
    template_name = 'members.html'

    def get(self, request):
        members = Member.objects.all()
        return self.render_to_response(dict(members=members))