import { View, Store } from "jops-core";

export default class Form extends View {
  constructor() {
    super();
  }

  async loadLayout() {
    await super.loadLayout("/src/layout/layout_form.js");
  }

  onSubmit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    Store.singleton().set("form.submission", data);
    const message = Object.entries(data)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    alert(`Form Submitted:\n\n${message}`);
  }
}
