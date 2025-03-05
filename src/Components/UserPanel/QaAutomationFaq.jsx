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
   const [pdfUrl, setPdfUrl] = useState(null); 
  const { courseName } = useParams(); // Extract courseName from URL params
  const [matchedCourseName, setMatchedCourseName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Fetch course details to get the correct course_name
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://api.hachion.co/courses/all');
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
          const curriculumResponse = await axios.get('https://api.hachion.co/faq');
          console.log('Curriculum API response:', curriculumResponse.data); // Log the curriculum data
    
          // Normalize both names for reliable comparison
          const matchedCurriculum = curriculumResponse.data.find(
            (item) => item.course_name?.trim().toLowerCase() === matchedCourse.courseName.trim().toLowerCase()
          );
  
          console.log('Matched Curriculum:', matchedCurriculum); // Debugging log
  
          // Set the PDF URL if found
          if (matchedCurriculum && matchedCurriculum.faq_pdf) {
            const fullPdfUrl = `https://api.hachion.co/faq/${matchedCurriculum.faq_pdf}`; // Ensure full URL
            setPdfUrl(fullPdfUrl);
            console.log('PDF URL Set:', fullPdfUrl);
          } else {
            console.log('No PDF found in FAQ for this course');
            setError('No PDF found in FAQ for this course.');
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

        {/* {expandedTopics[index] && (
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
  }; */}

{expandedTopics[index] && (
        <div className="topic-details">
          <div className="quill-content" dangerouslySetInnerHTML={{ __html: item.description }} />
        </div>
      )}
    </div>
  ));
};
 // Download PDF function
 const downloadPdf = () => {
  if (!faq || faq.length === 0) {
    alert('No faq found for this course.');
    return;
  }

  // Search for the first curriculum entry with a valid PDF URL
  const curriculumWithPdf = faq.find(item => item.faq_pdf);

  if (curriculumWithPdf) {
    const pdfUrl = `https://api.hachion.co/faq/${curriculumWithPdf.faq_pdf}`;

    // Trigger download
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', curriculumWithPdf.faq_pdf.split('/').pop());
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    alert('No brochure available for this course.');
  }
};




  return (
    <div className={`curriculum ${showMore ? 'curriculum-expanded' : ''}`}>
      <div className="curriculum-head">
        <h1 className="qa-heading">{matchedCourseName} FAQ's</h1>
        <button className="btn-curriculum" onClick={downloadPdf}>
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