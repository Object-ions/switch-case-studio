import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import useReducedMotion from '../../hooks/useReducedMotion';

/**
 * ModuleGrid — the /30-off signature interaction.
 *
 * A parametric circle↔square module field (NOT a flat SVG import). One inline
 * <svg viewBox> that scales by viewBox alone — no resize listener, zero CLS
 * (intrinsic aspect from the viewBox).
 *
 * Each cell is a single <rect>. Two per-cell custom properties drive the look,
 * and GSAP owns BOTH exclusively — CSS never transitions them (a CSS transition
 * on a GSAP-tweened prop double-animates and fights the timeline):
 *   --p  0 = square, 1 = circle   → rx/ry = calc(var(--p) * S/2)   (in SCSS)
 *   --m  0 = lilac,  1 = terracotta → fill: color-mix(…)            (in SCSS)
 *
 * Resting / no-JS / reduced-motion state is a static checker set inline per
 * cell (even r+c → square, odd → circle), all lilac on the terracotta field.
 * When motion is allowed, one center-out GSAP timeline ripples --p and --m,
 * yoyo + repeat. The timeline pauses offscreen (IntersectionObserver) and on
 * tab blur, and is fully reverted on unmount (gsap.context → ctx.revert()).
 */

const ROWS = 8;
const COLS = 12;
const S = 100; // cell size in viewBox units (square; circle r = S/2)

const ModuleGrid = ({ className = '' }) => {
  const svgRef = useRef(null);
  const reduced = useReducedMotion();

  // Build the cell list once. Static checker decides each cell's resting --p.
  const cells = [];
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      cells.push({ r, c, p: (r + c) % 2 === 0 ? 0 : 1 });
    }
  }

  useEffect(() => {
    if (reduced || !svgRef.current) return undefined;

    let tl;
    const ctx = gsap.context(() => {
      const rects = gsap.utils.toArray('rect', svgRef.current);
      // Start every cell uniform (square, lilac) so the first animated frame
      // doesn't jump from the static checker, then ripple to circle/terracotta.
      gsap.set(rects, { '--p': 0, '--m': 0 });
      tl = gsap.timeline({ repeat: -1, yoyo: true });
      tl.to(rects, {
        '--p': 1,
        '--m': 1,
        duration: 1.6,
        ease: 'sine.inOut',
        stagger: { grid: [ROWS, COLS], from: 'center', amount: 1.1 },
      });
    }, svgRef);

    // Pause when the grid is offscreen — no point tweening invisible cells.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!tl) return;
        if (entry.isIntersecting) tl.play();
        else tl.pause();
      },
      { threshold: 0 },
    );
    io.observe(svgRef.current);

    // Pause on tab blur; resume only if still onscreen.
    const onVisibility = () => {
      if (!tl) return;
      if (document.hidden) tl.pause();
      else tl.play();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      ctx.revert(); // kills the timeline + clears GSAP-set inline props
    };
  }, [reduced]);

  return (
    <svg
      ref={svgRef}
      className={`module-grid ${className}`.trim()}
      viewBox={`0 0 ${COLS * S} ${ROWS * S}`}
      preserveAspectRatio="xMidYMid slice"
      role="presentation"
      aria-hidden="true"
      focusable="false"
      style={{ '--s': `${S}px` }}
    >
      {cells.map(({ r, c, p }) => (
        <rect
          key={`${r}-${c}`}
          x={c * S}
          y={r * S}
          width={S}
          height={S}
          style={{ '--p': p, '--m': 0 }}
        />
      ))}
    </svg>
  );
};

export default ModuleGrid;
