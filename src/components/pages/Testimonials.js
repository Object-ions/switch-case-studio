import gif5 from '../../assets/gifs/5.gif';
import testimonialsData from '../../data/testimonials.json';

import '../../styles/components/testimonials.scss';

const Testimonials = () => {
  return (
    <div id="testimonials">
      <div className="testimonial-meta">
        <div className="testimonial-head">
          <img src={gif5} alt="testimonials" />
          <h2>
            Clients we <br /> partnered with
          </h2>
        </div>
        <div className="testimonials-content">
          <div className="opening-quote">&#8221;</div>
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
        <div className="closing-quote">&#8221;</div>
      </div>
    </div>
  );
};

export default Testimonials;
