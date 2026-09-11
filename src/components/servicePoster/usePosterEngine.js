import { useEffect } from "react";
import gsap from "gsap";

/* Live service posters: shared engine (2026-09-11).
   Every poster runs in ONE mode, decided after mount:
     static  : SSR, no JS, reduced motion, or any runtime error. The SSR SVG
               IS the finished poster; no listeners, no ticker.
     pointer : fine pointer. Idle motion in view, cursor-driven over the card.
     ambient : touch. Motion only while in view, no hover.
   Posters never keep per-frame React state: GSAP tweens plain objects
   (quickTo, timelines) and each poster's tick() writes SVG attributes
   through `writer`, which skips unchanged values. One gsap.ticker callback
   serves every poster, and a poster leaves it the moment it scrolls out of
   view (IntersectionObserver, >= 15% visible to run). */

const running = new Set();
function tickAll(time, deltaMs) {
  const dt = Math.min(deltaMs, 50) / 1000;
  running.forEach((p) => p.step(dt));
}
function run(p) {
  if (!running.size) gsap.ticker.add(tickAll);
  running.add(p);
}
function halt(p) {
  running.delete(p);
  if (!running.size) gsap.ticker.remove(tickAll);
}

export function detectMode() {
  if (typeof window === "undefined" || !window.matchMedia) return "static";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "static";
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches ? "pointer" : "ambient";
}

// Rounded number for attribute strings (keeps writes comparable).
export const f = (n) => Math.round(n * 100) / 100;
export const clamp = (n, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));
export const q = (root, key) => root.querySelector(`[data-p="${key}"]`);
export const qa = (root, key) => [...root.querySelectorAll(`[data-p="${key}"]`)];

// Attribute writer that only touches the DOM when the value changed.
export function writer(el, attr = "transform") {
  let last;
  return (v) => {
    if (v !== last) {
      last = v;
      el.setAttribute(attr, v);
    }
  };
}

export default function usePosterEngine({ wrapRef, cardRef, create, onError }) {
  useEffect(() => {
    const wrap = wrapRef.current;
    const svg = wrap && wrap.querySelector("svg");
    if (!svg) return undefined;
    const mode = detectMode();
    if (mode === "static") return undefined;
    const card = (cardRef && cardRef.current) || wrap;

    let dead = false;
    let poster = null;
    let io = null;
    let ro = null;
    const ctx = gsap.context(() => {}, wrap);

    const teardown = () => {
      if (dead) return;
      dead = true;
      halt(entry);
      if (io) io.disconnect();
      if (ro) ro.disconnect();
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", markDirty);
      try {
        if (poster && poster.destroy) poster.destroy();
      } catch (e) {
        /* already failing: the static remount repaints the hero frame */
      }
      ctx.revert();
    };
    // Any runtime error drops this poster to static: stop everything, then
    // the wrapper remounts the untouched SSR markup.
    const guard = (fn) => (...args) => {
      if (dead) return undefined;
      try {
        return fn(...args);
      } catch (err) {
        teardown();
        if (onError) onError(err);
        return undefined;
      }
    };

    const pointer = { x: 0, y: 0 };
    const hover = { v: 0 };
    const raw = { x: 0, y: 0 };
    const api = { mode, pointer, hover, raw, inside: false, clock: 0 };
    let xTo;
    let yTo;
    let hTo;

    const entry = {
      step: guard((dt) => {
        api.clock += dt;
        poster.tick(api.clock);
      }),
    };

    // Layout reads happen on pointerenter and after scroll/resize only,
    // never inside the ticker.
    let rect = null;
    let dirty = true;
    const measure = () => {
      rect = wrap.getBoundingClientRect();
      dirty = false;
    };
    const markDirty = () => {
      dirty = true;
    };
    const onMove = guard((e) => {
      if (dirty || !rect) measure();
      raw.x = clamp((e.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5);
      raw.y = clamp((e.clientY - rect.top) / rect.height - 0.5, -0.5, 0.5);
      xTo(raw.x);
      yTo(raw.y);
    });
    const onEnter = guard((e) => {
      measure();
      api.inside = true;
      hTo(1);
      onMove(e);
      if (poster.enter) poster.enter(raw.x, raw.y);
    });
    const onLeave = guard(() => {
      api.inside = false;
      hTo(0);
      xTo(0);
      yTo(0);
      if (poster.leave) poster.leave();
    });

    guard(() => {
      ctx.add(() => {
        xTo = gsap.quickTo(pointer, "x", { duration: 0.5, ease: "power3.out" });
        yTo = gsap.quickTo(pointer, "y", { duration: 0.5, ease: "power3.out" });
        hTo = gsap.quickTo(hover, "v", { duration: 0.6, ease: "power2.out" });
        poster = create(svg, api);
      });

      io = new IntersectionObserver(
        guard(([e]) => {
          if (e.intersectionRatio >= 0.15) run(entry);
          else halt(entry);
        }),
        { threshold: [0, 0.15, 0.3] },
      );
      io.observe(wrap);

      if (mode === "pointer") {
        const opts = { passive: true };
        card.addEventListener("pointerenter", onEnter, opts);
        card.addEventListener("pointermove", onMove, opts);
        card.addEventListener("pointerleave", onLeave, opts);
        window.addEventListener("scroll", markDirty, opts);
        ro = new ResizeObserver(markDirty);
        ro.observe(wrap);
      }
    })();

    return teardown;
  }, [wrapRef, cardRef, create, onError]);
}
