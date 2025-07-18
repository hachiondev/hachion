import * as React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { IoSearch } from "react-icons/io5";
import axios from 'axios';
import { useState, useEffect } from 'react';
import AdminPagination from './AdminPagination';
import { FaCheckCircle } from 'react-icons/fa';
import { RiCloseCircleLine } from 'react-icons/ri';
import './Admin.css';
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#00AEEF',
        color: theme.palette.common.white,
        borderRight: '1px solid white', // Add vertical lines
        padding: '3px 5px',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        padding: '3px 4px',
        borderRight: '1px solid #e0e0e0', // Add vertical lines for body rows
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
export default function AdminPostJob() {
    const [jobData, setJobData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filteredData, setFilteredData] = useState([]);

    // const filteredData = jobData.filter((item) => {
    //     const date = new Date(item.date || item.post_date);
    //     const matchesSearch =
    //       searchTerm === '' ||
    //       [item.name, item.email, item.mobileNumber, item.jobTitle, item.salary, item.company, item.companyUrl, item.date]
    //         .map(field => (field || '').toLowerCase())
    //         .some(field => field.includes(searchTerm.toLowerCase()));
    //     const inDateRange =
    //       (!startDate || date >= new Date(startDate)) &&
    //       (!endDate || date <= new Date(endDate));
    //     return matchesSearch && inDateRange;
    //   });

// [item.jobId, `${item.firstName} ${item.lastName}`, item.email, item.mobileNumber, item.jobTitle, item.salary, item.company, item.companyUrl, item.date]


   const searchedData = filteredData.filter((item) => {
  return (
    searchTerm === '' ||
          [item.jobId, item.name, item.email, item.mobileNumber, item.jobTitle, item.salary, item.company, item.companyUrl, item.date]
            .map(field => (field || '').toLowerCase())
            .some(field => field.includes(searchTerm.toLowerCase()))
  );
});
  const handleDateFilter = () => {
  const filtered = jobData.filter((item) => {
    const date = new Date(item.date || item.post_date);
    const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
    const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
    return (
      (!start || date >= start) &&
      (!end || date <= end)
    );
  });
  setJobData(filtered);
};
  const handleDateReset = () => {
  setStartDate(null);
  setEndDate(null);
  setFilteredData(jobData);
};
    
      const displayedData = searchedData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      );

      useEffect(() => {
  const fetchJobs = async () => {
    try {
      const response = await axios.get("https://api.hachion.co/hire-from-us");
      const data = response.data || [];
      console.log("Fetched job data:", data);
      setJobData(data);
      setFilteredData(data);
    } catch (error) {
      console.error("Error fetching job data:", error);
    }
  };

  fetchJobs();
}, []);
const updateStatus = async (jobId, newStatus) => {
  const selectedJob = jobData.find(job => job.jobId === jobId);
  if (!selectedJob) return;

  const payload = {
    ...selectedJob,
    status: newStatus
  };

  try {
    await axios.put("https://api.hachion.co/hire-from-us", payload);
    const updatedJobs = jobData.map(job =>
      job.jobId === jobId ? { ...job, status: newStatus } : job
    );
    setJobData(updatedJobs);
    setFilteredData(updatedJobs);
  } catch (error) {
    console.error("Error updating status:", error);
  }
};


    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div className='course-category'>
                      <div className='category-header'><p style={{ marginBottom: 0 }}>Jobs Posted List</p></div>
                      <div className='date-schedule'>
                                  Start Date
                                  <DatePicker 
                          selected={startDate} 
                          onChange={(date) => setStartDate(date)} 
                          isClearable 
                          sx={{
                            '& .MuiIconButton-root':{color: '#00aeef'}
                        }}/>
                                  End Date
                                  <DatePicker 
                          selected={endDate} 
                          onChange={(date) => setEndDate(date)} 
                          isClearable 
                          sx={{
                            '& .MuiIconButton-root':{color: '#00aeef'}
                        }}
                        />
                          <button className='filter' onClick={handleDateFilter}>Filter</button>
              <button className="filter" onClick={handleDateReset}>Reset</button>
                        </div>
                      <div className='entries'>
                        <div className='entries-left'>
                          <p style={{ marginBottom: '0' }}>Show</p>
                          <div className="btn-group">
                            <button type="button" className="btn-number dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                              {rowsPerPage}
                            </button>
                            <ul className="dropdown-menu">
                              <li><a className="dropdown-item" href="#!" onClick={() => setRowsPerPage(10)}>10</a></li>
                              <li><a className="dropdown-item" href="#!" onClick={() => setRowsPerPage(25)}>25</a></li>
                              <li><a className="dropdown-item" href="#!" onClick={() => setRowsPerPage(50)}>50</a></li>
                            </ul>
                          </div>
                          <p style={{ marginBottom: '0' }}>entries</p>
                        </div>
                        <div className='entries-right'>
                          <div className="search-div" role="search" style={{ border: '1px solid #d3d3d3' }}>
                            <input
                              className="search-input"
                              type="search"
                              placeholder="Enter Name, Email or Company"
                              aria-label="Search"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="btn-search" type="submit">
                              <IoSearch style={{ fontSize: '2rem' }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </LocalizationProvider>
            
                  <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">S.No.</StyledTableCell>
                            <StyledTableCell align="center">Job ID</StyledTableCell>
                            <StyledTableCell align="center">Full Name</StyledTableCell>
                            <StyledTableCell align="center">Email</StyledTableCell>
                            <StyledTableCell align="center">Mobile</StyledTableCell>
                            <StyledTableCell align="center">Company Logo</StyledTableCell>
                            <StyledTableCell align="center">Company Name</StyledTableCell>
                            <StyledTableCell align="center">Company URL</StyledTableCell>
                            <StyledTableCell align="center">Job Title</StyledTableCell>
                            <StyledTableCell align="center">Vacancies</StyledTableCell>
                            <StyledTableCell align="center">Working Days</StyledTableCell>
                            <StyledTableCell align="center">Experiance</StyledTableCell>
                            <StyledTableCell align="center">Salary</StyledTableCell>
                            <StyledTableCell align="center">Location</StyledTableCell>
                            <StyledTableCell align="center">Notice Period</StyledTableCell>
                            <StyledTableCell align="center">EmplType</StyledTableCell>
                            <StyledTableCell align="center">Job Type</StyledTableCell>
                            <StyledTableCell align="center">Description</StyledTableCell>
                            <StyledTableCell align="center">Qualification</StyledTableCell>
                            <StyledTableCell align="center">Date</StyledTableCell>
                            <StyledTableCell align="center">Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {displayedData.length > 0 ? (
              displayedData.map((row, index) => (
                <StyledTableRow key={row.batch_id || index}>
                            <StyledTableCell align="center">{index + 1}</StyledTableCell>
                            <StyledTableCell align="center">{row.jobId}</StyledTableCell>
                            
                            <StyledTableCell align="left">{row.firstName} {row.lastName}</StyledTableCell>

                            <StyledTableCell align="left">{row.email}</StyledTableCell>
                            <StyledTableCell align="center">{row.mobileNumber}</StyledTableCell>
                            <StyledTableCell align="center">{row.companyLogo
                            ? <img src={`https://api.hachion.co/hire-from-us/${row.companyLogo}`} alt="logo" width="50" />
                            : 'No Image'}
                            </StyledTableCell>
                            <StyledTableCell align="left">{row.company}</StyledTableCell>
                            <StyledTableCell align="left">{row.companyUrl}</StyledTableCell>
                            <StyledTableCell align="left">{row.jobTitle}</StyledTableCell>
                            <StyledTableCell align="center">{row.vacancies}</StyledTableCell>
                            <StyledTableCell align="left">{row.workDays}</StyledTableCell>
                            <StyledTableCell align="center">{row.experience}</StyledTableCell>
                            <StyledTableCell align="center">{row.salary}</StyledTableCell>
                            <StyledTableCell align="center">{row.location}</StyledTableCell>
                            <StyledTableCell align="center">{row.noticePeriod}</StyledTableCell>
                            <StyledTableCell align="left">{row.employmentType}</StyledTableCell>
                            <StyledTableCell align="left">{row.jobType}</StyledTableCell>
                            <StyledTableCell align="left">{row.description}</StyledTableCell>
                            <StyledTableCell align="left">{row.qualification}</StyledTableCell>
                            <StyledTableCell align="center">{dayjs(row.date).format('MMM-DD-YYYY')}</StyledTableCell>
                <StyledTableCell align="center">
  <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
    {row.status === 'approved' ? (
      <span className="approved">Approved</span>
    ) : row.status === 'rejected' ? (
      <span className="rejected">Rejected</span>
    ) : (
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <FaCheckCircle
          className="approve"
          style={{ cursor: 'pointer', color: 'green' }}
          onClick={() => updateStatus(row.jobId, 'approved')}
        />
        <RiCloseCircleLine
          className="reject"
          style={{ cursor: 'pointer', color: 'red' }}
          onClick={() => updateStatus(row.jobId, 'rejected')}
        />
      </div>
    )}
  </div>
</StyledTableCell>

                            </StyledTableRow>
                                          ))
                                        ) : (
                                          <StyledTableRow>
                                            <StyledTableCell colSpan={21} align="center">No data available</StyledTableCell>
                                          </StyledTableRow>
                                        )}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                            
                                  <div className='pagination-container'>
                                    <AdminPagination
                                      currentPage={currentPage}
                                      rowsPerPage={rowsPerPage}
                                      totalRows={filteredData.length}
                                      onPageChange={setCurrentPage}
                                    />
                                  </div>
                                </>
                              );
                            }
                            