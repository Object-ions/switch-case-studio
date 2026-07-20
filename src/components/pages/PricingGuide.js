import React, { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  faBolt,
  faClock,
  faGaugeHigh,
  faHeart,
  faRobot,
  faWrench,
} from '@fortawesome/free-solid-svg-icons';

import pricingData from '../../data/pricingData.json';
import testimonialsData from '../../data/testimonials.json';
import SinglePricingCard from '../ui/SinglePricingCard';
import BookCallCta from '../ui/BookCallCta';
import { BOOK_CALL_URL, BOOK_CALL_LABEL } from '../../data/cta';
import useReducedMotion from '../../hooks/useReducedMotion';
import {
  DUR_MED,
  EASE_OUT_SOFT,
  REVEAL_Y,
  REVEAL_STAGGER,
  REVEAL_SAFETY_DELAY,
} from '../../animation/motionTokens';

import '../../styles/components/pricingGuide.scss';

gsap.registerPlugin(ScrollTrigger);

// Shared studio reassurances shown on every tier.
const BENEFITS = [
  { text: 'Built from scratch — no templates', icon: faBolt },
  { text: 'Most builds ship in under 2 weeks', icon: faClock },
  { text: 'Work directly with the people building it', icon: faHeart },
];

// A tier may carry its own bullets in pricingData.json as
// { text, icon: <key> }; unknown keys fall back to faBolt.
const BENEFIT_ICONS = {
  bolt: faBolt,
  clock: faClock,
  gauge: faGaugeHigh,
  heart: faHeart,
  robot: faRobot,
  wrench: faWrench,
};

const tierBenefits = (tier) =>
  tier.benefits
    ? tier.benefits.map((b) => ({
        text: b.text,
        icon: BENEFIT_ICONS[b.icon] || faBolt,
      }))
    : BENEFITS;

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
  const rootRef = useRef(null);

  const service = useMemo(
    () => pricingData.services.find((s) => s.id === serviceId),
    [serviceId]
  );

  /* VE-8: house safe-reveal for the whole page (header lines, cards,
   * outro, footer). Replaces the motion whileInView header, which BAKED
   * opacity:0 into the SSG HTML — the pricing h1 was invisible without
   * JS. gsap.set applies hidden only at runtime, so static HTML always
   * ships visible; play-once + in-view fallback + safety net; reduced
   * motion stays static-visible. This is a conversion page — nothing may
   * ever strand hidden. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const items = gsap.utils.toArray('.pg-animate', root);
    if (!items.length) return undefined;

    if (reduced) {
      gsap.set(items, { clearProps: 'all' });
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.set(items, { autoAlpha: 0, y: REVEAL_Y });

      const reveal = () =>
        gsap.to(items, {
          autoAlpha: 1,
          y: 0,
          duration: DUR_MED,
          stagger: REVEAL_STAGGER,
          ease: EASE_OUT_SOFT,
          overwrite: 'auto',
        });

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: 'top 85%',
        once: true,
        onEnter: reveal,
      });

      // Pricing pages load with the section at the top — reveal now.
      if (root.getBoundingClientRect().top < window.innerHeight * 0.85) {
        reveal();
      }

      const safety = gsap.delayedCall(REVEAL_SAFETY_DELAY, () => {
        if (items.some((el) => gsap.getProperty(el, 'opacity') < 1)) {
          reveal();
        }
      });

      return () => {
        trigger.kill();
        safety.kill();
      };
    }, root);

    return () => ctx.revert();
  }, [reduced, serviceId]);

  if (!service) {
    return (
      <section className="pricing-guide">
        <p className="pg-empty">No pricing found for this service.</p>
      </section>
    );
  }

  return (
    <section
      className="pricing-guide"
      aria-labelledby="pg-title"
      ref={rootRef}
    >
      <header className="pg-head">
        <p className="pg-kicker pg-animate">Pricing</p>
        <h1 id="pg-title" className="pg-h1 pg-animate">
          {service.title}
        </h1>
        <p className="pg-sub pg-animate">{service.subtitle}</p>
      </header>

      <div className="pg-cards">
        {service.tiers.map((tier, idx) => (
          <div className="pg-card-slot pg-animate" key={tier.name}>
            <SinglePricingCard
              badge={service.title}
              title={tier.name}
              subtitle={tier.description}
              price={{
                current: formatMoney(tier.price),
                note: tier.billing === 'monthly' ? 'per month' : 'one-time',
              }}
              benefits={tierBenefits(tier)}
              features={tier.includes}
              featuresTitle="What's included"
              primaryButton={{ text: BOOK_CALL_LABEL, href: BOOK_CALL_URL }}
              secondaryButton={{ text: 'See our work', href: '/projects' }}
              testimonials={TESTIMONIALS}
              rotationSpeed={5000 + idx * 600}
            />
          </div>
        ))}
      </div>

      <div className="pg-outro pg-animate">
        <p className="pg-outro__line">
          Think of this as a starting point - real pricing depends on the size,
          complexity, and goals of your project. Let’s talk through the details
          so we can put together the right plan for you.
        </p>
      </div>

      <hr className="pg-sep pg-sep--wide" />

      <footer className="pg-footer pg-animate" aria-label="Contact">
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
