from django.apps import AppConfig


class {{CONFIG}}(AppConfig):
    """JOPS single-page app. The SPA's files are in static/{{APP}}/, its page is
    templates/{{APP}}/index.html. No models: the app fetches its data from the
    project's own views and APIs."""

    name = "{{APP}}"
