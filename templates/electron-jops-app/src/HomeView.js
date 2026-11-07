import { View, layout } from "jops-core";

// Home screen: shows what the main process reports through window.api.appInfo().
export default class HomeView extends View {
  async onLayout() {
    if (!window.api) {
      this.get("app_info").set(layout`<dt>Desktop app only</dt><dd>Run it with npm start.</dd>`);
      return;
    }
    const info = await window.api.appInfo();
    const rows = [
      ["App", `${info.name} ${info.version}`],
      ["Electron", info.electron],
      ["Chrome", info.chrome],
      ["Node.js", info.node],
      ["Platform", info.platform],
    ];
    this.get("app_info").set(rows.map(([name, value]) => layout`<dt>${name}</dt><dd>${value}</dd>`).join(""));
  }
}
