import WorkImage from '../WorkImage';
import WorkHeading from '../WorkHeading';
import WorkMarquee from '../WorkMarquee';
import WorkText from '../WorkText';
import WorkCTA from '../WorkCTA';
import WorkX from '../WorkX';

import bgImg from '../../assets/images/bg.png';
import '../../styles/components/work.scss';

const Work = () => {
  return (
    <div
      id="work"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
      }}
    >
      <div className="work-wrapper">
        <WorkImage />
        <WorkHeading />
        <WorkMarquee />
        <WorkText />
        <WorkCTA />
        <WorkX />
        <div className="gradient-mask" />
        <div className="gradient-mask-bottom" />
      </div>
    </div>
  );
};

export default Work;
