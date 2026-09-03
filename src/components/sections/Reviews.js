import { useState, useEffect, useRef, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'motion/react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import TestimonialHeading from './TestimonialHeading';
import BookCallCta from '../ui/BookCallCta';
import MagneticButton from '../ui/MagneticButton';
import testimonialsData from '../../data/testimonials.json';
import {
  DUR_MED,
  EASE_OUT_SOFT,
  REVEAL_Y,
  REVEAL_SAFETY_DELAY,
} from '../../animation/motionTokens';

gsap.registerPlugin(ScrollTrigger);
import '../../styles/components/testimonials.scss';

const AUTO_ADVANCE_MS = 10000;
const CURSOR_HIDE_CLASS = 'is-carousel-hover';

const Reviews = () => {
  const [current, setCurrent] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef(null);

  const total = testimonialsData.length;
  const prefersReducedMotion = useReducedMotion();

  /* ── Cursor follow (spring-smoothed) ── */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    }
  };

  /* ── Navigation ── */
  const goTo = useCallback(
    (i) => {
      setCurrent(((i % total) + total) % total);
    },
    [total],
  );

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  /* ── Auto-advance every 10s. Pauses on hover. ── */
  useEffect(() => {
    if (isHovering) return;
    const id = setInterval(next, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [next, isHovering, current]);

  /* ── VE-7: "Ready to be next?" beat entrance — house safe-reveal.
   * Primary CTA, so strand-proof is non-negotiable: SSG HTML ships
   * visible, hidden state applied only at runtime via gsap.set, revealed
   * play-once onEnter with in-view fallback + timed safety net; reduced
   * motion never hides it. Same proven shape as AboutCTA. ── */
  useEffect(() => {
    const el = document.querySelector('.testimonials-cta');
    if (!el) return undefined;

    if (prefersReducedMotion) {
      gsap.set(el, { clearProps: 'all' });
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.set(el, { autoAlpha: 0, y: REVEAL_Y });

      const reveal = () =>
        gsap.to(el, {
          autoAlpha: 1,
          y: 0,
          duration: DUR_MED,
          ease: EASE_OUT_SOFT,
          overwrite: 'auto',
        });

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: reveal,
      });

      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
        reveal();
      }

      const safety = gsap.delayedCall(REVEAL_SAFETY_DELAY, () => {
        if (gsap.getProperty(el, 'opacity') < 1) reveal();
      });

      return () => {
        trigger.kill();
        safety.kill();
      };
    }, el);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  /* ── Hide global cursor while hovering the carousel ── */
  const handleMouseEnter = () => {
    setIsHovering(true);
    document.body.classList.add(CURSOR_HIDE_CLASS);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    document.body.classList.remove(CURSOR_HIDE_CLASS);
  };

  // Belt-and-suspenders: ensure the class never sticks if the component
  // unmounts mid-hover (route change, etc.)
  useEffect(() => {
    return () => {
      document.body.classList.remove(CURSOR_HIDE_CLASS);
    };
  }, []);

  const item = testimonialsData[current];

  return (
    <section id="testimonials" aria-labelledby="testimonials-heading">
      <div className="testimonials-inner">
        <div className="panel-heading">
          <TestimonialHeading id="testimonials-heading" />
        </div>

        <div
          ref={containerRef}
          className="testimonial-carousel"
          onClick={next}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          role="button"
          tabIndex={0}
          aria-roledescription="carousel"
          aria-label="Client testimonials. Click or press Enter to advance."
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              next();
            }
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') goTo(current - 1);
          }}
        >
          {/* Floating "Next" pill cursor */}
          <AnimatePresence>
            {isHovering && (
              <motion.div
                className="next-pill"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.15 }}
                style={{
                  translateX: cursorX,
                  translateY: cursorY,
                }}
              >
                <span className="next-pill-label">Next</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="testimonial-row">
            {/* Image column */}
            <div className="testimonial-image-col">
              <div className="testimonial-image-frame">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={current}
                    src={item.image}
                    alt=""
                    initial={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, scale: 1.05 }
                    }
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
                    className="testimonial-image"
                    loading="lazy"
                  />
                </AnimatePresence>
              </div>
            </div>

            {/* Quote column */}
            <div className="testimonial-quote-col">
              <div className="testimonial-quote-top">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: 10 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: -10 }
                    }
                    transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
                  >
                    <blockquote className="testimonial-quote">
                      &ldquo;{item.highlight}&rdquo;
                    </blockquote>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="testimonial-quote-bottom">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    className="testimonial-attrib"
                    initial={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: 10 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: -10 }
                    }
                    transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
                  >
                    <h3 className="testimonial-name">{item.name}</h3>
                    <p className="testimonial-role">{item.title}</p>
                  </motion.div>
                </AnimatePresence>

                <div className="testimonial-progress">
                  {testimonialsData.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="testimonial-progress-track"
                      aria-label={`Go to testimonial ${idx + 1}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        goTo(idx);
                      }}
                    >
                      <motion.span
                        className="testimonial-progress-fill"
                        initial={{ width: 0 }}
                        animate={{
                          width: idx === current ? '100%' : '0%',
                        }}
                        transition={{
                          duration:
                            idx === current && !isHovering
                              ? AUTO_ADVANCE_MS / 1000
                              : 0,
                          ease: 'linear',
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section CTA — unchanged */}
      <div className="testimonials-cta">
        <p className="testimonials-cta-text">Ready to be next?</p>
        <MagneticButton distance={0.35}>
          <BookCallCta className="testimonials-cta-button">
            <span className="cta-arrow" aria-hidden="true">
              &rarr;
            </span>
          </BookCallCta>
        </MagneticButton>
      </div>
    </section>
  );
};

export default Reviews;
