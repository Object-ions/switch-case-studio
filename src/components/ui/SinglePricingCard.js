import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';

import RotatingProof from './RotatingProof';
import '../../styles/components/singlePricingCard.scss';

/**
 * SinglePricingCard — a focused "one offer" card: price + benefits + CTA on the
 * left, included features + a rotating testimonial on the right.
 *
 * Adapted from a Next.js/TS/Tailwind/framer-motion + shadcn snippet to this
 * project's stack: motion/react, plain JS, SCSS, react-router. Facelift
 * 2026-09-14 dropped the FontAwesome check/star icons for the site's plain
 * "→" arrow convention (Services.js, About) and a hairline list — no icon
 * chips or star-rating graphic anywhere else on the site used them either.
 * Entrance uses whileInView (can't get stuck hidden); reduced-motion safe.
 * The rotating quote lives in RotatingProof since 2026-09-26 (shared with
 * the package board on pricing pages that have one).
 */

// Internal link → react-router; external/anchor → plain <a>.
const Cta = ({ href, className, children, newTab }) => {
  if (!href) return null;
  const external = /^https?:|^mailto:|^#/.test(href);
  if (external) {
    return (
      <a
        href={href}
        className={className}
        {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  );
};

const SinglePricingCard = ({
  badge,
  title,
  subtitle,
  price = {},
  benefits = [],
  features = [],
  featuresTitle = 'Included',
  primaryButton,
  secondaryButton,
  testimonials = [],
  rotationSpeed = 5000,
  highlighted = false,
}) => {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={`spc${highlighted ? ' spc--highlighted' : ''}`}
      initial={reduced ? false : { opacity: 0, y: 30 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="spc__inner">
        {/* ── Left: offer ── */}
        <div className="spc__offer">
          {badge && <span className="spc__kicker">{badge}</span>}

          <h2 className="spc__title">{title}</h2>
          {subtitle && <p className="spc__subtitle">{subtitle}</p>}

          <div className="spc__price">
            <span className="spc__price-current">{price.current}</span>
            {price.original && (
              <span className="spc__price-original">{price.original}</span>
            )}
            {price.note && <span className="spc__price-note">{price.note}</span>}
          </div>

          {benefits.length > 0 && (
            <ul className="spc__benefits">
              {benefits.map((b) => (
                <li key={b.text} className="spc__benefit">
                  {b.text}
                </li>
              ))}
            </ul>
          )}

          <div className="spc__actions">
            {primaryButton && (
              <Cta
                href={primaryButton.href}
                newTab
                className="spc__btn spc__btn--primary"
              >
                <span>{primaryButton.text}</span>
                <span className="spc__btn-arrow" aria-hidden="true">→</span>
              </Cta>
            )}
            {secondaryButton && (
              <Cta
                href={secondaryButton.href}
                className="spc__btn spc__btn--secondary"
              >
                <span>{secondaryButton.text}</span>
                <span className="spc__btn-arrow" aria-hidden="true">
                  {secondaryButton.external ? '↗' : '→'}
                </span>
              </Cta>
            )}
          </div>
        </div>

        {/* ── Right: features + proof ── */}
        <div className="spc__detail">
          <h3 className="spc__detail-title">{featuresTitle}</h3>

          <ul className="spc__features">
            {features.map((feat, i) => (
              <motion.li
                key={feat}
                className="spc__feature"
                initial={reduced ? false : { opacity: 0, x: 20 }}
                whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: i * 0.05, duration: 0.45 }}
              >
                {feat}
              </motion.li>
            ))}
          </ul>

          <RotatingProof testimonials={testimonials} rotationSpeed={rotationSpeed} />
        </div>
      </div>
    </motion.div>
  );
};

export default SinglePricingCard;
