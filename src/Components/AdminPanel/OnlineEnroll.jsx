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
import { RiDeleteBin6Line } from 'react-icons/ri';
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

export default function OnlineEnroll() {
  const [enrollData, setEnrollData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [message, setMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  useEffect(() => {
    axios.get("https://api.hachion.co/enroll")
      .then((response) => {
        setEnrollData(response.data);
        setFilteredData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching enrollment data:", error);
      });
  }, []);

  const handleDeleteConfirmation = (id) => {
  const confirmed = window.confirm("Are you sure you want to delete this enrollment?");
  if (confirmed) {
    handleDelete(id);
  }
};

const handleDelete = async (id) => {
  try {
    await axios.delete(`https://api.hachion.co/enroll/delete/${id}`);
    setEnrollData((prev) => prev.filter((item) => item.id !== id));
     setFilteredData((prev) => prev.filter((item) => item.id !== id));
    setSuccessMessage("✅ Enrollment deleted successfully.");
  } catch (error) {
    console.error("Error deleting entry:", error);
  }
};

  // const handleDelete = async (id) => {
  //   try {
  //     await axios.delete(`https://api.hachion.co/enroll/delete/${id}`);
  //     setEnrollData(enrollData.filter((item) => item.id !== id));
  //   } catch (error) {
  //     console.error("Error deleting entry:", error);
  //   }
  // };

const searchedData = filteredData.filter((item) => {
  return (
    searchTerm === '' ||
    [item.batchId, item.studentId, item.name, item.email, item.mobile, item.enroll_date, item.completion_date, item.course_name, item.mode]
      .map(field => (field || '').toLowerCase())
      .some(field => field.includes(searchTerm.toLowerCase()))
  );
});

const handleDateFilter = () => {
  const filtered = enrollData.filter((item) => {
    const enrollDate = new Date(item.date || item.enroll_date);
    const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
    const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
    return (
      (!start || enrollDate >= start) &&
      (!end || enrollDate <= end)
    );
  });
  setFilteredData(filtered);
};
  const handleDateReset = () => {
  setStartDate(null);
  setEndDate(null);
  setFilteredData(enrollData);
};
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const handlePageChange = (page) => {
      setCurrentPage(page);
      window.scrollTo(0, window.scrollY);
    };
    const handleRowsPerPageChange = (rows) => {
      setRowsPerPage(rows);
      setCurrentPage(1);
    };
    const displayedCategories = searchedData.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
  return (
    <>
        <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className='course-category'>
        <div className='category'>
          <div className='category-header'><p style={{ marginBottom: 0 }}>View Online Enrollment List</p></div>
              <div className='date-schedule'>
                Start Date
                <DatePicker
                  value={startDate}
                  onChange={(date) => setStartDate(date)}
                  isClearable
                  sx={{
                    '& .MuiIconButton-root': { color: '#00aeef' }
                  }}
                />
                End Date
                <DatePicker
                  value={endDate}
                  onChange={(date) => setEndDate(date)}
                  isClearable
                  sx={{
                    '& .MuiIconButton-root': { color: '#00aeef' }
                  }}
                />
                <button className='filter' onClick={handleDateFilter}>Filter</button>
              <button className="filter" onClick={handleDateReset}>Reset</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent:'left', padding:'1.5vh', gap: '30' }}>
                <div className='entries-left'>
                  <p style={{ marginBottom: '0' }}>Show</p>
                  <div className="btn-group">
                    <button type="button" className="btn-number dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                      {rowsPerPage}
                    </button>
                    <ul className="dropdown-menu">
                      <li><a className="dropdown-item" href="#!" onClick={() => handleRowsPerPageChange(10)}>10</a></li>
                      <li><a className="dropdown-item" href="#!" onClick={() => handleRowsPerPageChange(25)}>25</a></li>
                      <li><a className="dropdown-item" href="#!" onClick={() => handleRowsPerPageChange(50)}>50</a></li>
                    </ul>
                  </div>
                  <p style={{ marginBottom: '0' }}>entries</p>
                </div>
                <div style={{ display: 'flex', justifyContent:'center', gap: '2vh' }}>
                  <div className="search-div" role="search" style={{ border: '1px solid #d3d3d3' }}>
                    <input
                      className="search-input"
                      type="search"
                      placeholder="Enter Names, Courses, or Mode"
                      aria-label="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn-search" type="submit"><IoSearch style={{ fontSize: '2rem' }} /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </LocalizationProvider>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align='center'><Checkbox /></StyledTableCell>
              <StyledTableCell sx={{ width: 50 }} align='center'>S.No.</StyledTableCell>
              <StyledTableCell align="center">Batch ID</StyledTableCell>
              <StyledTableCell align="center">Student ID</StyledTableCell>
              <StyledTableCell align="center">Student Name</StyledTableCell>
              <StyledTableCell align="center">Email</StyledTableCell>
              <StyledTableCell align="center">Mobile</StyledTableCell>
              <StyledTableCell align="center">Course Name</StyledTableCell>
              <StyledTableCell align="center">Enrollment Date</StyledTableCell>
              <StyledTableCell align="center">Week</StyledTableCell>
              <StyledTableCell align="center">Time</StyledTableCell>
              <StyledTableCell align="center">Mode</StyledTableCell>
              <StyledTableCell align="center">Type</StyledTableCell>
              <StyledTableCell align="center">Trainer</StyledTableCell>
              <StyledTableCell align="center">Completed Date</StyledTableCell>
              <StyledTableCell align="center">Resend email count</StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {displayedCategories.length > 0 ? (
                displayedCategories.map((row, index) => (
                  <StyledTableRow key={row.id}>
                  <StyledTableCell><Checkbox /></StyledTableCell>
                  <StyledTableCell align="center">
                      {index + 1 + (currentPage - 1) * rowsPerPage}
                    </StyledTableCell>
                  <StyledTableCell align="left">{row.batchId}</StyledTableCell>
                  <StyledTableCell align="left">{row.studentId}</StyledTableCell>
                  <StyledTableCell align="left">{row.name}</StyledTableCell>
                  <StyledTableCell align="left">{row.email}</StyledTableCell>
                  <StyledTableCell align="center">{row.mobile}</StyledTableCell>
                  <StyledTableCell align="left">{row.course_name}</StyledTableCell>
                  <StyledTableCell align="center">{row.enroll_date ? dayjs(row.enroll_date).format('MMM-DD-YYYY') : ''}</StyledTableCell>
                  <StyledTableCell align="center">{row.week}</StyledTableCell>
                  <StyledTableCell align="center">{row.time}</StyledTableCell>
                  <StyledTableCell align="center">{row.mode}</StyledTableCell>
                  <StyledTableCell align="center">{row.type}</StyledTableCell>
                  <StyledTableCell align="center">{row.trainer}</StyledTableCell>
                  <StyledTableCell align="center">{row.completion_date ? dayjs(row.completion_date).format('MMM-DD-YYYY'): ''}</StyledTableCell>
                  <StyledTableCell align="center">{row.resendCount}</StyledTableCell>
                  <StyledTableCell align="center">
                    <RiDeleteBin6Line
                      className="delete"
                      onClick={() => handleDeleteConfirmation(row.id)}
                      style={{ cursor: "pointer", color: "red" }}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={15} align="center">No data available</StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
{successMessage && <div style={{ color: "green" }}>{successMessage}</div>}
      <div className='pagination-container'>
        <AdminPagination
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalRows={filteredData.length}
          onPageChange={handlePageChange}
          />
          </div>
          {message && <div className="success-message">{message}</div>}
        </div>
      </>
    );
  };