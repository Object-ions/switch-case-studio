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
import servicesData from '../../data/services.json';
import SwitchCaseArt from '../SwitchCaseArt';
import '../../styles/components/services.scss';

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

    const titleEl = document.querySelector('.title');

    const handleMouseMove = (e) => {
      const rect = titleEl.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      titleEl.style.setProperty('--x', `${x}px`);
      titleEl.style.setProperty('--y', `${y}px`);
    };

    titleEl.addEventListener('mousemove', handleMouseMove);

    return () => {
      titleEl.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div id="services">
      <div className="services-hero">
        <div className="title reveal">
          <h2 data-text="We Help You Shine">We Help You Shine</h2>
          <h1 data-text="SHINE">SHINE</h1>
          <p data-text="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Itaque saepe, harum quaerat labore esse, fugit officiis, porro delectus obcaecati corrupti laudantium earum alias ipsum quae at eum reprehenderit voluptas rem!">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Itaque
            saepe, harum quaerat labore esse, fugit officiis, porro delectus
            obcaecati corrupti laudantium earum alias ipsum quae at eum
            reprehenderit voluptas rem!
          </p>
        </div>

        <SwitchCaseArt />
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

      <div className="gradient-mask" />
    </div>
  );
};

export default Services;
