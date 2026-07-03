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
import '../../styles/components/serviceIndexPage.scss';

const BOOK_CALL_URL = 'https://calendar.app.google/83UCJjis2FHUrr1s6';

// Per-route copy + SEO. The page body below is identical for both — only
// these strings change with the route (see ServicesPage / PricingOverviewPage).
const COPY = {
  services: {
    seoTitle: 'Services — Switch Case Studio',
    seoDescription:
      'Web development, e-commerce, design & branding, marketing, automation, and email marketing — all built from scratch by Switch Case Studio.',
    path: '/services',
    ariaLabel: 'Services',
    kicker: 'What we do',
    titleTop: 'Everything your',
    titleAccent: 'digital presence needs.',
    lede: 'Design, development, marketing, and automation — we handle the full stack of what a growing business needs online.',
    bottomHeading: 'Not sure what you need?',
    bottomBody: "Book a free call and we'll figure it out together.",
  },
  pricing: {
    seoTitle: 'Services & Pricing — Switch Case Studio',
    seoDescription:
      "Explore Switch Case Studio's services — web development, e-commerce, design & branding, marketing, automation, and more. Transparent pricing, fast delivery.",
    path: '/pricing',
    ariaLabel: 'Services and pricing',
    kicker: 'Pricing',
    titleTop: 'What we do,',
    titleAccent: 'and what it costs.',
    lede: 'Pick a service to see the full breakdown — scope, deliverables, and transparent pricing.',
    bottomHeading: 'Not sure which service you need?',
    bottomBody: "Book a free call — we'll figure it out together.",
  },
};

const ServiceIndexPage = ({ variant }) => {
  const reduced = useReducedMotion();
  const v = (motionVariant) => (reduced ? undefined : motionVariant);
  const c = COPY[variant];

  return (
    <>
      <Seo title={c.seoTitle} description={c.seoDescription} path={c.path} />

      <article className="service-index" aria-label={c.ariaLabel}>
        {/* ── Header ── */}
        <motion.header
          className="service-index__header"
          variants={v(headerVariants)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.p className="service-index__kicker" variants={v(lineVariant)}>
            {c.kicker}
          </motion.p>
          <motion.h1 className="service-index__title" variants={v(lineVariant)}>
            {c.titleTop}
            <br />
            <span className="service-index__title--accent">{c.titleAccent}</span>
          </motion.h1>
          <motion.p className="service-index__lede" variants={v(lineVariant)}>
            {c.lede}
          </motion.p>
        </motion.header>

        {/* ── Service index ── */}
        <motion.section
          className="service-index__list"
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
          className="service-index__bottom"
          variants={v(cardVariants)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="service-index__bottom-heading">{c.bottomHeading}</h2>
          <p className="service-index__bottom-body">{c.bottomBody}</p>
          <a
            href={BOOK_CALL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="service-index__bottom-btn"
          >
            Book a Free Strategy Call
          </a>
        </motion.div>
      </article>
    </>
  );
};

export default ServiceIndexPage;
