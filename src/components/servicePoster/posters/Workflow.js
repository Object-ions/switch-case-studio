import { clamp, f, q, qa, writer } from "../usePosterEngine";

/* Poster 03, AI & Automation: "Always on." A workflow that never stops: a
   trigger feeds the AI node, which fans out to three outcomes, one packet
   at a time, forever. Two cycles run half a period apart so something is
   always in flight. frame(u) is the single source of truth: the SSR poster
   is frame(U0), the runtime is frame(u) as u advances. Hover: the flow
   speeds up and the node under the cursor lifts. */
const IN = { x: 190, y: 500 };
const AI = { x: 500, y: 500 };
const OUTS = [
  { x: 810, y: 310, fill: "sp-f-terra", icon: "cal" },
  { x: 810, y: 500, fill: "sp-f-mint", icon: "check" },
  { x: 810, y: 690, fill: "sp-f-cream", icon: "chat" },
];
const NODES = [IN, AI, ...OUTS];
const P_IN = [[260, 500], [320, 500], [340, 500], [400, 500]];
const P_OUT = OUTS.map((o) => [[600, 500], [690, 500], [660, o.y], [750, o.y]]);
const PERIOD = 2.4; // seconds per cycle at rest
const U0 = 0.2;
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

const bez = ([a, b, c, d], t) => {
  const s = 1 - t;
  const k = [s * s * s, 3 * s * s * t, 3 * s * t * t, t * t * t];
  return [k[0] * a[0] + k[1] * b[0] + k[2] * c[0] + k[3] * d[0], k[0] * a[1] + k[1] * b[1] + k[2] * c[1] + k[3] * d[1]];
};
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const bump = (c, lo, hi) => (c > lo && c < hi ? Math.sin((Math.PI * (c - lo)) / (hi - lo)) : 0);
const dPath = ([a, b, c, d]) => `M${a[0]} ${a[1]}C${b[0]} ${b[1]} ${c[0]} ${c[1]} ${d[0]} ${d[1]}`;

// Everything that moves, at phase u in [0, 1).
function frame(u) {
  const out = { pin: { t: 0, o: 0 }, pout: { t: 0, o: 0 }, pulse: [0, 0, 0, 0, 0] };
  [u, (u + 0.5) % 1].forEach((c) => {
    if (c < 0.45) out.pin = { t: ease(c / 0.45), o: 1 };
    if (c >= 0.55) out.pout = { t: ease((c - 0.55) / 0.45), o: 1 };
    const land = bump(c, 0.4, 0.58);
    const arrive = Math.max(bump(c, 0.94, 1.0001), bump(c, -0.0001, 0.06));
    out.pulse[0] = Math.max(out.pulse[0], bump(c, -0.0001, 0.08));
    out.pulse[1] = Math.max(out.pulse[1], land);
    for (let i = 2; i < 5; i++) out.pulse[i] = Math.max(out.pulse[i], arrive);
  });
  return out;
}
const pktT = (p, t) => {
  const [x, y] = bez(p, t);
  return `translate(${f(x)} ${f(y)})`;
};
const nodeT = (s, lift = 0) => `translate(0 ${f(-lift)}) scale(${f(s)})`;

function Icon({ kind }) {
  const s = { fill: "none", className: "sp-s-ink", strokeWidth: 7, strokeLinecap: "round", strokeLinejoin: "round" };
  if (kind === "cal") {
    return (
      <>
        <rect x="-26" y="-22" width="52" height="46" rx="6" {...s} />
        <path d="M-26 -6H26M-12 -30V-16M12 -30V-16" {...s} />
      </>
    );
  }
  if (kind === "check") return <path d="M-22 2L-6 18L24 -16" {...s} />;
  return <path d="M-26 -20H26V12H-2L-16 26V12H-26Z" {...s} />;
}

export function Art() {
  const fr = frame(U0);
  return (
    <>
      <rect width="1000" height="1000" className="sp-f-ink" />
      <g transform="translate(70 150)">
        <rect width="196" height="52" rx="26" className="sp-f-pink" />
        <circle data-p="live" cx="30" cy="26" r="9" className="sp-f-ink" />
        <text x="52" y="35" fontFamily={MONO} fontSize="24" fontWeight="700" className="sp-f-ink">
          RUNNING
        </text>
      </g>

      <path d={dPath(P_IN)} fill="none" className="sp-s-cream" strokeOpacity="0.3" strokeWidth="6" />
      {P_OUT.map((p, i) => (
        <path key={i} d={dPath(p)} fill="none" className="sp-s-cream" strokeOpacity="0.3" strokeWidth="6" />
      ))}

      <g transform={`translate(${IN.x} ${IN.y})`}>
        <g data-p="node" transform={nodeT(1 + 0.08 * fr.pulse[0])}>
          <rect x="-70" y="-70" width="140" height="140" rx="28" className="sp-f-cream" />
          <rect x="-34" y="-24" width="68" height="48" rx="6" fill="none" className="sp-s-ink" strokeWidth="7" />
          <path d="M-34 -20L0 6L34 -20" fill="none" className="sp-s-ink" strokeWidth="7" strokeLinejoin="round" />
        </g>
      </g>
      <g transform={`translate(${AI.x} ${AI.y})`}>
        <g data-p="node" transform={nodeT(1 + 0.08 * fr.pulse[1])}>
          <rect x="-100" y="-100" width="200" height="200" rx="40" className="sp-f-pink" />
          <g data-p="spark">
            <path d="M0 -58C6 -18 18 -6 58 0C18 6 6 18 0 58C-6 18 -18 6 -58 0C-18 -6 -6 -18 0 -58Z" className="sp-f-ink" />
          </g>
        </g>
      </g>
      {OUTS.map((o, i) => (
        <g key={i} transform={`translate(${o.x} ${o.y})`}>
          <g data-p="node" transform={nodeT(1 + 0.08 * fr.pulse[i + 2])}>
            <rect x="-60" y="-60" width="120" height="120" rx="24" className={o.fill} />
            <Icon kind={o.icon} />
          </g>
        </g>
      ))}

      <g data-p="pin" transform={pktT(P_IN, fr.pin.t)} opacity={fr.pin.o}>
        <circle r="13" className="sp-f-cream" />
      </g>
      {P_OUT.map((p, i) => (
        <g key={i} data-p="pout" transform={pktT(p, fr.pout.t)} opacity={fr.pout.o}>
          <circle r="13" className="sp-f-pink" />
        </g>
      ))}
    </>
  );
}

export function create(svg, api) {
  const nodes = qa(svg, "node").map((el, i) => ({ ...NODES[i], w: writer(el), lift: 0 }));
  const wPin = writer(q(svg, "pin"));
  const wPinOp = writer(q(svg, "pin"), "opacity");
  const pouts = qa(svg, "pout").map((el) => ({ w: writer(el), wo: writer(el, "opacity") }));
  const wSpark = writer(q(svg, "spark"));
  const wLive = writer(q(svg, "live"), "opacity");

  let u = U0;
  let rate = 1;
  let spin = 0;
  let last = null;

  return {
    enter() {
      rate = 3.5;
    },
    tick(t) {
      const h = api.hover.v;
      // dt from the engine's clock, capped like the engine's.
      const dt = last === null ? 0 : Math.min(0.05, Math.max(0, t - last));
      last = t;
      const target = 1 + 1.4 * h;
      rate += (target - rate) * Math.min(1, dt * 3);
      u = (u + (dt * rate) / PERIOD) % 1;
      spin = (spin + dt * rate * 30) % 360;

      const fr = frame(u);
      const px = (api.pointer.x + 0.5) * 1000;
      const py = (api.pointer.y + 0.5) * 1000;
      nodes.forEach((n, i) => {
        const near = h > 0.01 ? clamp(1 - Math.hypot(px - n.x, py - n.y) / 160) * h : 0;
        n.lift += (near * 14 - n.lift) * Math.min(1, dt * 10);
        n.w(nodeT(1 + 0.08 * fr.pulse[i], n.lift));
      });
      wPin(pktT(P_IN, fr.pin.t));
      wPinOp(String(fr.pin.o));
      pouts.forEach((p, i) => {
        p.w(pktT(P_OUT[i], fr.pout.t));
        p.wo(String(fr.pout.o));
      });
      wSpark(`rotate(${f(spin)})`);
      wLive(String(f(0.35 + 0.65 * Math.abs(Math.cos(t * 2.2)))));
    },
  };
}
