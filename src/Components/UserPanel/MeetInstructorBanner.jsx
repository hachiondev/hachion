import React, { useEffect, useState, useRef } from "react";
import Instructorbanner from "../../Assets/topinstructor.webp";
import { Link } from "react-router-dom";
import "./Home.css";

const MeetInstructorBanner = () => {

  return (
    <div className="instructor-banner">
      {/* Left side content */}
      <div className="home-content">
        <h2 className="instructor-title">Meet Our Industry Expert Trainers </h2>
        <p className="instructor-title-text">
          At Hachion, you’ll learn directly from the best in the IT industry. 
          Our instructors are certified professionals and subject-matter experts with years of real-world experience. They bring hands-on knowledge, practical insights, and proven teaching methods to ensure you gain skills that matter in today’s job market.
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

