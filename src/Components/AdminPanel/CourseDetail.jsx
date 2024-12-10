import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoIosArrowForward } from 'react-icons/io';
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
import Pagination from '@mui/material/Pagination';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { IoSearch } from 'react-icons/io5';
import { FiPlus } from 'react-icons/fi';


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
  const [editedRow, setEditedRow] = useState({title: '',courseName: '',courseImage: null,youtubeLink: '',numberOfClasses: '',dailySessions: '',liveTrainingHours: '',labExerciseHours: '',realTimeProjects: '',starRating: '',ratingByNumberOfPeople: '',totalEnrollment: '',courseCategory: '',date:currentDate,
  });
  const [formData, setFormData] = useState({
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
    courseCategory:"",
    starRating: '',
    ratingByNumberOfPeople: '',
    totalEnrollment: '',
    courseCategory: '',
    date:currentDate,
  });
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
  useEffect(() => {
    const filtered = categories.filter(category =>
        category.courseName.toLowerCase().includes(searchTerm.toLowerCase()) 
        
    );
    setFilteredCourses(filtered);
}, [searchTerm,filteredCourses]);
  useEffect(() => {
    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:8080/courses/all');
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
  const dataToSubmit = { 
    ...formData, 
    date: currentDate, // Add current date
  };

  try {
    if (formData.id) {
      // Edit operation
      const response = await axios.put(
        `http://localhost:8080/courses/update/${formData.id}`, // Ensure the correct ID is used
        dataToSubmit
      );
      if (response.status === 200) {
        alert("Course updated successfully");
        // Update local state
        setCourse((prevCourses) =>
          prevCourses.map((course) =>
            course.id === formData.id ? { ...course, ...dataToSubmit } : course
          )
        );
      }
    } else {
      // Add operation
      const response = await axios.post(
        "http://localhost:8080/courses/add",
        dataToSubmit
      );
      if (response.status === 200) {
        alert("Course added successfully");
        // Update local state
        setCourse((prevCourses) => [...prevCourses, response.data]); // Use response data for the new course
      }
    }

    handleReset(); // Clear form fields
  } catch (error) {
    console.error("Error submitting course:", error.message);
    alert("Error submitting course.");
  }
};


  
const handleReset=()=>{
  setFormData([{
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
       }]);

}
const handleDeleteConfirmation = (id) => {
  if (window.confirm("Are you sure you want to delete this Courses?")) {
    handleDelete(id);
  }
};
const handleDelete = async (id) => {
       
  try { 
   const response = await axios.delete(`http://localhost:8080/courses/delete/${id}`); 
   console.log("Courses deleted successfully:", response.data); 
 } catch (error) { 
   console.error("Error deleting Curriculum:", error); 
 } }; 

   
 const handleCloseModal=()=>{
  setShowAddCourse(false);
 
}
const handleEditClick = async (courseId) => {
  setFormMode('Edit');
  setShowAddCourse(true);
  try {
    const response = await fetch(`http://localhost:8080/courses/${courseId}`);
    if (response.ok) {
      const course = await response.json();
      setFormData({
        id: course.id, // Ensure the unique identifier is included
        category_name: course.courseCategory || '',
        courseName: course.courseName || '',
        courseImage: '', // Handle file uploads differently if needed
        youtubeLink: course.youtubeLink || '',
        numberOfClasses: course.numberOfClasses || '',
        dailySessions: course.dailySessions || '',
        liveTrainingHours: course.liveTrainingHours || '',
        labExerciseHours: course.labExerciseHours || '',
        realTimeProjects: course.realTimeProjects || '',
        starRating: course.starRating || '',
        ratingByNumberOfPeople: course.ratingByNumberOfPeople || '',
        totalEnrollment: course.totalEnrollment || '',
      });
    } else {
      console.error('Failed to fetch course data');
    }
  } catch (error) {
    console.error('Error fetching course data:', error);
  }
};

  const handleAddTrendingCourseClick = () => setShowAddCourse(true);
  return (<>{
    showAddCourse?(  <div className="course-category">
      <p>
    Course Details <IoIosArrowForward /> {formMode === 'Add' ? 'Add Course Details' : 'Edit Course Details'}
</p>
      <div className="category">
        <div className="category-header">
          <p>{formMode === 'Add' ? 'Add Course Details' : 'Edit Course Details'}</p>
        </div>
        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}
        
          <div className="course-details">
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
                <label className="form-label">Total Enrollment</label>
                <input
                  type="text"
                  name="totalEnrollment"
                  className="form-control"
                  placeholder="Enter total enrollment"
                  value={formData.totalEnrollment}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className='course-details'>
            <h3>Key Highlights</h3>
              <div className='course-row'>
                <div class="col-md-4">
                  <label for="inputEmail4" class="form-label">Key Highlights 1</label>
                  <input type="text" class="form-control" id="inputEmail4" />
                </div>
                <div class="col-md-4">
                  <label for="inputEmail4" class="form-label">Key Highlights 2</label>
                  <input type="text" class="form-control" id="inputEmail4" />
                </div>
                <div class="col-md-4">
                  <label for="inputEmail4" class="form-label">Key Highlights 3</label>
                  <input type="text" class="form-control" id="inputEmail4" />
                </div>
              </div>
              <div className='course-row'>
<div class="col-md-4">
<label for="inputEmail4" class="form-label">Key Highlights 4</label>
<input type="text" class="form-control" id="inputEmail4" />
</div>
<div class="col-md-4">
<label for="inputEmail4" class="form-label">Key Highlights 5</label>
<input type="text" class="form-control" id="inputEmail4" />
</div>
<div class="col-md-4">
<label for="inputEmail4" class="form-label">Key Highlights 6</label>
<input type="text" class="form-control" id="inputEmail4" />
</div>
</div>
</div> 
<h3>Mode Of Training</h3>
<div className='course-row'>
<div className='course-details'>
<div class="form-check">
<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
<label class="form-check-label" for="flexCheckDefault">
Live Training
</label>
</div>
<div class="col-md-4">
<label for="inputEmail4" class="form-label">Amount(INR)</label>
<input type="number" class="form-control" id="inputEmail4" />
</div>
<div class="col-md-4">
<label for="inputEmail4" class="form-label">Discount%</label>
<input type="number" class="form-control" id="inputEmail4" />
</div>
<div class="col-md-4">
<label for="inputEmail4" class="form-label">Total(INR)</label>
<input type="number" class="form-control" id="inputEmail4" />
</div>
</div>
<div className='course-details'>
<div class="form-check">
<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
<label class="form-check-label" for="flexCheckDefault">
Mentoring Mode
</label>
</div>
<div class="col-md-3">
<label for="inputEmail4" class="form-label">Amount(INR)</label>
<input type="number" class="form-control" id="inputEmail4" />
</div>
<div class="col-md-3">
<label for="inputEmail4" class="form-label">Discount%</label>
<input type="number" class="form-control" id="inputEmail4" />
</div>
<div class="col-md-3">
<label for="inputEmail4" class="form-label">Total(INR)</label>
<input type="number" class="form-control" id="inputEmail4" />
</div>
</div>
<div className='course-details'>
<div class="form-check">
<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
<label class="form-check-label" for="flexCheckDefault">
Self Placed Training
</label>
</div>
<div class="col-md-3">
<label for="inputEmail4" class="form-label">Amount(INR)</label>
<input type="number" class="form-control" id="inputEmail4" />
</div>
<div class="col-md-3">
<label for="inputEmail4" class="form-label">Discount%</label>
<input type="number" class="form-control" id="inputEmail4" />
</div>
<div class="col-md-3">
<label for="inputEmail4" class="form-label">Total(INR)</label>
<input type="number" class="form-control" id="inputEmail4" />
</div>
</div>

</div>
<div className='course-details'>
<div class="form-check">
<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
<label class="form-check-label" for="flexCheckDefault">
Self Placed Training
</label>
</div>
<div class="col-md-3">
<label for="inputEmail4" class="form-label">Amount(INR)</label>
<input type="number" class="form-control" id="inputEmail4" />
</div>
<div class="col-md-3">
<label for="inputEmail4" class="form-label">Discount%</label>
<input type="number" class="form-control" id="inputEmail4" />
</div>
<div class="col-md-3">
<label for="inputEmail4" class="form-label">Total(INR)</label>
<input type="number" class="form-control" id="inputEmail4" />
</div>
</div>

</div>
<h3>Sample session</h3>
<div className='course-row'>
<div className='course-details'>
<h4>Mentoring Training</h4>
<div className='course-col'>
<div class="col-sm-3">
<label for="inputEmail4" class="form-label">Day 1</label>
<input type="number" class="form-control" id="inputEmail4" />
</div>
<div class="col-sm-3">
<label for="inputEmail4" class="form-label">Day 2</label>
<input type="number" class="form-control" id="inputEmail4" />
</div>
</div>

</div>
<div className='course-details'>
<h4>Mentoring Training</h4>
<div className='course-col'>
<div class="col-md-4">
<label for="inputEmail4" class="form-label">Day 1</label>
<input type="text" class="form-control" id="inputEmail4" />
</div>
<div class="col-md-4">
<label for="inputEmail4" class="form-label">Day 2</label>
<input type="text" class="form-control" id="inputEmail4" />
</div>
</div>

</div>
</div>
<div className='course-row'>
<div class="col-md-4">
<label for="inputEmail4" class="form-label">Header Title</label>
<input type="text" class="form-control" id="inputEmail4" />
</div>
<div class="col-md-4">
<label for="inputEmail4" class="form-label">Course keyword with comma</label>
<input type="text" class="form-control" id="inputEmail4" />
</div>
<div class="col-md-4">
<label for="inputEmail4" class="form-label">Course keyword description</label>
<input type="text" class="form-control" id="inputEmail4" />
</div>
</div>
<div class="mb-3">
<label for="exampleFormControlTextarea1" class="form-label">Course Highlight(Only add 4 Lines)</label>
<textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
</div>
<div class="mb-3">
<label for="exampleFormControlTextarea1" class="form-label">Course Description</label>
<textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
</div> 

            <div className="course-row">
            <button className='submit-btn' data-bs-toggle='modal'
                  data-bs-target='#exampleModal' onClick={handleSubmit}>Submit</button>
              <button type="button" className="reset-btn" onClick={handleReset}>
                Reset
              </button>
            </div>
          
      </div>
      </div>):(  <>  <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="course-category">
        <p>{pageTitle}</p>
        <div className="category">
          <div className="category-header">
            <p>{headerTitle}</p>
          </div>
          <div className="date-schedule">
            Start Date
            <DatePicker value={startDate} onChange={(date) => setStartDate(date)} />
            End Date
            <DatePicker value={endDate} onChange={(date) => setEndDate(date)} />
            <button className="filter" >
              Filter
            </button>
          </div>
          <div className="entries">
            <div className="entries-left">
              <p>Show</p>
              <button className="btn-number">10</button>
              <p>entries</p>
            </div>
            <div className="entries-right">
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
              <button className="btn-category" onClick={handleAddTrendingCourseClick}>
                <FiPlus />
                {buttonLabel}
              </button>
            </div>
          </div>
        </div>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>
                  <Checkbox />
                </StyledTableCell>
                <StyledTableCell>S.No.</StyledTableCell>
                <StyledTableCell align="center">Image</StyledTableCell>
                <StyledTableCell align="center">Course Name</StyledTableCell>
                <StyledTableCell align="center">Date</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
      {filteredCourses.length > 0 ? (
        filteredCourses.map((course, index) => (
          <StyledTableRow key={course.id}>
            <StyledTableCell>
              <Checkbox />
            </StyledTableCell>
            <StyledTableCell>{index + 1}</StyledTableCell>
            <StyledTableCell align="center">
            {course.image ? (
    <img
      src={`http://localhost:8080${course.image}`} // Adjust based on your server setup
      alt="Course"
      width="50"
    />
  ) : (
    'No Image'
  )}
            </StyledTableCell>
            <StyledTableCell align="center">
              {course.courseName}
            </StyledTableCell>
            <StyledTableCell align="center">{course.date}</StyledTableCell>
            <StyledTableCell align="center">
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

        <Pagination count={10} color="primary" />

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