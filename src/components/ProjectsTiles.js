import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReducedMotion from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const Tile = ({ proj, onOpen }) => {
  const tileRef = useRef(null);

  // Hover Logic: React Event -> GSAP
  const onEnter = () => {
    if (!tileRef.current) return;

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
        { yPercent: 0, autoAlpha: 1, duration: 0.25, overwrite: true }
      );
    }
  };

  const onLeave = () => {
    if (!tileRef.current) return;
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

  return (
    <div
      ref={tileRef}
      className={`panel ${proj.panelClass} tile has-media`}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(proj.id)}
      onKeyDown={onKey}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      aria-label={`Open ${proj.label || proj.title} details`}
    >
      {/* Media Layer - Now using the path from JSON */}
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

const ProjectsTiles = ({ projects, onOpen, modalOpen }) => {
  const wrap = useRef(null);
  const reduced = useReducedMotion();

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
        }
      );
    }, wrap);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div
      className={`projects-row row-tiles ${modalOpen ? 'is-blurred' : ''}`}
      ref={wrap}
    >
      {projects.map((p) => (
        <Tile key={p.id} proj={p} onOpen={onOpen} />
      ))}
    </div>
  );
};

export default ProjectsTiles;