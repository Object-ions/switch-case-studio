import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchengin } from '@fortawesome/free-brands-svg-icons';
import {
  faCode,
  faServer,
  faPenNib,
  faWandMagicSparkles,
  faLightbulb,
} from '@fortawesome/free-solid-svg-icons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// import ScrollingText from '../ScrollingText';
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

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  useEffect(() => {
    const reveals = gsap.utils.toArray('.reveal');

    reveals.forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: i * 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }, []);

  return (
    <div id="services">
      <div className="services-hero">
        <div className="title reveal">
          <h1>We</h1>
          <h1>Help</h1>
          <h1>You</h1>
          <h1>SHINE</h1>
          <p>In the competitive digital landscape</p>
        </div>

        <div className="bauhaus-bg reveal">
          <Bauhaus />
        </div>
      </div>

      <div className="services-content">
        {servicesData.map((service, index) => (
          <Link
            to={`/services/${service.link}`}
            className="services-card reveal cursor-black"
            key={index}
          >
            <h3>
              <FontAwesomeIcon icon={iconMap[service.icon]} />
            </h3>
            <h3>{service.title}</h3>
            <p>{service.subTitle}</p>
          </Link>
        ))}
      </div>

      <div>{/* <ScrollingText /> */}</div>
    </div>
  );
};

export default Services;
