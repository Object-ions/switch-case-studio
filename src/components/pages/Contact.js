import React, { useRef } from 'react';
import emailjs from 'emailjs-com';

import FloatingSquares from '../FloatingSquares';
import CircleLogo from '../CircleLogo';
import AnimatedHeading from '../AnimatedHeading';
import Statue from '../Statue';

import '../../styles/components/contact.scss';

const {
  REACT_APP_EMAILJS_SERVICE_ID,
  REACT_APP_EMAILJS_TEMPLATE_ID,
  REACT_APP_EMAILJS_USER_ID,
} = process.env;

const sendEmail = (e, formRef) => {
  e.preventDefault();

  emailjs
    .sendForm(
      REACT_APP_EMAILJS_SERVICE_ID,
      REACT_APP_EMAILJS_TEMPLATE_ID,
      formRef.current,
      REACT_APP_EMAILJS_USER_ID
    )
    .then(
      (result) => {
        console.log(result.text);
        alert('Message sent successfully!');
      },
      (error) => {
        console.log(error.text);
        alert('Failed to send message, please try again.');
      }
    );

  e.target.reset();
};

const ContactForm = ({ formRef }) => {
  const fields = [
    {
      label: 'Name',
      required: true,
      name: 'name',
      children: (
        <div className="name-fields">
          <input
            type="text"
            id="first_name"
            name="first_name"
            placeholder="First Name"
            required
          />
          <input
            type="text"
            id="last_name"
            name="last_name"
            placeholder="Last Name"
            required
          />
        </div>
      ),
    },
    {
      label: 'Email',
      required: true,
      name: 'email',
      children: (
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          required
        />
      ),
    },
    {
      label: 'Message',
      required: true,
      name: 'message',
      children: (
        <textarea id="message" name="message" placeholder="Message" required />
      ),
    },
  ];

  return (
    <form onSubmit={(e) => sendEmail(e, formRef)} ref={formRef}>
      {fields.map(({ label, required, name, children }) => (
        <div className="form-group" key={name}>
          <label htmlFor={name}>
            {label} {required && <span>(required)</span>}
          </label>
          {children}
        </div>
      ))}

      <button type="submit">Send</button>
    </form>
  );
};

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
