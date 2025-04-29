import React from "react";
import "./Home.css";
import img1 from "../../Assets/image 72.png";
import img2 from "../../Assets/image 69.png";
import img3 from "../../Assets/image 68.png";
import img4 from "../../Assets/image 70.png";

const careerData = [
  {
    img: img1,
    title: "Live online Training",
    content:
      "Get Live interactive training from the convenience of your office or home.",
  },
  {
    img: img2,
    title: "Flexible Timings",
    content:
      "Our training programs provide learners flexibility to schedule on their own schedules.",
  },
  {
    img: img3,
    title: "Certification Guidance",
    content:
      "Technical team will help you to get certified in desired technologies.",
  },
  {
    img: img4,
    title: "Mentoring Support",
    content:
      "We strongly support mentoring mode for busy professionals to meet their training needs.",
  },
];

const Career = () => {
  return (
    <>
      <div className="association">
        <h1 className="association-head">
          Hachion enhances career advancement
        </h1>
      </div>

      <div className="career-div">
        {careerData.map((item, index) => (
          <div key={index} className="online-training-div">
            <img
              className="career-img"
              src={item.img}
              alt={`career-img-${index + 1}`}
            />
            <h3 className="Live-online">{item.title}</h3>
            <p className="training-content">{item.content}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Career;
