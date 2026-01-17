// Testimonials.jsx
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import TestimonialHeading from '../TestimonialHeading';
import testimonialsData from '../../data/testimonials.json';
import '../../styles/components/testimonials.scss';

gsap.registerPlugin(ScrollTrigger);

const clampIndex = (i, total) => (i + total) % total;

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const total = testimonialsData.length;

  const root = useRef(null);
  const slidesWrap = useRef(null);
  const prevIndexRef = useRef(0);
  const reducedMotion = useRef(false);

  // Auto-advance
  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((i) => clampIndex(i + 1, total));
    }, 10000);
    return () => clearInterval(id);
  }, [total]);

  // Touch Swipe
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

  // Reduced Motion Detection
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion.current = mq.matches;
    const onChange = () => (reducedMotion.current = mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  // Intro Animation
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

      // Button Press Effect
      const buttons = gsap.utils.toArray('.controls .ctrl');
      buttons.forEach((btn) => {
        btn.addEventListener('mousedown', () =>
          gsap.to(btn, { scale: 0.9, duration: 0.1 })
        );
        const up = () => gsap.to(btn, { scale: 1, duration: 0.2 });
        btn.addEventListener('mouseup', up);
        btn.addEventListener('mouseleave', up);
      });

    }, root);

    return () => ctx.revert();
  }, []);

  // Slide Transition
  useLayoutEffect(() => {
    if (reducedMotion.current) return;
    const slides = gsap.utils.toArray(slidesWrap.current?.querySelectorAll('.slide'));
    if (!slides.length) return;

    const prev = prevIndexRef.current;
    const next = current;
    if (prev === next) return;

    const dir = (next > prev && !(prev === 0 && next === total - 1)) ||
      (prev === total - 1 && next === 0) ? 1 : -1;

    const prevEl = slides[prev];
    const nextEl = slides[next];

    gsap.set([prevEl, nextEl], { pointerEvents: 'none' });
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

    prevIndexRef.current = next;
  }, [current, total]);

  return (
    <section id="testimonials" aria-label="Testimonials" ref={root}>
      {/* CircleLogo removed from here */}

      <div className="testimonial-meta">
        <aside className="panel-left">
          <TestimonialHeading />
        </aside>

        <section className="panel-stage" aria-live="polite">
          <div className="controls">
            <button
              className="ctrl"
              onClick={() => setCurrent((i) => clampIndex(i - 1, total))}
              aria-label="Previous"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <button
              className="ctrl"
              onClick={() => setCurrent((i) => clampIndex(i + 1, total))}
              aria-label="Next"
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>

          <div className="slides" ref={slidesWrap} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            {testimonialsData.map((item, i) => (
              <article
                key={item.id ?? i}
                className={`slide ${i === current ? 'is-active' : ''}`}
                style={{ display: i === current ? 'flex' : 'none' }}
              >
                <header className="slide-header">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="avatar"
                    loading="lazy"
                  />
                  <h3 className="slide-name">{item.name}</h3>
                </header>

                <p className="slide-company">{item.company || item.title}</p>
                <blockquote className="quote">{item.testimonial}</blockquote>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};

export default Testimonials;