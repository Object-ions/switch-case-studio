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
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 80%',
          end: 'top 60%',
          scrub: true,
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
