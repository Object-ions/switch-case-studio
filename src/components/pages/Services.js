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
    // Scroll reveal animation
    const reveals = gsap.utils.toArray('.reveal');

    reveals.forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: i * 0.25,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    // Title hover circle effect
    const titleEl = document.querySelector('.title');

    const handleMouseMove = (e) => {
      const rect = titleEl.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      titleEl.style.setProperty('--x', `${x}px`);
      titleEl.style.setProperty('--y', `${y}px`);
    };

    titleEl.addEventListener('mousemove', handleMouseMove);

    // Card hover circle effect
    const cards = document.querySelectorAll('.services-card');

    cards.forEach((card) => {
      const handleCardMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
      };

      card.addEventListener('mousemove', handleCardMouseMove);

      // Cleanup
      return () => {
        card.removeEventListener('mousemove', handleCardMouseMove);
      };
    });

    // Cleanup for title
    return () => {
      titleEl.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div id="services">
      <div className="services-hero">
        <div className="title reveal">
          <h2>We Help You</h2>
          <h1>SHINE</h1>
          <p>
            By blending bold design, custom development, and smart marketing
            into digital work that actually works. From websites that convert to
            branding that sticks, we handle it all - including SEO, Meta and
            Google Ads, email marketing, content strategy, and ongoing hosting
            and support. Whether you're building something new or refreshing
            what you have, we give your brand the tools it needs to stand out
            and grow.
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
