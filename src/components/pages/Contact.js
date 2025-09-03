import React, { useRef } from 'react';
import AnimatedHeading from '../AnimatedHeading';
import Statue from '../Statue';
import ContactForm from '../ContactForm';
import FloatingSquares from '../FloatingSquares';
import '../../styles/components/contact.scss';


const Contact = () => {
  const formRef = useRef();

  return (
    <div id="contact">
      <Statue />
      <div className="contact-wrapper">
        <FloatingSquares />

        <div className="form">
          <AnimatedHeading />
          <p>Let's bring your vision to life</p>
          <a
            href="https://link.foreverbooked.com/widget/booking/ec8dal2CrxqAOd9QwKc2"
            className="highlight-block"
            target="_blank"
            rel="noreferrer"
          >
            Book a free 30 minute discovery call here
          </a>
          <p>Or use the form below.</p>
          <ContactForm formRef={formRef} />
        </div>
      </div>
    </div>
  );
};

export default Contact;
