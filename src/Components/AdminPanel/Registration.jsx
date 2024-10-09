import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Pagination from '@mui/material/Pagination';
import './Admin.css';
import CourseCategory from './CourseCategory';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#00AEEF',
    color: theme.palette.common.white,
    borderRight: '1px solid white',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderRight: '1px solid #e0e0e0',
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

function createData(S_No, student_name, email, mobile, country, state, location, date, time_zone, status) {
  return { S_No, student_name, email, mobile, country, state, location, date, time_zone, status };
}

const registerlist = [
  createData(1, 'Priti Visara', 'Pritivisa@gmail.com', '201918555', 'United States', 'Massachusetts', 'Mansfield'),
  createData(2, 'Mita Shah', 'rakanmit2000@yahoo.com', '6157011665', 'Bangladesh', null, 'Not Defined'),
  createData(3, 'Manhar', 'Manhartejraj@gmail.com', '6178098765', 'India', null, 'Not Defined'),
];

const studentdetails = [
  createData(1, 'Priti Visara', 'Pritivisa@gmail.com', '201918555', 'United States', null, null, '25-01-2019', 'CET', 'Active'),
  createData(2, 'Mita Shah', 'rakanmit2000@yahoo.com', '6157011665', 'Bangladesh', null, null, '12-5-2023', 'PDT', 'Inactive'),
  createData(3, 'Manhar', 'Manhartejraj@gmail.com', '6178098765', 'India', null, null, '01-04-2021', 'CST', 'Active'),
];

export default function Registration() {
  const [activeTab, setActiveTab] = useState('registerlist'); // Default tab is Register List

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>   
      <div className="certificate-tabs">
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
      <CourseCategory
        pageTitle="Registration"
        headerTitle={activeTab === 'registerlist' ? 'Register List' : activeTab === 'studentdetails' ? 'Student Details' : 'Import Lead'}
        buttonLabel={activeTab === 'importlead' ? 'Upload Leads' : 'Add Student'}
        onAdd={() => {
          console.log('Navigating to Add Student Page');
        }}
      />

      {/* Table Content */}
      {activeTab === 'importlead' ? (
        <div className="import-lead-form">
          <form>
           <div style={{display:'flex',flexDirection:'row',justifyContent:'flex-end',gap:'2vw'}}>
            <p>CSV File Format</p>
            <buttton className='download-btn'>Download</buttton>
           </div>
           <div className='lead-form'>
           <div className="mb-3">
  <label for="formFile" class="form-label">Upload CSV file</label>
  <input class="form-control" type="file" id="formFile"/>
  <p>Note : Upload the Leads carefully using CSV File Format to  upload Multiple Leads.</p>
  <button className='upload-btn'>Upload</button>
</div>
</div>
          </form>
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell><Checkbox /></StyledTableCell>
                <StyledTableCell>S.No.</StyledTableCell>
                {activeTab === 'registerlist' ? (
                  <>
                    <StyledTableCell align="center">Student Name</StyledTableCell>
                    <StyledTableCell align="center">Email</StyledTableCell>
                    <StyledTableCell align="center">Mobile</StyledTableCell>
                    <StyledTableCell align="center">Country</StyledTableCell>
                    <StyledTableCell align="center">State</StyledTableCell>
                    <StyledTableCell align="center">Location</StyledTableCell>
                  </>
                ) : (
                  <>
                    <StyledTableCell align="center">Student Name</StyledTableCell>
                    <StyledTableCell align="center">Email</StyledTableCell>
                    <StyledTableCell align="center">Mobile</StyledTableCell>
                    <StyledTableCell align="center">Country</StyledTableCell>
                    <StyledTableCell align="center">Date</StyledTableCell>
                    <StyledTableCell align="center">Time-zone</StyledTableCell>
                    <StyledTableCell align="center">Status</StyledTableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {(activeTab === 'registerlist' ? registerlist : studentdetails).map((row) => (
                <StyledTableRow key={row.S_No}>
                  <StyledTableCell><Checkbox /></StyledTableCell>
                  <StyledTableCell>{row.S_No}</StyledTableCell>
                  {activeTab === 'registerlist' ? (
                    <>
                      <StyledTableCell align="left">{row.student_name}</StyledTableCell>
                      <StyledTableCell align="left">{row.email}</StyledTableCell>
                      <StyledTableCell align="center">{row.mobile}</StyledTableCell>
                      <StyledTableCell align="center">{row.country}</StyledTableCell>
                      <StyledTableCell align="center">{row.state}</StyledTableCell>
                      <StyledTableCell align="center">{row.location}</StyledTableCell>
                    </>
                  ) : (
                    <>
                      <StyledTableCell align="left">{row.student_name}</StyledTableCell>
                      <StyledTableCell align="left">{row.email}</StyledTableCell>
                      <StyledTableCell align="center">{row.mobile}</StyledTableCell>
                      <StyledTableCell align="center">{row.country}</StyledTableCell>
                      <StyledTableCell align="center">{row.date}</StyledTableCell>
                      <StyledTableCell align="center">{row.time_zone}</StyledTableCell>
                      <StyledTableCell align="center">{row.status}</StyledTableCell>
                    </>
                  )}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {activeTab !== 'importlead' && (
        <div className='pagination'>
          <Pagination count={10} color="primary" />
        </div>
      )}
    </>
  );
}
