import { loadData } from "./data";

export type RepoStats = {
  description: string | null;
  stars: number;
  language: string | null;
  pushedAt: string;
  topics: string[];
  url: string;
};

export type Activity = {
  total: number; // contributions in the last year
  days: { date: string; count: number }[]; // most recent ~26 weeks, oldest first
  lastPush: { repo: string; at: string } | null;
};

type GithubData = { fetchedAt: string | null; repos?: Record<string, RepoStats>; activity?: Activity };

export const github = loadData<GithubData>("github");
const repos = github?.repos ?? {};
export const activity = github?.activity;

/** Cached GitHub stats for an allowlisted repo, or undefined if never fetched. */
export const repoStats = (repo: string): RepoStats | undefined => repos[repo.toLowerCase()];
