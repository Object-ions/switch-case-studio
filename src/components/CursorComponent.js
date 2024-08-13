import React, { useEffect } from 'react';
import gsap from 'gsap';
import '../styles/components/cursorComponent.scss';

const CursorComponent = () => {
  useEffect(() => {
    const cursor = document.querySelector('#cursor-dot');
    const hoverTargets = document.querySelectorAll('.hover-target');

    document.addEventListener('mousemove', (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out',
      });
    });

    hoverTargets.forEach((target) => {
      target.addEventListener('mouseenter', () => {
        gsap.to(cursor, {
          scale: 1.5,
          duration: 0.3,
        });
        cursor.classList.add('invert');
      });

      target.addEventListener('mouseleave', () => {
        gsap.to(cursor, {
          scale: 1,
          duration: 0.3,
        });
        cursor.classList.remove('invert');
      });
    });
  }, []);

  return <div id="cursor-dot"></div>;
};

export default CursorComponent;
