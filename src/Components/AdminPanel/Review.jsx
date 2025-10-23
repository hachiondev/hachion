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


export default function Review() {
  const [course,setCourse]=useState([]);
   const [courseCategory,setCourseCategory]=useState([]);
  const [searchTerm,setSearchTerm]=useState("")
    const [showAddCourse, setShowAddCourse] = useState(false);
    const[review,setReview]=useState([]);
    const[filterCourse,setFilterCourse]=useState([]);
    const[filteredReview,setFilteredReview]=useState([])
    const [open, setOpen] = React.useState(false);
     const [successMessage, setSuccessMessage] = useState("");
      const [errorMessage, setErrorMessage] = useState("");
    const currentDate = new Date().toISOString().split('T')[0];
    const[message,setMessage]=useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedRow, setSelectedRow] = useState({category_name:"",course_name:"",student_name:"",image:null,rating: "",location: "", video_link: "",trainer_name:"",type:"",source:"",comment:""});
    const [editedData, setEditedData] = useState({category_name:"",course_name:"",student_name:"",image:null,rating: "",location: "", videoLink: "",trainer_name:"",type:"",source:"",comment:"",reviewType:"",display:"",
      displayPages:[]});
      const [trainerOptions, setTrainerOptions] = useState([]);
const [loadingTrainers, setLoadingTrainers] = useState(false);
    const [reviewData, setReviewData] = useState({
        review_id:"",
          category_name:"",
            course_name: "",
            date:currentDate,
            type:false,
           student_name:"",
           rating: "",
           location: "",
           videoLink: "",
           source:"",
           trainer_name: "",
           reviewType:"",
           comment:"",
           image:null,display:"",
           displayPages:[]
         });
         const [currentPage, setCurrentPage] = useState(1);
                    const [rowsPerPage, setRowsPerPage] = useState(10);
                    
                    const handlePageChange = (page) => {
                     setCurrentPage(page);
                     window.scrollTo(0, window.scrollY);
                   };
                   const handleEditCheckboxChange = (e) => {
                    const { value, checked } = e.target;
                    setEditedData((prev) => ({
                      ...prev,
                      display: checked 
                        ? [...prev.display, value]  
                        : prev.display.filter((item) => item !== value), 
                    }));
                  };
                
                   const handleCheckboxChange = (event) => {
                    const { value, checked } = event.target;
                    let updatedPages = [...reviewData.displayPages];
                
                    if (checked) {
                      updatedPages.push(value);
                    } else {
                      updatedPages = updatedPages.filter((page) => page !== value);
                    }
                
                    setReviewData({
                      ...reviewData,
                      displayPages: updatedPages,
                      display: updatedPages.length > 0 ? updatedPages.join(", ") : "", 
                    });
                  }; 
                 const handleRowsPerPageChange = (rows) => {
                   setRowsPerPage(rows);
                   setCurrentPage(1); 
                 };

             const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setEditedData(prev => ({ ...prev, image: file }));
  setReviewData(prev => ({ ...prev, image: file }));
};
  const displayedCategories = filteredReview.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
 
const handleDateFilter = () => {
  const filtered = review.filter((item) => {
    const itemDate = new Date(item.date || item.schedule_date);
    const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
    const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

    const inDateRange =
      (!start || itemDate >= start) &&
      (!end || itemDate <= end);

    const matchesSearch =
      (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.social_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.course_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.review || "").toLowerCase().includes(searchTerm.toLowerCase());

    return inDateRange && matchesSearch;
  });

  setFilteredReview(filtered);
  setCurrentPage(1);
};
const handleDateReset = () => {
  setStartDate(null);
  setEndDate(null);
  setSearchTerm('');
  setFilteredReview(review);
  setCurrentPage(1);
};

const fetchTrainerNames = async (categoryName, courseName) => {
  if (!categoryName || !courseName) {
    setTrainerOptions([]);
    return;
  }
  try {
    setLoadingTrainers(true);
    const response = await axios.get("https://api.test.hachion.co/trainernames", {
      params: { categoryName, courseName },
    });
    setTrainerOptions(Array.isArray(response.data) ? response.data : []);
  } catch (err) {
    console.error("Error fetching trainer names:", err);
    setTrainerOptions([]);
  } finally {
    setLoadingTrainers(false);
  }
};
useEffect(() => {
  const filtered = review.filter((item) => {
    const rawDate = item.date || item.schedule_date;
    const itemDate = rawDate ? new Date(rawDate) : null;

    const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
    const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

    const inDateRange =
      (!start || (itemDate && itemDate >= start)) &&
      (!end || (itemDate && itemDate <= end));

    const matchesSearch =
      (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.student_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.social_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.course_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.category_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.review || "").toLowerCase().includes(searchTerm.toLowerCase());

    return inDateRange && matchesSearch;
  });

  setFilteredReview(filtered);
  setCurrentPage(1);
}, [searchTerm, startDate, endDate, review]);

         const handleReset=()=>{
            setReviewData({
                review_id:"",
                category_name:"",
                  course_name: "",
                  date:currentDate,
                  type:"",
                 student_name:"",
                 rating: "",
                 location: "",
                 video_link: "",
                 source:"",
                 trainer_name: "",
                 comment:"",
                 image:null
                 });
        
         }
       
        const handleInputChange = (e) => {
  const { name, value } = e.target;
  setEditedData((prev) => {
    const next = { ...prev, [name]: value };
    if (name === "category_name" || name === "course_name") {
      next.trainer_name = "";
    }
    return next;
  });
};

    const handleClose = () => {
      setOpen(false); 
    };
    useEffect(() => {
      const fetchCourseCategory = async () => {
        try {
          const response = await axios.get("https://api.test.hachion.co/courses/all");
          setCourseCategory(response.data);
        } catch (error) {
          console.error("Error fetching categories:", error.message);
        }
      };
      fetchCourseCategory();
    }, []);


useEffect(() => {
  if (showAddCourse) {
    fetchTrainerNames(reviewData.category_name, reviewData.course_name);
  }
}, [reviewData.category_name, reviewData.course_name, showAddCourse]);


useEffect(() => {
  fetchTrainerNames(editedData.category_name, editedData.course_name);
}, [editedData.category_name, editedData.course_name]);

    useEffect(() => {
    const fetchReview = async () => {
        try {
            const response = await axios.get('https://api.test.hachion.co/userreview');
            const filteredReviews = response.data.filter(review => review.type === true);
            setReview(filteredReviews);
            setFilteredReview(filteredReviews);
        } catch (error) {
            console.error("Error fetching reviews:", error.message);
        }
    };

    fetchReview();
}, []);

    const handleSave = async () => {
      try {
        const formData = new FormData();
    
        const updatedReviewObject = {
          name: editedData.name,
          social_id: editedData.social_id,
          display: editedData.display.join(","), 
          course_name: editedData.course_name,
          review: editedData.review,
          location: editedData.location,
          videoLink: editedData.videoLink, 
          email: editedData.email || "",
          type: editedData.type || "",
          reviewType: editedData.reviewType || "",
          trainer_name: editedData.trainer_name || "",
          rating: editedData.rating || "",
          location: editedData.location || "",
          date: new Date().toISOString().split("T")[0],
        };
      
        formData.append("review", JSON.stringify(updatedReviewObject));
    
        if (editedData.image instanceof File) {
          formData.append("user_image", editedData.image);
        }
    
        const response = await axios.put(
          `https://api.test.hachion.co/userreview/update/${editedData.review_id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
    
        if (response.status === 200) {
          setReview((prev) =>
            prev.map((curr) =>
              curr.review_id === editedData.review_id ? response.data : curr
            )
          );
          setMessage("Review updated successfully!");
          setTimeout(() => setMessage(""), 5000);
          setOpen(false);
        }
      } catch (error) {
        console.error("Error updating review:", error);
        setMessage("Error updating Review.");
      }
    };

     const handleDeleteConfirmation = (review_id) => {
        if (window.confirm("Are you sure you want to delete this Review details")) {
          handleDelete(review_id);
        }
      };

const handleDelete = async (review_id) => {
  try {
    const response = await axios.delete(`https://api.test.hachion.co/userreview/delete/${review_id}`);
    console.log("Review deleted successfully:", response.data);

    
    setSuccessMessage("✅ Review deleted successfully.");
    setErrorMessage("");

    
    setReview(prevReviews => prevReviews.filter(review => review.id !== review_id));
    setFilteredReview(prevReviews => prevReviews.filter(review => review.id !== review_id));

  } catch (error) {
    console.error("Error deleting Review:", error);
    setErrorMessage("❌ Failed to delete review.");
    setSuccessMessage("");
  }
};

      const handleClickOpen = (curr) => {
  try {
    console.log("handleClickOpen called with:", curr);

    const safeDisplay = Array.isArray(curr?.display)
      ? curr.display
      : typeof curr?.display === "string" && curr.display.length > 0
        ? curr.display.split(",")
        : [];

    setEditedData({
  name: curr?.name || "",
  social_id: curr?.social_id || "",
  category_name: curr?.category_name || "",
  course_name: curr?.course_name || "",
  review: curr?.review || "",
  
  videoLink: curr?.videoLink,
  display: safeDisplay,
  email: curr?.email || "",
  type: curr?.type ?? true,
  reviewType: curr?.reviewType || "",
  trainer_name: curr?.trainer_name || "",
  rating: String(curr?.rating ?? ""),
  location: curr?.location || "",
  review_id: curr?.review_id || "",
  user_image: curr?.user_image,
});
fetchTrainerNames(curr?.category_name, curr?.course_name);


    setOpen(true);
  } catch (err) {
    console.error("Error in handleClickOpen:", err);
  }
};

const handleChange = (e) => {
  const { name, value } = e.target;
  setReviewData((prev) => {
    const next = { ...prev, [name]: value };
    if (name === "category_name" || name === "course_name") {
      next.trainer_name = "";
    }
    return next;
  });
};

    const handleSubmit = async (e) => {
      e.preventDefault();
      const currentDate = new Date().toISOString().split("T")[0];
  
       const fileInput = document.querySelector('input[type="file"]');
  if (fileInput && fileInput.files.length > 0) {
    reviewData.image = fileInput.files[0];
  }

      
      const reviewObject = {
          name: reviewData.student_name,
          social_id: reviewData.source,
          display:reviewData.display,
          course_name: reviewData.course_name,
          review: reviewData.comment,
          
           videoLink: reviewData.videoLink,
          email: reviewData.email || "",
          type: true,
          trainer_name: reviewData.trainer_name || "",
          rating: reviewData.rating || "",
          location: reviewData.location || "",
          reviewType: reviewData.reviewType,
          date: currentDate
      };
  
      const formData = new FormData();
      formData.append("review", JSON.stringify(reviewObject)); 
  
      if (reviewData.image) {
          formData.append("user_image", reviewData.image); 
      }
  
      try {
          const response = await axios.post(
              "https://api.test.hachion.co/userreview/add",
              formData,
              {
                  headers: {
                      "Content-Type": "multipart/form-data",
                  },
              }
          );
  
          if (response.status === 201) { 
              alert("Review added successfully!");
              setReviewData({ student_name: "", source: "", display:"", category_name: "", course_name: "", comment: "",reviewType:"", image: null,rating: "", });

          }
      } catch (error) {
          console.error("Error adding review:", error);
          alert("Error adding review.");
      }
  };
  
    
    const handleAddTrendingCourseClick = () => {setShowAddCourse(true);
    }
    useEffect(() => {
      const fetchCategory = async () => {
        try {
          const response = await axios.get("https://api.test.hachion.co/course-categories/all");
          setCourse(response.data); 
        } catch (error) {
          console.error("Error fetching categories:", error.message);
        }
      };
      fetchCategory();
    }, []);
    
useEffect(() => {
          if (reviewData.category_name) {
            const filtered = courseCategory.filter(
              (course) => course.courseCategory === reviewData.category_name
            );
            setFilterCourse(filtered);
          } else {
            setFilterCourse([]); 
          }
        }, [reviewData.category_name, courseCategory]);

  return (
    
    <>  
     {showAddCourse ?  (<div className='course-category'>
      <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                      <a href="#!" onClick={() => setShowAddCourse(false)}>Review</a> <MdKeyboardArrowRight />
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        Add Review
                      </li>
                    </ol>
                  </nav>
<div className='category'>
<div className='category-header'>
<p style={{ marginBottom: 0 }}>Add Review</p>
</div>
<div className='course-details'>
<div className="course-row">
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

<div className="col-md-3">
        <label htmlFor="course" className="form-label">Course Name</label>
        <select
          id="course"
          className="form-select"
          name="course_name"
          value={reviewData.course_name}
          onChange={handleChange}
          disabled={!reviewData.category_name}
        >
          <option value="" disabled>Select Course</option>
          {filterCourse.map((curr) => (
            <option key={curr.id} value={curr.courseName}>{curr.courseName}</option>
          ))}
        </select>
      </div>
  </div>
<div className='course-row'>
<div class="col-md-4">
  <label for="exampleFormControlTextarea1" class="form-label">Student Name</label>
  <input type="text" id="inputtext6" class="form-control" placeholder='Enter Student Name' aria-describedby="passwordHelpInline"
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
    <div class="col-md-2">
      <label for="exampleFormControlTextarea1" class="form-label">Student Rating(5 star)</label>
     <input
  type="number"
  id="inputtext6"
  class="form-control"
  name="rating"
  value={reviewData.rating === "" ? "" : Number(reviewData.rating)}
  min="0"
  max="5"
  onChange={(e) => {
    let val = e.target.value;

    if (val === "") {
      setReviewData(prev => ({ ...prev, rating: "" }));
      return;
    }

    val = val.replace(/^0+/, "");

    let num = Number(val);
    if (isNaN(num)) num = "";
    else if (num > 5) num = 5;

    setReviewData(prev => ({ ...prev, rating: num }));
  }}
/>

      </div>
              <div class="col-md-2">
    <label for="inputState" class="form-label">Source</label>
    <select id="inputState" class="form-select" name='source' value={reviewData.source} onChange={handleChange}>
      <option value="">Select</option>
  <option value="Linkedin">LinkedIn</option>
  <option value="Facebook">Facebook</option>
  <option value="Twitter">Twitter</option>
  <option value="Instagram">Instagram</option>
  <option value="Google">Google</option>
    </select>
</div>
</div>
<div className='course-row'>
  <div class="col-md-2">
  <label for="exampleFormControlTextarea1" class="form-label">Location</label>
  <input type="text" id="inputtext6" class="form-control" placeholder='Enter Location' aria-describedby="passwordHelpInline"
  name="location"
  value={reviewData.location}
  onChange={handleChange}/></div>
  <div class="col-md-4">
  <label for="exampleFormControlTextarea1" class="form-label">Video Review Link</label>
  <input type="link" id="inputtext6" class="form-control" placeholder='Enter youtube link' aria-describedby="passwordHelpInline"
  name="videoLink"
  value={reviewData.videoLink}
  onChange={handleChange}/></div>
      <div class="col-md-2">
    <label for="inputState" class="form-label">Review Type</label>
    <select
  id="inputState"
  className="form-select"
  name="reviewType"
  value={reviewData.reviewType}
  onChange={handleChange}
>
  <option value="">Select</option>
  <option value="Course">Course</option>
  <option value="Trainer">Trainer</option>
  <option value="Both">Both</option>
</select>
</div>

    <div className="col-md-4">
   <label className="form-label">Trainer Name</label>
   <select
     className="form-select"
    name="trainer_name"
    value={reviewData.trainer_name || ""}
onChange={handleChange}
    disabled={!(reviewData.reviewType === "Trainer" || reviewData.reviewType === "Both")}
     style={{ cursor: !(reviewData.reviewType === "Trainer" || reviewData.reviewType === "Both") ? "not-allowed" : "auto" }}
   >
     <option value="">
       {loadingTrainers ? "Loading..." : "Select Trainer"}
     </option>
     {trainerOptions.map(t => (
       <option key={t} value={t}>{t}</option>
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

<div style={{paddingTop: "10px"}}>
  <label htmlFor="display" className="form-label">
    Display Reviews:
  </label>
  </div>
  <div className="course-row">
        {[
          { id: "homePage", value: "home", label: "Home Page" },
          { id: "aboutPage", value: "about", label: "About Us Page" },
          { id: "coursePage", value: "course", label: "Course Page" },
          { id: "corporateTrainingPage", value: "corporate", label: "Corporate Training Page" },
        ].map(({ id, value, label }) => (
          <div className="checkbox-group" key={id}>
            <input
              className="form-check-input"
              type="checkbox"
              id={id}
              name="displayPages"
              value={value}
              
              onChange={handleCheckboxChange}
            />
            <label className="form-check-label" htmlFor={id}>
              {label}
            </label>
          </div>
        ))}
      </div>
      <div>
        <strong>Selected Display:</strong> {reviewData.display || "None"}
      
</div>

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
            <p style={{ marginBottom: 0 }}>Review</p>
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
           <button className="filter" onClick={handleDateFilter}>Filter</button>
           <button className="filter" onClick={handleDateReset}>Reset</button>           
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
                <input className="search-input" type="search" placeholder="Enter Name, Technology or Keywords" aria-label="Search"
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
            <StyledTableCell align='center' sx={{ width: '100px' }}>
              <Checkbox />
            </StyledTableCell>
            <StyledTableCell align='center' sx={{ width: '100px' }}>S.No.</StyledTableCell>
            <StyledTableCell align='center'>Images</StyledTableCell>
            <StyledTableCell align='center'>Student Name</StyledTableCell>
            <StyledTableCell align="center">Source</StyledTableCell>
            <StyledTableCell align="center">Location</StyledTableCell>
            <StyledTableCell align="center">Video Link</StyledTableCell>
            <StyledTableCell align="center">Review Type</StyledTableCell>
            <StyledTableCell align="center">Trainer</StyledTableCell>
            <StyledTableCell align="center">Technology</StyledTableCell>
            <StyledTableCell align="center">Comment </StyledTableCell>
            <StyledTableCell align="center">Date </StyledTableCell>
            <StyledTableCell align="center" sx={{ width: '150px' }}>Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {displayedCategories.length > 0 ? (
  displayedCategories.map((curr, index) => (
    <StyledTableRow key={curr.review_id}>
      <StyledTableCell align="center">
        <Checkbox />
        
      </StyledTableCell>
      <StyledTableCell align="center">{index + 1 + (currentPage - 1) * rowsPerPage}</StyledTableCell> {/* S.No. */}
    
        <StyledTableCell align="center">
  {curr.user_image ? (
    <img
      src={`https://api.test.hachion.co/userreview/${curr.user_image}`}
      alt="User"
      width="50"
      height="50"
    />
  ) : (
    'No Image'
  )}
</StyledTableCell>
      <StyledTableCell align="left">{curr.name}</StyledTableCell>
      <StyledTableCell align="center">{curr.social_id}</StyledTableCell>
      <StyledTableCell align="center">{curr.location}</StyledTableCell>
      <StyledTableCell align="center">{curr.videoLink}</StyledTableCell>
      <StyledTableCell align="center">{curr.reviewType}</StyledTableCell>
      <StyledTableCell align="center">{curr.trainer_name}</StyledTableCell>
      <StyledTableCell align="left">{curr.course_name}</StyledTableCell>
      <StyledTableCell align="left"
      style={{ maxWidth: '800px', wordWrap: 'break-word', whiteSpace: 'pre-line' }}>{curr.review}</StyledTableCell>
     <StyledTableCell align="center">{curr.date
                               ? dayjs(curr.date).format("MM-DD-YYYY")
                               : "N/A"}</StyledTableCell>
      <StyledTableCell align="center">
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <FaEdit className="edit" onClick={() => handleClickOpen(curr)} />
        <RiDeleteBin6Line className="delete" onClick={() => handleDeleteConfirmation(curr.review_id)} />
        </div>
      </StyledTableCell>
    </StyledTableRow>
 ))
) : (
  <p>No Data available</p>
)}
</TableBody>
    </Table>
    {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}
    </TableContainer>
    <div className='pagination-container'>
              <AdminPagination
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalRows={filteredReview.length} 
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
    <DialogTitle id="edit-schedule-dialog">Edit  Review</DialogTitle>
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
    </div>
    <div className="course-row">
  <div class="col">
  <label for="exampleFormControlTextarea1" class="form-label">Student Name</label>
  <input type="text" id="inputtext6" class="schedule-input" aria-describedby="passwordHelpInline"
  name="name"
  value={editedData.name}
  onChange={handleInputChange}/>
  </div>
  <div className="col">
                <label className="form-label">Image</label>
                <input
                  type="file"
                  className="schedule-input"
                  name="image"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div class="col">
    <label for="inputState" class="form-label">Source</label>
    <select id="inputState" class="form-select"  name="social_id"
  value={editedData.social_id} onChange={handleInputChange}>
    <option value="">Select</option>
  <option value="Linkedin">LinkedIn</option>
  <option value="Facebook">Facebook</option>
  <option value="Twitter">Twitter</option>
  <option value="Instagram">Instagram</option>
  <option value="Google">Google</option>
    </select>
</div>
</div>

<div className="course-row">
        <div class="col">
    <label for="inputState" class="form-label">Student Rating</label>
   <input
  type="number"
  id="inputtext6"
  class="schedule-input"
  name="rating"
  value={editedData.rating === "" ? "" : Number(editedData.rating)}
  min="0"
  max="5"
  onChange={(e) => {
    let val = e.target.value;

    
    if (val === "") {
      setEditedData(prev => ({ ...prev, rating: "" }));
      return;
    }

    

    val = val.replace(/^0+/, "");

    let num = Number(val);
    if (isNaN(num)) num = "";
    else if (num > 5) num = 5;

    setEditedData(prev => ({ ...prev, rating: num }));
  }}
/>

  </div>
  <div class="col">
  <label for="exampleFormControlTextarea1" class="form-label">Location</label>
  <input type="text" id="inputtext6" class="schedule-input" aria-describedby="passwordHelpInline"
  name="location"
  value={editedData.location}
  onChange={handleInputChange}/>
  </div>
  <div class="col">
    <label for="inputState" class="form-label">Review Type</label>
    <select id="inputState" class="form-select"  name="reviewType"
  value={editedData.reviewType} onChange={handleInputChange}>
  <option value="">Select</option>
  <option value="Course">Course</option>
  <option value="Trainer">Trainer</option>
  <option value="Both">Both</option>
    </select>
</div>
</div>

<div className="course-row">
    <div class="col">
  <label for="exampleFormControlTextarea1" class="form-label">Video Review Link</label>
  <input type="text" id="inputtext6" class="schedule-input" aria-describedby="passwordHelpInline"
  name="videoLink"
  value={editedData.videoLink}
  onChange={handleInputChange}/>
  </div>

  <div className="col">
  <label className="form-label">Trainer Name</label>
  <select
    className="form-select"
    name="trainer_name"
    value={editedData.trainer_name || ""}
    onChange={handleInputChange}
    disabled={!(editedData.reviewType === "Trainer" || editedData.reviewType === "Both")}
    style={{ cursor: !(editedData.reviewType === "Trainer" || editedData.reviewType === "Both") ? "not-allowed" : "auto" }}
  >
    <option value="">
      {loadingTrainers ? "Loading..." : "Select Trainer"}
    </option>
    {trainerOptions.map(t => (
      <option key={t} value={t}>{t}</option>
    ))}
    {/* If the existing trainer isn't in the fetched list, still show it */}
    {editedData.trainer_name &&
      !trainerOptions.includes(editedData.trainer_name) && (
        <option value={editedData.trainer_name}>{editedData.trainer_name}</option>
    )}
  </select>
</div>
</div>

    <div class="mb-6">
  <label for="exampleFormControlTextarea1" class="form-label">Comment</label>
  <textarea class="form-control" id="exampleFormControlTextarea1" rows="6"
  name="review"
  value={editedData.review}
  onChange={handleInputChange}></textarea>
</div>

<div style={{paddingTop: "10px"}}>
  <label htmlFor="display" className="form-label">
    Display Reviews:
  </label>
  </div>
  
  <input
  className="form-check-input"
  type="checkbox"
  id="homePage"
  name="displayPages"
  value="home"
  checked={editedData.display?.includes("home")}
  onChange={handleEditCheckboxChange}
/>
<label className="form-check-label" htmlFor="homePage">
  Home Page
</label>

<input
  className="form-check-input"
  type="checkbox"
  id="aboutPage"
  name="displayPages"
  value="about"
  checked={editedData.display?.includes("about")}
  onChange={handleEditCheckboxChange}
/>
<label className="form-check-label" htmlFor="aboutPage">
  About Us Page
</label>

<input
  className="form-check-input"
  type="checkbox"
  id="coursePage"
  name="displayPages"
  value="course"
  checked={editedData.display?.includes("course")}
  onChange={handleEditCheckboxChange}
/>
<label className="form-check-label" htmlFor="homePage">
  Course Page
</label>

<input
  className="form-check-input"
  type="checkbox"
  id="corporatePage"
  name="displayPages"
  value="corporate"
  checked={editedData.display?.includes("corporate")}
  onChange={handleEditCheckboxChange}
/>
<label className="form-check-label" htmlFor="aboutPage">
  Corporate Page
</label>


  </DialogContent>
  <DialogActions className="update" style={{ display: 'flex', justifyContent: 'center' }}>
    <Button onClick={handleSave} className="update-btn">Update</Button>
  </DialogActions>
</Dialog>

 </> );
}