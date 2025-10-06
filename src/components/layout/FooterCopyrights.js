import { Link } from 'react-router-dom';
import LogoAnimatedFooter from '../LogoAnimatedFooter';
import HeaderCTA from './HeaderCTA';
import '../../styles/components/footer.scss';

const FooterCopyrights = () => {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="stripe-bg" />

      {/* 1/4 Brand */}
      <div className="site-footer_brand">
        <LogoAnimatedFooter />
        <br />
        <br />
        <p>
          © {new Date().getFullYear()} <br /> Switch Case Studio LLC
        </p>
      </div>

      {/* 1/4 Site nav (matches header) */}
      <div className="site-footer_col">
        <ul className="site-footer_nav">
          <li>
            <a href="#services">Services</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <Link to="/pricing">Pricing</Link>
          </li>
          <li>
            <a href="#testimonials">Reviews</a>
          </li>

          <li>
            <a href="#contact">Contact Us</a>
          </li>
        </ul>
      </div>

      {/* 1/4 Legal */}
      <div className="site-footer_col">
        <ul>
          {/* Projects + deep links that open the modal */}
          <li className="has-submenu">
            <Link to="/projects">Projects</Link>
            <ul className="site-footer_submenu">
              <li>
                <Link to="/projects/zahav-medspa">Zahav Medspa</Link>
              </li>
              <li>
                <Link to="/projects/prodani-miami">ProDani Miami</Link>
              </li>
              <li>
                <Link to="/projects/creatuwheels">Creatuwheels</Link>
              </li>
              <li>
                <Link to="/projects/maritime">Maritime</Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      {/* 1/4 Copyright */}
      <div className="site-footer_copy">
        <ul>
          <li>
            <HeaderCTA />
          </li>
          <li>
            {' '}
            <br />
            <br />
          </li>
          <li>
            <Link to="/privacy">Privacy Policy</Link>
          </li>
          <li>
            <Link to="/terms">Terms of Use</Link>
          </li>
          <li>
            <Link to="/accessibility">Accessibility Statement</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default FooterCopyrights;
