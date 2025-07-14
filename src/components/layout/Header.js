import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import '../../styles/components/header.scss';
import { Link } from 'react-router-dom';

const Header = () => {
  const [brandText, setBrandText] = useState('< Switch Case />');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 660) {
        setBrandText('< Switch Case Studio />');
      } else if (window.innerWidth < 840) {
        setBrandText('< SCS />');
      } else {
        setBrandText('< Switch Case Studio />');
      }
    };

    window.addEventListener('resize', handleResize);

    // Call the handler right away so the correct value is set based on the initial screen size
    handleResize();

    // Cleanup the event listener when the component is unmounted
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <div className="header">
        <div className="brand">
          <Link to="/">{brandText}</Link>
        </div>

        {/* Hamburger icon for screens less than 660px */}
        <div className="navbar-hamburger" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} />
        </div>

        {/* Full navbar for larger screens */}
        <div className="navbar">
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#work">Work</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#contact">Contact</a>
        </div>
      </div>

      {/* Modal menu for small screens */}
      {isMenuOpen && (
        <div className="modal">
          <div className="modal-close" onClick={toggleMenu}>
            <FontAwesomeIcon
              icon={faTimes}
              style={{ color: '$orange-color' }}
            />
          </div>
          <div className="modal-content">
            <div className="modal-brand">{'< Switch Case />'}</div>
            <div className="modal-links">
              <a href="#about" onClick={toggleMenu}>
                About
              </a>
              <a href="#services" onClick={toggleMenu}>
                Services
              </a>
              <a href="#pricing" onClick={toggleMenu}>
                Pricing
              </a>
              <a href="#work" onClick={toggleMenu}>
                Work
              </a>
              <a href="#testimonials" onClick={toggleMenu}>
                Testimonials
              </a>
              <a href="#contact" onClick={toggleMenu}>
                Contact
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
