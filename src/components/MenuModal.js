import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import logo from '../assets/images/logo.png';
import MenuIcon from './MenuIcon';
import '../styles/components/menuModal.scss';

const MenuModal = ({ open, onClose }) => {
  const firstLinkRef = useRef(null);
  const [openPricing, setOpenPricing] = useState(false);
  const [openProjects, setOpenProjects] = useState(false);
  const submenuId = 'mm-pricing-submenu';
  const projectsSubmenuId = 'mm-projects-submenu';

  // focus and scroll lock
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const t = setTimeout(() => firstLinkRef.current?.focus(), 0);
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      clearTimeout(t);
      html.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  // Close accordions when modal closes
  useEffect(() => {
    if (!open) {
      setOpenPricing(false);
      setOpenProjects(false);
    }
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="menu-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
        >
          <button
            className="menu-modal__close"
            type="button"
            aria-label="Close menu"
            onClick={onClose}
          >
            <MenuIcon open size={28} />
          </button>

          <motion.div
            className="menu-modal__overlay"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />

          <motion.div
            className="menu-modal__panel"
            initial={{ y: -8, opacity: 0.98 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {/* Col 1 - Logo */}
            <div className="menu-modal__col menu-modal__col--brand">
              <Link to="/" onClick={onClose} className="brand_link">
                <img src={logo} alt="Switch Case Studio logo" width={'75px'} />
              </Link>
            </div>

            {/* Col 2 - Main menu */}
            <nav
              className="menu-modal__col menu-modal__col--primary"
              aria-label="Primary"
            >
              <ul className="menu-modal__list menu-modal__list--primary">
                <li>
                  <a ref={firstLinkRef} href="#services" onClick={onClose}>
                    Services
                  </a>
                </li>

                <li>
                  <a href="#about" onClick={onClose}>
                    About
                  </a>
                </li>

                {/* Pricing accordion */}
                <li className={`has-submenu ${openPricing ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className="menu-modal__toggle"
                    aria-expanded={openPricing ? 'true' : 'false'}
                    aria-controls={submenuId}
                    onClick={() => setOpenPricing((v) => !v)}
                  >
                    Pricing
                  </button>

                  <AnimatePresence initial={false}>
                    {openPricing && (
                      <motion.ul
                        id={submenuId}
                        className="menu-modal__submenu"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                      >
                        <li>
                          <Link to="/pricing/web-development" onClick={onClose}>
                            Web Development
                          </Link>
                        </li>
                        <li>
                          <Link to="/pricing/marketing-ads" onClick={onClose}>
                            Marketing & Advertisement
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/pricing/hosting-maintenance"
                            onClick={onClose}
                          >
                            Web Hosting & Maintenance
                          </Link>
                        </li>
                        <li>
                          <Link to="/pricing/design-branding" onClick={onClose}>
                            Design & Branding
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/pricing/automation-integrations"
                            onClick={onClose}
                          >
                            Automation & Integrations
                          </Link>
                        </li>
                        <li>
                          <Link to="/pricing/email-marketing" onClick={onClose}>
                            Email Marketing
                          </Link>
                        </li>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>

                {/* Projects accordion */}
                <li className={`has-submenu ${openProjects ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className="menu-modal__toggle"
                    aria-expanded={openProjects ? 'true' : 'false'}
                    aria-controls={projectsSubmenuId}
                    onClick={() => setOpenProjects((v) => !v)}
                  >
                    Projects
                  </button>

                  <AnimatePresence initial={false}>
                    {openProjects && (
                      <motion.ul
                        id={projectsSubmenuId}
                        className="menu-modal__submenu"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                      >
                        <li>
                          <Link to="/projects/zahav-medspa" onClick={onClose}>
                            Zahav Medspa
                          </Link>
                        </li>
                        <li>
                          <Link to="/projects/prodani-miami" onClick={onClose}>
                            ProDani Miami
                          </Link>
                        </li>
                        <li>
                          <Link to="/projects/creatuwheels" onClick={onClose}>
                            Creatuwheels
                          </Link>
                        </li>
                        <li>
                          <Link to="/projects/maritime" onClick={onClose}>
                            Maritime
                          </Link>
                        </li>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>

                <li>
                  <a href="#testimonials" onClick={onClose}>
                    Reviews
                  </a>
                </li>
                <li>
                  <a href="#projects" onClick={onClose}>
                    Projects
                  </a>
                </li>
                <li>
                  <a href="#contact" onClick={onClose}>
                    Contact Us
                  </a>
                </li>
              </ul>
            </nav>

            {/* Col 3 - Secondary */}
            <div className="menu-modal__col menu-modal__col--secondary">
              <ul className="menu-modal__list">
                <li>
                  <a
                    className="menu-modal__cta"
                    href="https://calendar.app.google/83UCJjis2FHUrr1s6"
                    target="_blank"
                    rel="noreferrer"
                    onClick={onClose}
                  >
                    Book a free call
                  </a>
                </li>
                <li>
                  <Link to="/privacy" onClick={onClose}>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" onClick={onClose}>
                    Terms of Use
                  </Link>
                </li>
                <li>
                  <Link to="/accessibility" onClick={onClose}>
                    Accessibility Statement
                  </Link>
                </li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default MenuModal;
