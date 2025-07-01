import React, { useEffect , useState } from 'react';
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import './Blogs.css';
import { MdKeyboardArrowRight } from 'react-icons/md';
import StickyBar from './StickyBar';
import Footer from './Footer';
import { FaArrowUp } from 'react-icons/fa';

const Privacy = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  // Scroll to top when component is mounted
  useEffect(() => {
    console.log("Privacy component mounted. Scrolling to top...");
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
            Privacy Policy
            </li>
          </ol>
        </nav>
        <div className='about-us-content' style={{color: '#6a6a6a'}}>
          <h1 className='about-us-heading'>Legal and Privacy Policy for Hachion</h1>

            <p className='about-us-left-content'>
            <p className='title'>1. Introduction</p>
            Welcome to Hachion! At Hachion, we respect your trust and are dedicated to being transparent about how we work and what we do with your information. This Legal and Privacy Policy details the terms under which you may use our services and what we do with your data. Accessing or otherwise using our website, applications, or other online features of any of our services means that you agree to this policy.
            </p>

            <p className='about-us-left-content'>
            <p className='title'>2. Legal Terms</p>
            <span style={{fontWeight: '600'}}>a. Service Agreement:</span> Hachion online certification courses for students. This gives a student an easier, flexible, and convenient time for learning. From our website, one enrolls for courses and has to adhere to some guidelines. Such include accurate truthful information while registering for the process to go smooth and secure. Courses and materials are intended only for personal, non-commercial use. That means that sharing, reproducing, or distributing the courses and materials without explicit written permission from Hachion is strictly prohibited. This ensures the integrity of our educational offerings and respects the rights of content creators.
            </p>
            <p className='about-us-left-content'>
            <span style={{fontWeight: '600'}}>b. Intellectual Property:</span> All videos, texts, quizzes, logos, trademarks, and other copyrightable materials published under Hachion's course are Hachion's exclusive intellectual properties, and by virtue of copyright, trademark, and other intellectual property laws, you may not use, copy, modify, distribute, or reproduce parts of these materials without explicit permission from Hachion. Unauthorized use or duplication of these resources is strictly prohibited and may result in legal action. We rely on these protections to maintain the quality and integrity of our courses and ensure a fair and respectful learning environment.
            </p>
            <p className='about-us-left-content'>
            <span style={{fontWeight: '600'}}>c. Limitation of Liability:</span> We cannot hold ourselves responsible for the things that may not work properly, but we do strive to provide a seamless learning experience. This includes technical glitches or technical difficulties beyond our control that may cause service interruptions. We also are not responsible for your choices or the results you may get from the information in the courses. Hachion does not endorse or accept responsibility for third-party links or tools that you may access through our site. It is always important to use your best judgment and discretion when accessing.
            </p>
            <p className='about-us-left-content'>
            <span style={{fontWeight: '600'}}>d. Termination of Service:</span> Hachion has the right to withdraw access to the site at any time and for any reason in case of a violation of this policy or misusing our services. This includes but is not limited to, sharing of course materials without authorization, being disruptive, or engaging in any activities that will compromise the integrity of our learning environment. You will lose access to courses, content, and other associated benefits upon termination of your access without any refund. We care about a respectful and fair learning experience for all users and take necessary actions to maintain a safe and productive platform.
            </p>

            <p className='about-us-left-content'>
            <p className='title'>3. Privacy Policy</p>
            <span style={{fontWeight: '600'}}>a. Data We Collect:</span> To deliver the best possible learning experience, Hachion collects different types of data from users. These include Personal Information such as your name, email address, and contact details to communicate and facilitate account management. Account Data that involves login credentials and how one progresses is collected to enable managing access to courses and to track one's learning journey. Details regarding payments are collected at the time of purchase of a course, and this information is processed through trusted third-party gateways to protect the financial data of the learner. Data security and transparency are emphasized so that a safe and effective learning environment is maintained.
            </p>
            <p className='about-us-left-content'>
            <span style={{fontWeight: '600'}}>b. How We Use Your Data:</span> At Hachion, we use your data to enrich your learning experience. We employ it in granting access to classes and tracking how you are progressing, ensuring that you can track your performance easily and remain engaged with the content. We use your data also to inform you of new courses and updates to our services so that you are always up to date with the latest opportunities and improvements. And besides that, your data helps us respond to your queries and provide support, ensuring timely assistance whenever you need it-in connection with course content, technical issues, or more general questions.
            </p>
            <p className='about-us-left-content'>
            <span style={{fontWeight: '600'}}>c. Data Sharing:</span> Hachion does not sell or transfer individual data to third parties, except where necessary for secure payment processing or as required by law and legal processes. We may share data with trusted partners to analyze and improve our services, ensuring a better learning experience. These partners adhere to strict confidentiality agreements and are bound by privacy standards similar to those of Hachion. This approach helps us to refine our offerings and provide enhanced support while maintaining your privacy and security. We are committed to safeguarding your information and only share data when it aligns with our policy and enhances the overall user experience.
            </p>
            <p className='about-us-left-content'>
            <span style={{fontWeight: '600'}}>d. Data Security:</span> At Hachion, we employ best-in-industry security practices for securing data, such as encrypting information and placing it on secure servers for the protection of personal data. These steps are made for the prevention of unauthorized access, but ensuring data confidentiality. Not to forget the fact that no system can be considered unbreakable. We advise our members to take extra care about your login credentials by choosing some strong, unique password with keeping them private. In this way, you are contributing to keeping your data safe and us creating a safe learning environment.
            </p>
            <p className='about-us-left-content'>
            <span style={{fontWeight: '600'}}>e. Cookies and Tracking:</span> Hachion uses cookies to provide you with a better surfing experience by tracking traffic, remembering your preferences, and offering content that is tailored closer to your needs. We use these small data files to understand how you interact with our website, which enables us to better improve it and provide you with a more personalized learning experience. You can enable cookie control from your browser settings, where you may opt to disable or manage cookies if you so wish. This way, you can still enjoy our services while being in control of your privacy.
            </p>
            <p className='about-us-left-content'>
            <span style={{fontWeight: '600'}}>f. Your Rights:</span> As a user of Hachion, you have the right to:
            <li>Access and update your own personal information at your convenience, so that you are able to keep your information fresh and accurate.</li>
            <li>Wipe all your data cleanly, if necessary, but subject to any legal or operational restrictions that may prevent its complete elimination. This ensures your data is handled responsibly and respects privacy regulations.</li>
            <li>You may withdraw your consent for receiving direct marketing communications at any time. You will have control over how we may contact you, either by managing your preferences in your account settings or by contacting our support team. We respect your choices and are committed to protecting your privacy.</li>
            </p>

            <p className='about-us-left-content'>
            <p className='title'>4. User Obligations</p>
            As a user of Hachion, it is your responsibility to:
            <li><span style={{fontWeight: '600'}}>Protect your access credentials: </span>Never share your login and access details with others as a precaution to maintain confidentiality regarding personal information and prevent compromises of learning integrity.</li>
            <li>Use our courses responsibly, only for the purposes of learning and personal growth. Avoid any form of misuse of course content or commencing any activities that may disrupt the learning environment.</li>
            <li>Treat other users and instructors respectfully. Be respectful of differences of opinion and maintain a constructive, positive, and welcoming environment throughout all interactions. This will ensure a healthy learning process for all.</li>
            </p>

            <p className='about-us-left-content'>
            <p className='title'>5. Update to the Policy</p>
            Hachion reserves the right to update this Legal and Privacy Policy periodically to reflect changes in our services, legal requirements, or best practices. Any updates will be communicated to you through our website or via email, ensuring you are informed of any modifications. It is crucial for you to go through these updates because you will know what information is being dealt with as well as how this handling might impact your utilization of our services. Accepting the new policy shall mean that you have consented to the new updates from the date of such uses of Hachion's services. We ask that you remain engaged and better informed of any updates towards a safe and compliant experience.
            </p>

            <p className='about-us-left-content'>
            <p className='title'>6. Contact Us</p>
            If you have any questions or concerns regarding this policy, please do not hesitate to contact us:
            <li>Email: <a href="https://mail.google.com/mail/?view=cm&to=trainings@hachion.co" 
    target="_blank" 
    rel="noopener noreferrer">trainings@hachion.co</a></li>
            </p>
            <p className='about-us-left-content'>
            <p className='title'>Disclaimer</p>
              Mobile information will not be shared with third parties/affiliates marketing/promotional purposes. All the above categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.
              <br/>
              If you wish to be removed from receiving future communications, you can opt out by Unsubscribe from Hachion.
            </p>
            <p className='about-us-left-content' style={{fontWeight: '600', paddingBottom: '50px', textAlign: 'center'}}>
            Thanks for choosing Hachion as your learning buddy. We are here to empower your education journey!
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

export default Privacy;