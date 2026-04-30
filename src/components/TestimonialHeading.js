import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

import useReducedMotion from '../hooks/useReducedMotion';
import '../styles/components/testimonialHeading.scss';

const TestimonialHeading = ({ id }) => {
  const titleRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion) return;

    const el = titleRef.current;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        '--x1': '85%',
        '--y1': '65%',
        '--x2': '10%',
        '--y2': '12%',
        '--x3': '12%',
        '--y3': '88%',
        '--x4': '92%',
        '--y4': '75%',
        duration: 3,
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true,
      });
    }, el);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div className="testimonial-head">
      <p className="testimonial-head__kicker">Proof, not promises</p>
      <h2 id={id} ref={titleRef} className="testimonial-head__title">
        They trusted us. Here's what happened.
      </h2>
    </div>
  );
};

export default TestimonialHeading;
