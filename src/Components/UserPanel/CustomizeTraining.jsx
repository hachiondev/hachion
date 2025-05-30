import React from "react";
import img1 from "../../Assets/image.png";
import img2 from "../../Assets/image27.png";
import "./Corporate.css";

const trainingOptions = [
  {
    img: img1,
    alt: "Instructor-Led Live, Online Training",
    text: "Instructor-Led Live, Online Training",
  },
  {
    img: img2,
    alt: "Blended Training",
    text: "Blended Training",
  },
];

const CustomizeTraining = () => {
  return (
    <>
      <div className="association">
        <h2 className="association-head">
          Customized Training to Fit Your Needs
        </h2>
      </div>
      <div className="customize-training">
        {trainingOptions.map((option, index) => (
          <div className="customize-training-div" key={index}>
            <img src={option.img} alt={option.alt} />
            <p className="customize-training-div-content">{option.text}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default CustomizeTraining;
