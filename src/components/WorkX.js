import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ReactComponent as XIcon } from '../assets/images/xorange.svg';

gsap.registerPlugin(ScrollTrigger);

const WorkX = () => {
  const xRef = useRef(null);

  useEffect(() => {
    const xNodes = xRef.current.querySelectorAll('.x-icon');

    gsap.fromTo(
      xNodes,
      {
        y: 0,
        x: (i) => i * 30,
        rotation: 0,
        scale: 1,
      },
      {
        y: (i) => Math.sin(i * 0.6) * 60,
        x: (i) => i * 30 - 200,
        rotation: (i) => i * 12,
        scale: 1.3,
        stagger: 0.05,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: '#work',
          start: 'top 70%',
          end: 'bottom center',
          scrub: true,
        },
      }
    );
  }, []);

  return (
    <div className="work-x" ref={xRef}>
      {Array.from({ length: 20 }).map((_, i) => (
        <div className="x-icon" key={i}>
          <XIcon />
        </div>
      ))}
    </div>
  );
};

export default WorkX;
