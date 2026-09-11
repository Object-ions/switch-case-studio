import gsap from "gsap";
import { clamp, f, q, qa, writer } from "../usePosterEngine";

/* Poster 04, SEO & AI Search: "Be the answer." A results stack with your
   site in slot 1 and a chat bubble citing it. The replay knocks your bar
   to slot 4 and climbs it back; bars only ever move on y (slot index x
   pitch) plus a small magnetic lean toward the cursor. */
const TOP = 150;
const PITCH = 88;
const BAR_H = 58;
const WIDTHS = [640, 720, 560, 690, 500, 610];
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

export function Art() {
  return (
    <>
      <rect width="1000" height="1000" className="sp-f-terra" />
      {WIDTHS.map((w, i) => (
        <g key={i} data-p="bar">
          <rect x="110" y={TOP + i * PITCH} width={w} height={BAR_H} rx="10" className={i ? "sp-f-ink" : "sp-f-cream"} />
          {i === 0 && (
            <text x="140" y={TOP + 39} fontFamily={MONO} fontSize="28" className="sp-f-ink">
              yoursite.com
            </text>
          )}
        </g>
      ))}
      <g transform="translate(700 780)">
        <g data-p="bubble">
          <rect x="-150" y="-55" width="300" height="110" rx="26" className="sp-f-cream" />
          <path d="M-120 45L-150 85L-80 50Z" className="sp-f-cream" />
          <text x="-118" y="15" fontFamily={MONO} fontSize="40" fontWeight="700" className="sp-f-ink">
            <tspan data-p="mark">[1]</tspan>
            <tspan> yours.</tspan>
          </text>
        </g>
      </g>
    </>
  );
}

export function create(svg, api) {
  const bars = qa(svg, "bar").map((el, i) => ({ y: 0, cy: TOP + i * PITCH + BAR_H / 2, w: writer(el) }));
  const wBubble = writer(q(svg, "bubble"));
  const wMark = writer(q(svg, "mark"), "opacity");
  const st = { s: 1, m: 1 };
  let tl = null;
  let armed = true;
  let next = 1.5;

  const play = () => {
    const [you, ...rest] = bars;
    const shuffled = rest.slice(0, 3);
    tl = gsap
      .timeline({ onComplete: () => { tl = null; } })
      .to(st, { s: 0, m: 0, duration: 0.22, ease: "back.in(2)" })
      .to(you, { y: 3 * PITCH, duration: 0.5, ease: "back.out(1.6)" })
      .to(shuffled, { y: -PITCH, duration: 0.5, ease: "back.out(1.6)", stagger: 0.04 }, "<")
      .to(you, { y: 0, duration: 0.5, ease: "back.out(1.4)" }, "+=0.12")
      .to(shuffled, { y: 0, duration: 0.5, ease: "back.out(1.4)", stagger: 0.04 }, "<")
      .to(st, { s: 1, duration: 0.3, ease: "back.out(2)" }, "-=0.1")
      .to(st, { m: 1, duration: 0.15 });
  };

  return {
    enter() {
      if (armed && !tl) {
        armed = false;
        play();
      }
    },
    leave() {
      armed = true;
    },
    tick(t) {
      if (api.mode === "ambient" && !tl && t >= next) {
        next = t + 6;
        play();
      }
      const h = api.hover.v;
      const py = (api.pointer.y + 0.5) * 1000;
      bars.forEach((b) => {
        const fall = clamp(1 - Math.abs(b.cy + b.y - py) / 250);
        b.w(`translate(${f(api.pointer.x * 60 * fall * h)} ${f(b.y)})`);
      });
      wBubble(`scale(${f(st.s)})`);
      wMark(String(f(st.m)));
    },
  };
}
