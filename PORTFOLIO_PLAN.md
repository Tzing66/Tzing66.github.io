# Portfolio Website: Build Plan for Claude Code

> **How to use this file:** Put it in an empty folder, open the folder in VS Code, and tell Claude Code:
> *"Read PORTFOLIO_PLAN.md and build the site phase by phase. Stop after each phase so I can review it in the browser before you continue."*
> Anything marked `TODO(Tanz)` is something only I can provide. Ask me for it when you reach it, and don't invent it.

---

## 1. Goal

Build a single-page personal portfolio for **Tanmay "Tanz" Singh**, a Data Engineer with a background in MLOps and Data Engineering. The page should:

- Feature a **hand-picked** set of my GitHub projects. Do not list every repo I have.
- Cover who I am, my experience, and my resume (viewable and downloadable).
- Show my tech stack.
- Give small glimpses of my personality, starting with Spotify listening data.
- Link to my **LinkedIn** and **GitHub** clearly and in more than one place.
- Look clean and modern, with quick, snappy animations. It should feel like the work of a careful engineer and not like a template.
- Cost nothing to host, stay up without maintenance, and redeploy automatically.

## 2. Non-negotiables

1. **One page, scroll-driven.** All content lives on a single long page. As you scroll down or up, each section animates into view on its own. There are no separate pages and no "next" buttons. The only exception is the resume PDF, which opens in a new tab.
2. **Anchor navigation.** A nav with in-page links (`#about`, `#projects`, and so on) that **smooth-scroll** to each section. The nav highlights the section currently in view (scroll-spy). Linking directly to `/#projects` must land on that section.
3. **Curated projects only.** Projects come from an allowlist in a config file, in the order I list them. Repos that aren't in the list never appear.
4. **LinkedIn and GitHub everywhere they matter:** in the hero, the nav or header, the contact section, and the footer.
5. **Free, always-on hosting:** GitHub Pages, deployed by GitHub Actions on every push to `main`.
6. **Fast and accessible:** Lighthouse scores of 95 or higher for Performance, Accessibility, Best Practices and SEO. Respect `prefers-reduced-motion`. The page must be fully usable by keyboard and work at 360px phone width.
7. **One source of truth for content.** All text, links and project choices live in `src/content/site.config.ts` (plus the Markdown files described below). I should never have to edit components to change content.

## 3. Tech stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Astro** (latest stable), static output | Ships almost no JavaScript, fast by default, and deploys cleanly to GitHub Pages |
| Interactive bits | **React** islands, only where needed | For the command palette, Spotify widget and pipeline hero |
| Styling | **Tailwind CSS** (latest) | Quick to build with and keeps the design consistent |
| Animation | **Motion** (`motion`, the library formerly called Framer Motion) inside islands, plus CSS and `IntersectionObserver` for scroll reveals | Snappy, and lighter than loading Motion everywhere |
| Smooth scroll | Native CSS `scroll-behavior: smooth` with `scroll-margin-top` on sections. Optionally **Lenis** if native scrolling feels flat | Native is free. Lenis adds polish |
| Icons | `lucide` icons and Simple Icons for tech logos | |
| Fonts | One display font and one mono font, self-hosted with `@fontsource` (for example Inter Tight or Geist with JetBrains Mono) | No layout shift and no request to Google |
| Hosting | GitHub Pages through `actions/deploy-pages` | Free, no server |
| Data refresh | A scheduled GitHub Action rebuilds the site every 6 hours | Keeps GitHub stats and Spotify data fresh without running a server |

Use the latest stable versions. Don't pin to versions remembered from training data. Check with `npm view <pkg> version` if unsure.

## 4. Creative concept: "the pipeline"

I'm a data engineer, so the page reads like **data moving through a pipeline**. Keep the theme subtle and tasteful. It's a motif, not a gimmick.

- **Hero:** My name, my role ("Data Engineer · MLOps · AI systems"), a one-line pitch, and LinkedIn, GitHub and Resume buttons. Behind or beside it sits a small **animated DAG** (directed acyclic graph). Its nodes are the page sections: `about → experience → projects → stack → now → contact`. Small dots of "data" flow along the edges. Each node is a link that smooth-scrolls to its section. On phones, collapse the DAG into a simple vertical line of nodes.
- **Section headers styled as pipeline stages,** for example `01 / ingest — About`, `02 / transform — Experience`, `03 / serve — Projects`. Use a small mono label above a large heading.
- **Progress rail:** A thin vertical line on the left on desktop, or a top progress bar on mobile, that fills as you scroll. It has a dot for each section, and each dot is a link.
- **Status bar footer:** A strip styled like a terminal or system-status line, for example `● all systems operational · last deploy 2h ago · now playing: <track>`.
- **Command palette (⌘K / Ctrl+K):** Jump to any section, open GitHub, LinkedIn or the resume, copy my email, or toggle the theme. Show a small `⌘K` hint in the nav.
- **Theme:** Dark by default, with a light theme available through a toggle. Use a restrained palette: near-black, off-white, and **one** accent color used sparingly (`TODO(Tanz)`: pick the accent; suggest three options and let me choose). Add a subtle grain or grid texture.

## 5. Page structure, top to bottom

Every section has an `id`, appears in the nav, the progress rail and the command palette, and **animates in as it enters the viewport**. Use a fade plus an 8–16px upward slide, with children staggered 40–60ms apart. Durations are 250–450ms with an ease-out curve. Animations replay lightly when scrolling back up. Nothing should feel slow or floaty.

1. **`#home` — Hero.** Name, role, pitch, the animated DAG, and links to LinkedIn, GitHub and the resume. A "scroll" cue at the bottom.
2. **`#about` — About.** Two or three short paragraphs: CS degree from Manipal University Jaipur, MS in Data Science, Analytics and Engineering from Arizona State University, now based in India and open to UK roles. Optional photo (`TODO(Tanz)`). Add three or four quick facts as chips, for example "📍 India · open to UK" and "🛠 MLOps & Data Engineering".
3. **`#experience` — Experience.** A vertical timeline whose cards animate in one by one:
   - **Data Engineer (AI & Backend Systems), Vault IQ** · Remote · Dec 2025 – May 2026 · `TODO(Tanz)`: 2–3 bullet points describing impact
   - **Data Engineer, Capgemini (HSBC UK account, Application Data Management)** · Oct 2020 – Mar 2023 · SQL, Python, Spark and Airflow; optimized queries and wrote SCD logic to meet ETL SLAs · `TODO(Tanz)`: any metrics
   - Include an "Education" sub-block with both degrees.
4. **`#projects` — Projects** (the centerpiece; see section 6).
5. **`#stack` — Tech stack.** Logos grouped into categories: **Languages** (Python, SQL…), **Data** (Spark, Airflow, Postgres…), **ML/AI** (FastAPI serving, Claude API…), **Cloud & DevOps** (AWS, Docker, GitHub Actions…). Each logo shows a tooltip on hover. Optionally add a "currently learning" row. `TODO(Tanz)`: confirm the final list.
6. **`#now` — Now / personality.** A bento grid of small cards:
   - **Spotify:** "Recently played" or "On repeat this month" (see section 7).
   - **GitHub activity:** a contribution heatmap or a "last commit: X hours ago in <repo>" line.
   - **Currently:** a short hand-written list (what I'm building, reading, learning). Example: "Grinding NeetCode 150".
   - Leave room for one or two more cards later (for example a book, a game, or gym stats). `TODO(Tanz)`.
7. **`#contact` — Contact.** A short line inviting people to get in touch, a copy-to-clipboard email button, big LinkedIn and GitHub buttons, and a resume download. No contact form, since a form would need a backend.
8. **Footer.** The status-bar strip, the LinkedIn and GitHub icons again, "Built with Astro · deployed on GitHub Pages", and the year.

**Nav:** A sticky top bar that shrinks or blurs once you scroll. It holds my name or monogram on the left, the anchor links in the center, and the GitHub icon, LinkedIn icon and ⌘K hint on the right. The active link updates as you scroll (use `IntersectionObserver`; don't attach a scroll listener that recalculates on every scroll event). On mobile it becomes a hamburger that opens a full-screen menu of anchor links, and the menu closes when a link is tapped.

## 6. Projects: curated from GitHub

**Config-driven allowlist** in `src/content/site.config.ts`:

```ts
export const projects = [
  {
    repo: "TODO-github-username/checkyourdata",   // owner/name
    featured: true,                                 // large card
    title: "CheckYourData",                         // optional override of the repo name
    tagline: "Data quality checks, suggested by an AI agent",
    status: "building",                             // "live" | "building" | "archived"
    demo: "",                                       // optional live URL
    image: "/projects/checkyourdata.png",           // optional screenshot
    highlights: [
      "Upload a dataset; an agent reads the schema and proposes validation checks",
      "Approve or edit suggestions alongside preset checks",
    ],
    stack: ["React", "FastAPI", "Postgres", "Claude API", "Docker"],
  },
  {
    repo: "TODO-github-username/checkyouraqi",
    featured: true,
    title: "CheckYourAQI",
    tagline: "Air quality forecasting and alerting platform",
    status: "building",
    stack: ["Airflow", "AWS", "Python", "ML"],
  },
  {
    repo: "TODO-github-username/job_matching_agent",
    title: "Job Matching Agent",
    tagline: "Fetches and scores job postings against my resumes",
    stack: ["Python", "Claude", "Adzuna API", "Excel"],
  },
  // TODO(Tanz): add, remove or reorder. ONLY repos listed here are shown.
];
```

**How it works:**
- At **build time**, a script (`scripts/fetch-github.ts`) calls the GitHub API **only for the repos in the allowlist** and saves the results to `src/data/github.json`. It records stars, primary language, last-pushed date, topics and the description (used only when no tagline is set).
- In GitHub Actions, authenticate with the built-in `GITHUB_TOKEN`. Run locally without a token (public API, rate limited) and fall back to the last cached `github.json`. **The build must never fail because the API is unreachable.**
- Display order follows the config. Featured projects get large cards with a screenshot, highlights and a stack row. The others get compact cards.
- Each card shows a status badge ("live", "building" or "archived"), stars, language and "updated X days ago", and links to the repo, the live demo if there is one, and a details view.
- Card hover: a small lift, a border glow in the accent color, and the screenshot zooms slightly. Clicking a card opens an **in-page modal or expanded panel**, not a new page. The panel holds a longer write-up from `src/content/projects/<slug>.md` covering the problem, the architecture (an optional diagram) and what I learned. Closing it returns to the same scroll position. Opening it updates the URL hash (`#projects/checkyourdata`) so the link can be shared.
- Optional filter chips above the grid (All / Data Eng / ML / AI), derived from tags in the config.

## 7. Spotify and other personality data (static-site friendly)

GitHub Pages can't run server code, and Spotify requires a secret to refresh access tokens. So **fetch the data during the scheduled build, not in the browser.**

- **Recommended approach: build-time snapshot.**
  1. I create a Spotify developer app (`TODO(Tanz)`), and Claude Code walks me through a **one-time local script** (`scripts/spotify-auth.ts`) that gets a **refresh token** with the scopes `user-read-recently-played` and `user-top-read`.
  2. I store `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` and `SPOTIFY_REFRESH_TOKEN` as **GitHub Actions secrets.** Never commit them, and never let them reach client-side code.
  3. `scripts/fetch-spotify.ts` runs during the build and saves the last 5 recently played tracks and the top tracks and artists for the past four weeks to `src/data/spotify.json`. Each entry has the title, artist, album art URL and a Spotify link.
  4. The card shows "Recently played" with album art and a small equalizer animation, plus "On repeat this month". Label it with the time it was last updated, so it's honest that this isn't live.
  5. Because the site rebuilds every 6 hours (section 9), the data stays reasonably fresh.
- **Before building this, check Spotify's current developer-access rules for personal apps**, because they have changed several times. If personal-app access is blocked or impractical, fall back to **Last.fm** (connect Spotify to Last.fm so it logs plays, then use the public `user.getrecenttracks` and `user.gettoptracks` endpoints with an API key, also fetched at build time). Tell me which path you're taking and why.
- **Optional phase 2: truly live "now playing."** A tiny **Cloudflare Worker** (free tier) holds the secrets and returns the current track as JSON, and the site polls it every 30 seconds. Only do this if I ask for it; the snapshot is enough for v1.
- **Missing data must never break the page.** If any data file is empty or missing, the card hides itself or shows a tasteful placeholder.

## 8. Resume

- I place my PDF at `public/resume/Tanmay_Singh_Resume.pdf` (`TODO(Tanz)`; I have several versions, so the Data Engineering one is the default).
- "Resume" buttons open it in a new tab, and a separate download button uses the `download` attribute.
- Optional: an "Also available" dropdown for the other versions (Data Science, Data Analyst, AI Engineer). Leave it off unless I add those files.

## 9. Hosting and deployment

- The repo is named `TODO-username.github.io` so the site lives at the root URL. If I use a different name, set Astro's `base` option correctly and make sure every link and asset still works.
- `.github/workflows/deploy.yml`:
  - Triggers: `push` to `main`, `workflow_dispatch` (manual), and `schedule` with cron `0 */6 * * *`.
  - Steps: checkout → set up Node → install → run the GitHub and Spotify fetch scripts (with secrets) → `astro build` → upload the Pages artifact → deploy with `actions/deploy-pages`.
  - If a fetch fails, log a warning, use the cached JSON and keep going.
- Walk me through the one-time settings step: **Settings → Pages → Source: GitHub Actions.**
- Optional later: a custom domain (CNAME file plus DNS instructions). Not needed for v1.

## 10. SEO, sharing and polish

- `<title>`, a meta description, Open Graph and Twitter card tags, and a generated **OG image** (1200×630 with my name and role in the site's style).
- A favicon or monogram, `sitemap.xml`, `robots.txt`, and JSON-LD `Person` schema with `sameAs` set to my LinkedIn and GitHub URLs.
- A custom 404 page that matches the theme and links back to `/#home`.
- Small touches: text selection in the accent color, a styled focus ring, a small "back to top" control, and a commented hint in the console for curious developers who open DevTools.

## 11. Animation rules ("snappy, not floaty")

- Durations of 150–450ms. Use ease-out for entering elements, and a spring only for hover and press effects.
- Animate only `transform` and `opacity`. Never animate layout properties.
- Scroll reveals use a single shared `IntersectionObserver` utility with `rootMargin` about `-10% 0px`.
- Under `prefers-reduced-motion`: no movement, only instant or opacity changes. The DAG goes static.
- The hero must be fully visible and usable before any JavaScript loads. No layout shift from animations.

## 12. Project structure

```
/
├─ PORTFOLIO_PLAN.md
├─ CLAUDE.md                  # short rules for Claude Code (see section 14)
├─ astro.config.mjs
├─ tailwind.config.*          # (or Tailwind v4 CSS config)
├─ public/
│  ├─ resume/
│  ├─ projects/               # screenshots
│  └─ favicon.svg
├─ scripts/
│  ├─ fetch-github.ts
│  ├─ fetch-spotify.ts
│  └─ spotify-auth.ts         # one-time local helper
├─ src/
│  ├─ content/
│  │  ├─ site.config.ts       # name, links, projects allowlist, stack, "currently"
│  │  └─ projects/*.md        # long-form project write-ups
│  ├─ data/                   # generated JSON (github.json, spotify.json), committed as fallback
│  ├─ components/
│  │  ├─ Nav.astro, ProgressRail.astro, Section.astro, Footer.astro
│  │  ├─ Hero.astro + PipelineDag.tsx
│  │  ├─ ProjectCard.astro, ProjectModal.tsx
│  │  ├─ StackGrid.astro, Timeline.astro
│  │  ├─ SpotifyCard.astro, GithubActivity.astro
│  │  └─ CommandPalette.tsx
│  ├─ lib/reveal.ts           # shared IntersectionObserver reveal + scroll-spy
│  ├─ styles/global.css
│  └─ pages/index.astro, 404.astro
└─ .github/workflows/deploy.yml
```

`site.config.ts` must also include:

```ts
export const site = {
  name: "Tanmay Singh",
  nickname: "Tanz",
  role: "Data Engineer · MLOps · AI systems",
  pitch: "TODO(Tanz): one sentence",
  location: "India · open to UK roles",
  email: "TODO(Tanz)",
  links: {
    github: "https://github.com/TODO",
    linkedin: "https://www.linkedin.com/in/TODO",
    resume: "/resume/Tanmay_Singh_Resume.pdf",
  },
};
```

## 13. Build phases (stop and show me after each)

**Phase 1: Skeleton and deploy pipeline**
- Scaffold Astro with Tailwind and React. Write `site.config.ts` with placeholders, set up the theme tokens (dark and light) and fonts.
- Build all sections as plain stacked sections with their `id`s, plus the sticky nav with anchor links and smooth scrolling.
- Set up the GitHub Actions deploy and walk me through enabling Pages.
- ✅ Done when the live URL shows every section, the nav links jump correctly, and `/#projects` deep-links work.

**Phase 2: Content and projects**
- Add the GitHub fetch script with the allowlist, the project cards, the modal with Markdown write-ups, experience, the stack grid, the resume links, and contact (LinkedIn, GitHub, copy email).
- ✅ Done when only the allowlisted repos appear, in config order, with live stats, and the build still succeeds with the network turned off.

**Phase 3: Motion and the pipeline concept**
- Add scroll reveals, scroll-spy highlighting, the progress rail, the animated DAG hero, card hover effects, the nav that shrinks on scroll, and reduced-motion support.
- ✅ Done when it feels snappy at 60fps on a mid-range phone and nothing moves when reduced motion is on.

**Phase 4: Personality**
- Check Spotify's access rules, then add the auth helper, the fetch script, the secrets setup, the Spotify card, the GitHub activity card, the "Currently" card, the status-bar footer, and the 6-hourly cron.
- ✅ Done when the cards show real data after a deploy and hide cleanly when data is missing.

**Phase 5: Polish and ship**
- Add the command palette, SEO and OG image, 404 page, and favicon. Run a Lighthouse pass and fix anything below 95. Check keyboard navigation and test at 360px, 768px and 1440px.
- ✅ Done when Lighthouse scores are 95 or higher across the board and a final review checklist is reported to me.

## 14. Rules for Claude Code (copy into `CLAUDE.md`)

- Content lives in `src/content/site.config.ts` and `src/content/projects/*.md`. Never hard-code content in components.
- Never commit secrets. Spotify credentials exist only in GitHub Actions secrets and local `.env`, which is listed in `.gitignore`.
- Build-time fetches must have cached fallbacks, and the build must never fail because of an external API.
- Show only allowlisted repos.
- Prefer Astro components. Use React only where interactivity requires it.
- After each phase, run `npm run build` and `npm run preview`, then tell me what to check in the browser.
- Ask me for anything marked `TODO(Tanz)` instead of making it up.

## 15. Things I need to gather (`TODO(Tanz)` checklist)

- [ ] GitHub username, plus which repos to feature and in what order
- [ ] LinkedIn URL and email
- [ ] One-sentence pitch and 2–3 paragraphs about me
- [ ] Bullet points describing impact at Vault IQ and Capgemini (numbers help)
- [ ] Resume PDF(s)
- [ ] Project screenshots (or ask Claude Code to capture them from running demos)
- [ ] Accent color choice
- [ ] Final tech stack list
- [ ] Spotify developer app (or a Last.fm account as the fallback)
- [ ] Optional: a photo, and a custom domain later
