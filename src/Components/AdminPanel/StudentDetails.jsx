import  React, { useEffect } from 'react';
import { useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io'
import { duration, styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Pagination from '@mui/material/Pagination';
import './Admin.css';
import dayjs from 'dayjs';
import { RiCloseCircleLine } from 'react-icons/ri';
import success from '../../Assets/success.gif';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { IoSearch } from "react-icons/io5";
import { FiPlus } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { IoMdCloseCircleOutline } from "react-icons/io";
import axios from 'axios';
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
  
const StudentDetails = () => {
const[registerStudent,setRegisterStudent]=useState([]);
 const [startDate, setStartDate] = useState(null);
 const[filteredStudent,setFilteredStudent]=useState([]);
    const [endDate, setEndDate] = useState(null);
    const [searchTerm,setSearchTerm]=useState("")
    useEffect(() => {
      const fetchStudent = async () => {
          try {
              const response = await axios.get('http://localhost:8080/registerstudent');
              setRegisterStudent(response.data); // Use the curriculum state
          } catch (error) {
              console.error("Error fetching student list:", error.message);
          }
      };
      fetchStudent();
     
      setFilteredStudent(registerStudent)
      console.log(registerStudent);
  }, []);
    
const handleDateFilter = () => {
  const filtered = registerStudent.filter((item) => {
    const Date = new Date(item.date); // Parse the date field
    const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
    const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

    return (
      (!start || Date >= start) &&
      (!end || Date <= end)
    );
  });

  setFilteredStudent(filtered);
};
  return (
    <>
    <div>
       <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className='course-category'>
           
            <div className='category'>
              <div className='category-header'>
                <p>Video Access</p>
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
                <button className='filter' onClick={handleDateFilter} >filter</button>
               
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
                <StyledTableCell align='center'>Student Name</StyledTableCell>
                <StyledTableCell align='center'>Email</StyledTableCell>
                <StyledTableCell align="center">Mobile</StyledTableCell>
                <StyledTableCell align="center">Country</StyledTableCell>
                <StyledTableCell align="center">Date</StyledTableCell>
                <StyledTableCell align="center">Time Zone</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center">Course Name</StyledTableCell>
                <StyledTableCell align="center">Live Demo</StyledTableCell>
                <StyledTableCell align="center">Live Class</StyledTableCell>
                <StyledTableCell align="center">Mentoring Mode</StyledTableCell>
                <StyledTableCell align="center">Self Placed</StyledTableCell>
                <StyledTableCell align="center">View Live Demo</StyledTableCell>
                <StyledTableCell align="center">View Live Class</StyledTableCell>
                <StyledTableCell align="center">View Mentoring Mode</StyledTableCell>
                <StyledTableCell align="center">View Self Placed</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
      {registerStudent.map((row, index) => (
        <StyledTableRow key={row.student_id}>
          <StyledTableCell>
            <Checkbox />
          </StyledTableCell>
          <StyledTableCell align="center">{index + 1}</StyledTableCell> {/* S.No. */}
          <StyledTableCell align="center">{row.name}</StyledTableCell>
          <StyledTableCell align="center">{row.email}</StyledTableCell>
          <StyledTableCell align="center">{row.mobile}</StyledTableCell>
          <StyledTableCell align="center">{row.country}</StyledTableCell>
                <StyledTableCell align="center">{row.date}</StyledTableCell>
                <StyledTableCell align="center">{row.time_zone}</StyledTableCell>
                <StyledTableCell align="center">{row.visa_status}</StyledTableCell>
                <StyledTableCell align="center">{row.course_name}</StyledTableCell>
                <StyledTableCell align="center">1</StyledTableCell>
                <StyledTableCell align="center">1</StyledTableCell>
                <StyledTableCell align="center">1</StyledTableCell>
                <StyledTableCell align="center">1</StyledTableCell>
               
         
        </StyledTableRow>
      ))}
    </TableBody>
        </Table>
        </TableContainer>
        </div>
        </>
  )
}

export default StudentDetails