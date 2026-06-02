import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useReducedMotion } from 'motion/react';
import servicesData from '../../data/services.json';
import {
  headerVariants,
  lineVariant,
  containerVariants,
  cardVariants,
} from '../../utils/motionVariants';
import '../../styles/components/servicesPage.scss';

const ServicesPage = () => {
  const reduced = useReducedMotion();
  const v = (variant) => (reduced ? undefined : variant);

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

      <article className="services-page" aria-label="Services">
        <motion.header
          className="services-page__header"
          variants={v(headerVariants)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.p className="services-page__kicker" variants={v(lineVariant)}>
            What we do
          </motion.p>
          <motion.h1 className="services-page__title" variants={v(lineVariant)}>
            Everything your
            <br />
            <span className="services-page__title--accent">digital presence needs.</span>
          </motion.h1>
          <motion.p className="services-page__lede" variants={v(lineVariant)}>
            Design, development, marketing, and automation — we handle the
            full stack of what a growing business needs online.
          </motion.p>
        </motion.header>

        <motion.section
          className="services-page__list"
          aria-label="Service list"
          variants={v(containerVariants)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
        >
          {servicesData.map((service, i) => (
            <motion.div
              key={service.slug}
              className="services-page__service"
              variants={v(cardVariants)}
            >
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
            </motion.div>
          ))}
        </motion.section>

        <motion.div
          className="services-page__bottom"
          variants={v(cardVariants)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
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
        </motion.div>
      </article>
    </>
  );
};

export default ServicesPage;
