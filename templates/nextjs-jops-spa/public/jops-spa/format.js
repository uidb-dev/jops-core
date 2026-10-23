const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
export const formatMoney = (value) => money.format(value);

const date = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" });
export const formatDate = (iso) => date.format(new Date(iso));
