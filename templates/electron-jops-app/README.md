# Electron JOPS Desktop App

An [Electron](https://www.electronjs.org/) desktop app whose UI is a [JOPS](https://github.com/uidb-dev/jops-core) SPA. Created with `npx jops-core init` (choice 4).

```bash
npm start          # run the app
npm run make       # package it (out/make/)
npm run jops:update  # after upgrading jops-core: copy the new library to src/lib/
```

## Structure

| Path | Process | Role |
|---|---|---|
| `src/main.js` | main | creates the window, answers IPC calls (`app:info`, `files:list`) |
| `src/preload.js` | preload | exposes only named functions to the page as `window.api.*` (`contextBridge`) |
| `src/index.html` | renderer | CSP, import map, the jops-core script (`data-app="App.js"`) |
| `src/App.js`, `src/layout/main.html` | renderer | root view: sidebar and `<Router jops screens>` |
| `src/HomeView.js`, `src/FilesView.js` | renderer | the two screens; both call `window.api` |
| `src/lib/jops-core.min.js` | renderer | the vendored library (jops-core itself is a devDependency) |

## Rules

- **Paths:** the page is loaded from `file://`, so every path JOPS resolves (`data-app`, `src=`, `layout=`, `loadLayout()`, `setStyle()`) is page-relative, with no leading `./` or `/`: `layout/main.html`, not `/layout/main.html` (that would be the disk root). The import map value is a URL and keeps its `./`.
- **Calling the main process:** add an `ipcMain.handle("name", …)` in `main.js`, expose it in `preload.js`, call `await window.api.name()` from a view. Validate arguments in the main process.
- **Events from the main process:** expose `onX(callback)` in the preload (`ipcRenderer.on`) returning an unsubscribe function, subscribe in `onResume()` and unsubscribe in `onPause()` or `destroy()`, or forward the data into an owned `EventBus` subscription (`EventBus.subscribe(this, …)`).
- **CSP** (`src/index.html`): only the app's own files load; inline scripts are allowed for the import map and the `on*` attributes JOPS binds, `blob:` for `Thread` workers. Add a host to `connect-src` (e.g. `connect-src 'self' https://api.example.com`) before calling a remote API.
