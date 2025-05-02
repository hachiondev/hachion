import  React, { useEffect } from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import './Admin.css';
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
import { MdKeyboardArrowRight } from 'react-icons/md';
import AdminPagination from './AdminPagination';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#00AEEF',
    color: theme.palette.common.white,
    borderRight: '1px solid white',
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
export default function CourseCertificate() {
  const[course,setCourse]=useState([]);
  const[courseCategory,setCourseCategory]=useState([]);
    const [filterCourse,setFilterCourse]=useState([]);
  const [searchTerm,setSearchTerm]=useState("")
    const [showAddCourse, setShowAddCourse] = useState(false);
    const[certificate,setCertificate]=useState([]);
    const[filteredCertificate,setFilteredCertificate]=useState([])
    const [open, setOpen] = React.useState(false);
    const currentDate = new Date().toISOString().split('T')[0];
    const[message,setMessage]=useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [editedData, setEditedData] = useState({certificate_image:"",course_name:"",category_name:"",title:"",description:"",});
    const [certificateData, setCertificateData] = useState({
      id:"",
          certificate_image:null,
           course_name: "",
            date:currentDate,
           category_name:"",
           title:"",
           description:"",
         });
        const [currentPage, setCurrentPage] = useState(1);
                    const [rowsPerPage, setRowsPerPage] = useState(10);
                    const handlePageChange = (page) => {
                     setCurrentPage(page);
                     window.scrollTo(0, window.scrollY);
                   };
                 const handleRowsPerPageChange = (rows) => {
                   setRowsPerPage(rows);
                   setCurrentPage(1);
                 };
                 const displayedCourse = filteredCertificate.slice(
                  (currentPage - 1) * rowsPerPage,
                  currentPage * rowsPerPage
                );
const handleFileChange = (e) => {
    setCertificateData((prev) => ({ ...prev, certificate_image: e.target.files[0] }));
  };
         const handleReset=()=>{
            setCertificateData([{
              id:"",
              certificate_image:null,
               course_name: "",
                date:currentDate,
               category_name:"",
               title:"",
               description:"",
                 }]);       
         }
         const handleInputChange = (e) => {
            const { name, value } = e.target;
            setEditedData((prev) => ({
              ...prev,
              [name]: value,
            }));
          }
    const handleClose = () => {
      setOpen(false); 
    };
    useEffect(() => {
      const fetchCertificate = async () => {
          try {
              const response = await axios.get('https://api.hachion.co/certificate');
              setCertificate(response.data);
          } catch (error) {
          }
      };
      fetchCertificate();
      setFilteredCertificate(certificate);
  }, []);
    const handleDeleteConfirmation = (id) => {
        if (window.confirm("Are you sure you want to delete this certificate")) {
          handleDelete(id);
        }
      };
      const handleSave = async () => {
        try {
            const response = await axios.put(
                `https://api.hachion.co/certificate/${editedData.id}`,editedData
            );
            setCertificate((prev) =>
                prev.map(curr =>
                    curr.id === editedData.id ? response.data : curr
                )
            );
            setMessage("Certificate updated successfully!");
            setTimeout(() => setMessage(""), 5000);
            setOpen(false);
        } catch (error) {
            setMessage("Error updating Certificate.");
        }
    };
      const handleDelete = async (id) => {
         try { 
          const response = await axios.delete(`https://api.hachion.co/certificate/delete/${id}`); 
        } catch (error) { 
        } }; 
        useEffect(() => {
          const filtered = certificate.filter(certificate =>
              certificate.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              certificate.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              certificate.title.toLowerCase().includes(searchTerm.toLowerCase())     
          );
          setFilteredCertificate(filtered);
      }, [searchTerm,filteredCertificate]);
        const handleClickOpen = (row) => {
              setEditedData(row)
              setOpen(true);
            };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCertificateData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
      useEffect(() => {
        const fetchCategory = async () => {
          try {
            const response = await axios.get("https://api.hachion.co/course-categories/all");
            setCourse(response.data); 
          } catch (error) {
          }
        };
        fetchCategory();
      }, []);
      useEffect(() => {
        const fetchCourseCategory = async () => {
          try {
            const response = await axios.get("https://api.hachion.co/courses/all");
            setCourseCategory(response.data);
          } catch (error) {
          }
        };
        fetchCourseCategory();
      }, []);
       useEffect(() => {
            if (certificateData.category_name) {
              const filtered = courseCategory.filter(
                (course) => course.courseCategory === certificateData.category_name
              );
              setFilterCourse(filtered);
            } else {
              setFilterCourse([]);
            }
          }, [certificateData.category_name, courseCategory]);
      const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const currentDate = new Date().toISOString().split("T")[0]; 
        formData.append("date", currentDate);
        formData.append("course_name", certificateData.course_name);
        formData.append("category_name", certificateData.category_name);
        formData.append("title", certificateData.title);
        formData.append("description", certificateData.description);
        if (certificateData.certificate_image) {
            formData.append("certificate_image", certificateData.certificate_image);
        } else {
            alert("Please select an image.");
            return;
        }
        try {
            const response = await axios.post("https://api.hachion.co/certificate/add", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.status === 201 || response.status === 200) {
                alert("Certificate added successfully");
                setCertificateData([...certificateData, { ...certificateData, date: currentDate }]); // Update local state
                handleReset();
            }
        } catch (error) {
            alert("Error adding certificate.");
        }
    };
    const handleAddTrendingCourseClick = () => {setShowAddCourse(true);
    }
  return (
    <>  
     {showAddCourse ?  (<div className='course-category'>
      <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
        <li className="breadcrumb-item">
              <a href="#!" onClick={() => setShowAddCourse(false)}>Course Certificate</a> <MdKeyboardArrowRight />
              </li>
              <li className="breadcrumb-item active" aria-current="page">
              Add Course Certificate
              </li>
            </ol>
          </nav>
<div className='category'>
<div className='category-header'>
<p>Add Course Certificate </p>
</div>
<div className='course-details'>
<div className='course-row'>
<div class="col">
    <label for="inputState" class="form-label">Category Name</label>
    <select id="inputState" class="form-select" name='category_name' value={certificateData.category_name} onChange={handleChange}>
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
        <label htmlFor="course" className="form-label">Course Name</label>
        <select
          id="course"
          className="form-select"
          name="course_name"
          value={certificateData.course_name}
          onChange={handleChange}
          disabled={!certificateData.category_name}
        >
          <option value="" disabled>Select Course</option>
          {filterCourse.map((curr) => (
            <option key={curr.id} value={curr.courseName}>{curr.courseName}</option>
          ))}
        </select>
      </div>
  </div>
  <div className='course-row'>
  <div class="col">
    <label for="inputEmail4" class="form-label">Certificate Title</label>
    <input type="text" class="schedule-input" id="inputEmail4" name='title' value={certificateData.title} onChange={handleChange}/>
  </div>
<div className="col">
                <label className="form-label">Certificate Image</label>
                <input
                  type="file"
                  className="schedule-input"
                  name="certificate_image"
                  onChange={handleFileChange}
                  required
                />
  </div>  
</div>

  <div class="mb-6">
    <label for="inputEmail4" class="form-label">Description</label>
    <textarea type="text" class="form-control" id="exampleFormControlTextarea1" name='description' value={certificateData.description} onChange={handleChange}/>
  </div>
  <div className='course-row'>
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
            <p>Course Certificate</p>
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
            <button className='filter' >Filter</button>
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
                <FiPlus /> Add Course Certificate
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
            <StyledTableCell align='center'>
              <Checkbox />
            </StyledTableCell>
            <StyledTableCell align='center'>S.No.</StyledTableCell>
            <StyledTableCell align='center'>Course Name</StyledTableCell>
            <StyledTableCell align='center'>Certificate Title</StyledTableCell>
            <StyledTableCell align="center">Certificate Image</StyledTableCell>
            <StyledTableCell align="center">Description</StyledTableCell>
            <StyledTableCell align="center">Created Date </StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {displayedCourse.length > 0
    ? displayedCourse.map((curr, index) => (
    <StyledTableRow key={curr.id}>
        <StyledTableCell align='center'>
            <Checkbox />
        </StyledTableCell>
        <StyledTableCell align="center">{index + 1 + (currentPage - 1) * rowsPerPage}
          </StyledTableCell> {/* S.No. */}
        <StyledTableCell align="center">{curr.course_name}</StyledTableCell>
        <StyledTableCell align="center">{curr.title}</StyledTableCell>
        <StyledTableCell align="center">
            {curr.certificate_image ? (
                <img
                    src={curr.certificate_image}
                    alt={`Certificate ${index + 1}`}
                    style={{ width: "100px", height: "auto" }}
                />
            ) : (
                "No Image"
            )}
            </StyledTableCell>
        <StyledTableCell align="center">{curr.description}</StyledTableCell>
        <StyledTableCell align="center">{curr.date}</StyledTableCell>
        <StyledTableCell align="center">
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
            <FaEdit className="edit" onClick={() => handleClickOpen(curr)} />
            <RiDeleteBin6Line className="delete" onClick={() => handleDeleteConfirmation(curr.id)} />
            </div>
        </StyledTableCell>
    </StyledTableRow>
))
: (
  <StyledTableRow>
    <StyledTableCell colSpan={9} align="center">
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
              totalRows={filteredCertificate.length} 
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
    <DialogTitle className="dialog-title" id="edit-schedule-dialog">Edit Course Certificate
    <Button onClick={handleClose} className="close-btn">
      <IoMdCloseCircleOutline style={{ color: "white", fontSize: "2rem" }} />
    </Button>
    </DialogTitle>
  </div>
  <DialogContent>
  <div className="course-row">
  <div class="col">
    <label for="inputState" class="form-label">Category Name</label>
    <select id="inputState" class="form-select" name='category_name' value={editedData.category_name} onChange={handleInputChange}>
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
  <div class="col">
    <label for="inputState" class="form-label">Course Name</label>
    <select id="inputState" class="form-select" name='course_name' value={editedData.course_name} onChange={handleInputChange}>
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
      <label htmlFor="courseName" className="form-label">Certificate Title</label>
      <input
        id="courseName"
        className="form-control"
        name="title"
        value={editedData.title || ""}
        onChange={handleInputChange}
     />
     
    </div>
  <div className="col">
                <label className="form-label">Certificate Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="image"
                  onChange={handleFileChange}
                  required
                />
              </div>
            
    <div className="mb-6">
      <label htmlFor="courseName" className="form-label">Description</label>
      <input
        id="exampleFormControlTextarea1"
        className="form-control"
        name="description"
        value={editedData.description || ""}
        onChange={handleInputChange}
     />
    </div>
  </DialogContent>
  <DialogActions className="update" style={{ display: 'flex', justifyContent: 'center' }}>
    <Button onClick={handleSave} className="update-btn">Update</Button>
  </DialogActions>
</Dialog>
   
 </> );
}