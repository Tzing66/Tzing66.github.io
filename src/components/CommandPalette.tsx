// ⌘K / Ctrl+K command palette: jump to sections or projects, open links, copy email, toggle theme.
// Hydrated with client:idle. Opened by the keyboard shortcut or a "palette:open" window event
// (the nav hint button); a click before hydration is queued on window.__paletteOpen.
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  sections: { id: string; label: string }[];
  projects: { slug: string; title: string }[];
  links: { github: string; linkedin: string; resume: string };
  email: string;
};

type Command = { id: string; group: string; label: string; hint?: string; run: () => void | Promise<void> };

declare global {
  interface Window {
    __paletteOpen?: boolean;
  }
}

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function CommandPalette({ sections, projects, links, email }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState("");

  const close = () => dialog.current?.close();
  const open = () => {
    const d = dialog.current;
    if (!d || d.open) return;
    setQuery("");
    setActive(0);
    setToast("");
    d.showModal();
    input.current?.focus();
  };

  const commands = useMemo<Command[]>(() => {
    const goTo = (id: string) => () => {
      close();
      document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });
      history.replaceState(null, "", `#${id}`);
    };
    const openUrl = (url: string) => () => {
      close();
      window.open(url, "_blank", "noopener,noreferrer");
    };
    return [
      { id: "home", group: "Navigate", label: "Home", hint: "#home", run: goTo("home") },
      ...sections.map((s) => ({ id: s.id, group: "Navigate", label: s.label, hint: `#${s.id}`, run: goTo(s.id) })),
      ...projects.map((p) => ({
        id: `project-${p.slug}`,
        group: "Projects",
        label: p.title,
        hint: "write-up",
        run: () => {
          close();
          location.hash = `projects/${p.slug}`; // Projects.astro opens the modal on hashchange
        },
      })),
      { id: "github", group: "Links", label: "Open GitHub", hint: "↗", run: openUrl(links.github) },
      { id: "linkedin", group: "Links", label: "Open LinkedIn", hint: "↗", run: openUrl(links.linkedin) },
      { id: "resume", group: "Links", label: "Open resume (PDF)", hint: "↗", run: openUrl(links.resume) },
      {
        id: "email",
        group: "Actions",
        label: "Copy email address",
        hint: email,
        run: async () => {
          try {
            await navigator.clipboard.writeText(email);
            setToast(`Copied ${email}`);
            setTimeout(close, 900);
          } catch {
            close();
            location.href = `mailto:${email}`;
          }
        },
      },
      {
        id: "theme",
        group: "Actions",
        label: "Toggle light / dark theme",
        run: () => {
          const root = document.documentElement;
          const next = root.dataset.theme === "light" ? "dark" : "light";
          root.dataset.theme = next;
          try {
            localStorage.setItem("theme", next);
          } catch {}
          close();
        },
      },
    ];
  }, [sections, projects, links, email]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.group} ${c.label} ${c.hint ?? ""}`.toLowerCase().includes(q));
  }, [commands, query]);

  // Global shortcut + nav button event (+ a click queued before hydration).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        dialog.current?.open ? close() : open();
      }
    };
    const onOpen = () => open();
    addEventListener("keydown", onKey);
    addEventListener("palette:open", onOpen);
    if (window.__paletteOpen) {
      window.__paletteOpen = false;
      open();
    }
    return () => {
      removeEventListener("keydown", onKey);
      removeEventListener("palette:open", onOpen);
    };
  }, []);

  // Keep the active option in view while arrowing through a long list.
  useEffect(() => {
    document.getElementById(`cmd-${results[active]?.id}`)?.scrollIntoView({ block: "nearest" });
  }, [active, results]);

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[active]?.run();
    }
  };

  let lastGroup = "";
  return (
    <dialog
      ref={dialog}
      aria-label="Command palette"
      className="palette m-auto mt-[12vh] w-[min(100%-2rem,560px)] overflow-hidden rounded-2xl border border-line bg-surface p-0 text-fg shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      onClick={(e) => e.target === dialog.current && close()}
    >
      <div className="flex items-center gap-3 border-b border-line px-4">
        <span className="font-mono text-sm text-accent-ink" aria-hidden="true">
          ›
        </span>
        <input
          ref={input}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onInputKey}
          placeholder="Jump to a section, project or link…"
          className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-muted"
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-list"
          aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
          aria-autocomplete="list"
          autoComplete="off"
          spellCheck={false}
        />
        <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[11px] text-muted">esc</kbd>
      </div>

      <ul id="palette-list" role="listbox" aria-label="Commands" className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
        {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">No matches for “{query}”</li>}
        {results.map((c, i) => {
          const header = c.group !== lastGroup ? c.group : null;
          lastGroup = c.group;
          return (
            <li key={c.id} role="presentation">
              {header && (
                <div className="px-3 pt-3 pb-1 font-mono text-[11px] tracking-wide text-muted" aria-hidden="true">
                  {header}
                </div>
              )}
              <div
                id={`cmd-${c.id}`}
                role="option"
                aria-selected={i === active}
                onMouseMove={() => setActive(i)}
                onClick={() => c.run()}
                className="flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-sm aria-selected:bg-bg aria-selected:text-accent-ink"
              >
                <span>{c.label}</span>
                {c.hint && <span className="truncate font-mono text-[11px] text-muted">{c.hint}</span>}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center justify-between border-t border-line px-4 py-2.5 font-mono text-[11px] text-muted" aria-live="polite">
        <span>{toast || "↑↓ to move · ↵ to select"}</span>
      </div>
    </dialog>
  );
}
