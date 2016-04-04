from django.template.response import TemplateResponse
from django.views.generic import View


class DashboardView(View):
    def get(self, request):
        return TemplateResponse(request, 'dashboard.html')