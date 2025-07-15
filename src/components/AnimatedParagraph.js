import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../styles/components/animatedParagraph.scss';

const AnimatedParagraph = () => {
  const paragraphRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      paragraphRef.current,
      { opacity: 0.1, y: 30 },
      {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
        duration: 1,
        scrollTrigger: {
          trigger: paragraphRef.current,
          start: 'top 95%',
          end: 'top 60%',
          scrub: true,
        },
      }
    );
  }, []);

  return (
    <div className="animated-paragraph">
      <p ref={paragraphRef} className="about-fade-text">
        We design and build websites that work as good as they look. Whether
        you're launching a new brand, refreshing your digital presence, or
        scaling an online store—we help businesses show up sharp and stay ahead.
        Clean design meets smart development.
      </p>
    </div>
  );
};

export default AnimatedParagraph;
