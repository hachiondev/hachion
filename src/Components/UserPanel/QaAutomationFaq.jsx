import React, { useState, useEffect } from 'react';
import './Course.css';
import axios from 'axios';
import { BsFileEarmarkPdfFill } from 'react-icons/bs';
import { FaPlus, FaMinus } from 'react-icons/fa6';
import { useParams } from 'react-router-dom';
const QaAutomationFaq = () => {
  const [showMore, setShowMore] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState({});
  const [faq, setFaq] = useState([]);
 const { course_id } = useParams(); // Extract course_id from URL params
    const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
    const [course, setCourse] = useState(null);
  // Toggle additional topics
  const handleViewMore = () => {
    setShowMore(!showMore);
  };
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://api.hachion.co/courses/${course_id}`);
        if (response.data) {
          setCourse(response.data);
        } else {
          setError('Course not found');
        }
      } catch (err) {
        setError('Error fetching course data');
      } finally {
        setLoading(false);
      }
    };
  
    if (course_id) {
      fetchCourseData();
    } else {
      console.error('Course ID is missing!');
    }
  }, [course_id]);
  
  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const response = await axios.get('http://localhost:8080/faq');
        setFaq(response.data);
      } catch (error) {
        console.error('Error fetching FAQ:', error.message);
      }
    };
    fetchFaq();
  }, []);
  
  // Move the return statement after both useEffects
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  
  // Toggle expanded content for each topic
  const handleToggleExpand = (index) => {
    setExpandedTopics((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  // Fetch FAQ data from API


  // Render topics with slicing
  const renderTopics = () => {
    const visibleFaq = showMore ? faq : faq.slice(0, 5); // Show only 5 items if not expanded

    return visibleFaq.map((item, index) => (
      <div key={index}>
        <div className="curriculum-content" onClick={() => handleToggleExpand(index)}>
          <p>{item.faq_title}</p>
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
              {item.description &&
                item.description.split(',').map((desc, i) => (
                  <li key={i}>{desc.trim()}</li>
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
        <h1 className="qa-heading">{course.courseName} FAQ's</h1>
        <button className="btn-curriculum">
          <BsFileEarmarkPdfFill className="btn-pdf-icon" /> Download FAQ's
        </button>
      </div>
      <div className="curriculum-topic">{renderTopics()}</div>
      {faq.length > 5 && (
        <div className="view-div">
          <button className="view-more-btn" onClick={handleViewMore}>
            {showMore ? 'View Less' : 'View More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QaAutomationFaq;
