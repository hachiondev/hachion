import React, { useState } from 'react';
import './Course.css';
import { BsFileEarmarkPdfFill } from 'react-icons/bs';
import { FaPlus, FaMinus } from 'react-icons/fa6';

const QaFaqMain = ({ heading, topics, buttonText, additionalTopics }) => {
  const [showMore, setShowMore] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState({});

  const handleViewMore = () => {
    setShowMore(!showMore);
  };

  const handleToggleExpand = (index) => {
    setExpandedTopics(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));

  };

  const renderTopics = (topicList, startIndex = 0) => {
    return topicList.map((topic, index) => (
      <div key={index + startIndex} className='topic-container'>
        <div className='curriculum-content' onClick={() => handleToggleExpand(index + startIndex)}>
          <p>{topic}</p>
          <p>
            {expandedTopics[index + startIndex] ? <FaMinus style={{ color: '#006489' }} /> : <FaPlus style={{ color: '#006489' }} />}
          </p>
        </div>
        {expandedTopics[index + startIndex] && (
          <div className='topic-details'>
            <ul className='bullet-list'>
              {contentMapping[topic] ? (
                contentMapping[topic].map((item, i) => <li key={i}>{item}</li>)
              ) : (
                <p>No additional content available for {topic}</p>
              )}
            </ul>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className={`curriculum ${showMore ? 'curriculum-expanded' : ''}`}>
      <div className='curriculum-head'>
        <h1 className='qa-heading'>{heading}</h1>
        <button className='btn-curriculum'>
          <BsFileEarmarkPdfFill className='btn-pdf-icon' /> {buttonText}
        </button>
      </div>
      <div className='curriculum-topic'>
        {renderTopics(topics)}
        {showMore && renderTopics(additionalTopics, topics.length)}
      </div>
      <div className='view-div'>
        <button className='view-more-btn' onClick={handleViewMore}>
          {showMore ? 'View Less' : 'View More'}
        </button>
      </div>
    </div>
  );
};

export default QaFaqMain;