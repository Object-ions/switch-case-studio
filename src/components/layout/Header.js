import { Link, useLocation } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import logo from '../../assets/images/logo.png';
import HeaderCTA from './HeaderCTA';
import MenuIcon from '../MenuIcon';
import MenuModal from '../MenuModal';
import '../../styles/components/header.scss';

const Header = () => {
  const logoRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false); // Pricing submenu
  const [projectsOpen, setProjectsOpen] = useState(false); // Projects submenu
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Close any menus on route change
    setOpen(false);
    setSubmenuOpen(false);
    setProjectsOpen(false);
  }, [pathname, hash]);

  const handleHover = () => logoRef.current?.replay();

  return (
    <>
      <header className="site-header" role="banner">
        <div className="site-header_inner">
          <button
            className="site-header_menuBtn"
            aria-controls="site-menu"
            aria-expanded={open}
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <MenuIcon open={false} size={28} />
          </button>

          <div className="site-header_brand">
            <Link
              to="/"
              className="brand_link"
              aria-label="Switch Case Studio home"
              onMouseEnter={handleHover}
            >
              <img src={logo} alt="Switch Case Studio logo" width={'75px'} />
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

              {/* Pricing submenu */}
              <li
                className={`nav_item nav_item--has-submenu ${
                  submenuOpen ? 'is-open' : ''
                }`}
                onMouseEnter={() => setSubmenuOpen(true)}
                onMouseLeave={() => setSubmenuOpen(false)}
              >
                <Link
                  to="/"
                  className="nav_link"
                  onClick={() => setSubmenuOpen(false)}
                >
                  Pricing
                </Link>
                <ul className="submenu" role="menu" aria-hidden={!submenuOpen}>
                  <li className="submenu__item">
                    <Link
                      to="/pricing/web-development"
                      className="submenu__link"
                      onClick={() => setSubmenuOpen(false)}
                    >
                      Web Development
                    </Link>
                  </li>
                  <li className="submenu__item">
                    <Link
                      to="/pricing/marketing-ads"
                      className="submenu__link"
                      onClick={() => setSubmenuOpen(false)}
                    >
                      Marketing & Advertisement
                    </Link>
                  </li>
                  <li className="submenu__item">
                    <Link
                      to="/pricing/hosting-maintenance"
                      className="submenu__link"
                      onClick={() => setSubmenuOpen(false)}
                    >
                      Web Hosting & Maintenance
                    </Link>
                  </li>
                  <li className="submenu__item">
                    <Link
                      to="/pricing/design-branding"
                      className="submenu__link"
                      onClick={() => setSubmenuOpen(false)}
                    >
                      Design & Branding
                    </Link>
                  </li>
                  <li className="submenu__item">
                    <Link
                      to="/pricing/automation-integrations"
                      className="submenu__link"
                      onClick={() => setSubmenuOpen(false)}
                    >
                      Automation & Integrations
                    </Link>
                  </li>
                  <li className="submenu__item">
                    <Link
                      to="/pricing/email-marketing"
                      className="submenu__link"
                      onClick={() => setSubmenuOpen(false)}
                    >
                      Email Marketing
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Projects submenu */}
              <li
                className={`nav_item nav_item--has-submenu ${
                  projectsOpen ? 'is-open' : ''
                }`}
                onMouseEnter={() => setProjectsOpen(true)}
                onMouseLeave={() => setProjectsOpen(false)}
              >
                <Link
                  to="/#projects"
                  className="nav_link"
                  onClick={() => setProjectsOpen(false)}
                >
                  Projects
                </Link>
                <ul className="submenu" role="menu" aria-hidden={!projectsOpen}>
                  <li className="submenu__item">
                    <Link
                      to="/projects/zahav-medspa"
                      className="submenu__link"
                      onClick={() => setProjectsOpen(false)}
                    >
                      Zahav Medspa
                    </Link>
                  </li>
                  <li className="submenu__item">
                    <Link
                      to="/projects/prodani-miami"
                      className="submenu__link"
                      onClick={() => setProjectsOpen(false)}
                    >
                      ProDani Miami
                    </Link>
                  </li>
                  <li className="submenu__item">
                    <Link
                      to="/projects/creatuwheels"
                      className="submenu__link"
                      onClick={() => setProjectsOpen(false)}
                    >
                      Creatuwheels
                    </Link>
                  </li>
                  <li className="submenu__item">
                    <Link
                      to="/projects/maritime"
                      className="submenu__link"
                      onClick={() => setProjectsOpen(false)}
                    >
                      Maritime
                    </Link>
                  </li>
                </ul>
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
