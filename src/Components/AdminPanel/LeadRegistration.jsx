import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './Admin.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { IoSearch } from "react-icons/io5";
import { useState, useEffect } from 'react';
import AdminPagination from './AdminPagination';
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

export default function LeadRegistration() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState(false);
  const [leadRegistration, setLeadRegistration] = useState([]);
  const [allLeads, setAllLeads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

 const handleDateFilter = () => {
    const filtered = allLeads.filter((item) => {
      const itemDate = dayjs(item.date);
      return (
        (!startDate || itemDate.isAfter(dayjs(startDate).subtract(1, 'day'))) &&
        (!endDate || itemDate.isBefore(dayjs(endDate).add(1, 'day')))
      );
    });
    setLeadRegistration(filtered);
  };

  const handleDateReset = () => {
    setStartDate(null);
    setEndDate(null);
    setLeadRegistration(allLeads);
  };

  const filteredLead = leadRegistration.filter((item) => {
    const itemDate = dayjs(item.date);
    const matchesSearch =
      searchTerm === '' ||
      item.marketerId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.marketerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.emailId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mobileNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.interested?.toLowerCase().includes(searchTerm.toLowerCase());

    const inDateRange =
      (!startDate || itemDate.isAfter(dayjs(startDate).subtract(1, 'day'))) &&
      (!endDate || itemDate.isBefore(dayjs(endDate).add(1, 'day')));

    return matchesSearch && inDateRange;
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, window.scrollY);
  };

  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  const displayedCategories = filteredLead.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <>
      <div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className='course-category'>
            <div className='category'>
              <div className='category-header'>
                <p style={{ marginBottom: 0 }}>Leads Registration List</p>
              </div>
              <div className="date-schedule">
                Start Date
                <DatePicker
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  sx={{ '& .MuiIconButton-root': { color: '#00aeef' } }}
                />
                End Date
                <DatePicker
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  sx={{ '& .MuiIconButton-root': { color: '#00aeef' } }}
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
                      placeholder="Enter Courses, Name or Keywords"
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
          </div>
        </LocalizationProvider>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell sx={{ width: 50 }} align='center'>S.No.</StyledTableCell>
                <StyledTableCell sx={{ width: 120 }} align="center">Reference ID</StyledTableCell>
                <StyledTableCell sx={{ width: 180 }} align="center">Marketer Name</StyledTableCell>
                <StyledTableCell align='center'>Full Name</StyledTableCell>
                <StyledTableCell align='center'>Email</StyledTableCell>
                <StyledTableCell align='center'>Mobile</StyledTableCell>
                <StyledTableCell align="center">Course Interested</StyledTableCell>
                <StyledTableCell sx={{ width: 100 }} align="center">Date</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedCategories.length > 0 ? (
                displayedCategories.map((row, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell align="center">{index + 1}</StyledTableCell>
                    <StyledTableCell align="center">{row.marketerId}</StyledTableCell>
                    <StyledTableCell align="center">{row.marketerName}</StyledTableCell>
                    <StyledTableCell align="left">{row.fullName}</StyledTableCell>
                    <StyledTableCell align="left">{row.emailId}</StyledTableCell>
                    <StyledTableCell align="center">{row.mobileNumber}</StyledTableCell>
                    <StyledTableCell align="left">{row.interested}</StyledTableCell>
                    <StyledTableCell align="center">{dayjs(row.date).format('MM-DD-YYYY')}</StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <StyledTableCell colSpan={8} align="center">
                    No Data available
                  </StyledTableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <div className='pagination-container'>
          <AdminPagination
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            totalRows={filteredLead.length}
            onPageChange={handlePageChange}
          />
        </div>

        {message && <div className="success-message">{message}</div>}
      </div>
    </>
  );
}