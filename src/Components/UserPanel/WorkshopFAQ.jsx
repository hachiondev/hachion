import React, { useState } from 'react';
import './Course.css';
import './Blogs.css';
import { FaPlus, FaMinus } from 'react-icons/fa6';

const WorkshopFAQ = () => {
  const [expandedTopics, setExpandedTopics] = useState({});

  // Static FAQs
  const Faq = [
    {
      faq_title: 'Will this be live or pre-recorded?',
      description:
        "This program features live interactive sessions where you'll engage directly with our experienced QA experts. Plus all sessions will be recorded for your convenience, allowing you to revisit the content anytime for better understanding and reference.",
    },
    {
      faq_title: 'Since the workshop is live, will you be sharing recordings?',
      description:
        "Yes, daily class recordings will be shared with you, and you'll have lifetime access for future reference and continued earning.",
    },
    {
      faq_title: 'Who is eligible?',
      description:
        "This workshop is designed for anyone looking to build practical Salesforce skills and advance their career. Ideal participants include",
    },
    {
      faq_title: 'What if I miss a scheduled training session?',
      description:
        "We understand that schedules can be unpredictable! If you miss a session, here’s how you can access recorded sessions to review at your convenience",
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
    <div className='workshop-content'>
          <h2 className='workshop-heading'>Frequently Asked Questions</h2>

      <div className="curriculum-topic">
        {Faq.map((item, index) => (
          <div key={index}>
            <div className="workfaq-content" onClick={() => handleToggleExpand(index)}>
              <p>{item.faq_title}</p>
              <p>
                {expandedTopics[index] ? (
                  <FaMinus style={{ color: '#fff' }} />
                ) : (
                  <FaPlus style={{ color: '#fff' }} />
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