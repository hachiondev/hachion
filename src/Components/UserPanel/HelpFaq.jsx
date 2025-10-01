import React, { useState } from 'react';
import './Course.css';
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdKeyboardArrowUp } from "react-icons/md";

const HelpFaq = () => {
  const [expandedTopics, setExpandedTopics] = useState({});

  const staticFaqs = [
    {
      faq_title: "Q1. What is the format of Hachion’s online IT courses?",
      description:
        "Hachion offers live instructor-led online classes combined with self-paced learning modules, recordings of every session, hands-on labs, and real-world projects.",
    },
    {
      faq_title: "Q2. Do I get access to class recordings?",
      description:
        "Yes — all live classes are recorded and available in your LMS so you can revisit lessons anytime.",
    },
    {
      faq_title: "Q3. Are these courses suitable for beginners/no programming background?",
      description:
        "Yes — most courses start with foundation modules. Prerequisites are listed on each course page, and our instructors and mentors support learners at every level.",
    },
    {
      faq_title: "Q4. Will I work on real projects during the course?",
      description:
        "Yes — every program includes industry-aligned projects and a capstone that you can showcase on your portfolio or LinkedIn.",
    },
  ];

  // Toggle individual FAQ expansion
  const handleToggleExpand = (index) => {
    setExpandedTopics((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
      <div className="help-faq-topic container">
        {staticFaqs.map((item, index) => (
          <div key={index}>
            <div
              className="help-faq-content"
              onClick={() => handleToggleExpand(index)}
            >
              <h3 className="help-faq-que">{item.faq_title}</h3>
              <p>
                {expandedTopics[index] ? (
                  <MdKeyboardArrowUp className="ms-1 arrow-icon"/>
                ) : (
                  <MdKeyboardArrowDown className="ms-1 arrow-icon"/>
                )}
              </p>
            </div>

            {expandedTopics[index] && (
              <div className="help-faq-details">
                <div className="faq-description">{item.description}</div>
              </div>
            )}
          </div>
        ))}
      </div>
  );
};

export default HelpFaq;
