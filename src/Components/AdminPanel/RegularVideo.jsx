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
import { MdKeyboardArrowRight } from 'react-icons/md';
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


export default function RegularVideo() {
    const [courseCategory,setCourseCategory]=useState([]);
  const [course,setCourse]=useState([]);
  const [searchTerm,setSearchTerm]=useState("")
    const [showAddCourse, setShowAddCourse] = useState(false);
    const[regularVideo,setRegularVideo]=useState([]);
    const[filteredVideo,setFilteredVideo]=useState([])
    const [open, setOpen] = React.useState(false);
    const [rows, setRows] = useState([{ id:"",video_link:"",video_description:"",week:"",day:"",video_duration:"" }]);
    const currentDate = new Date().toISOString().split('T')[0];
    const[message,setMessage]=useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [editedRow, setEditedRow] = useState({category_name:"",course_name:"",video_link:"",video_description:"",week:"",day:"",video_duration:""});
    const [videoData, setVideoData] = useState([{
        regularvideo_id:"",
          category_name:"",
            course_name: "",
            date:currentDate,
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
                 
                 // Slice filteredVideo based on rowsPerPage and currentPage
                 const displayedCategories = filteredVideo.slice(
                   (currentPage - 1) * rowsPerPage,
                   currentPage * rowsPerPage
                 );

         const handleReset=()=>{
            setVideoData([{
                regularvideo_id:"",
                  category_name:"",
                    course_name: "",
                    date:""
                 }]);
        
         }
         const addRow = () => {
          setRows([...rows, { id: Date.now(), video_link: "", video_description: "",week:"",day:"",video_duration:"" }]);
      };
      
      const deleteRow = (id) => {
          setRows(rows.filter(row => row.id !== id));
      };;
    const handleClose = () => {
      setOpen(false); // Close the modal
    };
    useEffect(() => {
      const fetchVideo = async () => {
          try {
              const response = await axios.get('https://api.hachion.co/regularvideo');
              setRegularVideo(response.data); // Use the curriculum state
          } catch (error) {
              console.error("Error fetching video:", error.message);
          }
      };
      fetchVideo();
      setFilteredVideo(regularVideo)
  }, [regularVideo]); // Empty dependency array ensures it runs only once

    const handleDeleteConfirmation = (regularvideo_id) => {
        if (window.confirm("Are you sure you want to delete this Video?")) {
          handleDelete(regularvideo_id);
        }
      };
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedRow((prev) => ({
          ...prev,
          [name]: value,
        }));
      };
      useEffect(() => {
        const fetchCategory = async () => {
          try {
            const response = await axios.get("https://api.hachion.co/course-categories/all");
            setCourse(response.data); // Assuming the data contains an array of trainer objects
          } catch (error) {
            console.error("Error fetching categories:", error.message);
          }
        };
        fetchCategory();
      }, []);
      const handleDateFilter = () => {
        const filtered = regularVideo.filter((item) => {
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
                `https://api.hachion.co/regularvideo/update/${editedRow.regularvideo_id}`,
                editedRow
            );
            setRegularVideo((prev) =>
                prev.map(curr =>
                    curr.regularvideo_id === editedRow.regularvideo_id ? response.data : curr
                )
            );
            setMessage("Video updated successfully!");
            setTimeout(() => setMessage(""), 5000);
            setOpen(false);
        } catch (error) {
            setMessage("Error updating Demo Videos.");
        }
    };
            
      const handleDelete = async (regularvideo_id) => {
       
         try { 
          const response = await axios.delete(`https://api.hachion.co/regularvideo/delete/${regularvideo_id}`); 
          console.log("Demo Video deleted successfully:", response.data); 
        } catch (error) { 
          console.error("Error deleting Video:", error); 
        } }; 
        useEffect(() => {
          const filtered = regularVideo.filter(regularVideo =>
              regularVideo.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              regularVideo.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              regularVideo.video_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
              regularVideo.video_duration.toLowerCase().includes(searchTerm.toLowerCase())||
              regularVideo.week.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setFilteredVideo(filtered);
      }, [searchTerm,regularVideo]);
        
        const handleCloseModal=()=>{
          setShowAddCourse(false);
         
        }
        const handleClickOpen = (row) => {
          console.log(row);
            setEditedRow(row)// Set the selected row data
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
          const response = await axios.post("https://api.hachion.co/regularvideo/add", dataToSubmit);
          if (response.status === 200) {
            alert("video details added successfully");
            setVideoData([...videoData, dataToSubmit]); // Update local state
            handleReset(); // Clear form fields
          }
        } catch (error) {
          console.error("Error adding video:", error.message);
          alert("Error adding video.");
        }
      };
    const handleAddTrendingCourseClick = () => setShowAddCourse(true);
  return (
    
    <>  
     {showAddCourse ?  (<div className='course-category'>
      <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                      <a href="#!" onClick={() => setShowAddCourse(false)}>Regular Videos</a> <MdKeyboardArrowRight />
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        Add Regular Videos
                      </li>
                    </ol>
                  </nav>
<div className='category'>
<div className='category-header'>
<p>Add Regular Video</p>
</div>
<div className='course-details'>
<div className='course-row'>
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
  <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650,marginTop:5 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align='center'>Video Link</StyledTableCell>
            <StyledTableCell align="center">Description</StyledTableCell>
            <StyledTableCell align="center">Week</StyledTableCell>
            <StyledTableCell align="center">Day</StyledTableCell>
            <StyledTableCell align="center">Duration</StyledTableCell>
            <StyledTableCell align="center">Add/Delete Row</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: '1px solid #d3d3d3 ' } }}
            >
              <StyledTableCell component="th" scope="row" align='center' sx={{ padding: 0, }}>
               <input className='table-curriculum' name='video_link' value={rows.video_link} onChange={handleChange}/>
              </StyledTableCell>
              <StyledTableCell align="center" sx={{ padding: 0, }}><input className='table-curriculum' name='video_description' value={rows.video_description} onChange={handleChange}/></StyledTableCell>
              <StyledTableCell align="center" sx={{ padding: 0, }}><input className='table-curriculum' name='week' value={rows.week} onChange={handleChange}/></StyledTableCell>
              <StyledTableCell align="center" sx={{ padding: 0, }}><input className='table-curriculum' name='day' value={rows.day} onChange={handleChange}/></StyledTableCell>
              <StyledTableCell align="center" sx={{ padding: 0, }}><input className='table-curriculum' name='video_duration' value={rows.video_duration} onChange={handleChange}/></StyledTableCell>
              <StyledTableCell align="center" sx={{ padding: 0, }}><><GoPlus style={{fontSize:'2rem',color:'#00AEEF',marginRight:'10px'}} onClick={addRow} />
                    <IoClose style={{fontSize:'2rem',color:'red'}} onClick={()=>deleteRow(row.id)} /></></StyledTableCell>
                  </StyledTableRow>
    
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  
    <div className="course-row">
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
            <p>Regular Videos</p>
          </div>
          <div className='date-schedule'>
            Start Date
            <DatePicker 
    selected={startDate} 
    onChange={(date) => setStartDate(date)} 
    isClearable
    sx={{
      '& .MuiIconButton-root':{color: '#00aeef'}
   }} />
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
                <FiPlus /> Add Regular Video
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
            <StyledTableCell align='center' sx={{ width: '100px' }}>
              <Checkbox />
            </StyledTableCell>
            <StyledTableCell align='center' sx={{ width: '100px' }}>S.No.</StyledTableCell>
            <StyledTableCell align='center'>Category Name</StyledTableCell>
            <StyledTableCell align='center'>Course Name</StyledTableCell>
            <StyledTableCell align="center">Video</StyledTableCell>
            <StyledTableCell align="center">Description</StyledTableCell>
            <StyledTableCell align="center">Week</StyledTableCell>
            <StyledTableCell align="center">Day</StyledTableCell>
            <StyledTableCell align="center">Duration</StyledTableCell>
            <StyledTableCell align="center">Created Date</StyledTableCell>
            <StyledTableCell align="center" sx={{ width: '100px' }}>Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {displayedCategories.length > 0 ? (
  displayedCategories.map((row, index) => (
    <StyledTableRow key={row.regularvideo_id}>
      <StyledTableCell align='center' sx={{ width: '100px' }}>
        <Checkbox />
      </StyledTableCell>
      <StyledTableCell align="center">{index + 1 + (currentPage - 1) * rowsPerPage}</StyledTableCell> {/* S.No. */}
      <StyledTableCell align="left">{row.category_name}</StyledTableCell>
      <StyledTableCell align="left">{row.course_name}</StyledTableCell>
      <StyledTableCell align="left">{row.video_link}</StyledTableCell>
      <StyledTableCell align="left">{row.video_description}</StyledTableCell>
      <StyledTableCell align="center">{row.week}</StyledTableCell>
      <StyledTableCell align="center">{row.day}</StyledTableCell>
      <StyledTableCell align="center">{row.video_duration}</StyledTableCell>
      <StyledTableCell align="center">{row.date}</StyledTableCell>
      <StyledTableCell align="center">
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <FaEdit className="edit" onClick={() => handleClickOpen(row)} />
        <RiDeleteBin6Line className="delete" onClick={() => handleDeleteConfirmation(row.regularvideo_id)} />
        </div>
      </StyledTableCell>
    </StyledTableRow>
  ))
) : (
  <p>No categories available</p>
)}
</TableBody>
    </Table>
    </TableContainer>
    <div className='pagination-container'>
              <AdminPagination
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalRows={filteredVideo.length} // Use the full list for pagination
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
    <DialogTitle id="edit-schedule-dialog">Edit Regular Video</DialogTitle>
    <Button onClick={handleClose} className="close-btn">
      <IoMdCloseCircleOutline style={{ color: "white", fontSize: "2rem" }} />
    </Button>
  </div>
  <DialogContent>
  <div className="course-row">
    <div className="col">
      <label htmlFor="categoryName" className="form-label">Category Name</label>
      <select
        id="categoryName"
        className="form-select"
        name="category_name"
        value={editedRow.category_name || ""}
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
        value={editedRow.course_name || ""}
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

    <div className="col">
    <label htmlFor="title">Video Link</label>
    <input
      id="title"
      className="form-control"
      name="video_link"
      value={editedRow.video_link || ""}
      onChange={handleInputChange}
    />
    </div>

  <div className="col">
    <label htmlFor="topic">Description</label>
    <input
      id="topic"
      className="form-control"
      name="video_description"
      value={editedRow.video_description || ""}
      onChange={handleInputChange}
    />
    </div>

<div className="course-row">
<div className="col">
       <label htmlFor="topic">Week</label>
    <input
      id="topic"
      className="schedule-input"
      name="week"
      value={editedRow.week || ""}
      onChange={handleInputChange}
    />
    </div>
    <div className="col">
       <label htmlFor="topic">Day</label>
    <input
      id="topic"
      className="schedule-input"
      name="day"
      value={editedRow.day || ""}
      onChange={handleInputChange}
    />
    </div>
    <div className="col">
     <label htmlFor="topic">Duration</label>
    <input
      id="duration"
      className="schedule-input"
      name="video_duration"
      value={editedRow.video_duration || ""}
      onChange={handleInputChange}
    />
    </div>
    </div>
  </DialogContent>
  <DialogActions className="update" style={{ display: 'flex', justifyContent: 'center' }}>
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
                    Regular Video Added Successfully
                        </p>
                      </div>
                    </div>
                    </div>
                    </div>
   
 </> );
}
