import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

import '../../styles/components/rotatingProof.scss';

/**
 * RotatingProof: one client quote at a time, auto-rotating, with dots to
 * pick. Extracted from SinglePricingCard (2026-09-26) so the package board
 * on /pricing/:slug can show the proof once under the board instead of
 * once per tier card. Markup and motion are the card's, unchanged.
 */
const RotatingProof = ({ testimonials = [], rotationSpeed = 5000, className = '' }) => {
  const reduced = useReducedMotion();
  const [tIndex, setTIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return undefined;
    const id = setInterval(
      () => setTIndex((p) => (p + 1) % testimonials.length),
      rotationSpeed
    );
    return () => clearInterval(id);
  }, [testimonials.length, rotationSpeed]);

  if (!testimonials.length) return null;

  return (
    <div className={`rp ${className}`.trim()}>
      <div className="rp__stage">
        <AnimatePresence mode="wait">
          {testimonials.map(
            (t, i) =>
              i === tIndex && (
                <motion.figure
                  key={t.id ?? i}
                  className="rp__quote"
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: -16 }}
                  transition={{ duration: 0.45 }}
                >
                  <figcaption className="rp__head">
                    {t.avatar && (
                      <img
                        src={t.avatar}
                        alt=""
                        className="rp__avatar"
                        loading="lazy"
                        width="32"
                        height="32"
                      />
                    )}
                    <span className="rp__meta">
                      <span className="rp__name">{t.name}</span>
                      {t.role && <span className="rp__role">{t.role}</span>}
                    </span>
                  </figcaption>
                  <blockquote className="rp__text">“{t.content}”</blockquote>
                </motion.figure>
              )
          )}
        </AnimatePresence>
      </div>

      {testimonials.length > 1 && (
        <div className="rp__dots">
          {testimonials.map((t, i) => (
            <button
              key={t.id ?? i}
              type="button"
              className={`rp__dot${i === tIndex ? ' is-active' : ''}`}
              onClick={() => setTIndex(i)}
              aria-label={`View testimonial ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RotatingProof;
