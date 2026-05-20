import { useState, useEffect, useRef, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'motion/react';

import TestimonialHeading from '../TestimonialHeading';
import testimonialsData from '../../data/testimonials.json';
import '../../styles/components/testimonials.scss';

const AUTO_ADVANCE_MS = 10000;
const CURSOR_HIDE_CLASS = 'is-carousel-hover';

const Testimonials = () => {
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
                    <h4 className="testimonial-name">{item.name}</h4>
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
        <a
          href="https://calendar.app.google/83UCJjis2FHUrr1s6"
          target="_blank"
          rel="noopener noreferrer"
          className="testimonials-cta-button"
        >
          Book a Call
          <span className="cta-arrow" aria-hidden="true">
            &rarr;
          </span>
        </a>
      </div>
    </section>
  );
};

export default Testimonials;
