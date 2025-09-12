import { useEffect, useRef, useState } from 'react';
import '../styles/components/arrow.scss';

const Arrow = ({ targetRef }) => {
  const [visible, setVisible] = useState(true);
  const arrowRef = useRef(null);

  useEffect(() => {
    let hideOnScroll, blinkTimeout, blinkInterval;
    const el = targetRef?.current || window; 

    const startBlink = () => {
      if (!arrowRef.current) return;
      const run = () => {
        arrowRef.current.style.animation = 'blink 0.9s ease-in-out 0s 1 forwards';
        blinkTimeout = setTimeout(() => {
          if (arrowRef.current) arrowRef.current.style.animation = 'none';
        }, 900);
      };
      run();
      blinkInterval = setInterval(run, 60000);
    };

    hideOnScroll = () => {
      setVisible(false);
      clearTimeout(blinkTimeout);
      clearInterval(blinkInterval);
    };

    startBlink();
    el.addEventListener('scroll', hideOnScroll, { once: true });

    return () => {
      clearTimeout(blinkTimeout);
      clearInterval(blinkInterval);
      el.removeEventListener('scroll', hideOnScroll);
    };
  }, [targetRef]);

  if (!visible) return null;

  return (
    <div className="scroll-hint" ref={arrowRef} aria-hidden="true">
      <h5>Scroll</h5>
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14" />
        <path d="m19 12-7 7-7-7" />
      </svg>
    </div>
  );
};

export default Arrow;
