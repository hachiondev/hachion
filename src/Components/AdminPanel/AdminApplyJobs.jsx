import * as React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { IoSearch } from "react-icons/io5";
import { RiDeleteBin6Line } from 'react-icons/ri';
import axios from 'axios';
import { useState, useEffect } from 'react';
import AdminPagination from './AdminPagination';
import './Admin.css';
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#00AEEF',
    color: theme.palette.common.white,
    borderRight: '1px solid white',
    padding: '3px 5px',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: '3px 4px',
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

export default function AdminApplyJobs() {
  const [jobData, setJobData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
const [deleteMessage, setDeleteMessage] = useState("");
const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    axios.get('https://api.test.hachion.co/apply-job/getAll')
      .then((response) => {
        setJobData(response.data);
        setFilteredData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching job applications:', error);
      });
  }, []);

  const searchedData = filteredData.filter((item) => {
    return (
      searchTerm === '' ||
      [item.jobId, item.studentName, item.email, item.mobileNumber, item.jobTitle, item.companyName, item.date]
        .map(field => (field || '').toLowerCase())
        .some(field => field.includes(searchTerm.toLowerCase()))
    );
  });

  const handleDateFilter = () => {
    const filtered = jobData.filter((item) => {
      const date = new Date(item.date);
      const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
      const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
      return (!start || date >= start) && (!end || date <= end);
    });
    setFilteredData(filtered);
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
  const handleDelete = async (id) => {
  const confirmed = window.confirm("Are you sure you want to delete this application?");
  if (!confirmed) return;

  try {
    await axios.delete(`https://api.test.hachion.co/apply-job/delete/${id}`);
    const updatedData = jobData.filter(item => item.applyJobDetailsId !== id);
    setJobData(updatedData);
    setFilteredData(updatedData);
    setDeleteMessage("Application deleted successfully.");
    setDeleteError("");
  } catch (error) {
    console.error("Error deleting application:", error);
    setDeleteError("Failed to delete the application. Please try again.");
    setDeleteMessage("");
  }

  setTimeout(() => {
    setDeleteMessage("");
    setDeleteError("");
  }, 3000);
};


  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className='course-category'>
          <div className='category-header'><p style={{ marginBottom: 0 }}>Applied Jobs List</p></div>
          <div className='date-schedule'>
            Start Date
            <DatePicker value={startDate} onChange={(date) => setStartDate(date)} sx={{ '& .MuiIconButton-root': { color: '#00aeef' } }} />
            End Date
            <DatePicker value={endDate} onChange={(date) => setEndDate(date)} sx={{ '& .MuiIconButton-root': { color: '#00aeef' } }} />
            <button className='filter' onClick={handleDateFilter}>Filter</button>
            <button className='filter' onClick={handleDateReset}>Reset</button>
          </div>
          <div className='entries'>
            <div className='entries-left'>
              <p style={{ marginBottom: '0' }}>Show</p>
              <div className="btn-group">
                <button type="button" className="btn-number dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                  {rowsPerPage}
                </button>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="#" onClick={() => setRowsPerPage(10)}>10</a></li>
                  <li><a className="dropdown-item" href="#" onClick={() => setRowsPerPage(25)}>25</a></li>
                  <li><a className="dropdown-item" href="#" onClick={() => setRowsPerPage(50)}>50</a></li>
                </ul>
              </div>
              <p style={{ marginBottom: '0' }}>entries</p>
            </div>
            <div className='entries-right'>
              <div className="search-div" role="search" style={{ border: '1px solid #d3d3d3' }}>
                <input className="search-input" type="search" placeholder="Enter Name, Email or Company" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
              <StyledTableCell align="center">Student Name</StyledTableCell>
              <StyledTableCell align="center">Email</StyledTableCell>
              <StyledTableCell align="center">Mobile</StyledTableCell>
              <StyledTableCell align="center">Company Logo</StyledTableCell>
              <StyledTableCell align="center">Company Name</StyledTableCell>
              <StyledTableCell align="center">Job Title</StyledTableCell>
              <StyledTableCell align="center">Resume</StyledTableCell>
              <StyledTableCell align="center">Date</StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedData.length > 0 ? (
              displayedData.map((row, index) => (
                <StyledTableRow key={row.applyJobDetailsId || index}>
                  <StyledTableCell align="center">{(currentPage - 1) * rowsPerPage + index + 1}</StyledTableCell>
                  <StyledTableCell align="center">{row.jobId}</StyledTableCell>
                  <StyledTableCell align="left">{row.studentName}</StyledTableCell>
                  <StyledTableCell align="left">{row.email}</StyledTableCell>
                  <StyledTableCell align="center">{row.mobileNumber}</StyledTableCell>
                  <StyledTableCell align="center">
                    {row.companyLogo ? (
                      <img src={`https://api.test.hachion.co/hire-from-us/${row.companyLogo}`} alt="logo" width="50" />
                    ) : 'No Image'}
                  </StyledTableCell>
                  <StyledTableCell align="left">{row.companyName}</StyledTableCell>
                  <StyledTableCell align="left">{row.jobTitle}</StyledTableCell>
                  <StyledTableCell align="left">
                    {row.resume ? (
                      <a
    href={`https://api.test.hachion.co/apply-job/downloadResume?jobId=${encodeURIComponent(row.jobId)}&email=${encodeURIComponent(row.email)}&resumeFileName=${encodeURIComponent(row.resume)}`}
      target="_blank"
      rel="noopener noreferrer"
>
  View Resume
</a>
                    ) : 'No Resume'}
                  </StyledTableCell>
                  <StyledTableCell align="center">{dayjs(row.date).format('MM-DD-YYYY')}</StyledTableCell>
                  <StyledTableCell align="center">
                    {/* <RiDeleteBin6Line className="delete" /> */}

                    <RiDeleteBin6Line
  className="delete"
  style={{ cursor: 'pointer', color: 'red' }}
  onClick={() => handleDelete(row.applyJobDetailsId)}
/>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={11} align="center">No data available</StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {deleteMessage && <div style={{ color: "green", marginBottom: "10px" }}>{deleteMessage}</div>}
{deleteError && <div style={{ color: "red", marginBottom: "10px" }}>{deleteError}</div>}

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
