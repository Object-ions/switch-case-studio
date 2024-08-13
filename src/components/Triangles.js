import React, { useState, useEffect } from 'react';
import '../styles/components/triangles.scss';

const Triangles = () => {
  const [step, setStep] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prevStep) => (prevStep === 3 ? 1 : prevStep + 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animation-container">
      <div className={`shape step-${step}`} />
    </div>
  );
};

export default Triangles;
