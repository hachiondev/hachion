
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
