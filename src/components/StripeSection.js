import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import '../styles/components/stripeSection.scss';

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

  useLayoutEffect(() => {
    const stripe = stripeRef.current;
    const orb = orbRef.current;
    if (!stripe || !orb) return;

    const reduce = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    )?.matches;
    if (reduce) {
      gsap.set(orb, { x: 0 });
      return;
    }

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

    return () => {
      ro.disconnect();
      tween.kill();
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
          alt="gradient orb"
          decoding="async"
          loading="eager"
          fetchPriority={fetchPriority}
        />
      </div>
    </div>
  );
}
