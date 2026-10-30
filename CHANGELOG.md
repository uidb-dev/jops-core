# Changelog

## Unreleased

### Fixes

- Views declared in a layout with more than one top-level element are now rendered in every top-level element. Before, only the declared views (`<X jops …>` tags) inside the first top-level element were rendered; tags in the second and later elements stayed in the page as unrendered elements.
- A declared view (`<X jops …>`) or `<Router jops>` that is itself a top-level element of a layout is now rendered, e.g. a layout that starts with `<Header jops …></Header>` followed by other elements. Before, it was rendered only when wrapped in another element. The view that owns the layout keeps the rendered elements as its own, so `get()`, `find()`, `hide()` / `show()` and removing the view also cover them.
- Views declared in the layout of a `Router` route are now rendered. Before, a route rendered only the plain HTML of its layout, and its `<X jops …>` tags (and those of the views inside it) stayed in the page as unrendered elements, with no error.
- The `Router` now hides inactive routes and covered stacked views even when the app's CSS sets their `display` (e.g. `.stats { display: grid }`). It used only the `hidden` attribute, which such CSS overrides, so the previous route stayed visible next to the new one.

## 1.1.2 — 2026-10-28

WordPress integration: a JOPS SPA can now run inside a WordPress page, next to the theme and the page's other content, through the new JOPS WordPress plugin. See the new README section "WordPress Integration".

### WordPress integration

- New JOPS WordPress plugin with the `[jops]` shortcode: `[jops app="/jops-spa/src/App.js" id="jops-spa-root"]` embeds a JOPS app in a page, e.g. with Elementor's Shortcode widget or the block editor's Shortcode block. Attributes: `app`, `id`, `class`, `lib`. The plugin includes the jops-core library. One app per page; in the Elementor editor the widget shows a placeholder, and the app runs on the published page.
- Install without npm: `jops-wordpress.zip` is attached to every GitHub release (always the newest: `https://github.com/uidb-dev/jops-core/releases/latest/download/jops-wordpress.zip`); install it with wp-admin → Plugins → Add New Plugin → Upload Plugin. To update, upload the newer zip and choose "Replace current with uploaded".
- `npx jops-core init --wp` installs the plugin with npm: into `plugins/jops/` of a `wp-env` project (and adds it to `.wp-env.json`), otherwise into the plugins folder of the WordPress installation found in the current folder or above it (standard layout or Bedrock). `--wp-root <path>` points to WordPress instead of searching.
- `npx jops-core update` also refreshes an installed JOPS WordPress plugin and its library.

### New API

- `View.removeSubViews(condition?)`: removes and destroys every subview, or only those matching `condition` (the others keep their order). Not available on a `Router` (logs a warning).

### Fixes

- The `jops:ready` event now fires after jops-core has fully initialised, so calling `mount()` from the listener no longer fails (it threw `Cannot set properties of undefined (setting 'pushState')` when the listener was registered before the library loaded).

## 1.1.1 — 2026-10-23

Documentation only; no library changes.

- README: hosted mode (`data-host`, `mount()` / `unmount()`) moved out of the Next.js section into its own section, "Embedding JOPS in Other Pages (Hosted Mode)", for plain HTML pages and other server frameworks. The example now loads the library from jsDelivr, and the section explains how paths resolve with the CDN (relative to the hosting page) and with a vendored library (root-absolute). Inside a Next.js page, always use `JopsApp`.
- README: `data-root` (render a standalone app into an element instead of `<body>`) is now documented in the CDN installation section.

## 1.1.0 — 2026-10-23

Next.js integration: a JOPS SPA can now run inside a page of a Next.js (App Router) app, next to React, with Next.js Route Handlers as its backend. See the new README section "Next.js Integration". This release also adds new View and EventBus APIs and fixes found while building a full app on JOPS inside Next.js.

### Next.js integration

- New `JopsApp` React component, imported from `jops-core/nextjs`: `<JopsApp app="/my-app/App.js" />` loads the library once per page, adds the `"jops-core"` import map and mounts the app into its own `<div>`. Props: `app`, `id`, `className`, `lib`. `react` and `next` are optional peer dependencies; plain JOPS apps don't need them.
- Hosted mode: load jops-core with `data-host` and nothing starts automatically; `window.JOPS.mount({ app, root })` starts an app inside any element and `window.JOPS.unmount()` ends it. `mount` and `unmount` are also exported by the module.
- Leaving the host page (a link or Back past the app's first entry) ends the app completely: Router, views, container content, `Store`, `EventBus` and JOPS's history hooks are all removed. Coming back launches it again and restores the screen from the hash. Next.js links to the app's own page are handled by the running app, and Next.js history state is kept in every entry JOPS writes.
- `setStyle()` has no effect inside Next.js: the host owns the CSS (Tailwind CSS in Next.js also scans the JOPS files in `public/`).
- `npx jops-core init` has a new template, **3. Next.js JOPS Embedded SPA**: a Next.js project with a React page, a page hosting a JOPS SPA (mock login and a quotes list) and a Route Handler backend. It is written into the current folder and merged into an existing `package.json`.
- `npx jops-core update` detects Next.js projects and copies the library to `public/lib/`.
- Standalone apps can render into an element instead of `<body>`: `data-root="<id>"` on the jops-core script tag.

### New APIs

- `onPause()` lifecycle hook: called when another view comes to the front while this one stays alive (another route shown, a stacked view opened with `navigate()`, `replace()` to another view). Pairs with `onResume()`.
- Tag props: attributes on a declared `jops` tag reach the view as read-only `this.props` (camelCase names, string values), e.g. `<Card jops src="/src/Card.js" title="Hi" item-id="7">` → `{ title: "Hi", itemId: "7" }`. Views created in code can pass props as the second constructor argument: `new View(layout, props)`.
- Layouts may have several top-level elements. `get(id)` searches all of them; `this.domNodes` holds them all (`this.domNode` stays the first).
- `find(id)` returns an `Element` for every element with that id; `find(predicate)` is unchanged.
- `EventBus.subscribe(owner, event, callback)`: the subscription is removed automatically when the owner (usually a view) is destroyed. Also new: `EventBus.unsubscribeAll(owner)` and `EventBus.clear()`. The global `subscribe(event, callback)` form is unchanged.
- `Element.from(element, id)`.

### Fixes and improvements

- The root view now gets the full lifecycle (`onLayout()`, `onResume()`, event binding) and `get()` works on it; it used to get none, so `onclick` handlers in its own layout failed.
- Declared views keep their layout order, so the first route in `<Router>` is reliably the default route (it used to depend on which view file loaded first).
- Router routes are resumed only when shown: at startup only the selected route gets `onResume()`, once (hidden routes got it too, and the selected one twice).
- A view opened with `navigate()` gets `onResume()` once (it was called twice).
- An empty hash after startup (`href="#"`, Back to an entry without a hash) shows the default route instead of being ignored.
- `Router.replace()` keeps the existing `history.state`.
- `loadLayout()` loads once per view: overriding `loadLayout()` no longer fetches each layout twice, and `new View("/layout.html")` + `addSubView()` now works (it threw a `TypeError`).
- `setStyle()` with inline CSS containing line breaks or quotes no longer throws a `SyntaxError`.
- `Element.set()`, `attr()` and `value()` never throw: a wrong id logs a warning with the id, and calls on a destroyed view (e.g. after an async request) do nothing.
- `addSubView()` / `insertSubView()` with a destroyed view, a missing container or a layout that failed to load log a warning and add nothing (they threw, or left the view half-added).
- `View.destroy()` removes the view's owned `EventBus` subscriptions; destroying the root view empties its container instead of removing it.

### Behaviour changes to check

- `npx jops-core init`: "None" moved from choice 3 to choice 4. Scripts that pipe `3` into `init` now get the Next.js template.
- `find("some-id")` with a string used to throw; it now returns an array of `Element`s.
- New npm keywords: `nextjs`, `next-js`, `next.js`, `ssr`.

## 1.0.15 — 2026-10-15

- CLI: `init`, `update` and `build` now tell you when a newer jops-core is on npm, with the exact upgrade commands. If you run `update` before `npm i jops-core@latest`, it explains that it copied the old version. The check takes at most 1.5 s, is silent when offline, and is skipped when `CI` is set. Turn it off with `--no-update-check` or `JOPS_NO_UPDATE_CHECK=1`.
- CLI: `build` warns when `lib/jops-core.min.js` doesn't match the installed package, i.e. `npx jops-core update` was forgotten after an upgrade.

## 1.0.14 — 2026-10-13

- Added npm keywords for hybrid mobile discoverability: `cordova`, `capacitor`, `ionic`, `mobile`, `android`, `ios`, `hybrid-app`, `hybrid-mobile`, `phonegap`.

## 1.0.13 — 2026-10-13

Hybrid mobile support — JOPS apps now run in Apache Cordova and Capacitor (iOS + Android), tested with cordova-ios 8, cordova-android 15 and Capacitor 8. See the new README section "Hybrid Mobile Apps (Cordova, Ionic & Capacitor)".

- Android back button: in Cordova and Capacitor (with `@capacitor/app`), the hardware/gesture back button now navigates the Router (`Router.back()`) and closes the app on the first screen. Required on Android 16 (`targetSdk 36`), where back otherwise closes the app immediately. Activates only on `deviceready`, so regular browsers are unaffected; opt out with `data-native-back="off"` on the jops-core script tag. In Capacitor without `@capacitor/app`, a console warning explains what to install.
- `npx jops-core init` detects Cordova (`config.xml`) and Capacitor (`capacitor.config.*`) projects — run it from the project root (or from inside `www/` / `webDir`) and it writes the app into the folder the shell serves. In hybrid projects it also:
  - adds `viewport-fit=cover` to `index.html`;
  - Cordova: allows the inline import map and `Thread` workers in the Content-Security-Policy (`'unsafe-inline'`, `blob:`), adds `cordova.js`, backs up Cordova's sample page as `index.cordova.html`, and sets the iOS custom scheme (`app://localhost`) in `config.xml` — existing values are never changed;
  - keeps `.vscode/` and `package.json` scripts in the project root, skips the `build` script, and `npx jops-core build` is not used there;
  - `--cordova`, `--capacitor` and `--web` override the detection. Plain web projects get exactly the same output as before.
- Router: new `canGoBack()` method.
- Router fix: `onBackPressed()` is no longer called on forward navigation (tapping an `href="#route"` link fired it in every browser). It now runs only when the user actually navigates back. History entries carry a position (`history.state.jopsIdx`), so back and forward are told apart, including after a reload.
- Router: tapping a flat-route link while `navigate()` views are stacked now closes the stack (previously it played a back animation), and back skips the history entries of those closed views.
- Hello World template: header and footer are padded with `env(safe-area-inset-*)` for notches, the Dynamic Island and the home indicator (no change in regular browsers).

## 1.0.12 — 2026-10-10

- Router: deep links keep their query string on first load (`index.html#form?tab=2`), so `getParams()` returns the params immediately.
- HTML file layouts: `loadLayout()` and the `layout=` attribute now accept `.html` files in addition to `.js` modules. The framework fetches and caches the file for the page lifetime — identical dedup behaviour to JS module layouts.
- Path normalisation: `isCDN` auto-detected at startup; `normalizePath()` ensures correct relative/absolute paths for CDN vs npm installs, applied at all dynamic import and fetch sites.

## 1.0.11 — 2026-10-09

- Router: all route subviews are now initialised as hidden, eliminating the brief flash of non-active views on first render.
- Router: initial navigation now honours a pre-existing URL hash — loading `index.html#media` routes directly to `/media` instead of always defaulting to the first route.
- Path normalisation: `isCDN` flag auto-detected at startup; `normalizePath()` ensures `./`-prefixed paths for CDN and `/`-prefixed paths for npm/lib installs, applied at all three dynamic import sites.

## 1.0.10 — 2026-10-07

- README: added "JOPS Demos" section with a link to the Hello World live demo.

## 1.0.9 — 2026-10-06

- New attribute syntax: use `jops` and `jops-event-bind` as plain boolean attributes instead of `type="jops"` / `type="jops-event-bind"`. Old syntax still works — fully backwards compatible.

## 1.0.8 — 2026-10-05

- README: moved "Updating the library" section to follow the npm installation section for better documentation flow.

## 1.0.7 — 2026-10-05

- Fixed `Thread.start()`: class method shorthand (`run() {}`) was serialized into an invalid worker blob. Now correctly wrapped as a function expression.

## 1.0.6 — 2026-10-05

- Added `Thread` class: extend and override `run(params)` and `onMessage(event)` to run work on a Web Worker. `start(params)` spawns the worker; `terminate()` stops it.
- Added `npx jops-core update` command: copies the latest `lib/jops-core.min.js` from `node_modules` into the project's `lib/` folder without re-running full init.
- README: `Thread` class reference, `ThreadPool` future note, updating workflow docs.

## 1.0.5 — 2026-10-04

- Fixed CDN loading: bootstrap now uses `document.querySelector("script[data-app]")` instead of `document.currentScript` (which is always `null` in a module script).
- Fixed CDN loading: all dynamic `import()` calls for user-supplied paths now resolve against `document.baseURI` via `new URL(path, document.baseURI).href`, so layouts and view modules no longer 404 when the library is served from a different origin (e.g. jsDelivr).
- README CDN snippet updated: added `type="module"` to the script tag, changed `data-app` to a relative path (`./src/App.js`), added HTTP server note.

## 1.0.4 — 2026-10-02

- README: added `npm i -D jops-core` note for CDN users to get editor autocomplete via `lib/jops-core.d.ts`.

## 1.0.3 — 2026-10-02

- Added TypeScript declarations (`lib/jops-core.d.ts`) with JSDoc for all public exports: `View`, `Router`, `Store`, `EventBus`, `layout`, `raw`. Added `"types"` field to `package.json`.
- Updated CDN examples to jsDelivr (`@latest`) in README and landing page.
- MIT license.

## 1.0.2 — 2026-10-02

- Patch release.

## 1.0.1 — 2026-10-01

- Patch release.

## 1.0.0 — 2026-10-01

- Initial public release: `View`, `Router`, `Store`, `EventBus`, CLI (`npx jops-core init`, `npx jops-core build`), `empty` and `hello-world` templates.
