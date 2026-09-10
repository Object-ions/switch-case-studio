import { useEffect, useRef } from "react";
import { HashLink } from "react-router-hash-link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useReducedMotion from "../../hooks/useReducedMotion";
import {
  DUR_SLOW,
  EASE_OUT_SOFT,
  REVEAL_STAGGER,
  REVEAL_SAFETY_DELAY,
} from "../../animation/motionTokens";

gsap.registerPlugin(ScrollTrigger);

// Crossword letters for the h1: the row reads across, the column hangs
// under the row's first letter (the shared D).
const HERO_ROW = "DEVELOPMENT".split("");
const HERO_COL = "ESIGN".split("");

import "../../styles/components/hero.scss";

/* The studio ident: 4.5s of hard-cut plates that settle on the wordmark.
   Rendered from ~/Desktop/scs-ident (Remotion, private: licensed fonts);
   only the encoded video ships here (public/ident/, limited-range BT.709:
   full-range VP9 fails in Chrome's decoder mid-stream). The poster IS the
   final frame, so a paused or blocked video shows what the video ends on.
   It loops: 2s on the wordmark, then the plates run again. */

const Hero = () => {
  const reducedMotion = useReducedMotion();
  const identRef = useRef(null);
  const rootRef = useRef(null);

  /* Ink-fit the crossword row. A flex gap spaces letter BOXES; the visible
     gap between two letters is that plus both side bearings, which differ
     per glyph (Inter Light: ~0.03em on E, ~0.09em on O), so equal steps read
     as unequal gaps. After the fonts load, measure each glyph's ink edges on
     a canvas and set a per-letter margin (in em, so it survives the vh-based
     resize) that makes every ink gap exactly --gap, the same value the
     stacked column uses. Layout, not motion: runs under reduced motion too. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof document === "undefined" || !document.fonts) return undefined;
    const row = root.querySelector(".hero-row");
    if (!row) return undefined;
    const letters = Array.from(row.children);
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      const cs = getComputedStyle(row);
      const size = parseFloat(cs.fontSize);
      const gapEm = parseFloat(getComputedStyle(root.querySelector(".hero-headline")).getPropertyValue("--gap")) || 0.32;
      const ctx = document.createElement("canvas").getContext("2d");
      ctx.font = `${cs.fontWeight} ${size}px ${cs.fontFamily}`;
      const ink = letters.map((el) => {
        const ch = el.firstChild?.textContent || "";
        const m = ctx.measureText(ch);
        // canvas: actualBoundingBoxLeft is positive when ink starts LEFT of the origin
        return { lsb: -m.actualBoundingBoxLeft / size, rsb: (m.width - m.actualBoundingBoxRight) / size };
      });
      row.style.gap = "0px";
      letters.forEach((el, i) => {
        const next = ink[i + 1];
        if (!next) return;
        el.style.marginRight = `${(gapEm - ink[i].rsb - next.lsb).toFixed(4)}em`;
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  /* Copy motion. Static HTML ships visible; the hide happens at runtime only
     (never-invisible rule), then the four corner blocks rise in a stagger
     half a second after mount so the ident's first plates lead. On scroll-out
     the blocks drift apart, scrubbed. The entrance owns `yPercent`, the
     scrub owns `y`: separate transform components, so one tween per
     property holds. The video is never touched. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const items = gsap.utils.toArray(".hero-top, .hero-note, .hero-scroll", root);
    if (reducedMotion) {
      gsap.set(items, { clearProps: "all" });
      return undefined;
    }
    const ctx = gsap.context(() => {
      gsap.set(items, { autoAlpha: 0, yPercent: 6 });
      gsap.to(items, {
        autoAlpha: 1,
        yPercent: 0,
        duration: DUR_SLOW,
        stagger: REVEAL_STAGGER,
        ease: EASE_OUT_SOFT,
        delay: 0.5,
        overwrite: "auto",
      });
      const safety = gsap.delayedCall(REVEAL_SAFETY_DELAY, () => {
        if (
          !items.some((el) => gsap.isTweening(el)) &&
          items.some((el) => gsap.getProperty(el, "opacity") < 1)
        ) {
          gsap.set(items, { autoAlpha: 1, yPercent: 0 });
        }
      });

      const scrub = { trigger: root, start: "top top", end: "bottom top", scrub: true };
      gsap.to(root.querySelector(".hero-top"), { y: -60, ease: "none", scrollTrigger: scrub });
      gsap.to(gsap.utils.toArray(".hero-note, .hero-scroll", root), {
        y: 60,
        ease: "none",
        scrollTrigger: { ...scrub },
      });

      return () => safety.kill();
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  useEffect(() => {
    const video = identRef.current?.querySelector("video");
    if (!video) return undefined;
    video.muted = true;
    if (reducedMotion) {
      // No motion: park on the end card (the wordmark) instead of playing.
      const toEnd = () => {
        video.pause();
        if (Number.isFinite(video.duration)) {
          video.currentTime = Math.max(0, video.duration - 0.05);
        }
      };
      if (video.readyState >= 1) toEnd();
      else video.addEventListener("loadedmetadata", toEnd, { once: true });
      return () => video.removeEventListener("loadedmetadata", toEnd);
    }
    const p = video.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
    return undefined;
  }, [reducedMotion]);

  return (
    <section id="hero" aria-label="Switch Case Studio introduction" ref={rootRef}>
      <div className="hero-frame">
        <div className="hero-top">
          {/* Crossword lockup (owner, 2026-09-10): "DEVELOPMENT" runs across,
              "DESIGN" runs down from the shared D. Letters sit at their natural
              widths with ONE gap value between ink boxes, and each letter's
              box is trimmed to cap height, so the vertical gap is the same
              distance as the horizontal one (square cells were not: an I and
              an M got the same cell). The column hangs off the D itself, so it
              is centred under it with no measuring. Single h1, readable label,
              letters aria-hidden. */}
          <h1 className="hero-headline" aria-label="Design and development">
            <span className="hero-row" aria-hidden="true">
              {HERO_ROW.map((ch, i) => (
                <span
                  key={i}
                  className={`hero-cell${i === 0 ? " hero-cell--anchor" : ""}`}
                >
                  {ch}
                  {i === 0 && (
                    <span className="hero-col">
                      {HERO_COL.map((c, j) => (
                        <span key={j} className="hero-cell">
                          {c}
                        </span>
                      ))}
                    </span>
                  )}
                </span>
              ))}
            </span>
          </h1>
        </div>

        <div className="hero-ident" ref={identRef}>
          {/* Static HTML must carry autoplay+muted+playsinline so phones start
              the ident before hydration; the effect above only re-asserts
              muted and handles reduced motion. */}
          <video
            className="hero-ident__video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/ident/ident-16x9-poster.webp"
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src="/ident/ident-1x1.webm" type="video/webm" media="(max-width: 768px)" />
            <source src="/ident/ident-1x1.mp4" type="video/mp4" media="(max-width: 768px)" />
            <source src="/ident/ident-16x9.webm" type="video/webm" />
            <source src="/ident/ident-16x9.mp4" type="video/mp4" />
          </video>
        </div>

        <p className="hero-note hero-note--left">
          Design, code and <span className="caps-trim">AI</span> in one room,
          so the site, the store and the assistant are built by the people
          who keep them running.
        </p>

        <HashLink to="/#projects" smooth className="hero-scroll">
          Scroll
          <span className="hero-scroll__arrow" aria-hidden="true">
            &darr;
          </span>
        </HashLink>

        <p className="hero-note hero-note--right">
          Every case study here ships its own before and after: page weight
          and load time, measured on the live site and dated.
        </p>
      </div>
    </section>
  );
};

export default Hero;
