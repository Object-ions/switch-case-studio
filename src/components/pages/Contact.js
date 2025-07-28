import React, { useRef } from 'react';
import emailjs from 'emailjs-com';
import FloatingSquares from '../FloatingSquares';
import CircleLogo from '../CircleLogo';
import '../../styles/components/contact.scss';
import AnimatedHeading from '../AnimatedHeading';
import Statue from '../Statue';

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        form.current,
        process.env.REACT_APP_EMAILJS_USER_ID
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

          <form ref={form} onSubmit={sendEmail}>
            <div className="form-group">
              <label htmlFor="first_name">
                Name <span>(required)</span>
              </label>
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
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email <span>(required)</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">
                Message <span>(required)</span>
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Message"
                required
              ></textarea>
            </div>

            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
