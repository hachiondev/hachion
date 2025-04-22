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

export default function CorporateQuery() {
  const [startDate,setStartDate]=useState([]);
  const[endDate,setEndDate]=useState([]);
  const [searchTerm,setSearchTerm]=useState("")
const[corporateQuery,setCorporateQuery]=useState([]);
const[message,setMessage]=useState(false);
const[filteredCorporate,setFilteredCorporate]=useState([])
useEffect(() => {
  const fetchCorporateQuery = async () => {
    try {
      const response = await axios.get('https://api.hachion.co/advisors');
      console.log("API Response:", response.data);
      setCorporateQuery(response.data);
      setFilteredCorporate(response.data); // Initialize the filteredCorporate with the fetched data
    } catch (error) {
      console.error("Error fetching corporate queries:", error.message);
    }
  };
  fetchCorporateQuery();
}, []);


 const handleDateFilter = () => {
  const filtered = corporateQuery.filter((item) => {
    const Date = new Date(item.date); // Parse the date field
    const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
    const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

    return (
      (!start || Date >= start) &&
      (!end || Date <= end)
    );
  });

  setCorporateQuery(filtered);
};

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
        
        // Slice filteredCourse based on rowsPerPage and currentPage
        const displayedCategories = filteredCorporate.slice(
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
            <p>Corporate Query</p>
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
            <StyledTableCell align='center'>S.No.</StyledTableCell>
            <StyledTableCell align='center'>Full Name</StyledTableCell>
            <StyledTableCell align='center'>Company Name</StyledTableCell>
            <StyledTableCell align='center'>Email</StyledTableCell>
            <StyledTableCell align='center'>Mobile</StyledTableCell>
            <StyledTableCell align="center">Country</StyledTableCell>
            <StyledTableCell align="center">No. of People</StyledTableCell>
            <StyledTableCell align="center">Training Course</StyledTableCell>
            <StyledTableCell align="center">Comment</StyledTableCell>
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
      <StyledTableCell align="center">{row.fullName}</StyledTableCell>  {/* Fixed field */}
        <StyledTableCell align="center">{row.companyName}</StyledTableCell>  {/* Fixed field */}
        <StyledTableCell align="center">{row.emailId}</StyledTableCell>  {/* Fixed field */}
        <StyledTableCell align="center">{row.mobileNumber}</StyledTableCell>  {/* Fixed field */}
        <StyledTableCell align="center">{row.country || "N/A"}</StyledTableCell>  {/* Country missing in response */}
        <StyledTableCell align="center">{row.noOfPeople}</StyledTableCell>  {/* Fixed field */}
        <StyledTableCell align="center">{row.trainingCourse}</StyledTableCell>  {/* Fixed field */}
        <StyledTableCell align="center">{row.comments}</StyledTableCell>  {/* Fixed field */}
        
    </StyledTableRow>
  ))
) : (
  <p>No Data available</p>
)}
</TableBody>
    </Table>
    </TableContainer>
    <div className='pagination-container'>
              <AdminPagination
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalRows={filteredCorporate.length} // Use the full list for pagination
          onPageChange={handlePageChange}
        />
                  </div>
        {message && <div className="success-message">{message}</div>}
    
        </div>
     </>
     );
}