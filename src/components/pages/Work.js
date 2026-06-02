import { lazy, Suspense } from 'react';
import WorkHeading from '../WorkHeading';
import WorkText from '../WorkText';
import WorkCTA from '../WorkCTA';
import WorkMarquee from '../WorkMarquee';

import Squares from '../Squares';
// Lazy-loaded: pulls in the entire Three.js stack (~490 KB gzip). The moon is
// decorative and below the fold, so deferring its code keeps it off the
// critical path for every route without changing how it renders.
const Moon = lazy(() => import('../Moon'));
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
          <WorkText />
          <div className="work-moon">
            <Suspense fallback={null}>
              <Moon />
            </Suspense>
          </div>
        </div>

        <WorkCTA />
      </div>
    </div>
  );
};

export default Work;
