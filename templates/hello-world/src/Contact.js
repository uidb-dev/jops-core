import { View } from "jops-core";

export default class Contact extends View {
  constructor() {
    super();
  }

  async loadLayout() {
    await super.loadLayout("/src/layout/layout_contact.js");
  }

  onSubmit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    const message = Object.entries(data)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    alert(`Message Sent:\n\n${message}`);
  }
}
