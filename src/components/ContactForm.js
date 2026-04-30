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
    const ctx = gsap.context(() => {
      const validFields = fieldRefs.current.filter((el) => el !== null);

      validFields.forEach((el, i) => {
        gsap.fromTo(
          el,
          {
            opacity: 0,
            y: 24,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: formRef.current,
              start: 'top 85%',
            },
            delay: i * 0.08,
          }
        );
      });

      gsap.fromTo(
        buttonRef.current,
        {
          scale: 0.95,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 85%',
          },
        }
      );
    }, formRef);

    return () => ctx.revert();
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
        <textarea id="message" name="message" placeholder="Tell us about your project" required />
      ),
    },
  ];

  return (
    <form onSubmit={(e) => sendEmail(e, formRef)} ref={formRef}>
      <div className="form-intro">
        <h3>Project inquiry</h3>
        <p>Share a few details and we&apos;ll get back to you shortly.</p>
      </div>

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
        Send message
      </button>
    </form>
  );
};

export default ContactForm;
