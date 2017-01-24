import json

from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import get_object_or_404
from django.template.response import TemplateResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView, View
from haystack.query import SearchQuerySet
from rest_framework import viewsets
from rest_framework.renderers import JSONRenderer
from rest_framework.serializers import ModelSerializer

from core.models import Visit
from registration.utils import signin_member, get_signed_in_members
from .serializers import MemberSerializer
from .forms import MemberForm
from .models import Member


@method_decorator(login_required, name='dispatch')
class MemberFormView(View):
    def get(self, request, member_id=None):
        try:
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
            member = Member.objects.get(id=member_id)
            form = MemberForm(request.POST, instance=member)
        except Member.DoesNotExist:
            member = None
            form = MemberForm(request.POST)

        if form.is_valid():
            member_instance = form.save()
            return HttpResponseRedirect(reverse('member_edit', kwargs=dict(member_id=member_instance.id)))

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
        visit = signin_member(member, request.POST.get('purpose'))
        data = json.dumps(dict(results=dict(id=member.id, created_at=visit.created_at.isoformat())))

        return JsonResponse(data=data, safe=False, status=201)

    def get(self, request):
        visits = get_signed_in_members().prefetch_related()
        serializer = VisitSerializer(visits, many=True)
        results_json = JSONRenderer().render(serializer.data)

        return JsonResponse(data=results_json.decode(), safe=False, status=200)


@method_decorator(login_required, name='dispatch')
class Members(TemplateView):
    template_name = 'members.html'

    def get(self, request):
        members = Member.objects.all()
        return self.render_to_response(dict(members=members))


class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
