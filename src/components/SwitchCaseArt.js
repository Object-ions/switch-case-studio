import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../styles/components/switchCaseArt.scss';

import layer1 from '../assets/images/layer1.png';
import up from '../assets/images/up.png';
import image from '../assets/images/image.png';
import x from '../assets/images/x.png';
import right from '../assets/images/right.png';
import left from '../assets/images/left.png';
import starb from '../assets/images/starb.png';
import startt from '../assets/images/startt.png';

const elementOffsets = {
  up: { x: 0.497, y: -370.4611 },
  image: { x: 0.9281, y: -24.4731 },
  x: { x: 0.497, y: 333.8024 },
  right: { x: 206.5808, y: 9.3713 },
  left: { x: -195.2395, y: -2.7006 },
  starb: { x: -206.4491, y: 234.6407 },
  startt: { x: -206.6647, y: -242.4132 },
};

const SwitchCaseArt = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    Object.entries(elementOffsets).forEach(([key, { x, y }]) => {
      gsap.set(`#${key}`, { x, y });
    });
  }, []);

  return (
    <div className="switch-case-art">
      <div className="image-container" ref={containerRef}>
        <img id="layer1" src={layer1} className="base" alt="background base" />
        <img id="image" src={image} className="layer" alt="image1" />
        <img id="up" src={up} className="layer" alt="image2" />
        <img id="x" src={x} className="layer" alt="image3" />
        <img id="right" src={right} className="layer" alt="image4" />
        <img id="left" src={left} className="layer" alt="image5" />
        <img id="startt" src={startt} className="layer" alt="image6" />
        <img id="starb" src={starb} className="layer" alt="image7" />
      </div>
    </div>
  );
};

export default SwitchCaseArt;
