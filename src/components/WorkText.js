import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WorkText = () => {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    // scope all selectors to this component
    const ctx = gsap.context(() => {
      const paragraphs = gsap.utils.toArray('.work-text p');

      // start hidden to avoid flash
      gsap.set(paragraphs, { y: 30, autoAlpha: 0 });

      // create a trigger for each <p>
      paragraphs.forEach((p) => {
        gsap.to(p, {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: p,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    }, rootRef);

    return () => ctx.revert(); // clean up
  }, []);

  return (
    <div className="work-text" ref={rootRef}>
      <p>
        Founded in 2024 by a designer and a developer, we bring a unique blend
        of <span className="highlight-block">design thinking</span> and{' '}
        <span className="highlight-block">technical skill</span> to every
        project. Whether you're launching something new or leveling up what you
        already have, we work closely with you to clarify your message, refine
        your presence, and grow your business online.
      </p>
      <br />
      <p>
        We approach every project with{' '}
        <span className="highlight-block"> curiosity</span> and{' '}
        <span className="highlight-block"> creativity</span>. Whether it’s a
        brand refresh, a website, or a full campaign — we think through the{' '}
        <span className="highlight-block"> details</span> and help ideas take
        shape with <span className="highlight-block"> clarity and style.</span>
      </p>
      <br />
      <p>
        At our core, we’re driven by a love for
        <span className="highlight-block">art and philosophy.</span> We draw
        inspiration from visual culture, aesthetic theory, and movements like
        modernism, and formalism. These passions shape how we think about
        perception, design, and communication — and they’re part of why{' '}
        <span className="highlight-block">we care so much about the craft.</span>
      </p>
    </div>
  );
};

export default WorkText;
