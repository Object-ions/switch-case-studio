import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import logo from '../assets/images/logo.png';
import MenuIcon from './MenuIcon';
import { PRICING_LINKS, PROJECT_LINKS } from '../data/navigation';
import '../styles/components/menuModal.scss';

// Reusable Accordion Component to clean up the main render
const MenuAccordion = ({ label, items, isOpen, onToggle, onClose }) => {
  return (
    <li className={`has-submenu ${isOpen ? 'is-open' : ''}`}>
      <button
        type="button"
        className="menu-modal__toggle"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        {label}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.ul
            className="menu-modal__submenu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {items.map((item) => (
              <li key={item.to}>
                <Link to={item.to} onClick={onClose}>
                  {item.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};

const MenuModal = ({ open, onClose }) => {
  const [openAccordion, setOpenAccordion] = useState(null); // 'pricing' | 'projects' | null

  // Focus and scroll lock logic
  useEffect(() => {
    if (!open) {
      setOpenAccordion(null);
      return;
    }
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden'; // Safer than document.documentElement usually

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const toggleAccordion = (id) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="menu-modal"
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
        >
          <button
            className="menu-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            <MenuIcon open size={28} />
          </button>

          <motion.div className="menu-modal__overlay" onClick={onClose} />

          <motion.div
            className="menu-modal__panel"
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {/* Col 1 */}
            <div className="menu-modal__col menu-modal__col--brand">
              <Link to="/" onClick={onClose} className="brand_link">
                <img src={logo} alt="Switch Case Studio" width="75px" />
              </Link>
            </div>

            {/* Col 2 */}
            <nav className="menu-modal__col menu-modal__col--primary">
              <ul className="menu-modal__list menu-modal__list--primary">
                <li>
                  <a href="#services" onClick={onClose}>
                    Services
                  </a>
                </li>
                <li>
                  <a href="#about" onClick={onClose}>
                    About
                  </a>
                </li>

                <MenuAccordion
                  label="Pricing"
                  items={PRICING_LINKS}
                  isOpen={openAccordion === 'pricing'}
                  onToggle={() => toggleAccordion('pricing')}
                  onClose={onClose}
                />

                <MenuAccordion
                  label="Case Studies"
                  items={PROJECT_LINKS}
                  isOpen={openAccordion === 'projects'}
                  onToggle={() => toggleAccordion('projects')}
                  onClose={onClose}
                />

                <li>
                  <a href="#testimonials" onClick={onClose}>
                    Testimonials
                  </a>
                </li>
                {/* Note: In your original code you had Projects link AND accordion. 
                    I kept accordion as primary, removed duplicate link to avoid confusion. */}
                <li>
                  <a href="#contact" onClick={onClose}>
                    Contact Us
                  </a>
                </li>
              </ul>
            </nav>

            {/* Col 3 */}
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
