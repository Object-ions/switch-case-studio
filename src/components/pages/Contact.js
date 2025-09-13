import React, { useRef } from "react";
import AnimatedHeading from "../AnimatedHeading";
import Statue from "../Statue";
import ContactForm from "../ContactForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import "../../styles/components/contact.scss";

const Contact = () => {
  const formRef = useRef();

  return (
    <div id="contact">
      <Statue />
      <div className="contact-wrapper">
        <div className="form">
          <AnimatedHeading />
          <p>Let's bring your vision to life</p>

          <a
            href="https://link.foreverbooked.com/widget/booking/ec8dal2CrxqAOd9QwKc2"
            target="_blank"
            rel="noreferrer"
          >
            - Book a{" "}
            <span className="highlight-block">
              Free Call{" "}
              <FontAwesomeIcon
                icon={faArrowUpRightFromSquare}
                style={{ fontSize: "10px" }}
              />
            </span>
          </a>

          <br />

          <a href="mailto:hello@switchcasestudio.com">
            - Contact us at{" "}
            <span className="highlight-block">
              {" "}
              hello@switchcasestudio.com{" "}
              <FontAwesomeIcon
                icon={faArrowUpRightFromSquare}
                style={{ fontSize: "10px" }}
              />
            </span>
          </a>

          <p>- Or send us a message through the form</p>
          <ContactForm formRef={formRef} />
        </div>
      </div>
    </div>
  );
};

export default Contact;
