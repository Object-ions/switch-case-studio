import {
  useLayoutEffect,
  useRef,
  useEffect,
  useCallback,
  useState,
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReducedMotion from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

/* ─── Magic Bento Config ─── */
const GLOW_COLOR = '217, 156, 255'; // matches $g6: #d99cff
const PARTICLE_COUNT = 12;
const SPOTLIGHT_RADIUS = 400;
const MOBILE_BREAKPOINT = 768;

/* ─── Particle helpers ─── */
const createParticle = (x, y, color) => {
  const el = document.createElement('div');
  el.className = 'bento-particle';
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

/* ─── Spotlight helpers ─── */
const spotlightThresholds = (radius) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
});

const setGlowVars = (el, mouseX, mouseY, intensity, radius) => {
  const r = el.getBoundingClientRect();
  el.style.setProperty('--glow-x', `${((mouseX - r.left) / r.width) * 100}%`);
  el.style.setProperty('--glow-y', `${((mouseY - r.top) / r.height) * 100}%`);
  el.style.setProperty('--glow-intensity', intensity.toString());
  el.style.setProperty('--glow-radius', `${radius}px`);
};

/* ═══════════════════════════════════════════
   Global Spotlight
   Ambient cursor-following light across the grid
   ═══════════════════════════════════════════ */
const GlobalSpotlight = ({
  gridRef,
  disabled,
  radius = SPOTLIGHT_RADIUS,
  color = GLOW_COLOR,
}) => {
  const spotlightRef = useRef(null);

  useEffect(() => {
    if (disabled || !gridRef?.current) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'bento-global-spotlight';
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${color}, 0.15) 0%,
        rgba(${color}, 0.08) 15%,
        rgba(${color}, 0.04) 25%,
        rgba(${color}, 0.02) 40%,
        rgba(${color}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
      will-change: transform, opacity;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const grid = gridRef.current;

    const onMove = (e) => {
      if (!spotlightRef.current || !grid) return;

      const rect = grid.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      const tiles = grid.querySelectorAll('.tile');

      if (!inside) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
        tiles.forEach((t) => t.style.setProperty('--glow-intensity', '0'));
        return;
      }

      const { proximity, fadeDistance } = spotlightThresholds(radius);
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
      grid
        ?.querySelectorAll('.tile')
        .forEach((t) => t.style.setProperty('--glow-intensity', '0'));
      if (spotlightRef.current)
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [gridRef, disabled, radius, color]);

  return null;
};

/* ═══════════════════════════════════════════
   Tile — project card with particles & ripple
   ═══════════════════════════════════════════ */
const Tile = ({ proj, onOpen, disabled }) => {
  const tileRef = useRef(null);
  const particlesRef = useRef([]);
  const timeoutsRef = useRef([]);
  const isHoveredRef = useRef(false);

  /* --- Particle lifecycle --- */
  const clearParticles = useCallback(() => {
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

  const spawnParticles = useCallback(() => {
    if (!tileRef.current || !isHoveredRef.current || disabled) return;
    const { width, height } = tileRef.current.getBoundingClientRect();

    Array.from({ length: PARTICLE_COUNT }).forEach((_, i) => {
      const tid = setTimeout(() => {
        if (!isHoveredRef.current || !tileRef.current) return;

        const p = createParticle(
          Math.random() * width,
          Math.random() * height,
          GLOW_COLOR,
        );
        tileRef.current.appendChild(p);
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
  }, [disabled]);

  /* --- Click ripple --- */
  const fireRipple = useCallback(
    (e) => {
      if (disabled || !tileRef.current) return;

      const rect = tileRef.current.getBoundingClientRect();
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
      tileRef.current.appendChild(ripple);

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
    [disabled],
  );

  /* --- Hover handlers (preserve original behavior) --- */
  const onEnter = () => {
    if (!tileRef.current) return;
    isHoveredRef.current = true;

    if (!disabled) spawnParticles();

    gsap.to(tileRef.current, {
      y: -6,
      rotate: 0.6,
      scale: 1.015,
      duration: 0.25,
      ease: 'power2.out',
      overwrite: true,
    });

    const label = tileRef.current.querySelector('.panel-label');
    if (label) {
      gsap.fromTo(
        label,
        { yPercent: 20, autoAlpha: 0.6 },
        { yPercent: 0, autoAlpha: 1, duration: 0.25, overwrite: true },
      );
    }
  };

  const onLeave = () => {
    if (!tileRef.current) return;
    isHoveredRef.current = false;
    clearParticles();

    gsap.to(tileRef.current, {
      y: 0,
      rotate: 0,
      scale: 1,
      duration: 0.25,
      ease: 'power2.inOut',
      overwrite: true,
    });
  };

  const onKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen(proj.id);
    }
  };

  const handleClick = (e) => {
    fireRipple(e);
    onOpen(proj.id);
  };

  /* Cleanup on unmount */
  useEffect(() => {
    return () => {
      isHoveredRef.current = false;
      clearParticles();
    };
  }, [clearParticles]);

  return (
    <div
      ref={tileRef}
      className={`panel ${proj.panelClass} tile has-media`}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={onKey}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      aria-label={`Open ${proj.label || proj.title} details`}
    >
      {/* ✦ Bento: cursor-tracking border glow */}
      <div className="tile-bento-glow" aria-hidden="true" />

      {/* Media Layer */}
      <div className="tile-media" aria-hidden="true">
        <img
          className="tile-image"
          src={process.env.PUBLIC_URL + proj.coverTile}
          alt=""
          loading="lazy"
        />
      </div>

      {/* Click Prompt (Overlay) */}
      {proj.tileVersion && (
        <p className="panel-excerpt">
          {proj.tileVersion}
          <br />
          <b>Click to View</b>
        </p>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   ProjectsTiles — grid wrapper
   ═══════════════════════════════════════════ */
const ProjectsTiles = ({ projects, onOpen, modalOpen }) => {
  const wrap = useRef(null);
  const reduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const shouldDisable = reduced || isMobile;

  useLayoutEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.tile',
        { autoAlpha: 0, y: 30, scale: 0.98, rotate: -0.4 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotate: 0,
          ease: 'power2.out',
          duration: 0.7,
          stagger: { from: 'center', amount: 0.35 },
          scrollTrigger: {
            trigger: wrap.current,
            start: 'top 80%',
            once: true,
          },
        },
      );
    }, wrap);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <>
      <GlobalSpotlight gridRef={wrap} disabled={shouldDisable} />

      <div
        className={`projects-row row-tiles ${modalOpen ? 'is-blurred' : ''}`}
        ref={wrap}
      >
        {projects.map((p) => (
          <Tile key={p.id} proj={p} onOpen={onOpen} disabled={shouldDisable} />
        ))}
      </div>
    </>
  );
};

export default ProjectsTiles;
