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


export default function Curriculum() {
    const [showAddCourse, setShowAddCourse] = useState(false);
    const[curriculum,setCurriculum]=useState([]);
    const [open, setOpen] = React.useState(false);
    const [rows, setRows] = useState([{ id:"",title:"",topic:"" }]);
    const currentDate = new Date().toISOString().split('T')[0];
    const [curriculumData, setCurriculumData] = useState([{
        curriculum_id:"",
          category_name:"",
            course_name: "",
         curriculum_pdf:"",
            date:currentDate,
         }]);

         const handleReset=()=>{
            setCurriculumData([{
                curriculum_id:"",
                  category_name:"",
                    course_name: "",
                 curriculum_pdf:"",
                    created_date:""
                 }]);
        
         }
    const addRow = () => {
        setRows([...rows, { id: Date.now(), title:"",topic:"" }]);
    };
    const handleSave = async () => {
      console.log("updated")
    }
    const deleteRow = (id) => {
        setRows(rows.filter(row => row.id !== id));
    };
    const handleClose = () => {
      setOpen(false); // Close the modal
    };
    useEffect(() => {
        const fetchCurriculum = async () => {
            try {
                const response = await axios.get('http://localhost:8080/curriculum');
                setCurriculum(response.data); // Use the curriculum state
            } catch (error) {
                console.error("Error fetching curriculum:", error.message);
            }
        };
        fetchCurriculum();
    }, [curriculum]); // Empty dependency array ensures it runs only once
    const handleClickOpen = (row) => {
      console.log(row);
       setOpen(true)
      };
    const handleDeleteConfirmation = (curriculum_id) => {
        if (window.confirm("Are you sure you want to delete this curriculum?")) {
          handleDelete(curriculum_id);
        }
      };
      
      const handleDelete = async (curriculum_id) => {
       
         try { 
          const response = await axios.delete(`http://localhost:8080/curriculum/delete/${curriculum_id}`); 
          console.log("Curriculum deleted successfully:", response.data); 
        } catch (error) { 
          console.error("Error deleting Curriculum:", error); 
        } }; 
        // const handleFileChange = async (e) => {
        //     const file = e.target.files[0];
        //     if (file && file.type === "application/pdf") {
        //       const fileReader = new FileReader();
        
        //       fileReader.onload = async () => {
        //         const pdfData = new Uint8Array(fileReader.result);
        //         const data = await pdf(pdfData); // Parse PDF content
                
        //         // Example: Assume title and topic are in specific lines
        //         const lines = data.text.split("\n");
        //         const extractedData = lines.map((line) => {
        //           const [title, topic] = line.split(","); // Example: "Title,Topic"
        //           return { title: title?.trim(), topic: topic?.trim() };
        //         });
        
        //         setCurriculumData(extractedData); // Update state with extracted data
        //       };
        
        //       fileReader.readAsArrayBuffer(file); // Read PDF as an ArrayBuffer
        //     } else {
        //       alert("Please upload a valid PDF file");
        //     }
        //   };
        
        const handleCloseModal=()=>{
          setShowAddCourse(false);
         
        }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurriculumData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
      
        const currentDate = new Date().toISOString().split("T")[0]; // Today's date
        const dataToSubmit = { 
          ...curriculumData, 
          date: currentDate, // Ensure this is added
        };
      
        try {
          const response = await axios.post("http://localhost:8080/curriculum/add", dataToSubmit);
          if (response.status === 200) {
            alert("Curriculum details added successfully");
            setCurriculumData([...curriculumData, dataToSubmit]); // Update local state
            handleReset(); // Clear form fields
          }
        } catch (error) {
          console.error("Error adding curriculum:", error.message);
          alert("Error adding curriculum.");
        }
      };
    const handleAddTrendingCourseClick = () => setShowAddCourse(true);
  return (
    
    <>  
     {showAddCourse ?  (<div className='course-category'>
<p>Curriculun <IoIosArrowForward/> Add Curriculum </p>
<div className='category'>
<div className='category-header'>
<p>Add Curriculum</p>
</div>
<div className='course-details'>
<div className='course-row'>
<div class="col-md-3">
    <label for="inputState" class="form-label">Category Name</label>
    <select id="inputState" class="form-select" name='category_name' value={curriculumData.category_name} onChange={handleChange}>
      <option selected>Select category</option>
      <option>QA Testing</option>
      <option>Project Management</option>
      <option>Business Intelligence</option>
      <option>DataScience</option>
    </select>
  </div>
  <div class="col-md-3">
    <label for="inputState" class="form-label">Course Name</label>
    <select id="inputState" class="form-select" name='course_name' value={curriculumData.course_name} onChange={handleChange}>
      <option selected>Select course</option>
      <option>QA Automation</option>
      <option>Load Runner</option>
      <option>QA Manual Testing</option>
      <option>Mobile App Testing</option>
    </select>
  </div>
  <div class="mb-3">
  <label for="formFile" class="form-label">Curriculum PDF</label>
  <input class="form-control" type="file" id="formFile"
          name="curriculum_pdf"
          onChange={handleChange}/>
</div>
  </div>
  <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650,marginTop:5 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align='center'>Title</StyledTableCell>
            <StyledTableCell align="center">Topic</StyledTableCell>
            <StyledTableCell align="center">Add/Delete Row</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <StyledTableCell component="th" scope="row" align='center'>
               <input className='table-input' name='title' value={rows.title} onChange={handleChange}/>
              </StyledTableCell>
              <StyledTableCell align="center"><input className='table-input' name='topic' value={rows.topic} onChange={handleChange}/></StyledTableCell>
              <StyledTableCell align="center"><><GoPlus style={{fontSize:'2rem',color:'#00AEEF',marginRight:'10px'}} onClick={addRow}/>
                    <IoClose style={{fontSize:'2rem',color:'red'}} onClick={(id)=>deleteRow(id)}/></></StyledTableCell>
                  </StyledTableRow>
    
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  
<div style={{display:'flex',flexDirection:'row'}}> 
  <button className='submit-btn' data-bs-toggle='modal'
                  data-bs-target='#exampleModal' onClick={handleSubmit}>Submit</button>
  <button className='reset-btn'>Reset</button>
  
</div>
</div>
</div>
</div>
):(<div>
   <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='course-category'>
        <p>Course Schedule</p>
        <div className='category'>
          <div className='category-header'>
            <p>View Schedule Courses</p>
          </div>
          <div className='date-schedule'>
            Start Date
            <DatePicker 
  
  />
            End Date
            <DatePicker 
 
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
                <input className="search-input" type="search" placeholder="Enter Courses, Category or Keywords" aria-label="Search"/>
                <button className="btn-search" type="submit"  ><IoSearch style={{ fontSize: '2rem' }} /></button>
              </div>
              <button type="button" className="btn-category" onClick={handleAddTrendingCourseClick} >
                <FiPlus /> Add Curriculum
              </button>
            </div>
          </div>

        </div>
      </div>
    </LocalizationProvider>
    <div className='course-details'>
<div className='course-row'>
<div class="col-md-3">
    <label for="inputState" class="form-label">Category Name</label>
    <select id="inputState" class="form-select" name='category_name' value={curriculumData.category_name} onChange={handleChange}>
      <option selected>Select category</option>
      <option>QA Testing</option>
      <option>Project Management</option>
      <option>Business Intelligence</option>
      <option>DataScience</option>
    </select>
  </div>
  <div class="col-md-3">
    <label for="inputState" class="form-label">Course Name</label>
    <select id="inputState" class="form-select" name='course_name' value={curriculumData.course_name} onChange={handleChange}>
      <option selected>Select course</option>
      <option>QA Automation</option>
      <option>Load Runner</option>
      <option>QA Manual Testing</option>
      <option>Mobile App Testing</option>
    </select>
  </div>
  <div class="mb-3">
  <label for="formFile" class="form-label">Curriculum PDF</label>
  <input class="form-control" type="file" id="formFile"
          name="curriculum_pdf"
          onChange={handleChange}/>
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
            <StyledTableCell align='center'>S.No.</StyledTableCell>
            <StyledTableCell align="center">Title</StyledTableCell>
            <StyledTableCell align="center">Topics</StyledTableCell>
            <StyledTableCell align="center">Created Date</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {curriculum.map((row, index) => (
        <StyledTableRow key={row.curriculum_id}>
            <StyledTableCell>
                <Checkbox />
            </StyledTableCell>
            <StyledTableCell align='center'>{index + 1}</StyledTableCell> {/* S.No. */}
            <StyledTableCell align="center">{row.title}</StyledTableCell>
            <StyledTableCell align="center">{row.topic}</StyledTableCell>
            <StyledTableCell align="center">
        {row.date}
      </StyledTableCell>
            <StyledTableCell align="center">
                <FaEdit className="edit"  onClick={() => handleClickOpen(row)} />
                <RiDeleteBin6Line className="delete" onClick={() => handleDeleteConfirmation(row.curriculum_id)} />
            </StyledTableCell>
        </StyledTableRow>
    ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>)}
    <Dialog open={open} onClose={handleClose}>
        <div className='dialog-title'>

        <DialogTitle>Edit Schedule  </DialogTitle>
        <Button onClick={handleClose} className='close-btn'>
            <IoMdCloseCircleOutline style={{color:'white',fontSize:'2rem'}}/>
          </Button>
        </div>
        <DialogContent>
     
        <div className="col">
          <label htmlFor="inputState" className="form-label">Category Name</label>
          <select
            id="inputState"
            className="form-select"
            name="category_name"
         
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
          
          >
            <option value="">Select Course</option>
            <option>QA Automation</option>
            <option>Load Runner</option>
            <option>QA Automation Testing</option>
            <option>Mobile App Testing</option>
          </select>
        </div>
        <div class="mb-3">
  <label for="formFile" class="form-label">Curriculum PDF</label>
  <input class="form-control" type="file" id="formFile"/>
</div>
<label>Title</label>
<input/>
<label>Topic</label>
<input/>
    
        </DialogContent>
        <DialogActions>
         
          <Button onClick={handleSave} className='update-btn'>
            Update
          </Button>
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
                    Curriculum Added Successfully
                        </p>
                      </div>
                    </div>
                    </div>
                    </div>
   
 </> );
}
