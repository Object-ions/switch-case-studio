// src/components/WorkMarquee.js
import '../styles/components/marquee.scss';

const WorkMarquee = () => {
  const words = [
    'Unleash',
    'Your',
    'Digital',
    'Potential',
    'with',
    '< Switch Case Studio />',
  ];

  const renderContent = () => (
    <>
      {words.map((word, i) => (
        <span key={i} className="work-marquee__word">
          {word}
          {/* Add a non-breaking space after each word */}
          &nbsp;
        </span>
      ))}
    </>
  );

  return (
    <div className="work-marquee">
      <div className="work-marquee__track">
        {/* Copy 1 */}
        <span className="work-marquee__item">{renderContent()}</span>

        <span className="work-marquee__item" aria-hidden="true">
          {renderContent()}
        </span>
      </div>
    </div>
  );
};

export default WorkMarquee;
