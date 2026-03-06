import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import HeaderCTA from './HeaderCTA';
import StaggeredMenu from './StaggeredMenu';
import { PRICING_LINKS, PROJECT_LINKS } from '../../data/navigation';
import '../../styles/components/header.scss';
import GradientText from '../GradientText';

const Header = () => {
  const [open, setOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [textLines, setTextLines] = useState(['Menu', 'Close']);
  const { pathname, hash } = useLocation();

  const openRef = useRef(false);
  const toggleBtnRef = useRef(null);
  const iconRef = useRef(null);
  const plusHRef = useRef(null);
  const plusVRef = useRef(null);
  const textInnerRef = useRef(null);
  const spinTweenRef = useRef(null);
  const textCycleAnimRef = useRef(null);

  /* ── Initial GSAP setup for toggle icon ────── */
  useEffect(() => {
    const plusH = plusHRef.current;
    const plusV = plusVRef.current;
    const icon = iconRef.current;
    const textInner = textInnerRef.current;
    if (!plusH || !plusV || !icon || !textInner) return;

    gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
    gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
    gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
    gsap.set(textInner, { yPercent: 0 });
  }, []);

  /* ── Icon spin animation ───────────────────── */
  const animateIcon = useCallback((opening) => {
    const icon = iconRef.current;
    if (!icon) return;
    spinTweenRef.current?.kill();
    spinTweenRef.current = opening
      ? gsap.to(icon, {
          rotate: 225,
          duration: 0.8,
          ease: 'power4.out',
          overwrite: 'auto',
        })
      : gsap.to(icon, {
          rotate: 0,
          duration: 0.35,
          ease: 'power3.inOut',
          overwrite: 'auto',
        });
  }, []);

  /* ── Text cycling animation ────────────────── */
  const animateText = useCallback((opening) => {
    const inner = textInnerRef.current;
    if (!inner) return;
    textCycleAnimRef.current?.kill();

    const currentLabel = opening ? 'Menu' : 'Close';
    const targetLabel = opening ? 'Close' : 'Menu';
    const cycles = 3;
    const seq = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === 'Menu' ? 'Close' : 'Menu';
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);
    setTextLines(seq);

    gsap.set(inner, { yPercent: 0 });
    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;
    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: 'power4.out',
    });
  }, []);

  /* ── Toggle handler ────────────────────────── */
  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);
    animateIcon(target);
    animateText(target);
  }, [animateIcon, animateText]);

  /* ── Close handler (called from StaggeredMenu) */
  const closeMenu = useCallback(() => {
    if (openRef.current) {
      openRef.current = false;
      setOpen(false);
      animateIcon(false);
      animateText(false);
    }
  }, [animateIcon, animateText]);

  /* ── Auto-close on route change ────────────── */
  useEffect(() => {
    closeMenu();
    setActiveSubmenu(null);
  }, [pathname, hash, closeMenu]);

  const renderSubmenu = (links, closeFn) => (
    <ul className="submenu" role="menu">
      {links.map((link) => (
        <li className="submenu__item" key={link.to}>
          <Link to={link.to} className="submenu__link" onClick={closeFn}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <header className="site-header" role="banner">
        <div className="site-header_inner">
          {/* Mobile toggle — replaces old MenuIcon hamburger */}
          <button
            ref={toggleBtnRef}
            className="site-header_menuBtn"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={toggleMenu}
            type="button"
          >
            <span className="sm-toggle-textWrap" aria-hidden="true">
              <span ref={textInnerRef} className="sm-toggle-textInner">
                {textLines.map((l, i) => (
                  <span className="sm-toggle-line" key={i}>
                    {l}
                  </span>
                ))}
              </span>
            </span>
            <span ref={iconRef} className="sm-icon" aria-hidden="true">
              <span ref={plusHRef} className="sm-icon-line" />
              <span ref={plusVRef} className="sm-icon-line sm-icon-line-v" />
            </span>
          </button>

          <div className="site-header_brand">
            <Link to="/" className="brand_link" aria-label="Home">
              <GradientText
                colors={['#ffb029', '#FF9FFC', '#B19EEF']}
                animationSpeed={8}
                showBorder={false}
                className="custom-class"
              >
                switch <br /> case <br /> studio
              </GradientText>
            </Link>
          </div>

          <HeaderCTA />

          <nav className="site-header_nav" aria-label="Primary">
            <ul className="nav_list">
              <li className="nav_item">
                <Link to="/#about" className="nav_link">
                  About
                </Link>
              </li>
              <li className="nav_item">
                <Link to="/#services" className="nav_link">
                  Services
                </Link>
              </li>

              {/* Pricing Submenu */}
              <li
                className={`nav_item nav_item--has-submenu ${
                  activeSubmenu === 'pricing' ? 'is-open' : ''
                }`}
                onMouseEnter={() => setActiveSubmenu('pricing')}
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                <Link
                  to="/"
                  className="nav_link"
                  onClick={() => setActiveSubmenu(null)}
                >
                  Pricing
                </Link>
                {renderSubmenu(PRICING_LINKS, () => setActiveSubmenu(null))}
              </li>

              {/* Projects Submenu */}
              <li
                className={`nav_item nav_item--has-submenu ${
                  activeSubmenu === 'projects' ? 'is-open' : ''
                }`}
                onMouseEnter={() => setActiveSubmenu('projects')}
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                <Link
                  to="/#projects"
                  className="nav_link"
                  onClick={() => setActiveSubmenu(null)}
                >
                  Case Studies
                </Link>
                {renderSubmenu(PROJECT_LINKS, () => setActiveSubmenu(null))}
              </li>

              <li className="nav_item">
                <Link to="/#testimonials" className="nav_link">
                  Reviews
                </Link>
              </li>
              <li className="nav_item">
                <Link to="/#contact" className="nav_link">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* StaggeredMenu replaces MenuModal — visible on tablet/mobile only */}
      <StaggeredMenu
        open={open}
        onClose={closeMenu}
        position="right"
        colors={['#1a1a1a', '#2a1a35']}
        accentColor="#ff834a"
      />
    </>
  );
};

export default Header;
