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
        '--x1': '85%', '--y1': '25%',   // larger travel
        '--x2': '10%', '--y2': '12%',
        '--x3': '12%', '--y3': '88%',
        '--x4': '92%', '--y4': '75%',
        duration: 10,
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
        What <br /> Our <br /> Clients <br /> Say
      </h2>
    </div>
  );
};

export default TestimonialHeading;
