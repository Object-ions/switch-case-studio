import { useRef, useEffect } from 'react';
import emailjs from 'emailjs-com';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
  const fieldRefs = useRef([]);
  const buttonRef = useRef(null);

  useEffect(() => {
    fieldRefs.current.forEach((el, i) => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          x: i % 2 === 0 ? -80 : 80,
          rotate: i % 2 === 0 ? -5 : 5,
          skewX: i % 2 === 0 ? 5 : -5,
        },
        {
          opacity: 1,
          x: 0,
          rotate: 0,
          skewX: 0,
          duration: 1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: () => formRef.current,
            start: 'top 85%',
          },
          delay: i * 0.1,
        }
      );
    });

    gsap.fromTo(
      buttonRef.current,
      {
        scale: 0.8,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.7,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: () => formRef.current,
          start: 'top 85%',
        },
      }
    );
  }, [formRef]);

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
      {fields.map(({ label, required, name, children }, index) => (
        <div
          className="form-group"
          key={name}
          ref={(el) => (fieldRefs.current[index] = el)}
        >
          <label htmlFor={name}>
            {label} {required && <span>(required)</span>}
          </label>
          {children}
        </div>
      ))}

      <button type="submit" ref={buttonRef}>
        Send
      </button>
    </form>
  );
};

export default ContactForm;
