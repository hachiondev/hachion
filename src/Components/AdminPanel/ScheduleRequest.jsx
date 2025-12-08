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
import { FiPlus } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import axios from 'axios';
import { useState, useEffect } from 'react';
import AdminPagination from './AdminPagination';
import dayjs from 'dayjs';
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

export default function ScheduleRequest() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("")
  const [requestBatch, setRequestBatch] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  useEffect(() => {
    const fetchRequestBatch = async () => {
      try {
        const response = await axios.get('https://api.test.hachion.co/requestbatch');
        setRequestBatch(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching student list:", error.message);
      }
    };
    fetchRequestBatch();

  }, []);
  const handleDeleteConfirmation = (batch_id) => {
    if (window.confirm("Are you sure you want to delete this student batch?")) {
      handleDelete(batch_id);
    }
  };
  const handleDelete = async (batch_id) => {

    try {
      const response = await axios.delete(`https://api.test.hachion.co/requestbatch/delete/${batch_id}`);
      console.log("Request batch Deleting Successfully:", response.data);
    } catch (error) {
      console.error("Error deleting batch:", error);
    }
  };
  const searchedData = filteredData.filter((item) => {
    return (
      searchTerm === '' ||
      [item.courseName, item.schedule_date, item.email, item.mobile, item.mode]
        .map(field => (field || '').toLowerCase())
        .some(field => field.includes(searchTerm.toLowerCase()))
    );
  });
  const handleDateFilter = () => {
    const filtered = requestBatch.filter((item) => {
      const date = new Date(item.date || item.schedule_date);
      const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
      const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
      return (
        (!start || date >= start) &&
        (!end || date <= end)
      );
    });
    setRequestBatch(filtered);
  };
  const handleDateReset = () => {
    setStartDate(null);
    setEndDate(null);
    setFilteredData(requestBatch);
  };
  const displayedData = searchedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <>
      <div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className='course-category'>
            <h3>Schedule Request</h3>
            <div className='category'>
              <div className='category-header'>
                <p style={{ marginBottom: 0 }}>Schedule Request List</p>
              </div>
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
          </div>
        </LocalizationProvider>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align='center'>S.No.</StyledTableCell>
                <StyledTableCell align='center'>Email</StyledTableCell>
                <StyledTableCell align='center'>Mobile</StyledTableCell>
                <StyledTableCell align="center">Country</StyledTableCell>
                <StyledTableCell align="center">Course Name</StyledTableCell>
                <StyledTableCell align="center">Notification</StyledTableCell>
                {/* <StyledTableCell align="center">Schedule Date</StyledTableCell> */}
                <StyledTableCell align="center">Preferred Time</StyledTableCell>
                <StyledTableCell align="center">Preferred Date</StyledTableCell>
                <StyledTableCell align="center">Time</StyledTableCell>
                <StyledTableCell align="center">Mode</StyledTableCell>
                <StyledTableCell align="center">Date</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedData.length > 0 ? (
                displayedData.map((row, index) => (
                  <StyledTableRow key={row.batch_id || index}>
                    <StyledTableCell align="center">{index + 1}</StyledTableCell> {/* S.No. */}
                    <StyledTableCell align="center">{row.email}</StyledTableCell>
                    <StyledTableCell align="center">{row.mobile}</StyledTableCell>
                    <StyledTableCell align="center">{row.country}</StyledTableCell>
                    <StyledTableCell align="center">{row.courseName}</StyledTableCell>
                    <StyledTableCell align="center"></StyledTableCell>
                    <StyledTableCell align="center"></StyledTableCell>
                    <StyledTableCell align="center"></StyledTableCell>
                    {/* <StyledTableCell align="center">{row.schedule_date ? dayjs(row.schedule_date).format('MM-DD-YYYY') : ''}</StyledTableCell> */}
                    <StyledTableCell align="center">{row.time_zone}</StyledTableCell>
                    <StyledTableCell align="center">{row.mode}</StyledTableCell>
                    <StyledTableCell align="center">{row.date ? dayjs(row.date).format('MM-DD-YYYY') : ''}</StyledTableCell>
                    <StyledTableCell align="center">
       
        <RiDeleteBin6Line className="delete" onClick={() => handleDeleteConfirmation(row.batch_id)} />
      </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <StyledTableCell colSpan={8} align="center">No data available</StyledTableCell>
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
      </div>
    </>
  );
}