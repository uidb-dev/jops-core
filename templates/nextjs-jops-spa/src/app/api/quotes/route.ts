import type { NextRequest } from "next/server";
import quotes from "../../../../data/quotes.json";

// GET /api/quotes[?status=draft|sent|accepted|rejected]
// The JOPS SPA's only backend call (getQuotes() in public/jops-spa/api.js).
// Static demo data from data/quotes.json; replace with your own data source.
export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get("status");
  const data = status ? quotes.filter((q) => q.status === status) : quotes;
  return Response.json({ data, total: data.length });
}
