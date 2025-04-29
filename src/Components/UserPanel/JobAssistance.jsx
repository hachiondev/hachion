import React from "react";
import CareerImage from "../../Assets/career-support.png";
import accessImage from "../../Assets/access.png";

// Reusable component for each job assistance item
const JobAssistanceItem = ({ image, title, description, extraClass = "" }) => (
  <div className="profile-building-div">
    <img src={image} alt={title} />
    <div>
      <h5>{title}</h5>
      <p className={extraClass}>{description}</p>
    </div>
  </div>
);

const JobAssistance = () => {
  // Data for each job assistance feature
  const jobAssistanceItems = [
    {
      image: CareerImage,
      title: "Placement Assistance",
      description:
        "Placement opportunities are provided once the learner is moved to the placement pool upon clearing Placement Readiness Test (PRT)",
    },
    {
      image: accessImage,
      title: "Exclusive access to Hachion Job portal",
      description:
        "Exclusive access to our dedicated job portal and apply for jobs. More than 400 hiring partners’ including top start-ups and product companies hiring our learners. Mentored support on job search and relevant jobs for your career growth.",
      extraClass: "career-session",
    },
  ];

  return (
    <div className="profile-building">
      {jobAssistanceItems.map((item, index) => (
        <JobAssistanceItem
          key={index}
          image={item.image}
          title={item.title}
          description={item.description}
          extraClass={item.extraClass}
        />
      ))}
    </div>
  );
};

export default JobAssistance;
