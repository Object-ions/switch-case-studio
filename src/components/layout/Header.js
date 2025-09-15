import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import SCSLogo from '../SCSLogo';
import HeaderCTA from './HeaderCTA';
import MenuIcon from '../MenuIcon';
import MenuModal from '../MenuModal';
import '../../styles/components/header.scss';

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

          {/* Brand spans two rows (from your previous step) */}
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

          {/* CTA top-right (hidden on small screens) */}
          <HeaderCTA />

          {/* Desktop nav (hidden on small screens) */}
          <nav className="site-header_nav" aria-label="Primary">
            <ul className="nav_list">
              <li className="nav_item">
                <a href="#work">About</a>
              </li>
              <li className="nav_item">
                <a href="#services">Services</a>
              </li>
              <li className="nav_item">
                <a href="#pricing">Pricing</a>
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
