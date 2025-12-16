import React, { useState, useRef } from 'react';
import './Admin.css';
import CourseQuery from './CourseQuery';
import CorporateQuery from './CorporateQuery';
import JoinedWorkshop from './JoinedWorkshop';
import SummerTraining from './SummerTraining';
import LeadRegistration from './LeadRegistration';
import AdminUnsubscribe from './AdminUnsubscribe';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import AskFaq from './AskFaq';
export default function Reports() {
  const [activeTab, setActiveTab] = useState('courseQuery');
  const tabContainerRef = useRef(null);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
    const scrollTabs = (direction) => {
    if (tabContainerRef.current) {
      const scrollAmount = 150;
      tabContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };
  return (
    <>   
    <h3>Reports</h3>
    <div className="tabs-wrapper">
            <button className="tab-scroll-btn left" onClick={() => scrollTabs('left')}>
              <FaChevronLeft />
            </button>
      <div className="certificate-tabs" ref={tabContainerRef}>
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
          className={`tab-item ${activeTab === 'askFaq' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('askFaq')}
        >
          Ask FAQ
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
      <button className="tab-scroll-btn right" onClick={() => scrollTabs('right')}>
                <FaChevronRight />
              </button>
            </div>
      {activeTab==='courseQuery' &&  <CourseQuery/>}
      {activeTab==='corporateQuery' &&  <CorporateQuery/>}
      {activeTab==='askFaq' &&  <AskFaq/>}
      {activeTab==='joinedWorkshop' &&  <JoinedWorkshop/>}
      {activeTab==='summerTraining' &&  <SummerTraining/>}
      {activeTab==='leadRegistration' &&  <LeadRegistration/>}
      {activeTab==='adminUnsubscribe' &&  <AdminUnsubscribe/>}
    </>
  );
}