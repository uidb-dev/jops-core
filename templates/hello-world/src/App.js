import { View } from "jops-core";
import mainLayout from "./layout/mainlayout.js";

export default class App {
  constructor() {
    console.log("JOPS App mounted");

    const mainContainer = new View();
    mainContainer.setStyle("./src/css/styles.css");

    /*(async () => {
      await mainContainer.loadLayout("/src/layout/mainlayout.js");
      mainContainer.render();
    })();*/

    // "/src/layout/mainlayout.js"
    mainContainer.loadLayout(mainLayout).then(() => {
      mainContainer.render();
    });
  }
}
