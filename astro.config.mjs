// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // User site repo (Tzing66.github.io) is served from the root, so no `base`.
  site: 'https://tzing66.github.io',
  integrations: [react(), sitemap()],
  // Write-ups contain no real code, and Shiki's fixed dark theme would clash with the light theme.
  markdown: { syntaxHighlight: false },

  vite: {
    plugins: [tailwindcss()]
  }
});
