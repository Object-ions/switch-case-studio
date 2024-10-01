import { useState, useEffect } from 'react';
import '../../styles/components/header.scss';

const Header = () => {
  const [brandText, setBrandText] = useState('< Switch Case />');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 840) {
        setBrandText('< SC />');
      } else {
        setBrandText('< Switch Case />');
      }
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header>
      <div className="header">
        <a href="#home" className="brand">
          {brandText}
        </a>

        <div className="navbar">
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#pricing">Pricing</a>
          <a href="#work">Work</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#contact" className="contact">
            Contact
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
