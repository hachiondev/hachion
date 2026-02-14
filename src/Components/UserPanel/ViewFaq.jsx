import React, { useEffect, useState, useRef } from "react";
import Address from "../../Assets/addressicon.webp";
import Contact from "../../Assets/contacticon.webp";
import Time from "../../Assets/timeicon.webp";
import FaqBanner from "../../Assets/faq-banner.webp";
import { Link } from "react-router-dom";
import "./Home.css";
import HelpFaqAll from "./HelpFaqAll";
import FaqFormPopup from "./FaqFormPopup";

const ViewFaq = () => {
  const [showPopup, setShowPopup] = useState(false);

  const [isIndia, setIsIndia] = useState(false);

useEffect(() => {
  fetch("https://api.country.is")
    .then((r) => r.json())
    .then((data) => {
      const code = (data?.country || "").toUpperCase();
      setIsIndia(code === "IN");
    })
    .catch(() => {
      setIsIndia(false); 
    });
}, []);

  useEffect(() => {
  window.scrollTo(0, 0);
}, []);

  return (
    <div className="course-top">
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
{/*       
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
    </div> */}
    <div className="faq-part">
  <img src={Address} alt="Address" className="icon" />
  <div>
    <h3>Address :</h3>
    {isIndia ? (
      <p>
        Hyderabad, India<br />
        Hachion GP Rao Enclaves, 301, 
        3rd floor Road No 3, KPHB colony, <br />
        Hyderabad 500072.
      </p>
    ) : (
      <p>
        Texas, USA<br />
        Hachion 601 Voyage Trce<br />
        Leander, Texas 78641
      </p>
    )}
  </div>
</div>

<div className="faq-part">
  <img src={Contact} alt="Contact" className="icon" />
  <div>
    <h3>Contact Us :</h3>
    {isIndia ? (
      <>
        <p>Call us: +91-949-032-3388</p>
        <p>trainings@hachion.co</p>
      </>
    ) : (
      <>
        <p>Call us: +1 (732)485-2499</p>
        <p>trainings@hachion.co</p>
      </>
    )}
  </div>
</div>

<div className="faq-part">
  <img src={Time} alt="Time" className="icon" />
  <div>
    <h3>Working Hours :</h3>
    {isIndia ? (
      <>
        <p>(Indian timings)</p>
        <p>Mon - Fri: 9.00am - 5.00pm</p>
        <p>Sat      : 9:00 am - 01:00 pm</p>
      </>
    ) : (
      <>
        <p>(USA CST timings)</p>
        <p>Mon - Fri: 9.00am - 5.00pm</p>
        <p>Sat: 9:00 am - 01:00 pm</p>
      </>
    )}
  </div>
</div>

    </div>

    <button className="faq-button" onClick={() => setShowPopup(true)}>Ask Question</button>
  </div>
</div>
    {showPopup && <FaqFormPopup onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default ViewFaq;

