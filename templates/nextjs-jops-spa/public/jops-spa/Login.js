import { View, Router, Store } from "jops-core";

// #login: a mock login. The user is kept in the JOPS Store only (no request);
// the Store is cleared when the app ends, so leaving the page logs out.
export default class Login extends View {
  constructor() {
    super();
  }

  onResume() {
    // Already signed in: go straight to the quotes. Deferred, so it does not
    // run inside the Router's own route switch.
    if (Store.singleton().get("user")) {
      queueMicrotask(() => Router.singleton().replace("/quotes"));
    }
  }

  // The browser has checked the required fields before the submit event.
  login(event) {
    event.preventDefault();
    const name = new FormData(event.target).get("username");
    Store.singleton().set("user", { name });
    event.target.reset();
    location.hash = "#quotes";
  }
}
