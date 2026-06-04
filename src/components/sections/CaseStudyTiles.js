import { useRef, useEffect, useState } from 'react';
import useIsomorphicLayoutEffect from '../../hooks/useIsomorphicLayoutEffect';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import useReducedMotion from '../../hooks/useReducedMotion';
import useBentoParticles from '../../hooks/useBentoParticles';
import useBentoSpotlight from '../../hooks/useBentoSpotlight';
import { MOBILE_BREAKPOINT } from '../../utils/bentoEffects';

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

      {proj.badge && <span className="tile-badge">{proj.badge}</span>}

      <div className="tile-media" aria-hidden="true">
        <img
          className="tile-image"
          src={proj.coverTile}
          alt=""
          loading="lazy"
        />
      </div>

      {/* Title — visually hidden on desktop (cover image is the title there);
          visible on mobile where the row layout needs a textual anchor. */}
      <h3 className="tile-title">{proj.title}</h3>

      {proj.tileVersion && (
        <p className="panel-excerpt">
          <span className="panel-excerpt-text">{proj.tileVersion}</span>
          <b>View Case Study →</b>
        </p>
      )}
    </Link>
  );
};

/* ═══════════════════════════════════════════
   CaseStudyTiles — grid wrapper
   ═══════════════════════════════════════════ */
const CaseStudyTiles = ({ projects }) => {
  const gridRef = useRef(null);
  const reduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  // matchMedia is cheaper than a resize listener and only fires when the
  // breakpoint is actually crossed. Matches the Cursor / Services pattern.
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const disabled = reduced || isMobile;

  useBentoSpotlight(gridRef, { disabled });

  // Tile-by-tile entrance. Built so tiles can NEVER stay hidden (see
  // CLAUDE.md): a flaky scroll reveal used to leave corner cards stuck dim.
  useIsomorphicLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const tiles = gsap.utils.toArray('.tile', grid);
    if (!tiles.length) return;

    // Reduced motion: no animation, just make sure tiles are visible.
    if (reduced) {
      gsap.set(tiles, { clearProps: 'all' });
      return;
    }

    const ctx = gsap.context(() => {
      // Set the hidden start state explicitly with gsap.set — NOT fromTo's
      // immediateRender, which re-applies on ScrollTrigger.refresh() (other
      // components refresh during initial font/image load) and re-hides tiles.
      gsap.set(tiles, { autoAlpha: 0, y: 30, scale: 0.98, rotate: -0.4 });

      const reveal = () =>
        gsap.to(tiles, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotate: 0,
          ease: 'power2.out',
          duration: 0.7,
          stagger: { from: 'center', amount: 0.35 },
          overwrite: 'auto',
        });

      const trigger = ScrollTrigger.create({
        trigger: grid,
        start: 'top 85%',
        once: true,
        onEnter: reveal,
      });

      // Already in view at mount (deep link to #projects, short viewport)?
      // onEnter won't fire for a trigger created already-past, so reveal now.
      if (grid.getBoundingClientRect().top < window.innerHeight * 0.85) {
        reveal();
      }

      // Lazy cover images shift layout after the trigger is measured; refresh
      // so 'start' is recomputed against the final geometry.
      grid.querySelectorAll('.tile-image').forEach((img) => {
        if (!img.complete) {
          img.addEventListener('load', () => ScrollTrigger.refresh(), {
            once: true,
          });
        }
      });

      // Safety net: tiles must never stay hidden. If the reveal hasn't run
      // within 2s (trigger never fired, refresh race, etc.), force it.
      const safety = gsap.delayedCall(2, () => {
        if (tiles.some((t) => gsap.getProperty(t, 'opacity') < 1)) reveal();
      });

      return () => {
        trigger.kill();
        safety.kill();
      };
    }, grid);

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

export default CaseStudyTiles;
