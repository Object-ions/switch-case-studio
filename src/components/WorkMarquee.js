// src/components/WorkMarquee.js
import '../styles/components/marquee.scss';

const WorkMarquee = () => {
  // The text you want to loop
  const content = 'Unleash Your Digital Potential with < Switch Case Studio />';

  return (
    <div className="work-marquee">
      <div className="work-marquee__track">
        {/* Copy 1 */}
        <span className="work-marquee__item">{content}</span>

        {/* Copy 2 (Exact duplicate for the loop) */}
        <span className="work-marquee__item" aria-hidden="true">
          {content}
        </span>
      </div>
    </div>
  );
};

export default WorkMarquee;
