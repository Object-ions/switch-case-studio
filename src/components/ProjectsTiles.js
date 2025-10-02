import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReducedMotion from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const Tile = ({ proj, onOpen }) => {
  const onKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen(proj.id);
    }
  };
  return (
    <div
      className={`panel ${proj.panelClass} tile`}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(proj.id)}
      onKeyDown={onKey}
      aria-label={`Open ${proj.label} details`}
    >
      <span className="panel-label" data-about={`About ${proj.label}`}>
        {proj.label}
      </span>
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

      // Stagger from a faux “grid” origin
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
          stagger: {
            from: 'center', // try "edges" or a custom index map if you want
            amount: 0.35,
          },
          scrollTrigger: {
            trigger: wrap.current,
            start: 'top 80%',
            once: true,
          },
        }
      );

      // Subtle float on hover (tilt + lift)
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
          // label reveal
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

      // When modal opens, gently de-emphasize grid
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
