import '../styles/components/scrollingText.scss';
import scrollImage from '../assets/gifs/scroll-text.gif';

const ScrollingText = () => {
  return (
    <div
      className="scrolling-container"
      style={{
        backgroundImage: `url(${scrollImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
      }}
    ></div>
  );
};

export default ScrollingText;
