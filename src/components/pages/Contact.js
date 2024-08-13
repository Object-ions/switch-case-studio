import Triangles from '../Triangles';
import '../../styles/components/contact.scss';

const Contact = () => {
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
      <form>
        <div className="form-group">
          <label htmlFor="firstName">
            Name <span>(required)</span>
          </label>
          <div className="name-fields">
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="First Name"
              required
            />
            <input
              type="text"
              id="lastName"
              name="lastName"
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
