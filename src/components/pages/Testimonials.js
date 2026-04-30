import { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import TestimonialHeading from '../TestimonialHeading';
import useReducedMotion from '../../hooks/useReducedMotion';
import testimonialsData from '../../data/testimonials.json';
import '../../styles/components/testimonials.scss';

gsap.registerPlugin(ScrollTrigger);

const AUTO_ADVANCE_MS = 10000;
const SWIPE_THRESHOLD = 40;

const clampIndex = (i, total) => (i + total) % total;

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState(false);
  // Once user takes manual control, auto-advance is permanently off.
  const [autoAdvance, setAutoAdvance] = useState(true);
  // Pause flag for hover/focus (does NOT permanently disable like manual nav).
  const [paused, setPaused] = useState(false);

  const total = testimonialsData.length;
  const reducedMotion = useReducedMotion();

  const root = useRef(null);
  const slidesWrap = useRef(null);
  const prevIndexRef = useRef(0);

  /* ── Manual navigation. Stops auto-advance permanently. ── */
  const goTo = useCallback(
    (i) => {
      setAutoAdvance(false);
      setExpanded(false);
      setCurrent(clampIndex(i, total));
    },
    [total],
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  /* ── Auto-advance.
       Stops permanently after manual nav (autoAdvance=false).
       Pauses temporarily on hover/focus/expand (paused=true). ── */
  useEffect(() => {
    if (!autoAdvance || paused || expanded) return;

    const id = setInterval(() => {
      setCurrent((i) => clampIndex(i + 1, total));
    }, AUTO_ADVANCE_MS);

    return () => clearInterval(id);
  }, [autoAdvance, paused, expanded, total]);

  /* ── Touch swipe ── */
  const startX = useRef(null);
  const onTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (dx > SWIPE_THRESHOLD) prev();
    if (dx < -SWIPE_THRESHOLD) next();
    startX.current = null;
  };

  /* ── Intro reveal (run once on mount) ── */
  useLayoutEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top 80%',
          once: true,
        },
      });

      tl.from(root.current.querySelector('.panel-left'), {
        autoAlpha: 0,
        y: 24,
        duration: 0.6,
        ease: 'power2.out',
      }).from(
        root.current.querySelector('.panel-stage'),
        {
          autoAlpha: 0,
          y: 24,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.3',
      );
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  /* ── Slide cross-fade transition ── */
  useLayoutEffect(() => {
    const slides = gsap.utils.toArray(
      slidesWrap.current?.querySelectorAll('.slide') || [],
    );
    if (!slides.length) return;

    const prevIdx = prevIndexRef.current;
    const nextIdx = current;
    if (prevIdx === nextIdx) return;

    const prevEl = slides[prevIdx];
    const nextEl = slides[nextIdx];

    if (reducedMotion) {
      // Snap immediately, no animation.
      gsap.set(prevEl, { autoAlpha: 0, display: 'none' });
      gsap.set(nextEl, { autoAlpha: 1, display: 'flex', xPercent: 0 });
      prevIndexRef.current = nextIdx;
      return;
    }

    // Direction: forward unless wrap-around.
    const dir =
      (nextIdx > prevIdx && !(prevIdx === 0 && nextIdx === total - 1)) ||
      (prevIdx === total - 1 && nextIdx === 0)
        ? 1
        : -1;

    gsap.set(nextEl, { xPercent: 12 * dir, autoAlpha: 0, display: 'flex' });

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out', duration: 0.5 },
      onComplete: () => {
        gsap.set(prevEl, { clearProps: 'all', display: 'none' });
        gsap.set(nextEl, { clearProps: 'all', display: 'flex' });
      },
    });

    tl.to(prevEl, { xPercent: -12 * dir, autoAlpha: 0, duration: 0.45 }, 0)
      .to(nextEl, { xPercent: 0, autoAlpha: 1 }, 0.05);

    prevIndexRef.current = nextIdx;
  }, [current, total, reducedMotion]);

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      ref={root}
    >
      <div
        className="testimonial-meta"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <aside className="panel-left">
          <TestimonialHeading id="testimonials-heading" />
        </aside>

        <section className="panel-stage" aria-roledescription="carousel">
          <div
            className="slides"
            ref={slidesWrap}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            aria-live="polite"
            aria-atomic="true"
          >
            {testimonialsData.map((item, i) => {
              const isActive = i === current;
              const showFull = isActive && expanded;
              return (
                <article
                  key={item.id ?? i}
                  className={`slide ${isActive ? 'is-active' : ''}`}
                  aria-hidden={!isActive}
                >
                  <header className="slide-header">
                    <img
                      src={item.image}
                      alt=""
                      className="avatar"
                      loading="lazy"
                    />
                    <div className="slide-id">
                      <h3 className="slide-name">{item.name}</h3>
                      <p className="slide-company">{item.title}</p>
                    </div>
                  </header>

                  <blockquote className="slide-quote">
                    {item.highlight && (
                      <p className="slide-highlight">
                        &ldquo;{item.highlight}&rdquo;
                      </p>
                    )}

                    {item.testimonial && item.testimonial !== item.highlight && (
                      <div
                        className={`slide-full ${showFull ? 'is-open' : ''}`}
                        id={`testimonial-full-${item.id}`}
                        aria-hidden={!showFull}
                      >
                        <p className="slide-full-text">{item.testimonial}</p>
                      </div>
                    )}
                  </blockquote>

                  {item.testimonial &&
                    item.testimonial !== item.highlight &&
                    isActive && (
                      <button
                        type="button"
                        className={`read-more ${expanded ? 'is-open' : ''}`}
                        onClick={() => setExpanded((v) => !v)}
                        aria-expanded={expanded}
                        aria-controls={`testimonial-full-${item.id}`}
                      >
                        <span>{expanded ? 'Show less' : 'Read full review'}</span>
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className="read-more-icon"
                          aria-hidden="true"
                        />
                      </button>
                    )}
                </article>
              );
            })}
          </div>

          <div className="stage-footer">
            <div
              className="dots"
              role="tablist"
              aria-label="Select testimonial"
            >
              {testimonialsData.map((item, i) => (
                <button
                  key={item.id ?? i}
                  type="button"
                  className={`dot ${i === current ? 'is-active' : ''}`}
                  onClick={() => goTo(i)}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Show testimonial ${i + 1} of ${total}: ${item.name}`}
                />
              ))}
            </div>

            <div className="controls">
              <button
                type="button"
                className="ctrl"
                onClick={prev}
                aria-label="Previous testimonial"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              <button
                type="button"
                className="ctrl"
                onClick={next}
                aria-label="Next testimonial"
              >
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </div>
        </section>
      </div>

      <div className="testimonials-cta">
        <p className="testimonials-cta-text">
          Ready to be next?
        </p>
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
