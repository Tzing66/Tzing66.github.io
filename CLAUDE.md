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
