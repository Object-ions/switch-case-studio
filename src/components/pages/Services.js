import { useEffect, useRef } from 'react';
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

/** Shared mousemove handler — sets --x / --y CSS vars on the target element. */
const trackMouse = (e, el) => {
  const rect = el.getBoundingClientRect();
  el.style.setProperty('--x', `${e.clientX - rect.left}px`);
  el.style.setProperty('--y', `${e.clientY - rect.top}px`);
};

const Services = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // --- Scroll reveal animation ---
    const reveals = gsap.utils.toArray('.reveal', section);
    const triggers = reveals.map(
      (el, i) =>
        gsap.fromTo(
          el,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          },
        ).scrollTrigger,
    );

    // --- Title hover circle ---
    const titleEl = section.querySelector('.title');
    const handleTitleMove = (e) => trackMouse(e, titleEl);
    titleEl?.addEventListener('mousemove', handleTitleMove);

    // --- Card hover circles ---
    const cards = section.querySelectorAll('.services-card');
    const handleCardMove = (e) => trackMouse(e, e.currentTarget);
    cards.forEach((card) => card.addEventListener('mousemove', handleCardMove));

    // --- Cleanup ---
    return () => {
      triggers.forEach((t) => t?.kill());
      titleEl?.removeEventListener('mousemove', handleTitleMove);
      cards.forEach((card) =>
        card.removeEventListener('mousemove', handleCardMove),
      );
    };
  }, []);

  return (
    <div id="services" ref={sectionRef}>
      <div className="services-hero">
        <div className="title reveal">
          <h2>
            Switch Case is a creative development and marketing studio that
            helps businesses stand out and{' '}
            <span className="shine-text">SHINE</span>. Whether you're building
            something new or refreshing what you have, we give your brand the
            tools it needs to stand out and grow.
          </h2>
        </div>
      </div>

      <div className="services-content">
        {servicesData.map((service) => (
          <Link
            key={service.slug}
            to={`/pricing/${service.slug}`}
            className="services-card reveal cursor-black"
            aria-label={`${service.title} pricing`}
          >
            <div className="card-icon">
              <FontAwesomeIcon icon={iconMap[service.icon]} />
            </div>
            <h3>{service.title}</h3>
            <p>{service.subTitle}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Services;
