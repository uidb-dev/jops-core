import { View } from "jops-core";

export default class App {
  constructor() {
    console.log("JOPS App mounted");

    const mainContainer = new View();
    mainContainer.setStyle("/src/css/styles.css");

    mainContainer
      .loadLayout("/src/layout/mainlayout.html")
      .then(() => mainContainer.render());
  }
}
