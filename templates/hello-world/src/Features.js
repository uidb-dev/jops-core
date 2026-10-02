import { View, layout } from "jops-core";
// import Card from "./Card.js";

export default class Features extends View {
  constructor() {
    super();
    this.layout = layout`
        <section id="features" class="features">
            <h2 class="section__title">Features</h2>
            <div id="grid" class="cards">
            </div>
        </section>
    `;
    this.inflate();
  }

  //async loadLayout() {
  //  await super.loadLayout("/src/layout/layout_features.js");
  //}

  async onLayout() {
    for (const item of data) {
      await this.addSubView("grid", new Card(item.title, item.content));
    }
  }
}

class Card extends View {
  constructor(title, content) {
    super();
    this.title = title;
    this.content = content;
    this.layout = layout`
      <article class="card">
         <h3 id="title" class="card__title"></h3>
         <p  id="content" class="card__body"></p>
      </article>
    `;
    this.inflate();
  }

  // async loadLayout() {
  //  await super.loadLayout("/src/layout/card.js");
  // }

  onLayout() {
    this.get("title").set(this.title);
    this.get("content").set(this.content);
  }
}

const data = [
  {
    title: "No Bundler",
    content:
      "Native ES6 modules loaded directly in the browser. No Webpack, no Babel, no build step.",
  },
  {
    title: "OOP First",
    content:
      "Real class inheritance with extends and super(). Write JavaScript the way it was meant to be written.",
  },
  {
    title: "View Composition",
    content:
      "Android-style declarative nested view composition. Break layouts into reusable sub-modules.",
  },
];
