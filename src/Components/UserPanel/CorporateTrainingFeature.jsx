import React from "react";
import "./Corporate.css";
import icon1 from "../../Assets/content.jpg";
import icon2 from "../../Assets/support.jpg";
import icon3 from "../../Assets/project.jpg";
import icon4 from "../../Assets/flexibility.jpg";
import icon5 from "../../Assets/skill.jpg";
import icon6 from "../../Assets/certificate.jpg";
import training from "../../Assets/Rectangle 909.png";

const features = [
  {
    icon: icon1,
    heading: "Customized Content",
    para: "Flexible Content Solutions, Designed for Your Goals",
  },
  {
    icon: icon2,
    heading: "24/7 Support",
    para: "Expert Assistance, Whenever You Need It",
  },
  {
    icon: icon3,
    heading: "Projects",
    para: "Designed for Impact, Executed with Care",
  },
  {
    icon: icon4,
    heading: "Flexibility",
    para: "Adapting to Your Needs, Anytime",
  },
  {
    icon: icon5,
    heading: "Skill Tracking",
    para: "Monitor Growth, Enhance Performance",
  },
  {
    icon: icon6,
    heading: "Certification",
    para: "Validate Your Skills, Advance Your Career",
  },
];

const CorporateTrainingFeature = () => {
  return (
    <>
      <div className="association">
        <h2 className="association-head">Corporate Training Features</h2>
      </div>
      <div className="corporate-training-features">
        <div className="customized-column">
          {features.map((item, index) => (
            <div className="customized-content" key={index}>
              <img src={item.icon} alt={`${item.heading}-icon`} />
              <div>
                <p className="customized-content-heading">{item.heading}</p>
                <p className="customized-content-para">{item.para}</p>
              </div>
            </div>
          ))}
        </div>
        <img
          src={training}
          alt="training-illustration"
          className="training-img"
        />
      </div>
    </>
  );
};

export default CorporateTrainingFeature;
