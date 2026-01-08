import '../styles/components/legal.scss';

const Privacy = () => {
  return (
    <div className="legal-page">
      <h1>Privacy Policy</h1>
      <span className="last-updated">Last Updated: January 8, 2026</span>

      <p>
        Switch Case LLC, doing business as <strong>Switch Case Studio</strong>{' '}
        ("we," "our," or "us"), respects your privacy and is committed to
        protecting the personal information you share with us. This Privacy
        Policy explains how we collect, use, and safeguard your information when
        you visit our website.
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        We operate an informational portfolio website. We do not require you to
        create an account or log in. We only collect information that you
        voluntarily provide to us, such as:
      </p>
      <ul>
        <li>
          <strong>Contact Information:</strong> Name, email address, and phone
          number when you fill out our contact form.
        </li>
        <li>
          <strong>Project Details:</strong> Information regarding your business
          needs provided during inquiries.
        </li>
      </ul>
      <p>
        We do not use tracking cookies, analytics pixels (like Google Analytics
        or Facebook Pixel), or third-party advertising trackers on this website.
      </p>

      <h2>2. How We Use Your Information</h2>
      <p>We use the information you provide solely to:</p>
      <ul>
        <li>Respond to your inquiries and consultation requests.</li>
        <li>Schedule meetings via our booking integrations.</li>
        <li>Provide services as agreed upon in separate client contracts.</li>
      </ul>

      <h2>3. Third-Party Links & Tools</h2>
      <p>
        Our website may contain links to third-party websites (e.g., Google
        Calendar for bookings, social media profiles). If you click on a
        third-party link, you will be directed to that site. Note that these
        external sites may collect their own data and use cookies. We strongly
        advise you to review the Privacy Policy of every site you visit. We have
        no control over and assume no responsibility for the content, privacy
        policies, or practices of any third-party sites or services.
      </p>

      <h2>4. Data Security</h2>
      <p>
        We implement reasonable security measures to maintain the safety of your
        personal information. However, please be aware that no method of
        transmission over the Internet or method of electronic storage is 100%
        secure.
      </p>

      <h2>5. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us
        at:
        <br />
        <strong>Email:</strong>{' '}
        <a href="mailto:hello@switchcasestudio.com">
          hello@switchcasestudio.com
        </a>
      </p>
    </div>
  );
};

export default Privacy;
