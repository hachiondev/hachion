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
  const { courseName } = useParams(); // Extract courseName from URL params
  const [matchedCourseName, setMatchedCourseName] = useState(null);

  // Fetch course details to get the correct course_name
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://api.hachion.co/courses/all');
        const matchedCourse = response.data.find(
          (c) => c.courseName.toLowerCase().replace(/\s+/g, '-') === courseName
        );

        if (matchedCourse) {
          setMatchedCourseName(matchedCourse.courseName.trim());
        } else {
          setError('Course not found.');
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
        setError('Failed to load course details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseName]);

  // Fetch FAQs based on the matched course_name
  useEffect(() => {
    if (!matchedCourseName) return;

    const fetchFaq = async () => {
      try {
        const response = await axios.get('https://api.hachion.co/faq');
        const filteredFaq = response.data.filter(
          (item) => item.course_name && item.course_name.trim() === matchedCourseName
        );

        setFaq(filteredFaq);
      } catch (error) {
        console.error('Error fetching FAQ:', error.message);
        setError('Failed to load FAQs.');
      }
    };

    fetchFaq();
  }, [matchedCourseName]);

  // Toggle View More / View Less
  const handleViewMore = () => {
    setShowMore(!showMore);
  };

  // Toggle individual FAQ expansion
  const handleToggleExpand = (index) => {
    setExpandedTopics((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  // Render FAQ topics
  const renderTopics = () => {
    const visibleFaq = showMore ? faq : faq.slice(0, 5);

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
        <h1 className="qa-heading">{matchedCourseName} FAQ's</h1>
        <button className="btn-curriculum">
          <BsFileEarmarkPdfFill className="btn-pdf-icon" /> Download FAQ's
        </button>
      </div>
      <div className="curriculum-topic">
        {faq.length > 0 ? renderTopics() : <p>No FAQs available for this course.</p>}
      </div>
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
