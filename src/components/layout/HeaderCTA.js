import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const HeaderCTA = () => {
  return (
    <a
      as="a"
      href="https://calendar.app.google/83UCJjis2FHUrr1s6"
      target="_blank"
      rel="noreferrer"
      className="headingCTA"
    >
      Book a Free Call{" "}
      <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: "12px" }} />
    </a>
  );
};

export default HeaderCTA;
