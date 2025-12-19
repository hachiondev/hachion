import React, { useState } from 'react';
import './Admin.css';
import CourseCertificate from './CourseCertificate';
import GenerateCertificate from './GenerateCertificate';
export default function Certificate() {
  const [activeTab, setActiveTab] = useState('courseCertificate');
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  return (
    <>   
    <h3>Certificates</h3>
      <div className="certificate-tabs">
        <div 
          className={`tab-item ${activeTab === 'courseCertificate' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('courseCertificate')}
        >
         Course Certificate
        </div>
        <div 
          className={`tab-item ${activeTab === 'generateCertificate' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('generateCertificate')}
        >
          Generate Certificate
        </div>
      </div>  
      {activeTab==='courseCertificate' &&  <CourseCertificate/>}
      {activeTab==='generateCertificate' &&  <GenerateCertificate/>}
    </>
  );
}