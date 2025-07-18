import { useRef } from 'react';
import useFloatingScroll from '../hooks/useFloatingScroll';

import w from '../assets/images/letters/w.png';
import h from '../assets/images/letters/h.png';
import y from '../assets/images/letters/y.png';
import u from '../assets/images/letters/u.png';
import s from '../assets/images/letters/s.png';
import question from '../assets/images/letters/question.png';

import '../styles/components/letters.scss';

const FloatingImage = ({ src, alt }) => {
  const ref = useRef(null);
  useFloatingScroll(ref);

  return <img ref={ref} src={src} alt={alt} />;
};

const Letters = () => {
  return (
    <div id="letters">
      <div>
        <FloatingImage src={w} alt="w" />
        <FloatingImage src={h} alt="h" />
        <FloatingImage src={y} alt="y" />
      </div>
      <div>
        <FloatingImage src={u} alt="u" />
        <FloatingImage src={s} alt="s" />
        <FloatingImage src={question} alt="?" />
      </div>
    </div>
  );
};

export default Letters;
