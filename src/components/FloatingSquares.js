import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../styles/components/floatingSquares.scss';

const FloatingSquares = () => {
  const square3Ref = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      defaults: { ease: 'power1.inOut' },
    });

    tl.to(square3Ref.current, { y: 560, duration: 2 }) // down
      .to(square3Ref.current, { y: 560, duration: 0, delay: 0.5 }) // pause at bottom
      .to(square3Ref.current, { y: 0, duration: 2 }) // up
      .to(square3Ref.current, { y: 0, duration: 0, delay: 1 }); // pause at top
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
