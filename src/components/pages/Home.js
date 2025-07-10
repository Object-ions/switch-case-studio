import WelcomeTyped from '../WelcomeTyped';
import Arrow from '../Arrow';
import '../../styles/components/home.scss';

const Home = () => {
  return (
    <div id="home">
      <div className="hero">
        <div className="hero-heading">
          <h1>We</h1>
          <WelcomeTyped />
          <h1>Digital</h1>
          <h1>Experiences</h1>
        </div>

        <div className="hero-intro">
          <p>
            Switch Case Studio is a creative development and marketing studio
            that helps businesses stand out—and scale up—online.
          </p>
        </div>

        <div className="pillars-row">
          <div className="design-forward-container">
            <div className="design-forward-title">DESIGN_FORWARD</div>
            <div className="design-forward-text">
              Every pixel placed with purpose. Every interaction crafted with
              intention.
            </div>
          </div>

          <div className="development-driven-container">
            <div className="development-driven-title">DEVELOPMENT_DRIVEN</div>
            <div className="development-driven-text">
              Clean code. Fast performance. Scalable solutions.
            </div>
          </div>
        </div>

        <div className="discovery-call-wrapper">
          <a href="/Contact" className="discovery-call-button">
            BOOK DISCOVERY CALL
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>
        <Arrow />
      </div>
    </div>
  );
};

export default Home;
