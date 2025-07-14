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
          <span className="logo-piece">W</span>
          <span className="logo-piece">I</span>
          <span className="logo-piece">T</span>
          <span className="logo-piece">C</span>
          <span className="logo-piece">H</span>
          <span className="logo-piece spacer"></span>
          <span className="logo-piece">C</span>
          <span className="logo-piece">A</span>
          <span className="logo-piece">S</span>
          <span className="logo-piece">E</span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
