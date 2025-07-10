import { useEffect, useRef, useState } from 'react';
import '../styles/components/arrow.scss';

const Arrow = () => {
  const [visible, setVisible] = useState(true);
  const arrowRef = useRef(null);

  useEffect(() => {
    let timeout;
    let interval;

    const startBlinkCycle = () => {
      if (!arrowRef.current) return;

      arrowRef.current.style.animation = 'blink 0.9s ease-in-out 0s 1 forwards';

      timeout = setTimeout(() => {
        if (arrowRef.current) {
          arrowRef.current.style.animation = 'none';
        }
      }, 900);

      interval = setInterval(() => {
        if (!arrowRef.current) return;

        arrowRef.current.style.animation =
          'blink 0.9s ease-in-out 0s 1 forwards';

        setTimeout(() => {
          if (arrowRef.current) {
            arrowRef.current.style.animation = 'none';
          }
        }, 900);
      }, 60000);
    };

    const handleScroll = () => {
      setVisible(false);
      clearTimeout(timeout);
      clearInterval(interval);
    };

    if (visible) {
      startBlinkCycle();
      window.addEventListener('scroll', handleScroll, { once: true });
    }

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [visible]);
  return visible ? (
    <div className="scroll-hint" ref={arrowRef}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 5v14" />
        <path d="m19 12-7 7-7-7" />
      </svg>
    </div>
  ) : null;
};

export default Arrow;
