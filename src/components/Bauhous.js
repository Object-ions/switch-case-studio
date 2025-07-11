import { useEffect, useRef } from 'react';
import '../styles/components/bauhaus.scss';

const Bauhaus = () => {
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    const blocks = container.querySelectorAll(
      '.block, .orange, .aqua, .chartreuse, .darkgreen'
    );

    const updateTransforms = () => {
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const center = rect.top + rect.height / 2;
      const distanceFromCenter = Math.abs(center - viewportHeight / 2);
      const maxDistance = viewportHeight / 2 + rect.height / 2;

      // Calculate progress (0 = scattered, 1 = assembled)
      let progress = 1 - Math.min(distanceFromCenter / maxDistance, 1);

      // Lock if mostly assembled
      if (progress >= 0.9) progress = 1;

      blocks.forEach((el) => {
        const x = parseFloat(el.dataset.x || 0);
        const y = parseFloat(el.dataset.y || 0);
        const dx = x * (1 - progress);
        const dy = y * (1 - progress);
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
    };

    window.addEventListener('scroll', updateTransforms);
    window.addEventListener('resize', updateTransforms);
    updateTransforms();

    return () => {
      window.removeEventListener('scroll', updateTransforms);
      window.removeEventListener('resize', updateTransforms);
    };
  }, []);

  return (
    <div className="composition" ref={containerRef}>
      <div className="block red" data-x="50" data-y="-50">
        <div className="orange" data-x="-60" data-y="-20"></div>
        <div className="aqua" data-x="10" data-y="60"></div>
      </div>
      <div className="block blue" data-x="90" data-y="-10" />
      <div className="block green" data-x="40" data-y="50">
        <div className="chartreuse" data-x="70" data-y="90"></div>
        <div className="darkgreen" data-x="120" data-y="110"></div>
      </div>
      <div className="block yellow" data-x="20" data-y="100" />
      <div className="block pink" data-x="-60" data-y="80" />
    </div>
  );
};

export default Bauhaus;
