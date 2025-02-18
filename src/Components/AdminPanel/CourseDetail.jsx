import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import './Admin.css';
import success from '../../Assets/success.gif';
import { RiCloseCircleLine } from 'react-icons/ri';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { IoSearch } from 'react-icons/io5';
import { FiPlus } from 'react-icons/fi';
import { MdKeyboardArrowRight } from 'react-icons/md';
import AdminPagination from './AdminPagination'; 

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#00AEEF',
    color: theme.palette.common.white,
    borderRight: '1px solid white',
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
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

const CourseDetail = ({
  pageTitle = 'Course',
  headerTitle = 'View Courses List',
  buttonLabel = 'Add Courses',
 
}) => {
  const [formMode, setFormMode] = useState('Add'); 
  const [course,setCourse]=useState([]);
  const [searchTerm,setSearchTerm]=useState("");
  const[courses,setCourses]=useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddCourse,setShowAddCourse]=useState(false);
  const [filteredCourses,setFilteredCourses]=useState([])
  const[message,setMessage]=useState(false);
  const currentDate = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [formData, setFormData] = useState({course_id:"",title: '',courseName: '',courseImage: "",youtubeLink: '',numberOfClasses: '',dailySessions: '',liveTrainingHours: '', labExerciseHours: '', realTimeProjects: '',courseCategory:"",starRating: '',
    ratingByNumberOfPeople: '',totalEnrollment: '',courseCategory: '',keyHighlights1:'',keyHighlights2:'',keyHighlights3:'',
    keyHighlights4:'',keyHighlights5:'',keyHighlights6:'',amount:'',discount:'',total:'',mamount:'',mdiscount:'',mtotal:'',samount:'',stotal:'',sdiscount:'',camount:'',cdiscount:'',ctotal:'',mentoring1:'',mentoring2:'',self1:'',
    self2:'',headerTitle:'',courseKeyword:'',courseKeywordDescription:'',courseHighlight:'',courseDescription:'',date:currentDate,
  });
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

  useEffect(() => {
    const fetchCourses = async () => {
        try {
            const response = await axios.get('https://api.hachion.co/courses/all');
            setCategories(response.data); // Use the curriculum state
        } catch (error) {
            console.error("Error fetching couses:", error.message);
        }
    };
    fetchCourses();
    setFilteredCourses(categories)
}, [categories]);
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

const handleFileChange = (e) => {
  setFormData((prev) => ({ ...prev, courseImage: e.target.files[0] }));
};
const handleSubmit = async (e) => {
  e.preventDefault();

  const currentDate = new Date().toISOString().split("T")[0]; // Today's date
  const courseData = {
    courseCategory: formData.courseCategory,
    courseName: formData.courseName,
    date: currentDate,
    youtubeLink: formData.youtubeLink,
    liveTrainingHours: formData.liveTrainingHours,
    labExerciseHours: formData.labExerciseHours,
    realTimeProjects: formData.realTimeProjects,
    starRating: formData.starRating,
    ratingByNumberOfPeople: formData.ratingByNumberOfPeople,
    totalEnrollment: formData.totalEnrollment,
    keyHighlights1: formData.keyHighlights1,
    keyHighlights2: formData.keyHighlights2,
    keyHighlights3: formData.keyHighlights3,
    keyHighlights4: formData.keyHighlights4,
    keyHighlights5: formData.keyHighlights5,
    keyHighlights6: formData.keyHighlights6,
    amount: formData.amount,discount: formData.discount,total: formData.total,
    mamount: formData.mamount,mdiscount: formData.mdiscount,mtotal: formData.mtotal,
    samount: formData.samount,sdiscount: formData.sdiscount,stotal: formData.stotal,
    camount: formData.camount,cdiscount: formData.cdiscount,ctotal: formData.ctotal,
    mentoring1: formData.mentoring1,
    mentoring2: formData.mentoring2,
    self1: formData.self1,
    self2: formData.self2,
    headerTitle: formData.headerTitle,
    courseKeyword: formData.courseKeyword,
    courseKeywordDescription: formData.courseKeywordDescription,
    courseHighlight: formData.courseHighlight,
    courseDescription: formData.courseDescription,
  };
  console.log("Course Data:", courseData);

  const formNewData = new FormData();
  formNewData.append("course", JSON.stringify(courseData));
  if (formData.courseImage && typeof formData.courseImage !== "string") {
    formNewData.append("courseImage", formData.courseImage);
  }

  try {
    if (formMode === "Edit") {
      const response = await axios.put(
        `https://api.hachion.co/courses/update/${formData.id}`,
        formNewData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        alert("Course updated successfully");
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.id === formData.id ? response.data : course
          )
        );
        setShowAddCourse(false); // Close the form after update
      }
    } else {
      const response = await axios.post("https://api.hachion.co/courses/add", formNewData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        alert("Course added successfully");
        setCourses((prevCourses) => [...prevCourses, response.data]);
        setShowAddCourse(false); // Close the form after add
      }
    }
  } catch (error) {
    console.error("Error submitting course:", error.response?.data || error.message);
    alert("Error submitting course.");
  }
};

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
  
const handleReset=()=>{
  setFormData({
    course_id:"",
    title: '',
    courseName: '',
    courseImage: null,
    youtubeLink: '',
    numberOfClasses: '',
    dailySessions: '',
    liveTrainingHours: '',
    labExerciseHours: '',
    realTimeProjects: '',
    starRating: '',
    ratingByNumberOfPeople: '',
    totalEnrollment: '',
    courseCategory: '',
    date:""
       });

}
const handleDeleteConfirmation = (id) => {
  if (window.confirm("Are you sure you want to delete this Courses?")) {
    handleDelete(id);
  }
};
const handleDelete = async (id) => {
       
  try { 
   const response = await axios.delete(`https://api.hachion.co/courses/delete/${id}`); 
   console.log("Courses deleted successfully:", response.data); 
 } catch (error) { 
   console.error("Error deleting Curriculum:", error); 
 } }; 

   
 const handleCloseModal=()=>{
  setShowAddCourse(false);
 
}
const handleEditClick = async (courseId) => {
  
  console.log(courseId)
  setShowAddCourse(true);
  try {
    const response = await fetch(`https://api.hachion.co/courses/${courseId}`);
    if (response.ok) {
      const course = await response.json();
      setFormData({
        id: course.id, // Ensure the unique identifier is included
       courseCategory: course.courseCategory ,
        courseName: course.courseName ,
        courseImage: course.courseImage, // Handle file uploads differently if needed
        youtubeLink: course.youtubeLink ,
        numberOfClasses: course.numberOfClasses ,
        dailySessions: course.dailySessions ,
        liveTrainingHours: course.liveTrainingHours ,
        labExerciseHours: course.labExerciseHours ,
        realTimeProjects: course.realTimeProjects,
        starRating: course.starRating ,
        ratingByNumberOfPeople: course.ratingByNumberOfPeople,
        totalEnrollment: course.totalEnrollment,
        keyHighlights1:course.keyHighlights1,
        keyHighlights2:course.keyHighlights2,
        keyHighlights3:course.keyHighlights3,
        keyHighlights4:course.keyHighlights4,
        keyHighlights5:course.keyHighlights5,
        keyHighlights6:course.keyHighlights6,
        amount:course.amount,discount:course.discount,total:course.total,
        mamount:course.mamount,mdiscount:course.mdiscount,mtotal:course.mtotal,
        camount:course.camount,cdiscount:course.cdiscount,ctotal:course.ctotal,
        samount:course.samount,sdiscount:course.sdiscount,stotal:course.stotal,
        mentoring1:course.mentoring1,
        mentoring2:course.mentoring2,
        self1:course.self1,
    self2:course.self2,
    headerTitle:course.headerTitle,courseKeyword:course.courseKeyword,courseKeywordDescription:course.courseDescription,
    courseHighlight:course.courseHighlight,courseDescription:course.courseDescription
            });
            
            setFormMode('Edit');
            
           
    } else {
      console.error('Failed to fetch course data');
    }
  } catch (error) {
    console.error('Error fetching course data:', error);
  }
};

  const handleAddTrendingCourseClick = () => {
    setFormMode('Add'); // Explicitly set formMode to 'Add'
    setShowAddCourse(true); // Show the form
    handleReset(); // Reset the form fields for a clean form
  };
  
  return (<>{
    showAddCourse?(  
       <div className="course-category">
      <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                <a href="#!" onClick={() => {
                setShowAddCourse(false); // Hide the add/edit form
                setFormMode('Add'); // Reset to 'Add' mode
                handleReset(); // Clear any existing form data
            }}>
              Course Details
            </a>
            <MdKeyboardArrowRight />
                </li>
                <li className="breadcrumb-item active" aria-current="page">
      {formMode === 'Add' ? 'Add Course Details' : 'Edit Course Details'}
    </li>
              </ol>
            </nav>
      <div className="category">
        <div className="category-header">
          <p>{formMode === 'Add' ? 'Add Course Details' : 'Edit Course Details'}</p>
        </div>
        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}
         <form onSubmit={handleSubmit} enctype="multipart/form-data">
          <div className="course-details">
          <div className='course-details'>
            <div className="course-row">
              <div className="col-md-4">
                <label className="form-label">Category Name</label>
                <select id="inputState" class="form-select" name='courseCategory' value={formData.courseCategory} onChange={handleInputChange}>
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
              <div className="col-md-4">
                <label className="form-label">Course Name</label>
                <input
                  type="text"
                  name="courseName"
                  className="form-control"
                  placeholder="Enter Course Name"
                  value={formData.courseName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Course Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="courseImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>
            </div>
            <div className="course-row">
              <div className="col-md-4">
                <label className="form-label">Youtube Link</label>
                <input
                  type="text"
                  name="youtubeLink"
                  className="form-control"
                  placeholder="Enter Youtube Link"
                  value={formData.youtubeLink}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">No. of Classes</label>
                <input
                  type="number"
                  name="numberOfClasses"
                  className="form-control"
                  placeholder="Enter number of classes"
                  value={formData.numberOfClasses}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Daily Sessions</label>
                <input
                  type="text"
                  name="dailySessions"
                  className="form-control"
                  placeholder="Enter daily session details"
                  value={formData.dailySessions}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="course-row">
              <div className="col-md-4">
                <label className="form-label">Live Training Hours</label>
                <input
                  type="text"
                  name="liveTrainingHours"
                  className="form-control"
                  placeholder="Enter live training hours"
                  value={formData.liveTrainingHours}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Lab Exercise Hours</label>
                <input
                  type="text"
                  name="labExerciseHours"
                  className="form-control"
                  placeholder="Enter lab exercise hours"
                  value={formData.labExerciseHours}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Real Time Projects</label>
                <input
                  type="text"
                  name="realTimeProjects"
                  className="form-control"
                  placeholder="Enter projects"
                  value={formData.realTimeProjects}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="course-row">
              <div className="col-md-4">
                <label className="form-label">Star Rating</label>
                <input
                  type="text"
                  name="starRating"
                  className="form-control"
                  placeholder="Enter rating"
                  value={formData.starRating}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Rating by No. of People</label>
                <input
                  type="text"
                  name="ratingByNumberOfPeople"
                  className="form-control"
                  placeholder="Enter rating count"
                  value={formData.ratingByNumberOfPeople}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Certified Students</label>
                <input
                  type="text"
                  name="totalEnrollment"
                  className="form-control"
                  placeholder="Enter Certified Students"
                  value={formData.totalEnrollment}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            </div>

            <div className='course-details'>
            <h3>Key Highlights</h3>
              <div className='course-row'>
                <div class="col-md-4">
                  <label for="inputEmail4" class="form-label">Key Highlights 1</label>
                  <input type="text" class="form-control" id="inputEmail4" name='keyHighlights1' value={formData.keyHighlights1} onChange={handleInputChange} />
                </div>
                <div class="col-md-4">
                  <label for="inputEmail4" class="form-label">Key Highlights 2</label>
                  <input type="text" class="form-control" id="inputEmail4" name='keyHighlights2' value={formData.keyHighlights2} onChange={handleInputChange}  />
                </div>
                <div class="col-md-4">
                  <label for="inputEmail4" class="form-label">Key Highlights 3</label>
                  <input type="text" class="form-control" id="inputEmail4" name='keyHighlights3' value={formData.keyHighlights3} onChange={handleInputChange}  />
                </div>
              </div>
              <div className='course-row'>
<div class="col-md-4">
<label for="inputEmail4" class="form-label">Key Highlights 4</label>
<input type="text" class="form-control" id="inputEmail4" name='keyHighlights4' value={formData.keyHighlights4} onChange={handleInputChange}  />
</div>
<div class="col-md-4">
<label for="inputEmail4" class="form-label">Key Highlights 5</label>
<input type="text" class="form-control" id="inputEmail4" name='keyHighlights5' value={formData.keyHighlights5} onChange={handleInputChange}  />
</div>
<div class="col-md-4">
<label for="inputEmail4" class="form-label">Key Highlights 6</label>
<input type="text" class="form-control" id="inputEmail4" name='keyHighlights6' value={formData.keyHighlights6} onChange={handleInputChange}  />
</div>
</div>
</div> 
<h3>Mode Of Training</h3>
<div className='course-row'>
<div className='course-mode'>
<div class="form-check">
<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
<label class="form-check-label" for="flexCheckDefault">
Live Training
</label>
</div>
<div class="col-md-4">
<label for="inputEmail4" class="form-label">Amount</label>
<input type="number" class="form-control-mode" id="inputEmail4" name='amount' value={formData.amount} onChange={handleInputChange}/>
</div>
<div class="col-md-4">
<label for="inputEmail4" class="form-label">Discount%</label>
<input type="number" class="form-control-mode" id="inputEmail4" name='discount'value={formData.discount} onChange={handleInputChange} />
</div>
<div class="col-md-4">
<label for="inputEmail4" class="form-label">Total</label>
<input type="number" class="form-control-mode" id="inputEmail4" name='total' value={formData.total} onChange={handleInputChange}/>
</div>
</div>
<div className='course-mode'>
<div class="form-check">
<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
<label class="form-check-label" for="flexCheckDefault">
Mentoring Mode
</label>
</div>
<div class="col-md-3">
<label for="inputEmail4" class="form-label">Amount</label>
<input type="number" class="form-control-mode" id="inputEmail4" name='mamount' value={formData.mamount} onChange={handleInputChange} />
</div>
<div class="col-md-3">
<label for="inputEmail4" class="form-label">Discount%</label>
<input type="number" class="form-control-mode" id="inputEmail4" name='mdiscount' value={formData.mdiscount} onChange={handleInputChange}/>
</div>
<div class="col-md-3">
<label for="inputEmail4" class="form-label">Total</label>
<input type="number" class="form-control-mode" id="inputEmail4" name='mtotal' value={formData.mtotal} onChange={handleInputChange} />
</div>
</div>
<div className='course-mode'>
<div class="form-check">
<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
<label class="form-check-label" for="flexCheckDefault">
Self Placed Training
</label>
</div>
<div class="col-md-3">
<label for="inputEmail4" class="form-label">Amount</label>
<input type="number" class="form-control-mode" id="inputEmail4" name='samount' value={formData.samount} onChange={handleInputChange} />
</div>
<div class="col-md-3">
<label for="inputEmail4" class="form-label">Discount%</label>
<input type="number" class="form-control-mode" id="inputEmail4" name='sdiscount' value={formData.sdiscount} onChange={handleInputChange}/>
</div>
<div class="col-md-3">
<label for="inputEmail4" class="form-label">Total</label>
<input type="number" class="form-control-mode" id="inputEmail4" name='stotal' value={formData.stotal} onChange={handleInputChange}/>
</div>
</div>

<div className='course-mode'>
<div class="form-check">
<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
<label class="form-check-label" for="flexCheckDefault">
Corporate Training
</label>
</div>
<div class="col-md-3">
<label for="inputEmail4" class="form-label">Amount</label>
<input type="number" class="form-control-mode" id="inputEmail4"name='camount' value={formData.camount} onChange={handleInputChange} />
</div>
<div class="col-md-3">
<label for="inputEmail4" class="form-label">Discount%</label>
<input type="number" class="form-control-mode" id="inputEmail4" name='cdiscount' value={formData.cdiscount} onChange={handleInputChange} />
</div>
<div class="col-md-3">
<label for="inputEmail4" class="form-label">Total</label>
<input type="number" class="form-control-mode" id="inputEmail4" name='ctotal' value={formData.ctotal} onChange={handleInputChange}/>
</div>
</div>
</div>
</div>
<h3>Sample session</h3>
<div className='course-row'>
<div className='course-details'>
<h4>Mentoring Training</h4>
<div className='course-col'>
<div class="col-md-4">
<label for="inputEmail4" class="form-label">Day 1</label>
<input type="number" class="form-control-sample" id="inputEmail4" name='mentoring1' value={formData.mentoring1} onChange={handleInputChange} />
</div>
<div class="col-md-4">
<label for="inputEmail4" class="form-label">Day 2</label>
<input type="number" class="form-control-sample" id="inputEmail4" name='mentoring2' value={formData.mentoring2} onChange={handleInputChange}/>
</div>
</div>

</div>
<div className='course-details'>
<h4>Self Paced Training</h4>
<div className='course-col'>
<div class="col-md-4">
<label for="inputEmail4" class="form-label">Day 1</label>
<input type="text" class="form-control-sample" id="inputEmail4" name='self1' value={formData.self1} onChange={handleInputChange}/>
</div>
<div class="col-md-4">
<label for="inputEmail4" class="form-label">Day 2</label>
<input type="text" class="form-control-sample" id="inputEmail4" name='self2' value={formData.self2} onChange={handleInputChange}/>
</div>
</div>

</div>
</div>
<div className='course-row'>
<div class="col-md-4">
<label for="inputEmail4" class="form-label">Header Title</label>
<input type="text" class="form-control" id="inputEmail4" name='headerTitle' value={formData.headerTitle} onChange={handleInputChange}/>
</div>
<div class="col-md-4">
<label for="inputEmail4" class="form-label">Course keyword with comma</label>
<input type="text" class="form-control" id="inputEmail4" name='courseKeyword' value={formData.courseKeyword} onChange={handleInputChange} />
</div>
<div class="col-md-4">
<label for="inputEmail4" class="form-label">Course keyword description</label>
<input type="text" class="form-control" id="inputEmail4" name='courseKeywordDescription' value={formData.courseKeywordDescription} onChange={handleInputChange} />
</div>
</div>
<div class="mb-3">
<label for="exampleFormControlTextarea1" class="form-label">Course Highlight(Only add 4 Lines)</label>
<textarea class="form-control" id="exampleFormControlTextarea1" rows="4" name='courseHighlight' value={formData.courseHighlight} onChange={handleInputChange}></textarea>
</div>
<div class="mb-3">
<label for="exampleFormControlTextarea1" class="form-label">Course Description</label>
<textarea class="form-control" id="exampleFormControlTextarea1" name='courseDescription' value={formData.courseDescription} onChange={handleInputChange}></textarea>
</div> 

      <div className="course-row">
            <button className='submit-btn' data-bs-toggle='modal'
                  data-bs-target='#exampleModal' type='submit' >{formMode === 'Add' ? 'Submit' : 'Update'}</button>
              <button type="button" className="reset-btn" onClick={handleReset}>
                Reset
              </button>
            </div>
            </form>
      </div>
      </div>
      
):(  <>  <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="course-category">
        <p>{pageTitle}</p>
        <div className="category">
          <div className="category-header">
            <p>{headerTitle}</p>
          </div>
          <div className="date-schedule">
            Start Date
            <DatePicker value={startDate} onChange={(date) => setStartDate(date)} 
              sx={{
                '& .MuiIconButton-root':{color: '#00aeef'}
              }}/>
            End Date
            <DatePicker value={endDate} onChange={(date) => setEndDate(date)}
            sx={{
               '& .MuiIconButton-root':{color: '#00aeef'}
            }} />
            <button className="filter" >
              Filter
            </button>
          </div>
          <div className="entries">
            <div className="entries-left">
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
            <div className="entries-right">
            <div className="search">
            <div className="search-div" role="search" style={{ border: '1px solid #d3d3d3' }}>
            <input
      className="search-input"
      type="search"
      placeholder="Enter Courses, Category or Keywords"
      aria-label="Search"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
              <button className="btn-search" >
                <IoSearch />
              </button>
              </div>
              </div>
              <button className="btn-category" onClick={handleAddTrendingCourseClick}>
                <FiPlus />
                {buttonLabel}
              </button>
            </div>
          </div>
        </div>

        <TableContainer component={Paper} sx={{ padding: '0 10px' }}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell sx={{ width: 100 }} align="center">
                  <Checkbox />
                </StyledTableCell>
                <StyledTableCell sx={{ width: 150, fontSize: '16px' }} align="center">S.No.</StyledTableCell>
                <StyledTableCell sx={{ width: 220, fontSize: '16px' }} align="center">Image</StyledTableCell>
                <StyledTableCell sx={{ fontSize: '16px' }} align="center">Course Name</StyledTableCell>
                <StyledTableCell sx={{ width: 200, fontSize: '16px' }} align="center">Date</StyledTableCell>
                <StyledTableCell sx={{ width: 200, fontSize: '16px' }} align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
      {displayedCategories.length > 0 ? (
        displayedCategories.map((course, index) => (
          <StyledTableRow key={course.id}>
            <StyledTableCell sx={{ width: 100 }} align="center">
              <Checkbox />
            </StyledTableCell>
            <StyledTableCell sx={{ width: 150, fontSize: '16px' }} align="center">{index + 1 + (currentPage - 1) * rowsPerPage}
            </StyledTableCell>
            <StyledTableCell sx={{ width: 220}} align="center">
            {course.courseImage ? (
    <img
    src={`https://api.hachion.co/${course.courseImage}`}  // Adjust based on your server setup
      alt="Course"
      width="50"
    />
  ) : (
    'No Image'
  )}
            </StyledTableCell>
            <StyledTableCell sx={{ fontSize: '16px' }} align="left">
              {course.courseName}
            </StyledTableCell>
            <StyledTableCell sx={{ width: 200, fontSize: '16px' }} align="center">{course.date}</StyledTableCell>
            <StyledTableCell align="center" style={{ width: 200, }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
              <FaEdit
                className="edit"
                onClick={() => handleEditClick(course.id)}
                style={{ cursor: "pointer", marginRight: "10px" }}
              />
              <RiDeleteBin6Line
                className="delete"
                onClick={() => handleDeleteConfirmation(course.id)}
                style={{ cursor: "pointer" }}
              />
              </div>
            </StyledTableCell>
          </StyledTableRow>
        ))
      ) : (
        <StyledTableRow>
          <StyledTableCell colSpan={6} align="center">
            No courses available.
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
         totalRows={filteredCourses.length} // Use the full list for pagination
         onPageChange={handlePageChange}
       />
                 </div>
      </div>
    </LocalizationProvider></>)}
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
   </>
  );
};

export default CourseDetail;
