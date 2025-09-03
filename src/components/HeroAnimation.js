import { motion } from "framer-motion";
import "../styles/components/heroAnimation.scss";
import WelcomeTyped from "./WelcomeTyped";

const circleVariants = {
  hidden: { opacity: 0, x: 100, scale: 0.8 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      delay: i * 0.2,
      duration: 0.8,
      ease: "easeOut",
    },
  }),
};

const HeroAnimation = () => {
  const circles = [0, 1, 2, 3, 4, 5];

  return (
    <section className="hero-animation">
      <div className="background top-blue" />
      <motion.div className="gradient-block" initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 1 }} />

      <div className="circles">
        {circles.map((_, i) => (
          <motion.div
            className="circle"
            key={i}
            custom={i}
            variants={circleVariants}
            initial="hidden"
            animate="visible"
          />
        ))}
      </div>

      <motion.div
        className="text-overlay"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
      >
        <div className="left">
        We < br/>
        <WelcomeTyped/>
        Digital <br/>
        Experiences
        </div>
      </motion.div>

      <div className="countdown">
      <a href="#contact" className="cta-button">
            Ready To Turn The Switch?
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
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
    </section>
  );
};

export default HeroAnimation;
