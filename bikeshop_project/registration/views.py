from django.template.response import TemplateResponse
from django.utils import timezone
from django.views.generic import View

from .forms import MemberForm


class MemberFormView(View):
    def get(self, request):
        form = MemberForm()
        context = {'form': form}
        return TemplateResponse(request, 'member_form.html', context=context)

    def post(self, request):
        form = MemberForm(request.POST)

        if form.is_valid():
            form.save()
            return TemplateResponse(request, 'member_created.html')

        context = {'form': form}
        return TemplateResponse(request, 'member_form.html', context=context)
