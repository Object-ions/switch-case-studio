import { useLayoutEffect, useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import useReducedMotion from '../hooks/useReducedMotion';
import useBentoParticles from '../hooks/useBentoParticles';
import useBentoSpotlight from '../hooks/useBentoSpotlight';
import { MOBILE_BREAKPOINT } from '../utils/bentoEffects';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════
   Tile — single project card
   ═══════════════════════════════════════════ */
const Tile = ({ proj, onOpen, disabled }) => {
  const tileRef = useRef(null);
  const { startParticles, stopParticles, fireRipple } = useBentoParticles(
    tileRef,
    { disabled },
  );

  const onEnter = () => {
    if (!tileRef.current) return;
    if (!disabled) startParticles();

    gsap.to(tileRef.current, {
      y: -6,
      rotate: 0.6,
      scale: 1.015,
      duration: 0.25,
      ease: 'power2.out',
      overwrite: true,
    });
  };

  const onLeave = () => {
    if (!tileRef.current) return;
    stopParticles();

    gsap.to(tileRef.current, {
      y: 0,
      rotate: 0,
      scale: 1,
      duration: 0.25,
      ease: 'power2.inOut',
      overwrite: true,
    });
  };

  const handleClick = (e) => {
    fireRipple(e);
    onOpen(proj.id);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen(proj.id);
    }
  };

  return (
    <div
      ref={tileRef}
      className={`panel ${proj.panelClass} tile has-media`}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKey}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      aria-label={`Open ${proj.label || proj.title} details`}
    >
      <div className="tile-bento-glow" aria-hidden="true" />

      <div className="tile-media" aria-hidden="true">
        <img
          className="tile-image"
          src={process.env.PUBLIC_URL + proj.coverTile}
          alt=""
          loading="lazy"
        />
      </div>

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
  const gridRef = useRef(null);
  const reduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const disabled = reduced || isMobile;

  useBentoSpotlight(gridRef, { disabled });

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
            trigger: gridRef.current,
            start: 'top 80%',
            once: true,
          },
        },
      );
    }, gridRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div
      className={`projects-row row-tiles ${modalOpen ? 'is-blurred' : ''}`}
      ref={gridRef}
    >
      {projects.map((p) => (
        <Tile key={p.id} proj={p} onOpen={onOpen} disabled={disabled} />
      ))}
    </div>
  );
};

export default ProjectsTiles;
