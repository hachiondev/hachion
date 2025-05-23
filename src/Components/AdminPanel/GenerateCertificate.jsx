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
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import AdminPagination from './AdminPagination';
import { MdKeyboardArrowRight } from 'react-icons/md';
import './Admin.css';
dayjs.extend(customParseFormat);
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
  const [certificateList, setCertificateList] = useState([]);
  const [editedData, setEditedData] = useState({
    student_id: "",student_name: "", email: "", course_name: "", status: "", completed_date: "", certificate_img: "", certificate_id: "",
  });
  const [certificateData, setCertificateData] = useState({
    student_id: "", student_name: "", email: "", course_name: "", status: "", completed_date: "", certificate_img: "", certificate_id: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [students, setStudents] = useState([]);
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo(0, window.scrollY);
  }, []);
  const handleRowsPerPageChange = useCallback((rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  }, []);
  // const displayedCertificates = useMemo(() => 
  //   certificateList.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage), 
  //   [certificateList, currentPage, rowsPerPage]
  // );
  const displayedCourse = useMemo(() => filteredCertificate.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  ), [filteredCertificate, currentPage, rowsPerPage]);
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setShowPreview(false);
    setPreviewUrl(null);
  };
  const handleGenerate = async () => {
    if (
      !certificateData.student_id ||
      !certificateData.student_name ||
      !certificateData.course_name ||
      !certificateData.completed_date ||
      !certificateData.email ||
      !certificateData.status
    ) {
      alert("Please fill in all required fields before generating the certificate.");
      return;
    }
  
    const payload = {
      studentId: certificateData.student_id,
      studentName: certificateData.student_name,
      courseName: certificateData.course_name,
      completionDate: certificateData.completed_date,
      studentEmail: certificateData.email,
      status: certificateData.status
    };
  
    try {
      const response = await fetch('https://api.hachion.co/certificate/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
  
        const certificateId = response.headers.get('Certificate-Id');
        console.log('Certificate ID from response headers:', certificateId);
        if (certificateId) {
          setCertificateData((prevData) => ({
            ...prevData,
            certificate_id: certificateId, 
          }));
        }
  
        // alert("Certificate generated successfully!");
      } else {
        alert("Failed to generate certificate.");
      }
    } catch (error) {
      console.error("Error generating certificate:", error);
      alert("An error occurred.");
    }
  };
  const handleImgReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowPreview(false);
  };
  const handleReset = useCallback(() => {
    setCertificateData({
      student_id: "", student_name: "", email: "", course_name: "", status: "", completed_date: "", certificate_img: "", certificate_id: ""
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
  useEffect(() => {
    const fetchCourseNames = async () => {
      try {
        const response = await fetch('https://api.hachion.co/enroll/coursenames');
        const data = await response.json();
        
        const formattedData = data.map((courseName, index) => ({
          id: index, 
          courseName: courseName,
        }));
        setFilterCourse(formattedData); 
      } catch (error) {
        console.error('Error fetching course names:', error);
      }
    };

    fetchCourseNames();
  }, []); 

  useEffect(() => {
    if (certificateData.course_name) {
      const fetchStudents = async () => {
        try {
          const response = await fetch(`https://api.hachion.co/api/v1/user/students/${certificateData.course_name}`);
          const data = await response.json();
          setStudents(data); 
        } catch (error) {
          console.error('Error fetching students:', error);
        }
      };
      fetchStudents();
    }
  }, [certificateData.course_name]);
  useEffect(() => {
    const fetchByStudentId = async () => {
      if (certificateData.student_id) {
        try {
          const res = await fetch(`https://api.hachion.co/api/v1/user/lookup?studentId=${certificateData.student_id}`);
          const data = await res.json();
          setCertificateData((prev) => ({
            ...prev,
            student_name: data.userName,
            email: data.email,
          }));
        } catch (err) {
          console.error("Error fetching by student ID:", err);
        }
      }
    };
    fetchByStudentId();
  }, [certificateData.student_id]);
  useEffect(() => {
    const fetchByUserName = async () => {
      if (certificateData.student_name) {
        try {
          const res = await fetch(`https://api.hachion.co/api/v1/user/lookup?userName=${certificateData.student_name}`);
          const data = await res.json();
          setCertificateData((prev) => ({
            ...prev,
            student_id: data.studentId,
            email: data.email,
          }));
        } catch (err) {
          console.error("Error fetching by user name:", err);
        }
      }
    };
    fetchByUserName();
  }, [certificateData.student_name]);
    
  useEffect(() => {
    const fetchCompletionDate = async () => {
      if (certificateData.course_name && certificateData.student_name) {
        try {
          const res = await fetch('https://api.hachion.co/api/v1/user/completiondate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              courseName: certificateData.course_name,
              userName: certificateData.student_name,
            }),
          });
          const data = await res.json();
          setCertificateData((prev) => ({
            ...prev,
            completed_date: data.completionDate,
          }));
        } catch (err) {
          console.error("Error fetching completion date:", err);
        }
      }
    };
  
    fetchCompletionDate();
  }, [certificateData.course_name, certificateData.student_name]);
  const handleSendEmail = async () => {
    const certificateId = certificateData.certificate_id;
  
    if (!certificateId) {
      alert("Certificate ID not available.");
      return;
    }
  
    try {
      const response = await fetch(`https://api.hachion.co/certificate/send-email/${certificateId}`, {
        method: 'POST',
      });
  
      if (response.ok) {
        alert("Email sent successfully!");
      } else {
        alert("Failed to send email.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("An error occurred while sending the email.");
    }
  };
  useEffect(() => {
    const fetchCertificateData = async () => {
      try {
        const response = await fetch("https://api.hachion.co/certificate/all");
        const data = await response.json();
        setCertificateList(data);
      } catch (error) {
        console.error("Error fetching certificate data:", error);
      }
    };
  
    fetchCertificateData();
  }, []);
  const handleDelete = async (id) => {
           try { 
            const response = await axios.delete(`https://api.hachion.co/certificate/delete/${id}`); 
          } catch (error) { 
          } }; 
       useEffect(() => {
  const filtered = certificate.filter((item) => {
    const date = new Date(item.completed_date);
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      searchTerm === '' ||
      [
        item.student_id,
        item.student_name,
        item.email,
        item.course_name,
        item.status,
        item.certificate_id,
        item.completed_date
      ]
        .map(field => String(field || '').toLowerCase())
        .some(field => field.includes(term));

    const inDateRange =
      (!startDate || date >= new Date(startDate)) &&
      (!endDate || date <= new Date(new Date(endDate).setHours(23, 59, 59, 999)));

    return matchesSearch && inDateRange;
  });

  setFilteredCertificate(filtered);
}, [searchTerm, startDate, endDate, certificate]);

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
  
    const certificateId = certificateData.certificate_id;
  
    if (!certificateId) {
      alert("Certificate ID not available.");
      return;
    }
  
    try {
      const response = await fetch(`https://api.hachion.co/certificate/download/${certificateId}`);
  
      if (!response.ok) {
        throw new Error("Failed to download certificate.");
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
  
      // Trigger file download
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate_${certificateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
  
      alert("Certificate downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download certificate.");
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

      {/* Student ID Selection */}
      <div className="col">
        <label htmlFor="student_id" className="form-label">Student ID</label>
        <select
          className="form-select"
          id="student_id"
          name="student_id"
          value={certificateData.student_id}
          onChange={handleChange}
        >
          <option value="">Select Student ID</option>
          {students.map((student) => (
            <option key={student.studentId} value={student.studentId}>
              {student.studentId}
            </option>
          ))}
        </select>
      </div>
      {/* <div class="col">
    <label for="inputEmail4" class="form-label">Student ID</label>
    <select className="form-select" id="inputEmail4" name='student_id' value={certificateData.student_id} onChange={handleChange}>
    <option value="">Select Student ID</option>
  </select>
  </div> */}
  {/* Student Name (userName) Selection */}
  <div className="col">
        <label htmlFor="student_name" className="form-label">Student Full Name</label>
        <select
          className="form-select"
          id="student_name"
          name="student_name"
          value={certificateData.student_name}
          onChange={handleChange}
        >
          <option value="">Select Student Name</option>
          {students.map((student) => (
            <option key={student.studentId} value={student.userName}>
              {student.userName}
            </option>
          ))}
        </select>
      </div>
  
  </div>
  <div className='course-row'>
  <div className="col">
  <label htmlFor="email" className="form-label">Email</label>
  <input
    type="text"
    className="schedule-input"
    id="email"
    name="email"
    value={certificateData.email}
    onChange={handleChange}
    readOnly 
  />
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
                <div className="col">
                <label htmlFor="inputEmail4" className="form-label">Completed Date</label>
                <input
                className="schedule-input"
                id="inputEmail4"
                name="completed_date"
                value={
                  certificateData.completed_date
                    ? dayjs(certificateData.completed_date).format("DD-MM-YYYY")
                    : ""
                }
                readOnly
              />
              </div>
        </div>
        <div className="course-row">
        <div className='course-column'>
        <div class="col">
            <label className="form-label">Certificate ID</label>
            <input
  type="text"
  className="schedule-input"
  id="inputEmail4"
  name='certificate_id'
  value={certificateData.certificate_id}  
  onChange={handleChange}
  readOnly
/>

            {/* <input type="text" class="schedule-input" id="inputEmail4" name='certificate_id' value={certificateData.certificate_img} onChange={handleChange}/> */}
            </div>
            <button
  type="button"
  onClick={handleGenerate}
  className="generate-btn"
  disabled={certificateData.status !== "Completed"} // Disabled if status is not "Completed"
>
  Generate
</button>
        {/* <button
          type="button"
          onClick={handleGenerate}
          className='generate-btn'
        >
          Generate
        </button> */}
        <button 
  type="button"
  onClick={() => {
    handleReset();       
    handleImgReset();    
  }}
  className='generate-btn'
>
  RESET
</button>
        {/* <button
          type="button"
          onClick={handleImgReset}
          className='generate-btn'
        >
          RESET
        </button>
         */}
      </div>
      <div className="col">
  <label className="form-label">Certificate Preview</label>
  <div className='cert-img'>
    {previewUrl ? (
      <iframe
        src={previewUrl}
        title="Certificate Preview"
        width="100%"
        height="400px"
        style={{ border: "1px solid #ccc" }}
      ></iframe>
    ) : (
      <span style={{ color: "#aaa" }}>Preview will appear here</span>
    )}
  </div>
</div>
    </div>  
    </div>
            <div className='course-row'>
            <button className='generate-btn' data-bs-toggle='modal'
                            data-bs-target='#exampleModal' onClick={handleSubmit} disabled={!certificateData.certificate_id}>Save Certificate</button>
            <button className='generate-btn' onClick={handleSendEmail} disabled={!certificateData.certificate_id}>
  Send to Email
</button>
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
                        views={['year', 'month']}
                        label="Start Month"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        format="MMMM YYYY"
                        sx={{
                          '& .MuiIconButton-root': { color: '#00aeef' }
                        }}
                      />
                        End Date
                      <DatePicker
                          views={['year', 'month']}
                          label="End Month"
                          value={endDate}
                          onChange={(newValue) => setEndDate(newValue)}
                          format="MMMM YYYY"
                          sx={{
                            '& .MuiIconButton-root': { color: '#00aeef' }
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
                      <StyledTableCell align="center">{curr.studentId}</StyledTableCell>
        <StyledTableCell align="center">{curr.studentName}</StyledTableCell>
        <StyledTableCell align="center">{curr.studentEmail}</StyledTableCell>
        <StyledTableCell align="center">{curr.courseName}</StyledTableCell>
        <StyledTableCell align="center">{curr.status}</StyledTableCell>
        <StyledTableCell align="center">
  {curr.studentId && curr.courseName && curr.completionDate ? (
    <a
      href={`https://api.hachion.co/download/filename/${curr.studentId}_${curr.courseName.replaceAll(' ', '_')}_${dayjs(curr.completionDate).format('YYYY_MM_DD')}_Certificate.pdf`}
      download
      target="_blank"
      rel="noopener noreferrer"
    >
      View PDF
    </a>
  ) : 'Not Available'}
</StyledTableCell>
        <StyledTableCell align="center">{curr.certificateId}</StyledTableCell>
        <StyledTableCell align="center">{dayjs(curr.completionDate).format("DD-MM-YYYY")}</StyledTableCell>
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
              totalRows={certificateList.length}
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