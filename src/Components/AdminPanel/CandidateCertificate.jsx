import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox,
  Dialog, DialogActions, DialogContent, DialogTitle, Button
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { IoSearch, IoEye } from "react-icons/io5";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FiUpload } from "react-icons/fi";
import axios from 'axios';
import AdminPagination from './AdminPagination';
import './Admin.css';
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
  const [editedData, setEditedData] = useState({
    student_name: "", email: "", course_name: "", status: "", completed_date: "", certificate_pdf: "",
  });
  const [certificateData, setCertificateData] = useState({
    id: "", student_name: "", email: "", course_name: "", status: "", completed_date: "", certificate_pdf: "",
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
  const handleFileChange = useCallback((e) => {
    setCertificateData((prev) => ({ ...prev, certificate_pdf: e.target.files[0] }));
  }, []);
  const handleReset = useCallback(() => {
    setCertificateData({
      id: "", student_name: "", email: "", course_name: "", status: "", completed_date: "", certificate_pdf: "",
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
  // useEffect(() => {
  //   const fetchCertificate = async () => {
  //     try {
  //       const response = await axios.get('https://api.hachion.co/certificate');
  //       setCertificate(response.data);
  //       setFilteredCertificate(response.data);
  //     } catch (error) {
  //     }
  //   };
  //   fetchCertificate();
  // }, []);
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
  // useEffect(() => {
  //   const filtered = certificate.filter(certificate =>
  //     certificate.course_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     certificate.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     certificate.email?.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  //   setFilteredCertificate(filtered);
  // }, [searchTerm, certificate]);
  const handleClickOpen = useCallback((row) => {
    setEditedData(row);
    setOpen(true);
  }, []);
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
    const fetchCandidateCertificate = async () => {
      try {
        const response = await axios.get("https://api.hachion.co/courses/all");
        setCourseCategory(response.data);
      } catch (error) {
      }
    };
    fetchCandidateCertificate();
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
  return (
    <>
      <div className='course-category'>
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className='course-category'>
              <div className='category'>
                <div className='category-header'>
                  <p style={{ marginBottom: 0 }}>Candidate Certificate</p>
                </div>
                <div className='date-schedule'>
                  Start Date
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    isClearable
                    sx={{
                      '& .MuiIconButton-root': { color: '#00aeef' }
                    }} />
                  End Date
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    isClearable
                    sx={{
                      '& .MuiIconButton-root': { color: '#00aeef' }
                    }}
                  />
                  <button className='filter'>Filter</button>
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
                        onChange={(e) => setSearchTerm(e.target.value)} />
                      <button className="btn-search" type="submit"><IoSearch style={{ fontSize: '2rem' }} /></button>
                    </div>
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
                  <StyledTableCell align='center'>Student Full Name</StyledTableCell>
                  <StyledTableCell align='center'>Email</StyledTableCell>
                  <StyledTableCell align="center">Course Name</StyledTableCell>
                  <StyledTableCell align="center">Course Status</StyledTableCell>
                  <StyledTableCell align="center">Completed Date</StyledTableCell>
                  <StyledTableCell align="center">Upload </StyledTableCell>
                  <StyledTableCell align="center">View</StyledTableCell>
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
                      <StyledTableCell align="center">{curr.student_name}</StyledTableCell>
                      <StyledTableCell align="center">{curr.email}</StyledTableCell>
                      <StyledTableCell align="center">{curr.course_name}</StyledTableCell>
                      <StyledTableCell align="center">{curr.status}</StyledTableCell>
                      <StyledTableCell align="center">{curr.completed_date}</StyledTableCell>
                      <StyledTableCell align="center">
                        <FiUpload className="edit" onClick={() => handleClickOpen(curr)} />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <a href={curr.certificate_pdf} target="_blank" rel="noopener noreferrer">
                          <IoEye className="edit" />
                        </a>
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
        </div>
        <Dialog className="dialog-box" open={open} onClose={handleClose} aria-labelledby="edit-schedule-dialog"
          PaperProps={{
            style: { borderRadius: 20 },
          }}>
          <div>
            <DialogTitle className="dialog-title" id="edit-schedule-dialog">Upload Candidate Certificate
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
                  <option value="In Progress">In Progress</option>
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
                <label className="form-label">Upload Certificate</label>
                <input
                  type="file"
                  className="form-control"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSave} className="btn btn-primary">Save</Button>
            <Button onClick={handleReset} className="btn btn-secondary">Reset</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}