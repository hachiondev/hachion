import React, { useState } from 'react';
import './Course.css';
import { BsFileEarmarkPdfFill } from 'react-icons/bs';
import { FaPlus, FaMinus } from 'react-icons/fa6';

const QaFaqMain = ({ heading, topics, buttonText, additionalTopics }) => {
  const [showMore, setShowMore] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState({});

  // Toggle additional topics
  const handleViewMore = () => {
    setShowMore(!showMore);
  };

  // Toggle expanded content for each topic
  const handleToggleExpand = (index) => {
    setExpandedTopics(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
    console.log("Toggled topic index:", index); // Debug: Check which topic is toggled
    console.log("Expanded Topics State:", expandedTopics); // Debug: Check state after toggle
  };


  const contentMapping = {
    'What is Selenium 1.0 and Selenium 2.0?': [
     'Selenium 1.0 is also known as Selenium RC, and Selenium 2.0 is also known as Selenium Webdriver. Selenium RC is an approach where a browser is automated by injecting a javascript and commands are driven by sending them to a server. Whereas in the Webdriver the browser API is extended to drive the browser.',
     
    ],
    'Why do we need webdriver when we have IDE available?': [
      'Selenium IDE is only an XPI package or adds on of firefox. It was created for the sole purpose of providing record and replay of selenium test scenarios so that test automation script generation using client drivers becomes much faster as IDE also allows one to save a test in other formats. Also, you cannot perform logical flows, parameterization and other such limitations exist with IDE.'
   
    ],
    'What all browsers are supported by Webdriver?': [
      'Chrome',
      'Firefox',
      'Safari',
      'Internet Explorer',
      'Edge',
      'Opera'
    ],
    'Is it true that if an object is identified using XPath then, my tests can break if I execute them on a separate browser?': [
      'Yes, each browser identifies an object using XPath slightly differently.'
    ],
    'Can we program webdriver in any other language than Java?': [
      'Yes, WebDriver supports a variety of programming languages like C#, Ruby, Perl, Python, etc.'
    ],
    'How can I configure the proxy if I need to?': [
      'You can configure the proxy using the DesiredCapabilities class in WebDriver...'
    ],
    'Is there any selenium support available to users for selenium?': [
      'Yes, there are numerous resources including the Selenium Google Group, LinkedIn groups, and forums...'
    ],
    'what is a hybrid framework?': [
      'A hybrid framework combines multiple frameworks, like data-driven and keyword-driven approaches...'
    ],
    'Are there frameworks over selenium available?': [
      'Yes, many commercial and open-source frameworks are built on top of Selenium...'
    ],
    'Why selenium is a popular open source test solution for automation?': [
      'Selenium is popular because of its flexibility, support for multiple browsers, and extensive community support...'
    ]
  };

  // Render topics and conditionally expand detailed content
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
          <BsFileEarmarkPdfFill style={{ height: '40px', width: '30px', color: 'red' }} /> {buttonText}
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
