import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchengin } from '@fortawesome/free-brands-svg-icons';
import {
  faCode,
  faServer,
  faPenNib,
  faWandMagicSparkles,
  faLightbulb,
} from '@fortawesome/free-solid-svg-icons';
import ScrollingText from '../ScrollingText';

import '../../styles/components/services.scss';
const Services = () => {
  return (
    <div id="services">
      <div className="services-content">
        <div className="title">
          <h1>SERVICES</h1>
          <p>
            At Switch Case, we're not just about coding—we're about creating
            solutions that elevate your digital presence. Here's how we can help
            you shine in the competitive digital landscape:
          </p>
        </div>

        <div className="dev">
          <h3>
            <FontAwesomeIcon icon={faCode} /> Web Design and Development
          </h3>
          <p>
            From stunning websites to complex web applications, we build it all
            with precision and creativity. Each project is crafted to meet your
            unique needs, ensuring a seamless user experience that converts
            visitors into customers.
          </p>
        </div>

        <div className="seo">
          <h3>
            <FontAwesomeIcon icon={faSearchengin} /> Search Engine Optimization
            (SEO)
          </h3>
          <p>
            Maximize your online visibility. Our SEO experts not only optimize
            your new website from the ground up but also offer ongoing SEO
            services to keep you on top of search results and ahead of the
            competition.
          </p>
        </div>

        <div className="hosting">
          <h3>
            <FontAwesomeIcon icon={faServer} /> Web Hosting
          </h3>
          <p>
            Our reliable web hosting services ensure that your site remains
            secure and accessible around the clock. We handle the technical
            details while you enjoy the profits from reselling hosting as part
            of your business model.
          </p>
        </div>

        <div className="graphic">
          <h3>
            <FontAwesomeIcon icon={faPenNib} /> Graphic Design
          </h3>
          <p>
            Let your brand speak visually. Our graphic design team creates
            impactful designs, from logos and branding to flyers and
            infographics. Each piece is designed to communicate and resonate
            with your target audience effectively.
          </p>
        </div>

        <div className="ads">
          <h3>
            <FontAwesomeIcon icon={faWandMagicSparkles} /> Ad Management
          </h3>
          <p>
            Reach your audience where they are. We set up and manage ads on
            platforms like Google and Facebook, focusing on precise targeting
            and optimal ad spend to increase your ROI.
          </p>
        </div>

        <div className="email">
          <h3>
            <FontAwesomeIcon icon={faLightbulb} /> Email Marketing
          </h3>
          <p>
            Engage your customers with thoughtful email marketing campaigns.
            From concept to execution, we handle newsletters, promotional
            emails, and automated sequences that drive engagement and sales.
          </p>
        </div>

        <ScrollingText />
      </div>
    </div>
  );
};

export default Services;
