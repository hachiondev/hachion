// import * as React from 'react';
// import {
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox,
// } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import { tableCellClasses } from '@mui/material/TableCell';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
// import { IoSearch } from "react-icons/io5";
// import axios from 'axios';
// import { useState, useEffect } from 'react';
// import { RiDeleteBin6Line } from 'react-icons/ri';
// import AdminPagination from './AdminPagination';
// import './Admin.css';

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: '#00AEEF',
//     color: theme.palette.common.white,
//     borderRight: '1px solid white',
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//     borderRight: '1px solid #e0e0e0',
//   },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   '&:nth-of-type(odd)': {
//     backgroundColor: theme.palette.action.hover,
//   },
//   '&:last-child td, &:last-child th': {
//     border: 0,
//   },
// }));

// export default function OfflineEnroll() {
//   const [enrollData, setEnrollData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [message, setMessage] = useState(false);

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`https://api.test.hachion.co/enroll/delete/${id}`);
//       setEnrollData(enrollData.filter((item) => item.id !== id));
//     } catch (error) {
//       console.error("Error deleting entry:", error);
//     }
//   };

//   const filteredData = enrollData.filter((item) => {
//     const date = new Date(item.date || item.enroll_date);
//     const matchesSearch =
//       searchTerm === '' ||
//       [item.name, item.course_name, item.mode]
//         .map(field => (field || '').toLowerCase())
//         .some(field => field.includes(searchTerm.toLowerCase()));
//     const inDateRange =
//       (!startDate || date >= new Date(startDate)) &&
//       (!endDate || date <= new Date(endDate));
//     return matchesSearch && inDateRange;
//   });

//   const handleDateFilter = () => {
//       const filtered = enrollData.filter((item) => {
//         const date = new Date(item.date);
//         const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
//         const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
//         return (
//           (!start || date >= start) &&
//           (!end || date <= end)
//         );
//       });
//       setEnrollData(filtered);
//     };
//     const [currentPage, setCurrentPage] = useState(1);
//     const [rowsPerPage, setRowsPerPage] = useState(10);
//     const handlePageChange = (page) => {
//       setCurrentPage(page);
//       window.scrollTo(0, window.scrollY);
//     };
//     const handleRowsPerPageChange = (rows) => {
//       setRowsPerPage(rows);
//       setCurrentPage(1);
//     };
//     const displayedCategories = filteredData.slice(
//       (currentPage - 1) * rowsPerPage,
//       currentPage * rowsPerPage
//     );
//   return (
//     <>
//         <div>
//       <LocalizationProvider dateAdapter={AdapterDayjs}>
//         <div className='course-category'>
//         <div className='category'>
//           <div className='category-header'><p>View Offline Enrollment List</p></div>
//               <div className='date-schedule'>
//                 Start Date
//                 <DatePicker
//                   value={startDate}
//                   onChange={(date) => setStartDate(date)}
//                   isClearable
//                   sx={{
//                     '& .MuiIconButton-root': { color: '#00aeef' }
//                   }}
//                 />
//                 End Date
//                 <DatePicker
//                   value={endDate}
//                   onChange={(date) => setEndDate(date)}
//                   isClearable
//                   sx={{
//                     '& .MuiIconButton-root': { color: '#00aeef' }
//                   }}
//                 />
//                 <button className='filter' onClick={handleDateFilter}>Filter</button>
//               </div>
//               <div className='entries'>
//                 <div className='entries-left'>
//                   <p style={{ marginBottom: '0' }}>Show</p>
//                   <div className="btn-group">
//                     <button type="button" className="btn-number dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
//                       {rowsPerPage}
//                     </button>
//                     <ul className="dropdown-menu">
//                       <li><a className="dropdown-item" href="#!" onClick={() => handleRowsPerPageChange(10)}>10</a></li>
//                       <li><a className="dropdown-item" href="#!" onClick={() => handleRowsPerPageChange(25)}>25</a></li>
//                       <li><a className="dropdown-item" href="#!" onClick={() => handleRowsPerPageChange(50)}>50</a></li>
//                     </ul>
//                   </div>
//                   <p style={{ marginBottom: '0' }}>entries</p>
//                 </div>
//                 <div className='entries-right'>
//                   <div className="search-div" role="search" style={{ border: '1px solid #d3d3d3' }}>
//                     <input
//                       className="search-input"
//                       type="search"
//                       placeholder="Enter Names, Courses, or Mode"
//                       aria-label="Search"
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                     <button className="btn-search" type="submit"><IoSearch style={{ fontSize: '2rem' }} /></button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </LocalizationProvider>
//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 700 }} aria-label="customized table">
//           <TableHead>
//             <TableRow>
//               <StyledTableCell><Checkbox /></StyledTableCell>
//               <StyledTableCell sx={{ width: 50 }} align='center'>S.No.</StyledTableCell>
//               <StyledTableCell align="center">Student ID</StyledTableCell>
//               <StyledTableCell align="center">Student Name</StyledTableCell>
//               <StyledTableCell align="center">Email</StyledTableCell>
//               <StyledTableCell align="center">Mobile</StyledTableCell>
//               <StyledTableCell align="center">Course Name</StyledTableCell>
//               <StyledTableCell align="center">Enrollment Date</StyledTableCell>
//               <StyledTableCell align="center">Week</StyledTableCell>
//               <StyledTableCell align="center">Time</StyledTableCell>
//               <StyledTableCell align="center">Mode</StyledTableCell>
//               <StyledTableCell align="center">Type</StyledTableCell>
//               <StyledTableCell align="center">Trainer</StyledTableCell>
//               <StyledTableCell align="center">Completed Date</StyledTableCell>
//               <StyledTableCell align="center">Resend email count</StyledTableCell>
//               <StyledTableCell align="center">Action</StyledTableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//           {displayedCategories.length > 0 ? (
//                 displayedCategories.map((row, index) => (
//                   <StyledTableRow key={row.id}>
//                   <StyledTableCell><Checkbox /></StyledTableCell>
//                   <StyledTableCell align="center">
//                       {index + 1 + (currentPage - 1) * rowsPerPage}
//                     </StyledTableCell>
//                   <StyledTableCell align="left">{row.student_ID}</StyledTableCell>
//                   <StyledTableCell align="left">{row.name}</StyledTableCell>
//                   <StyledTableCell align="left">{row.email}</StyledTableCell>
//                   <StyledTableCell align="center">{row.mobile}</StyledTableCell>
//                   <StyledTableCell align="left">{row.course_name}</StyledTableCell>
//                   <StyledTableCell align="center">{row.enroll_date}</StyledTableCell>
//                   <StyledTableCell align="center">{row.week}</StyledTableCell>
//                   <StyledTableCell align="center">{row.time}</StyledTableCell>
//                   <StyledTableCell align="center">{row.mode}</StyledTableCell>
//                   <StyledTableCell align="center">{row.type}</StyledTableCell>
//                   <StyledTableCell align="center">{row.trainer}</StyledTableCell>
//                   <StyledTableCell align="center">{row.completion_date}</StyledTableCell>
//                   <StyledTableCell align="center">{row.resendCount}</StyledTableCell>
//                   <StyledTableCell align="center">
//                     <RiDeleteBin6Line
//                       className="delete"
//                       onClick={() => handleDelete(row.id)}
//                       style={{ cursor: "pointer", color: "red" }}
//                     />
//                   </StyledTableCell>
//                 </StyledTableRow>
//               ))
//             ) : (
//               <StyledTableRow>
//                 <StyledTableCell colSpan={15} align="center">No data available</StyledTableCell>
//               </StyledTableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <div className='pagination-container'>
//         <AdminPagination
//           currentPage={currentPage}
//           rowsPerPage={rowsPerPage}
//           totalRows={filteredData.length}
//           onPageChange={handlePageChange}
//           />
//           </div>
//           {message && <div className="success-message">{message}</div>}
//         </div>
//       </>
//     );
//   };

import  React, { useEffect } from 'react';
import { useState } from 'react';
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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { IoMdCloseCircleOutline } from "react-icons/io";
import axios from 'axios';
import { MdKeyboardArrowRight } from 'react-icons/md';
import AdminPagination from './AdminPagination';

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
export default function OfflineEnroll() {
  const[course,setCourse]=useState([]);
  const[courseCategory,setCourseCategory]=useState([]);
    const [filterCourse,setFilterCourse]=useState([]);
  const [searchTerm,setSearchTerm]=useState("")
    const [showAddCourse, setShowAddCourse] = useState(false);
    const[enroll,setEnroll]=useState([]);
    const[filteredEnroll,setFilteredEnroll]=useState([])
    const [open, setOpen] = React.useState(false);
    const currentDate = new Date().toISOString().split('T')[0];
    const[message,setMessage]=useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [editedData, setEditedData] = useState({certificate_image:"",course_name:"",category_name:"",title:"",description:"",});
    const [enrollData, setEnrollData] = useState([]);
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
                 const displayedCourse = filteredEnroll.slice(
                  (currentPage - 1) * rowsPerPage,
                  currentPage * rowsPerPage
                );
const handleFileChange = (e) => {
    setEnrollData((prev) => ({ ...prev, certificate_image: e.target.files[0] }));
  };
         const handleReset=()=>{
            setEnrollData([{
              id:"",
              certificate_image:null,
               course_name: "",
                date:currentDate,
               category_name:"",
               title:"",
               description:"",
                 }]);       
         }
         const handleInputChange = (e) => {
            const { name, value } = e.target;
            setEditedData((prev) => ({
              ...prev,
              [name]: value,
            }));
          }
    const handleClose = () => {
      setOpen(false); 
    };

    const handleDeleteConfirmation = (id) => {
        if (window.confirm("Are you sure you want to delete this Enroll")) {
          handleDelete(id);
        }
      };
      const handleSave = async () => {
        try {
            
        } catch (error) {
            setMessage("Error updating Enroll.");
        }
    };
      const handleDelete = async (id) => {
         try { 
          
        } catch (error) { 
        } }; 

        const handleClickOpen = (row) => {
              setEditedData(row)
              setOpen(true);
            };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEnrollData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

       useEffect(() => {
            if (enrollData.category_name) {
              const filtered = courseCategory.filter(
                (course) => course.courseCategory === enrollData.category_name
              );
              setFilterCourse(filtered);
            } else {
              setFilterCourse([]);
            }
          }, [enrollData.category_name, courseCategory]);
      const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const currentDate = new Date().toISOString().split("T")[0]; 
        formData.append("date", currentDate);
        formData.append("course_name", enrollData.course_name);
        formData.append("category_name", enrollData.category_name);
        formData.append("title", enrollData.title);
        formData.append("description", enrollData.description);
        if (enrollData.certificate_image) {
            formData.append("certificate_image", enrollData.certificate_image);
        } else {
            alert("Please select an image.");
            return;
        }
        try {
            const response = await axios.post("https://api.test.hachion.co/certificate/add", formData, {
            });
            if (response.status === 201 || response.status === 200) {
                alert("Enrollment added successfully");
                setEnrollData([...enrollData, { ...enrollData, date: currentDate }]); // Update local state
                handleReset();
            }
        } catch (error) {
            alert("Error adding enroll.");
        }
    };

      const filteredData = enroll.filter((item) => {
    const date = new Date(item.date || item.enroll_date);
    const matchesSearch =
      searchTerm === '' ||
      [item.name, item.course_name, item.email]
        .map(field => (field || '').toLowerCase())
        .some(field => field.includes(searchTerm.toLowerCase()));
    const inDateRange =
      (!startDate || date >= new Date(startDate)) &&
      (!endDate || date <= new Date(endDate));
    return matchesSearch && inDateRange;
  });

  const handleDateFilter = () => {
      const filtered = enroll.filter((item) => {
        const date = new Date(item.date);
        const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
        const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
        return (
          (!start || date >= start) &&
          (!end || date <= end)
        );
      });
      setEnrollData(filtered);
    };
    const displayedCategories = filteredData.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
    const handleAddTrendingCourseClick = () => {setShowAddCourse(true);
    }
  return (
    <>  
     {showAddCourse ?  (<div className='course-category'>
      <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
        <li className="breadcrumb-item">
              <a href="#!" onClick={() => setShowAddCourse(false)}>Offline Erollment</a> <MdKeyboardArrowRight />
              </li>
              <li className="breadcrumb-item active" aria-current="page">
              Add Enrollment
              </li>
            </ol>
          </nav>
<div className='category'>
<div className='category-header'>
<p style={{ marginBottom: 0 }}>Add Enrollment </p>
</div>
<div className='course-details'>
<div className='course-row'>
<div class="col">
    <label for="inputState" class="form-label">Category Name</label>
    <select id="inputState" class="form-select" name='category_name' value={enrollData.category_name} onChange={handleChange}>
    <option value="" disabled>
          Select Category
        </option>
        {course.map((curr) => (
          <option key={curr.id} value={curr.name}>
            {curr.name}
          </option>
        ))}
    </select>
  </div>
  <div className="col">
        <label htmlFor="course" className="form-label">Course Name</label>
        <select
          id="course"
          className="form-select"
          name="course_name"
          value={enrollData.course_name}
          onChange={handleChange}
          disabled={!enrollData.category_name}
        >
          <option value="" disabled>Select Course</option>
          {filterCourse.map((curr) => (
            <option key={curr.id} value={curr.courseName}>{curr.courseName}</option>
          ))}
        </select>
      </div>
  </div>

  <div className='course-row'>
  <button className='submit-btn' data-bs-toggle='modal'
                  data-bs-target='#exampleModal' onClick={handleSubmit}>Submit</button>
  <button className='reset-btn' onClick={handleReset}>Reset</button>
</div>
  </div>
  
</div>
</div>
):(<div>
   <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className='course-category'>
        <div className='category'>
          <div className='category-header'><p style={{ marginBottom: 0 }}>View Offline Enrollment List</p></div>
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
                      placeholder="Enter Names, Courses, or Email"
                      aria-label="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn-search" type="submit"><IoSearch style={{ fontSize: '2rem' }} /></button>
                  </div>
                   <button type="button" className="btn-category" onClick={handleAddTrendingCourseClick} >
                       <FiPlus /> Add Enrollment
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
              <StyledTableCell sx={{ width: 50 }} align='center'>S.No.</StyledTableCell>
              <StyledTableCell align="center">Student ID</StyledTableCell>
              <StyledTableCell align="center">Student Name</StyledTableCell>
              <StyledTableCell align="center">Email</StyledTableCell>
              <StyledTableCell align="center">Mobile</StyledTableCell>
              <StyledTableCell align="center">Course Name</StyledTableCell>
              <StyledTableCell align="center">Enrollment Date</StyledTableCell>
              <StyledTableCell align="center">Time</StyledTableCell>
              <StyledTableCell align="center">Mode</StyledTableCell>
              <StyledTableCell align="center">Completed Date</StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {displayedCategories.length > 0 ? (
                displayedCategories.map((row, index) => (
                  <StyledTableRow key={row.id}>
                  <StyledTableCell><Checkbox /></StyledTableCell>
                  <StyledTableCell align="center">
                      {index + 1 + (currentPage - 1) * rowsPerPage}
                    </StyledTableCell>
                  <StyledTableCell align="left">{row.student_ID}</StyledTableCell>
                  <StyledTableCell align="left">{row.name}</StyledTableCell>
                  <StyledTableCell align="left">{row.email}</StyledTableCell>
                  <StyledTableCell align="center">{row.mobile}</StyledTableCell>
                  <StyledTableCell align="left">{row.course_name}</StyledTableCell>
                  <StyledTableCell align="center">{row.enroll_date}</StyledTableCell>
                  <StyledTableCell align="center">{row.time}</StyledTableCell>
                  <StyledTableCell align="center">{row.mode}</StyledTableCell>
                  <StyledTableCell align="center">{row.completion_date}</StyledTableCell>
                  <StyledTableCell align="center">
                    <RiDeleteBin6Line
                      className="delete"
                      onClick={() => handleDelete(row.id)}
                      style={{ cursor: "pointer", color: "red" }}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={12} align="center">No data available</StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <div className='pagination-container'>
        <AdminPagination
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalRows={filteredEnroll.length}
          onPageChange={handlePageChange}
          />
          </div>
          {message && <div className="success-message">{message}</div>}
        </div>)}

    <Dialog className="dialog-box" open={open} onClose={handleClose} aria-labelledby="edit-schedule-dialog"
    PaperProps={{
      style: { borderRadius: 20 },
    }}>
  <div >
    <DialogTitle className="dialog-title" id="edit-schedule-dialog">Edit Offline Enrollment
    <Button onClick={handleClose} className="close-btn">
      <IoMdCloseCircleOutline style={{ color: "white", fontSize: "2rem" }} />
    </Button>
    </DialogTitle>
  </div>
  <DialogContent>
  <div className="course-row">
  <div class="col">
    <label for="inputState" class="form-label">Category Name</label>
    <select id="inputState" class="form-select" name='category_name' value={editedData.category_name} onChange={handleInputChange}>
    <option value="" disabled>
          Select Category
        </option>
        {course.map((curr) => (
          <option key={curr.id} value={curr.name}>
            {curr.name}
          </option>
        ))}
    </select>
  </div>
  <div class="col">
    <label for="inputState" class="form-label">Course Name</label>
    <select id="inputState" class="form-select" name='course_name' value={editedData.course_name} onChange={handleInputChange}>
    <option value="" disabled>
          Select Course
        </option>
        {courseCategory.map((curr) => (
          <option key={curr.id} value={curr.courseName}>
            {curr.courseName}
          </option>
        ))}
    </select>
  </div>
  </div>
 
  </DialogContent>
  <DialogActions className="update" style={{ display: 'flex', justifyContent: 'center' }}>
    <Button onClick={handleSave} className="update-btn">Update</Button>
  </DialogActions>
</Dialog>
   
 </> );
}