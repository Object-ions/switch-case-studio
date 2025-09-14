import { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import TestimonialHeading from '../TestimonialHeading';
import CircleLogo from '../CircleLogo';

import testimonialsData from '../../data/testimonials.json';
import '../../styles/components/testimonials.scss';

const Testimonials = () => {
  const [current, setCurrent] = useState(0); // carousel behavior later
  const total = testimonialsData.length;

  const t = useMemo(() => testimonialsData[current] || {}, [current]);

  return (
    <section id="testimonials" aria-label="Testimonials">
      <CircleLogo />

      <div className="testimonial-meta">
        {/* LEFT PANEL: big heading + intro copy */}
        <aside className="panel-left" aria-label="Section heading and intro">
          <TestimonialHeading />
          <p className="intro">
            See what our clients say about the impact of our work and
            partnership.
          </p>
        </aside>

        {/* RIGHT PANEL: stage */}
        <section className="panel-stage" aria-live="polite">
          {/* top controls row */}
          <div className="controls" aria-label="Carousel controls">
            <button
              type="button"
              className="ctrl ctrl-prev"
              aria-label="Previous testimonial"
              onClick={() => setCurrent((i) => (i - 1 + total) % total)}
            >
              <FontAwesomeIcon icon={faArrowLeft} fontSize={'24px'} />
            </button>
            <button
              type="button"
              className="ctrl ctrl-next"
              aria-label="Next testimonial"
              onClick={() => setCurrent((i) => (i + 1) % total)}
            >
              <FontAwesomeIcon icon={faArrowRight} fontSize={'24px'} />
            </button>
          </div>

          {/* slide content (single visible slide) */}
          <article className="slide">
            <div className="slide-head">
              <span className="slide-index">
                {(current + 1).toString().padStart(2, '0')}
              </span>
              <h3 className="slide-name">{t.name}</h3>
            </div>
            <p className="slide-company">{t.company || t.title}</p>

            <div className="slide-body">
              <img
                src={t.image}
                alt={t.name}
                className="avatar"
                loading="lazy"
                width="112"
                height="112"
              />
              <blockquote className="quote">{t.testimonial}</blockquote>
            </div>
          </article>
        </section>
      </div>
    </section>
  );
};

export default Testimonials;
