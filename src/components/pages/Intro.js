import { useRef } from 'react';
import useFloatingScroll from '../../hooks/useFloatingScroll';

import bubble1 from '../../assets/images/bubble1.png';
import bubble2 from '../../assets/images/bubble2.png';
import holographic from '../../assets/images/holographic.png';
import Letters from '../Letters';

import '../../styles/components/intro.scss';

const Intro = () => {
  const bubble1Ref = useRef(null);
  const bubble2Ref = useRef(null);

  useFloatingScroll(bubble1Ref);
  useFloatingScroll(bubble2Ref);

  return (
    <div id="intro" style={{ backgroundImage: `url(${holographic})` }}>
      <div className="gradient-mask" />
      <div className="intro-wrapper">
        <div
          ref={bubble1Ref}
          className="bubble1"
          style={{ backgroundImage: `url(${bubble1})` }}
        />
        <Letters />
        <div className="intro-content">
          <h2>
            We believe creativity works best when it moves. Not in straight
            lines, but through unexpected turns— shifting, evolving, expanding.
          </h2>
          {/* <h2>
            “What made the process so exciting was how it kept evolving -
            flowing through so many avenues of creativity, always feeling fresh
            and unexpected.”
          </h2> */}
          <h2>
            We don’t just build. We explore. Every project is a chance to try
            something new, to ask better questions, and to make something that
            feels alive.
          </h2>
        </div>
        <div class="why-switch-grid">
          <div class="item1">24/7 support after launch.</div>
          <div class="item2">Every idea deserves the right format.</div>
          <div class="item3">Not all solutions look the same.</div>
          <div class="item4">Lightning-fast turnaround times.</div>
          <div class="item5">Transparent pricing</div>
          <div class="item6">
            We think like artists and build like engineers.
          </div>
        </div>

        <div
          ref={bubble2Ref}
          className="bubble2"
          style={{ backgroundImage: `url(${bubble2})` }}
        />
      </div>
    </div>
  );
};

export default Intro;
