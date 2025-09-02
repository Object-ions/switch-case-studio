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
  const orbRef = useRef(null);

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) {
      gsap.set(orbRef.current, { xPercent: 0 });
      return;
    }
    const t = gsap.fromTo(
      orbRef.current,
      { xPercent: -travel, opacity: 1 },
      { xPercent: travel, opacity: 1, duration, ease: "power2.inOut", repeat: -1, yoyo: true }
    );
    return () => t.kill();
  }, [duration, travel]);

  return (
    <div
      className="gradient-stripe"
      style={{ height: typeof height === "number" ? `${height}px` : height }}
    >
      <div className="stripe-bg" />
      <div className="orb-wrap" ref={orbRef} aria-hidden="true">
        <img
          src={orbSrc}
          alt=""
          width={height} height={height}   // avoids CLS; same as stripe height
          decoding="async"
          loading="eager"
          fetchPriority={fetchPriority}
        />
      </div>
    </div>
  );
}