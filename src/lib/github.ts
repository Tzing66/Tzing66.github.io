export type RepoStats = {
  description: string | null;
  stars: number;
  language: string | null;
  pushedAt: string;
  topics: string[];
  url: string;
};

// Glob instead of a direct import so a missing/never-fetched file yields {} rather than a build error.
const files = import.meta.glob<{ repos?: Record<string, RepoStats> }>("../data/github.json", { eager: true, import: "default" });
const repos = Object.values(files)[0]?.repos ?? {};

/** Cached GitHub stats for an allowlisted repo, or undefined if never fetched. */
export const repoStats = (repo: string): RepoStats | undefined => repos[repo.toLowerCase()];

const units: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
];
const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/** "3 days ago", relative to build time (the site rebuilds every 6h). */
export function timeAgo(iso: string, now = Date.now()): string {
  const secs = (new Date(iso).getTime() - now) / 1000;
  for (const [unit, size] of units) {
    if (Math.abs(secs) >= size) return rtf.format(Math.round(secs / size), unit);
  }
  return "just now";
}
