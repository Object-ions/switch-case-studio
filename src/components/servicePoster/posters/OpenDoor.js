import gsap from "gsap";
import { clamp, f, q, writer } from "../usePosterEngine";

/* Poster 02, Web Development: "Every page is a door." A browser window on
   the horizon whose page is a door hinged on its right edge. 2D only: the
   swing is scaleX + skewY about the hinge, written as one transform string
   shared by the SSR frame and the runtime. */
const HX = 710;
const HY = 472;
const REST = 0.6;
export const doorT = (o) =>
  `translate(${HX} ${HY}) skewY(${f(-14 * o)}) scale(${f(1 - 0.8 * o)} 1) translate(-${HX} -${HY})`;
const spillT = (o, skew) =>
  `translate(${HX} 640) skewX(${f(skew)}) scale(${f(0.35 + 0.75 * o)} 1) translate(-${HX} -640)`;
const CURSOR = { x: 600, y: 470 };

export function Art() {
  return (
    <>
      <rect width="1000" height="640" className="sp-f-mint" />
      <rect y="640" width="1000" height="360" className="sp-f-cream" />
      <g data-p="spill" transform={spillT(REST, 0)}>
        <polygon points="290,640 710,640 760,1000 160,1000" className="sp-f-pink" />
      </g>
      <rect x="280" y="300" width="440" height="340" className="sp-f-pink" />
      <rect data-p="door" x="290" y="305" width="420" height="335" className="sp-f-terra" transform={doorT(REST)} />
      <rect x="280" y="250" width="440" height="390" fill="none" className="sp-s-ink" strokeWidth="10" />
      <rect x="280" y="250" width="440" height="52" className="sp-f-ink" />
      <circle cx="312" cy="276" r="9" className="sp-f-cream" />
      <circle cx="342" cy="276" r="9" className="sp-f-cream" />
      <circle cx="372" cy="276" r="9" className="sp-f-cream" />
      <path d="M0 640H1000" className="sp-s-ink" strokeWidth="4" />
      <g transform={`translate(${CURSOR.x} ${CURSOR.y})`}>
        <g data-p="cursor">
          <path d="M0 0L0 64L17 49L28 76L40 71L29 45L52 45Z" className="sp-f-ink sp-s-cream" strokeWidth="4" strokeLinejoin="round" />
        </g>
      </g>
    </>
  );
}

export function create(svg, api) {
  const door = q(svg, "door");
  const cursorEl = q(svg, "cursor");
  const wDoor = writer(door);
  const wSpill = writer(q(svg, "spill"));
  const wCursor = writer(cursorEl);
  const wCursorOp = writer(cursorEl, "opacity");

  // Click ripple: an effect element, created client-side only.
  const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  ring.setAttribute("r", "40");
  ring.setAttribute("fill", "none");
  ring.setAttribute("stroke-width", "5");
  ring.setAttribute("class", "sp-s-ink");
  ring.setAttribute("opacity", "0");
  svg.appendChild(ring);
  const wRing = writer(ring);
  const wRingOp = writer(ring, "opacity");

  const st = { o: REST, cx: 0, cy: 0, rs: 0, ro: 0 };
  let tl = null;
  let next = 1.5;

  const play = (t) => {
    next = t + 6;
    st.o = REST + 0.05 * Math.sin(t * 1.6);
    tl = gsap
      .timeline({ onComplete: () => { tl = null; } })
      .to(st, { cx: -150, cy: 40, duration: 0.8, ease: "power2.inOut" })
      .set(st, { rs: 0.2, ro: 1 })
      .to(st, { rs: 1.8, ro: 0, duration: 0.5, ease: "power2.out" })
      .to(st, { o: 0.4, duration: 0.25, ease: "power2.in" }, "<")
      .to(st, { o: 0.95, duration: 0.7, ease: "power2.out" })
      .to(st, { cx: 0, cy: 0, duration: 0.9, ease: "power2.inOut" }, "+=0.4")
      .to(st, { o: REST, duration: 1, ease: "power2.inOut" }, "<");
  };

  return {
    tick(t) {
      const h = api.hover.v;
      const breath = REST + 0.05 * Math.sin(t * 1.6) * (1 - h);
      let o;
      if (tl) {
        o = st.o;
      } else {
        // Proximity to the door (centre ~ (0, -0.03) normalised).
        const d = Math.hypot(api.pointer.x, api.pointer.y + 0.03);
        o = breath + 0.35 * clamp(1 - d / 0.5) * h;
      }
      if (api.mode === "ambient" && !tl && t >= next) play(t);

      wDoor(doorT(o));
      wSpill(spillT(o, api.pointer.x * 40 * h));
      wCursor(`translate(${f(st.cx)} ${f(st.cy)})`);
      wCursorOp(String(f(1 - h)));
      wRing(`translate(${CURSOR.x + st.cx} ${CURSOR.y + st.cy}) scale(${f(st.rs)})`);
      wRingOp(String(f(st.ro)));
    },
    destroy() {
      ring.remove();
    },
  };
}
