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
  const [curriculumData, setCurriculumData] = useState({
    course_name: "",
    curriculum_pdf: null,
  });

  const handleDownload = () => {
    if (!curriculumData.curriculum_pdf) {
      alert("No file available for download.");
      return;
    }

    const url = URL.createObjectURL(curriculumData.curriculum_pdf);
    const link = document.createElement("a");
    link.href = url;
    link.download = curriculumData.curriculum_pdf.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  // Fetch curriculum data and filter by courseName
  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        const response = await axios.get('http://localhost:8080/curriculum');
        const filteredCurriculum = response.data.filter(
          (item) =>
            item.courseName.toLowerCase().replace(/\s+/g, '-') === courseName
        );
        setCurriculum(filteredCurriculum);
      } catch (error) {
        console.error('Error fetching curriculum:', error.message);
      }
    };

    fetchCurriculum();
  }, [courseName]);

  // Render topics with slicing
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
        {/* <button className="btn-curriculum">
          <BsFileEarmarkPdfFill className="btn-pdf-icon" /> {buttonText}
        </button> */}
        <button className="btn-curriculum" onClick={handleDownload}>
        <BsFileEarmarkPdfFill className="btn-pdf-icon" /> Download Brochure
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