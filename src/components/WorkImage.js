import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import statueBlue from '../assets/images/statue_blue.png';

gsap.registerPlugin(ScrollTrigger);

const WorkImage = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const img = imageRef.current;

    gsap.fromTo(
      img,
      { y: 300 },
      {
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '#work', // better to use section container
          start: 'top bottom', // when top of #work hits bottom of viewport
          end: 'bottom center', // continue animating until mid-way through
          scrub: 1, // directly tied to scroll
        },
      }
    );
  }, []);

  return (
    <div className="work-image">
      <img ref={imageRef} src={statueBlue} alt="rome statue" />
    </div>
  );
};

export default WorkImage;
