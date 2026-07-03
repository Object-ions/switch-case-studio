import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import BookCallCta from '../ui/BookCallCta';


const AboutCTA = () => {
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
        <BookCallCta className="highlight-block" prefix="& ">
          {' '}
          <FontAwesomeIcon
            icon={faArrowUpRightFromSquare}
            style={{ fontSize: '12px' }}
          />
        </BookCallCta>
      </div>
    </div>
  );
};

export default AboutCTA;
