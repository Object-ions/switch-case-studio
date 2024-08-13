import InvertStar from '../../assets/images/invert-star.png';

import '../../styles/components/testimonials.scss';

const testimonialsData = [
  {
    id: 1,
    name: 'Chris Imbo',
    title: 'Founder at Kamea',
    testimonial:
      '9elements is not a service provider, but a real partner! With honest feedback, clever solution proposals and creative ideas of the highest quality - and an incredibly likeable team!',
    image: 'path/to/christian-image.jpg',
  },
  {
    id: 2,
    name: 'Anthony Milian',
    title: 'Owner at Tony Milian Fitness',
    testimonial:
      'From the first meeting I had absolute trust in the team of 9elements and am very happy that my expectations were met at all times. Creative work processes, strong product development and a fantastic result. Collaboration the way you want it.',
    image: 'path/to/alice-image.jpg',
  },
  {
    id: 3,
    name: 'Linoy Buchris',
    title: 'Founder & CEO at La Mer',
    testimonial:
      '9elements is the most creative and enormously talented digital agency in Germany. I am pleased to partner with them for many years, creating innovative products and solutions for a global audience. 9e is always cutting edge!',
    image: 'path/to/lars-image.jpg',
  },
];

const Testimonials = () => {
  return (
    <div id="testimonials">
      <div className="testimonial-meta">
        <div className="testimonial-head">
          <img src={InvertStar} alt="testimonials" />
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
