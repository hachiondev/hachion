import React, { useState } from 'react';
import './Course.css';
// import icon from '../../Assets/image 130.png';
// import icon2 from '../../Assets/image 131.png';
import InterviewPreparation from './InterviewPreparation';
import JobAssistance from './JobAssistance';
import ProfileBuilding from './ProfileBuilding';

const CareerSupport = () => {
  const [activeTab, setActiveTab] = useState('Profile Building');

  const renderContent = () => {
    switch(activeTab) {
      case 'Interview Preparation':
        console.log('Active Tab: Interview Preparation');
        return <InterviewPreparation />;
      case 'Job Assistance':
        console.log('Active Tab: Job Assistance');
        return <JobAssistance />;
      default:
        console.log('Active Tab: Profile Building');
        return <ProfileBuilding />;
    }
  };

  return (
    <>
      <div className='career-support'>
        <h1 className='career-support-head'>Career Support</h1>
        <div className='batch-type'>
          <p 
            className={`batch-type-content ${activeTab === 'Profile Building' ? 'active' : ''}`}
            onClick={() => {
              console.log('Profile Building tab clicked');
              setActiveTab('Profile Building');
            }}
          >
            Profile Building
          </p>
          <p 
            className={`batch-type-content ${activeTab === 'Interview Preparation' ? 'active' : ''}`}
            onClick={() => {
              console.log('Interview Preparation tab clicked');
              setActiveTab('Interview Preparation');
            }}
          >
            Interview Preparation
          </p>
          <p 
            className={`batch-type-content ${activeTab === 'Job Assistance' ? 'active' : ''}`}
            onClick={() => {
              console.log('Job Assistance tab clicked');
              setActiveTab('Job Assistance');
            }}
          >
            Job Assistance
          </p>
        </div>

        {/* Conditionally render content */}
        {renderContent()}

      
      </div>
    </>
  );
}

export default CareerSupport;
