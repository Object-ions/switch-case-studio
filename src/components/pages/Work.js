import WorkHeading from '../WorkHeading';
import WorkText from '../WorkText';
import WorkCTA from '../WorkCTA';

import '../../styles/components/work.scss';

const Work = () => {
  return (
    <div id="work" >
      <div className="work-wrapper">
        <WorkHeading />
        <WorkText />
        <WorkCTA />
        <div className="gradient-mask" />
        <div className="gradient-mask-bottom" />
      </div>
    </div>
  );
};

export default Work;
