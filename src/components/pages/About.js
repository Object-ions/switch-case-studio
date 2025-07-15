import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FloatingSquares from '../FloatingSquares';
import '../../styles/components/about.scss';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const headingRef = useRef(null);
  const paragraphRef = useRef(null);

  useEffect(() => {
    const words = gsap.utils.toArray('.about-heading .word');

    // Animate each word in the heading
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

    // Animate paragraph as a unit
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

  const headingWords = [
    "Let's",
    'Build',
    'Something',
    'Exceptional',
    'Together',
  ];

  return (
    <div id="about">
      <div className="about-grid">
        <div className="div1">1</div>

        <div className="squares">
          <FloatingSquares />
        </div>

        <div className="div3">3</div>

        <div className="content">
          <div className="about-heading" ref={headingRef}>
            {headingWords.map((word, i) => (
              <h1 key={i} className="word">
                {word + ' '}
              </h1>
            ))}
          </div>
        </div>

        <div className="div5">
          <p ref={paragraphRef} className="about-fade-text">
            We design and build websites that work as good as they look. Whether
            you're launching a new brand, refreshing your digital presence, or
            scaling an online store—we help businesses show up sharp and stay
            ahead. Clean design meets smart development.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
