import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import '../styles/components/stripeSection.scss';

export default function GradientStripe({ height = 420, duration = 5.8 }) {
    const stripeRef = useRef(null);
    const orbRef = useRef(null);
  
    useLayoutEffect(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
  
    
      const tween = gsap.fromTo(
        orbRef.current,
        { xPercent: -60, opacity: 0.98 },
        {
          xPercent: 60,
          opacity: 1,
          duration,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
        }
      );
  
      return () => tween.kill();
    }, [duration]);
  
    return (
      <div
        className="gradient-stripe"
        ref={stripeRef}
        style={{ height: typeof height === "number" ? `${height}px` : height }}
      >
        <div className="stripe-bg" />
        <div className="orb" ref={orbRef} aria-hidden="true" />
      </div>
    );
  }