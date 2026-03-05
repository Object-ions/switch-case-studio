import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  GLOW_COLOR,
  SPOTLIGHT_RADIUS,
  setGlowVars,
  spotlightThresholds,
} from '../utils/bentoEffects';

/**
 * useBentoSpotlight
 *
 * Ambient cursor-following light across a tile grid.
 * Sets per-tile --glow-* CSS vars for the border glow effect.
 *
 * @param {React.RefObject} gridRef
 * @param {Object}          opts
 * @param {boolean}         opts.disabled
 * @param {number}          opts.radius
 * @param {string}          opts.color  - RGB string
 */
const useBentoSpotlight = (
  gridRef,
  { disabled = false, radius = SPOTLIGHT_RADIUS, color = GLOW_COLOR } = {},
) => {
  const spotlightRef = useRef(null);

  useEffect(() => {
    if (disabled || !gridRef?.current) return;

    // Only dynamic style is the radial gradient (color-dependent)
    const spotlight = document.createElement('div');
    spotlight.className = 'bento-global-spotlight';
    spotlight.style.background = `radial-gradient(circle,
      rgba(${color}, 0.15) 0%,
      rgba(${color}, 0.08) 15%,
      rgba(${color}, 0.04) 25%,
      rgba(${color}, 0.02) 40%,
      rgba(${color}, 0.01) 65%,
      transparent 70%
    )`;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const grid = gridRef.current;
    const { proximity, fadeDistance } = spotlightThresholds(radius);

    const resetTiles = () => {
      grid
        ?.querySelectorAll('.tile')
        .forEach((t) => t.style.setProperty('--glow-intensity', '0'));
    };

    const onMove = (e) => {
      if (!spotlightRef.current || !grid) return;

      const rect = grid.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!inside) {
        gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' });
        resetTiles();
        return;
      }

      const tiles = grid.querySelectorAll('.tile');
      let minDist = Infinity;

      tiles.forEach((tile) => {
        const tr = tile.getBoundingClientRect();
        const cx = tr.left + tr.width / 2;
        const cy = tr.top + tr.height / 2;
        const dist =
          Math.hypot(e.clientX - cx, e.clientY - cy) -
          Math.max(tr.width, tr.height) / 2;
        const eff = Math.max(0, dist);

        minDist = Math.min(minDist, eff);

        let intensity = 0;
        if (eff <= proximity) intensity = 1;
        else if (eff <= fadeDistance)
          intensity = (fadeDistance - eff) / (fadeDistance - proximity);

        setGlowVars(tile, e.clientX, e.clientY, intensity, radius);
      });

      gsap.to(spotlightRef.current, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.1,
        ease: 'power2.out',
      });

      const opacity =
        minDist <= proximity
          ? 0.8
          : minDist <= fadeDistance
            ? ((fadeDistance - minDist) / (fadeDistance - proximity)) * 0.8
            : 0;

      gsap.to(spotlightRef.current, {
        opacity,
        duration: opacity > 0 ? 0.2 : 0.5,
        ease: 'power2.out',
      });
    };

    const onLeave = () => {
      resetTiles();
      if (spotlightRef.current)
        gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' });
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [gridRef, disabled, radius, color]);
};

export default useBentoSpotlight;
