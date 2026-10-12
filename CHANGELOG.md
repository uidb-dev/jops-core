# Changelog

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
