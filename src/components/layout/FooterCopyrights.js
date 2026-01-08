import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import HeaderCTA from './HeaderCTA';
import { PROJECT_LINKS, LEGAL_LINKS } from '../../data/navigation';
import '../../styles/components/footer.scss';

const FooterCopyrights = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="stripe-bg" aria-hidden="true" />

      <div className="site-footer__content">
        {/* Col 1: Brand & Copyright */}
        <div className="footer-col footer-brand">
          <img src={logo} alt="Switch Case Studio" className="footer-logo" />
          <p className="copyright-text">
            &copy; {currentYear} Switch Case Studio LLC
          </p>
        </div>

        {/* Col 2: Main Navigation */}
        <div className="footer-col">
          <h4>Explore</h4>
          <ul className="footer-nav">
            <li>
              <a href="#services">Services</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <Link to="/pricing/web-development">Pricing</Link>
            </li>
            <li>
              <a href="#testimonials">Reviews</a>
            </li>
            <li>
              <a href="#contact">Contact Us</a>
            </li>
          </ul>
        </div>

        {/* Col 3: Projects (Dynamic) */}
        <div className="footer-col">
          <h4>Projects</h4>
          <ul className="footer-nav">
            {PROJECT_LINKS.map((proj) => (
              <li key={proj.to}>
                <Link to={proj.to}>{proj.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Action & Legal (Dynamic) */}
        <div className="footer-col footer-action">
          <div className="footer-cta-wrapper">
            <HeaderCTA />
          </div>

          <ul className="footer-nav legal-nav">
            {LEGAL_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default FooterCopyrights;
