// Shared scroll machinery: one IntersectionObserver for reveals, one for scroll-spy.
// No per-scroll-event work except a rAF-throttled progress fallback for browsers
// without CSS scroll-driven animations.

// Per-child delay lives in CSS (--i × 50ms); this caps it so long lists don't lag.
const MAX_STAGGER_STEPS = 8;

/** Fade/slide elements in as they enter the viewport; replay (lighter) when they re-enter. */
export function initReveal(root: ParentNode = document) {
  // [data-stagger] containers: each direct child reveals in turn.
  root.querySelectorAll<HTMLElement>("[data-stagger]").forEach((group) => {
    Array.from(group.children).forEach((child, i) => {
      const el = child as HTMLElement;
      el.dataset.reveal ??= "";
      el.style.setProperty("--i", String(Math.min(i, MAX_STAGGER_STEPS)));
    });
  });

  const items = root.querySelectorAll<HTMLElement>("[data-reveal]");
  const io = new IntersectionObserver(
    (entries) => {
      for (const { target, isIntersecting } of entries) {
        const el = target as HTMLElement;
        if (isIntersecting) {
          el.classList.add("is-visible");
          el.dataset.seen = "";
        } else {
          el.classList.remove("is-visible");
        }
      }
    },
    { rootMargin: "-10% 0px" },
  );
  items.forEach((el) => io.observe(el));
}

/** Mark the nav link / rail dot for the section crossing the middle of the viewport. */
export function initScrollSpy(sectionIds: readonly string[]) {
  const links = document.querySelectorAll<HTMLElement>("[data-spy]");
  const setActive = (id: string | null) =>
    links.forEach((l) => (l.dataset.spy === id ? l.setAttribute("aria-current", "location") : l.removeAttribute("aria-current")));

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) setActive(e.target.id === "home" ? null : e.target.id);
      }
    },
    // A thin band across the middle of the screen: whichever section covers it is active.
    { rootMargin: "-45% 0px -54% 0px" },
  );
  ["home", ...sectionIds].forEach((id) => {
    const el = document.getElementById(id);
    if (el) io.observe(el);
  });
}

/** Page scroll progress as --scroll (0..1) on <html>, only where CSS scroll timelines are missing. */
export function initProgressFallback() {
  if (CSS.supports("animation-timeline: scroll()")) return;
  const root = document.documentElement;
  root.classList.add("no-scroll-timeline");
  let queued = false;
  const update = () => {
    queued = false;
    const max = root.scrollHeight - innerHeight;
    root.style.setProperty("--scroll", String(max > 0 ? scrollY / max : 0));
  };
  addEventListener(
    "scroll",
    () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();
}
