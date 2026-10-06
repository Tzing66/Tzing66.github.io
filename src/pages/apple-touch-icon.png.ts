// 180×180 home-screen icon matching favicon.svg.
import type { APIRoute } from "astro";
import { site } from "../content/site.config";
import { colors as c, h, renderPng } from "../lib/og";

export const GET: APIRoute = async () => {
  const initials = site.name.split(" ").map((w) => w[0]).join("");
  const tree = h(
    "div",
    { width: "100%", height: "100%", alignItems: "center", justifyContent: "center", backgroundColor: c.bg, color: c.accent, fontSize: 76, fontFamily: "JetBrains Mono" },
    initials,
  );
  return new Response(await renderPng(tree, 180, 180), { headers: { "Content-Type": "image/png" } });
};
