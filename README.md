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

Replace `@latest` with a specific version (e.g. `@1.0.4`) to pin. No build step, no npm, no bundler.

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

`npx jops-core init` vendors the library to `/lib/jops-core.min.js`, configures `index.html` with the import map, and injects build and postinstall scripts into `package.json`.

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

## Class Reference

### `View` — Base Class

The foundational building block. Every screen, component, and sub-component extends `View`.

```js
import { View } from "jops-core";

export default class MyView extends View { ... }
```

#### Lifecycle (called by the framework in order)

| Method                    | When called                                                                    |
| ------------------------- | ------------------------------------------------------------------------------ |
| `async loadLayout(path?)` | Override to load a layout `.js` module                                         |
| `inflate()`               | Converts `this.layout` string into `this.domNode`                              |
| `async onLayout()`        | DOM is live — add subviews, read initial data                                  |
| `async onResume()`        | View becomes visible — called on first display and on every return navigation  |
| `bindEvents()`            | Wires `on*` attributes on `[type="jops-event-bind"]` elements to class methods |
| `onBackPressed()`         | Called by Router when back navigation is detected on this view                 |

#### Instance Methods

| Method                          | Description                                                                                                    |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `get(id)`                       | Returns an `Element` wrapper for the child with the given DOM `id`                                             |
| `setStyle(style)`               | Injects a `.css` file link or inline style tag into `<head>`, deduped                                          |
| `addSubView(containerId, view)` | Appends `view` into the child element with `id="containerId"`, runs its full lifecycle                         |
| `insertSubView(view, index)`    | Inserts `view` at position `index` within `this.domNode`, runs its full lifecycle                              |
| `removeSubView(view)`           | Removes `view` from DOM and `this.subViews`, calls `view.destroy()`                                            |
| `find(condition)`               | Depth-first search across full subview subtree; returns flat array of all views matching the predicate         |
| `show()`                        | Restores `this.domNode` display (removes inline `display` override)                                            |
| `hide()`                        | Sets `this.domNode` to `display: none`                                                                         |
| `destroy()`                     | Recursively destroys subtree — calls `destroy()` on all subviews, removes `domNode` from DOM, nulls references |

#### Declarative Event Binding

Mark any element with `type="jops-event-bind"` and add `on*` attributes whose values are method names on the View class:

```html
<button type="jops-event-bind" onclick="onSave">Save</button>
```

```js
onSave(event) { ... }
```

---

### `Element` — DOM Accessor (returned by `View.get()`)

Returned by `view.get(id)`. Wraps a single DOM element for reading and writing.

| Method       | Description                                                          |
| ------------ | -------------------------------------------------------------------- |
| `set(value)` | Sets `innerHTML` of the element — accepts plain text or HTML strings |
| `value()`    | Returns the current `innerHTML` of the element                       |

```js
this.get("username").set("Alice");
const current = this.get("username").value();
```

---

### `layout` — Tagged Template Function

XSS-safe tagged template literal for defining HTML layouts. Dynamic values are HTML-escaped automatically. Use `raw()` to opt out for trusted HTML.

```js
import { layout, raw } from "jops-core";

const html = layout`<p>${userInput}</p>`;             // escaped
const html = layout`<p>${raw("<b>trusted</b>")}</p>`; // raw HTML
```

---

### `raw(html)` — Function

Wraps a trusted HTML string to bypass escaping inside a `layout` template.

```js
import { raw } from "jops-core";

raw("<b>Hello</b>"); // passed through as-is inside layout``
```

---

### `Router` — extends `View`

Hash-based SPA router. Singleton. Declared in the layout as `<Router type="jops" animation="slide">`.

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
| `replace(path, ClassDef?)`  | Clears the nav stack and navigates to `path`. Uses existing flat route instance if available, otherwise creates a new one from `ClassDef`                                                      |
| `getParams()`               | Returns the current URL query params as a plain object. Works for both static (`href="#path?k=v"`) and dynamic (`navigate("/path?k=v")`) routes                                                |

#### Animation

Set via the `animation` attribute on the `<Router>` element:

| Value              | Behaviour                                                                  |
| ------------------ | -------------------------------------------------------------------------- |
| `"none"` (default) | Instant switch, no animation                                               |
| `"slide"`          | Forward: incoming slides in from right. Back: outgoing slides out to right |
| `"fade"`           | Crossfade between outgoing and incoming                                    |

Animation only occurs on `navigate()` (forward) and `back()` when the nav stack is non-empty. Flat tab switching is always instant.

#### Layout Declaration

```html
<Router type="jops" animation="slide">
  <view type="jops" src="/src/Home.js" path="/home"></view>
  <view type="jops" src="/src/Form.js" path="/form"></view>
</Router>
```

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

| Method                                  | Description                                                            |
| --------------------------------------- | ---------------------------------------------------------------------- |
| `EventBus.subscribe(event, callback)`   | Registers a listener for the named event                               |
| `EventBus.send(event, data?)`           | Fires the named event to all subscribers with an optional data payload |
| `EventBus.unsubscribe(event, callback)` | Removes a specific listener by reference                               |

```js
import { EventBus } from "jops-core";

EventBus.subscribe("user:login", (data) => console.log(data.name));
EventBus.send("user:login", { name: "Alice" });
EventBus.unsubscribe("user:login", handler);
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
| `npx jops-core init`   | Vendor library, configure `index.html`, inject scripts into `package.json` |
| `npx jops-core update` | Copy the latest `jops-core.min.js` from `node_modules` to `lib/`          |
| `npx jops-core build`  | Generate production-ready `dist/` folder                                   |

### Updating the library

When a new version of JOPS is released, run both commands:

```bash
npm i jops-core@latest
npx jops-core update
```

`npm i` updates `node_modules`; `npx jops-core update` copies the new `lib/jops-core.min.js` into your project so the browser picks it up. Running `update` without `npm i` first has no effect — it copies whatever version is already in `node_modules`.

---

## Source & Contributing

JOPS is distributed as a single minified ES module (`lib/jops-core.min.js`) together with full TypeScript declarations (`lib/jops-core.d.ts`). The source repository is private.

This is a deliberate choice. JOPS is maintained by one developer at [UIDB](https://ui-db.com), and keeping the codebase in one pair of hands keeps it small, consistent, and fast to change.

What that means for you:

- **Free to use.** JOPS is MIT-licensed. Use it in personal, commercial, and client projects.
- **The API is the contract.** Every public class, method, and lifecycle hook is documented in this README and typed in `jops-core.d.ts`, so your editor gives you autocomplete and inline docs.
- **Readable stack traces.** The build keeps class and function names (`--keep-names`), so errors point to `View.loadLayout`, not `e.t`.
- **Backwards compatible within a major version.** Pin `jops-core@1` if you want to control major upgrades.
- **Feedback goes through issues.** Bug reports and feature requests are welcome in [GitHub Issues](https://github.com/uidb-dev/jops-core/issues), and questions in [Discussions](https://github.com/uidb-dev/jops-core/discussions). The repository doesn't accept pull requests; describe the change in an issue instead.
