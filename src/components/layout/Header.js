import { Link } from 'react-router-dom';
import { useRef } from 'react';
import Logotype from '../../assets/images/type.svg';
import SCSLogo from '../SCSLogo';
import '../../styles/components/header.scss';

const Header = () => {
  const logoRef = useRef(null);

  const handleHover = () => {
    logoRef.current?.replay();
  };

  return (
    <header className="site-header" role="banner">
      <div className="site-header_inner">
        <div className="site-header_brand">
          <Link 
            to="/" 
            className="brand_link" 
            aria-label="Switch Case Studio home"
            onMouseEnter={handleHover}
          >
            <SCSLogo ref={logoRef} width={40} height={40} />
            <img
              src={Logotype}
              alt="Switch Case Studio"
              className="brand_logotype"
            />
          </Link>
        </div>

        <nav className="site-header_nav" aria-label="Primary">
          <ul className="nav_list">
            <li className="nav_item"><a href="#services">Services</a></li>
            <li className="nav_item"><a href="#work">About</a></li>
            <li className="nav_item"><a href="#projects">Projects</a></li>
            <li className="nav_item"><a href="#testimonials">Reviews</a></li>
            <li className="nav_item"><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
