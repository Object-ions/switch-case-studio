import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  faBolt,
  faClock,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';

import pricingData from '../../data/pricingData.json';
import testimonialsData from '../../data/testimonials.json';
import SinglePricingCard from '../ui/SinglePricingCard';
import BookCallCta from '../ui/BookCallCta';
import { BOOK_CALL_URL, BOOK_CALL_LABEL } from '../../data/cta';
import { headerVariants, lineVariant } from '../../utils/motionVariants';

import '../../styles/components/pricingGuide.scss';

// Shared studio reassurances shown on every tier.
const BENEFITS = [
  { text: 'Built from scratch — no templates', icon: faBolt },
  { text: 'Most builds ship in under 2 weeks', icon: faClock },
  { text: 'Work directly with the people building it', icon: faHeart },
];

// Rotating social proof, mapped from the testimonials data.
const TESTIMONIALS = testimonialsData.map((t) => ({
  id: t.id,
  name: t.name,
  role: t.title,
  content: t.highlight,
  rating: 5,
  avatar: t.image,
}));

const formatMoney = (n) =>
  n.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

export const PricingGuide = ({ serviceId }) => {
  const reduced = useReducedMotion();
  const v = (variant) => (reduced ? undefined : variant);

  const service = useMemo(
    () => pricingData.services.find((s) => s.id === serviceId),
    [serviceId]
  );

  if (!service) {
    return (
      <section className="pricing-guide">
        <p className="pg-empty">No pricing found for this service.</p>
      </section>
    );
  }

  return (
    <section className="pricing-guide" aria-labelledby="pg-title">
      <motion.header
        className="pg-head"
        variants={v(headerVariants)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.p className="pg-kicker" variants={v(lineVariant)}>
          Pricing
        </motion.p>
        <motion.h1 id="pg-title" className="pg-h1" variants={v(lineVariant)}>
          {service.title}
        </motion.h1>
        <motion.p className="pg-sub" variants={v(lineVariant)}>
          {service.subtitle}
        </motion.p>
      </motion.header>

      <div className="pg-cards">
        {service.tiers.map((tier, idx) => (
          <SinglePricingCard
            key={tier.name}
            badge={service.title}
            title={tier.name}
            subtitle={tier.description}
            price={{
              current: formatMoney(tier.price),
              note: tier.billing === 'monthly' ? 'per month' : 'one-time',
            }}
            benefits={BENEFITS}
            features={tier.includes}
            featuresTitle="What's included"
            primaryButton={{ text: BOOK_CALL_LABEL, href: BOOK_CALL_URL }}
            secondaryButton={{ text: 'See our work', href: '/projects' }}
            testimonials={TESTIMONIALS}
            rotationSpeed={5000 + idx * 600}
          />
        ))}
      </div>

      <div className="pg-outro">
        <p className="pg-outro__line">
          Think of this as a starting point - real pricing depends on the size,
          complexity, and goals of your project. Let’s talk through the details
          so we can put together the right plan for you.
        </p>
      </div>

      <hr className="pg-sep pg-sep--wide" />

      <footer className="pg-footer" aria-label="Contact">
        <BookCallCta className="pg-link" />
        <a
          className="pg-link"
          href="mailto:hello@switchcasestudio.com"
          target="_blank"
          rel="noreferrer"
        >
          hello@switchcasestudio.com
        </a>
      </footer>
    </section>
  );
};
