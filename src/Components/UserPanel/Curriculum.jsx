
  // Sample content for each topic
//   const contentMapping = {
//     'Course Demo Video Links':['Demo Link 1',
//       'Demo Link 2',
//       'Demo Link 3'
//     ],
//     'Introduction': [
//       'What is Automation testing?',
//       'When to start Automation?',
//       'When not to go for automation?',
//       'What are the advantages of automation testing?',
//       'What is Selenium?',
//       'What are the advantages of Selenium?',
//       'Difference between Selenium and QTP?'
//     ],
//     'Selenium IDE': [
//       'What is Selenium IDE?',
//       'Installing IDE',
//       'Record and playback',
//       'Converting Selenium script into other languages',
//       'Batch testing in IDE'
//     ],
//     'Java': [
//       'Introduction to Java',
//       'Installing JDK',
//       'Configuring Eclipse IDE',
//       'Creating Java project',
//       'Sample Java program',
//       'Classes and objects',
//       'Downloading Selenium server jar',
//       'Configuring Selenium into the Java project',
//       'Conditional Statements in Java',
//       'Loops in Java',
//       'Arrays in Java',
//       'Array List in Java',
//       'Methods in Java',
//       'Utility functions in Java',
//       'Local and global variable in Java',
//       'Static and instance variables in Java',
//       'Hash set in Java',
//       'Method overloading in Java',
//       'Constructors in Java',
//       'Inheritance in Java',
//       'Interfaces in Java',
//       'Packages in Java'
//     ],
//     'WebDriver Introduction': [
//       'Browser Launching Automation',
//       'Working on',
//       'Firefox',
//       'Chrome',
//       'IE'
//     ],
//     'Add on and Methods': [
//       'Firebug and Fire path',
//       'Login functionality test',
//       'Locators in WebDriver',
//       'Methods in WebDriver'
//     ],
//     'Profiles':[
//       'Firefox Profiles',
//       'Making WebDriver launch a customized instance of Firefox',
//       'Basic HTML notations'
//     ],
//     'Automating Links':[
//       'Links testing',
//     'Clicking on a link and validating',
//   'Capturing links from a section of the page',
// 'Validating the captured Links',
// 'Links testing types',
// 'Visible links and hidden links',
// 'Validating all the links based on href property',
// 'checking for broken links'],

// 'Automating Dropdowns':[
//   'Dropdown Testing',
//   'Selection an option from the Dropdown',
//   'Capturing all elements in a dropdown',
//   'Checking the correctness of options in the Dropdown',
//   'Validating multiple Dropdowns'
// ]
//   };

  // Render topics and conditionally expand detailed content
  import React, { useState, useEffect } from 'react';
  import './Course.css';
  import axios from 'axios';
  import { BsFileEarmarkPdfFill } from 'react-icons/bs';
  import { FaPlus, FaMinus } from 'react-icons/fa6';
  
  const Curriculum = ({ heading, buttonText }) => {
    const [showMore, setShowMore] = useState(false);
    const [expandedTopics, setExpandedTopics] = useState({});
    const [curriculum, setCurriculum] = useState([]);
  
    // Toggle additional topics
    const handleViewMore = () => {
      setShowMore(!showMore);
    };
  
    // Toggle expanded content for each topic
    const handleToggleExpand = (index) => {
      setExpandedTopics((prevState) => ({
        ...prevState,
        [index]: !prevState[index],
      }));
    };
  
    // Fetch curriculum data from API
    useEffect(() => {
      const fetchCurriculum = async () => {
        try {
          const response = await axios.get('http://160.153.175.69:8080/curriculum');
          setCurriculum(response.data); // Store the curriculum data
        } catch (error) {
          console.error('Error fetching curriculum:', error.message);
        }
      };
      fetchCurriculum();
    }, []);
  
    // Render topics with slicing
    const renderTopics = () => {
      const visibleCurriculum = showMore ? curriculum : curriculum.slice(0, 5); // Show 5 items initially
  
      return visibleCurriculum.map((item, index) => (
        <div key={index}>
          <div className="curriculum-content" onClick={() => handleToggleExpand(index)}>
            <p>{item.title}</p>
            <p>
              {expandedTopics[index] ? (
                <FaMinus style={{ color: '#006489' }} />
              ) : (
                <FaPlus style={{ color: '#006489' }} />
              )}
            </p>
          </div>
  
          {expandedTopics[index] && (
            <div className="topic-details">
              <ul className="bullet-list">
                {item.topic &&
                  item.topic.split(',').map((topic, i) => (
                    <li key={i}>{topic.trim()}</li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      ));
    };
  
    return (
      <div className={`curriculum ${showMore ? 'curriculum-expanded' : ''}`}>
        <div className="curriculum-head">
          <h1 className="qa-heading">{heading}</h1>
          <button className="btn-curriculum">
            <BsFileEarmarkPdfFill className="btn-pdf-icon" /> {buttonText}
          </button>
        </div>
        <div className="curriculum-topic">{renderTopics()}</div>
        {curriculum.length > 5 && (
          <div className="view-div">
            <button className="view-more-btn" onClick={handleViewMore}>
              {showMore ? 'View Less' : 'View More'}
            </button>
          </div>
        )}
      </div>
    );
  };
  
  export default Curriculum;
  