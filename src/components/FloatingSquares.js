import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../styles/components/floatingSquares.scss';

const FloatingSquares = () => {
  const square3Ref = useRef(null);

  useEffect(() => {
    gsap.from(square3Ref.current.parentNode, {
      opacity: 0,
      y: 60,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: square3Ref.current.parentNode,
        start: 'top 90%',
      },
    });
  }, []);

  return (
    <div className="floating-container">
      <div className="stack-top">
        <div className="square"></div>
        <div className="square"></div>
      </div>

      <div className="square floating" ref={square3Ref}></div>

      <div className="square bottom"></div>
    </div>
  );
};

export default FloatingSquares;
