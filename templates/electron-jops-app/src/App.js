import { View } from "jops-core";

// The root view renders layout/main.html into <body>.
// Paths are page-relative (no leading ./ or /): the page is loaded from file://.
export default class App {
  constructor() {
    const main = new View();
    main
      .loadLayout("layout/main.html")
      .then(() => main.render())
      .then(() => {
        markCurrentLink();
        window.addEventListener("hashchange", markCurrentLink);
      });
  }
}

// Highlights the sidebar link of the current route (#home, #files?…).
function markCurrentLink() {
  const route = location.hash.split("?")[0];
  for (const link of document.querySelectorAll(".nav-link")) {
    link.classList.toggle("active", link.getAttribute("href") === route);
  }
}
