import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SCSLogo from '../ui/SCSLogo';
import { PROJECT_LINKS, LEGAL_LINKS } from '../../data/navigation';
import '../../styles/components/footer.scss';


/* ------------------------------------------------------------------ *
 * Social links
 * Commented out until accounts exist. ESLint disabled for the unused
 * `socials` array so Netlify CI doesn't fail on `no-unused-vars`.
 * To enable: uncomment the relevant entries and the .map() block below.
 * ------------------------------------------------------------------ */
// eslint-disable-next-line no-unused-vars
const socials = [
  // {
  //   key: 'x',
  //   href: 'https://x.com/your-handle',
  //   label: 'X (Twitter)',
  //   icon: (
  //     <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
  //       <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  //     </svg>
  //   ),
  // },
  // {
  //   key: 'ig',
  //   href: 'https://instagram.com/your-handle',
  //   label: 'Instagram',
  //   icon: (
  //     <svg
  //       width="18"
  //       height="18"
  //       viewBox="0 0 24 24"
  //       fill="none"
  //       stroke="currentColor"
  //       strokeWidth="1.8"
  //     >
  //       <rect x="3" y="3" width="18" height="18" rx="5" />
  //       <circle cx="12" cy="12" r="4" />
  //       <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  //     </svg>
  //   ),
  // },
  // {
  //   key: 'li',
  //   href: 'https://linkedin.com/company/your-handle',
  //   label: 'LinkedIn',
  //   icon: (
  //     <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
  //       <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zm7 0h3.8v1.7h.05c.53-1 1.84-2.05 3.78-2.05 4.04 0 4.78 2.66 4.78 6.12V21h-4v-5.5c0-1.3-.02-3-1.83-3s-2.11 1.43-2.11 2.9V21h-4z" />
  //     </svg>
  //   ),
  // },
  // {
  //   key: 'yt',
  //   href: 'https://youtube.com/@your-handle',
  //   label: 'YouTube',
  //   icon: (
  //     <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
  //       <path d="M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 4 12 4 12 4s-7.5 0-9.4.4A3 3 0 0 0 .5 6.5C0 8.4 0 12 0 12s0 3.6.5 5.5a3 3 0 0 0 2.1 2.1C4.5 20 12 20 12 20s7.5 0 9.4-.4a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.5.5-5.5s0-3.6-.5-5.5zM9.6 15.6V8.4l6.4 3.6z" />
  //     </svg>
  //   ),
  // },
];

/* ------------------------------------------------------------------ *
 * In-page anchor helper
 *
 * Why: <a href="#services"> only works on the home route. From any
 * other route (e.g. /projects/zahav, /pricing/...) it does nothing.
 * Using <Link to="/#services"> + a manual scroll-into-view handler
 * makes section anchors work from anywhere.
 * ------------------------------------------------------------------ */
const handleAnchorClick = (e, hash) => {
  // If we're already on home, prevent the route push and just scroll.
  if (window.location.pathname === '/') {
    e.preventDefault();
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  // If on another route, the <Link to="/#services"> default behaviour
  // navigates home; ScrollToTop + the browser's hash handling pick it up.
};

/* ------------------------------------------------------------------ *
 * Column data
 * ------------------------------------------------------------------ */
const SERVICES_LINKS = [
  { label: 'Web Development', to: '/pricing/web-development' },
  { label: 'Brand Identity', to: '/pricing/design-branding' },
  { label: 'Growth & Performance', to: '/pricing/marketing-ads' },
  { label: 'Automation & Systems', to: '/pricing/automation-integrations' },
  { label: 'Email & Retention', to: '/pricing/email-marketing' },
  { label: 'Hosting & Support', to: '/pricing/hosting-maintenance' },
];

const EXPLORE_LINKS = [
  { label: 'Services', hash: '#services' },
  { label: 'About', to: '/about' },
  { label: 'Case Studies', to: '/projects' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Contact', hash: '#contact' },
];

const CONNECT_LINKS = [
  {
    // Unified CTA label (2026-07). The old 'free' badge is dropped: the
    // word is in the label now — "Book a Free Strategy Call  FREE" would
    // say it twice.
    label: 'Book a Free Strategy Call',
    href: 'https://calendar.app.google/83UCJjis2FHUrr1s6',
    external: true,
  },
  { label: 'Email Us', href: 'mailto:hello@switchcasestudio.com' },
];

const CALENDAR_URL = 'https://calendar.app.google/83UCJjis2FHUrr1s6';
const CONTACT_EMAIL = 'hello@switchcasestudio.com';

const Footer = () => {
  const footerRef = useRef(null);
  const currentYear = new Date().getFullYear();

  // Column reveal, built so the footer can NEVER stay invisible (see
  // CLAUDE.md): the old fromTo + toggleActions:reverse left the columns stuck
  // at opacity 0 on mobile (a tall blank void above the footer).
  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const cols = gsap.utils.toArray('.footer-col-animate', footer);
    if (!cols.length) return;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      gsap.set(cols, { clearProps: 'all' });
      return;
    }

    const ctx = gsap.context(() => {
      // gsap.set (not fromTo immediateRender, which re-hides on refresh).
      gsap.set(cols, { opacity: 0, y: 16 });

      const reveal = () =>
        gsap.to(cols, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power2.out',
          overwrite: 'auto',
        });

      const trigger = ScrollTrigger.create({
        trigger: footer,
        start: 'top 90%',
        once: true,
        onEnter: reveal,
      });

      // Already in view at mount? An already-past `once` trigger won't fire.
      if (footer.getBoundingClientRect().top < window.innerHeight * 0.9) {
        reveal();
      }

      // Lazy images shift layout after the trigger is measured.
      footer.querySelectorAll('img').forEach((img) => {
        if (!img.complete) {
          img.addEventListener('load', () => ScrollTrigger.refresh(), {
            once: true,
          });
        }
      });

      // Safety net: the footer must never stay hidden.
      const safety = gsap.delayedCall(2.5, () => {
        if (cols.some((c) => gsap.getProperty(c, 'opacity') < 1)) reveal();
      });

      return () => {
        trigger.kill();
        safety.kill();
      };
    }, footer);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      id="contact"
      className="site-footer"
      role="contentinfo"
    >
      <div className="site-footer__inner">
        {/* ============================================================
         * CTA band — giant email + "Start New Project" button
         * ============================================================ */}
        <div className="footer-cta footer-col-animate">
          <a href={`mailto:${CONTACT_EMAIL}`} className="footer-cta__email">
            {CONTACT_EMAIL}
          </a>
          <br />
          <a
            href={CALENDAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-cta__button"
          >
            Start New Project
          </a>
        </div>

        {/* ============================================================
         * Main grid — Brand | Services | Explore | Case Studies | Connect
         * ============================================================ */}
        <div className="site-footer__grid">
          {/* Brand + tagline + socials */}
          <div className="footer-col footer-col-animate footer-brand">
            <SCSLogo />
            <p className="footer-brand__tagline">
              Websites, stores, and apps built to convert — designed from
              scratch, shipped fast.
            </p>
            {/* Social icons — uncomment entries in the `socials` array above to enable */}
            {socials.length > 0 && (
              <div className="footer-socials">
                {socials.map((s) => (
                  <a
                    key={s.key}
                    href={s.href}
                    aria-label={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-socials__item"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Services */}
          <div className="footer-col footer-col-animate">
            <h4 className="footer-col__title">Services</h4>
            <ul className="footer-nav">
              {SERVICES_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div className="footer-col footer-col-animate">
            <h4 className="footer-col__title">Explore</h4>
            <ul className="footer-nav">
              {EXPLORE_LINKS.map((link) =>
                link.hash ? (
                  <li key={link.hash}>
                    <Link
                      to={`/${link.hash}`}
                      onClick={(e) => handleAnchorClick(e, link.hash)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ) : (
                  <li key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Case Studies */}
          <div className="footer-col footer-col-animate">
            <h4 className="footer-col__title">Case Studies</h4>
            <ul className="footer-nav">
              {PROJECT_LINKS.map((proj) => (
                <li key={proj.to}>
                  <Link to={proj.to}>{proj.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="footer-col footer-col-animate">
            <h4 className="footer-col__title">Connect</h4>
            <ul className="footer-nav">
              {CONNECT_LINKS.map((link) => (
                <li key={link.label} className="footer-nav__item">
                  <a
                    href={link.href}
                    {...(link.external && {
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    })}
                  >
                    {link.label}
                  </a>
                  {link.badge && (
                    <span className="footer-nav__badge">{link.badge}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stenciled wordmark */}
        <div className="footer-wordmark" aria-hidden="true">
          <span className="footer-wordmark__text">switch case</span>
        </div>

        {/* ============================================================
         * Bottom bar — Legal | © Copyright | Built in Portland
         * ============================================================ */}
        <div className="footer-bottom">
          <ul className="footer-bottom__legal">
            {LEGAL_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>

          <p className="footer-bottom__copy">
            &copy; {currentYear} Switch Case Studio LLC
          </p>

          <p className="footer-bottom__tagline">
            Built in Portland, OR — delivered worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
