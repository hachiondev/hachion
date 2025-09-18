import React, { useEffect, useState, useRef } from "react";
import Instructorbanner from "../../Assets/topinstructor.webp";
import { Link } from "react-router-dom";
import "./Home.css";

const MeetInstructorBanner = () => {

  return (
    <div className="instructor-banner">
      {/* Left side content */}
      <div className="home-content">
        <h2 className="instructor-title"> Meet Our Top Instructor </h2>
        <p className="instructor-title-text">
          Learn from the best in the field. 
          Our top instructors bring industry experience and expertise across various subjects, 
          guiding you to achieve your learning goals.
        </p>
        <div className="button-row">
          <button className="desktop-border-button">Meet All Our Experts</button>
        </div>
        </div>

      {/* Right side image */}
      <img
        className="corporate-image"
        src={Instructorbanner}
        alt="Instructor banner"
        fetchpriority="high"
      />
      <button className="mobile-border-button">Meet All Our Experts</button>
    </div>
  );
};

export default MeetInstructorBanner;

