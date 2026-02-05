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
            <h1 className='terms-main-title'>Terms and Conditions for Hachion</h1>
          </header>

          {/* Introduction */}
          <section className='terms-section'>
            <h2 className='section-title'>1. Introduction</h2>
            <p className='section-content'>
              Welcome to Hachion, your trusted online certification course provider for a wide range of subjects. We are committed to delivering high-quality educational content and a seamless learning experience to our users. By accessing and using our platform, you agree to adhere to these terms and conditions. These guidelines are designed to ensure that you have a positive experience and that our services are used appropriately. Please take the time to read them carefully in order to understand your rights and responsibilities. Hachion aims to empower learners by providing flexible and accessible courses that cater to individual learning needs and goals.
            </p>
          </section>

          {/* Account Registration */}
          <section className='terms-section'>
            <h2 className='section-title'>2. Account Registration</h2>
            <p className='section-content'>
              In the registration process on Hachion, we create an account with access to our courses and require true and complete information. All responsibility is placed on your shoulders regarding confidentiality of the login details as well as all activities on your account. Hachion can never be liable for loss or damages arising from access to your account without permission. It is your responsibility to secure your account information and to notify us immediately if you suspect any unauthorized use. By using our services, you agree to these terms and acknowledge that Hachion provides a secure platform but does not assume liability for compromised accounts.
            </p>
          </section>

          {/* Access to and Use of Courses */}
          <section className='terms-section'>
            <h2 className='section-title'>3. Access to and Use of Courses</h2>
            
            <div className='policy-point'>
              <h3 className='point-title'>Access</h3>
              <p className='point-content'>
                Once you have registered, you will be granted access to the courses you enrolled in. Courses are for personal, non-commercial use only. You cannot share, reproduce, or distribute any of the course materials, including videos, texts, quizzes, logos, and other content, without explicit permission from Hachion.
              </p>
            </div>

            <div className='policy-point'>
              <h3 className='point-title'>Course Material</h3>
              <p className='point-content'>
                All course material such as video, text, quiz, logo, and all other information provided by Hachion is the intellectual property of Hachion and, therefore, are copyrighted and cannot be used or reproduced without permission.
              </p>
            </div>

            <div className='policy-point'>
              <h3 className='point-title'>Course Progress</h3>
              <p className='point-content'>
                Hachion may monitor your course progress and use of courses to ensure compliance with these terms and to create a better learning experience.
              </p>
            </div>
          </section>

          {/* Payment and Refunds */}
          <section className='terms-section'>
            <h2 className='section-title'>4. Payment and Refunds</h2>
            
            <div className='policy-point'>
              <h3 className='point-title'>Fees</h3>
              <p className='point-content'>
                Hachion may monitor your course progress and use of courses to ensure compliance with these terms and to create a better learning experience.
              </p>
            </div>

            <div className='policy-point'>
              <h3 className='point-title'>Refunds</h3>
              <p className='point-content'>
                Hachion may monitor your course progress and use of courses to ensure compliance with these terms and to create a better learning experience.
              </p>
            </div>

            <div className='policy-point'>
              <h3 className='point-title'>Cancellation</h3>
              <p className='point-content'>
                Hachion may monitor your course progress and use of courses to ensure compliance with these terms and to create a better learning experience.
              </p>
            </div>
          </section>

          {/* Data Security and Privacy */}
          <section className='terms-section'>
            <h2 className='section-title'>5. Data Security and Privacy</h2>
            
            <div className='policy-point'>
              <h3 className='point-title'>Data Collection</h3>
              <p className='point-content'>
                We collect personal data, including but not limited to your name, email address, and payment details to provide our services. This data is utilized to manage your account, keep track of your course progress, and send communications regarding courses.
              </p>
            </div>

            <div className='policy-point'>
              <h3 className='point-title'>Data Sharing</h3>
              <p className='point-content'>
                Hachion sells or transfers your personal data to third parties only in situations where we have to use them for payments or legal reasons. We share data with our trustworthy partners to analyze and improve our services.
              </p>
            </div>

            <div className='policy-point'>
              <h3 className='point-title'>Cookies</h3>
              <p className='point-content'>
                We use cookies for improving your experience in navigating our website. You may manage cookies in your settings.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className='terms-section'>
            <h2 className='section-title'>6. Limitation of Liability</h2>
            <p className='section-content'>
              Hachion shall do its best in an effort to have a smooth learning experience but not be liable for:
            </p>
            <ul className='liability-list'>
              <li>Technical malfunctions pertaining to service.</li>
            <li>Choices or outcomes from any material presented in the courses.</li>
            <li>Links or tools from other third parties which users access through our site.</li>
            </ul>
          </section>

          {/* Termination of Service */}
          <section className='terms-section'>
            <h2 className='section-title'>7. Termination of Service</h2>
            <p className='section-content'>
              Hachion owns the rights to deny all access to our services based on some violation of the terms referred to herein or upon defaulting or abuse of the platform through, without restrictions, inappropriate use of study materials, sharing of persons' details, unauthorized gain of entry, or activities that result in interference or compromise to the integrity of our services. In doing so, we may sever or suspend your account sight unseen. The user is expected to abide by these terms and use Hachion responsibly. Access to courses and other associated services can be lost without any form of refund or compensation due to violations.
            </p>
          </section>

          {/* Update on Terms */}
          <section className='terms-section'>
            <h2 className='section-title'>8. Updates to Terms</h2>
            <p className='section-content'>
              We may modify these terms and conditions at any time. Any such changes will be posted on our website or communicated by email. Your continued use of our services following the posting of any changes constitutes your acceptance of the revised terms.
            </p>
          </section>

          {/* Governing Law */}
          <section className='terms-section'>
            <h2 className='section-title'>9. Governing Law</h2>
            <p className='section-content'>
              These terms and conditions are governed by the laws of the jurisdiction in which Hachion is based. Any disputes that may arise between Hachion and its users will be resolved in the courts of that jurisdiction. You agree to submit to the exclusive jurisdiction of these courts by using our services and acknowledge that they have the authority to hear and adjudicate any claims or disputes that may arise from these terms. This ensures that all parties are subject to consistent legal standards and facilitates fair and efficient resolution of conflicts.
            </p>
          </section>

          {/* Contact Information */}
          <section className='terms-section'>
            <h2 className='section-title'>10. Contact Information</h2>
            <p className='section-content'>
              Any issues, please contact us at:
            </p>
            <div className='contact-info'>
              <a href="https://mail.google.com/mail/?view=cm&to=trainings@hachion.co" 
              className='contact-email'
    target="_blank" 
    rel="noopener noreferrer">trainings@hachion.co</a>
            </div>
            <p className='section-content' style={{marginTop: '15px'}}>
              or through our website. Use of Hachion's services implies acceptance of the terms and conditions detailed herein. Thanks for considering Hachion for all your online learning needs.
            </p>
          </section>

          {/* Disclaimer */}
          <section className='terms-section disclaimer-section'>
            <h2 className='section-title'>Disclaimer</h2>
            <p className='disclaimer-content'>
              By providing your phone number, you agree to receive a text message from Hachion. Message and Data rates may apply, Message frequency varies. To stop receiving messages, you can opt out by Unsubscribe from Hachion. For more information, contact us.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}

export default Terms;