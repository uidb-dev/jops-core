<?php
/**
 * Plugin Name:       JOPS
 * Plugin URI:        https://github.com/uidb-dev/jops-core
 * Description:       Embeds a JOPS single-page app in a page with the [jops] shortcode, e.g. in Elementor's Shortcode widget: [jops app="/jops-spa/src/App.js" id="jops-spa-root"]
 * Version:           {{VERSION}}
 * Requires at least: 6.5
 * Requires PHP:      7.4
 * Author:            UIDB
 * Author URI:        https://cdn.ui-db.com
 * License:           MIT
 * License URI:       https://opensource.org/licenses/MIT
 * Text Domain:       jops
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * [jops app="/jops-spa/src/App.js" id="jops-spa-root" class="" lib=""]
 *
 * Outputs the same block as the Elementor HTML-widget snippet: the "jops-core"
 * import map, the library (hosted mode, data-host), the app's root <div> and an
 * inline module that mounts the app. Module scripts run in document order after
 * the page is parsed, so the library has fully loaded when the mount script
 * runs. The mount script still waits for import(lib), which returns the module
 * the library tag loads once it has fully run (or fails if it cannot load), so
 * it also works when something inserts the block with JavaScript (Elementor
 * popups, AJAX content) or replays its scripts later (script-delay plugins). One app per page: a second [jops] logs a warning and is not
 * started. In the Elementor editor the shortcode outputs only a placeholder:
 * the app runs on the published page.
 *
 * - app:   root-based path of the app's entry module (required).
 * - id:    id of the root <div> (default "jops-root").
 * - class: class of the root <div>, e.g. to scope the app's CSS.
 * - lib:   URL of jops-core.min.js (default: the copy in this plugin's lib/).
 *          Must be the same URL on the whole page, or the browser loads two
 *          jops-core instances.
 *
 * @param array|string $atts Shortcode attributes.
 * @return string
 */
function jops_shortcode( $atts ) {
	$atts = shortcode_atts(
		array(
			'app'   => '',
			'id'    => 'jops-root',
			'class' => '',
			'lib'   => '',
		),
		$atts,
		'jops'
	);

	$app = trim( $atts['app'] );
	if ( '' === $app || '/' !== $app[0] ) {
		return "\n<!-- JOPS: the app attribute must be a root-based path, e.g. [jops app=\"/jops-spa/src/App.js\"] -->\n";
	}

	$lib    = '' !== trim( $atts['lib'] ) ? esc_url_raw( trim( $atts['lib'] ) ) : plugins_url( 'lib/jops-core.min.js', __FILE__ );
	$config = array(
		'app'  => $app,
		'root' => $atts['id'],
		'lib'  => $lib,
	);

	if ( jops_in_elementor_editor() ) {
		return sprintf(
			'<div style="padding: 1em; border: 1px dashed currentColor; opacity: 0.7">JOPS app %s (runs on the published page)</div>',
			esc_html( $app )
		);
	}

	$json = JSON_HEX_TAG | JSON_HEX_AMP | JSON_UNESCAPED_SLASHES;
	$map  = wp_json_encode( array( 'imports' => array( 'jops-core' => $lib ) ), $json );
	$div  = sprintf(
		'<div id="%s"%s data-jops-root style="position: relative"></div>',
		esc_attr( $atts['id'] ),
		'' !== $atts['class'] ? ' class="' . esc_attr( $atts['class'] ) . '"' : ''
	);

	return '
<script type="importmap">' . $map . '</script>
<script type="module" src="' . esc_url( $lib ) . '" data-host="wordpress"></script>
' . $div . '
<script type="module">
  const c = ' . wp_json_encode( $config, $json ) . ';
  const root = document.getElementById(c.root);
  const fail = () => console.error("JOPS: could not load " + c.lib + "; #" + c.root + " was not started.");
  const start = () => {
    if (!window.JOPS) return fail();
    if (document.querySelector("[data-jops-mounted]")) {
      console.warn("JOPS: one app per page; #" + c.root + " was not started.");
      return;
    }
    root.setAttribute("data-jops-mounted", "");
    window.JOPS.mount({ app: c.app, root });
  };
  // Only wait for the library once its tag is in the page: import() alone would
  // load jops-core without data-host (standalone mode).
  if (document.querySelector("script[data-host]")) import(c.lib).then(start, fail);
  else fail();
</script>
';
}
add_shortcode( 'jops', 'jops_shortcode' );

/**
 * Whether the shortcode is rendered by the Elementor editor: a widget rendered
 * while editing, or the editor's preview iframe.
 *
 * @return bool
 */
function jops_in_elementor_editor() {
	if ( ! did_action( 'elementor/loaded' ) || ! class_exists( '\\Elementor\\Plugin' ) ) {
		return false;
	}
	$elementor = \Elementor\Plugin::$instance;
	return ( isset( $elementor->editor ) && $elementor->editor->is_edit_mode() )
		|| ( isset( $elementor->preview ) && $elementor->preview->is_preview_mode() );
}
