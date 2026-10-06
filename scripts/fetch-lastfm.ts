// Listening data for the "Now" section, via Last.fm (Spotify scrobbles to it).
// Why not the Spotify API directly: since 2026 a Spotify dev app needs a Premium owner, and user
// refresh tokens expire 6 months after authorization, so a static site would silently break twice
// a year. Last.fm's read endpoints need only an API key that doesn't expire.
//
// Env: LASTFM_API_KEY (GitHub Actions secret / local .env). Username lives in site.config.ts.
// Writes src/data/music.json. Never fails the build: no key or any error keeps the cached file.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { music } from "../src/content/site.config.ts";

const OUT = new URL("../src/data/music.json", import.meta.url);
const KEY = process.env.LASTFM_API_KEY;
// Last.fm's generic "no image" star; treat it as no artwork.
const PLACEHOLDER_IMG = "2a96cbd8b46e442fc41c2b86b821562f";

type LfmImage = { size: string; "#text": string };

async function call(method: string, params: Record<string, string>) {
  const qs = new URLSearchParams({ method, user: music.lastfmUser, api_key: KEY!, format: "json", ...params });
  const res = await fetch(`https://ws.audioscrobbler.com/2.0/?${qs}`, { signal: AbortSignal.timeout(10_000) });
  const body = await res.json();
  if (!res.ok || body.error) throw new Error(`${method}: ${body.message ?? `HTTP ${res.status}`}`);
  return body;
}

const art = (images: LfmImage[] = []) => {
  const url = images.find((i) => i.size === "extralarge")?.["#text"] || images.at(-1)?.["#text"] || "";
  return url && !url.includes(PLACEHOLDER_IMG) ? url : null;
};

// Spotify links aren't in Last.fm data; a Spotify search for "track artist" lands on the song.
const spotifySearch = (...terms: string[]) => `https://open.spotify.com/search/${encodeURIComponent(terms.join(" "))}`;

async function main() {
  if (!music.lastfmUser) return console.warn("[fetch-lastfm] no lastfmUser in site.config.ts; skipping");
  if (!KEY) return console.warn("[fetch-lastfm] LASTFM_API_KEY not set; keeping cached data");

  const [recent, topTracks, topArtists] = await Promise.all([
    call("user.getrecenttracks", { limit: "6" }),
    call("user.gettoptracks", { period: "1month", limit: "5" }),
    call("user.gettopartists", { period: "1month", limit: "5" }),
  ]);

  const data = {
    fetchedAt: new Date().toISOString(),
    source: "lastfm",
    profile: `https://www.last.fm/user/${music.lastfmUser}`,
    recent: (recent.recenttracks?.track ?? []).slice(0, 5).map((t: any) => ({
      title: t.name,
      artist: t.artist?.["#text"] ?? t.artist?.name ?? "",
      album: t.album?.["#text"] ?? "",
      image: art(t.image),
      url: spotifySearch(t.name, t.artist?.["#text"] ?? ""),
      nowPlaying: t["@attr"]?.nowplaying === "true",
      playedAt: t.date?.uts ? new Date(Number(t.date.uts) * 1000).toISOString() : null,
    })),
    topTracks: (topTracks.toptracks?.track ?? []).map((t: any) => ({
      title: t.name,
      artist: t.artist?.name ?? "",
      plays: Number(t.playcount),
      url: spotifySearch(t.name, t.artist?.name ?? ""),
    })),
    topArtists: (topArtists.topartists?.artist ?? []).map((a: any) => ({
      name: a.name,
      plays: Number(a.playcount),
      url: spotifySearch(a.name),
    })),
  };

  await mkdir(new URL(".", OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(data, null, 2) + "\n");
  console.log(`[fetch-lastfm] ${data.recent.length} recent, ${data.topTracks.length} top tracks`);
}

// Read the cache only to report what we'll fall back to.
main().catch(async (err) => {
  const cached = await readFile(OUT, "utf8").then(() => "cached music.json", () => "no data (card hides)");
  console.warn(`[fetch-lastfm] ${err.message}; using ${cached}`);
});
