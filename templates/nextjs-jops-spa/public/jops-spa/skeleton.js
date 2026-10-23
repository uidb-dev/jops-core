// Loading placeholder for a table. Full class names, so Tailwind finds them.
const BAR = "animate-pulse rounded bg-slate-200 h-4 flex-1";

export function tableSkeleton(rows = 4, cols = 6) {
  const row = `<div class="flex gap-4">${`<div class="${BAR}"></div>`.repeat(cols)}</div>`;
  return `<div class="rounded-lg border border-slate-200 bg-white shadow-sm p-4"><div class="space-y-3">${row.repeat(rows)}</div></div>`;
}
