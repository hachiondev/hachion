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
import AdminPagination from './AdminPagination';
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { MdKeyboardArrowRight } from 'react-icons/md';

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

  const staticData = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      mobile: '123-456-7890',
      country: 'USA',
      date: '2025-01-01',
      courseName: 'React Development',
      timeZone: 'GMT-5',
      visaStatus: 'Approved',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      mobile: '987-654-3210',
      country: 'Canada',
      date: '2025-01-02',
      courseName: 'Python Development',
      timeZone: 'GMT-4',
      visaStatus: 'Pending',
    },
  ];
  
const StudentDetails = () => {
const[registerStudent,setRegisterStudent]=useState([]);
 const [startDate, setStartDate] = useState(null);
 const[filteredStudent,setFilteredStudent]=useState([]);
    const [endDate, setEndDate] = useState(null);
    const [searchTerm,setSearchTerm]=useState("");
    const[filteredDemo,setFilteredDemo]=useState([]);
    const[filteredClass,setFilteredClass]=useState([]);
    const[filteredMentor,setFilteredMentor]=useState([]);
    const[filteredSelf,setFilteredSelf]=useState([]);
    const [showDemoTable, setShowDemoTable] = useState(false);
  const [showClassTable, setShowClassTable] = useState(false);
  const [showMentoringTable, setShowMentoringTable] = useState(false);
  const [showSelfPlacedTable, setShowSelfPlacedTable] = useState(false);

  const handleViewDemo = () => {
    setShowDemoTable(true);
    setShowClassTable(false);
    setShowMentoringTable(false);
    setShowSelfPlacedTable(false);
  };

  const handleViewClass = () => {
    setShowDemoTable(false);
    setShowClassTable(true);
    setShowMentoringTable(false);
    setShowSelfPlacedTable(false);
  };

  const handleViewMentoring = () => {
    setShowDemoTable(false);
    setShowClassTable(false);
    setShowMentoringTable(true);
    setShowSelfPlacedTable(false);
  };

  const handleViewSelfPlaced = () => {
    setShowDemoTable(false);
    setShowClassTable(false);
    setShowMentoringTable(false);
    setShowSelfPlacedTable(true);
  };

    useEffect(() => {
      const fetchStudent = async () => {
          try {
              const response = await axios.get('http://160.153.175.69:8080/registerstudent');
              setRegisterStudent(response.data); // Use the curriculum state
          } catch (error) {
              console.error("Error fetching student list:", error.message);
          }
      };
      fetchStudent();
     
      setFilteredStudent(registerStudent)
      console.log(registerStudent);
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
              const [rowsPerPage, setRowsPerPage] = useState(10);
              
              const handlePageChange = (page) => {
               setCurrentPage(page);
               window.scrollTo(0, window.scrollY);
             };
             // Inside your CourseCategory component
           
           const handleRowsPerPageChange = (rows) => {
             setRowsPerPage(rows);
             setCurrentPage(1); // Reset to the first page whenever rows per page changes
           };
  
           const displayedCourse = registerStudent.slice(
            (currentPage - 1) * rowsPerPage,
            currentPage * rowsPerPage
          );
    
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
                <p>Student Details</p>
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
                <StyledTableCell align='center'>
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
      {displayedCourse.length > 0
    ? displayedCourse.map((row, index) => (
        <StyledTableRow key={row.student_id}>
          <StyledTableCell align='center'>
            <Checkbox />
          </StyledTableCell>
          <StyledTableCell align="center">{index + 1 + (currentPage - 1) * rowsPerPage}
            </StyledTableCell> {/* S.No. */}
          <StyledTableCell align="center">{row.name}</StyledTableCell>
          <StyledTableCell align="center">{row.email}</StyledTableCell>
          <StyledTableCell align="center">{row.mobile}</StyledTableCell>
          <StyledTableCell align="center">{row.country}</StyledTableCell>
                <StyledTableCell align="center">{row.date}</StyledTableCell>
                <StyledTableCell align="center">{row.time_zone}</StyledTableCell>
                <StyledTableCell align="center">{row.visa_status}</StyledTableCell>
                <StyledTableCell align="center">{row.course_name}</StyledTableCell>
                <StyledTableCell align="center">  <MdOutlineRemoveRedEye onClick={handleViewDemo} /> </StyledTableCell>
                <StyledTableCell align="center"><MdOutlineRemoveRedEye onClick={handleViewClass} /></StyledTableCell>
                <StyledTableCell align="center"><MdOutlineRemoveRedEye onClick={handleViewMentoring} /></StyledTableCell>
                <StyledTableCell align="center"><MdOutlineRemoveRedEye onClick={handleViewSelfPlaced} /></StyledTableCell>
               
         
        </StyledTableRow>
       ))
         : (
           <StyledTableRow>
             <StyledTableCell colSpan={18} align="center">
               No data available.
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
                  totalRows={registerStudent.length} // Use the full list for pagination
                  onPageChange={handlePageChange}
                />
        </div>

        {showDemoTable && (
          <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
           <div className='course-category'>
          <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
      <li className="breadcrumb-item">
            <a href="#!" onClick={() => setShowDemoTable(false)}>Student Details</a> <MdKeyboardArrowRight />
            </li>
            <li className="breadcrumb-item active" aria-current="page">
            View Live Demo
            </li>
          </ol>
        </nav>    
            <div className='category'>
              <div className='category-header'>
                <p>View Live Demo</p>
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
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>S.No</StyledTableCell>
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell>Week</StyledTableCell>
                  <StyledTableCell>Time Zone</StyledTableCell>
                  <StyledTableCell>Meeting Link</StyledTableCell>
                  <StyledTableCell>Course Name</StyledTableCell>
                  <StyledTableCell>Batch ID</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Created Date</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {displayedCourse.length > 0
    ? displayedCourse.map((row, index) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell>{index + 1 + (currentPage - 1) * rowsPerPage}</StyledTableCell>
                    <StyledTableCell>1</StyledTableCell>
                  <StyledTableCell>02-01-2025</StyledTableCell>
                  <StyledTableCell>Monday</StyledTableCell>
                  <StyledTableCell>10.00AM</StyledTableCell>
                  <StyledTableCell>abc</StyledTableCell>
                  <StyledTableCell>Pega</StyledTableCell>
                  <StyledTableCell>1234</StyledTableCell>
                  <StyledTableCell>Active</StyledTableCell>
                  <StyledTableCell>01-01-2025</StyledTableCell>
                  </StyledTableRow>
                ))
                : (
                  <StyledTableRow>
                    <StyledTableCell colSpan={9} align="center">
                      No data available.
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
                    totalRows={filteredDemo.length} // Use the full list for pagination
                    onPageChange={handlePageChange}
                  />
             </div>
        </div>
      )}

        </div>
        </>
  )
}

export default StudentDetails