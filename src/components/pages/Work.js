import WorkHeading from "../WorkHeading";
import WorkText from "../WorkText";
import WorkCTA from "../WorkCTA";
import WorkMarquee from "../WorkMarquee";

import BlacGrid from "../../assets/images/black_grid.avif";
import Moon from "../Moon";
import "../../styles/components/work.scss";

const Work = () => {
  return (
    <div id="work" style={{ backgroundImage: `url(${BlacGrid})` }}>
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
