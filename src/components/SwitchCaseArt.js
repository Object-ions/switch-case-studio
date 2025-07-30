import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/components/switchCaseArt.scss';

import layer1 from '../assets/images/layer1.png';
import up from '../assets/images/up.png';
import image from '../assets/images/image.png';
import x from '../assets/images/x.png';
import right from '../assets/images/right.png';
import left from '../assets/images/left.png';
import starb from '../assets/images/starb.png';
import startt from '../assets/images/startt.png';

gsap.registerPlugin(ScrollTrigger);

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
    // Set each element's final position immediately
    Object.entries(elementOffsets).forEach(([key, { x, y }]) => {
      gsap.set(`#${key}`, { x, y });
    });

    // Animate when user scrolls to the container
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        once: true,
      },
      defaults: { ease: 'power4.out' },
    });

    Object.keys(elementOffsets).forEach((key, i) => {
      timeline.fromTo(
        `#${key}`,
        {
          opacity: 0,
          scale: 1.2,
          y: elementOffsets[key].y - 30,
          filter: 'blur(10px)',
        },
        {
          opacity: 1,
          scale: 1,
          y: elementOffsets[key].y,
          filter: 'blur(0px)',
          duration: 1.2,
          delay: i * 0.15,
        },
        0
      );
    });
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
