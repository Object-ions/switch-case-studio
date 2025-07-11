import { useEffect, useRef, useState } from 'react';
import '../styles/components/bauhaus.scss';

const Bauhaus = () => {
  const containerRef = useRef();
  const [locked, setLocked] = useState(false);

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

      let progress = 1 - Math.min(distanceFromCenter / maxDistance, 1);

      // 🔒 Lock when fully gathered and scrolled past
      if (!locked && progress >= 0.95 && rect.top < viewportHeight / 2) {
        blocks.forEach((el) => {
          el.style.transform = 'translate(0px, 0px)';
        });
        setLocked(true);
        return;
      }

      // 🔓 Unlock if you scroll back up above the midpoint
      if (locked && rect.top >= viewportHeight / 2) {
        setLocked(false);
      }

      // If not locked, keep updating based on scroll
      if (!locked) {
        blocks.forEach((el) => {
          const x = parseFloat(el.dataset.x || 0);
          const y = parseFloat(el.dataset.y || 0);
          const dx = x * (1 - progress);
          const dy = y * (1 - progress);
          el.style.transform = `translate(${dx}px, ${dy}px)`;
        });
      }
    };

    window.addEventListener('scroll', updateTransforms);
    window.addEventListener('resize', updateTransforms);
    updateTransforms();

    return () => {
      window.removeEventListener('scroll', updateTransforms);
      window.removeEventListener('resize', updateTransforms);
    };
  }, [locked]);

  return (
    <div className="composition" ref={containerRef}>
      <div className="block red" data-x="150" data-y="-120">
        <div className="orange" data-x="-160" data-y="-80"></div>
        <div className="aqua" data-x="90" data-y="160"></div>
      </div>
      <div className="block blue" data-x="180" data-y="-40" />
      <div className="block green" data-x="120" data-y="140">
        <div className="chartreuse" data-x="160" data-y="200"></div>
        <div className="darkgreen" data-x="240" data-y="220"></div>
      </div>
      <div className="block yellow" data-x="80" data-y="180" />
      <div className="block pink" data-x="-180" data-y="160" />
    </div>
  );
};

export default Bauhaus;
