import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WorkText = () => {
  const textRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      textRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, []);

  return (
    <div className="work-text" ref={textRef}>
      <p>
        Founded in 2024 by a designer and a developer, we bring a unique blend
        of <span className="highlight-block">design thinking</span> and{' '}
        <span className="highlight-block">technical skill</span> to every
        project. Whether you're launching something new or leveling up what you
        already have, we work closely with you to clarify your message, refine
        your presence, and grow your business online.
      </p>
      <br />
      <p>
        We approach every project with{' '}
        <span className="highlight-block"> curiosity</span> and{' '}
        <span className="highlight-block"> creativity</span>. Whether it’s a
        brand refresh, a website, or a full campaign — we think through the{' '}
        <span className="highlight-block"> details</span> and help ideas take
        shape with <span className="highlight-block"> clarity and style.</span>
      </p>
    </div>
  );
};

export default WorkText;
