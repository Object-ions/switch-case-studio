import { useRef } from 'react';
import useFloatingScroll from '../../hooks/useFloatingScroll';

import holographic from '../../assets/images/holographic3.png';

import '../../styles/components/intro.scss';

const Intro = () => {
  const bgRef = useRef(null);
  useFloatingScroll(bgRef);

  return (
    <div id="intro">
      <div
        ref={bgRef}
        className="holographic-bg"
        style={{
          backgroundImage: `url(${holographic})`,
        }}
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

        <div className="intro-content">
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

        <div class="why-switch-grid">
          <div class="item1">24/7 support after launch.</div>
          <div class="item2">Every idea deserves the right format.</div>
          <div class="item3">Not all solutions look the same.</div>
          <div class="item4">Lightning-fast turnaround times.</div>
          <div class="item5">Transparent pricing, no hidden fees.</div>
          <div class="item6">
            We think like artists and build like engineers.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
