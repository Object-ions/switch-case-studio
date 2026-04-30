import { useLayoutEffect, useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
const Tile = ({ proj, disabled }) => {
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

  // Ripple effect on click; navigation handled by Link.
  const handleClick = (e) => {
    fireRipple(e);
  };

  return (
    <Link
      ref={tileRef}
      to={`/projects/${proj.slug}`}
      className={`panel ${proj.panelClass} tile has-media`}
      onClick={handleClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      aria-label={`View case study: ${proj.title}`}
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
          <b>View Case Study →</b>
        </p>
      )}
    </Link>
  );
};

/* ═══════════════════════════════════════════
   ProjectsTiles — grid wrapper
   ═══════════════════════════════════════════ */
const ProjectsTiles = ({ projects }) => {
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

  // Tile-by-tile entrance. The parent .row-tiles reveal that previously
  // lived in Projects.js was removed — it overlapped this animation.
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
    <div className="projects-row row-tiles" ref={gridRef}>
      {projects.map((p) => (
        <Tile key={p.slug} proj={p} disabled={disabled} />
      ))}
    </div>
  );
};

export default ProjectsTiles;
