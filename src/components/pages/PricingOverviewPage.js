import { Helmet } from 'react-helmet-async';
import { motion, useReducedMotion } from 'motion/react';
import servicesData from '../../data/services.json';
import ServiceRow from '../ui/ServiceRow';
import {
  headerVariants,
  lineVariant,
  containerVariants,
  cardVariants,
} from '../../utils/motionVariants';
import '../../styles/components/pricingOverviewPage.scss';

const PricingOverviewPage = () => {
  const reduced = useReducedMotion();
  const v = (variant) => (reduced ? undefined : variant);

  return (
    <>
      <Helmet>
        <title>Services & Pricing — Switch Case Studio</title>
        <meta
          name="description"
          content="Explore Switch Case Studio's services — web development, e-commerce, design & branding, marketing, automation, and more. Transparent pricing, fast delivery."
        />
        <link rel="canonical" href="https://switchcasestudio.com/pricing" />
        <meta property="og:title" content="Services & Pricing — Switch Case Studio" />
        <meta
          property="og:description"
          content="Explore our services — web development, e-commerce, design, marketing, and automation. Transparent pricing, fast delivery."
        />
      </Helmet>

      <article className="pop-page" aria-label="Services and pricing">
        {/* ── Header ── */}
        <motion.header
          className="pop-page__header"
          variants={v(headerVariants)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.p className="pop-page__kicker" variants={v(lineVariant)}>
            Pricing
          </motion.p>
          <motion.h1 className="pop-page__title" variants={v(lineVariant)}>
            What we do,
            <br />
            <span className="pop-page__title--accent">and what it costs.</span>
          </motion.h1>
          <motion.p className="pop-page__lede" variants={v(lineVariant)}>
            Pick a service to see the full breakdown — scope, deliverables,
            and transparent pricing.
          </motion.p>
        </motion.header>

        {/* ── Services index ── */}
        <motion.section
          className="pop-page__list"
          aria-label="Service list"
          variants={v(containerVariants)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
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

        {/* ── Bottom CTA ── */}
        <motion.div
          className="pop-page__bottom"
          variants={v(cardVariants)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="pop-page__bottom-heading">Not sure which service you need?</h2>
          <p className="pop-page__bottom-body">
            Book a free call — we'll figure it out together.
          </p>
          <a
            href="https://calendar.app.google/83UCJjis2FHUrr1s6"
            target="_blank"
            rel="noopener noreferrer"
            className="pop-page__bottom-btn"
          >
            Book a Free Call
          </a>
        </motion.div>
      </article>
    </>
  );
};

export default PricingOverviewPage;
