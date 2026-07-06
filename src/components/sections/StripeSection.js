import React, { useRef } from 'react';
import useIsomorphicLayoutEffect from '../../hooks/useIsomorphicLayoutEffect';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../../styles/components/stripeSection.scss';

gsap.registerPlugin(ScrollTrigger);

export default function GradientStripe({
  // Responsive default: min 160px, scales with viewport, caps at 420px
  size = 'clamp(160px, 24vw, 420px)',
  // Back-compat: if `height` is passed, use it as `size`
  height,
  duration = 5.9,
  travel = 60, // reserved for future use
  orbSrc = '/assets/orb@768.avif',
  fetchPriority = 'high',
}) {
  const stripeRef = useRef(null);
  const orbRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    const stripe = stripeRef.current;
    const orb = orbRef.current;
    if (!stripe || !orb) return;

    const reduce = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    )?.matches;
    if (reduce) {
      // Leave the transform to the CSS translate(-50%,-50%) centering.
      gsap.set(orb, { clearProps: 'transform' });
      return;
    }

    // Claim the whole transform in GSAP terms before any tween runs: the
    // CSS translate(-50%,-50%) parses into a PIXEL matrix (CLAUDE.md
    // StaggeredMenu rule), so a later yPercent tween silently drops the
    // vertical centering. xPercent stays 0 to preserve the shipped drift
    // geometry (the x tween has always replaced the horizontal offset).
    gsap.set(orb, { xPercent: 0, x: 0, yPercent: -50, y: 0 });

    const build = () => {
      const W = stripe.clientWidth;
      const max = W / 2; // move from half-left offscreen to half-right offscreen
      return gsap.fromTo(
        orb,
        { x: -max },
        { x: max, duration, ease: 'power2.inOut', repeat: -1, yoyo: true }
      );
    };

    let tween = build();
    const ro = new ResizeObserver(() => {
      tween.kill();
      tween = build();
    });
    ro.observe(stripe);

    // VE-9: vertical parallax as the band scrolls past — scrub-tied
    // yPercent on the orb. Different property from the x drift tween, same
    // owner (GSAP), composes with the CSS -50% centering (GSAP tracks
    // percent components separately from the parsed pixel matrix).
    // Position-only scrub; the orb is decorative aria-hidden.
    const parallax = gsap.fromTo(
      orb,
      { yPercent: -57 }, // -50 (centering) ± 7 travel
      {
        yPercent: -43,
        ease: 'none',
        scrollTrigger: {
          trigger: stripe,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      }
    );

    return () => {
      ro.disconnect();
      tween.kill();
      parallax.scrollTrigger?.kill();
      parallax.kill();
    };
  }, [duration]);

  // Accept number (px) or any CSS length string
  const resolvedSize =
    typeof (height ?? size) === 'number'
      ? `${height ?? size}px`
      : String(height ?? size);

  return (
    <div
      className="gradient-stripe"
      ref={stripeRef}
      style={{ '--stripe-size': resolvedSize }}
    >
      <div className="stripe-bg" />
      <div className="orb-wrap" ref={orbRef} aria-hidden="true">
        <img
          src={orbSrc}
          alt=""
          decoding="async"
          loading="eager"
          // lowercase: React 18's renderer doesn't know the camelCase prop
          // (that's React 19) — it warns on every SSG page render and would
          // emit nothing; the lowercase form passes through as the real
          // HTML attribute.
          fetchpriority={fetchPriority}
        />
      </div>
    </div>
  );
}
