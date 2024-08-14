import gif5 from '../../assets/gifs/5.gif';

import '../../styles/components/testimonials.scss';

const testimonialsData = [
  {
    id: 1,
    name: 'Chris Imbo',
    title: 'Founder at Kamea',
    testimonial:
      '"Working with Moses and Switch Case Studio was an absolute pleasure. He took our vision and transformed it into a stunning, responsive website that truly captures our brand\'s essence. The attention to detail, creativity, and technical expertise were evident at every step of the process. We’ve seen a significant increase in user engagement since the launch. I highly recommend Moses for anyone looking to elevate their online presence!"',
    image: 'path/to/christian-image.jpg',
  },
  {
    id: 2,
    name: 'Anthony Milian',
    title: 'Owner at Tony Milian Fitness',
    testimonial:
      "Moses at Switch Case Studio exceeded our expectations in every way. From the initial concept to the final product, his dedication and passion were clear. The website he built for us is not only beautiful but also highly functional and user-friendly. His understanding of our needs and goals was spot-on, and the results speak for themselves. We couldn't be happier with our new site!",
    image: 'path/to/alice-image.jpg',
  },
  {
    id: 3,
    name: 'Danielle Bar',
    title: 'Founder & CEO at Saffron Cosmetics',
    testimonial:
      'Switch Case Studio brought our outdated website into the modern era. Moses listened to our needs, offered innovative solutions, and delivered a site that perfectly represents our company. The entire process was seamless, and the communication was excellent throughout. Our customers love the new design, and so do we! Moses is a true professional who goes above and beyond.',
    image: 'path/to/lars-image.jpg',
  },
];

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
