import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import Pagination from '@mui/material/Pagination';
import './Admin.css';
import ManageCourse from './ManageCourse';
import python from '../../Assets/image 90.png';
import profileImage from '../../Assets/Ellipse 18.png';
import { useNavigate } from 'react-router-dom';
import CourseSchedule from './CourseSchedule';
import Curriculum from './Curriculum';
import Faq from './Faq';
import WorkshopSchedule from './WorkshopSchedule';
import DemoVideo from './DemoVideo';
import RegularVideo from './RegularVideo';
import VideoAccess from './VideoAccess';
import CourseDetail from './CourseDetail';
import Resume from './Resume';
import Review from './Review';
// Styling the table cells
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#00AEEF',
    color: theme.palette.common.white,
    borderRight: '1px solid white',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderRight: '1px solid #e0e0e0',
    wordWrap: 'break-word', // Allows text to wrap to the next line
    whiteSpace: 'normal',  // Ensures text breaks onto new lines
    maxWidth: 400,  
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


export default function Course() {
  const [activeTab, setActiveTab] = useState('courseDetails'); // Default tab is Course Details



  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };


  return (
    <>   
    <h3>Course</h3>
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
          className={`tab-item ${activeTab === 'workshopschedule' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('workshopschedule')}
        >
          Workshop Schedule
        </div>
        {/* <div 
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
        </div> */}
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
      {activeTab==='workshopschedule' &&  <WorkshopSchedule/>}
      {/* {activeTab==='demoVideos' &&  <DemoVideo/>}
      {activeTab==='regularVideos' &&  <RegularVideo/>}
      {activeTab==='videoAccess' &&  <VideoAccess/>} */}
      {activeTab==='resume' &&  <Resume/>}
      {activeTab==='review' &&  <Review/>}
     
    </>
  );
}