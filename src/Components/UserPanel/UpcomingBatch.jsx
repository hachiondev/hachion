import React, { useState } from 'react';
import { FcCalendar } from 'react-icons/fc';
import './Course.css';
import LiveOnlineFees from './LiveOnlineFees';
import CorporateFees from './CorporateFees';
import MentoringModeFees from './MentoringModeFees';
import SelfPlacedFees from './SelfPlacedFees';
import RequestBatch from './RequestBatch'; // Import the RequestBatch component

const UpcomingBatch = () => {
  const [activeComponent, setActiveComponent] = useState('LiveOnlineFees');
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal visibility

  // Function to render the selected batch component
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
        <p className='qa-heading'>Upcoming Batches for QA Automation Course</p>
        <div className='batch-type'>
          <p className='batch-type-content' onClick={() => setActiveComponent('LiveOnlineFees')}>Live online training</p>
          <p className='batch-type-content' onClick={() => setActiveComponent('MentoringModeFees')}>Mentoring mode</p>
          <p className='batch-type-content' onClick={() => setActiveComponent('SelfPlacedFees')}>Self-placed Learning</p>
          <p className='batch-type-content' onClick={() => setActiveComponent('CorporateFees')}>Corporate Training</p>
        </div>
        
        {/* Render the selected batch type */}
        {renderComponent()}

        {/* Request Batch link */}
        <p className='schedule'>
          <FcCalendar />
          Schedule your way? 
          <span 
            className='schedule-span' 
            onClick={() => setIsModalOpen(true)} 
            style={{ cursor: 'pointer', color: 'blue' }}
          >
            Request Batch
          </span>
        </p>
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