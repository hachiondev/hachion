import Exp from "@/assets/exp.webp";
import Assig from "@/assets/assig.png";
import Handexp from "@/assets/handexp.webp";
import cv from "@/assets/cv.webp";
import inter from "@/assets/inter.webp";
import support from "@/assets/247.webp";

const WorkshopHighlights = () => {
  return (
    <div>
      <div className="workshop-content">
        <h2 className="workshop-heading">Program Highlights</h2>
        <div className="workshop-top-img">
          <div className="workshop-div-content">
            <img className="workshop-img" src={Exp.src} alt="" />
            <h6>Expert Guidance</h6>
          </div>
          <div className="workshop-div-content">
            <img className="workshop-img" src={Assig.src} alt="" />
            <h6>Assignment Practices</h6>
          </div>
          <div className="workshop-div-content">
            <img className="workshop-img" src={Handexp.src} alt="" />
            <h6>Hands on Projects</h6>
          </div>
        </div>

        <div className="workshop-top-img">
          <div className="workshop-div-content">
            <img className="workshop-img" src={cv.src} alt="" />
            <h6>Resume Building</h6>
          </div>
          <div className="workshop-div-content">
            <img className="workshop-img" src={inter.src} alt="" />
            <h6>Interview Preparation</h6>
          </div>
          <div className="workshop-div-content">
            <img className="workshop-img" src={support.src} alt="" />
            <h6>24/7 Support</h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopHighlights;
