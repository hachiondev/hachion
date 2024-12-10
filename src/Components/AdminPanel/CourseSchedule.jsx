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
import { GoPlus } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import './Admin.css'; 


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

export default function CourseSchedule() {
 const[courses,setCourses]=useState([]);
 const[category,setCategory]=useState([]);
 const[courseCategory,setCourseCategory]=useState([]);
const [filteredCourses,setFilteredCourses]=useState([courses]);
 const [date, setDate] = useState('');
  const [open, setOpen] = React.useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);
const[message,setMessage]=useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [editedRow, setEditedRow] = useState({schedule_category_name:"",schedule_course_name:"",trainer_name:"",schedule_date:null,schedule_frequency:"",schedule_time:null,schedule_duration:"",schedule_mode:"", pattern:"", meeting:"",batch_id:""});
  const [selectedRow, setSelectedRow] = React.useState({schedule_category_name:"",schedule_course_name:"",trainer_name:"",schedule_date:"",schedule_frequency:"",schedule_time:"",schedule_duration:"",schedule_mode:"", pattern:"", meeting:"",batch_id:""});
  const currentDate = new Date().toISOString().split('T')[0];
  const [courseData, setCourseData] = useState([{
  course_schedule_id:Date.now(),
    schedule_category_name:"",
      schedule_course_name: "",
    schedule_date:null,
    schedule_frequency:"",
    schedule_week:"",
    schedule_time:null,
    schedule_duration:"",
    schedule_mode:"",
    trainer_name:"",
      created_date:currentDate,
      pattern:"",
      meeting:"",
      batch_id:""
    
    }]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTime, setSelectedTime] = useState(null);
    const [rows, setRows] = useState([{ id:"",frequency: "", time: "", duration: "", mode: "", pattern: "", meeting: "" }]);

const addRow = () => {
    setRows([...rows, { id: Date.now(), frequency: "", time: "", duration: "", mode: "", pattern: "", meeting: "" }]);
};

const deleteRow = (id) => {
    setRows(rows.filter(row => row.id !== id));
};
const handleDateChange = (newValue) => {
  const parsedDate = dayjs(newValue); // Ensure proper parsing
  
  if (!parsedDate.isValid()) { // Validate the date
    console.error("Invalid date:", newValue);
    return;
  }

  setCourseData((prevData) => ({
    ...prevData,
    schedule_date: parsedDate.format('YYYY-MM-DD'), // Format the date
    schedule_week: parsedDate.format('dddd'), // Format the weekday
  }));
};
useEffect(() => {
  const fetchCategory = async () => {
    try {
      const response = await axios.get("http://localhost:8080/course-categories/all");
      setCategory(response.data); // Assuming the data contains an array of trainer objects
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };
  fetchCategory();
}, []);

// Handle time change
const handleTimeChange = (newValue) => {
  setCourseData((prevData) => ({
    ...prevData,
    schedule_time: newValue ? dayjs(newValue).format('HH:mm') : null,
  }));
};

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourseData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
    const rowsPerPage = 10; // Show 10 rows per page


    
  const handleReset = () => {
    setCourseData([{
        schedule_category_name:"",
          schedule_course_name: "",
        schedule_date:"",
        schedule_week:"",
        schedule_time:"",
        scheule_frequency:"",
        schedule_duration:"",
        schedule_mode:"",
        trainer_name:"",
          created_date:"",
    }]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
  
    const currentDate = new Date().toISOString().split("T")[0];
  
    // Validate required fields
    if (!courseData.schedule_category_name || !courseData.schedule_course_name || !courseData.trainer_name) {
      alert("Please fill in all required fields.");
      return;
    }
  
    try {
      // Add the current date to the courseData
      const dataToSubmit = { ...courseData, created_date: currentDate };
  
      // Send the POST request
      const response = await axios.post("http://localhost:8080/schedulecourse/add", dataToSubmit);
  
      if (response.status === 200) {
        alert("Course added successfully");
  
        // Update the courses state to include the new course
        const updatedCourses = [...courses, dataToSubmit];
        setCourses(updatedCourses);
  
        // Reapply filtering to reflect the new data in the table
        const filtered = updatedCourses.filter((course) =>
          course.schedule_course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.schedule_category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.trainer_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCourses(filtered);
  
        // Reset the form fields
        handleReset();
      }
    } catch (error) {
      console.error("Error adding course:", error.message);
      alert("There was an error adding the course.");
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
      const response = await axios.get('http://localhost:8080/schedulecourse');
      setCourses(response.data);
      setFilteredCourses(response.data);
    //   setFilteredTrainers(response.data); // Set initial filtered categories to all data
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };
  fetchCourse();
}, [filteredCourses]);
useEffect(() => {
  const filtered = courses.filter((course) =>
    course.schedule_course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.schedule_category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.trainer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  setFilteredCourses(filtered)

}, [searchTerm,filteredCourses]);
const startIndex = (currentPage -1) * rowsPerPage;
const paginatedData = filteredCourses.slice(startIndex, startIndex + rowsPerPage);
const pageCount = Math.ceil(filteredCourses.length / rowsPerPage);

// Handle page change
const handlePageChange = (event, page) => {
  setCourses(paginatedData);
  setCurrentPage(page);
 
};
const handleDeleteConfirmation = (course_schedule_id) => {
  if (window.confirm("Are you sure you want to delete this trainer?",courseData.trainer_name)) {
    handleDelete(course_schedule_id);
  }
};

const handleDelete = async (course_schedule_id) => {
 
   try { 
    const response = await axios.delete(`http://localhost:8080/schedulecourse/delete/${course_schedule_id}`); 
    console.log("Trainer deleted successfully:", response.data); 
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
      `http://localhost:8080/schedulecourse/update/${selectedRow.course_schedule_id}`,
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
      <p>Schedule <IoIosArrowForward/> Add Schedule </p>
      <div className='category'>
      <div className='category-header'>
      <p>Add Schedule</p>
      </div>
      <div className='course-details'>
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
        <div class="col-md-3">
          <label for="inputState" class="form-label">Course Name</label>
          <select id="inputState" class="form-select" name='schedule_course_name' 
          value={courseData.schedule_course_name} onChange={handleChange}>
            <option value="" disabled>
          Select Course
        </option>
        {courses.map((curr) => (
          <option key={curr.id} value={curr.course_name}>
            {curr.course_name}
          </option>
        ))}
          </select>
        </div>
        <div class="col-md-3">
          <label for="inputState" class="form-label">Trainer Name</label>
          <input type="text" class="form-select" placeholder="Trainer name" aria-label="First name" 
    name="trainer_name"
    value={courseData.trainer_name}
    onChange={handleChange}/>
          </div>
        </div>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650,marginTop:5 }} aria-label="customized table">
            <LocalizationProvider dateAdapter={AdapterDayjs}> 
              <TableHead>
            
                <TableRow>
                
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell align="center">Frequency</StyledTableCell>
                  <StyledTableCell align="center">Time</StyledTableCell>
                  <StyledTableCell align="center">Duration</StyledTableCell>
                  <StyledTableCell align="center">Mode</StyledTableCell>
                  <StyledTableCell align="center">Pattern</StyledTableCell>
                  <StyledTableCell align="center">Meeting</StyledTableCell>
                  <StyledTableCell align="center">Add/Delete Row</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {rows.map((row) => (
              <StyledTableRow key={row.id}>
                
                    <StyledTableCell component="th" scope="row">
                    <DatePicker
  value={courseData.schedule_date ? dayjs(courseData.schedule_date) : null} // Ensure proper format
  onChange={(newValue) => handleDateChange(newValue)}
  renderInput={(params) => <TextField {...params} />}
/>

                    </StyledTableCell>
                   
                    <StyledTableCell align="right"><div class="col-md-3">
         
          <select id="inputState" class="form-select" name='schedule_frequency' 
          value={courseData.schedule_frequency} onChange={handleChange}>
            <option selected>Select</option>
            <option>Only Weekends</option>
            <option>Week Days</option>
            <option>Any Days</option>
      
          </select>
        </div></StyledTableCell>
                    <StyledTableCell align="right"> 
                      <DemoContainer components={['TimePicker']}>
                      <TimePicker
  label="Select Time"
  value={courseData.schedule_time ? dayjs(courseData.schedule_time, 'HH:mm') : null} // Parse back for controlled component
  onChange={handleTimeChange}
  renderInput={(params) => <TextField {...params} />}
/>
      </DemoContainer> 
           </StyledTableCell>
                    <StyledTableCell align="right"><input name="schedule_duration" className='table-input' value={courseData.schedule_duration} onChange={handleChange}/></StyledTableCell>
                    <StyledTableCell align="right"><div class="col-md-3">
       
          <select id="inputState" class="form-select" name='schedule_mode' 
          value={courseData.schedule_mode} onChange={handleChange}>
            <option selected>Select</option>
            <option>Live Class</option>
            <option>Live Demo</option>
          </select>
        </div></StyledTableCell>
                    <StyledTableCell align="right"><input name='pattern' className='table-input' value={rows.pattern} onChange={handleChange}/></StyledTableCell>
                    <StyledTableCell align="right"><input name='meeting' className='table-input' value={rows.meeting} onChange={handleChange}/></StyledTableCell>
                    <StyledTableCell align="right"><><GoPlus style={{fontSize:'2rem',color:'#00AEEF',marginRight:'10px'}} onClick={addRow}/>
                    <IoClose style={{fontSize:'2rem',color:'red'}} onClick={()=>deleteRow(row.id)}/></></StyledTableCell>
                  </StyledTableRow>
                  
                     ))}
              </TableBody>
              </LocalizationProvider>
            </Table>
          </TableContainer>
        
      <div style={{display:'flex',flexDirection:'row'}}> 
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
        <p>Course Schedule</p>
        <div className='category'>
          <div className='category-header'>
            <p>View Schedule Courses</p>
          </div>
          <div className='date-schedule'>
            Start Date
            <DatePicker 
    selected={startDate} 
    onChange={(date) => setStartDate(date)} 
    isClearable 
  />
            End Date
            <DatePicker 
    selected={endDate} 
    onChange={(date) => setEndDate(date)} 
    isClearable 
  />
            <button className='filter' onClick={handleDateFilter}>filter</button>
           
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
                onChange={(e) => setSearchTerm(e.target.value)} />
                <button className="btn-search" type="submit"  ><IoSearch style={{ fontSize: '2rem' }} /></button>
              </div>
              <button type="button" className="btn-category" onClick={handleAddTrendingCourseClick}>
                <FiPlus /> Add Course
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
            <StyledTableCell>
              <Checkbox />
            </StyledTableCell>
            <StyledTableCell>S.No.</StyledTableCell>
            <StyledTableCell align="center">Category Name</StyledTableCell>
            <StyledTableCell align="center">Schedule Course Name</StyledTableCell>
            <StyledTableCell align="center">Schedule Date</StyledTableCell>
            <StyledTableCell align="center">Week</StyledTableCell>
            <StyledTableCell align="center">Time</StyledTableCell>
            <StyledTableCell align="center">Duration</StyledTableCell>
            <StyledTableCell align="center">Mode</StyledTableCell>
            <StyledTableCell align="center">Trainer</StyledTableCell>
            <StyledTableCell align="center">Created Date</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredCourses.map((row) => (
            <StyledTableRow key={row.S_No}>
              <StyledTableCell><Checkbox /></StyledTableCell>
              <StyledTableCell>{row.course_schedule_id}</StyledTableCell>
              <StyledTableCell align="left">{row.schedule_category_name}</StyledTableCell>
              <StyledTableCell align="left">{row.schedule_course_name}</StyledTableCell>
              <StyledTableCell align="center">{row.schedule_date}</StyledTableCell>
              <StyledTableCell align="center">{row.schedule_week}</StyledTableCell>
              <StyledTableCell align="center">{row.schedule_time}</StyledTableCell>
              <StyledTableCell align="center">{row.schedule_duration}</StyledTableCell>
              <StyledTableCell align="center">{row.schedule_mode}</StyledTableCell>
              <StyledTableCell align="center">{row.trainer_name}</StyledTableCell>
              <StyledTableCell align="center">{row.created_date}</StyledTableCell>
              <StyledTableCell align="center">
                  <FaEdit className="edit" onClick={() => handleClickOpen(row)} /> {/* Open modal on edit click */}
                  <RiDeleteBin6Line className="delete"  onClick={() => handleDeleteConfirmation(row.course_schedule_id)} />
                </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    {message? (<p>Table updated succesfully</p>):<p></p>}
    <div className='pagination'>
        <Pagination
          count={pageCount}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </div>

      <Dialog open={open} onClose={handleClose}>
        <div className='dialog-title'>

        <DialogTitle>Edit Schedule  </DialogTitle>
        <Button onClick={handleClose} className='close-btn'>
            <IoMdCloseCircleOutline style={{color:'white',fontSize:'2rem'}}/>
          </Button>
        </div>
        <DialogContent>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
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
            <option value="">Select Course</option>
            <option>QA Automation</option>
            <option>Load Runner</option>
            <option>QA Automation Testing</option>
            <option>Mobile App Testing</option>
          </select>
        </div>

        <div className="col">
          <label className='form-label'>Trainer</label>
          <input
            type="text"
            className="form-select"
            placeholder="Trainer name"
            name="trainer_name"
            value={editedRow.trainer_name || ""}
            onChange={handleInputChange}
          />
        </div>

        <DatePicker
  value={editedRow.schedule_date ? dayjs(editedRow.schedule_date) : null}
  onChange={handleDateChange}
  renderInput={(params) => <TextField {...params} />}
/>

        <div className="col-md-3">
          <label className="form-label">Frequency</label>
          <select
            id="inputState"
            className="form-select"
            name="schedule_frequency"
            value={editedRow.schedule_frequency || ""}
            onChange={handleInputChange}
          >
            <option value="">Select</option>
            <option>Only Weekends</option>
            <option>Week Days</option>
            <option>Any Days</option>
          </select>
        </div>

        <TimePicker
  label="Select Time"
  value={editedRow.schedule_time ? dayjs(editedRow.schedule_time, 'HH:mm') : null}
  onChange={handleTimeChange}
  renderInput={(params) => <TextField {...params} />}
/>
        <input
          name="schedule_duration"
          value={editedRow.schedule_duration}
          onChange={handleInputChange}
        />

        <div className="col-md-3">
          <label htmlFor="inputState" className="form-label">Mode</label>
          <select
            id="inputState"
            className="form-select"
            name="schedule_mode"
            value={editedRow.schedule_mode || ""}
            onChange={handleInputChange}
          >
            <option value="">Select</option>
            <option>Live Class</option>
            <option>Live Demo</option>
          </select>
        </div>

        <label>Pattern</label>
        <input name="pattern" value={editedRow.pattern} onChange={handleInputChange} />

        <label>Meeting</label>
        <input name="meeting" value={editedRow.meeting} onChange={handleInputChange} />

        <label>Batch ID</label>
        <input name="batch_id" value={editedRow.batch_id} onChange={handleInputChange} />
      </LocalizationProvider>
    
        </DialogContent>
        <DialogActions>
         
          <Button onClick={handleSave} className='update-btn'>
            Update
          </Button>
        </DialogActions>
      </Dialog>
      </div>)}
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
                    Course Added Successfully
                        </p>
                      </div>
                    </div>
                    </div>
                    </div>

 </> );
}