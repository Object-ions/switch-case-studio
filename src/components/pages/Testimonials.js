import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import TestimonialHeading from '../TestimonialHeading';
import CircleLogo from '../CircleLogo';

import testimonialsData from '../../data/testimonials.json';
import '../../styles/components/testimonials.scss';

const clampIndex = (i, total) => (i + total) % total;

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const total = testimonialsData.length;

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((i) => clampIndex(i + 1, total));
    }, 10000);
    return () => clearInterval(id);
  }, [total]);

  // Basic touch swipe
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

  return (
    <section id="testimonials" aria-label="Testimonials">
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
