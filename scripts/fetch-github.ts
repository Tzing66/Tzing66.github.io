// Fetches stats for ONLY the allowlisted repos in site.config.ts and writes src/data/github.json.
// Never fails the build: on any error it keeps the cached entry and logs a warning.
// Uses GITHUB_TOKEN when present (CI); otherwise the unauthenticated public API (rate limited).
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { projects } from "../src/content/site.config.ts";

const OUT = new URL("../src/data/github.json", import.meta.url);

export type RepoStats = {
  description: string | null;
  stars: number;
  language: string | null;
  pushedAt: string;
  topics: string[];
  url: string;
};

type Cache = { fetchedAt: string | null; repos: Record<string, RepoStats> };

async function readCache(): Promise<Cache> {
  try {
    return JSON.parse(await readFile(OUT, "utf8"));
  } catch {
    return { fetchedAt: null, repos: {} };
  }
}

async function fetchRepo(repo: string): Promise<RepoStats> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "tzing66-portfolio",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com/repos/${repo}`, { headers, signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const r = await res.json();
  return {
    description: r.description,
    stars: r.stargazers_count,
    language: r.language,
    pushedAt: r.pushed_at,
    topics: r.topics ?? [],
    url: r.html_url,
  };
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

// Only overwrite when something new came back, so an offline run leaves the cache untouched.
if (ok > 0) {
  await mkdir(new URL(".", OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify({ fetchedAt: new Date().toISOString(), repos }, null, 2) + "\n");
}
console.log(`[fetch-github] ${ok}/${projects.length} repos refreshed`);
