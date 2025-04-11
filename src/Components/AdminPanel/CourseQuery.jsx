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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#00AEEF",
    color: theme.palette.common.white,
    borderRight: "1px solid white",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderRight: "1px solid #e0e0e0",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function CourseQuery() {
  const [courseQuery, setCourseQuery] = useState([]);
    const [startDate,setStartDate]=useState([]);
    const[endDate,setEndDate]=useState([]);
    const [searchTerm,setSearchTerm]=useState("")
  const [filteredCourse, setFilteredCourse] = useState([]);
  const[message,setMessage]=useState(false);

  useEffect(() => {
    const fetchCourseQuery = async () => {
      try {
        const response = await axios.get("http://localhost:8080/haveanyquery");
        setCourseQuery(response.data);
        setFilteredCourse(response.data); // Initialize filtered data
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    fetchCourseQuery();
  }, []);

  const handleDateFilter = () => {
    const filtered = courseQuery.filter((item) => {
      const Date = new Date(item.date); // Parse the date field
      const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
      const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
  
      return (
        (!start || Date >= start) &&
        (!end || Date <= end)
      );
    });
  
    setCourseQuery(filtered);
  };

  const [currentPage, setCurrentPage] = useState(1);
             const [rowsPerPage, setRowsPerPage] = useState(10);
             
             const handlePageChange = (page) => {
              setCurrentPage(page);
              window.scrollTo(0, window.scrollY);
            };
            // Inside your WorkshopCategory component
          
          const handleRowsPerPageChange = (rows) => {
            setRowsPerPage(rows);
            setCurrentPage(1); // Reset to the first page whenever rows per page changes
          };
          
          // Slice filteredCourse based on rowsPerPage and currentPage
          const displayedCategories = filteredCourse.slice(
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
                <p>Course Query</p>
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
              <StyledTableCell>
                <Checkbox />
              </StyledTableCell>
              <StyledTableCell align="center">S.No.</StyledTableCell>
              <StyledTableCell align="center">Full Name</StyledTableCell>
              <StyledTableCell align="center">Email</StyledTableCell>
              <StyledTableCell align="center">Mobile</StyledTableCell>
              <StyledTableCell align="center">Comment</StyledTableCell>
              <StyledTableCell align="center">Date</StyledTableCell>
              <StyledTableCell align="center">Country</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedCategories.length > 0 ? (
              displayedCategories.map((row, index) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell>
                    <Checkbox />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {index + 1 + (currentPage - 1) * rowsPerPage}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.name}</StyledTableCell>
                  <StyledTableCell align="center">{row.email}</StyledTableCell>
                  <StyledTableCell align="center">{row.mobile}</StyledTableCell>
                  <StyledTableCell align="center">{row.comment}</StyledTableCell>
                  <StyledTableCell align="center">{row.date}</StyledTableCell>
                  <StyledTableCell align="center">{row.country}</StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={6} align="center">
                  No Data Available
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <div className="pagination-container">
        <AdminPagination
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalRows={filteredCourse.length}
          onPageChange={handlePageChange}
          />
          </div>
{message && <div className="success-message">{message}</div>}

</div>
</>
);
}