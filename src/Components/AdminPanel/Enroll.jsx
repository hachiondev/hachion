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

export default function Enroll() {
  const [enrollData, setEnrollData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    axios.get("https://api.hachion.co/enroll")
      .then((response) => {
        setEnrollData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching enrollment data:", error);
      });
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://api.hachion.co/enroll/delete/${id}`);
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

  const displayedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className='course-category'>
          <div className='category-header'><p>All Enrolls</p></div>
          <div className='date-schedule'>
            Start Date
            <DatePicker value={startDate} onChange={setStartDate} />
            End Date
            <DatePicker value={endDate} onChange={setEndDate} />
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
                  placeholder="Enter Name, Course or Mode"
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
              <StyledTableCell><Checkbox /></StyledTableCell>
              <StyledTableCell>S.No.</StyledTableCell>
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
            {displayedData.length > 0 ? (
              displayedData.map((row, index) => (
                <StyledTableRow key={row.batch_id || index}>
                  <StyledTableCell><Checkbox /></StyledTableCell>
                  <StyledTableCell>{(currentPage - 1) * rowsPerPage + index + 1}</StyledTableCell>
                  <StyledTableCell align="left">{row.name}</StyledTableCell>
                  <StyledTableCell align="left">{row.email}</StyledTableCell>
                  <StyledTableCell align="center">{row.mobile}</StyledTableCell>
                  <StyledTableCell align="left">{row.course_name}</StyledTableCell>
                  <StyledTableCell align="center">{row.enroll_date}</StyledTableCell>
                  <StyledTableCell align="center">{row.week}</StyledTableCell>
                  <StyledTableCell align="center">{row.time}</StyledTableCell>
                  <StyledTableCell align="center">{row.mode}</StyledTableCell>
                  <StyledTableCell align="center">{row.type}</StyledTableCell>
                  <StyledTableCell align="center">{row.trainer}</StyledTableCell>
                  <StyledTableCell align="center">{row.completion_date}</StyledTableCell>
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
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}