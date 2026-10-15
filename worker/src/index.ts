// GET /now → what Spotify is playing right now, plus the last few tracks, as small public JSON.
// The refresh token never leaves this Worker. Responses are memoised per isolate for 15 s, so
// any number of visitors polling every 30 s costs Spotify at most ~4 calls a minute.

export interface Env {
  SPOTIFY_CLIENT_ID: string;
  SPOTIFY_CLIENT_SECRET: string;
  SPOTIFY_REFRESH_TOKEN: string;
  ALLOWED_ORIGINS: string;
}

type Track = { title: string; artist: string; album: string; image: string | null; url: string };
type Now = {
  fetchedAt: string;
  isPlaying: boolean;
  item: (Track & { durationMs: number }) | null;
  progressMs: number;
  recent: (Track & { playedAt: string })[];
};

const TTL_MS = 15_000;
let token: { value: string; expires: number } | null = null;
let memo: { body: string; at: number } | null = null;

class TokenExpired extends Error {}

async function accessToken(env: Env) {
  if (token && token.expires > Date.now() + 30_000) return token.value;
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: env.SPOTIFY_REFRESH_TOKEN }),
  });
  const body: any = await res.json();
  if (body.error === "invalid_grant") throw new TokenExpired("refresh token expired or revoked");
  if (!res.ok) throw new Error(`token: ${body.error ?? res.status}`);
  token = { value: body.access_token, expires: Date.now() + body.expires_in * 1000 };
  return token.value;
}

const track = (t: any): Track => ({
  title: t.name,
  artist: (t.artists ?? []).map((a: any) => a.name).join(", "),
  album: t.album?.name ?? "",
  // Spotify sorts images largest first; the 300px one is plenty for a card.
  image: t.album?.images?.find((i: any) => i.width <= 300)?.url ?? t.album?.images?.[0]?.url ?? null,
  url: t.external_urls?.spotify ?? "",
});

async function spotify(path: string, env: Env) {
  const res = await fetch(`https://api.spotify.com/v1${path}`, { headers: { Authorization: `Bearer ${await accessToken(env)}` } });
  if (res.status === 204) return null; // nothing playing
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return res.json() as Promise<any>;
}

async function now(env: Env): Promise<Now> {
  const [current, recent] = await Promise.all([
    spotify("/me/player/currently-playing", env),
    spotify("/me/player/recently-played?limit=10", env),
  ]);
  // Podcasts/ads come through as non-track items; only show music.
  const playing = current?.currently_playing_type === "track" && current.item ? current : null;
  return {
    fetchedAt: new Date().toISOString(),
    isPlaying: !!playing?.is_playing,
    item: playing ? { ...track(playing.item), durationMs: playing.item.duration_ms } : null,
    progressMs: playing?.progress_ms ?? 0,
    // Collapse back-to-back replays of the same song so the list doesn't look duplicated.
    recent: (recent?.items ?? [])
      .filter((i: any, n: number, all: any[]) => n === 0 || i.track.id !== all[n - 1].track.id)
      .slice(0, 5)
      .map((i: any) => ({ ...track(i.track), playedAt: i.played_at })),
  };
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const origin = req.headers.get("Origin") ?? "";
    const allowed = env.ALLOWED_ORIGINS.split(",").includes(origin);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...(allowed ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" } : {}),
    };
    if (req.method === "OPTIONS") return new Response(null, { headers });
    if (new URL(req.url).pathname !== "/now") return new Response("Not found", { status: 404 });

    try {
      if (!memo || Date.now() - memo.at > TTL_MS) memo = { body: JSON.stringify(await now(env)), at: Date.now() };
      return new Response(memo.body, { headers });
    } catch (err) {
      const expired = err instanceof TokenExpired;
      console.error(err);
      return new Response(JSON.stringify({ error: expired ? "token_expired" : "upstream" }), { status: expired ? 503 : 502, headers });
    }
  },
};
