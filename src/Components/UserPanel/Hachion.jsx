import React from "react";
import "./Corporate.css";
import slashTrainingBudget from "../../Assets/slashTraining.png";
import remoteTraining from "../../Assets/remoteTraining.png";
import flexibleTraining from "../../Assets/flexibleSchedule.png";
import flexibleDesign from "../../Assets/flexibleDesign.png";
import workforceNeeds from "../../Assets/workforceNeeds.png";
import expertHelp from "../../Assets/expertHelp.png";

// Reusable component for each training feature
const TrainingFeature = ({ image, title, description }) => (
  <div className="about-us-div-content">
    <img src={image} alt={title} />
    <h6>{title}</h6>
    <p>{description}</p>
  </div>
);

const Hachion = () => {
  // Data for each feature
  const features = [
    {
      image: slashTrainingBudget,
      title: "Slash Training Budget",
      description: "Optimising Cost without compromising quality",
    },
    {
      image: remoteTraining,
      title: "Remote Training For Employees",
      description: "Access learning anytime, anywhere with flexibility.",
    },
    {
      image: flexibleTraining,
      title: "Flexible Training Schedules",
      description: "Adaptable learning time that fit your needs",
    },
    {
      image: flexibleDesign,
      title: "Flexible Syllabus Design",
      description: "Easily customize course content to suit your goals.",
    },
    {
      image: workforceNeeds,
      title: "Evaluate Workforce Needs",
      description: "Assess skills and requirement for optimal performance.",
    },
    {
      image: expertHelp,
      title: "Expert help via chat",
      description: "Immediate support from knowledgeable professionals.",
    },
  ];

  return (
    <>
      <div className="association">
        <h1 className="association-head">Why Choose Hachion?</h1>
      </div>
      <div className="hachion-content">
        <div className="about-us-row">
          {features.map(({ image, title, description }, index) => (
            <TrainingFeature
              key={index}
              image={image}
              title={title}
              description={description}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Hachion;
