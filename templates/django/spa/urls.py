from django.urls import path
from django.views.generic import TemplateView

app_name = "{{APP}}"

# One route per SPA: the JOPS Router keeps its routes in the #hash.
urlpatterns = [
    path("", TemplateView.as_view(template_name="{{APP}}/index.html"), name="index"),
]
