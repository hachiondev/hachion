import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import './Admin.css';
import CourseSchedule from './CourseSchedule';
import CourseCertificate from './CourseCertificate';
import CandidateCertificate from './CandidateCertificate';

// Styling the table cells



export default function Course() {
  const [activeTab, setActiveTab] = useState('courseCertificate'); // Default tab is Course Details



  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };


  return (
    <>   <h3>Certificate</h3>
      <div className="certificate-tabs">
        {/* Tab Navigation */}
        <div 
          className={`tab-item ${activeTab === 'courseCertificate' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('courseCertificate')}
        >
          Course Certificate
        </div>
        <div 
          className={`tab-item ${activeTab === 'candidateCertificate' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('candidateCertificate')}
        >
          Candidate Certificate
        </div>
      
      </div>
      
      {activeTab==='courseCertificate' && <CourseCertificate/>}
      {activeTab==='candidateCertificate' &&  <CandidateCertificate/>}
   
     
    </>
  );
}
