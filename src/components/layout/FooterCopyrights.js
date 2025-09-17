import { Link } from "react-router-dom";
import "../../styles/components/footer.scss";
import LogoAnimatedFooter from "../LogoAnimatedFooter";

const FooterCopyrights = () => {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="stripe-bg" />

      {/* 1/4 Brand */}
      <div className="site-footer_brand">
        <LogoAnimatedFooter />
      </div>

      {/* 1/4 Site nav (matches header) */}
      <div className="site-footer_col">
        <ul>
          <li>
            <a href="#services">Services</a>
          </li>
          <li>
            <a href="#work">About</a>
          </li>
          <li>
            <Link to="/pricing">Pricing</Link>
          </li>
          <li>
            <a href="#testimonials">Reviews</a>
          </li>
          <li>
            <a href="#projects">Projects</a>
          </li>
          <li>
            <a href="#contact">Contact Us</a>
          </li>
        </ul>
      </div>

      {/* 1/4 Legal */}
      <div className="site-footer_col">
        <ul>
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

      {/* 1/4 Copyright */}
      <div className="site-footer_copy">
        <p>
          © {new Date().getFullYear()} <br /> Switch Case Studio LLC
        </p>
      </div>
    </footer>
  );
};

export default FooterCopyrights;
