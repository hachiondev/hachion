import React, { useState } from 'react';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import './Admin.css';
import CourseSchedule from './CourseSchedule';
import Curriculum from './Curriculum';
import Faq from './Faq';
import WorkshopSchedule from './WorkshopSchedule';
import CourseDetail from './CourseDetail';
import Resume from './Resume';
import Review from './Review';
import StudentReview from './StudentReview';
import AdminCoupon from './AdminCoupon';
import AdminTools from './AdminTools';
export default function Course() {
  const [activeTab, setActiveTab] = useState('courseDetails');
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  return (
    <>   
    <h3>Course</h3>
      <div className="certificate-tabs">
        <div 
          className={`tab-item ${activeTab === 'courseDetails' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('courseDetails')}
        >
          Course Details
        </div>
        <div 
          className={`tab-item ${activeTab === 'adminTools' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('adminTools')}
        >
          Tools
        </div>
        <div 
          className={`tab-item ${activeTab === 'adminCoupon' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('adminCoupon')}
        >
          Coupon Code
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
          className={`tab-item ${activeTab === 'workshopschedule' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('workshopschedule')}
        >
          Workshop Schedule
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
        <div 
          className={`tab-item ${activeTab === 'studentreview' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('studentreview')}
        >
         Student Reviews
        </div>
      </div>
      {activeTab==='courseDetails' && <CourseDetail/>}
      {activeTab==='adminTools' &&  <AdminTools/>}
      {activeTab==='adminCoupon' &&  <AdminCoupon/>}
      {activeTab==='schedule' &&  <CourseSchedule/>}
      {activeTab==='curriculum' &&  <Curriculum/>}
      {activeTab==='faq' &&  <Faq/>}
      {activeTab==='workshopschedule' &&  <WorkshopSchedule/>}
      {activeTab==='resume' &&  <Resume/>}
      {activeTab==='review' &&  <Review/>}
      {activeTab==='studentreview' &&  <StudentReview/>}
    </>
  );
}