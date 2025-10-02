// Testimonials.jsx
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import TestimonialHeading from '../TestimonialHeading';
import CircleLogo from '../CircleLogo';

import testimonialsData from '../../data/testimonials.json';
import '../../styles/components/testimonials.scss';

gsap.registerPlugin(ScrollTrigger);

const clampIndex = (i, total) => (i + total) % total;

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const total = testimonialsData.length;

  // refs
  const root = useRef(null);
  const slidesWrap = useRef(null);
  const prevIndexRef = useRef(0);
  const reducedMotion = useRef(false);

  // auto advance
  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((i) => clampIndex(i + 1, total));
    }, 10000);
    return () => clearInterval(id);
  }, [total]);

  // basic touch swipe
  const startX = useRef(null);
  const onTouchStart = (e) => (startX.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    const threshold = 40;
    if (dx > threshold) setCurrent((i) => clampIndex(i - 1, total));
    if (dx < -threshold) setCurrent((i) => clampIndex(i + 1, total));
    startX.current = null;
  };

  // detect reduced motion once
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion.current = mq.matches;
    const onChange = () => (reducedMotion.current = mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  // section intro on scroll
  useLayoutEffect(() => {
    if (reducedMotion.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top 80%',
          once: true,
        },
      });

      // Left panel rises in, then stage
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
        '-=0.3'
      );

      // Optional: spin CircleLogo slowly if it has a recognizable class
      const logoEl =
        root.current.querySelector('.circle-logo') ||
        root.current.querySelector('[data-circle-logo]');

      if (logoEl) {
        gsap.to(logoEl, {
          rotate: 360,
          duration: 60,
          ease: 'none',
          repeat: -1,
        });
      }

      // Button press feedback
      const buttons = gsap.utils.toArray(
        root.current.querySelectorAll('.controls .ctrl')
      );
      buttons.forEach((btn) => {
        btn.addEventListener('mousedown', () =>
          gsap.to(btn, { scale: 0.94, duration: 0.12, ease: 'power2.out' })
        );
        const up = () =>
          gsap.to(btn, { scale: 1, duration: 0.18, ease: 'power2.out' });
        btn.addEventListener('mouseup', up);
        btn.addEventListener('mouseleave', up);
      });
    }, root);

    return () => ctx.revert();
  }, []);

  // slide transitions
  useLayoutEffect(() => {
    if (reducedMotion.current) return;

    const slides = gsap.utils.toArray(
      slidesWrap.current?.querySelectorAll('.slide')
    );

    if (!slides.length) return;

    const prev = prevIndexRef.current;
    const next = current;
    if (prev === next) return;

    const dir =
      (next > prev && !(prev === 0 && next === slides.length - 1)) ||
      (prev === slides.length - 1 && next === 0)
        ? 1
        : -1;

    const prevEl = slides[prev];
    const nextEl = slides[next];

    // Ensure both are visible for the transition duration
    gsap.set([prevEl, nextEl], { pointerEvents: 'none' });

    // Start positions
    gsap.set(nextEl, { xPercent: 12 * dir, autoAlpha: 0 });

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out', duration: 0.5 },
      onComplete: () => gsap.set([prevEl, nextEl], { clearProps: 'all' }),
    });

    tl.to(prevEl, { xPercent: -12 * dir, autoAlpha: 0, duration: 0.45 }, 0).to(
      nextEl,
      { xPercent: 0, autoAlpha: 1 },
      0.05
    );

    prevIndexRef.current = next;
  }, [current]);

  return (
    <section id="testimonials" aria-label="Testimonials" ref={root}>
      <CircleLogo />

      <div className="testimonial-meta">
        {/* LEFT PANEL */}
        <aside className="panel-left" aria-label="Section heading and intro">
          <TestimonialHeading />
          <p className="intro">About the impact of our work and partnership.</p>
        </aside>

        {/* RIGHT PANEL */}
        <section className="panel-stage" aria-live="polite">
          {/* top controls row */}
          <div className="controls" aria-label="Carousel controls">
            <button
              type="button"
              className="ctrl ctrl-prev"
              aria-label="Previous testimonial"
              onClick={() => setCurrent((i) => clampIndex(i - 1, total))}
            >
              <FontAwesomeIcon icon={faArrowLeft} fontSize="24px" />
            </button>
            <button
              type="button"
              className="ctrl ctrl-next"
              aria-label="Next testimonial"
              onClick={() => setCurrent((i) => clampIndex(i + 1, total))}
            >
              <FontAwesomeIcon icon={faArrowRight} fontSize="24px" />
            </button>
          </div>

          {/* slides layer */}
          <div
            className="slides"
            ref={slidesWrap}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {testimonialsData.map((item, i) => (
              <article
                key={item.id ?? i}
                className={`slide ${i === current ? 'is-active' : ''}`}
                aria-hidden={i === current ? 'false' : 'true'}
              >
                <div className="slide-head">
                  <span className="slide-index">
                    {(i + 1).toString().padStart(2, '0')}
                  </span>
                  <h3 className="slide-name">{item.name}</h3>
                </div>
                <p className="slide-company">{item.company || item.title}</p>

                <div className="slide-body">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="avatar"
                    loading="lazy"
                    width="112"
                    height="112"
                  />
                  <blockquote className="quote">{item.testimonial}</blockquote>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};

export default Testimonials;
