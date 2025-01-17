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
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { MdKeyboardArrowRight } from 'react-icons/md';
import AdminPagination from './AdminPagination';
// import { AnalyticsOutlined } from '@mui/icons-material';

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


export default function RegisterList() {
  const [course,setCourse]=useState([]);
  const [searchTerm,setSearchTerm]=useState("")
    const [showAddCourse, setShowAddCourse] = useState(false);
    const[registerStudent,setRegisterStudent]=useState([]);
    const[filteredStudent,setFilteredStudent]=useState([])
    const [open, setOpen] = React.useState(false);
    const currentDate = new Date().toISOString().split('T')[0];
    const[message,setMessage]=useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [editedData, setEditedData] = useState({student_name:"",email:"",mobile:"",password:"",location:"",state:"",time:"",course_name:"",additional_email:"",additional_mobile:""});
    const [studentData, setStudentData] = useState([{
        student_id:"",
        name:"",
        email:"",
        mobile:"",
        country:"",
        location:"",
       time:"",
       analyst_name:"",
       source:"",
       course_name:"",
       remarks:"",
       comments:"",
       date:currentDate,
            visa_status:""
         }]);
        
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

         const displayedCourse = filteredStudent.slice(
          (currentPage - 1) * rowsPerPage,
          currentPage * rowsPerPage
        );
         const handleReset=()=>{
            setStudentData([{
                student_id:"",
        name:"",
        email:"",
        mobile:"",
        country:"",
        location:"",
       time:"",
       analyst_name:"",
       source:"",
       course_name:"",
       remarks:"",
       comments:"",
       date:currentDate,
            visa_status:""
                 }]);
        
         }
         const handleInputChange = (e) => {
            const { name, value } = e.target;
            setEditedData((prev) => ({
              ...prev,
              [name]: value,
            }));
          };
   
    const handleClose = () => {
      setOpen(false); // Close the modal
    };

    useEffect(() => {
      const fetchStudent = async () => {
          try {
              const response = await axios.get('http://160.153.175.69:8080/HachionUserDashboad/registerstudent');
              setRegisterStudent(response.data); // Use the curriculum state
          } catch (error) {
              console.error("Error fetching student list:", error.message);
          }
      };
      fetchStudent();
      setFilteredStudent(registerStudent)
  }, []); // Empty dependency array ensures it runs only once

    const handleDeleteConfirmation = (student_id) => {
        if (window.confirm("Are you sure you want to delete this Student?")) {
          handleDelete(student_id);
        }
      };
  
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
      const handleSave = async () => {
        try {
            const response = await axios.put(
                `http://160.153.175.69:8080/HachionUserDashboad/registerstudent/update/${editedData.student_id}`,editedData
            );
            setRegisterStudent((prev) =>
                prev.map(curr =>
                    curr.student_id === editedData.student_id ? response.data : curr
                )
            );
            setMessage("Student details updated successfully!");
            setTimeout(() => setMessage(""), 5000);
            setOpen(false);
        } catch (error) {
            setMessage("Error updating student details.");
        }
    };
            
      const handleDelete = async (student_id) => {
       
         try { 
          const response = await axios.delete(`http://160.153.175.69:8080/HachionUserDashboad/registerstudent/delete/${student_id}`); 
          console.log("Register Student deleted successfully:", response.data); 
        } catch (error) { 
          console.error("Error deleting Student:", error); 
        } }; 
        useEffect(() => {
          const filtered = registerStudent.filter(registerStudent =>
              registerStudent.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              registerStudent.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
              registerStudent.visa_status.toLowerCase().includes(searchTerm.toLowerCase()) 
          );
          setFilteredStudent(filtered);
      }, [searchTerm,filteredStudent]);
        
        const handleCloseModal=()=>{
          setShowAddCourse(false);
         
        }
        const handleClickOpen = (row) => {
            console.log(row);
              setEditedData(row)// Set the selected row data
              setOpen(true); // Open the modal
             
            };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudentData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
      
        const currentDate = new Date().toISOString().split("T")[0]; // Today's date
        const dataToSubmit = { 
          ...studentData, 
          date: currentDate, // Ensure this is added
        };
      
        try {
          const response = await axios.post("http://160.153.175.69:8080/HachionUserDashboad/registerstudent/add", dataToSubmit);
          if (response.status === 200) {
            alert("Student added successfully");
            setStudentData([...studentData, dataToSubmit]); // Update local state
            handleReset(); // Clear form fields
          }
        } catch (error) {
          console.error("Error adding student:", error.message);
          alert("Error adding student.");
        }
      };
    const handleAddTrendingCourseClick = () => {setShowAddCourse(true);
    }
    useEffect(() => {
      const fetchCourse = async () => {
        try {
          const response = await axios.get("http://160.153.175.69:8080/HachionUserDashboad/courses/all");
          setCourse(response.data); // Assuming the data contains an array of trainer objects
        } catch (error) {
          console.error("Error fetching courses:", error.message);
        }
      };
      fetchCourse();
    }, []);

  return (
    
    <>  
     {showAddCourse ?  (      
           
       <div className='course-category'>
        <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
          <li className="breadcrumb-item">
                <a href="#!" onClick={() => setShowAddCourse(false)}>Register List</a> <MdKeyboardArrowRight />
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                Add Student
                </li>
              </ol>
            </nav>
    
     <div className='category'>
     <div className='category-header'>
     <p>Add Student</p>
     </div>
     <div className="course-row">
       <div class="col">
         <label for="inputEmail4" class="form-label">Student Name</label>
         <input type="text" class="schedule-input" id="inputEmail4" name="name"
  value={studentData.name}
  onChange={handleChange}/>
       </div>
       <div class="col">
         <label for="inputPassword4" class="form-label">Email</label>
         <input type="email" class="schedule-input" id="inputPassword4" placeholder='abc@gmail.com'
         name="email"
         value={studentData.email}
         onChange={handleChange}/>
       </div>
       <div class="col">
         <label for="inputPassword4" class="form-label">Mobile</label>
         <input type="number" class="schedule-input" id="inputPassword4" placeholder='Enter mobile number'
          name="mobile"
          value={studentData.mobile}
          onChange={handleChange}/>
       </div>
       </div>
       <div className="course-row">
       <div class="col">
         <label for="inputEmail4" class="form-label">Country</label>
         <input type="text" class="schedule-input" id="inputEmail4"  name="country"
         value={studentData.country}
         onChange={handleChange}/>
       </div>
       <div class="col">
         <label for="inputPassword4" class="form-label">Location</label>
         <input type="email" class="schedule-input" id="inputPassword4"  name="location"
         value={studentData.location}
         onChange={handleChange}/>
       </div>
       <div class="col">
         <label for="inputState" class="form-label">Visa Status</label>
         <select id="inputState" class="form-select" name="visa_status" value={studentData.visa_status} onChange={handleChange}>
           <option selected>Select Visa Status</option>
           <option>Active</option>
           <option>In Active</option>
         </select>
       </div>
       </div>
       <div className="course-row">
       <div class="col">
         <label for="inputState" class="form-label">Time Zone</label>
         <input type="text" class="schedule-input"
         name="time" value={studentData.time} onChange={handleChange}/>
       </div>
       <div class="col">
         <label for="inputState" class="form-label">Entered by</label>
         <input type="text" class="schedule-input"
         name="analyst_name" value={studentData.analyst_name} onChange={handleChange}/>
       </div>
       <div class="col">
         <label for="inputState" class="form-label">Source of Enquiry</label>
         <select id="inputState" class="form-select" name="source" value={studentData.source} onChange={handleChange}>
           <option selected>Select</option>
           <option>Linkedin</option>
           <option>Instagram</option>
           <option>Facebook</option>
           <option>Twitter</option>
         </select>
       </div>
       <div class="col">
         <label for="inputState" class="form-label">Course Name</label>
         <select id="inputState" class="form-select" name='course_name' value={studentData.course_name} onChange={handleChange}>
         <option value="" disabled>
          Select Course
        </option>
        {course.map((curr) => (
          <option key={curr.id} value={curr.courseName}>
            {curr.courseName}
          </option>
        ))}
   
         </select>
       </div>
       </div>
       <div className='row'>
       <div class="mb-3">
       <label for="exampleFormControlTextarea1" class="form-label">Remarks</label>
       <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"
       name='remarks' value={studentData.remarks} onChange={handleChange}></textarea>
     </div>
     <div class="mb-3">
       <label for="exampleFormControlTextarea1" class="form-label">Comments</label>
       <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"
       name='comments' value={studentData.comments} onChange={handleChange}></textarea>
     </div>
     </div>
           {/* <RadioGroup
             row
             aria-labelledby="demo-row-radio-buttons-group-label"
             name="row-radio-buttons-group"
           >
             <FormControlLabel value="female" control={<Radio />} label="Send details via only email" />
             <FormControlLabel value="male" control={<Radio />} label="Send details via only whatsapp" />
             <FormControlLabel value="male" control={<Radio />} label="Send details via email and whtsapp" />
           
           </RadioGroup> */}
        <div className="course-row">
  <button className='submit-btn' data-bs-toggle='modal'
                  data-bs-target='#exampleModal' onClick={handleSubmit}>Submit</button>
  <button className='reset-btn' onClick={handleReset}>Reset</button>
  </div>
     
     </div>
        
     </div>):(
        <>
<div>
   <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='course-category'>
       
        <div className='category'>
          <div className='category-header'>
            <p>Register List</p>
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
              <button type="button" className="btn-category" onClick={handleAddTrendingCourseClick} >
                <FiPlus /> Add Student
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
            <StyledTableCell align='center'>
              <Checkbox />
            </StyledTableCell>
            <StyledTableCell align='center'>S.No.</StyledTableCell>
            <StyledTableCell align='center'>Student Name</StyledTableCell>
            <StyledTableCell align='center'>Email</StyledTableCell>
            <StyledTableCell align="center">Mobile</StyledTableCell>
            <StyledTableCell align="center">Country</StyledTableCell>
            <StyledTableCell align="center">State</StyledTableCell>
            <StyledTableCell align="center">Location</StyledTableCell>
            <StyledTableCell align="center">Date</StyledTableCell>
            <StyledTableCell align="center">Time</StyledTableCell>
            <StyledTableCell align="center">Course Name</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell>
            <StyledTableCell align="center">Status Date</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
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
      <StyledTableCell align="center">{row.state}</StyledTableCell>
            <StyledTableCell align="center">{row.location}</StyledTableCell>
            <StyledTableCell align="center">{row.date}</StyledTableCell>
            <StyledTableCell align="center">{row.time}</StyledTableCell>
            <StyledTableCell align="center">{row.course_name}</StyledTableCell>
            <StyledTableCell align="center">{row.visa_status}</StyledTableCell>
            <StyledTableCell align="center">status date</StyledTableCell>
           
      <StyledTableCell align="center">
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
        <FaEdit className="edit" onClick={() => handleClickOpen(row)} />
        <RiDeleteBin6Line className="delete" onClick={() => handleDeleteConfirmation(row.student_id)} />
        </div>
      </StyledTableCell>
    </StyledTableRow>
  ))
  : (
    <StyledTableRow>
      <StyledTableCell colSpan={14} align="center">
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
              totalRows={filteredStudent.length} // Use the full list for pagination
              onPageChange={handlePageChange}
            />
                      </div>
    {message && <div className="success-message">{message}</div>}

    </div>
    </>)}

    <Dialog className="dialog-box" open={open} onClose={handleClose} aria-labelledby="edit-schedule-dialog"
    PaperProps={{
      style: { borderRadius: 20 },
    }}>
  <div >
    <DialogTitle className="dialog-title" id="edit-schedule-dialog">Edit Registered Student</DialogTitle>
    <Button onClick={handleClose} className="close-btn">
      <IoMdCloseCircleOutline style={{ color: "white", fontSize: "2rem" }} />
    </Button>
  </div>
  <DialogContent>
  <div className='course-row'>
  <div class="col">
         <label for="inputEmail4" class="form-label">Student Name</label>
         <input type="text" class="form-control" id="inputEmail4" name="name"
  value={editedData.name}
  onChange={handleInputChange}/>
       </div>
      
       <div class="col">
         <label for="inputPassword4" class="form-label">Mobile</label>
         <input type="number" class="form-control" id="inputPassword4" placeholder='enter mobile number'
          name="mobile"
          value={editedData.mobile}
          onChange={handleInputChange}/>
       </div>
       </div>
       <div className='course-row'>
       <div class="col">
         <label for="inputPassword4" class="form-label">Email</label>
         <input type="email" class="form-control" id="inputPassword4" placeholder='abc@gmail.com'
         name="email"
         value={editedData.email}
         onChange={handleInputChange}/>
       </div>
       <div class="col">
         <label for="inputPassword4" class="form-label">Password</label>
         <input type="text" class="form-control" id="inputPassword4" placeholder='abc@gmail.com'
         name="password"
         value={editedData.password}
         onChange={handleInputChange}/>
       </div>
       </div>
       <div className='course-row'>
       <div class="col">
         <label for="inputPassword4" class="form-label">Location</label>
         <input type="text" class="form-control" id="inputPassword4"  name="location"
         value={editedData.location}
         onChange={handleInputChange}/>
       </div>
       <div class="col">
         <label for="inputPassword4" class="form-label">State</label>
         <input type="text" class="form-control" id="inputPassword4"  name="state"
         value={editedData.state}
         onChange={handleInputChange}/>
       </div>
       </div>
       
       <div className='course-row'>
       <div class="col">
         <label for="inputEmail4" class="form-label">Time Zone</label>
         <input type="text" class="form-control" id="inputTime4" 
         name="time" value={editedData.time} onChange={handleInputChange}/>
       </div>
    
       <div class="col">
         <label for="inputState" class="form-label">Course Name</label>
         <select id="inputState" class="form-select" name='course_name' value={editedData.course_name} onChange={handleInputChange}>
         <option value="" disabled>
          Select Course
        </option>
        {course.map((curr) => (
          <option key={curr.id} value={curr.course_name}>
            {curr.course_name}
          </option>
        ))}
   
         </select>
       </div>
       </div>
       <div className='row'>
       <div class="mb-3">
       <label for="exampleFormControlTextarea1" class="form-label">Additional Email</label>
       <input class="form-control" id="exampleFormControlTextarea1" type='email'
       name='additinal_email' value={editedData.additional_email} onChange={handleInputChange}/>
     </div>
     <div class="mb-3">
       <label for="exampleFormControlTextarea1" class="form-label">Additional Mobile</label>
       <input class="form-control" id="exampleFormControlTextarea1" type="number"
       name='additional_mobile' value={editedData.additional_mobile} onChange={handleInputChange}/>
     </div>
     </div>
       
  </DialogContent>
  <DialogActions>
    <Button onClick={handleSave} className="update-btn">Update</Button>
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
                     Student Added Successfully
                        </p>
                      </div>
                    </div>
                    </div>
                    </div>
   
 </> );
}
