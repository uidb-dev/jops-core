import { View } from "jops-core";

export default class App {
  constructor() {
    const root = new View();
    (async () => {
      await root.loadLayout("/src/layout/mainlayout.js");
      root.render();
    })();
  }
}
