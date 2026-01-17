import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import '../styles/components/testimonialHeading.scss';

const TestimonialHeading = () => {
  const titleRef = useRef(null);

  useLayoutEffect(() => {
    const el = titleRef.current;
    const ctx = gsap.context(() => {
      // More visible movement suggestion (feel free to tweak)
      gsap.to(el, {
        '--x1': '85%',
        '--y1': '65%', // larger travel
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
  }, []);

  return (
    <div className="testimonial-head">
      <h2 ref={titleRef}>
        What Our Clients Say About the impact of our work and partnership.
      </h2>
    </div>
  );
};

export default TestimonialHeading;
