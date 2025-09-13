import { Link } from "react-router-dom";
import Logotype from "../../assets/images/logo-light.png";
import "../../styles/components/footer.scss";

const FooterCopyrights = () => {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="stripe-bg" />
      {/* 1/4 Brand */}
      <div className="site-footer_brand">
        <img
          src={Logotype}
          alt="Switch Case Studio"
          className="brand_logotype"
          height="100px"
          width="100px"
        />
      </div>

      {/* 1/4 Social */}
      <div className="site-footer_col">
        <ul>
          <li>
            <Link to="/privacy">Services</Link>
          </li>
          <li>
            <Link to="/terms">About</Link>
          </li>
          <li>
            <Link to="/accessibility">Packages</Link>
          </li>
          <li>
            <Link to="/sitemap">Reviews</Link>
          </li>
          <li>
            <Link to="/accessibility">Projects</Link>
          </li>
          <li>
            <Link to="/sitemap">Contact Us</Link>
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
        <p>© {new Date().getFullYear()} Switch Case Studio LLC</p>
      </div>
    </footer>
  );
};

export default FooterCopyrights;
