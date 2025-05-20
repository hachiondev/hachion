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

export default function OnlineEnroll() {
  const [enrollData, setEnrollData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [message, setMessage] = useState(false);

  useEffect(() => {
    axios.get("https://api.test.hachion.co/enroll")
      .then((response) => {
        setEnrollData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching enrollment data:", error);
      });
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://api.test.hachion.co/enroll/delete/${id}`);
      setEnrollData(enrollData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  const filteredData = enrollData.filter((item) => {
    const date = new Date(item.date || item.enroll_date);
    const matchesSearch =
      searchTerm === '' ||
      [item.name, item.course_name, item.mode]
        .map(field => (field || '').toLowerCase())
        .some(field => field.includes(searchTerm.toLowerCase()));
    const inDateRange =
      (!startDate || date >= new Date(startDate)) &&
      (!endDate || date <= new Date(endDate));
    return matchesSearch && inDateRange;
  });

  const handleDateFilter = () => {
      const filtered = enrollData.filter((item) => {
        const date = new Date(item.date);
        const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
        const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
        return (
          (!start || date >= start) &&
          (!end || date <= end)
        );
      });
      setEnrollData(filtered);
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
    const displayedCategories = filteredData.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
  return (
    <>
        <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className='course-category'>
        <div className='category'>
          <div className='category-header'><p>View Online Enrollment List</p></div>
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
              </div>
              <div className='entries'>
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
                <div className='entries-right'>
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
                      onClick={() => handleDelete(row.id)}
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