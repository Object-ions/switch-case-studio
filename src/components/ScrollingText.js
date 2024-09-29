import '../styles/components/scrollingText.scss';
import scrollImage from '../assets/gifs/scroll-text.gif';

const ScrollingText = () => {
  return (
    <div className="scrolling-container">
      <img src={scrollImage} alt="Unlock your digital potential." />
    </div>
  );
};

export default ScrollingText;
