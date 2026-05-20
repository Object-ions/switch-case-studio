import GradientText from './GradientText';
import '../styles/components/testimonialHeading.scss';

const TITLE_GRADIENT_COLORS = ['#ff834a', '#d99cff', '#f0d7ff'];

const TestimonialHeading = ({ id }) => {
  return (
    <div className="testimonial-head">
      <p className="testimonial-head__kicker">Proof, not promises</p>
      <h2 id={id} className="testimonial-head__title">
        <GradientText
          colors={TITLE_GRADIENT_COLORS}
          animationSpeed={8}
          showBorder={false}
        >
          They trusted us. Here's what happened.
        </GradientText>
      </h2>
    </div>
  );
};

export default TestimonialHeading;
