import React, { useRef } from 'react';
import emailjs from 'emailjs-com';
import Triangles from '../Triangles';

import '../../styles/components/contact.scss';

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
      <Triangles />
      <h1>
        Interested in working together? Use the form below and get in touch!
      </h1>
      <p>
        I invite you to a free meeting where we will analyze what suits your
        business and your needs, and what can be done to achieve growth for your
        business.
      </p>
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
  );
};

export default Contact;
