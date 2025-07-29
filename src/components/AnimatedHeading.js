import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../styles/components/animatedHeading.scss';

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
    const words = gsap.utils.toArray('.about-heading .word');

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
      }
    );
  }, []);

  return (
    <div className="content">
      <div className="about-heading" ref={headingRef}>
        {headingWords.map((word, i) => (
          <h1 key={i} className="word">
            {word + ' '}
          </h1>
        ))}
      </div>
    </div>
  );
};

export default AnimatedHeading;
