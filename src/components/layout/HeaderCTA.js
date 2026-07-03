import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import BookCallCta from "../ui/BookCallCta";

// Label + URL live in src/data/cta.js via <BookCallCta>. (The old markup
// also carried a stray invalid `as="a"` attribute — dropped in the refactor.)
const HeaderCTA = () => {
  return (
    <BookCallCta className="headingCTA">
      {" "}
      <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: "12px" }} />
    </BookCallCta>
  );
};

export default HeaderCTA;
