import React, { useEffect, useState, useRef } from "react";
import Knowledgebanner from "../../Assets/instructor.webp";
import { Link } from "react-router-dom";
import "./Home.css";

const ShareKnowledgeBanner = () => {

  return (
    <div className="instructor-banner">
      {/* Left side content */}
      <div className="home-content">
        <h2 className="instructor-title"> Share Your Knowledge. Inspire Learners </h2>
        <p className="instructor-title-text">
          Join our community of expert instructors and create your own courses to reach thousands of learners worldwide.
        </p>
        <div className="button-row">
          <button className="desktop-solid-button">Start Teaching Today</button>
        </div>
        </div>

      {/* Right side image */}
      <img
        className="corporate-image"
        src={Knowledgebanner}
        alt="Knowledge banner"
        fetchpriority="high"
      />
      <button className="mobile-solid-button">Start Teaching Today</button>
    </div>
  );
};

export default ShareKnowledgeBanner;

