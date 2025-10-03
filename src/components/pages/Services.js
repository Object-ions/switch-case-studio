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

    // Title hover circle effect (guard in case .title isn't on page yet)
    const titleEl = document.querySelector('.title');
    const handleTitleMouseMove = (e) => {
      if (!titleEl) return;
      const rect = titleEl.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      titleEl.style.setProperty('--x', `${x}px`);
      titleEl.style.setProperty('--y', `${y}px`);
    };
    if (titleEl) titleEl.addEventListener('mousemove', handleTitleMouseMove);

    // Card hover circle effect + proper cleanup
    const cards = Array.from(document.querySelectorAll('.services-card'));
    const handlers = new Map();

    cards.forEach((card) => {
      const handleCardMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
      };
      handlers.set(card, handleCardMouseMove);
      card.addEventListener('mousemove', handleCardMouseMove);
    });

    // Cleanup
    return () => {
      if (titleEl)
        titleEl.removeEventListener('mousemove', handleTitleMouseMove);
      cards.forEach((card) => {
        const h = handlers.get(card);
        if (h) card.removeEventListener('mousemove', h);
      });
    };
  }, []);

  return (
    <div id="services">
      <div className="services-hero">
        <div className="title reveal">
          <h2>
            Switch Case is a creative development and marketing studio that
            helps businesses stand out and SHINE. Whether you're building
            something new or refreshing what you have, we give your brand the
            tools it needs <br /> to stand out and grow.
          </h2>
        </div>
      </div>

      <div className="services-content">
        {servicesData.map((service, index) => (
          <Link
            key={index}
            to={`/pricing/${service.slug}`}
            className="services-card reveal cursor-black"
            aria-label={`${service.title} pricing`}
          >
            <h3>
              <FontAwesomeIcon icon={iconMap[service.icon]} />
            </h3>
            <h3>{service.title}</h3>
            <p>{service.subTitle}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Services;
