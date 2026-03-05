import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import StarBorder from '../ui/StarBorder';

const HeaderCTA = () => {
  return (
    <StarBorder
      as="a"
      href="https://calendar.app.google/83UCJjis2FHUrr1s6"
      target="_blank"
      rel="noreferrer"
      className="headingCTA"
      innerClassName="headingCTA__inner"
      color="#d99cff"
      speed="3s"
      thickness={4}
    >
      Book a Free Call{' '}
      <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '12px' }} />
    </StarBorder>
  );
};

export default HeaderCTA;
