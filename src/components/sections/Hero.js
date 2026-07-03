import { useEffect, useState } from "react";
import { HashLink } from "react-router-hash-link";
import WelcomeTyped from "./WelcomeTyped";
import CursorWave from "../ui/CursorWave";
import useReducedMotion from "../../hooks/useReducedMotion";

import "../../styles/components/hero.scss";

/* Brand shape + color config for the Hero background.
   Repeating shapes in the array biases the random distribution —
   square and asterisk are the textural backbone, the SCS star is the
   brand mark and gets a slight boost over circle (the accent). */
const HERO_SHAPES = [
  "square",
  "star",
  "asterisk",
  "square",
  "asterisk",
  "star",
  "circle",
];
const HERO_COLORS = [
  "#dab8ff",
  "#ff834a",
  "#d99cff",
  "#ff8f63",
  "#f0d7ff",
  "#FEF7ED",
];

const Hero = () => {
  const reducedMotion = useReducedMotion();
  // `revealed` controls staggered fade-in for sub + CTAs.
  // Reduced-motion users skip the stagger and see everything immediately.
  const [revealed, setRevealed] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setRevealed(true);
      return;
    }
    const t = setTimeout(() => setRevealed(true), 1200);
    return () => clearTimeout(t);
  }, [reducedMotion]);

  return (
    <section id="hero" aria-label="Switch Case Studio introduction">
      <div className="hero-inner">
        {!reducedMotion && (
          <div className="cursorwave-bg" aria-hidden="true">
            <CursorWave
              shapes={HERO_SHAPES}
              colors={HERO_COLORS}
              backgroundColor="#000000"
              cellSize={48}
              influenceRadiusVmin={28}
              minPeakScale={1.2}
              maxPeakScale={2.8}
              burstSpeed={1400}
              burstThickness={220}
            />
          </div>
        )}

        <div className="hero-content">
          <h1 className="hero-headline" data-cursor-wave-mask>
            <span className="hero-line">
              {"We "}
              <WelcomeTyped />
            </span>
            <span className="hero-line">websites &amp; stores</span>
            <span className="hero-line hero-line--accent">
              that actually perform.
            </span>
          </h1>

          <p
            className={`hero-sub ${revealed ? "is-visible" : ""}`}
            data-cursor-wave-mask
          >
            <span className="hero-sub__desktop">
              Websites, e-commerce stores, and apps &mdash; built from scratch
              by a design-led studio that takes performance seriously.
            </span>
            <span className="hero-sub__mobile">
              Built to perform. Designed to convert.
            </span>
          </p>

          <div
            className={`hero-ctas ${revealed ? "is-visible" : ""}`}
            data-cursor-wave-mask
          >
            {/* Booking is the business goal, so it gets the solid primary
                treatment (2026-07 design refresh, DESIGN_AUDIT P0-1). This
                deliberately REVERSES the 2026-06 pre-pitch decision (S3 in
                .audit/summary.md) that made "See Our Work" primary for a
                portfolio-first pitch — the goal is now booked calls. */}
            <a
              href="https://calendar.app.google/83UCJjis2FHUrr1s6"
              className="hero-cta hero-cta--primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a Free Call
              <span className="cta-arrow" aria-hidden="true">
                &rarr;
              </span>
            </a>

            <HashLink
              to="/#projects"
              smooth
              className="hero-cta hero-cta--secondary"
            >
              See Our Work
              <span className="cta-arrow cta-arrow--down" aria-hidden="true">
                &darr;
              </span>
            </HashLink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
