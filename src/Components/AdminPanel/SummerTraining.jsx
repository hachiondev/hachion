import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import './Admin.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { IoSearch } from "react-icons/io5";
import axios from 'axios';
import { useState,useEffect } from 'react';
import AdminPagination from './AdminPagination'; 

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


export default function SummerTraining() {
  const [startDate,setStartDate]=useState([]);
  const[endDate,setEndDate]=useState([]);
  const [searchTerm,setSearchTerm]=useState("")
const[message,setMessage]=useState(false);
// const[filteredTraining,setFilteredTraining]=useState([])
const[summerTraining,setSummerTraining]=useState([]);

 const handleDateFilter = () => {
  const filtered = summerTraining.filter((item) => {
    const Date = new Date(item.date); // Parse the date field
    const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
    const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

    return (
      (!start || Date >= start) &&
      (!end || Date <= end)
    );
  });

  setSummerTraining(filtered);
};
const filteredTraining = summerTraining.filter((item) => {
    const date = new Date(item.date);
    const matchesSearch = searchTerm === '' || (
      item.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.emailId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mobileNumber?.toLowerCase().includes(searchTerm.toLowerCase())||
      item.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.interested?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batch?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const inDateRange = (!startDate || date >= new Date(startDate)) &&
                        (!endDate || date <= new Date(endDate));
    return matchesSearch && inDateRange;
  });
// const filteredTraining = summerTraining;

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
        
        const displayedCategories = filteredTraining.slice(
          (currentPage - 1) * rowsPerPage,
          currentPage * rowsPerPage
        );
        console.log("filteredTraining:", filteredTraining);
 
        useEffect(() => {
  axios.get("http://localhost:8080/kids-summer-training")
    .then((response) => {
       console.log("API response:", response.data);
      setSummerTraining(response.data); // Populate data here
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}, []);
console.log("summerTraining:", summerTraining);
console.log("filteredTraining2:", filteredTraining);

  return (
    <>   
    <div>
   <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='course-category'>
       
        <div className='category'>
          <div className='category-header'>
            <p style={{ marginBottom: 0 }}>Kids Summer Training List</p>
          </div>
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
                      <button className='filter' onClick={handleDateFilter} >Filter</button>
                     
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
                <input className="search-input" type="search" placeholder="Enter Courses, Name or Keywords" aria-label="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}/>
                <button className="btn-search" type="submit"  ><IoSearch style={{ fontSize: '2rem' }} /></button>
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
            <StyledTableCell sx={{ width: '50px' }} align='center'>
              <Checkbox />
            </StyledTableCell>
            <StyledTableCell align='center'>S.No.</StyledTableCell>
            <StyledTableCell align='center'>Full Name</StyledTableCell>
            <StyledTableCell align='center'>Email</StyledTableCell>
            <StyledTableCell align='center'>Mobile</StyledTableCell>
            <StyledTableCell align="center">Country</StyledTableCell>
            <StyledTableCell align="center">Course Interested</StyledTableCell>
            <StyledTableCell align="center">Batch Time</StyledTableCell>
            <StyledTableCell align="center">Date</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {displayedCategories.length > 0 ? (
  displayedCategories.map((row, index) => (
    <StyledTableRow key={row.batch_id}>
      <StyledTableCell>
        <Checkbox />
      </StyledTableCell>
      <StyledTableCell align="center">{index + 1}</StyledTableCell>
      <StyledTableCell align="center">{row.fullName}</StyledTableCell>
      <StyledTableCell align="center">{row.email}</StyledTableCell>
      <StyledTableCell align="center">{row.mobileNumber}</StyledTableCell>
      <StyledTableCell align="center">{row.country}</StyledTableCell>
      <StyledTableCell align="center">{row.courseInterested}</StyledTableCell>
      <StyledTableCell align="center">{row.batchTiming}</StyledTableCell>
      
      <StyledTableCell align="center">
  {dayjs(row.date).format('MM-DD-YYYY')}
</StyledTableCell>
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
          totalRows={filteredTraining.length}
          onPageChange={handlePageChange}
        />
                  </div>
        {message && <div className="success-message">{message}</div>}
    
        </div>
     </>
     );
}