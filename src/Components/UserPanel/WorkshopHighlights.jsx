import React from "react";
import Exp from "../../Assets/exp.png";
import Assig from "../../Assets/assig.png";
import Handexp from "../../Assets/handexp.png";
import cv from "../../Assets/cv.png";
import inter from "../../Assets/inter.png";
import support from "../../Assets/247.png";

const WorkshopHighlights = () => {
  return (
    <div>
      <div className="workshop-content">
        <h2 className="workshop-heading">Program Highlights</h2>
        <div className="workshop-top-img">
          <div className="workshop-div-content">
            <img className="workshop-img" src={Exp} alt="" />
            <h6>Expert Guidance</h6>
          </div>
          <div className="workshop-div-content">
            <img className="workshop-img" src={Assig} alt="" />
            <h6>Assignment Practices</h6>
          </div>
          <div className="workshop-div-content">
            <img className="workshop-img" src={Handexp} alt="" />
            <h6>Hands on Projects</h6>
          </div>
        </div>

        <div className="workshop-top-img">
          <div className="workshop-div-content">
            <img className="workshop-img" src={cv} alt="" />
            <h6>Resume Building</h6>
          </div>
          <div className="workshop-div-content">
            <img className="workshop-img" src={inter} alt="" />
            <h6>Interview Preparation</h6>
          </div>
          <div className="workshop-div-content">
            <img className="workshop-img" src={support} alt="" />
            <h6>24/7 Support</h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopHighlights;
