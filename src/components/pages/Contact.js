import React, { useRef } from "react";
import AnimatedHeading from "../AnimatedHeading";
import ContactForm from "../ContactForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import "../../styles/components/contact.scss";

const Contact = () => {
  const formRef = useRef();

  return (
    <div id="contact">
      <div className="contact-wrapper">
        {/* Left */}
        <div className="contact-left">
          <AnimatedHeading />
          <div className="contact-text">
            <a
              href="https://link.foreverbooked.com/widget/booking/ec8dal2CrxqAOd9QwKc2"
              target="_blank"
              rel="noreferrer"
            >
              Book Your Free Strategy Session Now{" "}
              <FontAwesomeIcon
                icon={faArrowUpRightFromSquare}
                style={{ fontSize: "10px" }}
              />
            </a>
          </div>
          <div className="contact-details">
            <div>
              <p>601 N 3rd AVE, Phoenix, AZ 83005</p>
            </div>
            <div>
              <a href="mailto:hello@switchcasestudio.com">
                hello@switchcasestudio.com{" "}
                <FontAwesomeIcon
                  icon={faArrowUpRightFromSquare}
                  style={{ fontSize: "10px" }}
                />
              </a>
              <p>925-323-1356</p>
            </div>
          </div>
        </div>
        {/* Right */}
        <ContactForm formRef={formRef} />
      </div>
    </div>
  );
};

export default Contact;
