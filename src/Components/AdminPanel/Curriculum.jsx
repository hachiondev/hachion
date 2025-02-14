import React, { useState, useEffect } from 'react';
import './Course.css';
import axios from 'axios';
import { BsFileEarmarkPdfFill } from 'react-icons/bs';
import { FaPlus, FaMinus } from 'react-icons/fa6';
import { useParams } from 'react-router-dom';

const Curriculum = ({ heading, buttonText }) => {
  const { courseName } = useParams(); // Extract courseName from URL
  const [showMore, setShowMore] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState({});
  const [curriculum, setCurriculum] = useState([]);
  const [matchedCourseName, setMatchedCourseName] = useState('');

  useEffect(() => {
    const fetchCourseAndCurriculum = async () => {
      try {
        // Fetch courses
        const coursesResponse = await axios.get('https://api.hachion.co/courses/all');
        const matchedCourse = coursesResponse.data.find(
          (course) => course.course_name.toLowerCase().replace(/\s+/g, '-') === courseName
        );

        if (!matchedCourse) {
          console.warn('No matching course found.');
          return;
        }

        setMatchedCourseName(matchedCourse.course_name);

        // Fetch curriculum
        const curriculumResponse = await axios.get('https://api.hachion.co/curriculum');
        const filteredCurriculum = curriculumResponse.data.filter(
          (item) => item.course_name === matchedCourse.course_name
        );

        setCurriculum(filteredCurriculum);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchCourseAndCurriculum();
  }, [courseName]);

  const handleViewMore = () => {
    setShowMore(!showMore);
  };

  const handleToggleExpand = (index) => {
    setExpandedTopics((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const renderTopics = () => {
    const visibleCurriculum = showMore ? curriculum : curriculum.slice(0, 5);

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
      {curriculum.length > 0 ? (
        <div className="curriculum-topic">{renderTopics()}</div>
      ) : (
        <p className="no-data">No curriculum available for this course.</p>
      )}
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
