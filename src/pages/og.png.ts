// 1200×630 social preview image, generated at build time in the site's style.
import type { APIRoute } from "astro";
import { site, sections } from "../content/site.config";
import { colors as c, h, renderPng } from "../lib/og";

export const GET: APIRoute = async () => {
  const mono = { fontFamily: "JetBrains Mono" };
  const initials = site.name.split(" ").map((w) => w[0]).join("");
  const host = new URL(site.url).host;

  const tree = h(
    "div",
    {
      width: "100%",
      height: "100%",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "72px 80px",
      backgroundColor: c.bg,
      backgroundImage: `linear-gradient(${c.line} 1px, transparent 1px), linear-gradient(90deg, ${c.line} 1px, transparent 1px)`,
      backgroundSize: "64px 64px",
      color: c.fg,
      fontFamily: "Inter Tight",
    },
    h(
      "div",
      { alignItems: "center", gap: 20 },
      h("div", { width: 64, height: 64, alignItems: "center", justifyContent: "center", borderRadius: 12, border: `2px solid ${c.line}`, backgroundColor: c.surface, color: c.accent, fontSize: 26, ...mono }, initials),
      h("div", { fontSize: 24, color: c.muted, ...mono }, host),
    ),
    h(
      "div",
      { flexDirection: "column" },
      // Dot and arrows are drawn as shapes: the latin font subsets have no ● or → glyphs.
      h(
        "div",
        { alignItems: "center", gap: 14, fontSize: 24, color: c.muted, marginBottom: 20, ...mono },
        h("div", { width: 12, height: 12, borderRadius: 6, backgroundColor: c.accent }),
        site.location,
      ),
      h("div", { fontSize: 104, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1 }, site.name),
      h("div", { fontSize: 36, color: c.accent, marginTop: 24, ...mono }, site.role),
    ),
    h(
      "div",
      { alignItems: "center", gap: 14, fontSize: 22, color: c.muted, ...mono },
      ...sections.flatMap((s, i) => [
        ...(i ? [h("div", { width: 18, height: 2, backgroundColor: c.accent })] : []),
        h("div", { padding: "8px 14px", borderRadius: 8, border: `1px solid ${c.line}`, backgroundColor: c.surface, color: c.fg }, s.id),
      ]),
    ),
  );

  return new Response(await renderPng(tree, 1200, 630), { headers: { "Content-Type": "image/png" } });
};
