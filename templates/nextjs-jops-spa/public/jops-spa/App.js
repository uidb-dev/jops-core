import { View } from "jops-core";

// Entry module launched by <JopsApp app="/jops-spa/App.js"> on the /jops-spa
// page. The root view renders layout/main.html into JopsApp's <div>.
export default class App {
  constructor() {
    const root = new View();
    root.loadLayout("/jops-spa/layout/main.html").then(() => root.render());
  }
}
