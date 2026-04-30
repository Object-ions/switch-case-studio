import '../styles/components/testimonialHeading.scss';

const TestimonialHeading = ({ id }) => {
  return (
    <div className="testimonial-head">
      <p className="testimonial-head__kicker">Proof, not promises</p>
      <h2 id={id} className="testimonial-head__title">
        They trusted us. Here's what happened.
      </h2>
    </div>
  );
};

export default TestimonialHeading;
