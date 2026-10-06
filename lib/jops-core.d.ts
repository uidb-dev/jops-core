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
    element: any;
    constructor(domNode: any, id: any);
    /**
     * Sets the `innerHTML` of the element.
     * @param {string} value - Plain text or HTML string.
     */
    set(value: string): void;
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
 * 4. {@link View#onResume}   — view becomes visible; called again on every return navigation
 * 5. {@link View#bindEvents} — wire `on*` attributes to class methods
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
    subViews: any[];
    layout: any;
    style: string;
    domNode: any;
    /**
     * @param {string} [layout] - Optional layout path or inline HTML string.
     */
    constructor(layout?: string);
    /**
     * Override to load a layout `.js` module or set `this.layout` inline.
     * Called automatically by the framework before `inflate()`.
     * @param {string} [layout] - Path to a `.js` layout module or an inline HTML string.
     * @returns {Promise<void>}
     */
    loadLayout(layout?: string): Promise<void>;
    /**
     * Injects a `.css` file link or an inline `<style>` tag into `<head>`, deduped.
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
     * Depth-first search across the full subview subtree.
     * @param {function(View): boolean} condition - Predicate to match against each view.
     * @returns {View[]} Flat array of all matching views.
     * @example
     * const forms = root.find(v => v instanceof FormView);
     */
    find(condition: Function): View[];
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
     * @param {View} view - The subview to insert.
     * @param {number} index - Zero-based insertion position.
     * @returns {Promise<void>}
     */
    insertSubView(view: View, index: number): Promise<void>;
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
 * @example
 * EventBus.subscribe("user:login", data => console.log(data.name));
 * EventBus.send("user:login", { name: "Alice" });
 */
export declare class EventBus {
    #private;
    /**
     * Registers a listener for the named event.
     * @param {string} event - Event name.
     * @param {function(*): void} callback - Handler called with the event payload.
     */
    static subscribe(event: string, callback: Function): void;
    /**
     * Fires the named event to all subscribers.
     * @param {string} event - Event name.
     * @param {*} [data] - Optional payload passed to every subscriber.
     */
    static send(event: string, data?: any): void;
    /**
     * Removes a specific listener by reference.
     * @param {string} event - Event name.
     * @param {function(*): void} callback - The exact function reference passed to `subscribe`.
     */
    static unsubscribe(event: string, callback: Function): void;
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
    _pendingBack: boolean;
    _currentView: any;
    /**
     * Returns the single Router instance after it has been rendered.
     * @returns {Router}
     */
    static singleton(): Router;
    constructor(routerDomNode: any);
    onLayout(): Promise<void>;
    initRouter(): void;
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
