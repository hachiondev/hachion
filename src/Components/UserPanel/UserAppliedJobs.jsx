import * as React from 'react';
import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { FiDownload } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import dayjs from "dayjs";
import axios from 'axios';
import slugify from 'slugify';
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export default function UserAppliedJobs() {
const [jobData, setJobData] = useState([]);
  const navigate=useNavigate();
  
  const userData = JSON.parse(localStorage.getItem("loginuserData")) || {};
  const userEmail = userData.email || "";

  useEffect(() => {
  if (userEmail) {
    axios.get(`https://api.test.hachion.co/apply-job/by-email?email=${userEmail}`)
      .then((response) => {
        setJobData(response.data);
      })
      .catch((error) => {
        
      });
  }
}, [userEmail]);

  return (
  <>  
   <div className='courses-enrolled'>
   <nav className='dashboard-nav'>
    Applied Jobs</nav>
    </div>
    <div className='resume-div'>
      <div className='resume-div-table'>
      <div className='button-div'>
    <TableContainer component={Paper}>
            <Table className='resume-table' aria-label="customized table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">S.No.</TableCell>
                  <TableCell align="center" >Company Logo</TableCell>
                  <TableCell align="center" >Company Name</TableCell>
                  <TableCell align="center" >Job Title</TableCell>
                  <TableCell align="center" >Job Details</TableCell>
                  <TableCell align="center" >Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
  {jobData.map((row, index) => {
    const isJobAvailable = row.isActive !== false && row.jobTitle; // adjust based on actual API
    const slugifiedTitle = slugify(row.jobTitle || '', { lower: true });

    return (
      <TableRow key={row.id}>
        <TableCell align="center">{index + 1}</TableCell>
        <TableCell align="center">
          {row.companyLogo ? (
            <img
              src={`https://api.test.hachion.co/hire-from-us/${row.companyLogo}`}
              alt="logo"
              width="50"
            />
          ) : 'No Image'}
        </TableCell>
        <TableCell align="left">{row.companyName}</TableCell>
        <TableCell align="left">{row.jobTitle}</TableCell>
        <TableCell align="center">
          {isJobAvailable ? (
            <a
              href={`/career/apply/${slugifiedTitle}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Details
            </a>
          ) : (
            'Not Available'
          )}
        </TableCell>
        <TableCell align="center">{dayjs(row.date).format('MM-DD-YYYY')}</TableCell>
      </TableRow>
    );
  })}
  {jobData.length === 0 && (
    <TableRow>
      <TableCell colSpan={6} align="center">
        No Applied Jobs found.
      </TableCell>
    </TableRow>
  )}
</TableBody>
            </Table>
          </TableContainer>
    </div>
    <div>
    </div>
    </div>
    </div>
    </>

  );
}