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
import useReducedMotion from '../../hooks/useReducedMotion';
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
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reveals = gsap.utils.toArray('.reveal', section);

    // GSAP owns the reveal start + end state (single source of truth).
    // Reduced-motion users skip the animation entirely.
    if (reducedMotion) {
      gsap.set(reveals, { autoAlpha: 1, y: 0 });
    } else {
      gsap.set(reveals, { autoAlpha: 0, y: 60 });
    }

    // --- Scroll reveal animation ---
    const tweens = reducedMotion
      ? []
      : reveals.map((el, i) =>
          gsap.to(el, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }),
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
      tweens.forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
      titleEl?.removeEventListener('mousemove', handleTitleMove);
      cards.forEach((card) =>
        card.removeEventListener('mousemove', handleCardMove),
      );
    };
  }, [reducedMotion]);

  return (
    <section
      id="services"
      ref={sectionRef}
      aria-labelledby="services-heading"
    >
      <div className="services-hero">
        <div className="title reveal">
          <h2 id="services-heading">
            Code, design, and marketing &mdash; under{' '}
            <span className="shine-text">one roof</span>, in one conversation.
            We build the websites your competitors wish they had.
          </h2>
        </div>
      </div>

      <div className="services-content">
        {servicesData.map((service) => (
          <Link
            key={service.slug}
            to={`/pricing/${service.slug}`}
            className="services-card reveal cursor-black"
            aria-label={`${service.title} — see pricing`}
          >
            <div className="card-icon">
              <FontAwesomeIcon icon={iconMap[service.icon]} />
            </div>
            <h3>{service.title}</h3>
            <p>{service.subTitle}</p>
            <span className="card-cta" aria-hidden="true">
              {service.cta}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Services;
