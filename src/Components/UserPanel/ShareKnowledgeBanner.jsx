import React, { useEffect, useState, useRef } from "react";
import Knowledgebanner from "../../Assets/instructor.webp";
import { Link } from "react-router-dom";
import {  useNavigate } from 'react-router-dom';
import "./Home.css";

const ShareKnowledgeBanner = () => {
  const navigate= useNavigate();

  return (
    <div className="instructor-banner container">
      {/* Left side content */}
      <div className="home-content">
        <h2 className="instructor-title">Share Your Knowledge. Inspire the Next Generation of Learners</h2>
        <p className="instructor-title-text">
         At Hachion, we believe knowledge grows when it’s shared. Join our global community of expert instructors and transform your expertise into high-quality online IT courses. With our platform, you can reach thousands of learners worldwide, inspire careers, and build your personal brand as a thought leader.
        </p>
        <div className="button-row">
          <button className="desktop-solid-button" onClick={() => {navigate("/become-instructor");}}>Start Teaching Today</button>
        </div>
        </div>

      {/* Right side image */}
      <img
        className="corporate-image"
        src={Knowledgebanner}
        alt="Knowledge banner"
        fetchpriority="high"
      />
      <button className="mobile-solid-button" onClick={() => {navigate("/become-instructor");}}>Start Teaching Today</button>
    </div>
  );
};

export default ShareKnowledgeBanner;

