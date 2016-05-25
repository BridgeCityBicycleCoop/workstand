from django.template.response import TemplateResponse
from django.views.generic import View

from core.forms import MembershipForm


class DashboardView(View):
    def get(self, request):
        return TemplateResponse(request, 'dashboard.html')


class NewMembershipView(View):
    def get(self, request):
        form = MembershipForm()

        return TemplateResponse(request, 'membership_form.html', {'form': form})
