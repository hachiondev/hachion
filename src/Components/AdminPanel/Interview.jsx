import React, { useState, useRef } from 'react';
import './Admin.css';
import InterviewAdminResponses from './InterviewAdminResponses';
import InterviewAdminReviews from './InterviewAdminReviews';
import InterviewTemplate from './InterviewTemplate';
import InterviewAssignment from './InterviewAssignment';
import InterviewQuestionsList from './InterviewQuestionsList';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Interview() {
  const [activeTab, setActiveTab] = useState('interviewTemplate');
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
      <h3>Interview</h3>

      <div className="tabs-wrapper">
        <button className="tab-scroll-btn left" onClick={() => scrollTabs('left')}>
          <FaChevronLeft />
        </button>

        <div className="certificate-tabs" ref={tabContainerRef}>
          <div
            className={`tab-item ${activeTab === 'interviewTemplate' ? 'active-tab' : ''}`}
            onClick={() => handleTabChange('interviewTemplate')}
          >
            Interview Template
          </div>
          <div
            className={`tab-item ${activeTab === 'interviewQuestionsList' ? 'active-tab' : ''}`}
            onClick={() => handleTabChange('interviewQuestionsList')}
          >
            Questions List
          </div>
          <div
            className={`tab-item ${activeTab === 'interviewAssignment' ? 'active-tab' : ''}`}
            onClick={() => handleTabChange('interviewAssignment')}
          >
            Assignment List
          </div>
          <div
            className={`tab-item ${activeTab === 'interviewAdminResponses' ? 'active-tab' : ''}`}
            onClick={() => handleTabChange('interviewAdminResponses')}
          >
            Admin Responses
          </div>
          <div
            className={`tab-item ${activeTab === 'interviewAdminReviews' ? 'active-tab' : ''}`}
            onClick={() => handleTabChange('interviewAdminReviews')}
          >
            Admin Reviews
          </div>
         
        </div>

        <button className="tab-scroll-btn right" onClick={() => scrollTabs('right')}>
          <FaChevronRight />
        </button>
      </div>

      {activeTab === 'interviewTemplate' && <InterviewTemplate />}
      {activeTab === 'interviewQuestionsList' && <InterviewQuestionsList />}
      {activeTab === 'interviewAssignment' && <InterviewAssignment />}
      {activeTab === 'interviewAdminResponses' && <InterviewAdminResponses />}
      {activeTab === 'interviewAdminReviews' && <InterviewAdminReviews />}
     
    </>
  );
}
