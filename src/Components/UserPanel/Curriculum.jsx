import React, { useState, useEffect } from 'react';
import './Course.css';
import axios from 'axios';
import { BsFileEarmarkPdfFill } from 'react-icons/bs';
import { FaPlus, FaMinus } from 'react-icons/fa6';
import { BsFillPlayCircleFill } from 'react-icons/bs';
import { useParams } from 'react-router-dom';

const Curriculum = () => {
  const [showMore, setShowMore] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState({});
  const [faq, setFaq] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null); // Store PDF URL here
  const { courseName } = useParams(); // Extract courseName from URL params
  const [matchedCourseName, setMatchedCourseName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/courses/all');
        console.log('API response:', response.data); // Check course data
    
        const courseNameFromUrl = courseName?.toLowerCase()?.replace(/\s+/g, '-');
        console.log('Course name from URL:', courseNameFromUrl);
    
        const matchedCourse = response.data.find(
          (c) => c.courseName.toLowerCase().replace(/\s+/g, '-') === courseNameFromUrl
        );
    
        if (matchedCourse) {
          setMatchedCourseName(matchedCourse.courseName.trim());
          console.log('Matched Course:', matchedCourse);
    
          // Fetch curriculum details
          const curriculumResponse = await axios.get('http://localhost:8080/curriculum');
          console.log('Curriculum API response:', curriculumResponse.data); // Log the curriculum data
    
          // Normalize both names for reliable comparison
          const matchedCurriculum = curriculumResponse.data.find(
            (item) => item.course_name?.trim().toLowerCase() === matchedCourse.courseName.trim().toLowerCase()
          );
  
          console.log('Matched Curriculum:', matchedCurriculum); // Debugging log
  
          // Set the PDF URL if found
          if (matchedCurriculum && matchedCurriculum.curriculum_pdf) {
            const fullPdfUrl = `http://localhost:8080/curriculum/${matchedCurriculum.curriculum_pdf}`; // Ensure full URL
            setPdfUrl(fullPdfUrl);
            console.log('PDF URL Set:', fullPdfUrl);
          } else {
            console.log('No PDF found in Curriculum for this course');
            setError('No PDF found in Curriculum for this course.');
          }
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
        const response = await axios.get('http://localhost:8080/curriculum');
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
useEffect(() => {
    console.log('PDF URL:', pdfUrl); // Log pdfUrl whenever it changes
  }, [pdfUrl]);

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

  // Download PDF function
  const downloadPdf = () => {
    if (!faq || faq.length === 0) {
      alert('No curriculum found for this course.');
      return;
    }
  
    // Search for the first curriculum entry with a valid PDF URL
    const curriculumWithPdf = faq.find(item => item.curriculum_pdf);
  
    if (curriculumWithPdf) {
      const pdfUrl = `http://localhost:8080/curriculum/${curriculumWithPdf.curriculum_pdf}`;
  
      // Trigger download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', curriculumWithPdf.curriculum_pdf.split('/').pop());
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('No brochure available for this course.');
    }
  };
  
  const renderTopics = () => {
    const visibleFaq = showMore ? faq : faq.slice(0, 5);

    return visibleFaq.map((item, index) => (
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
          <ul className="bullet-list" dangerouslySetInnerHTML={{ __html: item.topic }} />

          <div className="video-buttons">
    {item.link &&
        item.link.split('\n').map((videoLink, i) => {
            const validUrl = videoLink.trim().startsWith('http')
                ? videoLink.trim()
                : `https://${videoLink.trim()}`;

            return (
                <button
                    key={i}
                    className="play-btn"
                    onClick={() => window.open(validUrl, '_blank', 'noopener,noreferrer')}
                    title="Watch Video"
                >
                    <div className="play-icon-btn">
                        <BsFillPlayCircleFill size={24} color="#00AEEF" />
                    </div>
                    Preview
                </button>
            );
        })}
</div>
          </div>
        )}
      </div>
    ));
  };

   return (
      <div className={`curriculum ${showMore ? 'curriculum-expanded' : ''}`}>
        <div className="curriculum-head">
          <h1 className="qa-heading">{matchedCourseName} Curriculum</h1>
          <button className="btn-curriculum" onClick={downloadPdf}>
            <BsFileEarmarkPdfFill className="btn-pdf-icon" /> Download Brochure
          </button>
        </div>
        <div className="curriculum-topic">
          {faq.length > 0 ? renderTopics() : <p>No Curriculum available for this course.</p>}
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

export default Curriculum;