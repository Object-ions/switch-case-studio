import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faStar,
  faArrowRight,
  faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';

import '../../styles/components/singlePricingCard.scss';

/**
 * SinglePricingCard — a focused "one offer" card: price + benefits + CTA on the
 * left, included features + a rotating testimonial on the right.
 *
 * Adapted from a Next.js/TS/Tailwind/framer-motion + shadcn snippet to this
 * project's stack: motion/react, plain JS, SCSS, Font Awesome, react-router.
 * Entrance uses whileInView (can't get stuck hidden); reduced-motion safe.
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
  const [tIndex, setTIndex] = useState(0);

  // Auto-rotate the testimonial.
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const id = setInterval(
      () => setTIndex((p) => (p + 1) % testimonials.length),
      rotationSpeed
    );
    return () => clearInterval(id);
  }, [testimonials.length, rotationSpeed]);

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
          {badge && <span className="spc__badge">{badge}</span>}

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
                  <FontAwesomeIcon
                    icon={b.icon || faCheck}
                    className="spc__benefit-icon"
                    aria-hidden="true"
                  />
                  <span>{b.text}</span>
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
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="spc__btn-chevron"
                  aria-hidden="true"
                />
              </Cta>
            )}
            {secondaryButton && (
              <Cta
                href={secondaryButton.href}
                className="spc__btn spc__btn--secondary"
              >
                <span>{secondaryButton.text}</span>
                <FontAwesomeIcon
                  icon={
                    secondaryButton.external
                      ? faArrowUpRightFromSquare
                      : faArrowRight
                  }
                  aria-hidden="true"
                />
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
                <span className="spc__feature-chip" aria-hidden="true">
                  <FontAwesomeIcon icon={faCheck} />
                </span>
                <span>{feat}</span>
              </motion.li>
            ))}
          </ul>

          {testimonials.length > 0 && (
            <div className="spc__proof">
              <div className="spc__proof-stage">
                <AnimatePresence mode="wait">
                  {testimonials.map(
                    (t, i) =>
                      i === tIndex && (
                        <motion.figure
                          key={t.id ?? i}
                          className="spc__quote"
                          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -16 }}
                          transition={{ duration: 0.45 }}
                        >
                          <figcaption className="spc__quote-head">
                            {t.avatar && (
                              <img
                                src={t.avatar}
                                alt=""
                                className="spc__quote-avatar"
                                loading="lazy"
                                width="32"
                                height="32"
                              />
                            )}
                            <span className="spc__quote-meta">
                              <span className="spc__quote-name">{t.name}</span>
                              {t.role && (
                                <span className="spc__quote-role">{t.role}</span>
                              )}
                            </span>
                            <span className="spc__quote-stars" aria-hidden="true">
                              {[...Array(t.rating || 5)].map((_, s) => (
                                <FontAwesomeIcon key={s} icon={faStar} />
                              ))}
                            </span>
                          </figcaption>
                          <blockquote className="spc__quote-text">
                            “{t.content}”
                          </blockquote>
                        </motion.figure>
                      )
                  )}
                </AnimatePresence>
              </div>

              {testimonials.length > 1 && (
                <div className="spc__dots">
                  {testimonials.map((t, i) => (
                    <button
                      key={t.id ?? i}
                      type="button"
                      className={`spc__dot${i === tIndex ? ' is-active' : ''}`}
                      onClick={() => setTIndex(i)}
                      aria-label={`View testimonial ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SinglePricingCard;
