import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox,
  Dialog, DialogActions, DialogContent, DialogTitle, Button
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { IoSearch } from "react-icons/io5";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaEdit } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import axios from 'axios';
import AdminPagination from './AdminPagination';
import { MdKeyboardArrowRight } from 'react-icons/md';
import './Admin.css';
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
export default function CandidateCertificate() {
  const [course, setCourse] = useState([]);
  const [courseCategory, setCourseCategory] = useState([]);
  const [filterCourse, setFilterCourse] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [certificate, setCertificate] = useState([]);
  const [filteredCertificate, setFilteredCertificate] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [editedData, setEditedData] = useState({
    student_id: "",student_name: "", email: "", course_name: "", status: "", completed_date: "", certificate_img: "", certificate_id: "",
  });
  const [certificateData, setCertificateData] = useState({
    student_id: "", student_name: "", email: "", course_name: "", status: "", completed_date: "", certificate_img: "", certificate_id: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo(0, window.scrollY);
  }, []);
  const handleRowsPerPageChange = useCallback((rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  }, []);
  const displayedCourse = useMemo(() => filteredCertificate.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  ), [filteredCertificate, currentPage, rowsPerPage]);
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setShowPreview(false);
    setPreviewUrl(null);
  };
  const handleGenerate = () => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setShowPreview(true);
    } else {
      alert("Please select a file first.");
    }
  };
  const handleImgReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowPreview(false);
  };
  const handleReset = useCallback(() => {
    setCertificateData({
      student_id: "", student_name: "", email: "", course_name: "", status: "", completed_date: "", certificate_img: "", cetificate_id: ""
    });
  }, []);
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);
  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await axios.get('https://api.hachion.co/certificate');
        setCertificate(response.data);
        setFilteredCertificate(response.data);
      } catch (error) {
      }
    };
    fetchCertificate();
  }, []);
  const handleSave = useCallback(async () => {
    try {
      const response = await axios.put(
        `https://api.hachion.co/certificate/${editedData.id}`, editedData
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
  }, [editedData]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCertificateData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleDelete = async (id) => {
           try { 
            const response = await axios.delete(`https://api.hachion.co/certificate/delete/${id}`); 
          } catch (error) { 
          } }; 
          useEffect(() => {
            const filtered = certificate.filter(certificate =>
                certificate.course_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                certificate.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                certificate.completed_date?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                certificate.status?.toLowerCase().includes(searchTerm.toLowerCase())     
            );
            setFilteredCertificate(filtered);
        }, [searchTerm,certificate]);
  const handleDeleteConfirmation = (id) => {
    if (window.confirm("Are you sure you want to delete this certificate")) {
      handleDelete(id);
    }
  };
  const handleClickOpen = useCallback((row) => {
    setEditedData(row);
    setOpen(true);
  }, []);
  useEffect(() => {
    const fetchCandidateCertificate = async () => {
      try {
        const response = await axios.get("https://api.hachion.co/courses/all");
        setCourseCategory(response.data);
      } catch (error) {
      }
    };
    fetchCandidateCertificate();
  }, []);
  const handleSubmit = async (e) => {
          e.preventDefault();
          const formData = new FormData();
          const currentDate = new Date().toISOString().split("T")[0]; 
          formData.append("student_id", certificateData.student_id);
          formData.append("student_name", certificateData.student_name);
          formData.append("email", certificateData.email);
          formData.append("course_name", certificateData.course_name);
          formData.append("status", certificateData.status);
          formData.append("certificate_id", certificateData.certificate_id);
          formData.append("completed_date", certificateData.completed_date);
          if (certificateData.certificate_img) {
              formData.append("certificate_img", certificateData.certificate_img);
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
                  setCertificate((prev) => [...prev, { ...certificateData, date: currentDate }]);
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
              <a href="#!" onClick={() => setShowAddCourse(false)}>Generated Certificate</a> <MdKeyboardArrowRight />
              </li>
              <li className="breadcrumb-item active" aria-current="page">
              Generate Certificate
              </li>
            </ol>
          </nav>
<div className='category'>
<div className='category-header'>
<p>Generate Certificate </p>
</div>
<div className='course-details'>
<div className='course-row'>
  <div className="col">
        <label htmlFor="course" className="form-label">Course Name</label>
        <select
          id="course"
          className="form-select"
          name="course_name"
          value={certificateData.course_name}
          onChange={handleChange}
        >
          <option value="" disabled>Select Course</option>
          {filterCourse.map((curr) => (
            <option key={curr.id} value={curr.courseName}>{curr.courseName}</option>
          ))}
        </select>
      </div>
      <div class="col">
    <label for="inputEmail4" class="form-label">Student ID</label>
    <select className="form-select" id="inputEmail4" name='student_id' value={certificateData.student_id} onChange={handleChange}>
    <option value="">Select Student ID</option>
  </select>
  </div>
  <div class="col">
    <label for="inputEmail4" class="form-label">Student Full Name</label>
    <select className="form-select" id="inputEmail4" name='student_name' value={certificateData.student_name} onChange={handleChange}>
    <option value="">Select Student Name</option>
    </select>
  </div>
  </div>
  <div className='course-row'>
  <div class="col">
    <label for="inputEmail4" class="form-label">Email</label>
    <input type="text" class="schedule-input" id="inputEmail4" name='email' value={certificateData.email} onChange={handleChange}/>
  </div>
      <div class="col">
      <label htmlFor="inputState" className="form-label">Status</label>
                <select
                  id="inputState"
                  className="form-select"
                  name='status'
                  value={certificateData.status}
                  onChange={handleChange}
                >
                  <option value="">Select Status</option>
                  <option value="Completed">Completed</option>
                  <option value="In Progress">Progress</option>
                  <option value="Pending">Pending</option>
                </select>
                </div>
                <div class="col">
                    <label for="inputEmail4" class="form-label">Completed Date</label>
                    <input class="schedule-input" id="inputEmail4" name='completed_date' value={certificateData.completed_date} onChange={handleChange}/>
                </div>
                </div>
        <div className="course-row">
        <div className='course-column'>
        <div class="col">
            <label className="form-label">Certificate ID</label>
            <input type="text" class="schedule-input" id="inputEmail4" name='certificate_id' value={certificateData.certificate_img} onChange={handleChange}/>
            </div>
        <button
          type="button"
          onClick={handleGenerate}
          className='submit-btn'
        >
          Generate
        </button>
        <button
          type="button"
          onClick={handleImgReset}
          className='submit-btn'
        >
          RESET
        </button>
      </div>
      <div className="col">
      <label className="form-label">Certificate Image</label>
        <div className='cert-img' >
        {previewUrl ? (
            <img
            src={previewUrl}
            alt="Certificate Img"
            className='prev-img'
            />
        ) : (
            <span style={{ color: "#aaa" }}>Preview will appear here</span>
        )}
        </div>
        </div>
      {/* <div className='cert-img'>      
        {!showPreview ? (
        <>
          <label className="form-label">Certificate Image</label>
          <input
            type="file"
            className="schedule-input"
            name="certificate_img"
            accept="image/*"
            onChange={handleFileChange}
          />
        </>
      ) : (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "6px",
            backgroundColor: "#f9f9f9",
            marginBottom: "10px",
          }}
        >
          <label className="form-label">Certificate Preview</label>
          <img
            src={previewUrl}
            alt="Certificate Preview"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
      )}
      </div> */}
    </div>  
    </div>
            <div className='course-row'>
            <button className='submit-btn' data-bs-toggle='modal'
                            data-bs-target='#exampleModal' onClick={handleSubmit}>Save Certificate</button>
            <button className='submit-btn'>Send to Email</button>
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
                            <FiPlus /> Generate Certificate
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
                  <StyledTableCell align='center'>Student ID</StyledTableCell>
                  <StyledTableCell align='center'>Student Full Name</StyledTableCell>
                  <StyledTableCell align='center'>Email</StyledTableCell>
                  <StyledTableCell align="center">Course Name</StyledTableCell>
                  <StyledTableCell align="center">Course Status</StyledTableCell>
                  <StyledTableCell align="center">Certificate Image</StyledTableCell>
                  <StyledTableCell align="center">Certificate ID</StyledTableCell>
                  <StyledTableCell align="center">Completed Date</StyledTableCell>
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
                      <StyledTableCell align="center">{index + 1 + (currentPage - 1) * rowsPerPage}</StyledTableCell>
                      <StyledTableCell align="center">{curr.student_id}</StyledTableCell>
                      <StyledTableCell align="center">{curr.student_name}</StyledTableCell>
                      <StyledTableCell align="center">{curr.email}</StyledTableCell>
                      <StyledTableCell align="center">{curr.course_name}</StyledTableCell>
                      <StyledTableCell align="center">{curr.status}</StyledTableCell>
                      <StyledTableCell align="center">{curr.certificate_img}</StyledTableCell>
                      <StyledTableCell align="center">{curr.cetificate_id}</StyledTableCell>
                      <StyledTableCell align="center">{curr.completed_date}</StyledTableCell>
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
                      <StyledTableCell colSpan={10} align="center">
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
              <DialogTitle className="dialog-title" id="edit-schedule-dialog">Edit Candidate Certificate
                <Button onClick={handleClose} className="close-btn">
                  <IoMdCloseCircleOutline style={{ color: "white", fontSize: "2rem" }} />
                </Button>
                </DialogTitle>
              </div>
              <DialogContent>
            <div className="course-row">
              <div className="col">
                <label htmlFor="inputState" className="form-label">Course Name</label>
                <select
                  id="inputState"
                  className="form-select"
                  name='course_name'
                  value={editedData.course_name}
                  onChange={handleInputChange}
                >
                  <option value="">Select Course</option>
                  {courseCategory.map((course, index) => (
                    <option key={index} value={course.course_name}>
                      {course.course_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col">
                <label htmlFor="inputState" className="form-label">Status</label>
                <select
                  id="inputState"
                  className="form-select"
                  name='status'
                  value={editedData.status}
                  onChange={handleInputChange}
                >
                  <option value="">Select Status</option>
                  <option value="Completed">Completed</option>
                  <option value="In Progress">Progress</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>
            <div className="course-row">
              <div className="col">
                <label htmlFor="inputState" className="form-label">Completed Date</label>
                <input
                  type="date"
                  id="inputState"
                  className="form-control"
                  name="completed_date"
                  value={editedData.completed_date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col">
                <label className="form-label">Certificate Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
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