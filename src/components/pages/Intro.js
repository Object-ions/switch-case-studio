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

  useFloatingScroll(bgRef);

  useEffect(() => {
    const split = new SplitType(contentRef.current, {
      types: 'words, chars',
      tagName: 'span',
    });

    gsap.set(contentRef.current, { opacity: 1 });

    gsap.from(split.chars, {
      yPercent: () => gsap.utils.random(-150, 150),
      xPercent: () => gsap.utils.random(-150, 150),
      stagger: {
        from: 'random',
        amount: 1.2, // slow down total animation
      },
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: contentRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none', // only play once
      },
    });
  }, []);

  return (
    <div id="intro">
      <div
        ref={bgRef}
        className="holographic-bg"
        style={{ backgroundImage: `url(${holographic})` }}
      />
      <div className="intro-wrapper">
        <div className="why-us">
          <h1>
            Why <br />{' '}
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

        <div className="why-switch-grid">
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
