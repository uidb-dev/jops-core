import { View, layout } from "jops-core";

// Files screen: lists the folder the app was started from (window.api.listFiles()),
// one FileRow sub-view per entry.
export default class FilesView extends View {
  onResume() {
    this.showFiles(); // refreshed every time the screen comes to the front
  }

  async showFiles() {
    if (!window.api) return this.showMessage("Desktop app only: run it with npm start.");
    try {
      const { dir, entries } = await window.api.listFiles();
      this.get("files_dir").set(layout`${dir}`);
      this.removeSubViews();
      this.get("files_list").set("");
      if (entries.length === 0) return this.showMessage("This folder is empty.");
      for (const entry of entries) this.addSubView("files_list", new FileRow(entry));
    } catch (error) {
      this.showMessage(`Could not list the folder: ${error.message}`);
    }
  }

  // One row across the table (empty folder, error).
  showMessage(text) {
    this.removeSubViews();
    this.get("files_list").set(layout`<tr><td colspan="3" class="muted">${text}</td></tr>`);
  }
}

class FileRow extends View {
  constructor(entry) {
    super();
    this.layout = layout`
      <tr>
        <td>${entry.name}</td>
        <td class="muted">${entry.folder ? "Folder" : "File"}</td>
        <td class="num muted">${entry.folder ? "" : formatSize(entry.size)}</td>
      </tr>`;
    this.inflate();
  }
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
