/**
 * Starts a JOPS app inside a given element instead of `<body>`. Used by hosts
 * that control when and where the app runs, such as `<JopsApp>` in Next.js
 * (jops-core loaded with `data-host`, which exposes `window.JOPS.mount`).
 * @param {{ app: string, root: HTMLElement }} options - `app`: URL of the app's
 *   entry module (default export is the App class); `root`: element the app's
 *   root view renders into.
 * @returns {Promise<object>} The App instance.
 * @example
 * await mount({ app: "/quotes/App.js", root: document.getElementById("quotes") });
 */
export declare function mount({ app, root }: {
    app: string;
    root: HTMLElement;
}): Promise<object>;
/**
 * Ends the hosted app completely, like closing a standalone app: destroys the
 * Router (listeners, singleton, routes, stacked views) and every view, empties
 * the host root, clears the Store and the EventBus, and restores the host's
 * history methods. The current URL and history entry are left alone: they
 * belong to the host page. Safe to call more than once.
 *
 * Called by the Router itself when history leaves the app's page (Back past
 * the entry the app was launched from, or a host link to another page), and
 * by hosts such as `<JopsApp>` when they remove the app.
 * @example
 * window.JOPS.unmount();
 */
export declare function unmount(): void;
declare class RawHTML {
    html: any;
    constructor(html: any);
}
/**
 * Wraps a trusted HTML string to bypass XSS escaping inside a {@link layout} template.
 * @param {string} html - Trusted HTML string to pass through as-is.
 * @returns {RawHTML}
 * @example
 * layout`<p>${raw("<b>trusted</b>")}</p>`
 */
export declare const raw: (html: string) => RawHTML;
/**
 * XSS-safe tagged template literal for defining HTML layouts.
 * Dynamic values are HTML-escaped automatically. Wrap with {@link raw} to opt out.
 * @param {TemplateStringsArray} strings
 * @param {...*} values
 * @returns {string}
 * @example
 * const html = layout`<p>${userInput}</p>`;           // escaped
 * const html = layout`<p>${raw("<b>bold</b>")}</p>`;  // raw HTML
 */
export declare function layout(strings: TemplateStringsArray, ...values: any[]): string;
/**
 * DOM accessor returned by {@link View.get}.
 * Wraps a single child element for reading and writing.
 */
declare class Element {
    #private;
    id: string;
    inert: boolean;
    element: globalThis.Element;
    /**
     * @param {HTMLElement[]} roots - The view's root elements, searched in order.
     * @param {string} id - The id to look up; the first root that has it wins.
     */
    constructor(roots: HTMLElement[], id: string);
    /**
     * Wraps an element that was already found (used by `View.find(id)`).
     * @param {HTMLElement} element
     * @param {string} id
     * @returns {Element}
     */
    static from(element: HTMLElement, id: string): Element;
    /**
     * Sets the `innerHTML` of the element. The value is not escaped: pass values
     * from users or the network through the `layout` tag.
     * @param {string} html - Plain text or HTML string.
     * @returns {Element} This wrapper, for chaining.
     * @example
     * this.get("title").set(layout`${quote.number}`);
     */
    set(html: string): Element;
    /**
     * Sets an attribute, or removes it when `value` is `null` or `undefined`.
     * An empty string sets a boolean attribute (`disabled`, `hidden`, `required`).
     * @param {string} name - Attribute name, e.g. "href".
     * @param {string|number|boolean|null} [value] - Attribute value.
     * @returns {Element} This wrapper, for chaining.
     * @example
     * this.get("quote_id").set(layout`${q.number}`).attr("href", `#quote?id=${q.id}`);
     * this.get("save").attr("disabled", "");    // set
     * this.get("save").attr("disabled", null);  // remove
     */
    attr(name: string, value?: string | number | boolean | null): Element;
    /**
     * Returns the current `innerHTML` of the element.
     * @returns {string}
     */
    value(): string;
}
/**
 * Base class for every screen, component, and sub-component in a JOPS app.
 *
 * Lifecycle order (called by the framework):
 * 1. {@link View#loadLayout} — load or assign `this.layout`
 * 2. {@link View#inflate}    — parse `this.layout` into `this.domNode`
 * 3. {@link View#onLayout}   — DOM is live; add subviews, read initial data
 * 4. {@link View#onResume}   — view becomes visible; called again on every return navigation,
 *    and when the same route is shown again with new parameters
 * 5. {@link View#bindEvents} — wire `on*` attributes to class methods
 *
 * Optional hooks, also called by the framework:
 * - `onPause()`       — a different view comes to the front and this one stays alive
 *   (hidden route, or covered by a stacked view). Not called when the view is destroyed
 *   (Back from a stacked view, a stack closed by a flat link, unmount()).
 * - `onBackPressed()` — Back navigation from this view (called before onPause() for routes).
 *
 * @example
 * import { View, layout } from "jops-core";
 *
 * export default class MyView extends View {
 *   constructor() {
 *     super();
 *     this.layout = layout`<div><h1 id="title"></h1></div>`;
 *     this.inflate();
 *   }
 *   onLayout() { this.get("title").set("Hello!"); }
 * }
 */
export declare class View {
    #private;
    _generation: number;
    subViews: any[];
    layout: any;
    style: string;
    domNodes: any[];
    domNode: any;
    _destroyed: boolean;
    _borrowedDomNode: boolean;
    /**
     * @param {string} [layout] - Optional layout path or inline HTML string.
     * @param {Record<string, string>} [props] - Input properties. A view declared
     *   in a layout (`<Card jops src="…" title="Hi">`) gets them from the tag's
     *   attributes automatically; a view created in code may pass them here.
     */
    constructor(layout?: string, props?: Record<string, string>);
    /**
     * The view's input properties (read-only): the attributes of its declared
     * jops tag (except `jops`, `type="jops"`, `src`, `layout`, `path`,
     * `jops-event-bind`), names in camelCase, values as strings; or the props
     * passed to the constructor. `{}` when there are none.
     * @returns {Readonly<Record<string, string>>}
     */
    get props(): Readonly<Record<string, string>>;
    /**
     * Override to load a layout file or set `this.layout` inline.
     * Called automatically by the framework before `inflate()`.
     * Loads once per view: overlapping calls (with or without a path) wait for
     * the load in progress, and once a layout is set later calls return at once.
     * A failed load leaves the view unloaded, so it can be retried.
     * @param {string} [layout] - Path to a `.js` layout module, a `.html` file, or an inline HTML string.
     *   `.js` — dynamically imported as an ES module; must export a `layout\`...\`` string as default.
     *   `.html` — fetched and cached for the page lifetime; plain HTML fragment, no import/export needed.
     *   Any other value — treated as an inline HTML string assigned directly to `this.layout`.
     * @returns {Promise<void>}
     */
    loadLayout(layout?: string): Promise<void>;
    /**
     * Injects a `.css` file link or an inline `<style>` tag into `<head>`, deduped.
     * No effect in hosted mode (e.g. Next.js through `<JopsApp>`): the host owns the CSS.
     * @param {string} style - Path to a `.css` file, or a raw CSS string.
     */
    setStyle(style: string): void;
    /**
     * Returns an {@link Element} wrapper for the descendant with the given `id`.
     * @param {string} id - The DOM `id` of the target child element.
     * @returns {Element}
     * @example
     * this.get("username").set("Alice");
     */
    get(id: string): Element;
    /**
     * The view's root elements: every top-level element of its layout (a layout
     * may have more than one), or the borrowed container of a root view.
     * @returns {HTMLElement[]}
     * @protected
     */
    protected _roots(): HTMLElement[];
    /**
     * Hides or shows every root element (used by the Router).
     * @param {boolean} hidden
     * @protected
     */
    protected _setHidden(hidden: boolean): void;
    /**
     * Wires `on*` HTML attributes on `[jops-event-bind]` elements to
     * same-named methods on this view instance.
     * Called automatically after `onResume()`. Override to add custom wiring.
     */
    bindEvents(): void;
    /**
     * Parses `this.layout` into a DOM node and assigns it to `this.domNode`.
     * Idempotent — safe to call multiple times.
     */
    inflate(): void;
    /**
     * Appends `view` into the child element with `id="parentNode"` and runs its
     * full lifecycle (`onLayout` → `onResume` → `bindEvents`).
     * A removed (destroyed) view is final: create a new instance to show it again.
     * @param {string} parentNode - The `id` of the container element inside `this.domNode`.
     * @param {View} view - The subview to mount.
     * @returns {Promise<void>}
     */
    addSubView(parentNode: string, view: View): Promise<void>;
    /**
     * Sets `this.domNode` to `display: none`.
     */
    hide(): void;
    /**
     * Removes the inline `display` override, restoring `this.domNode` visibility.
     */
    show(): void;
    /**
     * Every element with the given id across all root elements of the layout
     * (and the DOM of its sub-views), in page order.
     * @overload
     * @param {string} id - Element id.
     * @returns {Element[]}
     * @example
     * this.find("quote_id").forEach((el) => el.attr("tabindex", 0));
     */
    /**
     * Depth-first search across the full subview subtree.
     * @overload
     * @param {(view: View) => boolean} condition - Predicate to match against each view.
     * @returns {View[]} Flat array of all matching views.
     * @example
     * const forms = root.find(v => v instanceof FormView);
     */
    /**
     * @param {string | ((view: View) => boolean)} arg
     * @returns {Element[] | View[]}
     */
    find(id: string): Element[];
    /**
     * Every element with the given id across all root elements of the layout
     * (and the DOM of its sub-views), in page order.
     * @overload
     * @param {string} id - Element id.
     * @returns {Element[]}
     * @example
     * this.find("quote_id").forEach((el) => el.attr("tabindex", 0));
     */
    /**
     * Depth-first search across the full subview subtree.
     * @overload
     * @param {(view: View) => boolean} condition - Predicate to match against each view.
     * @returns {View[]} Flat array of all matching views.
     * @example
     * const forms = root.find(v => v instanceof FormView);
     */
    /**
     * @param {string | ((view: View) => boolean)} arg
     * @returns {Element[] | View[]}
     */
    find(condition: (view: View) => boolean): View[];
    /**
     * Recursively destroys the subview subtree: calls `destroy()` on all
     * subviews, removes `this.domNode` from the DOM, and nulls references.
     */
    destroy(): void;
    /**
     * Removes `view` from `this.subViews` and calls `view.destroy()`.
     * @param {View} view - The subview to remove.
     */
    removeSubView(view: View): void;
    /**
     * Inserts `view` at `index` within `this.domNode` and runs its full lifecycle.
     * A removed (destroyed) view is final: create a new instance to show it again.
     * @param {View} view - The subview to insert.
     * @param {number} index - Zero-based insertion position.
     * @returns {Promise<void>}
     */
    insertSubView(view: View, index: number): Promise<void>;
    /**
     * Final lifecycle steps for a sub-view declared in this view's layout,
     * called by `render()` after its `onLayout()`. Router overrides it so a
     * route is resumed only when it is shown.
     * @param {View} subView
     * @returns {Promise<void>}
     * @protected
     */
    protected _startSubView(subView: View): Promise<void>;
    /**
     * Mounts the view to the DOM, resolves all nested `[jops]` view
     * elements and `<Router>` declarations, and runs each one's full lifecycle.
     * Call once on the root view; nested views are handled automatically.
     * Idempotent — safe to call multiple times.
     * @returns {Promise<void>}
     */
    render(): Promise<void>;
}
/**
 * Static pub/sub event bus for cross-view communication.
 * All methods are static — no instance needed.
 *
 * A subscription with an owner (a view) is removed automatically when the
 * owner is destroyed; a global subscription (no owner) stays until it is
 * unsubscribed (the developer's responsibility).
 *
 * @example
 * EventBus.subscribe(this, "quotes:changed", (q) => this.refresh(q)); // owned
 * EventBus.subscribe("user:login", onLogin);                          // global
 * EventBus.send("user:login", { name: "Alice" });
 */
export declare class EventBus {
    #private;
    /**
     * Registers a global listener; unsubscribe it with `unsubscribe()`.
     * @overload
     * @param {string} event - Event name.
     * @param {(data: any) => void} callback - Handler called with the event payload.
     * @returns {void}
     */
    /**
     * Registers a listener owned by `owner` (usually a view): it is removed
     * automatically when the owner is destroyed.
     * @overload
     * @param {object} owner - The object owning the subscription, e.g. `this`.
     * @param {string} event - Event name.
     * @param {(data: any) => void} callback - Handler called with the event payload.
     * @returns {void}
     */
    /**
     * @param {...*} args - `(event, callback)` or `(owner, event, callback)`.
     * @returns {void}
     */
    static subscribe(event: string, callback: (data: any) => void): void;
    /**
     * Registers a global listener; unsubscribe it with `unsubscribe()`.
     * @overload
     * @param {string} event - Event name.
     * @param {(data: any) => void} callback - Handler called with the event payload.
     * @returns {void}
     */
    /**
     * Registers a listener owned by `owner` (usually a view): it is removed
     * automatically when the owner is destroyed.
     * @overload
     * @param {object} owner - The object owning the subscription, e.g. `this`.
     * @param {string} event - Event name.
     * @param {(data: any) => void} callback - Handler called with the event payload.
     * @returns {void}
     */
    /**
     * @param {...*} args - `(event, callback)` or `(owner, event, callback)`.
     * @returns {void}
     */
    static subscribe(owner: object, event: string, callback: (data: any) => void): void;
    /**
     * Fires the named event to all subscribers. Subscriptions of destroyed
     * owners are skipped and removed (a safety net: `destroy()` normally
     * removes them first).
     * @param {string} event - Event name.
     * @param {*} [data] - Optional payload passed to every subscriber.
     */
    static send(event: string, data?: any): void;
    /**
     * Removes a specific listener by reference (global or owned).
     * @param {string} event - Event name.
     * @param {function(*): void} callback - The exact function reference passed to `subscribe`.
     */
    static unsubscribe(event: string, callback: Function): void;
    /**
     * Removes every subscription owned by `owner`, across all events (called by
     * `View.destroy()`). Global subscriptions are not touched.
     * @param {object} owner - The owner passed to `subscribe(owner, event, callback)`.
     */
    static unsubscribeAll(owner: object): void;
    /**
     * Removes every listener of every event (called by `unmount()`).
     */
    static clear(): void;
}
/**
 * App-wide runtime state container. Singleton. No reactivity.
 * Views read in `onResume()` and write in event handlers.
 *
 * @example
 * const store = Store.singleton();
 * store.set("user.name", "Alice");
 * store.get("user.name"); // "Alice"
 */
export declare class Store {
    #private;
    _state: {};
    /**
     * Returns the single Store instance, creating it on first call.
     * @returns {Store}
     */
    static singleton(): Store;
    constructor();
    /**
     * Reads a value by dot-notation path.
     * @param {string} path - e.g. `"user.name"`
     * @returns {*}
     */
    get(path: string): any;
    /**
     * Writes a value by dot-notation path. Auto-creates intermediate objects.
     * @param {string} path - e.g. `"user.name"`
     * @param {*} value
     */
    set(path: string, value: any): void;
    /**
     * Resets the entire state to `{}`.
     */
    clear(): void;
}
/**
 * Hash-based SPA router. Singleton. Extends {@link View}.
 * Declared in a layout string as `<Router jops animation="slide">`.
 *
 * Supports two navigation paradigms:
 * - **Flat** (`href="#path"`) — reuses pre-existing view instances (tab navigation).
 * - **Stack** (`navigate()`) — creates a new instance and pushes onto a nav stack (Android `startActivity`).
 *
 * @example
 * // In a layout file:
 * layout`
 *   <Router jops animation="slide">
 *     <Home   path="/home"  jops src="/src/Home.js"></Home>
 *     <Detail path="/detail" jops src="/src/Detail.js"></Detail>
 *   </Router>
 * `
 */
export declare class Router extends View {
    #private;
    rootNode: any;
    routerDomNode: any;
    animation: any;
    routes: {};
    _navStack: any[];
    _baseView: any;
    _defaultPath: string;
    _pathname: string;
    _idx: any;
    _historyListener: () => void;
    _currentView: any;
    /**
     * Returns the single Router instance after it has been rendered.
     * @returns {Router}
     */
    static singleton(): Router;
    constructor(routerDomNode: any);
    onLayout(): Promise<void>;
    /**
     * Routes only get their events bound while the Router renders; `onResume()`
     * runs when a route is shown (`_switchTo()` and the transitions), so hidden
     * routes are not resumed at startup.
     * @param {View} subView
     * @returns {Promise<void>}
     * @protected
     */
    protected _startSubView(subView: View): Promise<void>;
    initRouter(): void;
    /**
     * Single entry point for popstate and hashchange. Decides the direction
     * from the history entry's position and dispatches to _onBack/_onForward.
     */
    _onHistoryChange(): void;
    _onBack(): void;
    _onForward(): void;
    /** Destroys every stacked navigate() view (switching to a flat route). */
    _closeStack(): void;
    /**
     * onPause() on the view leaving the front: a different view is coming to
     * the front and the current one stays alive (hidden or covered). Not used
     * when a view is destroyed (stack pop on Back, _closeStack(), unmount()).
     * @param {View} incoming
     */
    _pauseCurrent(incoming: View): void;
    _switchToHash(): void;
    /**
     * Replaces the current entry's empty hash with the default (first) route,
     * keeping the existing history state, and shows that route.
     */
    _switchToDefault(): void;
    /**
     * Removes the history listeners, destroys the routes and stacked views and
     * clears the singleton. Called by `unmount()`; safe to call more than once.
     */
    destroy(): void;
    /** pushState/replaceState marked as JOPS's own (see installHostHistoryHook). */
    _history(method: any, state: any, url: any): void;
    /**
     * Hosted mode: called after the host changed the URL with pushState or
     * replaceState (no browser event fires for those).
     */
    _onHostNavigation(): void;
    _animateTransition(outgoing: any, incoming: any, direction: any): Promise<void>;
    _slideTransition(outgoing: any, incoming: any, direction: any): Promise<void>;
    _fadeTransition(outgoing: any, incoming: any): Promise<void>;
    _switchTo(path: any): void;
    /**
     * Navigates back — pops the nav stack with animation if non-empty,
     * otherwise calls `history.back()`.
     */
    back(): void;
    /**
     * Returns true if there is an earlier JOPS history entry to go back to.
     * Equivalent to checking the back stack before calling `onBackPressed()` in Android.
     * @returns {boolean}
     */
    canGoBack(): boolean;
    /**
     * Returns the current URL query params as a plain object.
     * Works for both flat (`href="#path?k=v"`) and stack (`navigate("/path?k=v")`) routes.
     * @returns {Record<string, string>}
     * @example
     * const { id, mode } = Router.singleton().getParams();
     */
    getParams(): Record<string, string>;
    /**
     * Creates a new view instance for `path`, pushes onto the nav stack,
     * animates forward, and updates the address bar.
     * @param {string} path - Route path, e.g. `"/detail?id=42"`.
     * @param {typeof View} [ClassDef] - Required for dynamic routes not in the static route map.
     * @returns {Promise<void>}
     * @example
     * Router.singleton().navigate("/detail?id=42", DetailView);
     */
    navigate(path: string, ClassDef?: typeof View): Promise<void>;
    /**
     * Clears the nav stack and navigates to `path`. Uses the existing flat route
     * instance if available, otherwise creates a new instance from `ClassDef`.
     * Equivalent to Android's `startActivity(FLAG_CLEAR_TOP)`.
     * @param {string} path - Route path.
     * @param {typeof View} [ClassDef] - Required when the path is not in the static route map.
     * @returns {Promise<void>}
     */
    replace(path: string, ClassDef?: typeof View): Promise<void>;
}
/**
 * Base class for running work on a Web Worker (background thread).
 * Extend and override {@link Thread#run} and {@link Thread#onMessage}.
 *
 * @example
 * class MyThread extends Thread {
 *   run(params) {
 *     const result = params.a + params.b;
 *     self.postMessage(result);
 *   }
 *   onMessage(event) {
 *     console.log("result:", event.data);
 *   }
 * }
 * const t = new MyThread();
 * t.start({ a: 1, b: 2 });
 * // later:
 * t.terminate();
 */
export declare class Thread {
    #private;
    /**
     * Override to define the work the thread performs.
     * Runs inside a Web Worker — must be self-contained (no access to outer scope or class instance).
     * Call `self.postMessage(result)` to send a result back to the main thread.
     * @param {*} params - The value passed to {@link Thread#start}.
     */
    run(params: any): void;
    /**
     * Override to handle messages posted back from the worker via `self.postMessage()`.
     * @param {MessageEvent} event
     */
    onMessage(event: MessageEvent): void;
    /**
     * Spawns the Web Worker, serializes {@link Thread#run}, and passes `params` as the initial input.
     * @param {*} [params] - Optional data forwarded to `run(params)` inside the worker.
     */
    start(params?: any): void;
    /**
     * Terminates the Web Worker immediately and clears the internal reference.
     * Safe to call even if the worker has already finished.
     * After terminating, `start()` can be called again to spawn a new worker.
     */
    terminate(): void;
}
export {};
