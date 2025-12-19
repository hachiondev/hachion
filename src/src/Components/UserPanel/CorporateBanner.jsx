// import React from 'react';
// import './Corporate.css';

// const CorporateBanner = ({ onContactUsClick }) => {
//   return (
//     <div className='corporate-banner'>
//       <p className='corporate-banner-heading'>Corporate Training</p>
//       <p className='corporate-banner-content'>Innovative Learning for Effective Performance</p>
//       <p className='corporate-banner-bottom-content'>Prepare Your Team for the Next Era of Innovation</p>
//       <div className='corporate-button'>
//       <button className='contact-us-corporate' onClick={onContactUsClick}>Contact Us</button>
//     </div>
//     </div>
//   );
// };

// export default CorporateBanner;

import React, { useState } from "react";
import './Corporate.css';
import CorporatePeople from "../../Assets/corporate1.webp";
import CorporateTrainingForm from "./CorporateTrainingForm";

const CorporateBanner = () => {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <div className="home-background">
    <div className="corporate-training-banner container">
            <div className="home-content">
              <h1 className="home-title">
               Transform Your Workforce with Future-Ready Corporate Training Programs
              </h1>
              <p className="home-title-text">
               Empower your workforce with expert-led online IT training and upskilling programs in Cloud, Data Science, AI, and Digital Transformation. Boost productivity, drive innovation, and build a future-ready business
              </p>
              <div className="button-row">
                <button className="home-start-button"  onClick={() => setShowPopup(true)}>Get Free Consultation</button>
              </div>
            </div>
            <img
              className="home-banner-img"
              src={CorporatePeople}
              alt="Corporate People banner"
              fetchpriority="high"
            />
          </div>
          {showPopup && <CorporateTrainingForm onClose={() => setShowPopup(false)} />}
            </div>
  );
};

export default CorporateBanner;
