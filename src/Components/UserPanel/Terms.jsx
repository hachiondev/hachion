import React, { useEffect , useState } from 'react';
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import './Blogs.css';
import { MdKeyboardArrowRight } from 'react-icons/md';
import StickyBar from './StickyBar';
import Footer from './Footer';
import { FaArrowUp } from 'react-icons/fa';

const Terms = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  // Scroll to top when component is mounted
  useEffect(() => {
    console.log("Terms component mounted. Scrolling to top...");
    window.scrollTo(0, 0);
  }, []);

  // Handle Scroll - Show/Hide Button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    console.log("Scroll to top clicked!");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Topbar />
      <NavbarTop />
      <div className='about-us'>
      <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a> <MdKeyboardArrowRight/>            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Terms and Conditions
            </li>
          </ol>
        </nav>
        <div className='about-us-content' style={{color: '#6a6a6a'}}>
          <h1 className='about-us-heading'>Terms and Conditions for Hachion</h1>

            <p className='about-us-left-content'>
            <p className='title'>1. Introduction</p>
            Welcome to Hachion, your trusted online certification course provider for a wide range of subjects. We are committed to delivering high-quality educational content and a seamless learning experience to our users. By accessing and using our platform, you agree to adhere to these terms and conditions. These guidelines are designed to ensure that you have a positive experience and that our services are used appropriately. Please take the time to read them carefully in order to understand your rights and responsibilities. Hachion aims to empower learners by providing flexible and accessible courses that cater to individual learning needs and goals.
            </p>

            <p className='about-us-left-content'>
            <p className='title'>2. Account Registration</p>
            In the registration process on Hachion, we create an account with access to our courses and require true and complete information. All responsibility is placed on your shoulders regarding confidentiality of the login details as well as all activities on your account. Hachion can never be liable for loss or damages arising from access to your account without permission. It is your responsibility to secure your account information and to notify us immediately if you suspect any unauthorized use. By using our services, you agree to these terms and acknowledge that Hachion provides a secure platform but does not assume liability for compromised accounts.
            </p>

            <p className='about-us-left-content'>
            <p className='title'>3. Access to and Use of Courses</p>
            <span style={{fontWeight: '600'}}>Access:</span> Once you have registered, you will be granted access to the courses you enrolled in. Courses are for personal, non-commercial use only. You cannot share, reproduce, or distribute any of the course materials, including videos, texts, quizzes, logos, and other content, without explicit permission from Hachion.
            </p>
            <p className='about-us-left-content'>
            <span style={{fontWeight: '600'}}>Course Material:</span> All course material such as video, text, quiz, logo, and all other information provided by Hachion is the intellectual property of Hachion and, therefore, are copyrighted and cannot be used or reproduced without permission.
            </p>
            <p className='about-us-left-content'>
            <span style={{fontWeight: '600'}}>Course Progress:</span> Hachion may monitor your course progress and use of courses to ensure compliance with these terms and to create a better learning experience.
            </p>

            <p className='about-us-left-content'>
            <p className='title'>4. Payment and Refunds</p>
            <span style={{fontWeight: '600'}}>Fees:</span> Hachion may monitor your course progress and use of courses to ensure compliance with these terms and to create a better learning experience.
            </p>
            <p className='about-us-left-content'>
            <span style={{fontWeight: '600'}}>Refunds:</span> Hachion may monitor your course progress and use of courses to ensure compliance with these terms and to create a better learning experience.
            </p>
            <p className='about-us-left-content'>
            <span style={{fontWeight: '600'}}>Cancellation:</span> Hachion may monitor your course progress and use of courses to ensure compliance with these terms and to create a better learning experience.
            </p>

            <p className='about-us-left-content'>
            <p className='title'>5. Data Security and Privacy</p>
            <span style={{fontWeight: '600'}}>Data Collection:</span> We collect personal data, including but not limited to your name, email address, and payment details to provide our services. This data is utilized to manage your account, keep track of your course progress, and send communications regarding courses.
            </p>
            <p className='about-us-left-content'>
            <span style={{fontWeight: '600'}}>Data Sharing:</span> Hachion sells or transfers your personal data to third parties only in situations where we have to use them for payments or legal reasons. We share data with our trustworthy partners to analyze and improve our services.
            </p>
            <p className='about-us-left-content'>
            <span style={{fontWeight: '600'}}>Cookies:</span> We use cookies for improving your experience in navigating our website. You may manage cookies in your settings.
            </p>

            <p className='about-us-left-content'>
            <p className='title'>6. Limitation of Liability</p>
            Hachion shall do its best in an effort to have a smooth learning experience but not be liable for:
            <li>Technical malfunctions pertaining to service.</li>
            <li>Choices or outcomes from any material presented in the courses.</li>
            </p>
            <p className='about-us-left-content'>
            Links or tools from other third parties which users access through our site.
            </p>

            <p className='about-us-left-content'>
            <p className='title'>7. Termination of Service</p>
            Hachion owns the rights to deny all access to our services based on some violation of the terms referred to herein or upon defaulting or abuse of the platform through, without restrictions, inappropriate use of study materials, sharing of persons' details, unauthorized gain of entry, or activities that result in interference or compromise to the integrity of our services. In doing so, we may sever or suspend your account sight unseen. The user is expected to abide by these terms and use Hachion responsibly. Access to courses and other associated services can be lost without any form of refund or compensation due to violations.
            </p>

            <p className='about-us-left-content'>
            <p className='title'>8. Update on Terms</p>
            We may modify these terms and conditions at any time. Any such changes will be posted on our website or communicated by email. Your continued use of our services following the posting of any changes constitutes your acceptance of the revised terms.
            </p>

            <p className='about-us-left-content'>
            <p className='title'>9. Governing Law</p>
            These terms and conditions are governed by the laws of the jurisdiction in which Hachion is based. Any disputes that may arise between Hachion and its users will be resolved in the courts of that jurisdiction. You agree to submit to the exclusive jurisdiction of these courts by using our services and acknowledge that they have the authority to hear and adjudicate any claims or disputes that may arise from these terms. This ensures that all parties are subject to consistent legal standards and facilitates fair and efficient resolution of conflicts.
            </p>

            <p className='about-us-left-content' style={{paddingBottom: '50px'}}>
            <p className='title'>10. Contact Information</p>
            Any issues, please contact us at trainings@hachion.co or through our website. Use of Hachion's services implies acceptance of the terms and conditions detailed herein. Thanks for considering Hachion for all your online learning needs.
            </p>

          </div>
         
        </div>

      <Footer />
      
      {/* Scroll to Top Button */}
      {showScrollButton && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          <FaArrowUp />
        </button>
      )}

      <StickyBar />
    </>
  );
}

export default Terms;