// Build-time PNG rendering (satori → SVG → resvg → PNG) for the OG image and touch icon.
// Runs only during `astro build`; nothing here ships to the browser.
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const require = createRequire(import.meta.url);
const font = (pkg: string, file: string) => readFile(require.resolve(`${pkg}/files/${file}`));

export const colors = { bg: "#0b0b0c", surface: "#131315", fg: "#ededea", muted: "#9a9a94", line: "#24242a", accent: "#ffb224" };

/** Tiny hyperscript so we can describe satori trees without JSX. */
export const h = (type: string, style: Record<string, unknown>, ...children: unknown[]) => ({
  type,
  props: { style: { display: "flex", ...style }, children: children.length === 1 ? children[0] : children },
});

export async function renderPng(tree: unknown, width: number, height: number) {
  const [sans, sansBold, mono] = await Promise.all([
    font("@fontsource/inter-tight", "inter-tight-latin-400-normal.woff"),
    font("@fontsource/inter-tight", "inter-tight-latin-600-normal.woff"),
    font("@fontsource/jetbrains-mono", "jetbrains-mono-latin-400-normal.woff"),
  ]);
  const svg = await satori(tree as never, {
    width,
    height,
    fonts: [
      { name: "Inter Tight", data: sans, weight: 400, style: "normal" },
      { name: "Inter Tight", data: sansBold, weight: 600, style: "normal" },
      { name: "JetBrains Mono", data: mono, weight: 400, style: "normal" },
    ],
  });
  return new Resvg(svg, { fitTo: { mode: "width", value: width } }).render().asPng();
}
