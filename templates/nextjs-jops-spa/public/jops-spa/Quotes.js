import { View, Router, Store, layout } from "jops-core";
import { getQuotes } from "./api.js";
import { formatDate, formatMoney } from "./format.js";
import { BADGE } from "./badge.js";
import { tableSkeleton } from "./skeleton.js";

// Full class names, so Tailwind finds them in this file.
const TAB = {
  active: "rounded-md px-3 py-1.5 text-sm capitalize bg-indigo-600 text-white",
  inactive:
    "rounded-md px-3 py-1.5 text-sm capitalize bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50",
};

// #quotes: the quotes list with status filter tabs. Only for a signed-in user.
export default class Quotes extends View {
  constructor() {
    super();
    this.status = "";
  }

  onResume() {
    const user = Store.singleton().get("user");
    if (!user) {
      // Not signed in: back to the login. Deferred, so it does not run inside
      // the Router's own route switch.
      queueMicrotask(() => Router.singleton().replace("/login"));
      return;
    }
    this.get("user_name").set(layout`${user.name}`);
    this.loadQuotes();
  }

  // Filter tab click: highlight the tab, then load that status.
  filterQuotes(event) {
    this.status = event.target.dataset.status;
    for (const tab of this.get("tabs").element.children) {
      tab.className = tab === event.target ? TAB.active : TAB.inactive;
    }
    this.loadQuotes();
  }

  async loadQuotes() {
    const rows = this.get("quote-rows");
    const table = this.get("quotes-table");
    const empty = this.get("quotes-empty");
    const loading = this.get("quotes-loading");
    const request = (this.request = {}); // a later click wins

    loading.set(tableSkeleton());
    table.attr("hidden", "");
    empty.attr("hidden", "");
    try {
      const quotes = await getQuotes(this.status);
      if (this.request !== request) return;
      this.subViews
        .filter((v) => v instanceof QuoteRow)
        .forEach((v) => this.removeSubView(v));
      // Awaited one by one, so the rows are added in the API's order.
      for (const quote of quotes) await this.addSubView("quote-rows", new QuoteRow(quote));
      empty.attr("hidden", quotes.length ? "" : null);
    } catch (err) {
      if (this.request !== request) return;
      rows.set(
        layout`<tr><td colspan="6" class="px-4 py-6 text-center text-red-600">Could not load quotes: ${err.message}</td></tr>`,
      );
    } finally {
      if (this.request === request) {
        loading.set("");
        table.attr("hidden", null);
      }
    }
  }

  logout() {
    Store.singleton().set("user", null);
    Router.singleton().replace("/login");
  }
}

// One table row, created in code and added with addSubView().
class QuoteRow extends View {
  constructor(quote) {
    super();
    this.quote = quote;
  }

  loadLayout() {
    return super.loadLayout("/jops-spa/layout/quotes_row.html");
  }

  onLayout() {
    const q = this.quote;
    this.get("quote_number").set(layout`${q.number}`);
    this.get("company_name").set(layout`${q.companyName ?? "—"}`);
    this.get("deal_title").set(layout`${q.dealTitle ?? "—"}`);
    this.get("quote_status").set(
      layout`<span class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${BADGE[q.status] ?? BADGE.draft}">${q.status}</span>`,
    );
    this.get("created_at").set(layout`${formatDate(q.createdAt)}`);
    this.get("total").set(layout`${formatMoney(q.totals.total)}`);
  }
}
