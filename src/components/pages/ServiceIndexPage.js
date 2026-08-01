import { useRef } from 'react';
import Seo from '../util/Seo';
import { motion, useReducedMotion } from 'motion/react';
import servicesData from '../../data/services.json';
import pricingData from '../../data/pricingData.json';
import ServiceRow from '../ui/ServiceRow';
import usePageHeaderReveal from '../../hooks/usePageHeaderReveal';
import {
  containerVariants,
  cardVariants,
} from '../../utils/motionVariants';
import BookCallCta from '../ui/BookCallCta';
import '../../styles/components/serviceIndexPage.scss';

// Per-route copy + SEO. The page body below is identical for both — only
// these strings change with the route (see ServicesPage / PricingOverviewPage).
const COPY = {
  services: {
    seoTitle: 'Services — Switch Case Studio',
    seoDescription:
      'AI development, automation, web development, e-commerce, branding, and growth — design, code, and AI systems built from scratch by Switch Case Studio.',
    path: '/services',
    ariaLabel: 'Services',
    kicker: 'What we do',
    titleTop: 'Design. Code. AI.',
    titleAccent: 'One studio.',
    lede: 'Websites, apps, brand systems, and the AI and automation behind them — we handle the full stack of what a growing business needs to run online.',
    bottomHeading: 'Not sure what you need?',
    bottomBody: "Book a free call and we'll figure it out together.",
  },
  pricing: {
    seoTitle: 'Services & Pricing — Switch Case Studio',
    seoDescription:
      "Explore Switch Case Studio's services — AI development, automation, web development, e-commerce, branding, and growth. Transparent pricing, fast delivery.",
    path: '/pricing',
    ariaLabel: 'Services and pricing',
    kicker: 'Pricing',
    titleTop: 'What we do,',
    titleAccent: 'and what it costs.',
    lede: 'Pick a service to see the full breakdown — scope, deliverables, and transparent pricing. AI and automation included, hype not.',
    bottomHeading: 'Not sure which service you need?',
    bottomBody: "Book a free call — we'll figure it out together.",
  },
};

// "from $X" for the /pricing variant — the lowest tier price per service,
// derived from pricingData (same slug→id map as PricingPage) so the index
// stays in sync with real pricing instead of a duplicated hardcoded number.
const SLUG_TO_ID = {
  'ai-development': 'ai-development',
  'automation-integrations': 'automation-integrations',
  'web-development': 'web-development',
  'marketing-ads': 'marketing-advertisement',
  'hosting-maintenance': 'web-hosting-maintenance',
  'design-branding': 'design-branding',
  'email-marketing': 'email-marketing',
};

const fromPrice = (slug) => {
  const svc = pricingData.services.find((s) => s.id === SLUG_TO_ID[slug]);
  const prices = (svc?.tiers || [])
    .map((t) => t.price)
    .filter((p) => typeof p === 'number');
  if (!prices.length) return null;
  return `$${Math.min(...prices).toLocaleString('en-US')}`;
};

const ServiceIndexPage = ({ variant }) => {
  const reduced = useReducedMotion();
  const v = (motionVariant) => (reduced ? undefined : motionVariant);
  /* LC-26e: header is GSAP-revealed (static HTML ships visible) — see
   * usePageHeaderReveal. This component serves BOTH /services and the
   * /pricing overview, so the fix repairs both routes' headers. motion
   * still owns the row list + CTA below. */
  const headerRef = useRef(null);
  usePageHeaderReveal(headerRef);
  const c = COPY[variant];

  return (
    <>
      <Seo title={c.seoTitle} description={c.seoDescription} path={c.path} />

      <article className="service-index" aria-label={c.ariaLabel}>
        {/* ── Header ── */}
        <header className="service-index__header" ref={headerRef}>
          <p className="service-index__kicker page-head-animate">
            {c.kicker}
          </p>
          <h1 className="service-index__title page-head-animate">
            {c.titleTop}
            <br />
            <span className="service-index__title--accent">{c.titleAccent}</span>
          </h1>
          <p className="service-index__lede page-head-animate">
            {c.lede}
          </p>
        </header>

        {/* ── Service index ── */}
        {/* Reveal on MOUNT (animate), not on scroll: a scroll `amount`
            threshold on this tall single-column list can be missed on mobile,
            stranding rows invisible (the /projects + /testimonials bug). */}
        <motion.section
          className="service-index__list"
          aria-label="Service list"
          variants={v(containerVariants)}
          initial="hidden"
          animate="visible"
        >
          {servicesData.map((service) => (
            <ServiceRow
              key={service.slug}
              to={`/pricing/${service.slug}`}
              title={service.title}
              description={service.subTitle}
              price={variant === 'pricing' ? fromPrice(service.slug) : undefined}
              priced={variant === 'pricing'}
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
          <BookCallCta className="service-index__bottom-btn" />
        </motion.div>
      </article>
    </>
  );
};

export default ServiceIndexPage;
