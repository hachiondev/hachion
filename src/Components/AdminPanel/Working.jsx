// // import React,{useState} from 'react';
// // import axios from 'axios';
// // import CategoryTable from './CategoryTable';
// // import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// // import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// // import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// // import { IoSearch } from "react-icons/io5";
// // import { FiPlus } from 'react-icons/fi';
// // import PropTypes from 'prop-types';
// // import { useEffect } from 'react';

// // const CourseCategory = ({
// //   pageTitle = "Course Category",
// //   headerTitle = "View Course Category List",
// //   buttonLabel = "Add Category",
// //   onAddCategoryClick,
// //   children
// // }) => {
// //   const [categories, setCategories] = useState([]);
// //   const [filteredCategories, setFilteredCategories] = useState([]);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [startDate, setStartDate] = useState(null);
// //   const [endDate, setEndDate] = useState(null);
// // useEffect(() => {
// //     const fetchCategories = async () => {
// //       try {
// //         const response = await axios.get('http://localhost:8080/api/course-categories/all');
// //         setCategories(response.data);
// //         setFilteredCategories(response.data); // Set initial filtered categories to all data
// //       } catch (error) {
// //         console.error("Error fetching categories:", error.message);
// //       }
// //     };
// //     fetchCategories();
// //   }, []);

// //   const handleFilter = () => {
// //     console.log("Filter data")
// //     let filteredData = categories;

// //     if (startDate) {
// //       filteredData = filteredData.filter(category =>
// //         new Date(category.date) >= new Date(startDate)
// //       );
// //     }
// //     if (endDate) {
// //       filteredData = filteredData.filter(category =>
// //         new Date(category.date) <= new Date(endDate)
// //       );
// //     }
// //     if (searchTerm) {
// //       filteredData = filteredData.filter(category =>
// //         category.name.toLowerCase().includes(searchTerm.toLowerCase())
// //       );
// //     }

// //     setFilteredCategories(filteredData);
// //   };

// //   const handleSearchChange = (e) => {
// //     setSearchTerm(e.target.value);
// //   };
// // const handleEdit = async (updatedCategory) => {
// //     try {
// //       const response = await axios.put(
// //         `http://localhost:8080/api/course-categories/update/${updatedCategory.id}`,
// //         updatedCategory
// //       );
// //       console.log("Category updated:", response.data);
// //       // Refresh the data after edit
// //       setCategories((prev) =>
// //         prev.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat))
// //       );
// //       handleFilter(); // Refresh filtered data as well
// //     } catch (error) {
// //       console.error("Error updating category:", error.message);
// //     }
// //   };

// //   const handleDelete = async (id) => {
// //     try {
// //       await axios.delete(`http://localhost:8080/api/course-categories/delete/${id}`);
// //       console.log("Deleted category with ID:", id);
// //       // Refresh the data after delete
// //       setCategories((prev) => prev.filter((cat) => cat.id !== id));
// //       handleFilter(); // Refresh filtered data as well
// //     } catch (error) {
// //       console.error("Error deleting category:", error.message);
// //     }
// //   };
// //   return (
// //     <LocalizationProvider dateAdapter={AdapterDayjs}>
// //       <div className='course-category'>
// //         <p>{pageTitle}</p>
// //         <div className='category'>
// //           <div className='category-header'>
// //             <p>{headerTitle}</p>
// //           </div>
// //           <div className='date-schedule'>
// //             Start Date
// //             <DatePicker />
// //             End Date
// //             <DatePicker />
// //             <button className='filter' onClick={handleFilter}>filter</button>
// //           </div>
// //           <div className='entries'>
// //             <div className='entries-left'>
// //               <p>Show</p>
// //               <div className="btn-group">
// //                 <button type="button" className="btn-number dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
// //                   10
// //                 </button>
// //                 <ul className="dropdown-menu">
// //                   <li><a className="dropdown-item" href="#">1</a></li>
// //                   {/* Other entries */}
// //                 </ul>
// //               </div>
// //               <p>entries</p>
// //             </div>
// //             <div className='entries-right'>
// //               <div className="search-div" role="search" style={{ border: '1px solid #d3d3d3' }}>
// //                 <input className="search-input" type="search" placeholder="Enter Courses, Category or Keywords" aria-label="Search"
// //                      value={searchTerm}
// //                      onChange={handleSearchChange} />
// //                 <button className="btn-search" type="submit" onClick={handleFilter}><IoSearch style={{ fontSize: '2rem' }} /></button>
// //               </div>
// //               <button type="button" className="btn-category" onClick={onAddCategoryClick}>
// //                 <FiPlus /> {buttonLabel}
// //               </button>
// //             </div>
// //           </div>
// //           {/* <CategoryTable
// //             categories={filteredCategories}
// //             onEdit={handleEdit}
// //             onDelete={handleDelete}
// //           /> */}
// //         </div>
// //       </div>
// //     </LocalizationProvider>
// //   );
// // };

// // CourseCategory.propTypes = {
// //   pageTitle: PropTypes.string,
// //   headerTitle: PropTypes.string,
// //   buttonLabel: PropTypes.string,
// //   onAddCategoryClick: PropTypes.func,
// //   children: PropTypes.node,
// // };

// // export default CourseCategory;
// // import React, { useState } from 'react';
// // import { styled } from '@mui/material/styles';
// // import Table from '@mui/material/Table';
// // import { IoIosArrowForward } from 'react-icons/io'
// // import TableBody from '@mui/material/TableBody';
// // import TableCell, { tableCellClasses } from '@mui/material/TableCell';
// // import TableContainer from '@mui/material/TableContainer';
// // import TableHead from '@mui/material/TableHead';
// // import TableRow from '@mui/material/TableRow';
// // import Paper from '@mui/material/Paper';
// // import { FaEdit } from 'react-icons/fa';
// // import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// // import { IoSearch } from "react-icons/io5";
// // import { FiPlus } from 'react-icons/fi';
// // import { RiDeleteBin6Line } from 'react-icons/ri';
// // import Pagination from '@mui/material/Pagination';
// // import './Admin.css';
// // import { useNavigate } from 'react-router-dom';
// // import Dialog from '@mui/material/Dialog';
// // import DialogActions from '@mui/material/DialogActions';
// // import DialogContent from '@mui/material/DialogContent';
// // import DialogTitle from '@mui/material/DialogTitle';
// // import Button from '@mui/material/Button';
// // import TextField from '@mui/material/TextField';
// // import { IoMdCloseCircleOutline } from "react-icons/io";
// // import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// // import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// // // Styling the table cells
// // const StyledTableCell = styled(TableCell)(({ theme }) => ({
// //   [`&.${tableCellClasses.head}`]: {
// //     backgroundColor: '#00AEEF',
// //     color: theme.palette.common.white,
// //     borderRight: '1px solid white',
// //   },
// //   [`&.${tableCellClasses.body}`]: {
// //     fontSize: 14,
// //     borderRight: '1px solid #e0e0e0',
// //     wordWrap: 'break-word', // Allows text to wrap to the next line
// //     whiteSpace: 'normal',  // Ensures text breaks onto new lines
// //     maxWidth: 400,  
// //   },
// // }));

// // const StyledTableRow = styled(TableRow)(({ theme }) => ({
// //   '&:nth-of-type(odd)': {
// //     backgroundColor: theme.palette.action.hover,
// //   },
// //   '&:last-child td, &:last-child th': {
// //     border: 0,
// //   },
// // }));
// // export default function Working() {
// //   const [categories, setCategories] = useState([]);
// //   const [activeTab, setActiveTab] = useState('courseDetails'); // Default tab is Course Details
// //   const navigate=useNavigate();
// //   const [open, setOpen] = React.useState(false);
// //   const [showAddCourse, setShowAddCourse] = useState(false);
// //   const [course, setCourse] = useState('');
// //   const [successMessage, setSuccessMessage] = useState(false);
// //     const [selectedRow, setSelectedRow] = React.useState({ category_name: '', Date: '' });
  
// //     const [filteredCategories, setFilteredCategories] = useState([]);
// //     const [searchTerm, setSearchTerm] = useState('');
// //     const [startDate, setStartDate] = useState(null);
// //     const [endDate, setEndDate] = useState(null);


// // const AddCourse = ({ onAdd }) => {
// //   // State for form fields
// //   const [courseData, setCourseData] = useState({
// //     title: "",
// //     courseName: "",
// //     courseImage: "",
// //     youtubeLink: "",
// //     numberOfClasses: 0,
// //     dailySessions: 0,
// //     liveTrainingHours: 0,
// //     liveExerciseHours: 0,
// //     realTimeProjects: 0,
// //     starRating: 0,
// //     ratingByNumberOfPeople: 0,
// //     totalEnrollment: 0,
// //     courseCategory: ""
// //   });

// // }
// //   // Fetch categories on load
// //   useEffect(() => {
// //     axios.get("http://localhost:8080/api/course-categories/all")
// //       .then(response => setCategories(response.data))
// //       .catch(error => console.error("Error fetching categories:", error));
// //   }, []);

// //   // Handle input change
// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setCourseData({ ...courseData, [name]: value });
// //   };

// //   // Submit form data to add a course
// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     axios.post("http://localhost:8080/api/courses/add", courseData)
// //       .then(response => {
// //         alert("Course added successfully");
// //         onAdd(courseData); // Update parent component to show the new course
// //         handleReset(); // Reset form fields after submission
// //       })
// //       .catch(error => alert("Error adding course:", error.response.data));
// //   };

// //   // Reset form fields
// //   const handleReset = () => {
// //     setCourseData({
// //       title: "",
// //       courseName: "",
// //       courseImage: "",
// //       youtubeLink: "",
// //       numberOfClasses: 0,
// //       dailySessions: 0,
// //       liveTrainingHours: 0,
// //       liveExerciseHours: 0,
// //       realTimeProjects: 0,
// //       starRating: 0,
// //       ratingByNumberOfPeople: 0,
// //       totalEnrollment: 0,
// //       courseCategory: ""
// //     });
// //   };

// // const handleAddTrendingCourseClick = () => setShowAddCourse(true);
// //   const handleClickOpen = (row) => {
// //     setSelectedRow(row); // Set the selected row data
// //     setOpen(true); // Open the modal
// //   };
  
// //   const handleClose = () => {
// //     setOpen(false); // Close the modal
// //   };
  
// //   const handleSave = () => {
// //     // Logic to handle saving the updated category and date
// //     console.log('Saved:', selectedRow);
// //     setOpen(false);
// //     setSuccessMessage(true); // Show success message
// //     setTimeout(() => setSuccessMessage(false), 3000); 
// //   };
// // const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setSelectedRow((prev) => ({
// //       ...prev,
// //       [name]: value,
// //     }));
// //   };
// //   const handleFilter = () => {
// //     console.log("Filter data")
// //     let filteredData = categories;

// //     if (startDate) {
// //       filteredData = filteredData.filter(category =>
// //         new Date(category.date) >= new Date(startDate)
// //       );
// //     }
// //     if (endDate) {
// //       filteredData = filteredData.filter(category =>
// //         new Date(category.date) <= new Date(endDate)
// //       );
// //     }
// //     if (searchTerm) {
// //       filteredData = filteredData.filter(category =>
// //         category.name.toLowerCase().includes(searchTerm.toLowerCase())
// //       );
// //     }

// //     setFilteredCategories(filteredData);
// //   };

// //   const handleSearchChange = (e) => {
// //     setSearchTerm(e.target.value);
// //   };


// //   const tableHeadings = {
// //     courseDetails: ['S.No', 'Image', 'Course Name', 'Date', 'Action'],
// //   }
// //   const handleTabChange = (tab) => {
// //     setActiveTab(tab);
// //   };
// //   const getCurrentRows = () => {
// //     switch (activeTab) {
// //       case 'courseDetails': return courseDetailsRows;
// //  default: return null;
// //     }
// //   };
// //   return (
// //     <>
// //  {setShowAddCourse?
// //   (<div className='course-category'>
// // <p>Course details <IoIosArrowForward/> Add Course Details </p>
// // <div className='category'>
// // <div className='category-header'>
// // <p>Add Course Details</p>
// // </div>
// // <div className='course-details'>
// //   <div className='course-row'>
// // <div class="col-md-4">
// //     <label for="inputState" class="form-label">Category Name</label>
// //     <select id="inputState" class="form-select">
// //       <option selected>Select category</option>
// //       <option>Qa Testing</option>
// //       <option>Project Management</option>
// //       <option>Business Intelligence</option>
// //     </select>
// //   </div>
// //   <div class="col-md-4">
// //     <label for="inputEmail4" class="form-label">Course Name</label>
// //     <input type="text" class="form-control" id="inputEmail4" placeholder='Enter Course name here'/>
// //   </div>
// //   <div class="mb-3">
// //   <label for="formFile" class="form-label">Course Images</label>
// //   <input class="form-control" type="file" id="formFile"/>
// // </div>
// //   </div>
// //   <div className='course-row'>
// //   <div class="col-md-4">
// //     <label for="inputEmail4" class="form-label">Youtube Link</label>
// //     <input type="text" class="form-control" id="inputEmail4" placeholder='Enter Youtube Link'/>
// //   </div>
// //   <div class="col-md-4">
// //     <label for="inputEmail4" class="form-label">No. of Classes</label>
// //     <input type="text" class="form-control" id="inputEmail4" placeholder='Enter number of classes'/>
// //   </div>
// //   <div class="col-md-4">
// //     <label for="inputEmail4" class="form-label">Daily Session</label>
// //     <input type="text" class="form-control" id="inputEmail4" placeholder='Enter session'/>
// //   </div>
// //   </div>
// //   <div className='course-row'>
// //   <div class="col-md-4">
// //     <label for="inputEmail4" class="form-label">Live Training hours</label>
// //     <input type="text" class="form-control" id="inputEmail4" placeholder='Enter Hours'/>
// //   </div>
// //   <div class="col-md-4">
// //     <label for="inputEmail4" class="form-label">Lab Exercise Hours</label>
// //     <input type="text" class="form-control" id="inputEmail4" placeholder='Enter Hours'/>
// //   </div>
// //   <div class="col-md-4">
// //     <label for="inputEmail4" class="form-label">Real Time Projects</label>
// //     <input type="text" class="form-control" id="inputEmail4" placeholder='Enter projects'/>
// //   </div>
// //   </div>
// //   <div className='course-row'>
// //   <div class="col-md-4">
// //     <label for="inputEmail4" class="form-label">Star Rating</label>
// //     <input type="text" class="form-control" id="inputEmail4" placeholder='Enter Rating'/>
// //   </div>
// //   <div class="col-md-4">
// //     <label for="inputEmail4" class="form-label">Rating by No. of People</label>
// //     <input type="text" class="form-control" id="inputEmail4" placeholder='Enter number of people'/>
// //   </div>
// //   <div class="col-md-4">
// //     <label for="inputEmail4" class="form-label">Total Enrollment</label>
// //     <input type="text" class="form-control" id="inputEmail4" placeholder='Enter No. Of Enrollment'/>
// //   </div>
// //   </div>
// // </div>
// // </div>
// // <div style={{display:'flex',flexDirection:'row'}}> 
// //   <button className='submit-btn' onClick={()=>console.log("Submitted")}>Submit</button>
// //   <button className='reset-btn' onClick={()=>console.log("Reset")}>Reset</button>
// //   </div>
// //   {successMessage && <div className="success-message">Update Successfully</div>} 

// //   </div>
// //   ):(
// //     <>
// //      <div className="certificate-tabs">
// //      <div 
// //           className={`tab-item ${activeTab === 'courseDetails' ? 'active-tab' : ''}`}
// //           onClick={() => handleTabChange('courseDetails')}
// //         >
// //           Course Details
// //         </div>
// //  <LocalizationProvider dateAdapter={AdapterDayjs}>
// //  <div className='course-category'>
// //        <p>Course</p>
// //       <div className='category'>
// //          <div className='category-header'>
// //            <p>{activeTab.replace(/([A-Z])/g, ' $1')}</p>
// //          </div>
// //          <div className='date-schedule'>
// //            Start Date
// //            <DatePicker />
// //            End Date
// //            <DatePicker />
// //            <button className='filter' onClick={handleFilter}>filter</button>
// //          </div>
// //          <div className='entries'>
// //            <div className='entries-left'>
// //              <p>Show</p>
// //              <div className="btn-group">
// //                <button type="button" className="btn-number dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
// //                  10
// //                </button>
// //                <ul className="dropdown-menu">
// //                  <li><a className="dropdown-item" href="#">1</a></li>
               
// //                </ul>
// //              </div>
// //              <p>entries</p>
// //            </div>
// //            <div className='entries-right'>
// //             <div className="search-div" role="search" style={{ border: '1px solid #d3d3d3' }}>
// //               <input className="search-input" type="search" placeholder="Enter Courses, Category or Keywords" aria-label="Search"
// //                    value={searchTerm}
// //                   onChange={handleSearchChange} />
// //              <button className="btn-search" type="submit" onClick={handleFilter}><IoSearch style={{ fontSize: '2rem' }} /></button>
// //             </div>
// //             <button type="button" className="btn-category" onClick={handleAddTrendingCourseClick}>
// //                <FiPlus /> 
// //                {/* {Add ${activeTab.replace(/([A-Z])/g, ' $1')}} */}
// //              </button>
// //            </div>
// //           </div>
        
// //         </div>
// //      </div>
// //      <TableContainer component={Paper}>
// //         <Table sx={{ minWidth: 700 }} aria-label="customized table">
// //           <TableHead>
// //           <TableRow>
// //     {tableHeadings[activeTab].map((heading, index) => (
// //       <StyledTableCell key={index}>{heading}</StyledTableCell>
// //     ))}
// //   </TableRow>

// //        </TableHead>
// //        <TableBody>
// //        {getCurrentRows().map((row, index) => (
// //  <StyledTableRow key={index}>
 
// //    <StyledTableCell>{row.S_No}</StyledTableCell>
// //    {activeTab === 'courseDetails' && (
// //      <>
// //        <StyledTableCell>{row.image}</StyledTableCell>
// //        <StyledTableCell>{row.course_name}</StyledTableCell>
// //        <StyledTableCell>{row.date}</StyledTableCell>
// //        <StyledTableCell align="center">
// //                <FaEdit className="edit" onClick={() => handleClickOpen(row)}  />
// //                <RiDeleteBin6Line className="delete" />
// //              </StyledTableCell>
// //      </>
// //    )}
   
// //  </StyledTableRow>
// // ))}
// //        </TableBody>
// //      </Table>
// //    </TableContainer>
// //    <div className='pagination'>
// //      <Pagination count={10} color="primary" />
// //    </div>
// //    <Dialog open={open} onClose={handleClose}>
// //      <div className='dialog-title'>

// //      <DialogTitle>Edit Category  </DialogTitle>
// //      <Button onClick={handleClose} className='close-btn'>
// //          <IoMdCloseCircleOutline style={{color:'white',fontSize:'2rem'}}/>
// //        </Button>
// //      </div>
// //      <DialogContent>
// //        <TextField
// //          autoFocus
// //          margin="dense"
// //          name="category_name"
// //          label="Category Name"
// //          type="text"
// //          fullWidth
// //          value={selectedRow.category_name}
// //          onChange={handleInputChange}
// //        />
// //        <TextField
// //          margin="dense"
// //          name="Date"
// //          label="Date"
// //          type="date"
// //          fullWidth
// //          value={selectedRow.Date}
// //          onChange={handleInputChange}
// //        />
       
// //      </DialogContent>
// //      <DialogActions>
      
// //        <Button onClick={handleSave} className='update-btn'>
// //          Update
// //        </Button>
// //      </DialogActions>
// //    </Dialog>
// //    </LocalizationProvider>
// //    </div>

// //    </>
// //    )}

// //    </>)
// //    } 
// import * as React from 'react';
// import { styled } from '@mui/material/styles';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell, { tableCellClasses } from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import Checkbox from '@mui/material/Checkbox';
// import { FaEdit } from 'react-icons/fa';
// import { RiDeleteBin6Line } from 'react-icons/ri';
// import './Admin.css';

// import Pagination from '@mui/material/Pagination';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogTitle from '@mui/material/DialogTitle';
// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
// import { IoMdCloseCircleOutline } from "react-icons/io";

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: '#00AEEF',
//     color: theme.palette.common.white,
//     borderRight: '1px solid white', // Add vertical lines
//     position: 'sticky',             // Make header sticky
//     top: 0,                         // Stick to the top of the container
//     zIndex: 1,         
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//     borderRight: '1px solid #e0e0e0', // Add vertical lines for body rows
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

// function createData(S_No, Image, Course_Name, Date, Action) {
//   return { S_No, Image, Course_Name, Date, Action};
// }



// export default function Course() {
//   const [open, setOpen] = React.useState(false);
//   const [selectedRow, setSelectedRow] = React.useState({ category_name: '', Date: '' });

//   const handleClickOpen = (row) => {
//     setSelectedRow(row); // Set the selected row data
//     setOpen(true); // Open the modal
//   };

//   const handleClose = () => {
//     setOpen(false); // Close the modal
//   };

//   const handleSave = () => {
//     // Logic to handle saving the updated category and date
//     console.log('Saved:', selectedRow);
//     setOpen(false);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setSelectedRow((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   return (
//     <>
    
//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 700 }} aria-label="customized table">
//           <TableHead>
//             <TableRow>
//               <StyledTableCell>
//                 <Checkbox />
//               </StyledTableCell>
//               <StyledTableCell>S.No.</StyledTableCell>
//               <StyledTableCell align="center">Image</StyledTableCell>
//               <StyledTableCell align="center">Course Name</StyledTableCell>
//               <StyledTableCell align="center">Date</StyledTableCell>
//               <StyledTableCell align="center">Action</StyledTableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {rows.map((row) => (
//               <StyledTableRow key={row.S_No}>
//                 <StyledTableCell><Checkbox /></StyledTableCell>
//                 <StyledTableCell>{row.S_No}</StyledTableCell>
//                 <StyledTableCell align="center">{row.image}</StyledTableCell>
//                 <StyledTableCell align="center">{row.course_name}</StyledTableCell>
//                 <StyledTableCell align="center">{row.Date}</StyledTableCell>
//                 <StyledTableCell align="center">
//                   <FaEdit className="edit" onClick={() => handleClickOpen(row)} /> {/* Open modal on edit click */}
//                   <RiDeleteBin6Line className="delete" />
//                 </StyledTableCell>
//               </StyledTableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <div className="pagination">
//         <Pagination count={10} color="primary" />
//       </div>

//       {/* Dialog (Modal) for Editing */}
//       <Dialog open={open} onClose={handleClose}>
//         <div className='dialog-title'>

//         <DialogTitle>Edit Category  </DialogTitle>
//         <Button onClick={handleClose} className='close-btn'>
//             <IoMdCloseCircleOutline style={{color:'white',fontSize:'2rem'}}/>
//           </Button>
//         </div>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             name="category_name"
//             label="Category Name"
//             type="text"
//             fullWidth
//             value={selectedRow.category_name}
//             onChange={handleInputChange}
//           />
//           <TextField
//             margin="dense"
//             name="Date"
//             label="Date"
//             type="date"
//             fullWidth
//             value={selectedRow.Date}
//             onChange={handleInputChange}
//           />
//         </DialogContent>
//         <DialogActions>
         
//           <Button onClick={handleSave} className='update-btn'>
//             Update
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// }
// ManageCategories.js (Parent Component)
import React, { useState } from 'react';
import Course from './Course';
import AddCourseDetails from './AddCourseDetails';
import CategoryTable from './CategoryTable';

const ManageCourse = () => {
  const [showAddCategory, setShowAddCategory] = useState(false);

  const handleAddCategoryClick = () => {
    setShowAddCategory(true);
  };



  return (
    <div>
      {showAddCategory ? (
        <AddCourseDetails />
       
      ) : (<>
        <Course onAddCategoryClick={handleAddCategoryClick} />
 <CategoryTable/>
        </>
      )}
    </div>
  );
};

export default ManageCourse;
