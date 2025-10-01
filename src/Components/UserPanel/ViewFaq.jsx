import React, { useEffect, useState, useRef } from "react";
import Address from "../../Assets/addressicon.png";
import Contact from "../../Assets/contacticon.png";
import Time from "../../Assets/timeicon.png";
import FaqBanner from "../../Assets/faq-banner.webp";
import { Link } from "react-router-dom";
import "./Home.css";
import HelpFaq from "./HelpFaq";
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import Footer from './Footer';
import StickyBar from './StickyBar';
import FaqFormPopup from "./FaqFormPopup";

const ViewFaq = () => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="course-top">
        <Topbar />
        <NavbarTop />
        <img
        className="faq-banner"
        src={FaqBanner}
        alt="Faq banner"
        fetchpriority="high"
      />
    <div className="home-faq-data container">
      {/* Left side content */}
      <div className="view-faq-content">
        <HelpFaq />
        </div>

  <div className="faq-side">
    <h2>Didn’t Find the Answer?
        <br />
        Ask us Questions</h2>
    <p>Call us directly, submit a sample or email us!</p>
    <hr className="faq-side-divide"/>
    <div className="faq-contact">
    <div className="faq-part">
      <img src={Address} alt="Address" className="icon" />
      <div>
      <h3>Address Business</h3>
      <p>As per location Address</p>
      </div>
      </div>

      <div className="faq-part">
      <img src={Contact} alt="Contact" className="icon" />
      <div>
        <h3>Contact With Us</h3>
      <p>Call us: +91-949-032-3388</p>
      <p>trainings@hachion.co</p>
      </div>
      </div>

      <div className="faq-part">
      <img src={Time} alt="Time" className="icon" />
      <div>
        <h3>Working Time</h3>
      <p>Mon - Thu: 8.00am - 4.00pm</p>
      <p>Friday - Sat: 8:00 am - 12:30 pm</p>
    </div>
    </div>
    </div>

    <button className="faq-button" onClick={() => setShowPopup(true)}>Get in Touch With Us</button>
  </div>
</div>
    <Footer />
    <StickyBar />
    {showPopup && <FaqFormPopup onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default ViewFaq;

