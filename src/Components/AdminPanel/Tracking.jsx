import React, { useState } from 'react';
import './Admin.css';
import StudentTracking from './StudentTracking';
import BatchTracking from './BatchTracking';
export default function Certificate() {
  const [activeTab, setActiveTab] = useState('studentTracking');
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  return (
    <>   
    <h3>Tracking</h3>
      <div className="certificate-tabs">
        <div 
          className={`tab-item ${activeTab === 'studentTracking' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('studentTracking')}
        >
         Student Tracking
        </div>
        <div 
          className={`tab-item ${activeTab === 'batchTracking' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('batchTracking')}
        >
           Batch Tracking
        </div>
      </div>  
      {activeTab==='studentTracking' &&  <StudentTracking/>}
      {activeTab==='batchTracking' &&  <BatchTracking/>}
    </>
  );
}