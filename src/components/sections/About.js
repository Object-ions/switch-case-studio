import { lazy, Suspense } from 'react';
import AboutHeading from './AboutHeading';
import AboutText from './AboutText';
import AboutCTA from './AboutCTA';
import AboutMarquee from './AboutMarquee';

import Squares from '../ui/Squares';
// Lazy-loaded: pulls in the entire Three.js stack (~490 KB gzip). The moon is
// decorative and below the fold, so deferring its code keeps it off the
// critical path for every route without changing how it renders.
const Moon = lazy(() => import('../ui/Moon'));
import '../../styles/components/work.scss';

const About = () => {
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
        <AboutHeading />
        <AboutMarquee />

        <div className="work-content">
          <AboutText />
          <div className="work-moon">
            <Suspense fallback={null}>
              <Moon />
            </Suspense>
          </div>
        </div>

        <AboutCTA />
      </div>
    </div>
  );
};

export default About;
