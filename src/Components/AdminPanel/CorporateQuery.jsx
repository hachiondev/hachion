import * as React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { IoSearch } from "react-icons/io5";
import axios from 'axios';
import { useState, useEffect } from 'react';
import AdminPagination from './AdminPagination';
import './Admin.css';
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
}));
export default function CorporateQuery() {
  const [queries, setQueries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.hachion.co/advisors');
        setQueries(response.data);
        setFilteredData(response.data);
      } catch (err) {
        console.error("Failed to fetch queries", err.message);
      }
    };
    fetchData();
  }, []);
    const searchedData = filteredData.filter((item) => {
  return (
    searchTerm === '' ||
    [item.studentId, item.fullName, item.emailId, item.mobileNumber, item.date, item.trainingCourse, item.companyName, item.trainingCourse]
      .map(field => (field || '').toLowerCase())
      .some(field => field.includes(searchTerm.toLowerCase()))
  );
});
const handleDateFilter = () => {
  const filtered = queries.filter((item) => {
    const date = new Date(item.date || item.enroll_date);
    const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
    const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
    return (
      (!start || date >= start) &&
      (!end || date <= end)
    );
  });
  setFilteredData(filtered);
};
  const displayedData = searchedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className='course-category'>
          <div className='category-header'><p style={{ marginBottom: 0 }}>Corporate Query</p></div>
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
                  placeholder="Enter Name, Course or Company"
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
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">S.No.</StyledTableCell>
              <StyledTableCell align="center">Full Name</StyledTableCell>
              <StyledTableCell align="center">Company Name</StyledTableCell>
              <StyledTableCell align="center">Email</StyledTableCell>
              <StyledTableCell align="center">Mobile</StyledTableCell>
              <StyledTableCell align="center">Country</StyledTableCell>
              <StyledTableCell align="center">No. of People</StyledTableCell>
              <StyledTableCell align="center">Training Course</StyledTableCell>
              <StyledTableCell align="center">Comment</StyledTableCell>
              <StyledTableCell align="center">Date</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedData.length > 0 ? (
              displayedData.map((row, index) => (
                <StyledTableRow key={row.batch_id || index}>
                  <StyledTableCell align="center">{index + 1}</StyledTableCell>
                  <StyledTableCell align="center">{row.fullName}</StyledTableCell>
                  <StyledTableCell align="center">{row.companyName}</StyledTableCell>
                  <StyledTableCell align="center">{row.emailId}</StyledTableCell>
                  <StyledTableCell align="center">{row.mobileNumber}</StyledTableCell>
                  <StyledTableCell align="center">{row.country || "N/A"}</StyledTableCell>
                  <StyledTableCell align="center">{row.noOfPeople}</StyledTableCell>
                  <StyledTableCell align="center">{row.trainingCourse}</StyledTableCell>
                  <StyledTableCell sx={{ width: "180px",whiteSpace: "pre-wrap" }} align="left">{row.comments}</StyledTableCell>
                  <StyledTableCell align="center">{row.date}</StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={9} align="center">No data available</StyledTableCell>
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
