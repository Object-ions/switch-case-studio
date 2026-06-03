import { Helmet } from 'react-helmet-async';
import Contact from './Contact';
import '../../styles/components/contactPage.scss';

const ContactPage = () => (
  <>
    <Helmet>
      <title>Contact — Switch Case Studio</title>
      <meta
        name="description"
        content="Get in touch with Switch Case Studio. Book a free strategy call or send us a message about your project."
      />
      <link rel="canonical" href="https://switchcasestudio.com/contact" />
      <meta property="og:title" content="Contact — Switch Case Studio" />
      <meta
        property="og:description"
        content="Ready to start? Book a free call or send us a message — we'll get back to you fast."
      />
    </Helmet>
    <div className="contact-page">
      <Contact />
    </div>
  </>
);

export default ContactPage;
