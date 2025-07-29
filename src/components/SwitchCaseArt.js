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
    // Position elements
    Object.entries(elementOffsets).forEach(([key, { x, y }]) => {
      gsap.set(`#${key}`, { x, y });
    });

    // Animate elements
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    tl.from('#layer1', { opacity: 0, scale: 1.05, duration: 1.2 })
      .from('#image', { opacity: 0, y: 30, duration: 1 }, '-=0.6')
      .from('#up', { opacity: 0, y: -100, skewY: 8, duration: 1 }, '-=0.5')
      .to('#up', { skewY: 0, duration: 0.6 }, '<')
      .from(
        '#x',
        { opacity: 0, scale: 0.5, duration: 1, ease: 'elastic.out(1, 0.5)' },
        '-=0.6'
      )
      .from('#left', { opacity: 0, x: -100, rotation: 5, duration: 1 }, '-=0.8')
      .from('#right', { opacity: 0, x: 100, rotation: -5, duration: 1 }, '-=1')
      .from('#startt', { opacity: 0, scale: 0.5, duration: 0.6 }, '-=0.8')
      .from('#starb', { opacity: 0, scale: 0.5, duration: 0.6 }, '-=0.5');
  }, []);

  return (
    <div className="switch-case-art">
      <div className="image-container" ref={containerRef}>
        <img id="layer1" src={layer1} className="base" alt="background base" />
        <img id="up" src={up} className="layer" alt="up text" />
        <img id="image" src={image} className="layer" alt="main figure" />
        <img id="x" src={x} className="layer" alt="xxx" />
        <img id="right" src={right} className="layer" alt="right text" />
        <img id="left" src={left} className="layer" alt="left text" />
        <img id="starb" src={starb} className="layer" alt="bottom star" />
        <img id="startt" src={startt} className="layer" alt="top star" />
      </div>
    </div>
  );
};

export default SwitchCaseArt;
