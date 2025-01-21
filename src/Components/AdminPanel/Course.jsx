import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import './Admin.css';
import CourseSchedule from './CourseSchedule';
import Curriculum from './Curriculum';
import Faq from './Faq';
import DemoVideo from './DemoVideo';
import RegularVideo from './RegularVideo';
import VideoAccess from './VideoAccess';
import CourseDetail from './CourseDetail';
import Resume from './Resume';
import Review from './Review';
// Styling the table cells



export default function Course() {
  const [activeTab, setActiveTab] = useState('courseDetails'); // Default tab is Course Details



  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };


  return (
    <>   
      <div className="certificate-tabs">
        {/* Tab Navigation */}
        <div 
          className={`tab-item ${activeTab === 'courseDetails' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('courseDetails')}
        >
          Course Details
        </div>
        <div 
          className={`tab-item ${activeTab === 'schedule' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('schedule')}
        >
          Schedule
        </div>
        <div 
          className={`tab-item ${activeTab === 'curriculum' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('curriculum')}
        >
          Curriculum
        </div>
        <div 
          className={`tab-item ${activeTab === 'faq' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('faq')}
        >
          FAQ
        </div>
        <div 
          className={`tab-item ${activeTab === 'demoVideos' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('demoVideos')}
        >
          Demo Videos
        </div>
        <div 
          className={`tab-item ${activeTab === 'regularVideos' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('regularVideos')}
        >
          Regular Videos
        </div>
        <div 
          className={`tab-item ${activeTab === 'videoAccess' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('videoAccess')}
        >
          Video Access
        </div>
        <div 
          className={`tab-item ${activeTab === 'resume' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('resume')}
        >
          Resume
        </div>
        <div 
          className={`tab-item ${activeTab === 'review' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('review')}
        >
          Review
        </div>
      </div>
      
      {activeTab==='courseDetails' && <CourseDetail/>}
      {activeTab==='schedule' &&  <CourseSchedule/>}
      {activeTab==='curriculum' &&  <Curriculum/>}
      {activeTab==='faq' &&  <Faq/>}
      {activeTab==='demoVideos' &&  <DemoVideo/>}
      {activeTab==='regularVideos' &&  <RegularVideo/>}
      {activeTab==='videoAccess' &&  <VideoAccess/>}
      {activeTab==='resume' &&  <Resume/>}
      {activeTab==='review' &&  <Review/>}
     
    </>
  );
}
