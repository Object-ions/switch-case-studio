import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ReactComponent as StatueSVG } from '../assets/images/statue.svg';
import '../styles/components/statue.scss';

const Statue = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current) {
      gsap.fromTo(
        svgRef.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: svgRef.current,
            start: 'top 85%',
            end: 'top 60%',
            scrub: true,
          },
        }
      );
    }
  }, []);

  return (
    <div className="statue">
      <StatueSVG ref={svgRef} className="statue-svg" />
    </div>
  );
};

export default Statue;
