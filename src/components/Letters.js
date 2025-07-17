import w from '../assets/images/letters/w.png';
import h from '../assets/images/letters/h.png';
import y from '../assets/images/letters/y.png';
import u from '../assets/images/letters/u.png';
import s from '../assets/images/letters/s.png';
import question from '../assets/images/letters/question.png';

import '../styles/components/letters.scss';

const Letters = () => {
  return (
    <div id="letters">
      <div className="">
        <img src={w} alt="w" />
        <img src={h} alt="h" />
        <img src={y} alt="y" />
      </div>
      <div className="">
        <img src={u} alt="u" />
        <img src={s} alt="s" />
        <img src={question} alt="?" />
      </div>
    </div>
  );
};

export default Letters;
