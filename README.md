# JOPS — JavaScript OOP SPA Framework

A no-bundler, vanilla-JavaScript SPA framework for developers who think in OOP and native-mobile patterns.

## What is JOPS?

JOPS is a lightweight SPA framework built on native ES6 modules. It discards the complexity of modern build toolchains while keeping a structured, class-based architecture inspired by Android's view and lifecycle model.

No Webpack. No Babel. No compiler. Just `<script type="module">` and a browser.

## Where JOPS Fits

|           | No Bundler    | OOP Classes | Declarative View Nesting | No Element Registration |
| --------- | ------------- | ----------- | ------------------------ | ------------------------------ |
| **JOPS**  | ✅            | ✅          | ✅                       | ✅                             |
| Lit       | ✅            | ✅          | ⚠️ Web Components only   | ❌                             |
| Stimulus  | ✅            | ✅          | ❌                       | ✅                             |
| Alpine.js | ✅            | ❌          | ❌                       | ✅                             |
| Angular   | ❌            | ✅          | ✅                       | ✅                             |
| Svelte    | ❌ (compiler) | ✅          | ✅                       | ✅                             |

**Target audience:** Teams building internal tools, dashboards, embedded WebViews, or native mobile hybrid apps who want a structured, class-based frontend architecture without the npm/webpack/babel ecosystem overhead.

**Next.js teams:** a JOPS SPA can also run inside a Next.js page, next to React, with Next.js as its backend. See [Next.js Integration](#nextjs-integration).

---

## JOPS Demos

| Demo | Description |
| ---- | ----------- |
| [JOPS Hello World](https://cdn.ui-db.com/hello-world/index.html) | A minimal starter app showing views, layouts, routing, and event binding |

---

## Installation

### CDN

The fastest way to get started. Add these two tags to any HTML page:

```html
<script type="importmap">
{
  "imports": {
    "jops-core": "https://cdn.jsdelivr.net/npm/jops-core@latest/lib/jops-core.min.js"
  }
}
</script>
<script type="module" src="https://cdn.jsdelivr.net/npm/jops-core@latest/lib/jops-core.min.js" data-app="./src/App.js"></script>
```

The import map lets your app modules use `import { View } from "jops-core"`. The module script tag bootstraps the app entry point specified in `data-app`.

`App.js` is your entry point — a file you provide that instantiates your root `View` and mounts it to the page. Point `data-app` to wherever you place it.

Replace `@latest` with a specific version (e.g. `@1.1.1`) to pin. No build step, no npm, no bundler.

By default the app renders into `<body>`. To render it into an element instead (keeping the rest of the page), add `data-root` with the element's id:

```html
<div id="app"></div>
<script type="module" src="https://cdn.jsdelivr.net/npm/jops-core@latest/lib/jops-core.min.js" data-app="./src/App.js" data-root="app"></script>
```

> **Note:** ES modules require an HTTP server — open your project with `npx serve` (or any static server) rather than double-clicking `index.html`. Browsers block `import` on `file://` URLs.

For editor autocomplete and inline docs without installing the full package, add jops-core as a dev dependency:

```bash
npm i -D jops-core
```

Your editor picks up `lib/jops-core.d.ts` automatically via the `"types"` field in `package.json`.

### npm

For greenfield projects that want local tooling and scaffolding:

```bash
npm init -y
npm install jops-core
npx jops-core init
```

`npx jops-core init` vendors the library to `/lib/jops-core.min.js`, configures `index.html` with the import map, and injects build and postinstall scripts into `package.json`. It first asks which template to start from:

| Choice | Template |
| --- | --- |
| 1 | Empty JOPS project: the basic skeleton of a JOPS app |
| 2 | Hello World JOPS project: an example app using every feature |
| 3 | Next.js JOPS Embedded SPA: a Next.js project hosting a JOPS SPA (see [Next.js Integration](#nextjs-integration)) |
| 4 | None: only the library, `index.html` and scripts |

### Updating the library

When a new version of JOPS is released, run both commands:

```bash
npm i jops-core@latest
npx jops-core update
```

`npm i` updates `node_modules`; `npx jops-core update` copies the new `lib/jops-core.min.js` into your project so the browser picks it up. Running `update` without `npm i` first has no effect — it copies whatever version is already in `node_modules`.

### Build for production

```bash
npm run build
```

Generates a clean `dist/` folder ready to serve.

### VS Code — HTML highlighting in layout templates

Install the [lit-html](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html) extension, then add this to your `.vscode/settings.json`:

```json
{
  "lit-html.tags": ["layout"],
  "editor.tokenColorCustomizations": {
    "textMateRules": [
      {
        "scope": "invalid.illegal.unrecognized-tag.html",
        "settings": { "foreground": "#569CD6" }
      }
    ]
  }
}
```

This gives you HTML syntax highlighting, Emmet, and autocomplete inside every `` layout`...` `` tagged template. Custom view tags (e.g. `<MyView>`) are coloured blue like standard HTML elements instead of red. `npx jops-core init` configures this automatically.

---

## Hybrid Mobile Apps (Cordova, Ionic & Capacitor)

JOPS runs unchanged inside a mobile WebView, so the same app can ship to the iOS App Store and Google Play through a hybrid shell. Nothing on this page affects JOPS in a regular browser: every mobile adjustment is either feature-detected (it only runs when the native shell is present) or a CSS value that resolves to `0` outside it.

| Shell | Status |
| --- | --- |
| Apache Cordova (iOS + Android) | Supported and tested (cordova-ios 8, cordova-android 15) |
| Capacitor (iOS + Android) | Supported and tested (Capacitor 8) — install `@capacitor/app` for the Android back button |
| Ionic | Use Ionic's framework-free UI components (`@ionic/core`) on top of Cordova or Capacitor. `ionic start` always scaffolds an Angular, React or Vue app, which JOPS is not meant to be combined with — start from a plain Cordova or Capacitor project instead |

### Setup order

**1. Create the hybrid project and its platforms.**

```bash
# Cordova
cordova create my-app com.example.myapp MyApp
cd my-app
cordova platform add ios android
```

```bash
# Capacitor
mkdir my-app && cd my-app
npm init -y
npm i @capacitor/core @capacitor/ios @capacitor/android @capacitor/app
npm i -D @capacitor/cli
npx cap init MyApp com.example.myapp --web-dir www
npx cap add ios
npx cap add android
```

**2. Install JOPS in the project root** — the folder with `package.json`, *not* inside `www/`. Cordova and Capacitor copy the whole web folder into the app, so a `node_modules/` there would be bundled too.

```bash
npm i jops-core
```

**3. Run `init` from the project root** (running it from inside `www/` / your `webDir` works too):

```bash
npx jops-core init
```

`init` detects the project type and writes the app into the web folder that the shell actually serves — `www/` for Cordova, the `webDir` from `capacitor.config.*` for Capacitor:

```
[jops-core] Detected cordova project → web folder: www/
```

**4. Build and run** with the shell's own tools: `cordova run ios` / `cordova run android`, or `npx cap sync` followed by `npx cap run ios` / `npx cap run android` (or open the native project in Xcode / Android Studio).

### What `npx jops-core init` configures

| | Web | Cordova | Capacitor |
| --- | --- | --- | --- |
| `index.html`, `lib/`, template | current folder | `www/` | `webDir` |
| `.vscode/` and `package.json` scripts | current folder | project root | project root |
| `viewport-fit=cover` | — | ✓ | ✓ |
| Content-Security-Policy | — | adds `'unsafe-inline'` (inline import map) and `blob:` (`Thread` workers) to `script-src` | — (Capacitor has none by default) |
| `<script src="cordova.js">` | — | ✓ | — |
| iOS custom scheme in `config.xml` | — | ✓ (`app://localhost`) | — (Capacitor uses `capacitor://localhost`) |
| `"build"` script in `package.json` | ✓ | — (use `cordova build`) | — (use `npx cap sync`) |
| `"postinstall": "npx jops-core init"` | ✓ | ✓ | ✓ |

- Every step checks first, so running `init` again — including through `postinstall` — never duplicates anything.
- **Cordova's sample page:** when you pick the *Empty* or *Hello World* template and `www/index.html` is still the page created by `cordova create`, `init` renames it to `www/index.cordova.html` and writes a JOPS `index.html` instead (the sample's `js/index.js` expects markup that a JOPS app replaces). No files are deleted; `css/`, `img/` and `js/` from the sample can be removed by hand.
- **iOS scheme (Cordova):** JOPS loads `App.js`, views and layouts with native `import()` and `fetch()`, which WebViews block on `file://` pages. Cordova Android and Capacitor already serve from `https://localhost`; for Cordova iOS, `init` adds the following to `config.xml` (applied on the next `cordova prepare` / `build` / `run`):

  ```xml
  <platform name="ios">
      <preference name="scheme" value="app" />
      <preference name="hostname" value="localhost" />
  </platform>
  ```

  Values you already set are never changed — any custom scheme works. `init` warns if the iOS scheme is `file`, `http` or `https`, or if `AndroidInsecureFileModeEnabled` is `true`, since both keep the app on `file://`. **Already-published apps:** the new origin cannot see data stored under `file://` (localStorage, IndexedDB), so plan a migration if your app stores data locally.
- `npx jops-core update` writes to the same web folder, and `npx jops-core build` is skipped in hybrid projects (the web folder is shipped as-is).
- Override the detection with `--cordova`, `--capacitor` or `--web` (for example `npx jops-core init --web` to treat the current folder as a plain web app).

For reference, the `index.html` that `init` produces for a new Cordova project:

```html
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'self' data: blob: https://ssl.gstatic.com; script-src 'self' 'unsafe-inline' blob:; style-src 'self' 'unsafe-inline'; connect-src 'self' data: blob:; media-src * blob:; img-src 'self' data: blob: content:;" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <script type="importmap">
    { "imports": { "jops-core": "/lib/jops-core.min.js" } }
  </script>
</head>
<body>
  <script src="cordova.js"></script>
  <script type="module" src="/lib/jops-core.min.js" data-app="./src/App.js"></script>
</body>
```

### Android back button

In Cordova and Capacitor, JOPS connects the Android back button (key and gesture) to the Router automatically:

- If `Router.singleton().canGoBack()` is `true`, it calls `Router.back()` — the current view receives `onBackPressed()` exactly as with browser back.
- On the first screen, it closes the app (`navigator.app.exitApp()`), the standard Android behaviour.

This is required on Android 16 (`targetSdk 36`, predictive back): without a `backbutton` listener, Cordova lets the system handle back and the app closes on the first press regardless of history. It also smooths over a cordova-android 15 issue where one key press fires `backbutton` twice.

The hook only activates on the `deviceready` event, which Cordova and Capacitor fire and a regular browser never does. If your app handles `backbutton` itself, turn the built-in handler off:

```html
<script type="module" src="/lib/jops-core.min.js" data-app="./src/App.js" data-native-back="off"></script>
```

**Capacitor:** install the official App plugin — no code is needed:

```bash
npm i @capacitor/app
npx cap sync
```

Capacitor's Cordova compatibility layer fires `deviceready` and forwards JOPS's `backbutton` listener to the plugin, so the behaviour above applies unchanged. Without `@capacitor/app`, Capacitor does not intercept back at all and the app closes on the first press; JOPS logs a console warning in that case.

> **Do not** also register `App.addListener("backButton", ...)` while the built-in handler is on: the plugin calls your listener *and* fires `backbutton`, so every press would go back twice.

To handle back yourself in Capacitor, opt out with `data-native-back="off"` and use the plugin's global (no bundler needed):

```js
const { App } = window.Capacitor.Plugins;

App.addListener("backButton", () => {
  const router = Router.singleton();
  if (router?.canGoBack()) router.back();
  else App.exitApp();
});
```

### Notches, Dynamic Island and the home indicator

With `viewport-fit=cover` (added by `npx jops-core init` in Cordova and Capacitor projects) the page extends under the status bar and the home indicator. Pad fixed or sticky bars with the safe-area insets — they are `0` in a regular browser, so the layout is unchanged there:

```css
.header {
  padding-top: calc(1rem + env(safe-area-inset-top, 0px));
}
.footer {
  padding-bottom: calc(2rem + env(safe-area-inset-bottom, 0px));
}
```

The Hello World template already does this.

### Debugging

- **Android:** open `chrome://inspect` in desktop Chrome while the emulator or a device runs the debug build.
- **iOS:** Safari → Develop → *Simulator* → your app.

A `cordova_plugins.js` "not found" error in the console is expected when the project has no Cordova plugins installed; it is harmless.

---

## Next.js Integration

A JOPS SPA can run inside a page of a Next.js (App Router) app. Next.js keeps what it does best (server rendering, data, Route Handlers, its own routing and React ecosystem) and the JOPS app adds class-based views with an Android-style lifecycle on the pages that need them. Both render on the same page:

- **Next.js owns the path** (`/quotes`), **JOPS owns the hash** (`/quotes#details?id=q2`).
- The JOPS app's files live in `public/` and are served as-is: they are never bundled by Turbopack or webpack.
- The backend is Next.js: the JOPS app calls Route Handlers with `fetch()`.

### Quick start: the Next.js template

In an empty folder (or a fresh npm project):

```bash
npx jops-core init
```

and pick **3. Next.js JOPS Embedded SPA**. `init` writes the project into the current folder, merges its dependencies and scripts into an existing `package.json` (existing entries are kept), vendors the library and runs `npm install`. Then:

```bash
npm run dev
```

| Path | What it is |
| --- | --- |
| `src/app/about/page.tsx` | A React-only page (no JOPS) |
| `src/app/jops-spa/page.tsx` | Renders `<JopsApp app="/jops-spa/App.js" />`, which launches the JOPS SPA |
| `src/app/api/quotes/route.ts` | `GET /api/quotes[?status=…]`: the SPA's backend |
| `public/jops-spa/` | The JOPS SPA: a Router with a mock `#login` screen and a `#quotes` list with status filters |
| `public/lib/jops-core.min.js` | The JOPS library, vendored |

`init` refuses to run in a folder that already has a Next.js project (`next.config.*`, `tsconfig.json`, `src/app`) and changes nothing there; to add JOPS to an existing Next.js app, follow the manual setup below.

### Manual setup in an existing Next.js app

**1. Install JOPS and vendor the library** into `public/lib/` (served as `/lib/jops-core.min.js`):

```bash
npm i jops-core
npx jops-core update
```

`update` detects a Next.js project (`next.config.*`) and copies the library to `public/lib/jops-core.min.js`. Run it again after every `npm i jops-core@latest`; adding `"postinstall": "jops-core update"` to `package.json` does it automatically.

**2. Put the JOPS app in `public/`**, e.g. `public/my-app/App.js`, `public/my-app/layout/main.html` and its views. `App.js` is the same entry module as in a standalone app:

```js
import { View } from "jops-core";

export default class App {
  constructor() {
    const root = new View();
    root.loadLayout("/my-app/layout/main.html").then(() => root.render());
  }
}
```

**3. Render `JopsApp` on the page** that hosts the app:

```tsx
// src/app/my-app/page.tsx
import JopsApp from "jops-core/nextjs";

export default function MyAppPage() {
  return <JopsApp app="/my-app/App.js" id="my-app-root" />;
}
```

`JopsApp` is a Client Component (`"use client"` is built in), so it can be used from a Server Component page. It renders an empty `<div>` on the server; in the browser it loads `/lib/jops-core.min.js` once per page, adds the `"jops-core"` import map to `<head>` and mounts the app into its `<div>`. You don't add an import map or script tag to the root layout.

| Prop | Description |
| --- | --- |
| `app` | **Required.** URL of the app's entry module (`/my-app/App.js`); its default export is instantiated |
| `id` | `id` of the root `<div>` (CSS, tests) |
| `className` | `className` of the root `<div>` |
| `lib` | URL of the jops-core library, default `/lib/jops-core.min.js`. The import map uses the same URL, so the page always has a single jops-core instance |

The root `<div>` has `position: relative`, which the Router's slide and fade animations need.

### App lifecycle inside Next.js

- **Leaving the page ends the app completely**, like closing a standalone app: a Next.js link to another page, or Back past the entry the app was launched from. The Router and every view are destroyed, the `<div>` is emptied, `Store` and `EventBus` are cleared, and the history methods JOPS wrapped are restored. Nothing of the app is left running.
- **Coming back launches it again** (a link, or Forward) and restores the screen from the hash.
- **Links to the app's own page don't relaunch it.** A Next.js `<Link href="/my-app">` while the app runs shows the default (first) route; `<Link href="/my-app#details?id=7">` shows that route. Stacked `navigate()` views are closed in both cases.
- Next.js history state (`history.state`) is kept in every entry JOPS writes, so Next.js Back/Forward keep working.

### Conventions

- **Root-absolute paths** for everything JOPS loads: `src="/my-app/Quotes.js"`, `layout="/my-app/layout/quotes.html"`, `loadLayout("/my-app/…")`. ES module `import` statements inside your `.js` files resolve relative to the file as usual.
- **Vendored library** (`public/lib/`), not the CDN: with the CDN, JOPS turns `/…` paths into page-relative ones.
- **Next.js owns the CSS.** `setStyle()` has no effect inside Next.js (a console message says so once). Tailwind CSS v4 also scans the files in `public/`, so Tailwind classes in JOPS layouts and views are generated by the Next.js build. Write class names as complete literal strings (`"bg-sky-50"`, never `` `bg-${color}-50` ``). Put other CSS in `globals.css` or a CSS file imported by the page, scoped under the app's root class (`.my-app table td { … }`), since it applies to the whole site.
- **Backend calls:** `fetch("/api/…")` to Route Handlers on the same origin; the session cookie is sent automatically. A JOPS app can't call Server Actions.
- **One JOPS app per page.** `Router`, `Store` and `EventBus` are page-wide singletons.
- **Always use `JopsApp` inside a Next.js page.** Don't add the jops-core `<script>` or an import map to a page or layout yourself: React doesn't run scripts it renders on soft navigation, and nothing would end the app when the page is left.

### Deploying

The result is a standard Next.js app: `npm run build` produces `.next/`, and it runs on a Node.js server when it uses server features such as Route Handlers. Deploy it like any Next.js app (see the [Next.js deployment docs](https://nextjs.org/docs/app/getting-started/deploying)). Points specific to JOPS:

- **Deploy `public/` with the app**: the whole JOPS app and the library live there. With `output: "standalone"`, copy `public/` (and `.next/static/`) into `.next/standalone/` yourself.
- **Caching:** files in `public/` are not content-hashed, so a CDN or the browser may keep serving an old `jops-core.min.js` or view after a deploy. Use short cache headers for those paths, or versioned paths.
- **Library version:** run `npx jops-core update` after updating the package and before `npm run build`.

---

## Embedding JOPS in Other Pages (Hosted Mode)

A JOPS app can run inside any page that is not a React component: a plain HTML page, or a page rendered by another server framework (PHP, ASP.NET, Rails, Django, …). This is the mechanism `JopsApp` uses in Next.js; **inside a Next.js page, use `JopsApp`** instead (see [Next.js Integration](#nextjs-integration)).

Load the library with `data-host` and no `data-app`: nothing starts automatically, and `window.JOPS` exposes `mount()` and `unmount()` (a `jops:ready` event fires when it is available). The import map and the script `src` must be the same URL, so the page has a single jops-core instance.

```html
<script type="importmap">
  { "imports": { "jops-core": "https://cdn.jsdelivr.net/npm/jops-core@latest/lib/jops-core.min.js" } }
</script>
<script type="module" src="https://cdn.jsdelivr.net/npm/jops-core@latest/lib/jops-core.min.js" data-host></script>

<div id="app" style="position: relative"></div>
<script type="module">
  const start = () => window.JOPS.mount({ app: "./my-app/App.js", root: document.getElementById("app") });
  window.JOPS ? start() : window.addEventListener("jops:ready", start, { once: true });
</script>
```

| Function | Description |
| --- | --- |
| `mount({ app, root })` | Imports `app` and creates its default export; the root view renders into `root` (an `HTMLElement`) instead of `<body>`. Returns a promise of the App instance |
| `unmount()` | Ends the app completely: destroys the Router and every view, empties `root`, clears `Store` and `EventBus`, and restores the history methods JOPS wrapped. Safe to call more than once; `mount()` can start an app again afterwards |

- **Paths depend on where the library comes from.** With the library from the CDN (as above), JOPS resolves paths relative to the **hosting page**: `./my-app/App.js` on `example.com/admin/users` means `example.com/admin/my-app/App.js`, and root-absolute `/my-app/...` paths are turned page-relative too. With a vendored library on the same origin (`/lib/jops-core.min.js` in both the import map and `src`), write root-absolute paths (`/my-app/App.js`, `src="/my-app/Users.js"`), which work on every page.
- **Ending the app:** a full page load ends it anyway. A host that removes the app's element without a page load, or navigates with `history.pushState()`, calls `unmount()`; when history moves to another path the Router also ends the app by itself.
- `mount` and `unmount` are also exported by the module (`import { mount, unmount } from "jops-core"`) for modules running on the same page.
- In hosted mode `setStyle()` has no effect (the host page provides the CSS) and the Android back button integration is off.

---

## Class Reference

### `View` — Base Class

The foundational building block. Every screen, component, and sub-component extends `View`.

```js
import { View } from "jops-core";

export default class MyView extends View { ... }
```

#### Constructor

| Constructor                 | Description |
| --------------------------- | ----------- |
| `new View(layout?, props?)` | `layout` (optional) is passed to `loadLayout(layout)` when the view is created: a `.js` layout module path, an `.html` file path, or an inline HTML string. An inline string is assigned to `this.layout` immediately. `props` (optional) sets the view's [input props](#tag-props-input-properties) for a view created in code. |

Usually the layout comes from the view's `layout=` attribute or from an overridden `loadLayout()`, so subclasses call `super()` with no argument. Pass an inline layout when a view builds its markup from data, for example one row per record:

```js
import { View, layout } from "jops-core";

export default class QuoteRow extends View {
  constructor(quote) {
    super(layout`<tr><td>${quote.number}</td><td>${quote.companyName}</td></tr>`);
    this.quote = quote;
  }
}

// in the parent view:
await this.addSubView("rows", new QuoteRow(quote));
```

#### Lifecycle (called by the framework in order)

| Method                    | When called                                                                    |
| ------------------------- | ------------------------------------------------------------------------------ |
| `async loadLayout(path?)` | Override to load a layout `.js` module or `.html` file. When you pass a path, `await` (or `return`) `super.loadLayout(…)` — see [Overriding `loadLayout()`](#overriding-loadlayout). Loads once per view |
| `inflate()`               | Converts `this.layout` string into `this.domNode`                              |
| `async onLayout()`        | DOM is live — add subviews, read initial data                                  |
| `async onResume()`        | View comes to the front — on first display, on every return navigation, and when the same route is shown again with new parameters. A Router route is resumed only when it is shown |
| `bindEvents()`            | Wires `on*` attributes on `[jops-event-bind]` elements to class methods |

Optional hooks, called by the Router:

| Method            | When called |
| ----------------- | ----------- |
| `onPause()`       | A different view comes to the front and this one stays alive: another route is shown, a stacked view is opened on top of it with `navigate()`, or `replace()` shows another view. Always runs before the incoming view's `onResume()`. Not called when the view is destroyed instead (Back from a stacked view, a stack closed by a route link, leaving the app) |
| `onBackPressed()` | The user navigates back from this view (browser back, `Router.back()`, Android back button in hybrid apps) — never on forward navigation. For a route it runs before `onPause()`; for a stacked view it is the last call before the view is destroyed, so put closing logic here |

`onPause()` and `onResume()` are not passed on to child views. The root view (the one whose `render()` is called first) gets the full lifecycle too, after its declared children.

#### Instance Methods

| Method                          | Description                                                                                                    |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `get(id)`                       | Returns an `Element` wrapper for the first element with the given `id`, searching every top-level element of the layout |
| `find(id)`                      | Returns an array of `Element` wrappers for every element with the given `id` across the layout (sub-views' DOM included), in page order |
| `find(condition)`               | Depth-first search across full subview subtree; returns flat array of all views matching the predicate         |
| `props`                         | The view's read-only [input props](#tag-props-input-properties)                                                 |
| `setStyle(style)`               | Injects a `.css` file link or inline style tag into `<head>`, deduped. No effect when the app runs inside Next.js (the host owns the CSS) |
| `addSubView(containerId, view)` | Appends `view` into the child element with `id="containerId"`, runs its full lifecycle                         |
| `insertSubView(view, index)`    | Inserts `view` at position `index` within `this.domNode`, runs its full lifecycle                              |
| `removeSubView(view)`           | Removes `view` from DOM and `this.subViews`, calls `view.destroy()`                                            |
| `show()`                        | Shows the view again (removes the inline `display` override)                                                   |
| `hide()`                        | Hides the view (`display: none`)                                                                               |
| `destroy()`                     | Recursively destroys subtree — calls `destroy()` on all subviews, removes the view's elements from the DOM, removes its owned `EventBus` subscriptions, nulls references |

- **`show()` / `hide()` are visual only**: they don't call `onPause()` / `onResume()`. Refresh or pause a view toggled this way yourself.
- **A removed view is final.** `removeSubView()` destroys it; adding the same instance again logs a warning and does nothing. Keep the data outside the view (the `Store`, the parent's fields, the server) and create a new instance to show it again. `addSubView()` also warns and adds nothing when the container id doesn't exist or the layout failed to load.
- **The root view's container is borrowed.** The root view uses its container (`<body>`, the `data-root` element, or the element passed to `mount()`) as its `domNode`; destroying the root empties the container instead of removing it.

#### Tag props (input properties)

Attributes on a declared `jops` tag are passed to its view as **props**, like Android's `AttributeSet` or React's props:

```html
<Card jops src="/src/Card.js" title="Monthly report" item-id="42" variant="compact"></Card>
```

```js
export default class Card extends View {
  constructor() {
    super();
    // props are available right after super(), in loadLayout() and in onLayout()
    this.layout = layout`<article class="card ${this.props.variant}"><h3>${this.props.title}</h3></article>`;
    this.inflate();
  }
  onLayout() {
    console.log(this.props.itemId); // "42"
  }
}
```

- Names are converted to camelCase (`item-id` → `itemId`); values are always strings.
- `this.props` is read-only (a frozen object), and `{}` when there are none.
- `jops`, `type="jops"`, `src`, `layout`, `path` and `jops-event-bind` belong to JOPS and are not props. `id`, `class` and `on*` attributes are props only: they are not copied to the view's element, and an `onclick` prop is not bound.
- The view's constructor needs no parameters for this: props reach declared views whatever their constructor looks like.
- A view created in code can get props through the constructor: `new View(layout, { title: "Hi" })`, or `super(undefined, props)` in a subclass.
- Props come from tags in static layouts processed by `render()`: the root layout, the Router's route declarations, and the layouts of declared views. Tags inside the layout of a view added with `addSubView()`, or inside a route's own layout, are not created as views; add those children in code.

#### Layouts with several top-level elements

A layout may have one or more top-level elements:

```html
<h2 id="title">Quotes</h2>
<table><tbody id="rows"></tbody></table>
```

`this.domNode` is the first one and `this.domNodes` holds all of them. `get()`, `find(id)`, `bindEvents()`, `show()`, `hide()`, `addSubView()`, `insertSubView()` and `destroy()` act on all of them, in order. Top-level text is ignored. The Router's `slide` and `fade` animations need single-root views: a stacked view with several top-level elements switches instantly.

#### Declarative Event Binding

Mark any element with `jops-event-bind` and add `on*` attributes whose values are method names on the View class:

```html
<button jops-event-bind onclick="onSave">Save</button>
```

```js
onSave(event) { ... }
```

`bindEvents()` wires the markup of the view's layout when the view is shown. HTML you generate later (with `Element.set()` or `innerHTML`) is not bound — the browser would treat `onclick="onSave"` as an inline script. Wire generated markup yourself, ideally with one listener on its container (event delegation):

```js
// layout: <tbody id="lines" jops-event-bind onclick="onLineAction"></tbody>
// generated rows: <button data-action="remove" data-index="3">✕</button>
onLineAction(event) {
  const button = event.target.closest("[data-action]");
  if (button?.dataset.action === "remove") this.removeLine(Number(button.dataset.index));
}
```

---

### `Element` — DOM Accessor (returned by `View.get()`)

Returned by `view.get(id)` (and, as an array, by `view.find(id)`). Wraps a single DOM element for reading and writing.

| Method / property   | Description |
| ------------------- | ----------- |
| `set(html)`         | Sets the `innerHTML` of the element (plain text or HTML). Returns the wrapper, for chaining. **Not escaped**: pass values from users or the network through `layout` |
| `attr(name, value)` | Sets an attribute; `null` or `undefined` removes it, `""` sets a boolean attribute (`disabled`, `hidden`, `required`). Returns the wrapper, for chaining |
| `value()`           | Returns the current `innerHTML` of the element |
| `element`           | The underlying DOM element, for anything else (`classList`, `textContent`, properties). `null` when no element has that id |
| `Element.from(element, id)` | Static. Wraps an element you already have |

`set()`, `attr()` and `value()` never throw. When no element has the id, they do nothing (`value()` returns `""`) and log a warning with the id — usually a typo. On a destroyed view (for example after an async request finished when the user had already left), they do nothing silently. Code that uses `element` or `this.domNode` directly has no such guard.

> `set()` replaces plain markup. Don't use it to clear a container that holds sub-views: call `removeSubView()` for each of them first, otherwise they stay in the parent's `subViews`.

```js
this.get("username").set("Alice");
const current = this.get("username").value();

// chaining, with escaped data from the API
this.get("quote_id")
  .set(layout`${quote.number}`)
  .attr("href", `#quote?id=${quote.id}`);

this.get("save").attr("disabled", "");    // disable
this.get("save").attr("disabled", null);  // enable again
```

> `attr()` can't inject HTML, but URL attributes (`href`, `src`) still accept `javascript:` URLs. Don't put untrusted values into them unchecked.

---

### `layout` — Tagged Template Function

XSS-safe tagged template literal for defining HTML layouts. Dynamic values are HTML-escaped automatically. Use `raw()` to opt out for trusted HTML.

```js
import { layout, raw } from "jops-core";

const html = layout`<p>${userInput}</p>`;             // escaped
const html = layout`<p>${raw("<b>trusted</b>")}</p>`; // raw HTML
```

---

### HTML file layouts

In addition to `.js` layout modules, `loadLayout()` accepts a path to a plain `.html` file. The framework fetches the file, caches it for the lifetime of the page, and assigns its contents as the view's layout — no import, no export, no tagged template required.

**Via `layout` attribute (declarative):**
```html
<View jops layout="/src/layout/mainlayout.html"></View>
```

**Via `loadLayout()` (programmatic):**
```js
await root.loadLayout("/src/layout/mainlayout.html");
root.render();
```

#### Overriding `loadLayout()`

When a view class overrides `loadLayout()` and passes a **path**, it must `await` (or `return`) `super.loadLayout(…)`:

```js
class QuoteRow extends View {
  loadLayout() {
    return super.loadLayout("/quotes/layout/quote_row.html");   // ✓ returns the promise
  }
}

// Equivalent; handy when the override does more after loading:
class QuoteRow extends View {
  async loadLayout() {
    await super.loadLayout("/quotes/layout/quote_row.html");    // ✓ waits, then resolves
  }
}
```

The framework waits for the promise returned by `loadLayout()` before calling `inflate()`. Loading a path is asynchronous (`fetch()` for `.html`, a dynamic `import()` for `.js`), so without `await` the layout arrives too late and the view renders empty.

| Passed to `super.loadLayout()` | Loading | `await` needed |
| --- | --- | --- |
| An `.html` path | `fetch()` | **yes** |
| A `.js` path | dynamic `import()` | **yes** |
| A string (inline HTML, or a layout module imported at the top of the file) | synchronous | no |

`mainlayout.html` is a plain HTML fragment:

```html
<div class="jops-root">
  <View jops layout="/src/layout/layout_header.html"></View>
  <main>
    <Router jops animation="slide">
      <View path="/home" jops layout="/src/layout/layout_home.html"></View>
      <MyView path="/detail" jops src="/src/MyView.js"></MyView>
    </Router>
  </main>
</div>
```

> **Note:** `.html` layouts are fetched at runtime and cached in memory — identical dedup behaviour to the browser's module cache for `.js` layouts. Each unique path is fetched once per page load.

`loadLayout()` loads **once per view**: calls made while a load is in progress (with or without a path) wait for it, and once a layout is loaded, later calls return at once. A failed load (for example a 404) leaves the view without a layout, so it can be retried. This also makes `new View("/path/to/layout.html")` followed by `addSubView()` work: `addSubView()` waits for the layout the constructor started loading.

---

### `raw(html)` — Function

Wraps a trusted HTML string to bypass escaping inside a `layout` template.

```js
import { raw } from "jops-core";

raw("<b>Hello</b>"); // passed through as-is inside layout``
```

---

### `Router` — extends `View`

Hash-based SPA router. Singleton. Declared in the layout as `<Router jops animation="slide">`.

#### Two Navigation Paradigms

| Pattern                  | Mechanism          | Instance             | Android analogy                 |
| ------------------------ | ------------------ | -------------------- | ------------------------------- |
| `href="#path"`           | flat, hashchange   | pre-existing, reused | Tab navigation                  |
| `navigate(path, Class?)` | hierarchical stack | always new instance  | `startActivity()`               |
| `replace(path, Class?)`  | resets stack       | existing or new      | `startActivity(FLAG_CLEAR_TOP)` |

#### Static Methods

| Method               | Description                        |
| -------------------- | ---------------------------------- |
| `Router.singleton()` | Returns the single Router instance |

#### Instance Methods

| Method                      | Description                                                                                                                                                                                    |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `navigate(path, ClassDef?)` | Creates a new view instance for `path`, pushes onto the nav stack, animates forward. Updates address bar to `#path?params`. `ClassDef` required for dynamic routes not in the static route map |
| `back()`                    | Navigates back — pops the nav stack with animation if non-empty, otherwise calls `history.back()`                                                                                              |
| `canGoBack()`               | Returns `true` if there is an earlier JOPS history entry to go back to (like checking the back stack in Android)                                                                              |
| `replace(path, ClassDef?)`  | Clears the nav stack and navigates to `path`. Uses existing flat route instance if available, otherwise creates a new one from `ClassDef`. Replaces the current history entry and keeps its existing `history.state` |
| `getParams()`               | Returns the current URL query params as a plain object. Works for both static (`href="#path?k=v"`) and dynamic (`navigate("/path?k=v")`) routes                                                |

#### Navigation and the lifecycle

| Navigation | Outgoing view | Incoming view |
| --- | --- | --- |
| Route link (`href="#users"`), Forward to a route | `onPause()` | `onResume()` |
| Back to the previous route | `onBackPressed()`, `onPause()` | `onResume()` |
| Same route with new params (`#details?id=1` → `#details?id=2`) | — | `onResume()` |
| `navigate()` (stacked view) | `onPause()` | new instance: `onLayout()` → `onResume()` |
| Back from a stacked view | `onBackPressed()`, then destroyed | `onResume()` |
| Route link while stacked views are open | stacked views destroyed (no `onPause()`) | `onResume()` |

- The first route declared in `<Router>` is the default: it is shown on startup when the URL has no known route hash, and whenever the hash becomes empty (`href="#"`, a link to the page itself).
- Each route is resumed only when it is shown; at startup only the selected route gets `onResume()`. Every route gets `onLayout()` at startup.
- **Screen rule:** put screen views in `<Router>`. A route's own layout is not scanned for declared views, so a screen adds its child views in code with `addSubView()`.

#### Animation

Set via the `animation` attribute on the `<Router>` element:

| Value              | Behaviour                                                                  |
| ------------------ | -------------------------------------------------------------------------- |
| `"none"` (default) | Instant switch, no animation                                               |
| `"slide"`          | Forward: incoming slides in from right. Back: outgoing slides out to right |
| `"fade"`           | Crossfade between outgoing and incoming                                    |

Animation only occurs on `navigate()` (forward) and `back()` when the nav stack is non-empty. Flat tab switching is always instant, and so is a transition involving a view whose layout has several top-level elements.

#### Layout Declaration

```html
<Router jops animation="slide">
  <view jops src="/src/Home.js" path="/home"></view>
  <view jops src="/src/Form.js" path="/form"></view>
</Router>
```

> **Note:** The legacy `type="jops"` and `type="jops-event-bind"` syntax is still supported for backwards compatibility.

#### Query Params

```js
// static route with params
<a href="#form?tab=profile">Profile</a>;

// dynamic navigation with params
Router.singleton().navigate("/detail?id=42&mode=edit", DetailView);

// read params in any view's onResume()
const { id, mode } = Router.singleton().getParams();
```

---

### `Store` — Singleton State Container

App-wide runtime state. No reactivity — a plain shared key-value store with dot-notation path access. Views read from Store in `onResume()` and write in event handlers.

```js
import { Store } from "jops-core";

const store = Store.singleton();
```

| Method              | Description                                                            |
| ------------------- | ---------------------------------------------------------------------- |
| `Store.singleton()` | Returns the single Store instance, creating it on first call           |
| `get(path)`         | Reads a value by dot-notation path, e.g. `"user.name"`                 |
| `set(path, value)`  | Writes a value by dot-notation path; auto-creates intermediate objects |
| `clear()`           | Resets the entire state to `{}`                                        |

```js
Store.singleton().set("user.name", "Alice");
Store.singleton().get("user.name"); // "Alice"
Store.singleton().set("cart.items", [1, 2, 3]);
Store.singleton().clear();
```

---

### `EventBus` — Static Pub/Sub

Stateless cross-view event broadcasting. All methods are static — no instance needed.

| Method                                         | Description                                                            |
| ---------------------------------------------- | ---------------------------------------------------------------------- |
| `EventBus.subscribe(owner, event, callback)`   | Registers a listener owned by `owner` (usually a view, `this`). It is removed automatically when the owner is destroyed |
| `EventBus.subscribe(event, callback)`          | Registers a global listener. It stays until you unsubscribe it          |
| `EventBus.send(event, data?)`                  | Fires the named event to all subscribers with an optional data payload |
| `EventBus.unsubscribe(event, callback)`        | Removes a specific listener (owned or global) by reference             |
| `EventBus.unsubscribeAll(owner)`               | Removes every subscription of `owner` (called by `View.destroy()`)     |
| `EventBus.clear()`                             | Removes every listener of every event                                  |

```js
import { View, EventBus } from "jops-core";

class Header extends View {
  onLayout() {
    // owned: removed when this view is destroyed (removeSubView, Router, unmount)
    EventBus.subscribe(this, "user:login", (user) => this.showUser(user));
  }
}

EventBus.send("user:login", { name: "Alice" });

// global: keep the function reference to be able to unsubscribe it
const onLogin = (user) => console.log(user.name);
EventBus.subscribe("user:login", onLogin);
EventBus.unsubscribe("user:login", onLogin);
```

Prefer the owned form inside views. A global subscription made by a view keeps that view in memory and keeps calling it after it is destroyed, until you unsubscribe it (in an overridden `destroy()` that calls `super.destroy()`, or in `onPause()` with a new subscription in `onResume()`).

---

### `mount()` / `unmount()` — Functions

Start and end an app in a host page (hosted mode). Used by `JopsApp` in Next.js; see [Embedding JOPS in Other Pages](#embedding-jops-in-other-pages-hosted-mode). The page must load jops-core with `data-host` (otherwise it starts `data-app` / `./src/App.js` by itself); `window.JOPS.mount` / `window.JOPS.unmount` are the same functions.

```js
import { mount, unmount } from "jops-core";

await mount({ app: "/my-app/App.js", root: document.getElementById("app") });
unmount(); // destroys the Router and all views, empties the root, clears Store and EventBus
```

---

### `Thread` — Web Worker Base Class

Base class for running CPU-bound work on a background thread. Extend and override `run()` and `onMessage()`.

| Method              | Description                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| `start(params?)`    | Spawns a Web Worker, runs `run(params)` on it, and wires `onMessage` for results                 |
| `run(params)`       | Override to define the work. Runs inside the Worker — self-contained, no outer scope access      |
| `onMessage(event)`  | Override to handle results posted back from the worker via `self.postMessage()`                  |
| `terminate()`       | Terminates the worker immediately and clears the internal reference                              |

```js
import { Thread } from "jops-core";

class HashThread extends Thread {
  run(params) {
    // runs on a background thread — no access to the main thread or class instance
    let hash = 0;
    for (let i = 0; i < params.data.length; i++) hash ^= params.data.charCodeAt(i);
    self.postMessage(hash);
  }
  onMessage(event) {
    console.log("Hash result:", event.data);
  }
}

const t = new HashThread();
t.start({ data: "hello world" });
// later:
t.terminate();
```

> **Note:** Each `Thread` instance spawns one OS thread. Avoid running more concurrent threads than the device has logical CPU cores — excess threads add context-switching overhead with no throughput gain. Check `navigator.hardwareConcurrency` for the core count. A `ThreadPool` class that manages a fixed worker pool automatically is planned for a future JOPS release.

---

## CLI

| Command                | Description                                                                |
| ---------------------- | -------------------------------------------------------------------------- |
| `npx jops-core init`   | Vendor library, configure `index.html`, inject scripts into `package.json`. Detects Cordova and Capacitor projects (see [Hybrid Mobile Apps](#hybrid-mobile-apps-cordova-ionic--capacitor)). Template 3 creates a Next.js project instead (see [Next.js Integration](#nextjs-integration)) |
| `npx jops-core update` | Copy the latest `jops-core.min.js` from `node_modules` to `lib/` (`public/lib/` in a Next.js project) |
| `npx jops-core build`  | Generate production-ready `dist/` folder (skipped in Cordova/Capacitor projects) |

`init` and `update` accept `--cordova`, `--capacitor` or `--web` to override the detected project type.

After each command the CLI checks npm for a newer jops-core and prints a notice if one is available (at most 1.5 s, silent when offline). `build` also warns if `lib/jops-core.min.js` doesn't match the installed version. Turn the check off with `--no-update-check` or `JOPS_NO_UPDATE_CHECK=1`; it is skipped automatically when `CI` is set.

---

## Source & Contributing

JOPS is distributed as a single minified ES module (`lib/jops-core.min.js`) together with full TypeScript declarations (`lib/jops-core.d.ts`), plus the `JopsApp` React component for Next.js (`lib/nextjs/`, imported as `jops-core/nextjs`). The source repository is private.

This is a deliberate choice. JOPS is maintained by one developer at [UIDB](https://ui-db.com), and keeping the codebase in one pair of hands keeps it small, consistent, and fast to change.

What that means for you:

- **Free to use.** JOPS is MIT-licensed. Use it in personal, commercial, and client projects.
- **The API is the contract.** Every public class, method, and lifecycle hook is documented in this README and typed in `jops-core.d.ts`, so your editor gives you autocomplete and inline docs.
- **Readable stack traces.** The build keeps class and function names (`--keep-names`), so errors point to `View.loadLayout`, not `e.t`.
- **Backwards compatible within a major version.** Pin `jops-core@1` if you want to control major upgrades.
- **Feedback goes through issues.** Bug reports and feature requests are welcome in [GitHub Issues](https://github.com/uidb-dev/jops-core/issues), and questions in [Discussions](https://github.com/uidb-dev/jops-core/discussions). The repository doesn't accept pull requests; describe the change in an issue instead.
