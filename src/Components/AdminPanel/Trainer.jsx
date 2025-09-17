import  React, { useEffect } from 'react';
import { useState } from 'react';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import AdminPagination from './AdminPagination';
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
import CourseCategory from './CourseCategory';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { IoMdCloseCircleOutline } from "react-icons/io";

import axios from 'axios';

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

function createData(S_No, profileImage, trainer_name, course_name,demo1, demo2,demo3,summary,date,Action) {
  return { S_No, profileImage, trainer_name,course_name,demo1,demo2,demo3,summary,date,Action};
}



export default function Trainer() {
 const[trainers,setTrainers]=useState([]);
const [filteredTrainers,setFilteredTrainers]=useState([]);
const[filterCourse,setFilterCourse]=useState([]);
  const [courseCategory,setCourseCategory]=useState([]);
  const [course,setCourse]=useState([]);
 const [date, setDate] = useState('');
  const [open, setOpen] = React.useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);
const[message,setMessage]=useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
   const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
  const [editedRow, setEditedRow] = useState({ profileImage: '', trainer_name: '', course_name: '', summary: '', demo_link_1: '', demo_link_2: '', demo_link_3: '' ,date:''});
  const [selectedRow, setSelectedRow] = React.useState({ category_name: '', Date: '' });
  const currentDate = new Date().toISOString().split('T')[0];
  const [categories, setCategories] = useState([]);
const [courseNames, setCourseNames] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const [rowsPerPage, setRowsPerPage] = useState(10);
  const [trainerData, setTrainerData] = useState({
  id:"",
      trainer_name: "",
      profileImage: "",
      course_name: "",
      category_name: "",
      summary: "",
      demo_link_1: "",
      demo_link_2: "",
      demo_link_3: "",
      date:currentDate
    
    });
    
  const handleReset = () => {
    setTrainerData({
      trainer_name: "",
      profileImage: "",
      course_name: "",
      category_name: "",
      summary: "",
      demo_link_1: "",
      demo_link_2: "",
      demo_link_3: "",
      date:""
    });
  };
  
  const handleSubmit = async (e) => {
  e.preventDefault();
  const currentDate = new Date().toISOString().split("T")[0];

  
  setSuccessMessage("");
  setErrorMessage("");

  if (!trainerData.trainer_name || !trainerData.course_name || !trainerData.category_name) {
    setErrorMessage("⚠️ Please fill in all required fields.");
    return;
  }

  try {
    const response = await axios.post("https://api.test.hachion.co/trainer/add", trainerData);

   if (response.status >= 200 && response.status < 300) {
  setSuccessMessage("✅ Trainer added successfully.");
  console.log("✅ Message set: Trainer added successfully.");
  setErrorMessage("");
  setTrainers((prev) => [...prev, { ...response.data, dateAdded: currentDate }]);
  handleReset();
}
  } catch (error) {
    console.error("Error adding trainer:", error);

    if (
      error.response &&
      error.response.status === 409 &&
      error.response.data === "Trainer with the same name, category, and course already exists."
    ) {
      setErrorMessage("❌ A trainer with the same name already exists for this category and course.");
    } else {
      setErrorMessage("❌ Something went wrong while adding the trainer. Please try again.");
    }

    setSuccessMessage(""); 
  }
};

  const handleDateFilter = () => {
        const filtered = trainers.filter((item) => {
          const trainerDate = new Date(item.date);
          const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
          const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
      
          return (
            (!start || trainerDate >= start) &&
            (!end || trainerDate <= end)
          );
        });
      
        setFilteredTrainers(filtered);
      };
  const handleDateReset = () => {
  setStartDate(null);
  setEndDate(null);
  setFilteredTrainers(trainers);
};
  
useEffect(() => {
  const filtered = trainers.filter((trainer) =>
    trainer.trainer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );
  setFilteredTrainers(filtered);
}, [searchTerm, trainers]);

const handleRowsPerPageChange = (rows) => {
  setRowsPerPage(rows);
  setCurrentPage(1); // Reset to the first page whenever rows per page changes
};
const displayedCourse = filteredTrainers.slice(
  (currentPage - 1) * rowsPerPage,
  currentPage * rowsPerPage
);
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

const handleDeleteConfirmation = (trainerId) => {
  if (window.confirm("Are you sure you want to delete this trainer?")) {
    handleDelete(trainerId);
  }
};
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
    if (editedRow.category_name) {
      axios.get(`https://api.test.hachion.co/courses/coursenames-by-category`, {
        params: { categoryName: editedRow.category_name }
      })
      .then(response => setCourseNames(response.data))
      .catch(error => {
        console.error("Error fetching course names:", error);
        setCourseNames([]);
      });
    } else {
      setCourseNames([]); 
    }
  }, [editedRow.category_name]);
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
  if (trainerData.category_name) {
    const filtered = courseCategory.filter(
      (course) => course.courseCategory === trainerData.category_name
    );
    setFilterCourse(filtered);
  } else {
    setFilterCourse([]); 
  }
}, [trainerData.category_name, courseCategory]);
const handleDelete = async (trainer_id) => {
  try {
    const response = await axios.delete(`https://api.test.hachion.co/trainer/delete/${trainer_id}`);

    if (response.status === 200) {
      setSuccessMessage("✅ Trainer deleted successfully.");
      setErrorMessage("");

      
      setTrainers((prev) => prev.filter((trainer) => trainer.trainer_id !== trainer_id));
    }
  } catch (error) {
    console.error("Error deleting Trainer:", error);
    setErrorMessage("❌ Failed to delete trainer. Please try again.");
    setSuccessMessage("");
  }
};
  const handleAddTrendingCourseClick = () => setShowAddCourse(true);
const handleClickOpen = (row) => {
console.log("Edit row data:", row); 
  setSelectedRow(row); 
  
  setEditedRow(row)
  setOpen(true); 
  console.log("tid",row.trainer_id)
};

const handleClose = () => {
  setOpen(false); 
};
const handleSave = async () => {
 
  try {
    const response = await axios.put(
      `https://api.test.hachion.co/trainer/update/${selectedRow.trainer_id}`,
      editedRow
    );

    setTrainers((prevTrainers) =>
      prevTrainers.map((trainer) =>
        trainer.trainer_id === selectedRow.trainer_id ? response.data : trainer
      )
    );
    setMessage(true); 
   
    setTimeout(() => {
      setMessage(false);
    }, 5000);

    setOpen(false); 
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
const handleChange = (e) => {
  const { name, value } = e.target;
  setTrainerData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};
const handleFileChange = (e) => {
const file = e.target.files[0];
if (file) {
setTrainerData((prevData) => ({
...prevData,
image: file,
 }));
 }
 };

 useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await axios.get('https://api.test.hachion.co/trainers');
      setTrainers(response.data);
      setFilteredTrainers(response.data);
    } catch (error) {
      console.error('Error fetching trainers:', error);
    }
  };

   useEffect(() => {
    axios.get("https://api.test.hachion.co/course-categories/all")
      .then(response => {
        setCategories(response.data); 
      })
      .catch(error => {
        console.error("Error fetching categories:", error);
      });
  }, []);
// const handleCourseChange = (event) => setCourse(event.target.value);
  return (
    
    <>   
       {showAddCourse ? (<div className='course-category'>
        <h3>Trainer</h3>
        <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                          <li className="breadcrumb-item">
                          <a href="#!" onClick={() => setShowAddCourse(false)}>View Trainer</a> <MdKeyboardArrowRight />
                          </li>
                          <li className="breadcrumb-item active" aria-current="page">
                          Add Trainer
                          </li>
                        </ol>
                      </nav>
<div className='category'>
<div className='category-header'>
<p style={{ marginBottom: 0 }}>Add Trainer</p>
</div>
<div className='course-details'>
<div className='course-row'>
  <div class="col-md-3">
    <label className='form-label'>Trainer</label>
    <input type="text" class="form-control" placeholder="Enter Trainer name" aria-label="First name" 
    name="trainer_name"
    value={trainerData.trainer_name}
    onChange={handleChange}/>
  </div>
  <div className="col-md-3">
                <label className="form-label">Trainer Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="profileImage"
                  onChange={handleFileChange}
                  required
                />
              </div>
              </div>
  <div className='course-row'>
  <div class="col-md-3">
    <label for="inputState" class="form-label">Category Name</label>
    <select id="inputState" class="form-select" name='category_name' value={trainerData.category_name} onChange={handleChange}>
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
          value={trainerData.course_name}
          onChange={handleChange}
          disabled={!trainerData.category_name}
        >
          <option value="" disabled>Select Course</option>
          {filterCourse.map((curr) => (
            <option key={curr.id} value={curr.courseName}>{curr.courseName}</option>
          ))}
        </select>
      </div>
  </div>
  <div class="mb-6">
  <label for="exampleFormControlTextarea1" class="form-label">Trainer Profile Summary</label>
  <textarea class="form-control" id="exampleFormControlTextarea1" rows="6"
  name="summary"
  value={trainerData.summary}
  onChange={handleChange}></textarea>
</div>
<div class="row align-items-center">
  <div class="col-md-3">
    <label for="inputPassword6" class="form-label">Demo Link 1</label>
    <input type="text" id="inputtext6" class="form-control" aria-describedby="passwordHelpInline"
       name="demo_link_1"
       value={trainerData.demo_link_1}
       onChange={handleChange}/>
  </div>
  </div>
  <div class="row align-items-center">
  <div class="col-md-3">
    <label for="inputPassword6" class="form-label">Demo Link 2 (Optional)</label>
    <input type="text" id="inputtext6" class="form-control" aria-describedby="passwordHelpInline"  name="demo_link_2"
                  value={trainerData.demo_link_2}
                  onChange={handleChange}/>
  </div>
  </div>
  <div class="row align-items-center">
  <div class="col-md-3">
    <label for="inputPassword6" class="form-label">Demo Link 3 (Optional)</label>
    <input type="text" id="inputtext6" class="form-control" aria-describedby="passwordHelpInline"
    name="demo_link_3"
    value={trainerData.demo_link_3}
    onChange={handleChange}/>
  </div>
  </div>
   {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}
 
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
        <h3>Trainer</h3>
        <div className='category'>
          <div className='category-header'>
            <p style={{ marginBottom: 0 }}>View Trainer</p>
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
                     <button className='filter' onClick={handleDateReset} >Reset</button>
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
                        <FiPlus /> Add Trainer
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
            <StyledTableCell sx={{ width: 50 }} align="center">
              <Checkbox />
            </StyledTableCell>
            <StyledTableCell sx={{ width: 60 }}>S.No.</StyledTableCell>
            <StyledTableCell align="center">Trainer Image</StyledTableCell>
            <StyledTableCell align="center">Trainer Name</StyledTableCell>
            <StyledTableCell align="center">Course Name</StyledTableCell>
            <StyledTableCell align="center">Demo 1</StyledTableCell>
            <StyledTableCell align="center">Demo 2</StyledTableCell>
            <StyledTableCell align="center">Demo 3</StyledTableCell>
            <StyledTableCell align="center">Summary</StyledTableCell>
            <StyledTableCell align="center">Created Date</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedCourse.length > 0
          ? displayedCourse.map((row, index) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell align="center"><Checkbox /></StyledTableCell>
              <StyledTableCell align="center">{index + 1 + (currentPage - 1) * rowsPerPage}</StyledTableCell>
              <StyledTableCell align="center">
              {row.profileImagee ? <img src={row.profileImage} alt="User" width="50" height="50" /> : 'No Image'}
              </StyledTableCell>
              <StyledTableCell align="left">{row.trainer_name}</StyledTableCell>
              <StyledTableCell sx={{ width: 100 }} align="left">{row.course_name}</StyledTableCell>
              <StyledTableCell sx={{ width: 200, whiteSpace: 'pre-wrap' }} align="left">{row.demo_link_1}</StyledTableCell>
              <StyledTableCell sx={{ width: 200, whiteSpace: 'pre-wrap' }} align="left">{row.demo_link_2}</StyledTableCell>
              <StyledTableCell sx={{ width: 200, whiteSpace: 'pre-wrap' }} align="left">{row.demo_link_3}</StyledTableCell>
              <StyledTableCell sx={{ width: 400, whiteSpace: 'pre-wrap' }} align="left">{row.summary}</StyledTableCell>
              <StyledTableCell align="center">{row.date}</StyledTableCell>
              <StyledTableCell align="center">
                  <FaEdit className="edit" onClick={() => handleClickOpen(row)} /> {/* Open modal on edit click */}
                  <RiDeleteBin6Line className="delete"  onClick={() => handleDeleteConfirmation(row.trainer_id)} />
                </StyledTableCell>
            </StyledTableRow>
                      ))
                      : (
                        <StyledTableRow>
                          <StyledTableCell colSpan={10} align="center">
                            No data available.
                          </StyledTableCell>
                        </StyledTableRow>
                      )}
                    
            </TableBody>
      </Table>
    </TableContainer>
    {successMessage && (
    <p style={{ color: "green", fontWeight: "bold", margin: 0 }}>{successMessage}</p>
  )}
  {errorMessage && (
    <p style={{ color: "red", fontWeight: "bold", margin: 0 }}>{errorMessage}</p>
  )}
    {message && <p style={{ color: 'green' }}>Table updated successfully</p>}

     <div className='pagination-container'>
              <AdminPagination
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalRows={filteredTrainers.length}
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
        <DialogTitle className="dialog-title" id="edit-schedule-dialog">Edit Trainer
      <Button onClick={handleClose} className='close-btn'>
        <IoMdCloseCircleOutline style={{ color: 'white', fontSize: '2rem' }} />
      </Button>
    </DialogTitle>
  </div>
  <DialogContent>
    <div className="row">
      <div className="col">
        <label className='form-label'>Trainer</label>
        <input
          type="text"
          className="form-control"
          placeholder="Trainer name"
          name="trainer_name"
          value={editedRow.trainer_name || ""}
          onChange={handleInputChange}
        />
      </div>
        <div className="col">
                <label className="form-label">Trainer Image</label>
                <input
                  type="file"
                  className="schedule-input"
                  name="profileImage"
                  onChange={handleFileChange}
                  required
                />
              </div>
      <div className="col">
      <label htmlFor="inputState" className="form-label">Category Name</label>
      <select
        id="inputState"
        className="form-select"
        name="category_name"
        value={editedRow.category_name || ""}
        onChange={handleInputChange}
      >
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
       <div className="col">
        <label htmlFor="courseSelect" className="form-label">Course Name</label>
        <select
          id="courseSelect"
          className="form-select"
          name="course_name"
          value={editedRow.course_name || ""}
          onChange={handleInputChange}
          disabled={!editedRow.category_name} 
        >
          <option value="">Select Course</option>
          {courseNames.map((course, index) => (
            <option key={index} value={course}>
              {course}
            </option>
          ))}
        </select>
      </div>
    </div>
    <div className="mb-6">
      <label htmlFor="exampleFormControlTextarea1" className="form-label">Trainer Profile Summary</label>
      <textarea
        className="form-control"
        id="exampleFormControlTextarea1"
        rows="6"
        name="summary"
        value={editedRow.summary||""}
        onChange={handleInputChange}
      />
    </div>
    <div class="row align-items-center">
  <div class="col-md-3">
    <label for="inputPassword6" class="form-label">Demo Link 1</label>
    <input type="text" id="inputtext6" class="form-control" aria-describedby="passwordHelpInline"
       name="demo_link_1"
       value={editedRow.demo_link_1||""}
       onChange={handleInputChange}/>
  </div>
  </div>
  <div class="row align-items-center">
  <div class="col-md-3">
    <label for="inputPassword6" class="form-label">Demo Link 2 (Optional)</label>
    <input type="text" id="inputtext6" class="form-control" aria-describedby="passwordHelpInline"  name="demo_link_2"
    value={editedRow.demo_link_2||""}
     onChange={handleInputChange}/>
  </div>
  </div>
  <div class="row align-items-center">
  <div class="col-md-3">
    <label for="inputPassword6" class="form-label">Demo Link 3 (Optional)</label>
    <input type="text" id="inputtext6" class="form-control" aria-describedby="passwordHelpInline"
    name="demo_link_3"
    value={editedRow.demo_link_3||""}
    onChange={handleInputChange}/>
  </div>
  </div>
  </DialogContent>
 <DialogActions className="update" style={{ display: 'flex', justifyContent: 'center' }}>
    <Button onClick={handleSave} className="update-btn">Update</Button>
  </DialogActions>
</Dialog>
 </> 
 );
}