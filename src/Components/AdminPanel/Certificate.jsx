import React, { useState } from 'react';
import './Admin.css';
import CourseCertificate from './CourseCertificate';
import CandidateCertificate from './CandidateCertificate';
export default function Course() {
  const [activeTab, setActiveTab] = useState('courseCertificate');
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const renderTabContent = () => {
    switch (activeTab) {
      case 'courseCertificate':
        return <CourseCertificate />;
      case 'candidateCertificate':
        return <CandidateCertificate />;
      default:
        return null;
    }
  };
  return (
    <>
      <h3>Certificate</h3>
      <div className="certificate-tabs">
        <div
          className={`tab-item ${activeTab === 'courseCertificate' ? 'active' : ''}`}
          onClick={() => handleTabChange('courseCertificate')}
        >
          Course Certificate
        </div>
        <div
          className={`tab-item ${activeTab === 'candidateCertificate' ? 'active' : ''}`}
          onClick={() => handleTabChange('candidateCertificate')}
        >
          Candidate Certificate
        </div>
      </div>
      <div className="tab-content">{renderTabContent()}</div>
    </>
  );
}