// Bauhaus.jsx
import { useEffect, useRef } from 'react';
import '../styles/components/bauhaus.scss';

const Bauhaus = () => {
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    const blocks = container.querySelectorAll('.block, .block *');

    let isReady = false;
    container.classList.add('show');

    const timer = setTimeout(() => {
      isReady = true;
    }, 500);

    let lastScrollY = window.scrollY;
    let locked = false;

    const handleScroll = () => {
      if (!isReady) return;

      const scrollY = window.scrollY;
      const scrollingDown = scrollY > lastScrollY;
      lastScrollY = scrollY;

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const top = rect.top;
      const height = rect.height;
      const triggerPoint = viewportHeight * 0.9;

      const rawProgress =
        1 - Math.min(Math.max((top + height - triggerPoint) / height, 0), 1);
      const progress = Math.round(rawProgress * 1000) / 1000;

      if (progress >= 1 && scrollingDown) {
        locked = true;
        blocks.forEach((el) => {
          el.style.transform = 'none';
        });
        return;
      }

      if (progress < 1 && !scrollingDown) {
        locked = false;
      }

      if (!locked) {
        blocks.forEach((el) => {
          const x = parseInt(el.dataset.x || '0');
          const y = parseInt(el.dataset.y || '0');
          const dx = x * (1 - progress);
          const dy = y * (1 - progress);
          el.style.transform = `translate(${dx}px, ${dy}px)`;
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
