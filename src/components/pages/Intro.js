import bubble1 from '../../assets/images/bubble1.png';
import bubble2 from '../../assets/images/bubble2.png';
import holographic from '../../assets/images/holographic.png';

import '../../styles/components/intro.scss';
import Letters from '../Letters';

const Intro = () => {
  return (
    <div id="intro" style={{ backgroundImage: `url(${holographic})` }}>
      <div className="intro-wrapper">
        <div className="gradient-mask"></div>
        <div
          className="bubble1"
          style={{ backgroundImage: `url(${bubble1})` }}
        ></div>
        <div className="intro-content">
          <Letters />
          <p>
            We believe creativity works best when it moves. Not in straight
            lines, but through unexpected turns— shifting, evolving, expanding.
          </p>
          <h2>
            “What made the process so exciting was how it kept evolving -
            flowing through so many avenues of creativity, always feeling fresh
            and unexpected.”
          </h2>
          <p>
            We don’t just build. We explore. Every project is a chance to try
            something new, to ask better questions, and to make something that
            feels alive.
          </p>
          <div className="intro-image-wrapper">
            <p>
              Because every idea deserves the right format. Because not all
              solutions look the same. Because design should adapt to fit the
              moment—and the message. We think like artists, build like
              engineers, and approach every brand with curiosity and care.
              Whether you need sharp visuals, smart systems, or a little of
              both— we’re here to help you make it real.
            </p>
          </div>
        </div>

        <div
          className="bubble2"
          style={{ backgroundImage: `url(${bubble2})` }}
        ></div>
      </div>
    </div>
  );
};

export default Intro;
