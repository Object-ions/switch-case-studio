import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const HeaderCTA = () => {
  return (
    <a
      href="https://link.foreverbooked.com/widget/booking/ec8dal2CrxqAOd9QwKc2"
      target="_blank"
      rel="noreferrer"
      className="headingCTA"
    >
      Book a Free Call{' '}
      <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '12px' }} />
    </a>
  );
};

export default HeaderCTA;
