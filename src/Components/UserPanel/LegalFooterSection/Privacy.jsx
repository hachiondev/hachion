import React, { useEffect } from 'react';
import '../Blogs.css';
import { MdKeyboardArrowRight } from 'react-icons/md';

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className='privacy-container'>
        {/* Breadcrumb */}
        <div className='privacy-header'>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">Home</a> <MdKeyboardArrowRight className='breadcrumb-icon'/>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Privacy Policy
              </li>
            </ol>
          </nav>
        </div>

        {/* Main Content */}
        <div className='privacy-content container'>
          <header className='privacy-title-section'>
            <h1 className='privacy-main-title'>Legal and Privacy Policy</h1>
          </header>

          {/* Introduction */}
          <section className='privacy-section'>
            <h2 className='section-title'>1. Introduction</h2>
            <p className='section-content'>
              Welcome to Hachion! At Hachion, we respect your trust and are dedicated to being transparent about how we work and what we do with your information. This Legal and Privacy Policy details the terms under which you may use our services and what we do with your data. Accessing or otherwise using our website, applications, or other online features of any of our services means that you agree to this policy.
            </p>
          </section>

          {/* Legal Terms */}
          <section className='privacy-section'>
            <h2 className='section-title'>2. Legal Terms</h2>
            
            <div className='policy-point'>
              <h3 className='point-title'>a. Service Agreement</h3>
              <p className='point-content'>
                Hachion offers online certification courses for students, providing an easier, flexible, and convenient learning experience. When enrolling for courses, you agree to provide accurate and truthful information. All courses and materials are intended for personal, non-commercial use only.
              </p>
            </div>

            <div className='policy-point'>
              <h3 className='point-title'>b. Intellectual Property</h3>
              <p className='point-content'>
                All videos, texts, quizzes, logos, trademarks, and other materials published under Hachion's courses are Hachion's exclusive intellectual properties. You may not use, copy, modify, distribute, or reproduce these materials without explicit permission from Hachion.
              </p>
            </div>

            <div className='policy-point'>
              <h3 className='point-title'>c. Limitation of Liability</h3>
              <p className='point-content'>
                While we strive to provide a seamless learning experience, we cannot be held responsible for technical difficulties beyond our control or for results obtained from course information. Hachion does not endorse or accept responsibility for third-party links accessed through our site.
              </p>
            </div>

            <div className='policy-point'>
              <h3 className='point-title'>d. Termination of Service</h3>
              <p className='point-content'>
                Hachion reserves the right to withdraw access to the site for violations of this policy or misuse of our services. Upon termination, you will lose access to courses and content without refund.
              </p>
            </div>
          </section>

          {/* Privacy Policy */}
          <section className='privacy-section'>
            <h2 className='section-title'>3. Privacy Policy</h2>
            
            <div className='policy-point'>
              <h3 className='point-title'>a. Data We Collect</h3>
              <p className='point-content'>
                We collect personal information (name, email, contact details), account data (login credentials, progress), and payment information through trusted third-party gateways to provide and improve your learning experience.
              </p>
            </div>

            <div className='policy-point'>
              <h3 className='point-title'>b. How We Use Your Data</h3>
              <p className='point-content'>
                Your data is used to grant course access, track progress, inform you about new courses and updates, and provide support. We ensure timely assistance for course content, technical issues, and general queries.
              </p>
            </div>

            <div className='policy-point'>
              <h3 className='point-title'>c. Data Sharing</h3>
              <p className='point-content'>
                Hachion does not sell your data. We only share information with trusted partners for payment processing, service improvement, or when required by law. All partners adhere to strict confidentiality agreements.
              </p>
            </div>

            <div className='policy-point'>
              <h3 className='point-title'>d. Data Security</h3>
              <p className='point-content'>
                We employ industry-standard security practices including encryption and secure servers. While we take extensive measures, we recommend using strong, unique passwords and keeping your login credentials private.
              </p>
            </div>

            <div className='policy-point'>
              <h3 className='point-title'>e. Cookies and Tracking</h3>
              <p className='point-content'>
                We use cookies to enhance your browsing experience, track traffic, remember preferences, and personalize content. You can manage cookies through your browser settings while still enjoying our services.
              </p>
            </div>

            <div className='policy-point'>
              <h3 className='point-title'>f. Your Rights</h3>
              <ul className='rights-list'>
                <li><strong>Access:</strong> View and update your personal information at any time</li>
                <li><strong>Deletion:</strong> Request data deletion, subject to legal restrictions</li>
                <li><strong>Marketing:</strong> Opt-out of direct marketing communications anytime</li>
              </ul>
            </div>
          </section>

          {/* User Obligations */}
          <section className='privacy-section'>
            <h2 className='section-title'>4. User Obligations</h2>
            <ul className='obligations-list'>
              <li><strong>Protect Credentials:</strong> Never share login details with others</li>
              <li><strong>Responsible Use:</strong> Use courses only for personal learning and growth</li>
              <li><strong>Respect:</strong> Treat all users and instructors with respect</li>
            </ul>
          </section>

          {/* Policy Updates */}
          <section className='privacy-section'>
            <h2 className='section-title'>5. Updates to the Policy</h2>
            <p className='section-content'>
              Hachion may update this policy periodically. Updates will be communicated via our website or email. Continued use of our services constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact Information */}
          <section className='privacy-section'>
            <h2 className='section-title'>6. Contact Us</h2>
            <p className='section-content'>
              For questions or concerns about this policy:
            </p>
            <div className='contact-info'>
              <a href="mailto:trainings@hachion.co" className='contact-email'>
                trainings@hachion.co
              </a>
            </div>
          </section>

          {/* Disclaimer */}
          <section className='privacy-section disclaimer-section'>
            <h2 className='section-title'>Disclaimer</h2>
            <p className='disclaimer-content'>
              Mobile information will not be shared with third parties for marketing or promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties.
            </p>
            <p className='disclaimer-content'>
              To unsubscribe from communications, please contact us at the email above.
            </p>
          </section>

          {/* Closing Message */}
          <div className='closing-message'>
            <p>Thanks for choosing Hachion as your learning partner. We're here to empower your educational journey!</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Privacy;