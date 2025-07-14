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

    // Handle black-border cursor on hover over #services
    const services = document.querySelector('#services');
    const handleEnterServices = () => cursor.classList.add('black-border');
    const handleLeaveServices = () => cursor.classList.remove('black-border');

    services?.addEventListener('mouseenter', handleEnterServices);
    services?.addEventListener('mouseleave', handleLeaveServices);

    // Handle link-hover logic
    const links = document.querySelectorAll('a');
    links.forEach((link) => {
      link.addEventListener('mouseenter', () => {
        cursor.classList.add('link-hover');
      });
      link.addEventListener('mouseleave', () => {
        cursor.classList.remove('link-hover');
      });
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      services?.removeEventListener('mouseenter', handleEnterServices);
      services?.removeEventListener('mouseleave', handleLeaveServices);

      links.forEach((link) => {
        link.removeEventListener('mouseenter', () => {});
        link.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);

  return <div id="cursor-dot"></div>;
};

export default CursorComponent;
