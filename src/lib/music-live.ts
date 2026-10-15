// Live "now playing" for MusicCard: polls the Worker only while the card is on screen and the
// tab is visible, and ticks the progress bar locally between polls. Any failure leaves the
// server-rendered snapshot untouched. All text goes in via textContent.
import { timeAgo } from "./time";

type Track = { title: string; artist: string; album: string; image: string | null; url: string };
type Now = {
  isPlaying: boolean;
  item: (Track & { durationMs: number }) | null;
  progressMs: number;
  recent: (Track & { playedAt: string })[];
};

const mmss = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

export function initMusicLive() {
  const card = document.querySelector<HTMLElement>("[data-music]");
  const url = card?.dataset.nowUrl;
  if (!card || !url) return;
  const $ = <T extends HTMLElement>(sel: string) => card.querySelector<T>(sel)!;
  const pollMs = Number(card.dataset.poll || 30) * 1000;

  let timer: number | undefined;
  let tick: number | undefined;
  let onScreen = false;
  let progress = { at: 0, ms: 0, duration: 0, playing: false };

  const setHero = (t: Track, playing: boolean, playedAt?: string) => {
    $<HTMLAnchorElement>("[data-hero]").href = t.url;
    const img = $<HTMLImageElement>("[data-hero-img]");
    if (t.image && img.src !== t.image) img.src = t.image;
    // Layout B paints a blurred copy of the art behind the hero.
    const bg = card.querySelector<HTMLImageElement>("[data-hero-bg]");
    if (bg && t.image && bg.src !== t.image) bg.src = t.image;
    $("[data-hero-title]").textContent = t.title;
    $("[data-hero-artist]").textContent = t.artist;
    $("[data-hero-album]").textContent = t.album;
    $("[data-heading]").textContent = playing ? "Now playing" : "Last played";
    $("[data-eq]").hidden = !playing;
    $("[data-badge]").textContent = playing ? "live" : "spotify ↗";
    $("[data-progress-wrap]").hidden = !playing;
    const when = $("[data-hero-when]");
    when.hidden = playing;
    if (!playing && playedAt) {
      when.textContent = timeAgo(playedAt);
    }
  };

  const renderProgress = () => {
    const ms = progress.playing ? Math.min(progress.duration, progress.ms + (Date.now() - progress.at)) : progress.ms;
    $("[data-progress]").style.width = `${progress.duration ? (ms / progress.duration) * 100 : 0}%`;
    $("[data-elapsed]").textContent = mmss(ms);
    $("[data-duration]").textContent = mmss(progress.duration);
    // The song ended between polls: fetch once, sooner than the regular interval.
    if (progress.playing && ms >= progress.duration) {
      progress.playing = false;
      clearInterval(tick);
      window.setTimeout(poll, 1500);
    }
  };

  const setRecent = (items: Now["recent"]) => {
    const list = card.querySelector("[data-recent]");
    if (!list) return;
    list.querySelectorAll("li").forEach((li, i) => {
      const t = items[i];
      if (!t) return;
      li.querySelector("a")!.href = t.url;
      const img = li.querySelector("img")!;
      if (t.image) img.src = t.image;
      const spans = li.querySelectorAll<HTMLElement>("a > span:not(:last-child) span");
      spans[0].textContent = t.title;
      spans[1].textContent = t.artist;
      li.querySelector("a > span:last-child")!.textContent = timeAgo(t.playedAt);
    });
  };

  async function poll() {
    clearTimeout(timer);
    try {
      const res = await fetch(url!, { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const now: Now = await res.json();
      const playing = now.isPlaying && !!now.item;
      if (now.item) {
        setHero(now.item, playing);
        progress = { at: Date.now(), ms: now.progressMs, duration: now.item.durationMs, playing };
        renderProgress();
        // When something is playing, the recent list starts at the first track; otherwise the hero shows it.
        setRecent(playing ? now.recent : now.recent.slice(1));
      } else if (now.recent[0]) {
        setHero(now.recent[0], false, now.recent[0].playedAt);
        setRecent(now.recent.slice(1));
      }
      $("[data-footnote]").textContent = playing ? "live from Spotify" : "live from Spotify · nothing playing";
      clearInterval(tick);
      if (playing) tick = window.setInterval(renderProgress, 1000);
    } catch {
      // Keep whatever is on screen; try again next interval.
    }
    if (onScreen && !document.hidden) timer = window.setTimeout(poll, pollMs);
  }

  const resume = () => {
    if (onScreen && !document.hidden) poll();
    else {
      clearTimeout(timer);
      clearInterval(tick);
    }
  };
  new IntersectionObserver(([e]) => {
    onScreen = e.isIntersecting;
    resume();
  }).observe(card);
  document.addEventListener("visibilitychange", resume);
}
