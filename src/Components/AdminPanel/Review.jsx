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
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
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


export default function Review() {
  const [course,setCourse]=useState([]);
   const[courseCategory,setCourseCategory]=useState([]);
  const [searchTerm,setSearchTerm]=useState("")
    const [showAddCourse, setShowAddCourse] = useState(false);
    const[review,setReview]=useState([]);
    const[filteredReview,setFilteredReview]=useState([])
    const [open, setOpen] = React.useState(false);
    const currentDate = new Date().toISOString().split('T')[0];
    const[message,setMessage]=useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [editedData, setEditedData] = useState({category_name:"",course_name:"",student_name:"",image:null,source:"",comment:""});
    const [reviewData, setReviewData] = useState([{
        review_id:"",
          category_name:"",
            course_name: "",
            date:currentDate,
           student_name:"",
           source:"",
           comment:"",
           image:null
         }]);
         const [currentPage, setCurrentPage] = useState(1);
  

const rowsPerPage = 5;

const handlePageChange = (event, value) => {
    setCurrentPage(value);
};

const handleFileChange = (e) => {
    setReviewData((prev) => ({ ...prev, image: e.target.files[0] }));
  };
const paginatedRows = filteredReview.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
);

         const handleReset=()=>{
            setReviewData([{
                review_id:"",
                category_name:"",
                  course_name: "",
                  date:currentDate,
                 student_name:"",
                 source:"",
                 comment:"",
                 image:null
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
      const fetchReview = async () => {
          try {
              const response = await axios.get('http://localhost:8080/review');
              setReview(response.data); // Use the curriculum state
          } catch (error) {
              console.error("Error fetching resume:", error.message);
          }
      };
      fetchReview();

      setFilteredReview(review);
  }, []); // Empty dependency array ensures it runs only once

    const handleDeleteConfirmation = (review_id) => {
        if (window.confirm("Are you sure you want to delete this Resume details")) {
          handleDelete(review_id);
        }
      };
  
    //   const handleDateFilter = () => {
    //     const filtered = review.filter((item) => {
    //       const videoDate = new Date(item.date); // Parse the date field
    //       const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
    //       const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
      
    //       return (
    //         (!start || videoDate >= start) &&
    //         (!end || videoDate <= end)
    //       );
    //     });
      
    //     setFilteredReview(filtered);
    //   };
      const handleSave = async () => {
        try {
            const response = await axios.put(
                `http://localhost:8080/review/update/${editedData.review_id}`,editedData
            );
            setReview((prev) =>
                prev.map(curr =>
                    curr.review_id === editedData.review_id ? response.data : curr
                )
            );
            setMessage("Review updated successfully!");
            setTimeout(() => setMessage(""), 5000);
            setOpen(false);
        } catch (error) {
            setMessage("Error updating Review.");
        }
    };
            
      const handleDelete = async (review_id) => {
       
         try { 
          const response = await axios.delete(`http://localhost:8080/review/delete/${review_id}`); 
          console.log("Review deleted successfully:", response.data); 
        } catch (error) { 
          console.error("Error deleting Review:", error); 
        } }; 
        useEffect(() => {
          const filtered = review.filter(review =>
              review.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              review.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              review.student_name.toLowerCase().includes(searchTerm.toLowerCase()) 
            
          );
          setFilteredReview(filtered);
      }, [searchTerm,filteredReview]);
      useEffect(() => {
        const fetchCourseCategory = async () => {
          try {
            const response = await axios.get("http://localhost:8080/courses/all");
            setCourseCategory(response.data); // Assuming the data contains an array of trainer objects
          } catch (error) {
            console.error("Error fetching categories:", error.message);
          }
        };
        fetchCourseCategory();
      }, []);
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
        setReviewData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
      console.log(review);
        const currentDate = new Date().toISOString().split("T")[0]; // Today's date
        const dataToSubmit = { 
          ...reviewData, 
          date: currentDate, // Ensure this is added
        };
      
        try {
          const response = await axios.post("http://localhost:8080/review/add", dataToSubmit);
          if (response.status === 200) {
            alert("Reviews added successfully");
            setReviewData([...reviewData, dataToSubmit]); // Update local state
            handleReset(); // Clear form fields
          }
        } catch (error) {
          console.error("Error adding review:", error.message);
          alert("Error adding review.");
        }
      };
    const handleAddTrendingCourseClick = () => {setShowAddCourse(true);
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
<p> Review <IoIosArrowForward/> Add Review </p>
<div className='category'>
<div className='category-header'>
<p>Add Review</p>
</div>
<div className='course-details'>
<div className='course-row'>
<div class="mb-6">
  <label for="exampleFormControlTextarea1" class="form-label">Student Name</label>
  <input type="text" id="inputtext6" class="form-control" aria-describedby="passwordHelpInline"
  name="student_name"
  value={reviewData.student_name}
  onChange={handleChange}/></div>
  <div className="col-md-4">
                <label className="form-label">Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="image"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div class="col-md-3">
    <label for="inputState" class="form-label">Source</label>
    <select id="inputState" class="form-select" name='source' value={reviewData.source} onChange={handleChange}>
      <option selected>Select </option>
      <option>Linkedin</option>
      <option>Facebook</option>
      <option>Twitter</option>
      <option>Instagram</option>
    </select>

</div>
  <div class="col-md-3">
    <label for="inputState" class="form-label">Category Name</label>
    <select id="inputState" class="form-select" name='category_name' value={reviewData.category_name} onChange={handleChange}>
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
    <select id="inputState" class="form-select" name='course_name' value={reviewData.course_name} onChange={handleChange}>
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
  <div class="mb-6">
  <label for="exampleFormControlTextarea1" class="form-label">Comment</label>
  <textarea class="form-control" id="exampleFormControlTextarea1" rows="6"
  name="comment"
  value={reviewData.comment}
  onChange={handleChange}></textarea>
</div>

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
            <p>Review</p>
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
            <button className='filter' >filter</button>
           
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
                <FiPlus /> Add Reviews
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
            <StyledTableCell align='center'>Images</StyledTableCell>
            <StyledTableCell align='center'>Student Name</StyledTableCell>
            <StyledTableCell align="center">Source</StyledTableCell>
            <StyledTableCell align="center">Technology</StyledTableCell>
            <StyledTableCell align="center">Comment </StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
  {review.map((curr, index) => (
    <StyledTableRow key={curr.review_id}>
      <StyledTableCell>
        <Checkbox />
      </StyledTableCell>
      <StyledTableCell align="center">{index + 1}</StyledTableCell> {/* S.No. */}
      <StyledTableCell align="center">{curr.image}</StyledTableCell>
      <StyledTableCell align="center">{curr.student_name}</StyledTableCell>
      <StyledTableCell align="center">{curr.source}</StyledTableCell>
      <StyledTableCell align="center">{curr.course_name}</StyledTableCell>
      <StyledTableCell align="center">{curr.comment}</StyledTableCell>
     
      <StyledTableCell align="center">
        <FaEdit className="edit" onClick={() => handleClickOpen(curr)} />
        <RiDeleteBin6Line className="delete" onClick={() => handleDeleteConfirmation(curr.review_id)} />
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
    <DialogTitle id="edit-schedule-dialog">Edit  Review</DialogTitle>
    <Button onClick={handleClose} className="close-btn">
      <IoMdCloseCircleOutline style={{ color: "white", fontSize: "2rem" }} />
    </Button>
  </div>
  <DialogContent>
  <div class="mb-6">
  <label for="exampleFormControlTextarea1" class="form-label">Student Name</label>
  <input type="text" id="inputtext6" class="form-control" aria-describedby="passwordHelpInline"
  name="student_name"
  value={editedData.student_name}
  onChange={handleInputChange}/></div>
  <div className="col-md-4">
                <label className="form-label">Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="image"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div class="col-md-3">
    <label for="inputState" class="form-label">Source</label>
    <select id="inputState" class="form-select" name='source' value={editedData.source} onChange={handleInputChange}>
      <option selected>Select </option>
      <option>Linkedin</option>
      <option>Facebook</option>
      <option>Twitter</option>
      <option>Instagram</option>
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
    <div class="mb-6">
  <label for="exampleFormControlTextarea1" class="form-label">Comment</label>
  <textarea class="form-control" id="exampleFormControlTextarea1" rows="6"
  name="comment"
  value={editedData.comment}
  onChange={handleInputChange}></textarea>
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
                     Review Added Successfully
                        </p>
                      </div>
                    </div>
                    </div>
                    </div>
   
 </> );
}
