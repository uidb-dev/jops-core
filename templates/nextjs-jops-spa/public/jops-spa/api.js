// Calls to the Next.js backend (Route Handlers in src/app/api/). Same origin,
// so cookies would be sent automatically if you add authentication.

async function request(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);
  return data;
}

// GET /api/quotes[?status=…] → the quotes, newest number first.
export async function getQuotes(status) {
  const qs = status ? `?status=${encodeURIComponent(status)}` : "";
  return (await request(`/api/quotes${qs}`)).data;
}
