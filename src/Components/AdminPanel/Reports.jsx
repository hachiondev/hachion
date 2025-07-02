import React, { useState } from 'react';
import './Admin.css';
import CourseQuery from './CourseQuery';
import CorporateQuery from './CorporateQuery';
import JoinedWorkshop from './JoinedWorkshop';
import SummerTraining from './SummerTraining';
import LeadRegistration from './LeadRegistration';
import AdminUnsubscribe from './AdminUnsubscribe';
export default function Reports() {
  const [activeTab, setActiveTab] = useState('courseQuery');
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  return (
    <>   
    <h3>Reports</h3>
      <div className="certificate-tabs">
        <div 
          className={`tab-item ${activeTab === 'courseQuery' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('courseQuery')}
        >
          Course Query
        </div>
        <div 
          className={`tab-item ${activeTab === 'corporateQuery' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('corporateQuery')}
        >
          Corporate Query
        </div>
        <div 
          className={`tab-item ${activeTab === 'joinedWorkshop' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('joinedWorkshop')}
        >
          Joined in Workshop
        </div>
        <div 
          className={`tab-item ${activeTab === 'summerTraining' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('summerTraining')}
        >
          Kids Summer Training
        </div>
        <div 
          className={`tab-item ${activeTab === 'leadRegistration' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('leadRegistration')}
        >
          Leads Registration
        </div>
        <div 
          className={`tab-item ${activeTab === 'adminUnsubscribe' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('adminUnsubscribe')}
        >
          Unsubscribers
        </div>
      </div>
      {activeTab==='courseQuery' &&  <CourseQuery/>}
      {activeTab==='corporateQuery' &&  <CorporateQuery/>}
      {activeTab==='joinedWorkshop' &&  <JoinedWorkshop/>}
      {activeTab==='summerTraining' &&  <SummerTraining/>}
      {activeTab==='leadRegistration' &&  <LeadRegistration/>}
      {activeTab==='adminUnsubscribe' &&  <AdminUnsubscribe/>}
    </>
  );
}