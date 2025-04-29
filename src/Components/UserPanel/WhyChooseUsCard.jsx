import React from "react";

const WhyChooseUsCard = ({ img, title, desc }) => (
  <div className="about-us-div-content">
    <img src={img} alt={title} />
    <h6>{title}</h6>
    <p>{desc}</p>
  </div>
);

export default WhyChooseUsCard;
