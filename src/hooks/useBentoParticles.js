import { useRef, useCallback, useEffect } from 'react';
import { gsap } from 'gsap';
import { createParticle, GLOW_COLOR, PARTICLE_COUNT } from '../utils/bentoEffects';

/**
 * useBentoParticles
 *
 * Floating particle stars (hover) and radial click-ripple for a tile.
 *
 * @param {React.RefObject} ref         - tile DOM element
 * @param {Object}          opts
 * @param {boolean}         opts.disabled
 * @returns {{ startParticles, stopParticles, fireRipple }}
 */
const useBentoParticles = (ref, { disabled = false } = {}) => {
  const particlesRef = useRef([]);
  const timeoutsRef = useRef([]);
  const activeRef = useRef(false);

  const stopParticles = useCallback(() => {
    activeRef.current = false;
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    particlesRef.current.forEach((p) => {
      gsap.to(p, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => p.parentNode?.removeChild(p),
      });
    });
    particlesRef.current = [];
  }, []);

  const startParticles = useCallback(() => {
    if (disabled || !ref.current) return;
    activeRef.current = true;

    const { width, height } = ref.current.getBoundingClientRect();

    Array.from({ length: PARTICLE_COUNT }).forEach((_, i) => {
      const tid = setTimeout(() => {
        if (!activeRef.current || !ref.current) return;

        const p = createParticle(Math.random() * width, Math.random() * height);
        ref.current.appendChild(p);
        particlesRef.current.push(p);

        gsap.fromTo(
          p,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' },
        );

        gsap.to(p, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true,
        });

        gsap.to(p, {
          opacity: 0.3,
          duration: 1.5,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true,
        });
      }, i * 100);

      timeoutsRef.current.push(tid);
    });
  }, [ref, disabled]);

  const fireRipple = useCallback(
    (e) => {
      if (disabled || !ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxDist = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height),
      );

      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDist * 2}px;
        height: ${maxDist * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle,
          rgba(${GLOW_COLOR}, 0.4) 0%,
          rgba(${GLOW_COLOR}, 0.2) 30%,
          transparent 70%
        );
        left: ${x - maxDist}px;
        top: ${y - maxDist}px;
        pointer-events: none;
        z-index: 1000;
      `;
      ref.current.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => ripple.remove(),
        },
      );
    },
    [ref, disabled],
  );

  useEffect(() => {
    return () => {
      activeRef.current = false;
      stopParticles();
    };
  }, [stopParticles]);

  return { startParticles, stopParticles, fireRipple };
};

export default useBentoParticles;
