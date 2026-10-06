import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Long-form project write-ups: src/content/projects/<slug>.md, matched to site.config.ts by slug.
const projects = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/projects" }),
  schema: z.object({}),
});

export const collections = { projects };
