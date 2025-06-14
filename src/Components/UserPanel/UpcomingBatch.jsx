import React, { useState,useEffect } from 'react';
import calendar from '../../Assets/calendar.png';
import './Course.css';
import { useParams } from 'react-router-dom';
import LiveOnlineFees from './LiveOnlineFees';
import CorporateFees from './CorporateFees';
// import CrashCourseFee from './CrashCourseFee';
import MentoringModeFees from './MentoringModeFees';
import SelfPlacedFees from './SelfPlacedFees';
import RequestBatch from './RequestBatch';
import axios from 'axios';
import loginPopupImg from '../../Assets/loginpopup.png';

const UpcomingBatch = () => {
  const [activeComponent, setActiveComponent] = useState('LiveOnlineFees');
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal visibility
  const {courseName}= useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [course, setCourse] = useState(null);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const handleRequestBatchClick = () => {
    const user = JSON.parse(localStorage.getItem('loginuserData'));
    if (user) {
      setIsModalOpen(true);
    } else {
      setIsLoginModalVisible(true);
    }
  };

  const hideLoginModal = () => {
    setIsLoginModalVisible(false);
  };

useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://api.hachion.co/courses/all');
        const courseData = response.data.find(
          (c) => c.courseName.toLowerCase().replace(/\s+/g, '-') === courseName
        );
        setCourse(courseData);
      } catch (error) {
        console.error('Error fetching course details:', error);
      }finally {
              setLoading(false);
    }
  }

    fetchCourse();
  }, [courseName]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  const renderComponent = () => {
    switch (activeComponent) {
      case 'LiveOnlineFees':
        return <LiveOnlineFees />;
      // case 'CrashCourseFee':
      //   return <CrashCourseFee />;
      case 'CorporateFees':
        return <CorporateFees />;
      case 'MentoringModeFees':
        return <MentoringModeFees />;
      case 'SelfPlacedFees':
        return <SelfPlacedFees />;
      default:
        return <LiveOnlineFees />;
    }
  };


  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className='upcoming-batch'>
        <h1 className='qa-heading'>Upcoming Batches for {course.courseName}</h1>
        <div className='batch-type'>
          <p 
            className={`batch-type-content ${activeComponent === 'LiveOnlineFees' ? 'active' : ''}`} 
            onClick={() => setActiveComponent('LiveOnlineFees')}
          >
            Live training
          </p>
          {/* <p 
            className={`batch-type-content ${activeComponent === 'CrashCourseFee' ? 'active' : ''}`} 
            onClick={() => setActiveComponent('CrashCourseFees')}
          >
            Crash Course
          </p> */}
          <p 
            className={`batch-type-content ${activeComponent === 'MentoringModeFees' ? 'active' : ''}`} 
            onClick={() => setActiveComponent('MentoringModeFees')}
          >
            Mentoring mode
          </p>
          <p 
            className={`batch-type-content ${activeComponent === 'SelfPlacedFees' ? 'active' : ''}`} 
            onClick={() => setActiveComponent('SelfPlacedFees')}
          >
            Self-paced Learning
          </p>
          <p 
            className={`batch-type-content ${activeComponent === 'CorporateFees' ? 'active' : ''}`} 
            onClick={() => setActiveComponent('CorporateFees')}
          >
            Corporate Training
          </p>
        </div>

        <div className='batch-content-background'>
          {/* Render the selected batch type */}
          {renderComponent()}

          {/* Request Batch link, only visible for LiveOnlineFees */}
          {/* {activeComponent === 'LiveOnlineFees' && ( */}
            <p className='schedule'>
              <img src={calendar} alt='calendar' />
              Schedule your way? 
              <span 
                className='schedule-span' 
                onClick={handleRequestBatchClick}
                style={{ cursor: 'pointer', color: 'blue' }}
              >
                Request Batch
              </span>
            </p>
          {/* )} */}
        </div>
      </div>

      {isLoginModalVisible && (
      <div className="login-modal">
        <div className="login-modal-content">
          <button className="close-modal-btn" onClick={hideLoginModal}>×</button>
          <h2 className="modal-title">Login Required</h2>
          <div className="modal-body-login">
            <div className="modal-left">
              <p>Log in to the <span className="web-name">Hachion website</span> to request a custom batch.</p>
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

      {isModalOpen && (
        <div className="modal-request">
          <div className="modal-request-content">
            <button 
              className="btn-close" 
              onClick={handleCloseModal} 
              style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '1.5rem', cursor: 'pointer' }}
            >
              &times;
            </button>
            <RequestBatch closeModal={handleCloseModal} />
          </div>
        </div>
      )}
    </>
  );
};

export default UpcomingBatch;