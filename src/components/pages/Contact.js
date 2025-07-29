import React, { useRef } from 'react';

import FloatingSquares from '../FloatingSquares';
import CircleLogo from '../CircleLogo';
import AnimatedHeading from '../AnimatedHeading';
import Statue from '../Statue';

import '../../styles/components/contact.scss';
import ContactForm from '../ContactForm';

const Contact = () => {
  const formRef = useRef();

  return (
    <div id="contact">
      <Statue />
      <div className="contact-wrapper">
        <FloatingSquares />
        <CircleLogo />

        <div className="form">
          <AnimatedHeading />
          <p>Book a free 30 minute discovery call here</p>
          <p>Or use the form below and let's bring your vision to life.</p>
          <ContactForm formRef={formRef} />
        </div>
      </div>
    </div>
  );
};

export default Contact;
