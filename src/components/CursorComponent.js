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

    const handleScroll = () => {
      const contact = document.querySelector('#contact');
      const rect = contact?.getBoundingClientRect();
      if (rect && rect.top <= window.innerHeight && rect.bottom >= 0) {
        cursor.classList.add('orange-bg');
      } else {
        cursor.classList.remove('orange-bg');
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // call initially in case user lands mid-page

    // Links inside #work
    const workLinks = document.querySelectorAll('#work a');
    workLinks.forEach((link) => {
      link.addEventListener('mouseenter', () => {
        cursor.classList.add('black-border');
      });
      link.addEventListener('mouseleave', () => {
        cursor.classList.remove('black-border');
      });
    });

    // Global links and buttons in #contact
    const globalLinks = document.querySelectorAll(
      'a:not(#work a), button, input, a, textarea'
    );
    globalLinks.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        if (el.closest('#contact')) {
          cursor.classList.add('contact-hover');
        } else {
          cursor.classList.add('link-hover');
        }
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('contact-hover');
        cursor.classList.remove('link-hover');
      });
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return <div id="cursor-dot"></div>;
};

export default CursorComponent;
