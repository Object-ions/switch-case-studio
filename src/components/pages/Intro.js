import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import useFloatingScroll from '../../hooks/useFloatingScroll';

import holographic from '../../assets/images/holographic3.png';
import '../../styles/components/intro.scss';

gsap.registerPlugin(ScrollTrigger);

const Intro = () => {
  const bgRef = useRef(null);
  const contentRef = useRef(null);
  const wrapperRef = useRef(null);
  const gridRef = useRef(null);

  useFloatingScroll(bgRef);

  useEffect(() => {
    const split = new SplitType(contentRef.current, {
      types: 'words, chars',
      tagName: 'span',
    });

    // Optional: ensure everything starts visible (can be removed if using .from properly)
    gsap.set(wrapperRef.current, { opacity: 1 });
    gsap.set(contentRef.current, { opacity: 1 });
    gsap.set(gridRef.current.querySelectorAll('div'), { opacity: 1 });

    // Animate characters
    gsap.from(split.chars, {
      yPercent: () => gsap.utils.random(-150, 150),
      xPercent: () => gsap.utils.random(-150, 150),
      opacity: 0,
      stagger: {
        from: 'random',
        amount: 1.2,
      },
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: contentRef.current,
        start: 'top bottom',
        toggleActions: 'play none none none',
      },
    });

    // Animate wrapper
    gsap.from(wrapperRef.current, {
      opacity: 0,
      y: 100,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: 'top bottom',
      },
    });

    // Animate h2s
    gsap.from(contentRef.current.querySelectorAll('h2'), {
      opacity: 0,
      y: 50,
      stagger: 0.3,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: contentRef.current,
        start: 'top bottom',
      },
    });

    // Animate grid items
    gsap.from(gridRef.current.querySelectorAll('div'), {
      opacity: 0,
      scale: 0.9,
      y: 30,
      stagger: 0.15,
      duration: 0.6,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: gridRef.current,
        start: 'top bottom',
      },
    });

    return () => {
      split.revert(); // clean up split-type
    };
  }, []);

  return (
    <div id="intro">
      <div
        ref={bgRef}
        className="holographic-bg"
        style={{ backgroundImage: `url(${holographic})` }}
      />
      <div className="intro-wrapper" ref={wrapperRef}>
        <div className="why-us">
          <h1>
            Why <br />
            <span className="outlined">
              Switch <br /> Case <br />
            </span>
            Studio?
          </h1>
        </div>

        <div className="intro-content" ref={contentRef}>
          <h2>
            We believe creativity works best when it moves. Not in straight
            lines, but through unexpected turns —{' '}
            <span className="highlight">shifting, evolving, expanding.</span>
          </h2>
          <h2>
            Every project is a chance to try something new, to ask better
            questions, and to make something that feels alive.
          </h2>
        </div>

        <div className="why-switch-grid" ref={gridRef}>
          <div className="item1">24/7 support after launch.</div>
          <div className="item2">Every idea deserves the right format.</div>
          <div className="item3">Not all solutions look the same.</div>
          <div className="item4">Lightning-fast turnaround times.</div>
          <div className="item5">Transparent pricing, no hidden fees.</div>
          <div className="item6">
            We think like artists and build like engineers.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
