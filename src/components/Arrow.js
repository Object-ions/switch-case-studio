import "../styles/components/arrow.scss";

const Arrow = ({ side = "right", hidden = false, label = "More" }) => (
  <div
    className={`scroll-hint ${side} ${hidden ? "is-hidden" : ""}`}
    aria-hidden="true"
  >
    <h5>{label}</h5>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  </div>
);

export default Arrow;
