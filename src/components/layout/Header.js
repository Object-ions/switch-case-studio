// src/components/layout/Header.js
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import SCSLogo from "../SCSLogo";
import HeaderCTA from "./HeaderCTA";
import MenuIcon from "../MenuIcon";
import MenuModal from "../MenuModal";
import "../../styles/components/header.scss";

const Header = () => {
  const logoRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleHover = () => logoRef.current?.replay();

  return (
    <>
      <header className="site-header" role="banner">
        <div className="site-header_inner">
          {/* Mobile menu button */}
          <button
            className="site-header_menuBtn"
            aria-controls="site-menu"
            aria-expanded={open}
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <MenuIcon open={false} size={28} />
          </button>

          {/* Brand */}
          <div className="site-header_brand">
            <Link
              to="/"
              className="brand_link"
              aria-label="Switch Case Studio home"
              onMouseEnter={handleHover}
            >
              <SCSLogo ref={logoRef} width={200} height="auto" />
            </Link>
          </div>

          {/* CTA top-right */}
          <HeaderCTA />

          {/* Desktop nav */}
          <nav className="site-header_nav" aria-label="Primary">
            <ul className="nav_list">
              <li className="nav_item">
                <a href="#work">About</a>
              </li>
              <li className="nav_item">
                <a href="#services">Services</a>
              </li>

              {/* Pricing + submenu (desktop, CSS-only) */}
              <li className="nav_item nav_item--has-submenu">
                <Link to="/pricing" className="nav_link">
                  Pricing
                </Link>
                <ul className="submenu">
                  <li className="submenu__item">
                    <Link
                      to="/pricing/web-development"
                      className="submenu__link"
                    >
                      Web Development
                    </Link>
                  </li>
                  <li className="submenu__item">
                    <Link to="/pricing/marketing-ads" className="submenu__link">
                      Marketing & Advertisement
                    </Link>
                  </li>
                  <li className="submenu__item">
                    <Link
                      to="/pricing/hosting-maintenance"
                      className="submenu__link"
                    >
                      Web Hosting & Maintenance
                    </Link>
                  </li>
                  <li className="submenu__item">
                    <Link
                      to="/pricing/design-branding"
                      className="submenu__link"
                    >
                      Design & Branding
                    </Link>
                  </li>
                  <li className="submenu__item">
                    <Link
                      to="/pricing/automation-integrations"
                      className="submenu__link"
                    >
                      Automation & Integrations
                    </Link>
                  </li>
                  <li className="submenu__item">
                    <Link
                      to="/pricing/email-marketing"
                      className="submenu__link"
                    >
                      Email Marketing
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="nav_item">
                <a href="#projects">Projects</a>
              </li>
              <li className="nav_item">
                <a href="#testimonials">Reviews</a>
              </li>
              <li className="nav_item">
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <MenuModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default Header;
