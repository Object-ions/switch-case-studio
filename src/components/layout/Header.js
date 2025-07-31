import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import '../../styles/components/header.scss';

const Header = () => {
  const [brandText, setBrandText] = useState('< Switch Case />');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHomeSection, setIsHomeSection] = useState(true);

  // Handle resize
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
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      const homeSection = document.getElementById('home');
      if (!homeSection) return;

      const rect = homeSection.getBoundingClientRect();
      const isInView = rect.bottom > 80; // still mostly in view
      setIsHomeSection(isInView);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className={isHomeSection ? 'header-home' : 'header'}>
      <div className="header">
        <div className="brand">
          <Link to="/">{brandText}</Link>
        </div>

        <div className="navbar-hamburger" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} />
        </div>

        <div className="navbar">
          <a href="#services">Services</a>
          <a href="#work">About</a>
          <a href="#testimonials">Reviews</a>
          <a href="#contact">Contact</a>
        </div>
      </div>

      {isMenuOpen && (
        <div className="modal">
          <div className="modal-close" onClick={toggleMenu}>
            <FontAwesomeIcon icon={faTimes} />
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
