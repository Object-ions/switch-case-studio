import '../../styles/components/testimonialHeading.scss';

const TestimonialHeading = ({ id }) => {
  return (
    <div className="testimonial-head">
      {/* Solid white, weight for emphasis (REFRESH-1): the animated
          gradient fill read as decoration, and the kicker above it
          restated the heading. */}
      <h2 id={id} className="testimonial-head__title">
        They trusted us. Here's what happened.
      </h2>
    </div>
  );
};

export default TestimonialHeading;
