import * as React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { tableCellClasses } from '@mui/material/TableCell';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { IoSearch } from "react-icons/io5";
import { useState, useEffect } from 'react';
import AdminPagination from './AdminPagination';
import { RiDeleteBin6Line } from 'react-icons/ri';
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
export default function StudentInterests() {
    const [studentInterest, setStudentInterest] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filteredRows, setFilteredRows] = useState([]);

     useEffect(() => {
    const fetchStudentInterests = async () => {
      try {
        const response = await axios.get("https://api.hachion.co/popup-onboarding/getAllOnboarding");
        setStudentInterest(response.data);
        setFilteredRows(response.data);
      } catch (err) {
        console.error("Error fetching student interests:", err);
      }
    };
    fetchStudentInterests();
  }, []);

    const filteredData = studentInterest.filter((item) => {
        const date = new Date(item.date || item.payment_date);
        const matchesSearch =
          searchTerm === '' ||
          [item.name, item.student_ID]
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
       const handleDateFilter = () => {
          const filtered = studentInterest.filter((item) => {
            const itemDate = dayjs(item.date);
            return (
              (!startDate || itemDate.isAfter(dayjs(startDate).subtract(1, 'day'))) &&
              (!endDate || itemDate.isBefore(dayjs(endDate).add(1, 'day')))
            );
          });
          setFilteredRows(filtered);
        };
      
        const handleDateReset = () => {
          setStartDate(null);
          setEndDate(null);
          setFilteredRows(studentInterest);
        };
        useEffect(() => {
        setFilteredRows(studentInterest);
      }, [studentInterest]);
const handleDelete = async (id) => {
  if (window.confirm("Are you sure you want to delete this record?")) {
    try {
      await axios.delete(`https://api.hachion.co/popup-onboarding/${id}`);
      
      const updatedData = studentInterest.filter(item => item.popupOnboardingId !== id);
      setStudentInterest(updatedData);
      setFilteredRows(updatedData);
    } catch (err) {
      console.error("Error deleting record:", err);
      alert("Failed to delete record.");
    }
  }
};

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div className='course-category'>
                       <h3>Student Interests</h3>
                      <div className='category-header'><p style={{ marginBottom: 0 }}>View Student Interests</p></div>
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
                              placeholder="Enter Student ID, Name"
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
                            <StyledTableCell align='center'><Checkbox /></StyledTableCell>
                            <StyledTableCell align='center'>S.No.</StyledTableCell>
                            <StyledTableCell align='center'>Student ID</StyledTableCell>
                            <StyledTableCell align='center'>Student Name</StyledTableCell>
                            <StyledTableCell align='center'>Q1</StyledTableCell>
                            <StyledTableCell align="center">Q2</StyledTableCell>
                            <StyledTableCell align="center">Q3</StyledTableCell>
                            <StyledTableCell align="center">Q4</StyledTableCell>
                            <StyledTableCell align="center">Q5</StyledTableCell>
                            <StyledTableCell align='center'>Q6</StyledTableCell>
                            <StyledTableCell align="center">Q7</StyledTableCell>
                            <StyledTableCell align="center">Q8</StyledTableCell>
                            <StyledTableCell align="center">Q9</StyledTableCell>
                            <StyledTableCell align="center">Q10</StyledTableCell>
                            <StyledTableCell align="center">Q11</StyledTableCell>
                            <StyledTableCell align="center">Created Date </StyledTableCell>
                            <StyledTableCell align="center">Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {displayedData.length > 0 ? (
              displayedData.map((row, index) => (
                <StyledTableRow key={row.batch_id || index}>
                            <StyledTableCell><Checkbox /></StyledTableCell>
                            <StyledTableCell>{index + 1}</StyledTableCell>
                            <StyledTableCell align="center">{row.studentId}</StyledTableCell>
                  <StyledTableCell align="left">{row.studentName}</StyledTableCell>
                  <StyledTableCell align="left">{row.currentRole}</StyledTableCell>
                  <StyledTableCell align="left">{row.primaryGoal}</StyledTableCell>
                  <StyledTableCell align="left">
  {Array.isArray(row.areasOfInterest) ? row.areasOfInterest.join(', ') : row.areasOfInterest}
</StyledTableCell>

<StyledTableCell align="left">
  {Array.isArray(row.preferToLearn) ? row.preferToLearn.join(', ') : row.preferToLearn}
</StyledTableCell>
                  <StyledTableCell align="left">{row.preferredTrainingMode}</StyledTableCell>
                  <StyledTableCell align="left">{row.currentSkill}</StyledTableCell>
                  <StyledTableCell align="left">{row.lookingForJob}</StyledTableCell>
                  <StyledTableCell align="left">{row.realTimeProjects}</StyledTableCell>
                  <StyledTableCell align="left">{row.certificationOrPlacement}</StyledTableCell>
                  <StyledTableCell align="left">{row.speakToCourseAdvisor}</StyledTableCell>
                  <StyledTableCell align="left">{row.whereYouHeard}</StyledTableCell>
                  <StyledTableCell align="center">{row.fillingDate ? dayjs(row.fillingDate).format('MMM-DD-YYYY') : ''}</StyledTableCell>
                                      {/* <StyledTableCell align="center">
                                          <RiDeleteBin6Line className="delete"/>
                                      </StyledTableCell> */}
                                      <StyledTableCell align="center">
  <RiDeleteBin6Line
    className="delete"
    style={{ cursor: 'pointer' }}
    onClick={() => handleDelete(row.popupOnboardingId)}
  />
</StyledTableCell>
                            </StyledTableRow>
                                          ))
                                        ) : (
                                          <StyledTableRow>
                                            <StyledTableCell colSpan={17} align="center">No data available</StyledTableCell>
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
                            