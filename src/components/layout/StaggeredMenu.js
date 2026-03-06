import React, {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import {
  PRICING_LINKS,
  PROJECT_LINKS,
  LEGAL_LINKS,
} from '../../data/navigation';
import '../../styles/components/StaggeredMenu.scss';

/* ──────────────────────────────────────────────
   Accordion sub-component (CSS-only transition)
   ────────────────────────────────────────────── */
const MenuAccordion = ({ label, items, isOpen, onToggle, onNavClick }) => (
  <li className="sm-panel-itemWrap">
    <button
      type="button"
      className={`sm-panel-item sm-accordion-trigger${isOpen ? ' is-open' : ''}`}
      aria-expanded={isOpen}
      onClick={onToggle}
    >
      <span className="sm-panel-itemLabel">{label}</span>
      <span className="sm-accordion-caret" aria-hidden="true" />
    </button>

    <ul className={`sm-accordion-submenu${isOpen ? ' is-open' : ''}`}>
      {items.map((item) => (
        <li key={item.to} className="sm-accordion-subitem">
          <Link to={item.to} className="sm-accordion-link" onClick={onNavClick}>
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  </li>
);

/* ──────────────────────────────────────────────
   StaggeredMenu — headless (no built-in header)
   Controlled via open / onClose props.
   Replaces MenuModal on tablet/mobile only.
   ────────────────────────────────────────────── */
const StaggeredMenu = ({
  open,
  onClose,
  position = 'right',
  colors = ['#1a1a1a', '#2a1a35'],
  accentColor = '#ff834a',
}) => {
  const [openAccordion, setOpenAccordion] = useState(null);
  const panelRef = useRef(null);
  const preLayersRef = useRef(null);
  const preLayerElsRef = useRef([]);

  const openTlRef = useRef(null);
  const closeTweenRef = useRef(null);
  const busyRef = useRef(false);
  const prevOpenRef = useRef(false);

  const location = useLocation();
  const navigate = useNavigate();

  /* ── GSAP initial setup ─────────────────────── */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      if (!panel) return;

      let preLayers = [];
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer'));
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === 'left' ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen });
    });
    return () => ctx.revert();
  }, [position]);

  /* ── Build open timeline ────────────────────── */
  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }

    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
    const socialTitle = panel.querySelector('.sm-socials-title');
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));

    const layerStates = layers.map((el) => ({
      el,
      start: Number(gsap.getProperty(el, 'xPercent')),
    }));
    const panelStart = Number(gsap.getProperty(panel, 'xPercent'));

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(
        ls.el,
        { xPercent: ls.start },
        { xPercent: 0, duration: 0.5, ease: 'power4.out' },
        i * 0.07,
      );
    });

    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;

    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
      panelInsertTime,
    );

    if (itemEls.length) {
      const itemsStart = panelInsertTime + panelDuration * 0.15;
      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: 'power4.out',
          stagger: { each: 0.1, from: 'start' },
        },
        itemsStart,
      );
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;
      if (socialTitle) {
        tl.to(
          socialTitle,
          { opacity: 1, duration: 0.5, ease: 'power2.out' },
          socialsStart,
        );
      }
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: 'power3.out',
            stagger: { each: 0.08, from: 'start' },
            onComplete: () => gsap.set(socialLinks, { clearProps: 'opacity' }),
          },
          socialsStart + 0.04,
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, []);

  /* ── Play open ──────────────────────────────── */
  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onComplete', () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  /* ── Play close ─────────────────────────────── */
  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all = [...layers, panel];
    closeTweenRef.current?.kill();
    const offscreen = position === 'left' ? -100 : 100;

    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: () => {
        const itemEls = Array.from(
          panel.querySelectorAll('.sm-panel-itemLabel'),
        );
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
        const socialTitle = panel.querySelector('.sm-socials-title');
        const socialLinks = Array.from(
          panel.querySelectorAll('.sm-socials-link'),
        );
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });
        busyRef.current = false;
      },
    });
  }, [position]);

  /* ── React to open prop changes ─────────────── */
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      document.body.style.overflow = 'hidden';
      playOpen();
    } else if (!open && prevOpenRef.current) {
      document.body.style.overflow = '';
      setOpenAccordion(null);
      playClose();
    }
    prevOpenRef.current = open;
  }, [open, playOpen, playClose]);

  /* ── Cleanup scroll lock on unmount ─────────── */
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  /* ── Auto-close on route change ─────────────── */
  useEffect(() => {
    if (open) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.hash]);

  /* ── Click-away close ───────────────────────── */
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        if (e.target.closest('.site-header_menuBtn')) return;
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose]);

  /* ── Escape key close ───────────────────────── */
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  /* ── Navigation handler (hash links) ────────── */
  const handleNavClick = useCallback(
    (to) => (e) => {
      e.preventDefault();
      onClose();
      setTimeout(() => navigate(to), 80);
    },
    [onClose, navigate],
  );

  /* ── Accordion toggle ───────────────────────── */
  const toggleAccordion = (id) =>
    setOpenAccordion((prev) => (prev === id ? null : id));

  /* ── Pre-layer colors ───────────────────────── */
  const preLayers = (() => {
    const raw =
      colors && colors.length ? colors.slice(0, 4) : ['#1a1a1a', '#2a1a35'];
    let arr = [...raw];
    if (arr.length >= 3) {
      const mid = Math.floor(arr.length / 2);
      arr.splice(mid, 1);
    }
    return arr;
  })();

  /* ── Render ─────────────────────────────────── */
  return (
    <div
      className="staggered-menu-wrapper"
      style={accentColor ? { '--sm-accent': accentColor } : undefined}
      data-position={position}
      data-open={open || undefined}
    >
      {/* Pre-layers */}
      <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
        {preLayers.map((c, i) => (
          <div key={i} className="sm-prelayer" style={{ background: c }} />
        ))}
      </div>

      {/* Slide-in panel */}
      <aside
        id="staggered-menu-panel"
        ref={panelRef}
        className="staggered-menu-panel"
        aria-hidden={!open}
      >
        <div className="sm-panel-inner">
          {/* Primary navigation */}
          <ul className="sm-panel-list" role="list">
            <li className="sm-panel-itemWrap">
              <Link
                to="/#services"
                className="sm-panel-item"
                onClick={handleNavClick('/#services')}
              >
                <span className="sm-panel-itemLabel">Services</span>
              </Link>
            </li>

            <li className="sm-panel-itemWrap">
              <Link
                to="/#about"
                className="sm-panel-item"
                onClick={handleNavClick('/#about')}
              >
                <span className="sm-panel-itemLabel">About</span>
              </Link>
            </li>

            <MenuAccordion
              label="Pricing"
              items={PRICING_LINKS}
              isOpen={openAccordion === 'pricing'}
              onToggle={() => toggleAccordion('pricing')}
              onNavClick={onClose}
            />

            <MenuAccordion
              label="Case Studies"
              items={PROJECT_LINKS}
              isOpen={openAccordion === 'projects'}
              onToggle={() => toggleAccordion('projects')}
              onNavClick={onClose}
            />

            <li className="sm-panel-itemWrap">
              <Link
                to="/#testimonials"
                className="sm-panel-item"
                onClick={handleNavClick('/#testimonials')}
              >
                <span className="sm-panel-itemLabel">Testimonials</span>
              </Link>
            </li>

            <li className="sm-panel-itemWrap">
              <Link
                to="/#contact"
                className="sm-panel-item"
                onClick={handleNavClick('/#contact')}
              >
                <span className="sm-panel-itemLabel">Contact Us</span>
              </Link>
            </li>
          </ul>

          {/* Secondary section — CTA + legal */}
          <div className="sm-socials" aria-label="Quick links">
            <h3 className="sm-socials-title">Quick Links</h3>
            <ul className="sm-socials-list" role="list">
              <li className="sm-socials-item">
                <a
                  href="https://calendar.app.google/83UCJjis2FHUrr1s6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sm-socials-link sm-cta-link"
                >
                  Book a Free Call
                </a>
              </li>
              {LEGAL_LINKS.map((link) => (
                <li key={link.to} className="sm-socials-item">
                  <Link
                    to={link.to}
                    className="sm-socials-link"
                    onClick={onClose}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default StaggeredMenu;
