// One-time Spotify login (re-run every ~6 months, when Spotify expires the refresh token).
//
//   npm run spotify:auth            → log in, save SPOTIFY_REFRESH_TOKEN to .env
//   npm run spotify:auth -- --push  → also copy all three Spotify secrets to GitHub Actions
//                                     and to the Cloudflare Worker (needs `gh` + `wrangler login`)
//
// Reads SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET from .env. Secrets are passed to gh/wrangler
// on stdin, never as command-line arguments, so they don't show up in shell history or `ps`.
import { createServer } from "node:http";
import { randomBytes } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";

const ENV = new URL("../.env", import.meta.url);
const WORKER_DIR = new URL("../worker/", import.meta.url).pathname;
const REPO = "Tzing66/Tzing66.github.io";
const REDIRECT = "http://127.0.0.1:8888/callback"; // must match the app's Redirect URI exactly
const SCOPES = ["user-read-currently-playing", "user-read-recently-played", "user-top-read"];

const id = process.env.SPOTIFY_CLIENT_ID;
const secret = process.env.SPOTIFY_CLIENT_SECRET;
if (!id || !secret) {
  console.error("Put SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env first.");
  process.exit(1);
}

const state = randomBytes(16).toString("hex");
const authUrl =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({ client_id: id, response_type: "code", redirect_uri: REDIRECT, scope: SCOPES.join(" "), state });

async function exchange(code: string) {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: REDIRECT }),
  });
  const body = await res.json();
  if (!res.ok || !body.refresh_token) throw new Error(body.error_description ?? body.error ?? `HTTP ${res.status}`);
  return body.refresh_token as string;
}

async function saveToEnv(token: string) {
  let env = await readFile(ENV, "utf8").catch(() => "");
  env = /^SPOTIFY_REFRESH_TOKEN=.*$/m.test(env)
    ? env.replace(/^SPOTIFY_REFRESH_TOKEN=.*$/m, `SPOTIFY_REFRESH_TOKEN=${token}`)
    : `${env.trimEnd()}\nSPOTIFY_REFRESH_TOKEN=${token}\n`;
  await writeFile(ENV, env);
}

function push(secrets: Record<string, string>) {
  for (const [name, value] of Object.entries(secrets)) {
    execFileSync("gh", ["secret", "set", name, "-R", REPO], { input: value, stdio: ["pipe", "ignore", "inherit"] });
    console.log(`  ✓ GitHub Actions secret ${name}`);
    execFileSync("npx", ["wrangler", "secret", "put", name], { cwd: WORKER_DIR, input: value, stdio: ["pipe", "ignore", "inherit"] });
    console.log(`  ✓ Cloudflare Worker secret ${name}`);
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", REDIRECT);
  if (url.pathname !== "/callback") return void res.writeHead(404).end();
  const done = (msg: string) => res.writeHead(200, { "Content-Type": "text/html" }).end(`<p style="font:16px system-ui;padding:2rem">${msg}</p>`);

  try {
    if (url.searchParams.get("state") !== state) throw new Error("state mismatch, try again");
    if (url.searchParams.get("error")) throw new Error(url.searchParams.get("error")!);
    const token = await exchange(url.searchParams.get("code")!);
    await saveToEnv(token);
    console.log("\n✓ Saved SPOTIFY_REFRESH_TOKEN to .env");
    if (process.argv.includes("--push")) {
      push({ SPOTIFY_CLIENT_ID: id!, SPOTIFY_CLIENT_SECRET: secret!, SPOTIFY_REFRESH_TOKEN: token });
    }
    done("Spotify connected. You can close this tab.");
  } catch (err) {
    console.error(`\n✗ ${(err as Error).message}`);
    done(`Something went wrong: ${(err as Error).message}`);
    process.exitCode = 1;
  }
  server.close();
});

server.listen(8888, "127.0.0.1", () => {
  console.log(`Opening Spotify login… if nothing opens, visit:\n\n  ${authUrl}\n`);
  try {
    execFileSync("open", [authUrl], { stdio: "ignore" });
  } catch {}
});
