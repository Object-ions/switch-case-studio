import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';


import testimonialsData from '../../data/testimonials.json';
import '../../styles/components/testimonials.scss';

const Testimonials = () => {
  const scrollRef = useRef(null);
  const titleRef = useRef(null);


  useLayoutEffect(() => {
    // animate the gradient centers (CSS variables)
    const ctx = gsap.context(() => {
      gsap.to(titleRef.current, {
        // drift to new positions, then yo-yo forever
        '--x1': '10%',
        '--y1': '18%',
        '--x2': '20%',
        '--y2': '86%',
        '--x3': '78%',
        '--y3': '72%',
        '--x4': '35%',
        '--y4': '28%',
        duration: 4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    });
    return () => ctx.revert();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -window.innerWidth : window.innerWidth,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div id="testimonials" >
      <div className="testimonial-meta">
        <div className="testimonial-head">
        <h2 ref={titleRef}>What <br/> Our<br/> Clients<br/> Say</h2>
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
      </div>
    </div>
  );
};

export default Testimonials;
