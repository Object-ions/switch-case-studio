import '../styles/components/scrollingText.scss';

const ScrollingText = () => {
  const text = 'Unlock Your Digital Potential. ';
  const repeatTimes = 110;

  return (
    <div className="scrolling-container">
      <div className="scrolling-text">
        <p>
          {Array(repeatTimes)
            .fill(text)
            .map((item, index) => (
              <span key={index}>{item}</span>
            ))}
        </p>
      </div>
    </div>
  );
};

export default ScrollingText;
