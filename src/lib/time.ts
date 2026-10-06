const units: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
];
const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/** "3 days ago". Rendered at build time, then refreshed in the browser by updateTimes(). */
export function timeAgo(iso: string, now = Date.now()): string {
  const secs = (new Date(iso).getTime() - now) / 1000;
  for (const [unit, size] of units) {
    if (Math.abs(secs) >= size) return rtf.format(Math.round(secs / size), unit);
  }
  return "just now";
}

/** Re-render every <time data-ago datetime="…"> relative to the viewer's clock. */
export function updateTimes(root: ParentNode = document) {
  root.querySelectorAll<HTMLTimeElement>("time[data-ago]").forEach((t) => {
    t.textContent = `${t.dataset.ago ?? ""}${timeAgo(t.dateTime)}`;
  });
}
