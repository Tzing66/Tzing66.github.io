# CLAUDE.md

Personal portfolio for Tanmay "Tanz" Singh. Astro (static) + Tailwind v4 + React islands, deployed to GitHub Pages (`Tzing66/Tzing66.github.io`). Full spec: `PORTFOLIO_PLAN.md`.

## Rules

- Content lives in `src/content/site.config.ts` and `src/content/projects/*.md`. Never hard-code content in components.
- Never commit secrets. Spotify credentials exist only in GitHub Actions secrets and local `.env`, which is listed in `.gitignore`.
- Build-time fetches must have cached fallbacks, and the build must never fail because of an external API.
- Show only allowlisted repos.
- Prefer Astro components. Use React only where interactivity requires it.
- After each phase, run `npm run build` and `npm run preview`, then tell the owner what to check in the browser.
- Ask the owner for anything marked `TODO(Tanz)` instead of making it up.

## Dev

- `npm run dev` (or `npx astro dev --background`; manage with `astro dev stop|status|logs`)
- `npm run build && npm run preview`
- Theme tokens are CSS variables in `src/styles/global.css`, exposed to Tailwind via `@theme inline` (`bg-bg`, `text-muted`, `text-accent-ink`, …). Use `accent-ink` for accent-colored text so light mode keeps contrast.
- `npm run fetch` refreshes `src/data/*.json` (committed as the offline fallback). Scripts are plain `.ts` run by Node's built-in type stripping (Node ≥ 22.18), no tsx.
- Projects: allowlist + card copy in `site.config.ts` (`slug` links to `src/content/projects/<slug>.md`); modals are native `<dialog>` in `Projects.astro`, deep-linkable as `#projects/<slug>`.
- Motion: add `data-reveal` (one element) or `data-stagger` (each direct child) and `src/lib/reveal.ts` handles it; `--i` sets the stagger step. Only animate transform/opacity, and keep a `prefers-reduced-motion` override in `global.css`. Don't put `data-reveal` and a hover transform on the same element (see ProjectCard's li/article split).
- Scroll-driven CSS (`animation-timeline`): write longhands with the timeline in its own rule; Lightning CSS otherwise collapses them into `animation: none`.
- Now-section data: `fetch-github.ts` also writes `activity` (GraphQL contribution calendar + latest public push); `fetch-lastfm.ts` writes `music.json` (needs `LASTFM_API_KEY` secret + `music.lastfmUser` in config). Every card checks its data via `src/lib/data.ts` and hides when it's missing. Spotify's API was rejected on purpose (Premium-only dev apps, refresh tokens expire after 6 months).
- Relative times: render `<time data-ago="prefix " datetime=ISO>` with a build-time fallback; `updateTimes()` refreshes them client-side.
