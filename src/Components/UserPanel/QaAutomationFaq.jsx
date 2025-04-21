import React, { useState, useEffect, useRef } from 'react';
import './Course.css';
import axios from 'axios';
import { BsFileEarmarkPdfFill } from 'react-icons/bs';
import { FaPlus, FaMinus } from 'react-icons/fa6';
import { useParams } from 'react-router-dom';
import loginPopupImg from '../../Assets/loginpopup.png';
import logo from '../../Assets/logo.png';

const QaAutomationFaq = () => {
  const [showMore, setShowMore] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState({});
  const [faq, setFaq] = useState([]);
   const [pdfUrl, setPdfUrl] = useState(null); 
  const { courseName } = useParams(); // Extract courseName from URL params
  const [matchedCourseName, setMatchedCourseName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
    const modalRef = useRef(null);

     useEffect(() => {
        const redirectPath = localStorage.getItem('redirectAfterLogin');
        if (redirectPath) {
          localStorage.removeItem('redirectAfterLogin');
        }
      }, []);  
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/HachionUserDashboad/courses/all');
        console.log('API response:', response.data); 
    
        const courseNameFromUrl = courseName?.toLowerCase()?.replace(/\s+/g, '-');
        console.log('Course name from URL:', courseNameFromUrl);
    
        const matchedCourse = response.data.find(
          (c) => c.courseName.toLowerCase().replace(/\s+/g, '-') === courseNameFromUrl
        );
    
        if (matchedCourse) {
          setMatchedCourseName(matchedCourse.courseName.trim());

          const curriculumResponse = await axios.get('/HachionUserDashboad/faq');
          const matchedCurriculum = curriculumResponse.data.find(
            (item) => item.course_name?.trim().toLowerCase() === matchedCourse.courseName.trim().toLowerCase()
          );
  
          if (matchedCurriculum && matchedCurriculum.faq_pdf) {
            const fullPdfUrl = `/HachionUserDashboad/faq/${matchedCurriculum.faq_pdf}`; // Ensure full URL
            setPdfUrl(fullPdfUrl);
          } else {
    
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
        const response = await axios.get('/HachionUserDashboad/faq');
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
          <div className="quill-content" dangerouslySetInnerHTML={{ __html: item.description }} />
        </div>
      )}
    </div>
  ));
};

const showLoginModal = () => setIsLoginModalVisible(true);
const hideLoginModal = () => setIsLoginModalVisible(false);

const downloadPdf = () => {
  const token = localStorage.getItem('authToken');
  
    if (!token) {
      showLoginModal();
      return;
    }
  if (!faq || faq.length === 0) {
    alert('No faq found for this course.');
    return;
  }

  const curriculumWithPdf = faq.find(item => item.faq_pdf);

  if (curriculumWithPdf) {
    const pdfUrl = `/HachionUserDashboad/faq/${curriculumWithPdf.faq_pdf}`;

    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', curriculumWithPdf.faq_pdf.split('/').pop());
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    alert('No FAQ available for this course.');
  }
};

useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        hideLoginModal();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

      {isLoginModalVisible && (
              <div className="login-modal">
                <div className="login-modal-content" ref={modalRef}>
                <img
              src={logo}
              alt="logo"
              className="hlogo"
            />
                  <button className="close-modal-btn" onClick={hideLoginModal}>×</button>
                  <h2 className="modal-title">Download FAQ's</h2>
                  <div className="modal-body-login">
                    <div className="modal-left">
                    <h4 style={{color: '#000'}}>Don’t miss out!</h4>
                    <br/>
                      <p>Just log in to the <span className="web-name">Hachion website</span> to unlock this feature.</p>
                      <button
                        className="login-btn"
                        onClick={() => {
                          localStorage.setItem('redirectAfterLogin', window.location.pathname);
                          window.location.href = '/login';
                        }}
                      >
                        Login
                      </button>
                      <button className="cancel-btn" onClick={hideLoginModal}>Cancel</button>
                    </div>
                    <div className="modal-right">
                      <img src={loginPopupImg} alt="Login Prompt" />
                    </div>
                  </div>
                </div>
              </div>
            )}
    </div>
  );
};

export default QaAutomationFaq;