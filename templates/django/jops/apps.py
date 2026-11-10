from django.apps import AppConfig


class JopsConfig(AppConfig):
    """The {% jops %} template tag and the jops-core library
    (static/jops/lib/jops-core.min.js). No models, views or URLs."""

    name = "jops"
    verbose_name = "JOPS"
