import React, { useEffect } from 'react';
import '../Blogs.css';
import { MdKeyboardArrowRight } from 'react-icons/md';

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className='terms-container'>
        {/* Breadcrumb */}
        <div className='terms-header'>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">Home</a> <MdKeyboardArrowRight className='breadcrumb-icon'/>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Terms and Conditions
              </li>
            </ol>
          </nav>
        </div>

        {/* Main Content */}
        <div className='terms-content container'>
          <header className='terms-title-section'>
            <h1 className='terms-main-title'>Terms and Conditions</h1>
          </header>

          {/* Introduction */}
          <section className='terms-section'>
            <h2 className='section-title'>1. Introduction</h2>
            <p className='section-content'>
              Welcome to Hachion, your trusted online certification course provider for a wide range of subjects. We are committed to delivering high-quality educational content and a seamless learning experience to our users. By accessing and using our platform, you agree to adhere to these terms and conditions. These guidelines are designed to ensure a positive experience and appropriate use of our services.
            </p>
          </section>

          {/* Account Registration */}
          <section className='terms-section'>
            <h2 className='section-title'>2. Account Registration</h2>
            <p className='section-content'>
              During registration on Hachion, we require accurate and complete information to create your account. You are responsible for maintaining the confidentiality of your login credentials and all activities under your account. Hachion is not liable for any loss or damages arising from unauthorized access to your account.
            </p>
          </section>

          {/* Access to and Use of Courses */}
          <section className='terms-section'>
            <h2 className='section-title'>3. Access to and Use of Courses</h2>
            
            <div className='policy-point'>
              <h3 className='point-title'>Access</h3>
              <p className='point-content'>
                Upon registration, you gain access to enrolled courses. All courses are for personal, non-commercial use only. Sharing, reproducing, or distributing any course materials without explicit permission from Hachion is strictly prohibited.
              </p>
            </div>

            <div className='policy-point'>
              <h3 className='point-title'>Course Material</h3>
              <p className='point-content'>
                All course materials including videos, texts, quizzes, logos, and other content are the intellectual property of Hachion and are protected by copyright laws. Unauthorized use or reproduction is prohibited.
              </p>
            </div>

            <div className='policy-point'>
              <h3 className='point-title'>Course Progress</h3>
              <p className='point-content'>
                Hachion may monitor your course progress and usage to ensure compliance with these terms and to enhance your learning experience.
              </p>
            </div>
          </section>

          {/* Payment and Refunds */}
          <section className='terms-section'>
            <h2 className='section-title'>4. Payment and Refunds</h2>
            
            <div className='policy-point'>
              <h3 className='point-title'>Fees</h3>
              <p className='point-content'>
                Access to Hachion courses requires payment of applicable fees. All fees are clearly stated during the enrollment process and are subject to change with prior notice.
              </p>
            </div>

            <div className='policy-point'>
              <h3 className='point-title'>Refunds</h3>
              <p className='point-content'>
                Refund requests are considered on a case-by-case basis within a specified timeframe from enrollment. Please review our refund policy or contact support for specific refund terms.
              </p>
            </div>

            <div className='policy-point'>
              <h3 className='point-title'>Cancellation</h3>
              <p className='point-content'>
                You may cancel your enrollment according to our cancellation policy. Certain restrictions may apply based on the course type and progress made.
              </p>
            </div>
          </section>

          {/* Data Security and Privacy */}
          <section className='terms-section'>
            <h2 className='section-title'>5. Data Security and Privacy</h2>
            
            <div className='policy-point'>
              <h3 className='point-title'>Data Collection</h3>
              <p className='point-content'>
                We collect personal data including name, email address, and payment details to provide our services, manage your account, track progress, and send relevant communications.
              </p>
            </div>

            <div className='policy-point'>
              <h3 className='point-title'>Data Sharing</h3>
              <p className='point-content'>
                Hachion does not sell your personal data. We only share information with trusted partners for payment processing, service improvement, or when required by law.
              </p>
            </div>

            <div className='policy-point'>
              <h3 className='point-title'>Cookies</h3>
              <p className='point-content'>
                We use cookies to enhance your browsing experience. You can manage cookie preferences through your browser settings.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className='terms-section'>
            <h2 className='section-title'>6. Limitation of Liability</h2>
            <p className='section-content'>
              Hachion strives to provide a seamless learning experience but is not liable for:
            </p>
            <ul className='liability-list'>
              <li>Technical malfunctions or service interruptions</li>
              <li>Outcomes resulting from course materials</li>
              <li>Third-party links or tools accessed through our site</li>
            </ul>
          </section>

          {/* Termination of Service */}
          <section className='terms-section'>
            <h2 className='section-title'>7. Termination of Service</h2>
            <p className='section-content'>
              Hachion reserves the right to deny or terminate access to our services for violations of these terms, including unauthorized use of materials, account sharing, or activities compromising platform integrity. Termination may result in loss of access without refund.
            </p>
          </section>

          {/* Update on Terms */}
          <section className='terms-section'>
            <h2 className='section-title'>8. Updates to Terms</h2>
            <p className='section-content'>
              We may modify these terms periodically. Changes will be posted on our website or communicated via email. Continued use of our services constitutes acceptance of revised terms.
            </p>
          </section>

          {/* Governing Law */}
          <section className='terms-section'>
            <h2 className='section-title'>9. Governing Law</h2>
            <p className='section-content'>
              These terms are governed by the laws of the jurisdiction where Hachion is based. Any disputes will be resolved in the courts of that jurisdiction. By using our services, you agree to submit to the exclusive jurisdiction of these courts.
            </p>
          </section>

          {/* Contact Information */}
          <section className='terms-section'>
            <h2 className='section-title'>10. Contact Information</h2>
            <p className='section-content'>
              For questions or concerns regarding these terms:
            </p>
            <div className='contact-info'>
              <a href="mailto:trainings@hachion.co" className='contact-email'>
                trainings@hachion.co
              </a>
            </div>
            <p className='section-content' style={{marginTop: '15px'}}>
              Use of Hachion's services implies acceptance of these terms and conditions. Thank you for choosing Hachion for your online learning needs.
            </p>
          </section>

          {/* Disclaimer */}
          <section className='terms-section disclaimer-section'>
            <h2 className='section-title'>Disclaimer</h2>
            <p className='disclaimer-content'>
              By providing your phone number, you agree to receive text messages from Hachion. Message and data rates may apply. Message frequency varies. To unsubscribe, please contact us.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}

export default Terms;