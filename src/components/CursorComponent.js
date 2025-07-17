import { useEffect } from 'react';
import gsap from 'gsap';
import '../styles/components/cursorComponent.scss';

const CursorComponent = () => {
  useEffect(() => {
    const cursor = document.querySelector('#cursor-dot');

    const handleMouseMove = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out',
      });
    };

    document.addEventListener('mousemove', handleMouseMove);

    // Scoped hover behavior: only a tags inside #work
    const workLinks = document.querySelectorAll('#work a');
    workLinks.forEach((link) => {
      link.addEventListener('mouseenter', () => {
        cursor.classList.add('black-border');
      });
      link.addEventListener('mouseleave', () => {
        cursor.classList.remove('black-border');
      });
    });

    // Still apply orange border to other global links
    const globalLinks = document.querySelectorAll('a:not(#work a)');
    globalLinks.forEach((link) => {
      link.addEventListener('mouseenter', () => {
        cursor.classList.add('link-hover');
      });
      link.addEventListener('mouseleave', () => {
        cursor.classList.remove('link-hover');
      });
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);

      workLinks.forEach((link) => {
        link.removeEventListener('mouseenter', () => {});
        link.removeEventListener('mouseleave', () => {});
      });

      globalLinks.forEach((link) => {
        link.removeEventListener('mouseenter', () => {});
        link.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);

  return <div id="cursor-dot"></div>;
};

export default CursorComponent;
