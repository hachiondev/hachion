import  React, { useEffect } from 'react';
import { useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io'
import { styled } from '@mui/material/styles';
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
    borderRight: '1px solid white', // Add vertical lines
    padding: '3px 5px',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: '3px 4px',
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

function createData(S_No, trainer_name, course_name,demo1, demo2,demo3,summary,date,Action) {
  return { S_No, trainer_name,course_name,demo1,demo2,demo3,summary,date,Action};
}



export default function Trainer() {
 const[trainers,setTrainers]=useState([]);
const [filteredTrainers,setFilteredTrainers]=useState(trainers);
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
  const [editedRow, setEditedRow] = useState({ trainer_name: '', course_name: '', summary: '', demo_link_1: '', demo_link_2: '', demo_link_3: '' ,date:''});
  const [selectedRow, setSelectedRow] = React.useState({ category_name: '', Date: '' });
  const currentDate = new Date().toISOString().split('T')[0];
  const [trainerData, setTrainerData] = useState({
  id:"",
      trainer_name: "",
      course_name: "",
      category_name: "",
      summary: "",
      demo_link_1: "",
      demo_link_2: "",
      demo_link_3: "",
      date:currentDate
    
    });
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10; // Show 10 rows per page
  
    
  const handleReset = () => {
    setTrainerData({
      trainer_name: "",
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
    e.preventDefault(); // Prevents the default form submission
    const currentDate = new Date().toISOString().split("T")[0];
    if (!trainerData.trainer_name || !trainerData.course_name || !trainerData.category_name) {
      alert("Please fill in all required fields.");
      return;
    }
  
    try {
      
      const response = await axios.post("http://localhost:8080/trainer/add", trainerData
      );
      
      if (response.status === 200) {
        alert("Trainer added successfully");
        
        // Add the new trainer to the current list of trainers in the UI
        setTrainers((prev) => [...prev, { ...response.data, dateAdded: currentDate }]);
        handleReset();
        setTimeout(() => {
          
           }, 5000); 
        };
      
    } catch (error) {
      console.error("Error adding trainer:", error.message);
      alert("There was an error adding the trainer.");
    }
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
 
  const handleDateFilter = () => {
    const filtered = trainers.filter((trainer) => {
      const trainerDate = new Date(trainer.date);
      return (!startDate || trainerDate >= new Date(startDate)) &&
             (!endDate || trainerDate <= new Date(endDate));
    });
    setTrainers(filtered);
  };
  
  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const response = await axios.get('http://localhost:8080/trainers');
        setTrainers(response.data);
        setFilteredTrainers(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };
    fetchTrainer();
  }, []);
useEffect(() => {
  const filtered = trainers.filter((trainer) =>
    trainer.trainer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );
  setFilteredTrainers(filtered)
  setTrainers(filtered);
}, [searchTerm,filteredTrainers]);
const startIndex = (currentPage -1) * rowsPerPage;
const paginatedData = filteredTrainers.slice(startIndex, startIndex + rowsPerPage);
const pageCount = Math.ceil(filteredTrainers.length / rowsPerPage);

// Handle page change
const handlePageChange = (event, page) => {
  setTrainers(paginatedData);
  setCurrentPage(page);
 
};
const handleDeleteConfirmation = (trainerId) => {
  if (window.confirm("Are you sure you want to delete this trainer?")) {
    handleDelete(trainerId);
  }
};
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
useEffect(() => {
  if (trainerData.category_name) {
    const filtered = courseCategory.filter(
      (course) => course.courseCategory === trainerData.category_name
    );
    setFilterCourse(filtered);
  } else {
    setFilterCourse([]); // Reset when no category is selected
  }
}, [trainerData.category_name, courseCategory]);
const handleDelete = async (trainer_id) => {
 
   try { 
    const response = await axios.delete(`http://localhost:8080/trainer/delete/${trainer_id}`); 
    console.log("Trainer deleted successfully:", response.data); 
  } catch (error) { 
    console.error("Error deleting Trainer:", error); 
  } }; 


  const handleAddTrendingCourseClick = () => setShowAddCourse(true);



const handleClickOpen = (row) => {

  setSelectedRow(row); 
  setEditedRow(row)// Set the selected row data
  setOpen(true); // Open the modal
  console.log("tid",row.trainer_id)
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
      `http://localhost:8080/trainer/update/${selectedRow.trainer_id}`,
      editedRow
    );

    // Update only the edited row in the trainers state
    setTrainers((prevTrainers) =>
      prevTrainers.map((trainer) =>
        trainer.trainer_id === selectedRow.trainer_id ? response.data : trainer
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
const handleChange = (e) => {
  const { name, value } = e.target;
  setTrainerData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};
// const handleCourseChange = (event) => setCourse(event.target.value);
  return (
    
    <>   
       {showAddCourse ? (<div className='course-category'>
<p>View Trainer <IoIosArrowForward/> Add Trainer </p>
<div className='category'>
<div className='category-header'>
<p style={{ marginBottom: 0 }}>Add Trainer</p>
</div>
<div class="row">
  <div class="col">
  
    <label className='form-label'>Trainer</label>
    <input type="text" class="form-select" placeholder="Trainer name" aria-label="First name" 
    name="trainer_name"
    value={trainerData.trainer_name}
    onChange={handleChange}/>
  </div>
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
<div class="row g-3 align-items-center">
  <div class="col-auto">
    <label for="inputPassword6" class="col-form-label">Demo Link 1</label>
  </div>
  <div class="col-auto">
    <input type="text" id="inputtext6" class="form-control" aria-describedby="passwordHelpInline"
       name="demo_link_1"
       value={trainerData.demo_link_1}
       onChange={handleChange}/>
  </div>
  </div>
  <div class="row g-3 align-items-center">
  <div class="col-auto">
    <label for="inputPassword6" class="col-form-label"   >Demo Link 2</label>
  </div>
  <div class="col-auto">
    <input type="text" id="inputtext6" class="form-control" aria-describedby="passwordHelpInline"  name="demo_link_2"
                  value={trainerData.demo_link_2}
                  onChange={handleChange}/>
  </div>
  </div>
  <div class="row g-3 align-items-center">
  <div class="col-auto">
    <label for="inputPassword6" class="col-form-label">Demo Link 3</label>
  </div>
  <div class="col-auto">
    <input type="text" id="inputtext6" class="form-control" aria-describedby="passwordHelpInline"
    name="demo_link_3"
    value={trainerData.demo_link_3}
    onChange={handleChange}/>
  </div>
  </div>
  <div style={{display:'flex',flexDirection:'row'}}> 
  <button className='submit-btn'  data-bs-toggle='modal'
                  data-bs-target='#exampleModal' onClick={handleSubmit}>Submit</button>
  <button className='reset-btn' onClick={handleReset}>Reset</button>
  </div>
 
</div>

</div>
):(<div>
   <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='course-category'>
        <p>Trainer</p>
        <div className='category'>
          <div className='category-header'>
            <p style={{ marginBottom: 0 }}>View Trainer</p>
          </div>
          <div className='date-schedule'>
            Start Date
            <DatePicker  selected={startDate} onChange={date => setStartDate(date)} />
            End Date
            <DatePicker  selected={endDate} onChange={date => setEndDate(date)} />
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
            <StyledTableCell>
              <Checkbox />
            </StyledTableCell>
            <StyledTableCell>S.No.</StyledTableCell>
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
          {trainers.map((row) => (
            <StyledTableRow key={row.S_No}>
              <StyledTableCell><Checkbox /></StyledTableCell>
              <StyledTableCell>{row.trainer_id}</StyledTableCell>
              <StyledTableCell align="left">{row.trainer_name}</StyledTableCell>
              <StyledTableCell align="left">{row.course_name}</StyledTableCell>
              <StyledTableCell align="center">{row.demo_link_1}</StyledTableCell>
              <StyledTableCell align="center">{row.demo_link_2}</StyledTableCell>
              <StyledTableCell align="center">{row.demo_link_3}</StyledTableCell>
              <StyledTableCell align="center">{row.summary}</StyledTableCell>
              <StyledTableCell align="center">{row.date}</StyledTableCell>
              <StyledTableCell align="center">
                  <FaEdit className="edit" onClick={() => handleClickOpen(row)} /> {/* Open modal on edit click */}
                  <RiDeleteBin6Line className="delete"  onClick={() => handleDeleteConfirmation(row.trainer_id)} />
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
    <DialogTitle>Edit Trainer
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
          className="form-select"
          placeholder="Trainer name"
          name="trainer_name"
          value={editedRow.trainer_name || ""}
          onChange={handleInputChange}
        />
      </div>
      <div className="col">
        <label htmlFor="inputState" className="form-label">Category Name</label>
        <select
          id="inputState"
          className="form-select"
          name="category_name"
          value={editedRow.category_name|| ""}
          onChange={handleInputChange}
        >
          <option value="">Select Category</option>
          <option>QA Testing</option>
          <option>Project Management</option>
          <option>Business Intelligence</option>
          <option>Data Science</option>
        </select>
      </div>
      <div className="col">
        <label htmlFor="inputState" className="form-label">Course Name</label>
        <select
          id="inputState"
          className="form-select"
          name="course_name"
          value={editedRow.course_name||""}
          onChange={handleInputChange}
        >
          <option value="">Select Course</option>
          <option>QA Automation</option>
          <option>Load Runner</option>
          <option>QA Automation Testing</option>
          <option>Mobile App Testing</option>
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
  </DialogContent>
  <DialogActions>
    <Button className='update-btn' onClick={()=>handleSave(selectedRow)} color="primary">Update</Button>
    
  </DialogActions>
</Dialog>
      </div>)}
 </> );
}