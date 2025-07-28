import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/components/work.scss';

gsap.registerPlugin(ScrollTrigger);

const WorkCTA = () => {
  const ctaRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      ctaRef.current,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, []);

  return (
    <div className="work-cta" ref={ctaRef}>
      <div className="text-wrapper">
        <p>Let's Bring Your Idea To life</p>
        <a href="#home" className="highlight-block">
          {' '}
          & Book a Discovery Call
        </a>
      </div>
    </div>
  );
};

export default WorkCTA;
