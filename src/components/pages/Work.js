import WorkHeading from '../WorkHeading';
import WorkText from '../WorkText';
import WorkCTA from '../WorkCTA';
import WorkMarquee from '../WorkMarquee';

import Squares from '../Squares';
import Moon from '../Moon';
import '../../styles/components/work.scss';

const Work = () => {
  return (
    <div id="about">
      {/* Animated grid background */}
      <div className="squares-bg">
        <Squares
          speed={0.1}
          squareSize={50}
          direction="down"
          borderColor="#7f7f7f"
          hoverFillColor="#dab8ff"
        />
      </div>

      <div className="work-wrapper">
        <WorkHeading />
        <WorkMarquee />

        <div className="work-content">
          <div className="work-text">
            <WorkText />
          </div>
          <div className="work-moon">
            <Moon />
          </div>
        </div>

        <WorkCTA />
      </div>
    </div>
  );
};

export default Work;
