import React, { useState, useEffect, useRef } from 'react';
import './Course.css';
import axios from 'axios';
import { BsFileEarmarkPdfFill, BsFillPlayCircleFill } from 'react-icons/bs';
import { FaPlus, FaMinus } from 'react-icons/fa6';
import { useParams } from 'react-router-dom';
import loginPopupImg from '../../Assets/loginpopup.png';
import AssessmentImg from '../../Assets/assesspdf.avif';
import LiveImg from '../../Assets/liveclass.avif';
import logo from '../../Assets/logo.png';
import { Assessment } from '@mui/icons-material';

const Curriculum = () => {
  const [showMore, setShowMore] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState({});
  const [curriculum, setCurriculum] = useState([]);
  const [matchedCourseName, setMatchedCourseName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const modalRef = useRef(null);
  const [showAssessmentLoginPopup, setShowAssessmentLoginPopup] = useState(false);
  const [showEnrollPopup, setShowEnrollPopup] = useState(false);
  const { courseName } = useParams();
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);

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
        const response = await axios.get('https://api.hachion.co/courses/all');
        const courseNameFromUrl = courseName?.toLowerCase()?.replace(/\s+/g, '-');
        const matchedCourse = response.data.find(
          (c) => c.courseName.toLowerCase().replace(/\s+/g, '-') === courseNameFromUrl
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

  useEffect(() => {
    if (!matchedCourseName) return;

    const fetchCurriculum = async () => {
      try {
        const response = await axios.get('https://api.hachion.co/curriculum');
        const filteredCurriculum = response.data.filter(
          (item) => item.course_name && item.course_name.trim().toLowerCase() === matchedCourseName.toLowerCase()
        );
        setCurriculum(filteredCurriculum);
      } catch (error) {
        console.error('Error fetching Curriculum:', error.message);
        setError('Failed to load Curriculum.');
      }
    };

    fetchCurriculum();
  }, [matchedCourseName]);

  const handleViewMore = () => {
    setShowMore(!showMore);
  };

  const handleToggleExpand = (index) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const showLoginModal = () => setIsLoginModalVisible(true);
  const hideLoginModal = () => setIsLoginModalVisible(false);

  const downloadPdf = () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      showLoginModal();
      return;
    }

    if (!curriculum || curriculum.length === 0) {
      alert('No curriculum found for this course.');
      return;
    }

    const userData = JSON.parse(localStorage.getItem('loginuserData'));
    if (!userData) {
      showLoginModal();
      return;
    }

    const curriculumWithPdf = curriculum.find(item => item.curriculum_pdf);
    if (curriculumWithPdf) {
      const fullPdfUrl = `https://api.hachion.co/curriculum/${curriculumWithPdf.curriculum_pdf}`;
      window.open(fullPdfUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert('No brochure available for this course.');
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


const handleDownloadAssessment = async (assessmentPdfPath) => {
  const token = localStorage.getItem('authToken');
  const user = JSON.parse(localStorage.getItem('loginuserData')) || null;

  if (!user || !user.email) {
    const currentPath = window.location.pathname + window.location.search;
    localStorage.setItem('redirectAfterLogin', currentPath);
    setShowAssessmentLoginPopup(true);
    return;
  }

  const userEmail = user.email;
  let studentId = '';

  try {
  
    const profileResponse = await axios.get(`https://api.hachion.co/api/v1/user/myprofile`, {
      params: { email: userEmail },
    });

    if (profileResponse.data && profileResponse.data.studentId) {
      studentId = profileResponse.data.studentId;
    } else {
      setShowEnrollPopup(true);
      return;
    }

  
    const enrollmentResponse = await axios.get(`https://api.hachion.co/enroll/check`, {
      params: {
        studentId: studentId,
        courseName: matchedCourseName,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { isEnrolled } = enrollmentResponse.data;

    if (isEnrolled) {
      const fileName = assessmentPdfPath.split('/').pop();
      const fileUrl = `https://api.hachion.co/curriculum/assessments/${fileName}`;
      window.open(fileUrl, '_blank');
    } else {
      setShowEnrollPopup(true);
    }
  } catch (error) {
    console.error('Error during assessment download flow:', error);
    setShowEnrollPopup(true);
  }
};

  return (
    <div className={`curriculum ${showMore ? 'curriculum-expanded' : ''}`}>
      <div className="curriculum-head">
        <h2 className="qa-heading">{matchedCourseName} Curriculum</h2>
        <button className="btn-curriculum" onClick={downloadPdf}>
          <BsFileEarmarkPdfFill className="btn-pdf-icon" /> Download Brochure
        </button>
      </div>

      <div className="curriculum-topic">
        {curriculum.length > 0 ? (
          curriculum.slice(0, showMore ? curriculum.length : 5).map((item, index) => {
            if (!item.title || !item.topic) return null; 
          
            const videoLinks = item.link
              ? item.link.split('\n').map(link => link.trim()).filter(link => link)
              : [];

            return (
              <div key={index}>
                <div className="curriculum-content" onClick={() => handleToggleExpand(index)}>
                  <p>{item.title}</p>
                  <div className="title-right">
                    <div className="course-row">
                    {videoLinks.length > 0 &&
                      videoLinks.map((videoLink, i) => {
                        const validUrl = videoLink.startsWith('http')
                          ? videoLink
                          : `https://${videoLink}`;
                        return (
                          <button
                            key={i}
                            className="play-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                             setSelectedVideoUrl(validUrl);
                             setVideoModalVisible(true);
                            }}
                          >
                            <BsFillPlayCircleFill size={24} color="#00AEEF" /> Preview
                          </button>
                        );
                      })}

                    {item.assessment_pdf && (
                  <button
                    className="assessment-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadAssessment(item.assessment_pdf);
                    }}
                  >
                    <BsFileEarmarkPdfFill size={24} color="#00AEEF" /> Assessment
                  </button>
                )}

                  </div>
                    <span className="expand-icon">{expandedTopics[index] ? <FaMinus /> : <FaPlus />}</span>
                  </div>
                </div>
                {expandedTopics[index] && (
                  <div className="topic-details">
                    <ul className="bullet-list" dangerouslySetInnerHTML={{ __html: item.topic }} />
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p>No Curriculum available for this course.</p>
        )}
      </div>

      {curriculum.length > 5 && (
        <div className="view-div">
          <button className="view-more-btn" onClick={handleViewMore}>
            {showMore ? 'View Less' : 'View More'}
          </button>
        </div>
      )}

        {showAssessmentLoginPopup && (
        <div className="login-modal">
          <div className="login-modal-content" ref={modalRef}>
            <button className="close-modal-btn" onClick={() => setShowAssessmentLoginPopup(false)}>×</button>
            <h2 className="modal-title">Download Assessment</h2>
            <div className="modal-body-login">
              <div className="modal-left">
                <p>Please log in to download the assessment.</p>
                <button
                  className="login-btn"
                  onClick={() => {
                    localStorage.setItem('redirectAfterLogin', window.location.pathname);
                    window.location.href = '/login';
                  }}
                >
                  Login
                </button>
                <button className="cancel-btn" onClick={() => setShowAssessmentLoginPopup(false)}>Cancel</button>
              </div>
              <div className="modal-right">
                <img src={AssessmentImg} alt="Login Prompt" />
              </div>
            </div>
          </div>
        </div>
      )}

      {videoModalVisible && selectedVideoUrl && (
      <div className="video-modal-overlay" onClick={() => setVideoModalVisible(false)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={selectedVideoUrl.replace("watch?v=", "embed/")}
              title="Video Preview"
              width="100%"
              height="100%"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          <button className="close-modal" onClick={() => setVideoModalVisible(false)}>✕</button>
          </div>
        </div>
    )}

      {showEnrollPopup && (
      <div className="login-modal">
        <div className="login-modal-content" ref={modalRef}>
          <button className="close-modal-btn" onClick={() => setShowEnrollPopup(false)}>×</button>
          <h2 className="modal-title">Enrollment Required</h2>
          <div className="modal-body-login">
            <div className="modal-right">
              <img src={LiveImg} alt="Enroll Prompt" />
            </div>
            <div className="modal-left">
              <p>Please enroll in a <strong>LIVE CLASS</strong> to download the Assessment PDF.</p>
              <button
                className="login-btn"
                onClick={() => {
                  setShowEnrollPopup(false);
                  window.location.href = '/#upcoming-events';
                }}
              >
                Enroll
              </button>
              <button className="cancel-btn" onClick={() => setShowEnrollPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    )}

      {isLoginModalVisible && (
        <div className="login-modal">
          <div className="login-modal-content" ref={modalRef}>
            <img src={logo} alt="logo" className="hlogo" />
            <button className="close-modal-btn" onClick={hideLoginModal}>×</button>
            <h2 className="modal-title">Download Brochure</h2>
            <div className="modal-body-login">
              <div className="modal-left">
                <h4 style={{ color: '#000' }}>Don't miss out!</h4>
                <br />
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

export default Curriculum;
