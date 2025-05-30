import React, { useState } from "react";
import "./Course.css";
import "./Blogs.css";
import { FaPlus, FaMinus } from "react-icons/fa6";

const WorkshopFAQ = () => {
  const [expandedTopics, setExpandedTopics] = useState({});

  const Faq = [
    {
      faq_title: "Is prior experience required?",
      description: "No! Courses are designed for all skill levels.",
    },
    {
      faq_title: "Will students get materials after the program?",
      description: "Yes! Free access to recordings & guides for 6 months.",
    },
    {
      faq_title: "Can parents attend the demo?",
      description: "Absolutely! Demo on June 1st",
    },
  ];

  const handleToggleExpand = (index) => {
    setExpandedTopics((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <div className="workshop-content">
      <h2 className="summer-title">FAQs for Summer Training</h2>

      <div className="curriculum-topic">
        {Faq.map((item, index) => (
          <div key={index}>
            <div
              className="workfaq-content"
              onClick={() => handleToggleExpand(index)}
            >
              <p>{item.faq_title}</p>
              <p>
                {expandedTopics[index] ? (
                  <FaMinus style={{ color: "#fff" }} />
                ) : (
                  <FaPlus style={{ color: "#fff" }} />
                )}
              </p>
            </div>
            {expandedTopics[index] && (
              <div className="workfaq-topic-details">
                <p>{item.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkshopFAQ;
