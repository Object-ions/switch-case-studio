import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import '../styles/components/stripeSection.scss';

export default function GradientStripeImage({
  height = 420,                 // stripe (and orb) height
  duration = 5.9,               // glide speed, seconds L→R
  travel = 60,                  // how far the orb travels (xPercent)
  orbSrc = "/assets/orb@768.avif", // single image source (no fallback)
  fetchPriority = "high",
}) {
  const stripeRef = useRef(null);
  const orbRef = useRef(null);

  useLayoutEffect(() => {
      const stripe = stripeRef.current;
      const orb = orbRef.current;
      if (!stripe || !orb) return;
  
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
      if (reduce) { gsap.set(orb, { x: 0 }); return; }
  
      const build = () => {
        const W = stripe.clientWidth;    // full stripe width
        const max = W / 2;               // center → half offscreen
        return gsap.fromTo(
          orb,
          { x: -max },
          { x:  max, duration, ease: "power2.inOut", repeat: -1, yoyo: true }
        );
      };
  
      let tween = build();
      const ro = new ResizeObserver(() => { tween.kill(); tween = build(); });
      ro.observe(stripe);
      return () => { ro.disconnect(); tween.kill(); };
    }, [duration]);

  return (
    <div
      className="gradient-stripe"
      ref={stripeRef} 
      style={{ height: typeof height === "number" ? `${height}px` : height }}
    >
      <div className="stripe-bg" />
      <div className="orb-wrap" ref={orbRef} aria-hidden="true">
        <img
          src={orbSrc}
          alt=""
          {...(typeof height === "number" ? { width: height, height } : {})}
          decoding="async"
          loading="eager"
          fetchPriority={fetchPriority}
        />
      </div>
    </div>
  );
}