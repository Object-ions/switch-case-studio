import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReducedMotion from '../hooks/useReducedMotion';
gsap.registerPlugin(ScrollTrigger);

const ProjectsHeader = () => {
  const wrap = useRef(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const tracks = gsap.utils.toArray('.marquee-track');
      // Intro scrub on scroll
      gsap.fromTo(
        tracks,
        { xPercent: 0 },
        {
          xPercent: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: wrap.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
      // Gentle infinite drift
      tracks.forEach((el, idx) => {
        gsap.to(el, {
          xPercent: '-=100',
          repeat: -1,
          duration: 30,
          ease: 'none',
          modifiers: {
            xPercent: gsap.utils.wrap(-100, 0),
          },
          delay: idx * 0.2,
        });
      });
    }, wrap);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div className="projects-row row-header" ref={wrap}>
      <div className="panel panel-header">
        <h1 className="marquee" aria-label="Selected Projects">
          <span className="marquee-track">
            Selected Projects · Selected Projects · Selected Projects · Selected
            Projects · Selected Projects ·
          </span>
          <span className="marquee-track" aria-hidden="true">
            Selected Projects · Selected Projects · Selected Projects · Selected
            Projects · Selected Projects ·
          </span>
        </h1>
      </div>
    </div>
  );
};

export default ProjectsHeader;
