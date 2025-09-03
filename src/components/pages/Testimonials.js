import { useRef} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import TestimonialHeading from '../TestimonialHeading';

import testimonialsData from '../../data/testimonials.json';
import '../../styles/components/testimonials.scss';

const Testimonials = () => {
  const scrollRef = useRef(null);

  return (
    <div id="testimonials" >
      <div className="testimonial-meta">
      <TestimonialHeading />

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
      </div>
    </div>
  );
};

export default Testimonials;
