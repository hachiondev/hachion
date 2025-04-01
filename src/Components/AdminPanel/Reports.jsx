import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import './Admin.css';
import CourseQuery from './CourseQuery';
import CorporateQuery from './CorporateQuery';
import JoinedWorkshop from './JoinedWorkshop';

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


export default function Reports() {
  const [activeTab, setActiveTab] = useState('courseQuery'); // Default tab is Course Details



  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };


  return (
    <>   
    <h3>Reports</h3>
      <div className="certificate-tabs">
        {/* Tab Navigation */}
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
       
      </div>
      
      {activeTab==='courseQuery' &&  <CourseQuery/>}
      {activeTab==='corporateQuery' &&  <CorporateQuery/>}
      {activeTab==='joinedWorkshop' &&  <JoinedWorkshop/>}
     
    </>
  );
}