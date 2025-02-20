import React, { useState, useEffect } from 'react';
import './Course.css';
import axios from 'axios';
import { BsFileEarmarkPdfFill } from 'react-icons/bs';
import { FaPlus, FaMinus } from 'react-icons/fa6';
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
    
          // Now fetch the curriculum for the matched course
          const curriculumResponse = await axios.get('https://api.hachion.co/curriculum');
          console.log('Curriculum API response:', curriculumResponse.data); // Log the curriculum data
    
          const matchedCurriculum = curriculumResponse.data.find(
            (item) => item.course_name && item.course_name.trim() === matchedCourse.courseName.trim()
          );
    
          // Check if the PDF URL exists in the matched curriculum
          if (matchedCurriculum && matchedCurriculum.curriculum_pdf) {
            setPdfUrl(matchedCurriculum.curriculum_pdf); // Set PDF URL from the curriculum API
          } else {
            console.log('No PDF found in curriculum for this course');
            setError('No PDF found in curriculum for this course.');
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
        const response = await axios.get('https://api.hachion.co/curriculum');
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
    if (!pdfUrl) {
      alert("No PDF available for download. Please contact trainings@hachion.co");
      console.error('No PDF URL available.');
      return;
    }
  
    try {
      // Decode the base64 string
      const pdfBlob = new Blob([new Uint8Array(atob(pdfUrl.split(',')[1]).split('').map(char => char.charCodeAt(0)))], { type: 'application/pdf' });
  
      // Create a link element
      const link = document.createElement('a');
      link.href = URL.createObjectURL(pdfBlob);
      link.setAttribute('download', `${matchedCourseName}_Curriculum.pdf`); // Set the filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
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