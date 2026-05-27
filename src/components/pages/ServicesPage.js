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
      const header = rootRef.current.querySelector('.services-page__header');
      if (header) {
        const headerEls = header.querySelectorAll('.sp-reveal');
        gsap.fromTo(
          headerEls,
          { opacity: 0, y: 32, clipPath: 'inset(0 0 100% 0)' },
          {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0 0 0% 0)',
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.12,
          },
        );
      }

      const rows = gsap.utils.toArray('.services-page__service', rootRef.current);
      rows.forEach((row) => {
        const index = row.querySelector('.services-page__service-index');
        const body = row.querySelector('.services-page__service-body');
        const cta = row.querySelector('.services-page__service-cta');
        const items = row.querySelectorAll('.services-page__service-item');

        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: 'top 85%', once: true },
        });

        if (index) {
          tl.fromTo(index, { opacity: 0, x: -16 }, {
            opacity: 1, x: 0, duration: 0.5, ease: 'power2.out',
          }, 0);
        }

        if (body) {
          tl.fromTo(body, { opacity: 0, y: 24 }, {
            opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
          }, 0.1);
        }

        if (cta) {
          tl.fromTo(cta, { opacity: 0, x: 16 }, {
            opacity: 1, x: 0, duration: 0.5, ease: 'power2.out',
          }, 0.25);
        }

        if (items.length) {
          tl.fromTo(items, { opacity: 0, scale: 0.85, y: 8 }, {
            opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(2)',
            stagger: 0.04,
          }, 0.35);
        }
      });

      const bottom = rootRef.current.querySelector('.services-page__bottom');
      if (bottom) {
        gsap.fromTo(bottom, { opacity: 0, y: 24, scale: 0.97 }, {
          opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: bottom, start: 'top 88%', once: true },
        });
      }

      requestAnimationFrame(() => ScrollTrigger.refresh());
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
        <header className="services-page__header">
          <p className="services-page__kicker sp-reveal">What we do</p>
          <h1 className="services-page__title sp-reveal">
            Everything your
            <br />
            <span className="services-page__title--accent">digital presence needs.</span>
          </h1>
          <p className="services-page__lede sp-reveal">
            Design, development, marketing, and automation — we handle the
            full stack of what a growing business needs online.
          </p>
        </header>

        <section className="services-page__list" aria-label="Service list">
          {servicesData.map((service, i) => (
            <div key={service.slug} className="services-page__service">
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

        <div className="services-page__bottom">
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
