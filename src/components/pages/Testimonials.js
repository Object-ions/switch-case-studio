import React, { useRef } from 'react';
import gif5 from '../../assets/gifs/5.gif';
import testimonialsData from '../../data/testimonials.json';

import '../../styles/components/testimonials.scss';

const Testimonials = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -window.innerWidth : window.innerWidth,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div id="testimonials">
      <div className="testimonial-meta">
        <div className="testimonial-head">
          <img src={gif5} alt="testimonials" />
          <h2>
            Clients we <br /> partnered with
          </h2>
        </div>
        <div className="testimonials-content" ref={scrollRef}>
          {testimonialsData.map((testimonial) => (
            <div className="testimonial-item" key={testimonial.id}>
              <div className="testimonial-quote"></div>
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="testimonial-image"
              />
              <p className="testimonial-text">{testimonial.testimonial}</p>
              <div className="testimonial-author">
                <p className="author-name">{testimonial.name.toUpperCase()}</p>
                <p className="author-title">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="arrows">
          <button className="arrow left-arrow" onClick={() => scroll('left')}>
            &#8249;
          </button>
          <button className="arrow right-arrow" onClick={() => scroll('right')}>
            &#8250;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
