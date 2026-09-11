import gsap from "gsap";
import { clamp, f, q, qa, writer } from "../usePosterEngine";

/* Poster 03, AI & Automation: "Always on." A toggle that never turns off
   and a grid of 40 dots. A flick of the knob fires a ripple through the
   dots in rings; near the cursor, dots swell. */
const COLS = 8;
const ROWS = 5;
const DOTS = [];
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) DOTS.push({ x: 220 + c * 80, y: 500 + r * 70 });
}
const FLASH = 0.4;
const STEP = 0.07; // seconds per 80 units of distance

export function Art() {
  return (
    <>
      <rect width="1000" height="1000" className="sp-f-ink" />
      <rect data-p="track" x="250" y="170" width="500" height="240" rx="120" className="sp-f-pink" />
      <g transform="translate(630 290)">
        <g data-p="knob">
          <circle r="95" className="sp-f-cream" />
        </g>
      </g>
      {DOTS.map((d, i) => (
        <g key={i} transform={`translate(${d.x} ${d.y})`}>
          <g data-p="dot">
            <circle r="20" className="sp-f-cream" />
            <circle data-p="dotpink" r="20" className="sp-f-pink" />
          </g>
        </g>
      ))}
    </>
  );
}

export function create(svg, api) {
  const wKnob = writer(q(svg, "knob"));
  const wTrack = writer(q(svg, "track"), "fill-opacity");
  const dots = qa(svg, "dot").map((el, i) => ({
    ...DOTS[i],
    w: writer(el),
    wf: writer(qa(el, "dotpink")[0], "fill-opacity"),
  }));
  // Ring delays per origin, computed once on first use.
  const delays = new Map();
  const delaysFrom = (o) => {
    if (!delays.has(o)) {
      delays.set(o, DOTS.map((d) => (Math.hypot(d.x - DOTS[o].x, d.y - DOTS[o].y) / 80) * STEP));
    }
    return delays.get(o);
  };

  const st = { k: 0, tr: 1 };
  let ripple = null; // { t0, delays, end }
  let clock = 0;
  let next = 1.5;
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  const fire = (origin) => {
    gsap.killTweensOf(st);
    gsap
      .timeline()
      .to(st, { k: -260, tr: 0.45, duration: 0.13, ease: "power2.in" })
      .to(st, { k: 0, tr: 1, duration: 0.17, ease: "power3.out" });
    const d = delaysFrom(origin);
    ripple = { t0: clock + 0.12, d, end: clock + 0.12 + Math.max(...d) + FLASH };
  };
  const nearest = (nx, ny) => {
    const x = (nx + 0.5) * 1000;
    const y = (ny + 0.5) * 1000;
    let best = 0;
    let bd = Infinity;
    DOTS.forEach((p, i) => {
      const dd = (p.x - x) ** 2 + (p.y - y) ** 2;
      if (dd < bd) { bd = dd; best = i; }
    });
    return best;
  };

  return {
    enter(nx, ny) {
      fire(nearest(nx, ny));
    },
    tick(t) {
      clock = t;
      if (api.mode === "ambient" && t >= next) {
        next = t + 4.5;
        fire(Math.floor(rand() * DOTS.length));
      }
      if (ripple && t > ripple.end) ripple = null;
      const h = api.hover.v;
      const cx = (api.pointer.x + 0.5) * 1000;
      const cy = (api.pointer.y + 0.5) * 1000;
      dots.forEach((dot, i) => {
        let s = 1;
        let op = 1;
        if (ripple) {
          const u = (t - ripple.t0 - ripple.d[i]) / FLASH;
          if (u > 0 && u < 1) {
            const b = Math.sin(Math.PI * u);
            op = 1 - b;
            s = 1 + 0.3 * b;
          }
        }
        if (h > 0.01) {
          const sw = 1 + 0.5 * clamp(1 - Math.hypot(dot.x - cx, dot.y - cy) / 150) * h;
          if (sw > s) s = sw;
        }
        dot.w(`scale(${f(s)})`);
        dot.wf(String(f(op)));
      });
      wKnob(`translate(${f(st.k)} 0)`);
      wTrack(String(f(st.tr)));
    },
  };
}
