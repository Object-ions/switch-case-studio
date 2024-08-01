import { Link } from 'react-router-dom';
import FooterCopyrights from './FooterCopyrights';
import '../../styles/components/footer.scss';

const Footer = () => {
  return (
    <footer>
      <div className="information">
        <div className="location">
          <h3>LOCATION:</h3>
          <p>1447 NW 12th ave, Portland, OR, 97209</p>
        </div>
        <div className="hours">
          <h3>OPENING HOURS:</h3>
          <p>
            Monday to Friday 7.00AM - 3.30PM
            <br />
            Saturday 7.30AM - 1.00PM
            <br />
            Sunday - Closed
          </p>
        </div>
        <div className="services">
          <h3>SERVICES:</h3>
          <ul>
            <li>Web Design and Development</li>
            <li>SEO and Web Hosting</li>
            <li>Graphic Design</li>
            <li>Email Marketing</li>
          </ul>
        </div>
        <div className="map">
          <h3>QUICK LINKS:</h3>
          <ul>
            <li>
              <Link to="/">Privacy Policy </Link>
            </li>
            <li>
              <Link to="/">General Policies </Link>
            </li>
            <li>
              <Link to="/">About </Link>
            </li>
            <li>
              <Link to="/">Contact </Link>
            </li>
          </ul>
        </div>
      </div>
      <FooterCopyrights />
    </footer>
  );
};

export default Footer;
