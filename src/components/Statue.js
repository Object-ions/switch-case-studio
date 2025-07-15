import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ReactComponent as StatueSVG } from '../assets/images/statue.svg';
import '../styles/components/statue.scss';

const Statue = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svgEl = svgRef.current;
    const turbulence = svgEl?.querySelector('feTurbulence');

    if (turbulence) {
      gsap.to(turbulence, {
        attr: { baseFrequency: 0.025 },
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    // 🔥 Remove all chances of hiding
    gsap.set(svgEl, {
      autoAlpha: 1,
      opacity: 1,
      visibility: 'visible',
    });

    // Optional: soft float
    gsap.to(svgEl, {
      y: -5,
      duration: 6,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  }, []);

  return (
    <div className="statue">
      <StatueSVG ref={svgRef} className="statue-svg" />
    </div>
  );
};

export default Statue;
