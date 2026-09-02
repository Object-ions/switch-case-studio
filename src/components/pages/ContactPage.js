import Seo from '../util/Seo';
import Contact from '../sections/Contact';
import '../../styles/components/contactPage.scss';

const ContactPage = () => (
  <>
    <Seo
      title="Contact | Switch Case Studio"
      description="Get in touch with Switch Case Studio. Book a free strategy call or send us a message about your project."
      path="/contact"
    />
    <div className="contact-page">
      <Contact headingTag="h1" />
    </div>
  </>
);

export default ContactPage;
