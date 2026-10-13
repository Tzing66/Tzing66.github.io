// Crosshair + tooltip for LineChart.astro: snaps to the nearest point on pointer move and
// steps with ←/→ on keyboard focus. Values lead, series labels follow (text via textContent).
type Row = [x: number, y1: number, y2: number, label: string, v1: number, v2: number];

const fmt = (v: number) => Math.round(v).toLocaleString("en-US");

export function initLineCharts(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>("[data-line-chart]:not([data-ready])").forEach((fig) => {
    fig.dataset.ready = "";
    const rows = JSON.parse(fig.dataset.points!) as Row[];
    const labels = JSON.parse(fig.dataset.labels!) as [string, string];
    const plot = fig.querySelector<HTMLElement>("[data-plot]")!;
    const cross = plot.querySelector<HTMLElement>("[data-crosshair]")!;
    const dots = [0, 1].map((i) => plot.querySelector<HTMLElement>(`[data-dot="${i}"]`)!);
    const tip = plot.querySelector<HTMLElement>("[data-tooltip]")!;
    const live = fig.querySelector<HTMLElement>("[data-live]");
    let current = -1;

    const show = (i: number) => {
      current = Math.max(0, Math.min(rows.length - 1, i));
      const [x, y1, y2, label, v1, v2] = rows[current];
      const left = `${x * 100}%`;
      cross.style.left = left;
      cross.classList.remove("hidden");
      [y1, y2].forEach((y, k) => {
        dots[k].style.left = left;
        dots[k].style.top = `${(1 - y) * 100}%`;
        dots[k].classList.remove("hidden");
      });

      tip.replaceChildren();
      const head = document.createElement("p");
      head.className = "mb-1 font-mono text-[10px] text-muted";
      head.textContent = label;
      tip.append(head);
      // Larger value first so the readout matches the vertical order of the dots.
      const lines = [
        { v: v1, name: labels[0], color: "var(--series-1)" },
        { v: v2, name: labels[1], color: "var(--series-2)" },
      ].sort((a, b) => b.v - a.v);
      for (const l of lines) {
        const row = document.createElement("p");
        row.className = "flex items-center gap-2 whitespace-nowrap";
        const key = document.createElement("span");
        key.className = "h-0.5 w-3 shrink-0 rounded-full";
        key.style.background = l.color;
        const val = document.createElement("span");
        val.className = "font-semibold text-fg tabular-nums";
        val.textContent = fmt(l.v);
        const name = document.createElement("span");
        name.className = "text-muted";
        name.textContent = l.name;
        row.append(key, val, name);
        tip.append(row);
      }
      // Keep the tooltip inside the plot: flip to the left of the crosshair past the midpoint.
      tip.classList.remove("hidden");
      tip.style.left = x > 0.55 ? "" : `calc(${left} + 10px)`;
      tip.style.right = x > 0.55 ? `calc(${(1 - x) * 100}% + 10px)` : "";
      if (live) live.textContent = `${label}: ${labels[0]} ${fmt(v1)}, ${labels[1]} ${fmt(v2)}`;
    };

    const hide = () => {
      current = -1;
      [cross, tip, ...dots].forEach((el) => el.classList.add("hidden"));
    };

    const nearest = (clientX: number) => {
      const r = plot.getBoundingClientRect();
      const fx = (clientX - r.left) / r.width;
      let best = 0;
      rows.forEach((row, i) => {
        if (Math.abs(row[0] - fx) < Math.abs(rows[best][0] - fx)) best = i;
      });
      return best;
    };

    plot.addEventListener("pointermove", (e) => show(nearest(e.clientX)));
    plot.addEventListener("pointerleave", () => document.activeElement !== plot && hide());
    plot.addEventListener("focus", () => show(current < 0 ? rows.length - 1 : current));
    plot.addEventListener("blur", hide);
    plot.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        show(current + (e.key === "ArrowRight" ? 1 : -1));
      } else if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        show(e.key === "Home" ? 0 : rows.length - 1);
      }
    });
  });
}
