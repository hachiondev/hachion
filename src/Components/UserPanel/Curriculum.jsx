import React, { useState } from 'react';
import './Course.css';
import { BsFileEarmarkPdfFill } from 'react-icons/bs';
import { FaPlus, FaMinus } from 'react-icons/fa6';

const Curriculum = ({ heading, topics, buttonText, additionalTopics }) => {
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
  };

  // Sample content for each topic
  const contentMapping = {
    'Course Demo Video Links':['Demo Link 1',
      'Demo Link 2',
      'Demo Link 3'
    ],
    'Introduction': [
      'What is Automation testing?',
      'When to start Automation?',
      'When not to go for automation?',
      'What are the advantages of automation testing?',
      'What is Selenium?',
      'What are the advantages of Selenium?',
      'Difference between Selenium and QTP?'
    ],
    'Selenium IDE': [
      'What is Selenium IDE?',
      'Installing IDE',
      'Record and playback',
      'Converting Selenium script into other languages',
      'Batch testing in IDE'
    ],
    'Java': [
      'Introduction to Java',
      'Installing JDK',
      'Configuring Eclipse IDE',
      'Creating Java project',
      'Sample Java program',
      'Classes and objects',
      'Downloading Selenium server jar',
      'Configuring Selenium into the Java project',
      'Conditional Statements in Java',
      'Loops in Java',
      'Arrays in Java',
      'Array List in Java',
      'Methods in Java',
      'Utility functions in Java',
      'Local and global variable in Java',
      'Static and instance variables in Java',
      'Hash set in Java',
      'Method overloading in Java',
      'Constructors in Java',
      'Inheritance in Java',
      'Interfaces in Java',
      'Packages in Java'
    ],
    'WebDriver Introduction': [
      'Browser Launching Automation',
      'Working on',
      'Firefox',
      'Chrome',
      'IE'
    ],
    'Add on and Methods': [
      'Firebug and Fire path',
      'Login functionality test',
      'Locators in WebDriver',
      'Methods in WebDriver'
    ],
    'Profiles':[
      'Firefox Profiles',
      'Making WebDriver launch a customized instance of Firefox',
      'Basic HTML notations'
    ],
    'Automating Links':[
      'Links testing',
    'Clicking on a link and validating',
  'Capturing links from a section of the page',
'Validating the captured Links',
'Links testing types',
'Visible links and hidden links',
'Validating all the links based on href property',
'checking for broken links'],

'Automating Dropdowns':[
  'Dropdown Testing',
  'Selection an option from the Dropdown',
  'Capturing all elements in a dropdown',
  'Checking the correctness of options in the Dropdown',
  'Validating multiple Dropdowns'
]
  };

  // Render topics and conditionally expand detailed content
  const renderTopics = (topicList, startIndex = 0) => {
    return topicList.map((topic, index) => (
      <div key={index + startIndex}>
        <div className='curriculum-content' onClick={() => handleToggleExpand(index + startIndex)}>
          <p>{topic}</p>
          <p>
            {expandedTopics[index + startIndex] ? <FaMinus style={{ color: '#006489' }} /> : <FaPlus style={{ color: '#006489' }} />}
          </p>
        </div>
        {expandedTopics[index + startIndex] && (
          <div className='topic-details'>
            <ul className='bullet-list'>
              {contentMapping[topic]?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
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

export default Curriculum;
