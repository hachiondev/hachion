// import React from 'react'

// function WorkshopSchedule() {
//   return (
//     <div>WorkshopSchedule</div>
//   )
// }

// export default WorkshopSchedule


import  React, { useEffect } from 'react';
import { useState } from 'react';
import { duration, styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import dayjs from 'dayjs';
import { RiCloseCircleLine } from 'react-icons/ri';
import success from '../../Assets/success.gif';
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
import { MdKeyboardArrowRight } from 'react-icons/md';
import './Admin.css'; 
import AdminPagination from './AdminPagination'; 
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

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

export default function WorkshopSchedule() {
 const[courses,setCourses]=useState([]);
 const[category,setCategory]=useState([]);
 const[courseCategory,setCourseCategory]=useState([]);
const [filteredCourses,setFilteredCourses]=useState([courses]);
const[filterCourse,setFilterCourse]=useState([]);
  const [open, setOpen] = React.useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);
const[message,setMessage]=useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [editedRow, setEditedRow] = useState({schedule_category_name:"",schedule_course_name:"",schedule_date:null,schedule_time:null,time_zone:""});
  const [selectedRow, setSelectedRow] = React.useState({schedule_category_name:"",schedule_course_name:"",schedule_date:"",schedule_time:"",time_zone:""});
  const currentDate = new Date().toISOString().split('T')[0];
  const [courseData, setCourseData] = useState({
  course_schedule_id:"",
    schedule_category_name:"",
      schedule_course_name: "",
    schedule_date:null,
    schedule_time:null,
    time_zone:"",
      created_date:currentDate,
    });
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
            
            // Slice filteredCourses based on rowsPerPage and currentPage
            const displayedCategories = filteredCourses.slice(
              (currentPage - 1) * rowsPerPage,
              currentPage * rowsPerPage
            );
    const [selectedTime, setSelectedTime] = useState(null);
    const [rows, setRows] = useState([{ id:"", time: "", time_zone: ""}]);


const handleDateChange = (newValue) => {
  const parsedDate = dayjs(newValue); // Ensure proper parsing
  
  if (!parsedDate.isValid()) { // Validate the date
    console.error("Invalid date:", newValue);
    return;
  }

  setCourseData((prevData) => ({
    ...prevData,
    schedule_date: parsedDate.format('MM-DD-YYYY'), // Format the date
    schedule_week: parsedDate.format('dddd'), // Format the weekday
  }));
};
useEffect(() => {
  const fetchCategory = async () => {
    try {
      const response = await axios.get("https://api.hachion.co/course-categories/all");
      setCategory(response.data); // Assuming the data contains an array of trainer objects
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };
  fetchCategory();
}, []);
useEffect(() => {
  const fetchCourseCategory = async () => {
    try {
      const response = await axios.get("https://api.hachion.co/courses/all");
      setCourseCategory(response.data); // Assuming the data contains an array of trainer objects
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };
  fetchCourseCategory();
}, []);
useEffect(() => {
  if (courseData.schedule_category_name) {
    const filtered = courseCategory.filter(
      (course) => course.courseCategory === courseData.schedule_category_name
    );
    setFilterCourse(filtered);
  } else {
    setFilterCourse([]); // Reset when no category is selected
  }
}, [courseData.schedule_category_name, courseCategory]);

// Handle time change
const handleTimeChange = (newValue) => {
  setCourseData((prevData) => ({
    ...prevData,
    schedule_time: newValue ? dayjs(newValue).format('hh:mm A') : null,
  }));
};

// const handleChange = (e) => {
//   const { name, value } = e.target;
//   setCourseData((prevData) => ({
//     ...prevData,
//     [name]: value,
//   }));
// };
const handleChange = (e) => {
  const { name, value } = e.target;
  setCourseData((prev) => ({
    ...prev,
    [name]: value,
    ...(name === "schedule_category_name" && { schedule_course_name: "" }), // Reset course when category changes
  }));
};
  const handleReset = () => {
    setCourseData({
        schedule_category_name:"",
          schedule_course_name: "",
        schedule_date:"",
        schedule_time:"",
        time_zone:"",
          created_date:"",
    });
  };
  const handleSubmit = async (e) => {
    const formattedCourseData = {
      course_schedule_id: courseData.course_schedule_id,
      schedule_category_name: courseData.schedule_category_name,
      schedule_course_name: courseData.schedule_course_name,
      schedule_date: courseData.schedule_date,
      schedule_time: courseData.schedule_time,
      time_zone:courseData.time_zone,
      created_date: courseData.created_date,
    };
    
    try {
      const response = await axios.post("https://api.hachion.co/schedulecourse/add", formattedCourseData);
      console.log("Course added successfully:", response.data);
    } catch (error) {
      console.error("Error adding course:", error.response?.data || error.message);
    }
  }    

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
 
  const handleDateFilter = () => {
    const filtered = courses.filter((course) => {
      const courseDate = new Date(course.schedule_date); // Ensure schedule_date is parseable
      return (
        (!startDate || courseDate >= new Date(startDate)) &&
        (!endDate || courseDate <= new Date(endDate))
      );
    });
  
    setCourses(filtered);
  };

useEffect(() => {
  const fetchCourse = async () => {
    try {
      const response = await axios.get('https://api.hachion.co/schedulecourse');
      setCourses(response.data);
      setFilteredCourses(response.data);
    //   setFilteredTrainers(response.data); // Set initial filtered categories to all data
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };
  fetchCourse();
}, []);
useEffect(() => {
  const filtered = courses.filter((course) =>
    course.schedule_course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.schedule_category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  setFilteredCourses(filtered)

}, [searchTerm,filteredCourses]);
const startIndex = (currentPage -1) * rowsPerPage;
const paginatedData = filteredCourses.slice(startIndex, startIndex + rowsPerPage);
const pageCount = Math.ceil(filteredCourses.length / rowsPerPage);

const handleDeleteConfirmation = (course_schedule_id) => {
  if (window.confirm("Are you sure you want to delete this course?",courseData.trainer_name)) {
    handleDelete(course_schedule_id);
  }
};

const handleDelete = async (course_schedule_id) => {
 
   try { 
    const response = await axios.delete(`https://api.hachion.co/schedulecourse/delete/${course_schedule_id}`); 
    console.log("Courses deleted successfully:", response.data); 
  } catch (error) { 
    console.error("Error deleting Trainer:", error); 
  } }; 


  const handleAddTrendingCourseClick = () => setShowAddCourse(true);

const handleClickOpen = (row) => {
console.log(row);
  setSelectedRow(row); 
  setEditedRow(row)// Set the selected row data
  setOpen(true); // Open the modal
  console.log("tid",row.course_schedule_id)
};

const handleClose = () => {
  setOpen(false); // Close the modal
};
const handleCloseModal=()=>{
  setShowAddCourse(false);
 
}
const handleSave = async () => {
 
  try {
    const response = await axios.put(
      `https://api.hachion.co/schedulecourse/update/${selectedRow.course_schedule_id}`,
      editedRow
    );

    // Update only the edited row in the trainers state
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.course_schedule_id === selectedRow.course_schedule_id ? response.data : course
      )
    );
    setMessage(true); // Show the success message

    // Hide the message after 5 seconds
    setTimeout(() => {
      setMessage(false);
    }, 5000);

    setOpen(false); // Close the dialog
  } catch (error) {
    console.error("Error updating trainer:", error);
  }
};

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setEditedRow((prev) => ({
    ...prev,
    [name]: value,
  }));
};

// const handleCourseChange = (event) => setCourse(event.target.value);
  return (
    
    <>   
       {showAddCourse ?  
     (  <>       <div style={{ flexGrow: 1, padding: '20px' }}>
        
      
        <div className='course-category'>
        <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                <a href="#!" onClick={() => setShowAddCourse(false)}> Workshop Schedule </a> <MdKeyboardArrowRight />
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                Add Workshop Schedule
                </li>
              </ol>
            </nav>
      <div className='category'>
      <div className='category-header'>
      <p>Add Workshop Schedule</p>
      </div>
      <div className='course-details'>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='course-row'>
      <div class="col-md-3">
          <label for="inputState" class="form-label">Category Name</label>
          <select id="inputState" class="form-select" name='schedule_category_name' value={courseData.schedule_category_name} onChange={handleChange}>
    <option value="" disabled>
          Select Category
        </option>
        {category.map((curr) => (
          <option key={curr.id} value={curr.name}>
            {curr.name}
          </option>
        ))}
      </select>
        </div>
        <div className="col-md-3">
        <label htmlFor="course" className="form-label">Course Name</label>
        <select
          id="course"
          className="form-select"
          name="schedule_course_name"
          value={courseData.schedule_course_name}
          onChange={handleChange}
          disabled={!courseData.schedule_category_name}
        >
          <option value="" disabled>Select Course</option>
          {filterCourse.map((curr) => (
            <option key={curr.id} value={curr.courseName}>{curr.courseName}</option>
          ))}
        </select>
      </div>
        </div>
        
        <div className='course-row d-flex align-items-center'>
      {/* Date Field */}
      <div className='col'>
        <label className="form-label d-block">Date</label>
        <DatePicker
                        value={courseData.schedule_date ? dayjs(courseData.schedule_date) : null}
                        onChange={(newValue) => handleDateChange(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                        sx={{
                         '& .MuiIconButton-root':{color: '#00aeef'}
                        }}                
                      />
      </div>

      {/* Time Field (12-hour format) */}
      <div className="col">
        <label className="form-label d-block">Time</label>
        <DemoContainer components={['TimePicker']}>
                        <TimePicker
                          label="Select Time"
                          ampm={true}
                          value={courseData.schedule_time ? dayjs(courseData.schedule_time, 'hh:mm A') : null}
                          onChange={handleTimeChange}
                          renderInput={(params) => <TextField {...params} />}
                          sx={{
                            '& .MuiIconButton-root':{color: '#00aeef'}
                          }}
                        />
                      </DemoContainer>
      </div>

      {/* Time Zone Field */}
      <div className="col">
        <label className="form-label d-block">Time Zone</label>
        <input
          type="text"
          className="form-select"
          placeholder="Enter Time Zone"
          name="time_zone"
          value={courseData.time_zone || ""}
          onChange={handleChange}
        />
      </div>
      </div>
      </LocalizationProvider>
        
          <div className="course-row">
        <button className='submit-btn' data-bs-toggle='modal'
                  data-bs-target='#exampleModal' onClick={handleSubmit}>Submit</button>
        <button className='reset-btn' onClick={handleReset}>Reset</button>
      </div>
      </div>
      </div>
   </div>
   </div>
      </>
    
):(<div>
   <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='course-category'>
        <p>Workshop Schedule</p>
        <div className='category'>
          <div className='category-header'>
            <p>View Workshop Schedule</p>
          </div>
          <div className='date-schedule'>
            Start Date
            <DatePicker 
    selected={startDate} 
    onChange={(date) => setStartDate(date)} 
    isClearable 
    sx={{
       '& .MuiIconButton-root':{color: '#00aeef'}
    }}
  />
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
                onChange={(e) => setSearchTerm(e.target.value)} />
                <button className="btn-search" type="submit"  ><IoSearch style={{ fontSize: '2rem' }} /></button>
              </div>
              <button type="button" className="btn-category" onClick={handleAddTrendingCourseClick}>
                <FiPlus /> Add Workshop Schedule
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
            <StyledTableCell align="center">
              <Checkbox />
            </StyledTableCell>
            <StyledTableCell align="center">S.No.</StyledTableCell>
            <StyledTableCell align="center">Category Name</StyledTableCell>
            <StyledTableCell align="center">Course Name</StyledTableCell>
            <StyledTableCell align="center">Date</StyledTableCell>
            <StyledTableCell align="center">Time</StyledTableCell>
            <StyledTableCell align="center">Created Date</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {displayedCategories.length > 0 ? (
        displayedCategories.map((course, index) => (
            <StyledTableRow key={course.course_schedule_id}>
              <StyledTableCell align="center"><Checkbox /></StyledTableCell>
              <StyledTableCell align="center">{index + 1 + (currentPage - 1) * rowsPerPage}</StyledTableCell>
              <StyledTableCell align="left">{course.schedule_category_name}</StyledTableCell>
              <StyledTableCell align="left">{course.schedule_course_name}</StyledTableCell>
              <StyledTableCell align="center">{course.schedule_date ? dayjs(course.schedule_date).format('MM-DD-YYYY') : 'N/A'}</StyledTableCell>
              <StyledTableCell align="center">{course.schedule_time} {course.time_zone}</StyledTableCell>
              <StyledTableCell align="center">{course.created_date ? dayjs(course.created_date).format('MM-DD-YYYY') : 'N/A'}</StyledTableCell>
              <StyledTableCell align="center">
              <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                  <FaEdit className="edit" onClick={() => handleClickOpen(course)} /> {/* Open modal on edit click */}
                  <RiDeleteBin6Line className="delete"  onClick={() => handleDeleteConfirmation(course.course_schedule_id)} />
                  </div>
                  </StyledTableCell>
      </StyledTableRow>
        ))
      ) : (
        <p>No Workshop schedules available</p>
      )}
      </TableBody>
          </Table>
          </TableContainer>
    <div className='pagination-container'>
              <AdminPagination
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalRows={filteredCourses.length} // Use the full list for pagination
          onPageChange={handlePageChange}
        />
                  </div>
        {message && <div className="success-message">{message}</div>}

        </div>)}

      <Dialog className="dialog-box" open={open} onClose={handleClose} aria-labelledby="edit-schedule-dialog"
          PaperProps={{
            style: { borderRadius: 20 },
          }}>
        <div className="dialog-title">
        <DialogTitle >Edit Workshop Schedule  </DialogTitle>
        <Button onClick={handleClose} className='close-btn'>
            <IoMdCloseCircleOutline style={{color:'white',fontSize:'2rem'}}/>
          </Button>
        </div>
        <DialogContent>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="course-row">
        <div className="col">
          <label htmlFor="inputState" className="form-label">Category Name</label>
          <select
            id="inputState"
            className="form-select"
            name="schedule_category_name"
            value={editedRow.schedule_category_name || ""}
            onChange={handleInputChange}
          >
            <option value="" disabled>
          Select Category
        </option>
        {category.map((curr) => (
          <option key={curr.id} value={curr.name}>
            {curr.name}
          </option>
        ))}
          </select>
        </div>

        <div className="col">
          <label htmlFor="inputState" className="form-label">Course Name</label>
          <select
            id="inputState"
            className="form-select"
            name="schedule_course_name"
            value={editedRow.schedule_course_name || ""}
            onChange={handleInputChange}
          >
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

        <div className="course-row">
        <div className="col">
          <label className="form-label">Date</label>
       <DatePicker
                 sx={{
                   '& .MuiIconButton-root':{color: '#00aeef'}
                }}
         value={editedRow.schedule_date ? dayjs(editedRow.schedule_date) : null}
         onChange={handleDateChange}
         renderInput={(params) => <TextField {...params} />}
       />
       </div>

        <div className="col">
          <label className="form-label">Time</label>
        <TimePicker
                 sx={{
                   '& .MuiIconButton-root':{color: '#00aeef'}
                }}
          // label="Select Time"
          value={editedRow.schedule_time ? dayjs(editedRow.schedule_time, 'hh:mm A') : null}
          ampm={true}
          onChange={handleTimeChange}
          renderInput={(params) => <TextField {...params} />}
          />
  </div>

  <div className="col">
    <label className="form-label">Time Zone</label>
    <input
      type="text"
      className="form-select"
      placeholder="Enter Time Zone"
      name="time_zone"
      value={editedRow.time_zone || ""}
      onChange={handleInputChange}
    />
  </div>
        </div>

      </LocalizationProvider>
    
        </DialogContent>
        <DialogActions>
         
          <Button onClick={handleSave} className='update-btn'>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <div
                  className='modal fade'
                  id='exampleModal'
                  tabIndex='-1'
                  aria-labelledby='exampleModalLabel'
                  aria-hidden='true'
                >
                  <div className='modal-dialog'>
                    <div className='modal-content'>
                      <button
                        data-bs-dismiss='modal'
                        className='close-btn'
                        aria-label='Close'
                        onClick={handleCloseModal}
                      >
                        <RiCloseCircleLine />
                      </button>

                      <div className='modal-body'>
                        <img
                          src={success}
                          alt='Success'
                          className='success-gif'
                        />
                        <p className='modal-para'>
                    Workshop Added Successfully
                        </p>
                      </div>
                    </div>
                    </div>
                    </div>

 </> );
}