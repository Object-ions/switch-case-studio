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
import Bauhaus from '../Bauhous';

import '../../styles/components/services.scss';

import servicesData from '../../data/services.json';
const iconMap = {
  faCode,
  faSearchengin,
  faServer,
  faPenNib,
  faWandMagicSparkles,
  faLightbulb,
};

const Services = () => {
  return (
    <div id="services">
      <div className="services-hero">
        <div className="title">
          <h1>We</h1>
          <h1>Help</h1>
          <h1>You</h1>
          <h1>SHINE</h1>
          <p>In the competitive digital landscape</p>
        </div>

        <div className="bauhaus-bg">
          <Bauhaus />
        </div>
      </div>
      <div className="services-content">
        {servicesData.map((service, index) => (
          <div key={index} className="services-card">
            <h3>
              <FontAwesomeIcon icon={iconMap[service.icon]} />
            </h3>
            <h3>{service.title}</h3>
            <p>{service.subTitle}</p>
          </div>
        ))}
      </div>
      <ScrollingText />
    </div>
  );
};

export default Services;
