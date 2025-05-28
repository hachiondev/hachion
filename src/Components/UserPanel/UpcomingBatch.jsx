import React, { useState,useEffect } from 'react';
import calendar from '../../Assets/calendar.png';
import './Course.css';
import { useParams } from 'react-router-dom';
import LiveOnlineFees from './LiveOnlineFees';
import CorporateFees from './CorporateFees';
import MentoringModeFees from './MentoringModeFees';
import SelfPlacedFees from './SelfPlacedFees';
import RequestBatch from './RequestBatch'; // Import the RequestBatch component
import axios from 'axios';

const UpcomingBatch = () => {
  const [activeComponent, setActiveComponent] = useState('LiveOnlineFees');
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal visibility
const {courseName}= useParams();
  const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
    const [course, setCourse] = useState(null);

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
            className='batch-type-content' 
            onClick={() => setActiveComponent('LiveOnlineFees')}
          >
            Live online training
          </p>
          <p 
            className='batch-type-content' 
            onClick={() => setActiveComponent('MentoringModeFees')}
          >
            Mentoring mode
          </p>
          <p 
            className='batch-type-content' 
            onClick={() => setActiveComponent('SelfPlacedFees')}
          >
            Self-paced Learning
          </p>
          <p 
            className='batch-type-content' 
            onClick={() => setActiveComponent('CorporateFees')}
          >
            Corporate Training
          </p>
        </div>

        <div className='batch-content-background'>
          {/* Render the selected batch type */}
          {renderComponent()}

          {/* Request Batch link, only visible for LiveOnlineFees */}
          {activeComponent === 'LiveOnlineFees' && (
            <p className='schedule'>
              <img src={calendar} alt='calendar' />
              Schedule your way? 
              <span 
                className='schedule-span' 
                onClick={() => setIsModalOpen(true)} 
                style={{ cursor: 'pointer', color: 'blue' }}
              >
                Request Batch
              </span>
            </p>
          )}
        </div>
      </div>

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