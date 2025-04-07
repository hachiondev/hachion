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
import { RiCloseCircleLine } from 'react-icons/ri';
import success from '../../Assets/success.gif';
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
import Switch from '@mui/material/Switch';
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


export default function CorporateCourses() {
  const [category,setCategory]=useState([]);
  const [course,setCourse]=useState([]);
  const [searchTerm,setSearchTerm]=useState("")
    const [showAddCourse, setShowAddCourse] = useState(false);
    const[trendingCourse,setTrendingCourse]=useState([]);
    const[filteredCourse,setFilteredCourse]=useState([]);
     const[filterCourse,setFilterCourse]=useState([]);
    const [open, setOpen] = React.useState(false);
    const currentDate = new Date().toISOString().split('T')[0];
    const[message,setMessage]=useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [editedData, setEditedData] = useState({category_name:"",course_name:"",status:false});
    const [courseData, setCourseData] = useState({
        corporatecourse_id:"",
          category_name:"",
            course_name: "",
            date:currentDate,
            status:false
         });
const [currentPage, setCurrentPage] = useState(1);
   const [rowsPerPage, setRowsPerPage] = useState(10);
   const [status, setStatus] = useState(false);
   
   const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, window.scrollY);
  };
  // Inside your CourseCategory component

const handleRowsPerPageChange = (rows) => {
  setRowsPerPage(rows);
  setCurrentPage(1); // Reset to the first page whenever rows per page changes
};

const handleSwitchToggle = () => {
  setStatus(!status); 
};
useEffect(() => {
  if (courseData.category_name) {
    const filtered = course.filter(
      (course) => course.courseCategory === courseData.category_name
    );
    setFilterCourse(filtered);
  } else {
    setFilterCourse([]); // Reset when no category is selected
  }
}, [courseData.category_name, course]);
// const handleStatusChange = (e) => {
//  if (!courseData || !courseData[0]) {
//      console.error("courseData or the first item is undefined");
//      return;
//  }

//  const updatedCourseData = [...courseData]; // Copy the current video data
//  updatedCourseData[0].status = e.target.checked; // Update the permission for the first item
//  setCourseData(updatedCourseData); // Update the state
// };

const handleStatusChange = (e) => {
  setCourseData((prevData) => ({
    ...prevData,
    status: e.target.checked,
  }));
};

const handleInputStatusChange = (e) => {
  setEditedData((prevData) => ({
    ...prevData,
    status: e.target.checked,
  }));
};

// Slice filteredCourse based on rowsPerPage and currentPage
const displayedCourse = filteredCourse.slice(
  (currentPage - 1) * rowsPerPage,
  currentPage * rowsPerPage
);
// const handleStatusChange = () => {
//   setCourseData((prev) => ({ ...prev, status: !prev.status }));
// };
// const handleInputStatusChange = () => {
//   setEditedData((prev) => ({ ...prev, status: !prev.status }));
// };

         const handleReset=()=>{
            setCourseData([{
                corporatecourse_id:"",
                category_name:"",
                  course_name: "",
                  date:currentDate,
                  status:false
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
      const fetchCourse = async () => {
          try {
              const response = await axios.get('https://api.hachion.co/corporatecourse');
              setTrendingCourse(response.data); // Use the curriculum state
          } catch (error) {
              console.error("Error fetching video:", error.message);
          }
      };
      fetchCourse();
      setFilteredCourse(trendingCourse)
  }, []); // Empty dependency array ensures it runs only once

    const handleDeleteConfirmation = (corporatecourse_id) => {
        if (window.confirm("Are you sure you want to delete this Course?")) {
          handleDelete(corporatecourse_id);
        }
      };
  
      const handleDateFilter = () => {
        const filtered = trendingCourse.filter((item) => {
          const videoDate = new Date(item.date); // Parse the date field
          const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
          const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
      
          return (
            (!start || videoDate >= start) &&
            (!end || videoDate <= end)
          );
        });
      
        setFilteredCourse(filtered);
      };
      const handleSave = async () => {
        try {
            const response = await axios.put(
                `https://api.hachion.co/corporatecourse/update/${editedData.corporatecourse_id}`,editedData
            );
            setTrendingCourse((prev) =>
                prev.map(curr =>
                    curr.corporatecourse_id === editedData.corporatecourse_id ? response.data : curr
                )
            );
            setMessage("Trending Course updated successfully!");
            setTimeout(() => setMessage(""), 5000);
            setOpen(false);
        } catch (error) {
            setMessage("Error updating Courses.");
        }
    };
            
      const handleDelete = async (corporatecourse_id) => {
       
         try { 
          const response = await axios.delete(`https://api.hachion.co/corporatecourse/delete/${corporatecourse_id}`); 
          console.log("Trending Courses deleted successfully:", response.data); 
        } catch (error) { 
          console.error("Error deleting Courses:", error); 
        } }; 
        useEffect(() => {
          const filtered = trendingCourse.filter(trendingCourse =>
              trendingCourse.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              trendingCourse.category_name.toLowerCase().includes(searchTerm.toLowerCase()) 
          );
          setFilteredCourse(filtered);
      }, [searchTerm,filteredCourse]);
        
        const handleCloseModal=()=>{
          setShowAddCourse(false);
         
        }
        const handleClickOpen = (row) => {
            console.log(row);
              setEditedData(row)// Set the selected row data
              setOpen(true); // Open the modal
             
            };
    
            const handleChange = (e) => {
              console.log(e.target.name, e.target.value); // Check which field and value are changing
              setCourseData({
                ...courseData,
                [e.target.name]: e.target.value,
              });
            };
            
      const handleSubmit = async (e) => {
        e.preventDefault();
      
        const currentDate = new Date().toISOString().split("T")[0]; // Today's date
        const dataToSubmit = { 
          ...courseData, 
          date: currentDate, // Ensure this is added
        };
      
        try {
          const response = await axios.post("https://api.hachion.co/corporatecourse/add", dataToSubmit);
          if (response.status === 200) {
            alert("Courses added successfully");
            setCourseData([...courseData, dataToSubmit]); // Update local state
            handleReset(); // Clear form fields
          }
        } catch (error) {
          console.error("Error adding courses:", error.message);
          alert("Error adding course.");
        }
      };
    const handleAddTrendingCourseClick = () => {setShowAddCourse(true);

    }
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
      const fetchCourses = async () => {
        try {
          const response = await axios.get("https://api.hachion.co/courses/all");
          console.log("API response:", response.data); // Check the API response
          if (Array.isArray(response.data)) {
            setCourse(response.data); // Update state
          } else {
            console.log("Unexpected response format:", response.data);
          }
        } catch (error) {
          console.log("Error fetching courses:", error.message);
        }
      };
    
      fetchCourses();
    }, []);
    
    useEffect(() => {
      console.log("Updated course state:", course); // Logs whenever 'course' state updates
    }, [course]);
    

  return (
    
    <>  
     {showAddCourse ?  (
      <div className='course-category'>
        <h3>Corporate Training Courses</h3>
        <nav aria-label="breadcrumb">
                      <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                        <a href="#!" onClick={() => setShowAddCourse(false)}>Corporate Training Courses</a> <MdKeyboardArrowRight />
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                        Add Corporate Course
                        </li>
                      </ol>
                    </nav>

   <div className="category">
      <div className="category-header">
        <p>Add Corporate Course</p>
      </div>
<div className='course-details'>
<div className='course-row'>

  <div class="col-md-3">
    <label for="inputState" class="form-label">Category Name</label>
    <select id="inputState" class="form-select" name='category_name' value={courseData.category_name} onChange={handleChange}>
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
  <label htmlFor="inputState" className="form-label">
        Course Name
      </label>
      <select
  id="inputState"
  className="form-select"
  name="course_name"
  value={courseData.course_name}
  onChange={handleChange}
  disabled={!courseData.category_name}
>
  <option value="" disabled>Select Course</option>
          {filterCourse.map((curr) => (
            <option key={curr.id} value={curr.courseName}>{curr.courseName}</option>
          ))}
        </select>
</div>
  </div>

  <div className="col" style={{ display: 'flex', gap: 20 }}> 
    <label className="form-label">Status:</label>
    <Switch
  checked={courseData?.status ?? false}
  onChange={handleStatusChange}
  color="primary"
/>
<span>{courseData?.status ? 'Enable' : 'Disable'}</span>
      </div>

  {/* <label>
        Status:
        <input
          type="checkbox"
          checked={courseData.status}
          onChange={handleStatusChange}
        />
      </label> */}
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
      <h3>Corporate Training Courses</h3>
        <div className='category'>
          <div className='category-header'>
            <p>View Corporate Training Courses</p>
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
                <FiPlus /> Add Corporate Course
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
            <StyledTableCell sx={{ width: 70 }} align="center">
            <Checkbox
              />
            </StyledTableCell>
            <StyledTableCell sx={{ width: 80 }} align='center'>S.No.</StyledTableCell>
            <StyledTableCell align='center'>Category Name</StyledTableCell>
            <StyledTableCell align='center'>Course Name</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell>
            <StyledTableCell align="center">Created Date</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>

    {displayedCourse.length > 0
    ? displayedCourse.map((row, index) => (
            <StyledTableRow key={row.corporatecourse_id}>
              <StyledTableCell align="center">
                          <Checkbox />
                        </StyledTableCell>
              <StyledTableCell align="center">{index + 1 + (currentPage - 1) * rowsPerPage}
              </StyledTableCell>
              <StyledTableCell align="left">{row.category_name}</StyledTableCell>
              <StyledTableCell align="left">{row.course_name}</StyledTableCell>
              <StyledTableCell align="center">
                {row.status ? "Enabled" : "Disabled"}
              </StyledTableCell>
              <StyledTableCell align="center">{row.date}</StyledTableCell>
              <StyledTableCell align="center">
              <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
                <FaEdit className="edit" onClick={() => handleClickOpen(row)} />
                <RiDeleteBin6Line
                  className="delete"
                  onClick={() => handleDeleteConfirmation(row.corporatecourse_id)}
                />
                </div>
              </StyledTableCell>
            </StyledTableRow>
          ))
          : (
            <StyledTableRow>
              <StyledTableCell colSpan={6} align="center">
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
      totalRows={filteredCourse.length} // Use the full list for pagination
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
    <DialogTitle className="dialog-title" id="edit-schedule-dialog">Edit Corporate Course
    <Button onClick={handleClose} className="close-btn">
      <IoMdCloseCircleOutline style={{ color: "white", fontSize: "2rem" }} />
    </Button>
    </DialogTitle>
  </div>
  <DialogContent>
  
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
        {category.map((curr) => (
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
        <option value="" disabled>
    Select Course
  </option>
  {course.length > 0 ? (
    course.map((current) => (
      <option key={current.id} value={current.courseName}>
        {current.courseName}
      </option>
    ))
  ) : (
    <option disabled>No Courses Available</option>
  )}
      </select>
    </div>

    <div className="col" style={{ display: 'flex', gap: 20 }}> 
    <label className="form-label">Status:</label>
    <Switch
  checked={editedData?.status ?? false}
  onChange={handleInputStatusChange}
  color="primary"
/>
<span>{editedData?.status ? 'Enable' : 'Disable'}</span>
      </div>

    {/* <label>
        Status:
        <input
          type="checkbox"
          checked={editedData.status}
          onChange={handleInputStatusChange}
        />
      </label> */}
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
                     Courses Successfully
                        </p>
                      </div>
                    </div>
                    </div>
                    </div>
   
 </> );
}