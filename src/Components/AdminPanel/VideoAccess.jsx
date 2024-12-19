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
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { MdKeyboardArrowRight } from 'react-icons/md';

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


export default function VideoAccess() {
  const [course,setCourse]=useState([]);
    const [trainers, setTrainers] = useState([]);
  const [searchTerm,setSearchTerm]=useState("")
    const [showAddCourse, setShowAddCourse] = useState(false);
    const[videoAccess,setVideoAccess]=useState([]);
    const[filteredVideo,setFilteredVideo]=useState([])
    const [open, setOpen] = React.useState(false);
    const currentDate = new Date().toISOString().split('T')[0];
    const[message,setMessage]=useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [editedData, setEditedData] = useState({category_name:"",course_name:"",description:"",trainer_name:"",user_email:"",permission:true});
    const [videoData, setVideoData] = useState([{
        videoaccess_id:"",
          category_name:"",
            course_name: "",
            date:currentDate,
            user_email:"",
            description:"",
            trainer_name:"",
            permission:false
         }]);
         const [currentPage, setCurrentPage] = useState(1);
         const [permission, setPermission] = useState(false); // Initial state: off (false)

         const handleSwitchToggle = () => {
           setPermission(!permission); // Toggle the permission state
         };
const rowsPerPage = 5;

const handlePageChange = (event, value) => {
    setCurrentPage(value);
};
const handlePermissionChange = (e) => {
    // Toggle the permission value based on the checkbox
    const updatedVideoData = [...videoAccess];  // Copy the current video data
    updatedVideoData[0].permission = e.target.checked;  // Update the permission for the first item (adjust accordingly if you have multiple items)
    setVideoAccess(updatedVideoData);  // Update the state
  };

const paginatedRows = filteredVideo.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
);

         const handleReset=()=>{
            setVideoData([{
                videoaccess_id:"",
                category_name:"",
                  course_name: "",
                  date:currentDate,
                  user_email:"",
                  trainer_name:"",
                  description:"",
                  permission:false
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
        const fetchTrainers = async () => {
          try {
            const response = await axios.get("http://localhost:8080/trainers");
            setTrainers(response.data); // Assuming the data contains an array of trainer objects
          } catch (error) {
            console.error("Error fetching trainers:", error.message);
          }
        };
        fetchTrainers();
      }, []);
    useEffect(() => {
      const fetchVideo = async () => {
          try {
              const response = await axios.get('http://localhost:8080/videoaccess');
              setVideoAccess(response.data); // Use the curriculum state
          } catch (error) {
              console.error("Error fetching video:", error.message);
          }
      };
      fetchVideo();
      setFilteredVideo(videoAccess)
  }, []); // Empty dependency array ensures it runs only once

    const handleDeleteConfirmation = (videoaccess_id) => {
        if (window.confirm("Are you sure you want to delete this User Video Access?")) {
          handleDelete(videoaccess_id);
        }
      };
  
      const handleDateFilter = () => {
        const filtered = videoAccess.filter((item) => {
          const videoDate = new Date(item.date); // Parse the date field
          const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
          const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
      
          return (
            (!start || videoDate >= start) &&
            (!end || videoDate <= end)
          );
        });
      
        setFilteredVideo(filtered);
      };
      const handleSave = async () => {
        try {
            const response = await axios.put(
                `http://localhost:8080/videoaccess/update/${editedData.videoaccess_id}`,editedData
            );
            setVideoAccess((prev) =>
                prev.map(curr =>
                    curr.videoaccess_id === editedData.videoaccess_id ? response.data : curr
                )
            );
            setMessage("Video status updated successfully!");
            setTimeout(() => setMessage(""), 5000);
            setOpen(false);
        } catch (error) {
            setMessage("Error updating Videos access.");
        }
    };
            
      const handleDelete = async (videoaccess_id) => {
       
         try { 
          const response = await axios.delete(`http://localhost:8080/videoaccess/delete/${videoaccess_id}`); 
          console.log("Demo Video deleted successfully:", response.data); 
        } catch (error) { 
          console.error("Error deleting Video:", error); 
        } }; 
        useEffect(() => {
          const filtered = videoAccess.filter(videoAccess =>
              videoAccess.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              videoAccess.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              videoAccess.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
              videoAccess.user_email.toLowerCase().includes(searchTerm.toLowerCase())||
              videoAccess.trainer_name.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setFilteredVideo(filtered);
      }, [searchTerm,filteredVideo]);
        
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
        setVideoData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
      
        const currentDate = new Date().toISOString().split("T")[0]; // Today's date
        const dataToSubmit = { 
          ...videoData, 
          date: currentDate, // Ensure this is added
        };
      
        try {
          const response = await axios.post("http://localhost:8080/videoaccess/add", dataToSubmit);
          if (response.status === 200) {
            alert("video details added successfully");
            setVideoData([...videoData, dataToSubmit]); // Update local state
            handleReset(); // Clear form fields
          }
        } catch (error) {
          console.error("Error adding video:", error.message);
          alert("Error adding video access.");
        }
      };
    const handleAddTrendingCourseClick = () => {setShowAddCourse(true);
    console.log(trainers.name)
    }
    useEffect(() => {
      const fetchCategory = async () => {
        try {
          const response = await axios.get("http://localhost:8080/course-categories/all");
          setCourse(response.data); // Assuming the data contains an array of trainer objects
        } catch (error) {
          console.error("Error fetching categories:", error.message);
        }
      };
      fetchCategory();
    }, []);

  return (
    
    <>  
     {showAddCourse ?  (<div className='course-category'>
      <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                      <a href="#!" onClick={() => setShowAddCourse(false)}> Video Access</a> <MdKeyboardArrowRight />
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        Add Category
                      </li>
                    </ol>
                  </nav>
<div className='category'>
<div className='category-header'>
<p>Add Video Access</p>
</div>
<div className='course-details'>
<div className='course-row'>
<div class="col-md-3">
    <label for="inputState" class="form-label">User Email</label>
    <select id="inputState" class="form-select" name='user_email' value={videoData.user_email} onChange={handleChange}>
      <option selected>Select User</option>
      <option>Monika@gmail.com</option>
      <option>Sirisha@gmail.com</option>
      <option>Dibyajyothi@gmail.com</option>
    
    </select>
  </div>
<div class="col-md-3">
    <label for="inputState" class="form-label">Trainer Name</label>
    <select id="inputState" class="form-select" name='category_name' value={videoData.category_name} onChange={handleChange}>
    <option value="" disabled>
          Select Trainer
        </option>
        {trainers.map((trainer) => (
          <option key={trainer.id} value={trainer.trainer_name}>
            {trainer.trainer_name}
          </option>
        ))}
      </select>
  </div>
  <div class="col-md-3">
    <label for="inputState" class="form-label">Category Name</label>
    <select id="inputState" class="form-select" name='category_name' value={videoData.category_name} onChange={handleChange}>
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
  <div class="col-md-3">
    <label for="inputState" class="form-label">Course Name</label>
    <select id="inputState" class="form-select" name='course_name' value={videoData.course_name} onChange={handleChange}>
      <option selected>Select course</option>
      <option>QA Automation</option>
      <option>Load Runner</option>
      <option>QA Manual Testing</option>
      <option>Mobile App Testing</option>
    </select>

</div>
  </div>
  <div class="mb-6">
  <label for="exampleFormControlTextarea1" class="form-label">Description</label>
  <textarea class="form-control" id="exampleFormControlTextarea1" rows="6"
  name="description"
  value={videoData.description}
  onChange={handleChange}></textarea>
</div>

<label>
  Permission:
  <input
    type="checkbox"
    checked={videoAccess.permission}  // Control checkbox state based on permission
    onChange={handlePermissionChange}  // Toggle permission state when clicked
  />
</label>
<div style={{display:'flex',flexDirection:'row'}}> 
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
              <button type="button" className="btn-category" onClick={handleAddTrendingCourseClick} >
                <FiPlus /> Add Video Access
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
            <StyledTableCell align='center'>S.No.</StyledTableCell>
            <StyledTableCell align='center'>Category Name</StyledTableCell>
            <StyledTableCell align='center'>Course Name</StyledTableCell>
            <StyledTableCell align="center">User Email</StyledTableCell>
            <StyledTableCell align="center">Description</StyledTableCell>
            <StyledTableCell align="center">Permission</StyledTableCell>
            <StyledTableCell align="center">Created Date</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
  {videoAccess.map((row, index) => (
    <StyledTableRow key={row.regularvideo_id}>
      <StyledTableCell>
        <Checkbox />
      </StyledTableCell>
      <StyledTableCell align="center">{index + 1}</StyledTableCell> {/* S.No. */}
      <StyledTableCell align="center">{row.category_name}</StyledTableCell>
      <StyledTableCell align="center">{row.course_name}</StyledTableCell>
      <StyledTableCell align="center">{row.user_email}</StyledTableCell>
      <StyledTableCell align="center">{row.description}</StyledTableCell>
      <StyledTableCell align="center">
  {row.permission ? "Enabled" : "Disabled"}
</StyledTableCell>
      <StyledTableCell align="center">{row.date}</StyledTableCell>
      <StyledTableCell align="center">
        <FaEdit className="edit" onClick={() => handleClickOpen(row)} />
        <RiDeleteBin6Line className="delete" onClick={() => handleDeleteConfirmation(row.videoaccess_id)} />
      </StyledTableCell>
    </StyledTableRow>
  ))}
</TableBody>
    </Table>
    </TableContainer>
    {message && <div className="success-message">{message}</div>}

    </div>)}

    <Dialog open={open} onClose={handleClose} aria-labelledby="edit-schedule-dialog">
  <div className="dialog-title">
    <DialogTitle id="edit-schedule-dialog">Edit  Video Access</DialogTitle>
    <Button onClick={handleClose} className="close-btn">
      <IoMdCloseCircleOutline style={{ color: "white", fontSize: "2rem" }} />
    </Button>
  </div>
  <DialogContent>
  <div class="col-md-3">
    <label for="inputState" class="form-label">User Email</label>
    <select id="inputState" class="form-select" name='user_email' value={editedData.user_email} onChange={handleInputChange}>
      <option selected>Select User</option>
      <option>Monika@gmail.com</option>
      <option>Sirisha@gmail.com</option>
      <option>Dibyajyothi@gmail.com</option>
    
    </select>
  </div>
<div class="col-md-3">
    <label for="inputState" class="form-label">Trainer Name</label>
    <select id="inputState" class="form-select" name='category_name' value={editedData.trainer_name} onChange={handleChange}>
    <option value="" disabled>
          Select Trainer
        </option>
        {trainers.map((trainer) => (
          <option key={trainer.id} value={trainer.trainer_name}>
            {trainer.trainer_name}
          </option>
        ))}
      </select>
  </div>
    <div className="col">
      <label htmlFor="categoryName" className="form-label">Category Name</label>
      <select
        id="categoryName"
        className="form-select"
        name="category_name"
        value={editedData.category_name || ""}
        onChange={handleInputChange}
      >
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
      <label htmlFor="courseName" className="form-label">Course Name</label>
      <select
        id="courseName"
        className="form-select"
        name="course_name"
        value={editedData.course_name || ""}
        onChange={handleInputChange}
      >
        <option value="">Select Course</option>
        <option>QA Automation</option>
        <option>Load Runner</option>
        <option>QA Automation Testing</option>
        <option>Mobile App Testing</option>
      </select>
    </div>


    <label htmlFor="topic">Description</label>
    <input
      id="topic"
      className="form-control"
      name="description"
      value={editedData.description || ""}
      onChange={handleInputChange}
    />
       
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
                     Video Added Successfully
                        </p>
                      </div>
                    </div>
                    </div>
                    </div>
   
 </> );
}
