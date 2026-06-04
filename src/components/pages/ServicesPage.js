import Seo from '../util/Seo';
import { motion, useReducedMotion } from 'motion/react';
import servicesData from '../../data/services.json';
import ServiceRow from '../ui/ServiceRow';
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
      <Seo
        title="Services — Switch Case Studio"
        description="Web development, e-commerce, design & branding, marketing, automation, and email marketing — all built from scratch by Switch Case Studio."
        path="/services"
      />

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
            <span className="services-page__title--accent">
              digital presence needs.
            </span>
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
          {servicesData.map((service) => (
            <ServiceRow
              key={service.slug}
              to={`/pricing/${service.slug}`}
              iconName={service.icon}
              title={service.title}
              subtitle={service.subTitle}
              variants={v(cardVariants)}
            />
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
