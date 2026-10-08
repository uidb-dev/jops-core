# Changelog

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
