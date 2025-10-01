import React, { useEffect, useState, useRef } from "react";
import Faq from "../../Assets/faq.webp";
import { Link } from "react-router-dom";
import "./Home.css";
import HelpFaq from "./HelpFaq";
import {  useNavigate } from 'react-router-dom';

const HomeFaq = () => {
const navigate= useNavigate();
  return (
    <div className="home-faq-banner container">
    <div className="home-faq-data container">
      {/* Left side content */}
      <div className="home-faq-content">
        <p className="instructor-title-text">
          HELP
        </p>
        <div>
        <h2 className="association-head">FAQS</h2>
        <hr className="faq-seperater"/>
        </div>
        <HelpFaq />
        </div>

      {/* Right side image */}
      <img
        className="faq-image"
        src={Faq}
        alt="Faq banner"
        fetchpriority="high"
      />
    </div>
    <button className="home-start-button" onClick={() => {navigate("/viewfaqs");}}>
      View FAQS
      </button>
    </div>
  );
};

export default HomeFaq;

