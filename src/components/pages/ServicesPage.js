import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReducedMotion from '../../hooks/useReducedMotion';
import servicesData from '../../data/services.json';
import '../../styles/components/servicesPage.scss';

gsap.registerPlugin(ScrollTrigger);

const ServicesPage = () => {
  const rootRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.sp-reveal', rootRef.current).forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 86%', once: true },
          },
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <>
      <Helmet>
        <title>Services — Switch Case Studio</title>
        <meta
          name="description"
          content="Web development, e-commerce, design & branding, marketing, automation, and email marketing — all built from scratch by Switch Case Studio."
        />
        <link rel="canonical" href="https://switchcasestudio.com/services" />
        <meta property="og:title" content="Services — Switch Case Studio" />
        <meta
          property="og:description"
          content="From websites to full e-commerce stores — explore what Switch Case Studio builds and how we can help your business grow."
        />
      </Helmet>

      <article className="services-page" ref={rootRef} aria-label="Services">
        {/* ── Header ── */}
        <header className="services-page__header">
          <p className="services-page__kicker sp-reveal">What we do</p>
          <h1 className="services-page__title sp-reveal">
            Everything your
            <br />
            <span className="services-page__title--accent">digital presence needs.</span>
          </h1>
          <p className="services-page__lede sp-reveal">
            From a single campaign page to a full brand system — we handle
            design, development, marketing, and everything in between.
          </p>
        </header>

        {/* ── Services list ── */}
        <section className="services-page__list" aria-label="Service list">
          {servicesData.map((service, i) => (
            <div key={service.slug} className="services-page__service sp-reveal">
              <div className="services-page__service-index">
                {String(i + 1).padStart(2, '0')}
              </div>

              <div className="services-page__service-body">
                <div className="services-page__service-head">
                  <h2 className="services-page__service-title">{service.title}</h2>
                  <p className="services-page__service-sub">{service.subTitle}</p>
                </div>

                <p className="services-page__service-desc">{service.description}</p>

                {service.items?.length > 0 && (
                  <ul className="services-page__service-items" aria-label="Includes">
                    {service.items.map((item) => (
                      <li key={item} className="services-page__service-item">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="services-page__service-cta">
                <Link
                  to={`/pricing/${service.slug}`}
                  className="services-page__service-btn"
                >
                  See pricing →
                </Link>
              </div>
            </div>
          ))}
        </section>

        {/* ── Bottom CTA ── */}
        <div className="services-page__bottom sp-reveal">
          <h2 className="services-page__bottom-heading">
            Not sure what you need?
          </h2>
          <p className="services-page__bottom-body">
            Book a free call and we'll figure it out together.
          </p>
          <a
            href="https://calendar.app.google/83UCJjis2FHUrr1s6"
            target="_blank"
            rel="noopener noreferrer"
            className="services-page__bottom-btn"
          >
            Book a Free Call
          </a>
        </div>
      </article>
    </>
  );
};

export default ServicesPage;
