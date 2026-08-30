import { useRef, useEffect, useState, lazy, Suspense } from 'react';
import useIsomorphicLayoutEffect from '../../hooks/useIsomorphicLayoutEffect';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import useReducedMotion from '../../hooks/useReducedMotion';
import useBentoParticles from '../../hooks/useBentoParticles';
import useBentoSpotlight from '../../hooks/useBentoSpotlight';
import { MOBILE_BREAKPOINT } from '../../utils/bentoEffects';

// The screenshot peek pulls in @radix-ui/react-hover-card + motion/react.
// Imported statically it cost the ENTRY chunk +41.7KB (measured) — and this
// grid is below the fold, so none of it is needed for first paint. Gated
// behind an IntersectionObserver like MoonSlot/TextPressure: nothing
// downloads until the grid is within 200px of the viewport, and you cannot
// hover a section you have not scrolled to.
const HoverPeek = lazy(() => import('../ui/HoverPeek'));


/* ═══════════════════════════════════════════
   Tile — single project card
   ═══════════════════════════════════════════ */
const Tile = ({ proj, disabled, peekReady }) => {
  const tileRef = useRef(null);
  const { startParticles, stopParticles, fireRipple } = useBentoParticles(
    tileRef,
    { disabled },
  );

  // In-tile website preview (the tall long.webp). Mounted on FIRST hover, not
  // at peekReady: eager-mounting all 8 would pull ~4MB of screenshots the
  // moment the grid nears the viewport. `warm` keeps the same on-demand
  // network profile the floating image peek had; `loaded` gates the fade so
  // the cover never swaps to a half-painted screenshot.
  const hasPeek = peekReady && !!proj.longWeb;
  const [warm, setWarm] = useState(false);
  const [peekLoaded, setPeekLoaded] = useState(false);

  const onEnter = () => {
    if (!tileRef.current) return;
    if (hasPeek) setWarm(true);
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

  const link = (
    <Link
      ref={tileRef}
      to={`/projects/${proj.slug}`}
      className={`panel ${proj.panelClass} tile has-media${hasPeek ? ' has-peek' : ''}`}
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
          srcSet={`${proj.coverTile.replace(/\.webp$/, '')}-256.webp 256w, ${proj.coverTile.replace(/\.webp$/, '')}-512.webp 512w, ${proj.coverTile} 1034w`}
          sizes="(max-width: 768px) 96px, (max-width: 1239px) 45vw, 584px"
          width="1034"
          height="1446"
          alt=""
          loading="lazy"
        />
        {/* Website preview shown IN the tile on hover (the copy floats in the
            HoverPeek text card instead — see below). Distinct class from
            .tile-image on purpose: the entrance effect's load-refresh listener
            targets .tile-image, and this absolutely-positioned overlay can
            never shift layout. */}
        {hasPeek && warm && (
          <img
            className={`tile-peek-image${peekLoaded ? ' is-loaded' : ''}`}
            src={proj.longWeb}
            alt=""
            decoding="async"
            onLoad={() => setPeekLoaded(true)}
          />
        )}
      </div>

      {/* Title — visually hidden on desktop (cover image is the title there);
          visible on mobile where the row layout needs a textual anchor. */}
      <h3 className="tile-title">{proj.title}</h3>

      {proj.tileVersion && (
        <p className="panel-excerpt">
          <span className="panel-excerpt-text">{proj.tileVersion}</span>
          <b>
            View Case Study{' '}
            <span className="cta-arrow" aria-hidden="true">
              →
            </span>
          </b>
        </p>
      )}
    </Link>
  );

  // Inverse of the /projects grid's peek: there the FLOATING card is the
  // screenshot; here the tile itself shows the screenshot on hover (see
  // tile-peek-image above), so the floating card carries the COPY — title,
  // excerpt, CTA — in a compact text box. Radix's Trigger `asChild` clones
  // the Link, so it composes with the GSAP hover handlers and the ref above
  // rather than replacing them.
  //
  // `peekReady` is false on the server AND on the first client render, so the
  // bare link is what hydrates — no environment-dependent output, no mismatch.
  // The Suspense fallback is that same bare link, so the tile is never absent
  // while the chunk loads.
  if (!hasPeek) return link;

  return (
    <Suspense fallback={link}>
      <HoverPeek
        content={
          <>
            <p className="hover-peek__title">{proj.title}</p>
            {proj.tileVersion && (
              <p className="hover-peek__desc">{proj.tileVersion}</p>
            )}
            <b className="hover-peek__cta">
              View Case Study{' '}
              <span className="cta-arrow" aria-hidden="true">
                →
              </span>
            </b>
          </>
        }
      >
        {link}
      </HoverPeek>
    </Suspense>
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

  // Load the peek chunk only once the grid is near the viewport, and only on
  // devices that can actually hover. Gated on POINTER CAPABILITY, not on
  // `disabled`/`isMobile`: that flag is width-based, so a narrow desktop
  // window would have silently lost the peek here while /projects still had
  // it. Reduced motion is deliberately NOT excluded — HoverPeek already
  // downgrades its flip to a fade, so those visitors still get the preview.
  const [peekReady, setPeekReady] = useState(false);
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const el = gridRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setPeekReady(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPeekReady(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
        <Tile key={p.slug} proj={p} disabled={disabled} peekReady={peekReady} />
      ))}
    </div>
  );
};

export default CaseStudyTiles;
