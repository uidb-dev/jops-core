// The bridge between the page and the main process. Only these named
// functions are exposed to the page, as window.api.*.
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  // { name, version, electron, chrome, node, platform }
  appInfo: () => ipcRenderer.invoke("app:info"),
  // { dir, entries: [{ name, folder, size }] }
  listFiles: () => ipcRenderer.invoke("files:list"),
});
