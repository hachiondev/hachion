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
import { FiPlus } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import axios from 'axios';
import { useState,useEffect } from 'react';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#00AEEF',
    color: theme.palette.common.white,
    borderRight: '1px solid white', // Add vertical lines
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
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
  const [startDate,setStartDate]=useState([]);
  const[endDate,setEndDate]=useState([]);
  const [searchTerm,setSearchTerm]=useState("")
const[requestBatch,setRequestBatch]=useState([]);
  useEffect(() => {
    const fetchRequestBatch = async () => {
        try {
            const response = await axios.get('https://api.hachion.co/requestbatch');
            setRequestBatch(response.data);
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
   const response = await axios.delete(`https://api.hachion.co/requestbatch/delete/${batch_id}`); 
   console.log("Request batch Deleting Successfully:", response.data); 
 } catch (error) { 
   console.error("Error deleting batch:", error); 
 } }; 
 const handleDateFilter = () => {
  const filtered = requestBatch.filter((item) => {
    const Date = new Date(item.date); // Parse the date field
    const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
    const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

    return (
      (!start || Date >= start) &&
      (!end || Date <= end)
    );
  });

  setRequestBatch(filtered);
};
 
  return (
    <>   
    <div>
   <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='course-category'>
       
        <div className='category'>
          <div className='category-header'>
            <p>Schedule Request</p>
          </div>
          <div className='date-schedule'>
            Start Date
            <DatePicker 
    selected={startDate} 
    onChange={(date) => setStartDate(date)} 
    isClearable />
            End Date
            <DatePicker 
    selected={endDate} 
    onChange={(date) => setEndDate(date)} 
    isClearable 
  />
            <button className='filter' onClick={handleDateFilter} >Filter</button>
           
          </div>
          <div className='entries'>
            <div className='entries-left'>
              <p>Show</p>
              <div className="btn-group">
                <button type="button" className="btn-number dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                  10
                </button>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="#">1</a></li>
      
                </ul>
              </div>
              <p>entries</p>
            </div>
            <div className='entries-right'>
              <div className="search-div" role="search" style={{ border: '1px solid #d3d3d3' }}>
                <input className="search-input" type="search" placeholder="Enter Courses, Category or Keywords" aria-label="Search"
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
            <StyledTableCell>
              <Checkbox />
            </StyledTableCell>
            <StyledTableCell align='center'>S.No.</StyledTableCell>
            <StyledTableCell align='center'>Email</StyledTableCell>
            <StyledTableCell align='center'>Mobile</StyledTableCell>
            <StyledTableCell align="center">Country</StyledTableCell>
            <StyledTableCell align="center">Course Name</StyledTableCell>
            <StyledTableCell align="center">Schedule Date</StyledTableCell>
            <StyledTableCell align="center">Time Zone</StyledTableCell>
            <StyledTableCell align="center">Mode</StyledTableCell>
            {/* <StyledTableCell align="center">Action</StyledTableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
  {requestBatch.map((row, index) => (
    <StyledTableRow key={row.batch_id}>
      <StyledTableCell>
        <Checkbox />
      </StyledTableCell>
      <StyledTableCell align="center">{index + 1}</StyledTableCell> {/* S.No. */}
      <StyledTableCell align="center">{row.email}</StyledTableCell>
      <StyledTableCell align="center">{row.mobile}</StyledTableCell>
      <StyledTableCell align="center">{row.country}</StyledTableCell>
      <StyledTableCell align="center">{row.courseName}</StyledTableCell>
      <StyledTableCell align="center">{row.schedule_date}</StyledTableCell>
      <StyledTableCell align="center">{row.time_zone}</StyledTableCell>
      <StyledTableCell align="center">{row.mode}</StyledTableCell>
   
      {/* <StyledTableCell align="center">
       
        <RiDeleteBin6Line className="delete" onClick={() => handleDeleteConfirmation(row.batch_id)} />
      </StyledTableCell> */}
    </StyledTableRow>
  ))}
</TableBody>
    </Table>
    </TableContainer>
      </div>
 </> );
}