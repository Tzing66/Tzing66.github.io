// Fetches stats for ONLY the allowlisted repos in site.config.ts, plus profile activity
// (contribution calendar + latest public push), and writes src/data/github.json.
// Never fails the build: on any error it keeps the cached value and logs a warning.
// Uses GITHUB_TOKEN when present (CI); otherwise the unauthenticated public API (rate limited,
// and no contribution calendar, which needs GraphQL + a token).
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { projects, site } from "../src/content/site.config.ts";

const OUT = new URL("../src/data/github.json", import.meta.url);
const USER = new URL(site.links.github).pathname.split("/").filter(Boolean)[0];
const HEATMAP_WEEKS = 26;

export type RepoStats = {
  description: string | null;
  stars: number;
  language: string | null;
  pushedAt: string;
  topics: string[];
  url: string;
};

type Activity = {
  total: number;
  days: { date: string; count: number }[];
  lastPush: { repo: string; at: string } | null;
};

type Cache = { fetchedAt: string | null; repos: Record<string, RepoStats>; activity?: Activity };

const headers: Record<string, string> = {
  Accept: "application/vnd.github+json",
  "User-Agent": "tzing66-portfolio",
};
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function api(path: string, init: RequestInit = {}) {
  const res = await fetch(`https://api.github.com${path}`, { ...init, headers, signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function readCache(): Promise<Cache> {
  try {
    return JSON.parse(await readFile(OUT, "utf8"));
  } catch {
    return { fetchedAt: null, repos: {} };
  }
}

async function fetchRepo(repo: string): Promise<RepoStats> {
  const r = await api(`/repos/${repo}`);
  return {
    description: r.description,
    stars: r.stargazers_count,
    language: r.language,
    pushedAt: r.pushed_at,
    topics: r.topics ?? [],
    url: r.html_url,
  };
}

async function fetchCalendar(): Promise<Pick<Activity, "total" | "days">> {
  if (!process.env.GITHUB_TOKEN) throw new Error("no GITHUB_TOKEN (calendar needs GraphQL)");
  const query = `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{
    totalContributions weeks{contributionDays{date contributionCount}}}}}}`;
  const r = await api("/graphql", { method: "POST", body: JSON.stringify({ query, variables: { login: USER } }) });
  const cal = r.data?.user?.contributionsCollection?.contributionCalendar;
  if (!cal) throw new Error(r.errors?.[0]?.message ?? "no calendar in response");
  const days = cal.weeks
    .slice(-HEATMAP_WEEKS)
    .flatMap((w: { contributionDays: { date: string; contributionCount: number }[] }) => w.contributionDays)
    .map((d: { date: string; contributionCount: number }) => ({ date: d.date, count: d.contributionCount }));
  return { total: cal.totalContributions, days };
}

async function fetchLastPush(): Promise<Activity["lastPush"]> {
  const events: { type: string; repo: { name: string }; created_at: string }[] = await api(`/users/${USER}/events/public?per_page=50`);
  const push = events.find((e) => e.type === "PushEvent");
  return push ? { repo: push.repo.name, at: push.created_at } : null;
}

const cache = await readCache();
const repos: Record<string, RepoStats> = {};
let ok = 0;

for (const { repo } of projects) {
  const key = repo.toLowerCase();
  try {
    repos[key] = await fetchRepo(repo);
    ok++;
  } catch (err) {
    console.warn(`[fetch-github] ${repo}: ${(err as Error).message}; using cached data`);
    if (cache.repos[key]) repos[key] = cache.repos[key];
  }
}

// Activity pieces fall back independently to whatever the cache had.
let activity = cache.activity;
const [cal, push] = await Promise.allSettled([fetchCalendar(), fetchLastPush()]);
if (cal.status === "fulfilled" || push.status === "fulfilled") {
  activity = {
    total: cal.status === "fulfilled" ? cal.value.total : (cache.activity?.total ?? 0),
    days: cal.status === "fulfilled" ? cal.value.days : (cache.activity?.days ?? []),
    lastPush: push.status === "fulfilled" ? push.value : (cache.activity?.lastPush ?? null),
  };
}
const activityOk = cal.status === "fulfilled" || push.status === "fulfilled";
if (cal.status === "rejected") console.warn(`[fetch-github] calendar: ${cal.reason.message}; using cached data`);
if (push.status === "rejected") console.warn(`[fetch-github] events: ${push.reason.message}; using cached data`);

// Only overwrite when something new came back, so an offline run leaves the cache untouched.
if (ok > 0 || activityOk) {
  await mkdir(new URL(".", OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify({ fetchedAt: new Date().toISOString(), repos, activity }, null, 2) + "\n");
}
console.log(`[fetch-github] ${ok}/${projects.length} repos refreshed; activity ${activityOk ? "refreshed" : "cached"}`);
