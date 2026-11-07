// Electron main process: creates the window and answers the page's IPC calls.
const { app, BrowserWindow, ipcMain, nativeTheme } = require("electron");
const path = require("node:path");
const fs = require("node:fs/promises");

// Windows installer (Squirrel): quit while it creates or removes shortcuts.
if (require("electron-squirrel-startup")) app.quit();

// ─── IPC handlers (exposed to the page by preload.js) ────────────────────────

// "app:info": versions and platform of the running app.
function appInfo() {
  return {
    name: app.getName(),
    version: app.getVersion(),
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node,
    platform: `${process.platform} ${process.arch}`,
  };
}

// "files:list": the folder the app was started from. fs.readdir works the
// same on macOS, Windows and Linux. Hidden and unreadable entries are left out.
async function listFiles() {
  const dir = process.cwd();
  const names = (await fs.readdir(dir))
    .filter((name) => !name.startsWith("."))
    .sort((a, b) => a.localeCompare(b))
    .slice(0, 500);
  const entries = [];
  for (const name of names) {
    try {
      const stats = await fs.stat(path.join(dir, name));
      entries.push({ name, folder: stats.isDirectory(), size: stats.size });
    } catch {
      // Broken symlink or no permission.
    }
  }
  return { dir, entries };
}

// ─── window ──────────────────────────────────────────────────────────────────

function createWindow() {
  const win = new BrowserWindow({
    width: 960,
    height: 640,
    // Same as --bg in index.css, so the window is never white before the first paint.
    backgroundColor: nativeTheme.shouldUseDarkColors ? "#17191e" : "#f5f6f8",
    // Electron's secure defaults stay on: contextIsolation, sandbox, no nodeIntegration.
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  // file:// page: every path JOPS resolves is page-relative (no leading ./ or /).
  win.loadFile(path.join(__dirname, "index.html"));
}

app.whenReady().then(() => {
  ipcMain.handle("app:info", appInfo);
  ipcMain.handle("files:list", listFiles);
  createWindow();
  // macOS: re-create the window when the dock icon is clicked.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
