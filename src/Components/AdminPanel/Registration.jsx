import React, { useState } from 'react';
import RegisterList from './RegisterList';
import StudentDetails from './StudentDetails';
import ImportLead from './ImportLead';


export default function Registration() {
  const [activeTab, setActiveTab] = useState('registerlist'); // Default tab is Course Details



  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };


  return (
    <>   
      <div className="certificate-tabs">
        {/* Tab Navigation */}
        <div 
          className={`tab-item ${activeTab === 'registerlist' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('registerlist')}
        >
          Register List
        </div>
        <div 
          className={`tab-item ${activeTab === 'studentdetails' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('studentdetails')}
        >
          Student Details
        </div>
        <div 
          className={`tab-item ${activeTab === 'importlead' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('importlead')}
        >
          Import Lead
        </div>
       
      </div>
      
      {activeTab==='registerlist' && <RegisterList/>}
      {activeTab==='studentdetails' &&  <StudentDetails/>}
      {activeTab==='importlead' &&  <ImportLead/>}
     
     
    </>
  );
}
