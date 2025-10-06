import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReducedMotion from '../hooks/useReducedMotion';

import ZahavMp4 from '../assets/projects/zahav/zahav-cover-tile.mp4';
import ZahavPoster from '../assets/projects/zahav/zahav-cover-tile.webp';
import CreatuwheelsMp4 from '../assets/projects/creatuwheels/creatuwheels-cover-tile.mp4';
import CreatuwheelsPoster from '../assets/projects/creatuwheels/creatuwheels-cover-tile.webp';
import MaritimeMp4 from '../assets/projects/maritime/maritime-cover-tile.mp4';
import MaritimePoster from '../assets/projects/maritime/maritime-cover-tile.webp';

gsap.registerPlugin(ScrollTrigger);

const COVER_MEDIA = {
  'zahav-medspa': { mp4: ZahavMp4, poster: ZahavPoster },
  creatuwheels: { mp4: CreatuwheelsMp4, poster: CreatuwheelsPoster },
  maritime: { mp4: MaritimeMp4, poster: MaritimePoster },
};

const Tile = ({ proj, onOpen }) => {
  const media = COVER_MEDIA[proj.slug];

  const onKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen(proj.id);
    }
  };

  return (
    <div
      className={`panel ${proj.panelClass} tile ${media ? 'has-media' : ''}`}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(proj.id)}
      onKeyDown={onKey}
      aria-label={`Open ${proj.label} details`}
    >
      {/* Media layer (autoplay, loop, no controls) */}
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

      {/* Show name ONLY on color tiles (no media). Hidden on media tiles. */}
      {!media && (
        <span className="panel-label" data-about={`About ${proj.label}`}>
          {proj.label}
        </span>
      )}

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
      const tiles = gsap.utils.toArray('.row-tiles .tile');

      // Stagger in
      gsap.fromTo(
        tiles,
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

      // Hover float
      tiles.forEach((tile) => {
        let enterTl;
        tile.addEventListener('mouseenter', () => {
          enterTl?.kill();
          enterTl = gsap.timeline();
          enterTl.to(tile, {
            y: -6,
            rotate: 0.6,
            scale: 1.015,
            duration: 0.25,
            ease: 'power2.out',
          });
          const label = tile.querySelector('.panel-label');
          if (label) {
            enterTl.fromTo(
              label,
              { yPercent: 20, autoAlpha: 0.6 },
              { yPercent: 0, autoAlpha: 1, duration: 0.25 },
              0
            );
          }
        });
        tile.addEventListener('mouseleave', () => {
          gsap.to(tile, {
            y: 0,
            rotate: 0,
            scale: 1,
            duration: 0.25,
            ease: 'power2.inOut',
          });
        });
      });

      // De-emphasize grid when modal open
      gsap.to(tiles, {
        filter: modalOpen ? 'grayscale(30%) blur(1px)' : 'none',
        opacity: modalOpen ? 0.6 : 1,
        duration: 0.25,
        ease: 'power1.out',
      });
    }, wrap);
    return () => ctx.revert();
  }, [reduced, modalOpen]);

  return (
    <div className="projects-row row-tiles" ref={wrap}>
      {projects.map((p) => (
        <Tile key={p.id} proj={p} onOpen={onOpen} />
      ))}
    </div>
  );
};

export default ProjectsTiles;
