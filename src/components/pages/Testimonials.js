import { useRef } from 'react';
import gif5 from '../../assets/images/renaissance_m.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

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
    <div id="testimonials" style={{ backgroundImage: `url(${gif5})` }}>
      <div className="testimonial-meta">
        <div className="testimonial-head">
          <h2>What Our Clients Say</h2>
        </div>
        <div className="testimonials-content" ref={scrollRef}>
          {testimonialsData.map((testimonial) => (
            <div className="testimonial-item" key={testimonial.id}>
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="testimonial-image"
              />
              <div>
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
              </div>
              <br />
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
