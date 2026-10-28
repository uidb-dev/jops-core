=== JOPS ===
Contributors: uidb
Tags: spa, javascript, elementor, shortcode, embed
Requires at least: 6.5
Requires PHP: 7.4
Stable tag: {{VERSION}}
License: MIT
License URI: https://opensource.org/licenses/MIT

Embeds a JOPS single-page app in a WordPress page with the [jops] shortcode.

== Description ==

JOPS (jops-core) is a no-bundler, class-based SPA framework. This plugin renders a JOPS app inside a WordPress page, next to the theme and the page's other content. It includes the jops-core library (lib/jops-core.min.js), so the page needs nothing else.

== Installation ==

Without npm: download jops-wordpress.zip (https://github.com/uidb-dev/jops-core/releases/latest/download/jops-wordpress.zip), then Plugins > Add New Plugin > Upload Plugin > choose the zip > Install Now. To update, upload the newer zip the same way and choose "Replace current with uploaded".
With npm: npx jops-core init --wp (installs the plugin into the WordPress project).

1. Activate the plugin (Plugins > Installed Plugins > JOPS > Activate).
2. Put your JOPS app folder in the WordPress root directory (next to wp-config.php), e.g. <root>/jops-spa/.
3. Use root-based paths everywhere in the app (/jops-spa/src/..., layouts, images, stylesheets). If WordPress runs in a subfolder (example.com/blog/), include it: /blog/jops-spa/...
4. Edit the page with Elementor, add a Shortcode widget (General > Shortcode) and enter:

[jops app="/jops-spa/src/App.js" id="jops-spa-root"]

Any editor that runs shortcodes works the same way (block editor: Shortcode block).

== Shortcode attributes ==

* app (required): root-based path of the app's entry module (its default export is the App class).
* id: id of the app's root element (default: jops-root).
* class: class of the app's root element; use it to scope the app's CSS.
* lib: URL of jops-core.min.js (default: this plugin's copy). Use one URL per page.

== Notes ==

* One JOPS app per page.
* Do not combine the shortcode with a hand-written JOPS import map on the same page: the browser would load two copies of jops-core.
* The app's CSS applies to the whole page: scope it under the root element's class.
