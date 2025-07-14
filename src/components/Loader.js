import React, { useEffect, useState } from 'react';
import '../styles/components/loader.scss';

const Loader = () => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timeouts = [
      setTimeout(() => setStage(1), 2000), // Split squares
      setTimeout(() => setStage(2), 2500), // Reveal logo
      setTimeout(() => setStage(3), 3600), // Hold logo visible
      setTimeout(() => setStage(4), 4600), // Slide screen up
    ];

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div
      className={`loader-container stage-${stage} ${
        stage >= 2 ? 'animate-logo' : ''
      }`}
    >
      <div className="loader-inner">
        <div className="center-group">
          <div className="square left-square"></div>
          <div className="line-fill"></div>
          <div className="square right-square"></div>
        </div>

        <div className="logo-mask">
          <span className="logo-piece">S</span>
          <span className="logo-piece">w</span>
          <span className="logo-piece">i</span>
          <span className="logo-piece">t</span>
          <span className="logo-piece">c</span>
          <span className="logo-piece">h</span>
          <span className="logo-piece spacer"></span>
          <span className="logo-piece">C</span>
          <span className="logo-piece">a</span>
          <span className="logo-piece">s</span>
          <span className="logo-piece">e</span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
