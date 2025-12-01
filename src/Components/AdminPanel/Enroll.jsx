import React, { useState } from 'react';
import './Admin.css';
import OnlineEnroll from './OnlineEnroll';
import OfflineEnroll from './OfflineEnroll';
export default function Enroll() {
  const [activeTab, setActiveTab] = useState('onlineEnroll');
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  return (
    <>   
    <h3>All Enrollments</h3>
      <div className="certificate-tabs">
        <div 
          className={`tab-item ${activeTab === 'onlineEnroll' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('onlineEnroll')}
        >
         Online Enrollment
        </div>
        <div 
          className={`tab-item ${activeTab === 'offlineEnroll' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('offlineEnroll')}
        >
          Offline Enrollment
        </div>
      </div>  
      {activeTab==='onlineEnroll' &&  <OnlineEnroll/>}
      {activeTab==='offlineEnroll' &&  <OfflineEnroll/>}
    </>
  );
}