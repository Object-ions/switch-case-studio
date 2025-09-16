import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import SCSLogo from "./SCSLogo";
import MenuIcon from "./MenuIcon";
import "../styles/components/menuModal.scss";

const MenuModal = ({ open, onClose }) => {
  const firstLinkRef = useRef(null);

  // focus + scroll lock
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => firstLinkRef.current?.focus(), 0);
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
      html.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

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
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {/* Col 1 - Logo */}
            <div className="menu-modal__col menu-modal__col--brand">
              <Link to="/" onClick={onClose} className="brand_link">
                <SCSLogo width={72} height={72} />
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
                  <a href="#work" onClick={onClose}>
                    About
                  </a>
                </li>
                <li>
                  <a href="#pricing" onClick={onClose}>
                    Packages
                  </a>
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
                    href="https://link.foreverbooked.com/widget/booking/ec8dal2CrxqAOd9QwKc2"
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
