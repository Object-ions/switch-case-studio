import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReducedMotion from '../hooks/useReducedMotion';

import ZahavPoster from '../assets/projects/zahav/zahav-cover-tile.webp';
import CreatuwheelsPoster from '../assets/projects/creatuwheels/creatuwheels-cover-tile.webp';
import MaritimePoster from '../assets/projects/maritime/maritime-cover-tile.webp';
// import ProdaniPoster from '../assets/projects/prodani/prodani-cover-tile.webp';
import CrimsonEquitiesPoster from '../assets/projects/crimson/crimson-cover-tile.webp';

gsap.registerPlugin(ScrollTrigger);

// Keys MUST match the 'slug' in your PROJECTS data
const COVER_MEDIA = {
  'zahav-medspa': { poster: ZahavPoster },
  // 'prodani-miami': { poster: ProdaniPoster },
  'crimson-equities': { poster: CrimsonEquitiesPoster },
  creatuwheels: { poster: CreatuwheelsPoster },
  maritime: { poster: MaritimePoster },
};

const Tile = ({ proj, onOpen }) => {
  const tileRef = useRef(null);
  const media = COVER_MEDIA[proj.slug];

  // Hover Logic: React Event -> GSAP
  const onEnter = () => {
    if (!tileRef.current) return;

    // Animate Tile
    gsap.to(tileRef.current, {
      y: -6,
      rotate: 0.6,
      scale: 1.015,
      duration: 0.25,
      ease: 'power2.out',
      overwrite: true, // Prevents animation conflicts
    });

    // Animate Label (if exists)
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
      className={`panel ${proj.panelClass} tile ${media ? 'has-media' : ''}`}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(proj.id)}
      onKeyDown={onKey}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      aria-label={`Open ${proj.label} details`}
    >
      {/* Media Layer */}
      {media && (
        <div className="tile-media" aria-hidden="true">
          {media.mp4 ? (
            <video
              className="tile-video"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={media.poster}
            >
              <source src={media.mp4} type="video/mp4" />
            </video>
          ) : media.poster ? (
            <img
              className="tile-image"
              src={media.poster}
              alt=""
              loading="lazy"
            />
          ) : null}
        </div>
      )}

      {/* Text Layer (Only shown if no media) */}
      {!media && (
        <span className="panel-label" data-about={`About ${proj.label}`}>
          {proj.label}
        </span>
      )}

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

  // Entrance Animation Only
  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.tile', // Scoped to 'wrap' automatically by gsap.context
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
  }, [reduced]); // Removed 'modalOpen' dependency to stop re-animating

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
