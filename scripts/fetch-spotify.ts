// Build-time Spotify snapshot for the Now section: recently played, top tracks and top artists
// over ~4 weeks. The live "now playing" comes from the Worker (worker/) in the browser; this
// snapshot is what renders before that loads, and the fallback if it can't.
//
// Env: SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN (.env / Actions secrets).
// Writes src/data/music.json. Never breaks the build: any failure keeps the cached file.
// Exit code 2 means ONLY "the refresh token expired": the workflow turns that into an issue.
import { writeFile, mkdir } from "node:fs/promises";

const OUT = new URL("../src/data/music.json", import.meta.url);
const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret, SPOTIFY_REFRESH_TOKEN: refresh } = process.env;

class TokenExpired extends Error {}

async function accessToken() {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refresh! }),
    signal: AbortSignal.timeout(10_000),
  });
  const body = await res.json();
  if (body.error === "invalid_grant") throw new TokenExpired("refresh token expired or revoked; run `npm run spotify:auth -- --push`");
  if (!res.ok) throw new Error(`token: ${body.error ?? res.status}`);
  return body.access_token as string;
}

const image = (images: { url: string; width: number }[] = []) => images.find((i) => i.width <= 300)?.url ?? images[0]?.url ?? null;
const track = (t: any) => ({
  title: t.name,
  artist: (t.artists ?? []).map((a: any) => a.name).join(", "),
  album: t.album?.name ?? "",
  image: image(t.album?.images),
  url: t.external_urls?.spotify ?? "",
});

async function main() {
  if (!id || !secret || !refresh) return console.warn("[fetch-spotify] Spotify secrets not set; keeping cached data");
  const token = await accessToken();
  const get = async (path: string) => {
    const res = await fetch(`https://api.spotify.com/v1${path}`, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
    return res.json() as Promise<any>;
  };

  const [me, recent, topTracks, topArtists] = await Promise.all([
    get("/me"),
    get("/me/player/recently-played?limit=10"),
    get("/me/top/tracks?time_range=short_term&limit=5"),
    get("/me/top/artists?time_range=short_term&limit=4"),
  ]);

  const data = {
    fetchedAt: new Date().toISOString(),
    source: "spotify",
    profile: me.external_urls?.spotify ?? "https://open.spotify.com",
    // Collapse back-to-back replays of the same song so the list doesn't look duplicated.
    recent: recent.items
      .filter((i: any, n: number, all: any[]) => n === 0 || i.track.id !== all[n - 1].track.id)
      .slice(0, 5)
      .map((i: any) => ({ ...track(i.track), nowPlaying: false, playedAt: i.played_at })),
    topTracks: topTracks.items.map(track),
    topArtists: topArtists.items.map((a: any) => ({ name: a.name, image: image(a.images), url: a.external_urls?.spotify ?? "" })),
  };

  await mkdir(new URL(".", OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(data, null, 2) + "\n");
  console.log(`[fetch-spotify] ${data.recent.length} recent, ${data.topTracks.length} top tracks, ${data.topArtists.length} top artists`);
}

main().catch((err) => {
  console.warn(`[fetch-spotify] ${err.message}; keeping cached music.json`);
  if (err instanceof TokenExpired) process.exitCode = 2;
});
