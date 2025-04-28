import React, { useEffect, useState, useCallback } from 'react';
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
    window.scrollTo(0, 0);
  }, []);

  // Handle Scroll - Show/Hide Button
  const handleScroll = useCallback(() => {
    if (window.scrollY > 300) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Topbar />
      <NavbarTop />
      <div className="about-us">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a> <MdKeyboardArrowRight />
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Privacy Policy
            </li>
          </ol>
        </nav>
        <div className="about-us-content">
          <h1 className="about-us-heading">Legal and Privacy Policy for Hachion</h1>

          <section>
            <h2 className="title">1. Introduction</h2>
            <p>Welcome to Hachion! At Hachion, we respect your trust and are dedicated to being transparent about how we work and what we do with your information. This Legal and Privacy Policy details the terms under which you may use our services and what we do with your data. Accessing or otherwise using our website, applications, or other online features of any of our services means that you agree to this policy.</p>
          </section>

          <section>
            <h2 className="title">2. Legal Terms</h2>
            <h3>Service Agreement:</h3>
            <p>Hachion online certification courses for students. This gives a student an easier, flexible, and convenient time for learning. From our website, one enrolls for courses and has to adhere to some guidelines...</p>
            <h3>Intellectual Property:</h3>
            <p>All videos, texts, quizzes, logos, trademarks, and other copyrightable materials published under Hachion's course are Hachion's exclusive intellectual properties...</p>
            <h3>Limitation of Liability:</h3>
            <p>We cannot hold ourselves responsible for the things that may not work properly, but we do strive to provide a seamless learning experience...</p>
            <h3>Termination of Service:</h3>
            <p>Hachion has the right to withdraw access to the site at any time and for any reason in case of a violation of this policy...</p>
          </section>

          <section>
            <h2 className="title">3. Privacy Policy</h2>
            <h3>Data We Collect:</h3>
            <p>To deliver the best possible learning experience, Hachion collects different types of data from users...</p>
            <h3>How We Use Your Data:</h3>
            <p>At Hachion, we use your data to enrich your learning experience...</p>
            <h3>Data Sharing:</h3>
            <p>Hachion does not sell or transfer individual data to third parties...</p>
            <h3>Data Security:</h3>
            <p>At Hachion, we employ best-in-industry security practices for securing data...</p>
            <h3>Cookies and Tracking:</h3>
            <p>Hachion uses cookies to provide you with a better surfing experience...</p>
            <h3>Your Rights:</h3>
            <ul>
              <li>Access and update your personal information...</li>
              <li>Wipe all your data cleanly...</li>
              <li>You may withdraw your consent for receiving direct marketing communications...</li>
            </ul>
          </section>

          <section>
            <h2 className="title">4. User Obligations</h2>
            <ul>
              <li><strong>Protect your access credentials:</strong> Never share your login and access details with others...</li>
              <li>Use our courses responsibly...</li>
              <li>Treat other users and instructors respectfully...</li>
            </ul>
          </section>

          <section>
            <h2 className="title">5. Update to the Policy</h2>
            <p>Hachion reserves the right to update this Legal and Privacy Policy periodically...</p>
          </section>

          <section>
            <h2 className="title">6. Contact Us</h2>
            <p>If you have any questions or concerns regarding this policy, please do not hesitate to contact us:</p>
            <ul>
              <li>Email: <a href="mailto:trainings@hachion.co">trainings@hachion.co</a></li>
            </ul>
          </section>

          <footer className="footer-thank-you">
            <p>Thanks for choosing Hachion as your learning buddy. We are here to empower your education journey!</p>
          </footer>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollButton && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          <FaArrowUp />
        </button>
      )}

      <StickyBar />
      <Footer />
    </>
  );
}

export default Privacy;
