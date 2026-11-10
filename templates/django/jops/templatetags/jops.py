"""{% jops %}: embeds a JOPS single-page app in a Django template.

    {% load jops %}
    {% jops "my_app/spa/src/App.js" id="spa-root" class="my-spa" %}

Outputs the same block as the WordPress [jops] shortcode: the "jops-core"
import map, the library in hosted mode (data-host="django"), the app's root
<div> and an inline module that mounts the app with window.JOPS.mount().

Arguments:
- app (first argument, required): the app's entry module. A static path
  ("my_app/spa/src/App.js") is resolved with {% static %}; a root-based path
  ("/static/...") or a full URL is used as is.
- id:    id of the root <div> (default "jops-root").
- class: class of the root <div>, e.g. to scope the app's CSS.
- base:  the app's folder, e.g. "my_app/spa/" (a static path, joined to
         STATIC_URL; a root-based path or a URL is used as is). With base, the
         relative paths inside the JOPS files (src=, layout=, loadLayout())
         resolve against that folder, so the app works with any STATIC_URL,
         including a CDN (which must send CORS headers), and with hashed
         storage.
- lib:   URL of jops-core.min.js (default: this app's static copy). Must be the
         same URL on the whole page, or the browser loads two jops-core
         instances.

The root <div> carries the request's CSRF token as data-csrf, for fetch()
calls that change data (header X-CSRFToken). With django-csp, the inline
scripts get the request's nonce. One app per page: a second {% jops %} logs a
warning and is not started. Paths inside the JOPS files (src=, layout=,
loadLayout()) are not touched: with base, write them relative to the app's
folder (src/layout/main.html); without base, root-based (/static/...).
The page loads the app's stylesheet itself (setStyle() has no effect in hosted
mode); scope its rules under the root <div>'s class, since they apply to the
whole Django page.
"""

import json
from urllib.parse import urljoin

from django import template
from django.conf import settings
from django.middleware.csrf import get_token
from django.templatetags.static import static
from django.utils.html import format_html

register = template.Library()

DEFAULT_LIB = "jops/lib/jops-core.min.js"


def _url(path):
    """A static path → its static URL; a root-based path or a URL as is."""
    if path.startswith(("/", "http://", "https://")):
        return path
    return static(path)


def _base_url(path):
    """A folder → its URL under STATIC_URL (never through the storage: hashed
    storage has no manifest entry for a folder); a root-based path or a URL as
    is. Always ends with "/"."""
    if not path.startswith(("/", "http://", "https://")):
        path = urljoin(settings.STATIC_URL, path)
    return path if path.endswith("/") else path + "/"


def _json(value):
    """JSON that is safe inside a <script> element."""
    return (
        json.dumps(value)
        .replace("<", "\\u003C")
        .replace(">", "\\u003E")
        .replace("&", "\\u0026")
    )


@register.simple_tag(takes_context=True)
def jops(context, app="", id="jops-root", lib="", base="", **attrs):
    app = (app or "").strip()
    if not app:
        return format_html(
            "<!-- JOPS: {} -->",
            'the app argument is required, e.g. {% jops "my_app/spa/src/App.js" %}',
        )

    lib_url = _url(lib.strip()) if lib else static(DEFAULT_LIB)
    config = {"app": _url(app), "root": id, "lib": lib_url}
    if base:
        config["base"] = _base_url(base.strip())

    request = context.get("request")
    csrf = get_token(request) if request is not None else ""
    # django-csp: reading request.csp_nonce generates the nonce and adds it to the
    # header. str() is needed: its lazy object is falsy until it has been read.
    nonce = str(request.csp_nonce) if hasattr(request, "csp_nonce") else ""
    nonce_attr = format_html(' nonce="{}"', nonce) if nonce else ""
    css_class = attrs.get("class", "")
    class_attr = format_html(' class="{}"', css_class) if css_class else ""

    return format_html(
        """
<script type="importmap"{nonce}>{map}</script>
<script type="module" src="{lib}" data-host="django"></script>
<div id="{id}"{cls} data-jops-root data-csrf="{csrf}" style="position: relative"></div>
<script type="module"{nonce}>
  const c = {config};
  const root = document.getElementById(c.root);
  const fail = () => console.error("JOPS: could not load " + c.lib + "; #" + c.root + " was not started.");
  const start = () => {{
    if (!window.JOPS) return fail();
    if (document.querySelector("[data-jops-mounted]")) {{
      console.warn("JOPS: one app per page; #" + c.root + " was not started.");
      return;
    }}
    root.setAttribute("data-jops-mounted", "");
    window.JOPS.mount({{ app: c.app, root, base: c.base }});
  }};
  // Only wait for the library once its tag is in the page: import() alone would
  // load jops-core without data-host (standalone mode).
  if (document.querySelector("script[data-host]")) import(c.lib).then(start, fail);
  else fail();
</script>
""",
        nonce=nonce_attr,
        map=_SafeJSON({"imports": {"jops-core": lib_url}}),
        lib=lib_url,
        id=id,
        cls=class_attr,
        csrf=csrf,
        config=_SafeJSON(config),
    )


class _SafeJSON(str):
    """Script-safe JSON, inserted by format_html without HTML escaping."""

    def __new__(cls, value):
        return super().__new__(cls, _json(value))

    def __html__(self):
        return str(self)
