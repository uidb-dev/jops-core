import { View, layout } from "jops-core";

export default class DataSection extends View {
  constructor() {
    super();
  }

  async loadLayout() {
    await super.loadLayout("/src/layout/layout_data.js");
  }

  async onLayout() {
    for (const row of rowsData) {
      const { col1, col2, col3, col4 } = row;
      await this.addSubView(
        "tableBody",
        new DataTableItem(col1, col2, col3, col4),
      );
    }

    for (const item of listData) {
      await this.addSubView("list", new ListItem(item));
    }
  }
}

class DataTableItem extends View {
  constructor(col1, col2, col3, col4) {
    super();
    this.col1 = col1;
    this.col2 = col2;
    this.col3 = col3;
    this.col4 = col4;
    this.layout = layout`
       <tr>
        <td id="col1"></td>
        <td id="col2"></td>
        <td id="col3"></td>
        <td id="col4"></td>
      </tr>
    `;
    this.inflate();
  }

  onLayout() {
    this.get("col1").set(this.col1);
    this.get("col2").set(this.col2);
    this.get("col3").set(this.col3);
    this.get("col4").set(this.col4);
  }
}

class ListItem extends View {
  constructor(text) {
    super();
    this.layout = layout`<li id="text" class="list__item"></li>`;
    this.text = text;
    this.inflate();
  }

  async onLayout() {
    this.get("text").set(this.text);
  }
}

const listData = [
  "Native ES6 module system",
  "Android-style view lifecycle",
  "Proxy-based reactive store",
  "Two-way data binding",
  "Hash-based SPA routing",
];

const rowsData = [
  {
    col1: "001",
    col2: "Alice Johnson",
    col3: "Frontend Developer",
    col4: `<span class="badge badge--active">Active</span>`,
  },
  {
    col1: "002",
    col2: "Bob Smith",
    col3: "Backend Developer",
    col4: `<span class="badge badge--active">Active</span>`,
  },
  {
    col1: "003",
    col2: "Carol White",
    col3: "Mobile Developer",
    col4: `<span class="badge badge--inactive">Inactive</span>`,
  },
  {
    col1: "004",
    col2: "David Lee",
    col3: "Full Stack Developer",
    col4: `<span class="badge badge--active">Active</span>`,
  },
];
