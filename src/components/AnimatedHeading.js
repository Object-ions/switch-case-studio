import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/components/animatedHeading.scss';

gsap.registerPlugin(ScrollTrigger);

const AnimatedHeading = () => {
  const headingRef = useRef(null);
  const headingWords = [
    "Let's",
    'Build',
    'Something',
    'Exceptional',
    'Together',
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = headingRef.current
        ? headingRef.current.querySelectorAll('.word')
        : [];
      gsap.fromTo(
        words,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          immediateRender: false,
        }
      );
    }, headingRef);
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, []);

  return (
    <div className="contact-heading" ref={headingRef}>
      {headingWords.map((word, i) => (
        <h1 key={i} className="word">
          {word + ' '}
        </h1>
      ))}
    </div>
  );
};

export default AnimatedHeading;
