import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from '../../assets/images/logo.png';
import HeaderCTA from './HeaderCTA';
import MenuIcon from '../MenuIcon';
import MenuModal from '../MenuModal';
import { PRICING_LINKS, PROJECT_LINKS } from '../../data/navigation';
import '../../styles/components/header.scss';

const Header = () => {
  const [open, setOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const { pathname, hash } = useLocation();

  useEffect(() => {
    setOpen(false);
    setActiveSubmenu(null);
  }, [pathname, hash]);

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
          <button
            className="site-header_menuBtn"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <MenuIcon open={false} size={28} />
          </button>

          <div className="site-header_brand">
            <Link to="/" className="brand_link" aria-label="Home">
              <img src={logo} alt="Switch Case Studio" width="75px" />
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
                  Projects
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

      <MenuModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default Header;
