import WorkHeading from '../WorkHeading';
import WorkText from '../WorkText';
import WorkCTA from '../WorkCTA';
import WorkMarquee from '../WorkMarquee';

import BlacGrid from '../../assets/images/black_grid.avif';
import '../../styles/components/work.scss';

const Work = () => {
  return (
    <div id="work" style={{backgroundImage: `url(${BlacGrid})`}}>
      <div className="work-wrapper">
        <WorkHeading />
        <WorkMarquee />
        <WorkText />
        <WorkCTA />
      </div>
    </div>
  );
};

export default Work;
