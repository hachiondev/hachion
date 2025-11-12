import React, { useEffect, useState, useRef } from "react";
import Address from "../../Assets/addressicon.png";
import Contact from "../../Assets/contacticon.png";
import Time from "../../Assets/timeicon.png";
import FaqBanner from "../../Assets/faq-banner.webp";
import { Link } from "react-router-dom";
import "./Home.css";
import HelpFaqAll from "./HelpFaqAll";
import Topbar from './Topbar';
import NavbarTop from './NavbarTop';
import Footer from './Footer';
import StickyBar from './StickyBar';
import FaqFormPopup from "./FaqFormPopup";

const ViewFaq = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
  window.scrollTo(0, 0);
}, []);

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
        {/* <HelpFaq /> */}
        <HelpFaqAll />
        </div>


  <div className="faq-side">
    <h2>Didn’t Find What You’re Looking For?
        {/* <br />
        Ask us Questions */}
        </h2>
    <p>we’re happy to help!</p>
    <hr className="faq-side-divide"/>
    <div className="faq-contact">
    <div className="faq-part">
      <img src={Address} alt="Address" className="icon" />
      <div>
      <h3>Address :</h3>
      <p>As per location Address</p>
      </div>
      </div>

      <div className="faq-part">
      <img src={Contact} alt="Contact" className="icon" />
      <div>
        <h3>Contact Us :</h3>
      <p>Call us: +91-949-032-3388</p>
      <p>trainings@hachion.co</p>
      </div>
      </div>

      <div className="faq-part">
      <img src={Time} alt="Time" className="icon" />
      <div>
        <h3> Working Hours :</h3>
      <p>Mon - Thu: 8.00am - 4.00pm</p>
      <p>Friday - Sat: 8:00 am - 12:30 pm</p>
    </div>
    </div>
    </div>

    <button className="faq-button" onClick={() => setShowPopup(true)}>Ask Question</button>
  </div>
</div>
    <Footer />
    <StickyBar />
    {showPopup && <FaqFormPopup onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default ViewFaq;

