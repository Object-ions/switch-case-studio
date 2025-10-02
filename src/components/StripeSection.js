import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import '../styles/components/stripeSection.scss';

export default function GradientStripeImage({
  // Make the default responsive instead of a fixed number
  size = 'clamp(160px, 24vw, 420px)', // controls stripe height responsively
  duration = 5.9,
  travel = 60, // (kept in case you want to use it later)
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
      const W = stripe.clientWidth; // full stripe width
      const max = W / 2; // center → half offscreen
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

  // If a raw number is passed, treat as px; otherwise accept any CSS length
  const cssSize = typeof size === 'number' ? `${size}px` : String(size);

  return (
    <div className="gradient-stripe" ref={stripeRef} style={{ cssSize }}>
      <div className="stripe-bg" />
      <div className="orb-wrap" ref={orbRef} aria-hidden="true">
        <img
          src={orbSrc}
          alt=""
          decoding="async"
          loading="eager"
          fetchPriority={fetchPriority}
        />
      </div>
    </div>
  );
}
