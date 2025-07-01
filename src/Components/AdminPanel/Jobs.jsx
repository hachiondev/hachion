import React, { useState } from 'react';
import './Admin.css';
import AdminPostJob from './AdminPostJob';
import AdminApplyJobs from './AdminApplyJobs';
export default function Jobs() {
  const [activeTab, setActiveTab] = useState('adminPostJob');
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  return (
    <>   
    <h3>Jobs</h3>
      <div className="certificate-tabs">
        <div 
          className={`tab-item ${activeTab === 'adminPostJob' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('adminPostJob')}
        >
          Jobs Posted
        </div>
        <div 
          className={`tab-item ${activeTab === 'adminApplyJobs' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('adminApplyJobs')}
        >
          Applied Jobs
        </div>
      </div>
      {activeTab==='adminPostJob' &&  <AdminPostJob/>}
      {activeTab==='adminApplyJobs' &&  <AdminApplyJobs/>}
    </>
  );
}