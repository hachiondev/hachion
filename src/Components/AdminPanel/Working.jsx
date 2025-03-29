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


export default function Faq() {
    const [courseCategory,setCourseCategory]=useState([]);
  const [course,setCourse]=useState([]);
  const [searchTerm,setSearchTerm]=useState("")
    const [showAddCourse, setShowAddCourse] = useState(false);
    const[curriculum,setCurriculum]=useState([]);
    const[filteredCurriculum,setFilteredCurriculum]=useState([])
    const [open, setOpen] = React.useState(false);
    const [rows, setRows] = useState([{ id:"",faq_title:"",description:"" }]);
    const currentDate = new Date().toISOString().split('T')[0];
    const[message,setMessage]=useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [editedRow, setEditedRow] = useState({category_name:"",course_name:"",faq_pdf:"",faq_title:"",description:""});
    const [curriculumData, setCurriculumData] = useState({
        faq_id:"",
          category_name:"",
            course_name: "",
         faq_pdf:"",
         faq_title:"",
         description:'',
            date:currentDate,
         });
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
        
        // Slice filteredCurriculum based on rowsPerPage and currentPage
        const displayedCategories = filteredCurriculum.slice(
          (currentPage - 1) * rowsPerPage,
          currentPage * rowsPerPage
        );

         const handleReset=()=>{
            setCurriculumData({
                faq_id:"",
                  category_name:"",
                    course_name: "",
                 faq_pdf:"",
                    date:""
                 });
        
         }
         const addRow = () => {
          setRows([...rows, { id: Date.now(), faq_title: "", description: "" }]);
      };
      
      const deleteRow = (id) => {
          setRows(rows.filter(row => row.id !== id));
      };
                
    const handleClose = () => {
      setOpen(false); // Close the modal
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
      const fetchFaq = async () => {
          try {
              const response = await axios.get('http://localhost:8080/faq');
              setCurriculum(response.data); // Use the curriculum state
          } catch (error) {
              console.error("Error fetching curriculum:", error.message);
          }
      };
      fetchFaq();
      setFilteredCurriculum(curriculum)
  }, [curriculum]); // Empty dependency array ensures it runs only once

    const handleDeleteConfirmation = (faq_id) => {
        if (window.confirm("Are you sure you want to delete this Faq?")) {
          handleDelete(faq_id);
        }
      };
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedRow((prev) => ({
          ...prev,
          [name]: value,
        }));
      };
      const handleDateFilter = () => {
        const filtered = curriculum.filter((item) => {
          const curriculumDate = new Date(item.date); // Parse the date field
          const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
          const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
      
          return (
            (!start || curriculumDate >= start) &&
            (!end || curriculumDate <= end)
          );
        });
      
        setFilteredCurriculum(filtered);
      };
      const handleSave = async () => {
        try {
            const response = await axios.put(
                `http://localhost:8080/faq/update/${editedRow.faq_id}`,
                editedRow
            );
            setCurriculum((prev) =>
                prev.map(curr =>
                    curr.faq_id === editedRow.faq_id ? response.data : curr
                )
            );
            setMessage("Faq updated successfully!");
            setTimeout(() => setMessage(""), 5000);
            setOpen(false);
        } catch (error) {
            setMessage("Error updating Curriculum.");
        }
    };

      const handleDelete = async (faq_id) => {
       
         try { 
          const response = await axios.delete(`http://localhost:8080/faq/delete/${faq_id}`); 
          console.log("FAQ deleted successfully:", response.data); 
        } catch (error) { 
          console.error("Error deleting Faq:", error); 
        } }; 
        useEffect(() => {
          const filtered = curriculum.filter(curriculum =>
              (curriculum.course_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
              (curriculum.faq_title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
              (curriculum.description?.toLowerCase() || "").includes(searchTerm.toLowerCase())
          );
          setFilteredCurriculum(filtered);
      }, [searchTerm, curriculum]);      
      const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setCurriculumData((prev) => ({
                ...prev,
                faq_pdf: file, // Store the file object directly
            }));
        }
    };
    
    const handleEditFileUpload = async (e) => {
      const file = e.target.files[0];
      if (file) {
          setEditedRow((prev) => ({
              ...prev,
              faq_pdf: file, // Store the file object directly
          }));
      }
  };
  
  
        
        const handleCloseModal=()=>{
          setShowAddCourse(false);
         
        }
        const handleClickOpen = (row) => {
          console.log(row);
            setEditedRow(row)// Set the selected row data
            setOpen(true); // Open the modal
            console.log("tid",row.faq_id)
          };
    const handleChange = (e) => {
      const { name, value } = e.target;
      setCurriculumData((prevData) => ({
          ...prevData,
          [name]: value
      }));
  };
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const currentDate = new Date().toISOString().split("T")[0];
//     const dataToSubmit = {
//       category_name: curriculumData?.category_name,
//       course_name: curriculumData?.course_name,
//       curriculum_pdf: curriculumData?.curriculum_pdf,
//       title: rows.map(row => row.title),
//       topic: rows.map(row => row.topic),
//         date: currentDate
//     };

//     console.log("Data being sent:", dataToSubmit); // Debugging

//     try {
//         const response = await axios.post("http://localhost:8080/curriculum/add", dataToSubmit, {
//             headers: {
//                 "Content-Type": "multipart/form-data" 
//             }
//         });

//         if (response.status === 200) {
//             alert("Curriculum details added successfully");
//             setCurriculumData({}); // Reset form
//             handleReset();
//         }
//     } catch (error) {
//         console.error("Error adding curriculum:", error.message);
//         alert("Error adding curriculum.");
//     }
// };

const handleSubmit = async (e) => {
  e.preventDefault();

  const currentDate = new Date().toISOString().split("T")[0];
  const formData = new FormData();
  
  // Append the fields to formData
  formData.append("category_name", curriculumData?.category_name);
  formData.append("course_name", curriculumData?.course_name);
  formData.append("faq_title", curriculumData?.faq_title);
  formData.append("description", curriculumData?.description);
  formData.append("date", currentDate);

  // Append the file if available
  if (curriculumData?.faq_pdf) {
    console.log(curriculumData?.faq_pdf); 
      formData.append("file", curriculumData?.faq_pdf);
  }

  console.log("Data being sent:", formData); // Debugging

  try {
      const response = await axios.post("http://localhost:8080/faq/add", formData, {
          headers: {
              "Content-Type": "multipart/form-data"  // Important: this tells axios to send the request as multipart
          }
      });

      if (response.status === 200) {
          alert("Faq details added successfully");
          setCurriculumData({}); // Reset form
          handleReset();
      }
  } catch (error) {
      console.error("Error adding faq:", error.message);
      alert("Error adding faq.");
  }
};

        
    const handleAddTrendingCourseClick = () => setShowAddCourse(true);
  return (
    
    <>  
     {showAddCourse ?  (<div className='course-category'>
      <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                      <a href="#!" onClick={() => setShowAddCourse(false)}>FAQ </a> <MdKeyboardArrowRight />
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                      Add Faq's
                      </li>
                    </ol>
                  </nav>
<div className='category'>
<div className='category-header'>
<p>Add Faq</p>
</div>
<div className='course-details'>
<div className='course-row'>
<div class="col-md-3">
    <label for="inputState" class="form-label">Category Name</label>
    <select id="inputState" class="form-select" name='category_name' value={curriculumData.category_name} onChange={handleChange}>
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
    <select id="inputState" class="form-select" name='course_name' value={curriculumData.course_name} onChange={handleChange}>
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
  <div class="mb-3">
  <label for="formFile" class="form-label">Faq PDF</label>
  <input
    className="form-control"
    type="file"
    id="formFile"
    name='faq_pdf'
    onChange={handleFileUpload}
/>

</div>
  </div>
  <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650,marginTop:5 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align='center' sx={{ fontSize: '16px', width: '35%' }}> Title</StyledTableCell>
            <StyledTableCell align="center" sx={{ fontSize: '16px' }}>Description</StyledTableCell>
            <StyledTableCell align="center" sx={{ fontSize: '16px', width: '180px' }}>Add/Delete Row</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {rows.map((row) => (
            <StyledTableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: '1px solid #d3d3d3 '} }}
            >
              <StyledTableCell component="th" scope="row" align='center' sx={{ padding: 0, }}>
               <input className='table-curriculum' name='faq_title' value={rows.faq_title} onChange={handleChange}/>
              </StyledTableCell>
              <StyledTableCell sx={{ padding: 0 }} align="center"><input className='table-curriculum' name='description' value={rows.description} onChange={handleChange}/></StyledTableCell>
              <StyledTableCell align="center" sx={{ padding: 0 }}><><GoPlus style={{fontSize:'2rem',color:'#00AEEF',marginRight:'10px'}} onClick={addRow} />
                    <IoClose style={{fontSize:'2rem',color:'red'}} onClick={()=>deleteRow(row.id)}/></></StyledTableCell>
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
            <p>View FAQ's</p>
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
                <FiPlus /> Add Faq
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
    <select id="inputState" class="form-select" name='course_name' value={curriculumData.course_name} onChange={handleChange}>
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
  <div class="mb-3">
  <label for="formFile" class="form-label">FAQ PDF</label>
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
            <StyledTableCell  align='center' sx={{ width: '100px' }}>
              <Checkbox />
            </StyledTableCell>
            <StyledTableCell align='center' sx={{ width: '100px' }}>S.No.</StyledTableCell>
            <StyledTableCell align="center">Title</StyledTableCell>
            <StyledTableCell align="center">Description</StyledTableCell>
            <StyledTableCell align="center">Created Date</StyledTableCell>
            <StyledTableCell align="center" sx={{ width: '150px' }}>Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {displayedCategories.length > 0 ? (
  displayedCategories.map((course, index) => (
    <StyledTableRow key={course.curr_id}>
      <StyledTableCell align="center">
        <Checkbox />
      </StyledTableCell>
      <StyledTableCell align="center">
        {index + 1 + (currentPage - 1) * rowsPerPage}
      </StyledTableCell>
      <StyledTableCell align="left">{course.faq_title}</StyledTableCell>
      <StyledTableCell align="left">
        <ul className="bullet-list">
          {course.description ? (
            course.description.split(',').map((desc, i) => (
              <li key={i}>{desc.trim()}</li>
            ))
          ) : (
            <li>No topics available</li>
          )}
        </ul>
      </StyledTableCell>
      <StyledTableCell align="center">{course.date}</StyledTableCell>
      <StyledTableCell align="center">
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <FaEdit className="edit" onClick={() => handleClickOpen(course)} />
          <RiDeleteBin6Line
            className="delete"
            onClick={() => handleDeleteConfirmation(course.faq_id)}
          />
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
      totalRows={filteredCurriculum.length} // Use the full list for pagination
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
    <DialogTitle  id="edit-schedule-dialog">Edit FAQ</DialogTitle>
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

    <div className="mb-3">
      <label htmlFor="curriculumPDF" className="form-label">FAQ's PDF</label>
      <input
        className="form-control-sample"
        type="file"
        id="curriculumPDF"
        accept='.pdf'
        name="faq_pdf"
      
        onChange={handleEditFileUpload}
    
      />
    </div>

    <label htmlFor="title">Title</label>
    <input
      id="title"
      className="form-control"
      name="faq_title"
      value={editedRow.faq_title || ""}
      onChange={handleInputChange}
    />

    <label htmlFor="topic">Description</label>
    <input
      id="topic"
      className="form-control"
      name="description"
      value={editedRow.description || ""}
      onChange={handleInputChange}
    />
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
                    FAQ Added Successfully
                        </p>
                      </div>
                    </div>
                    </div>
                    </div>
   
 </> );
}