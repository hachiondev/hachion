import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Checkbox, Dialog, DialogActions, DialogContent,
  DialogTitle, Button, Switch
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { IoSearch } from "react-icons/io5";
import { FiPlus } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { IoMdCloseCircleOutline } from "react-icons/io";
import { MdKeyboardArrowRight } from 'react-icons/md';
import axios from 'axios';
import AdminPagination from './AdminPagination';
import './Admin.css';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  '&.MuiTableCell-head': {
    backgroundColor: '#00AEEF',
    color: theme.palette.common.white,
    borderRight: '1px solid white',
    padding: '3px 5px',
  },
  '&.MuiTableCell-body': {
    fontSize: 14,
    padding: '3px 4px',
    borderRight: '1px solid #e0e0e0',
  },
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover },
  '&:last-child td, &:last-child th': { border: 0 },
}));
export default function CorporateCourses() {
  const currentDate = new Date().toISOString().split('T')[0];
  const [category, setCategory] = useState([]);
  const [course, setCourse] = useState([]);
  const [courseData, setCourseData] = useState({
    corporatecourse_id: "", category_name: "", course_name: "", date: currentDate, status: false
  });
  const [trendingCourse, setTrendingCourse] = useState([]);
  const [filteredCourse, setFilteredCourse] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [open, setOpen] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [message, setMessage] = useState("");
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
  const resetCourseData = () => {
    setCourseData({ corporatecourse_id: "", category_name: "", course_name: "", date: currentDate, status: false });
  };
  const fetchCourses = async () => {
    try {
      const [catRes, courseRes, corpRes] = await Promise.all([
        axios.get("https://api.hachion.co/course-categories/all"),
        axios.get("https://api.hachion.co/courses/all"),
        axios.get("https://api.hachion.co/corporatecourse")
      ]);
      setCategory(catRes.data);
      setCourse(courseRes.data);
      setTrendingCourse(corpRes.data);
      setFilteredCourse(corpRes.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
  useEffect(() => { fetchCourses(); }, []);
  useEffect(() => {
    const filtered = trendingCourse.filter((c) =>
      c.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourse(filtered);
  }, [searchTerm, trendingCourse]);
  const handleDateFilter = () => {
    const filtered = trendingCourse.filter((item) => {
      const videoDate = new Date(item.date);
      const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
      const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
      return (!start || videoDate >= start) && (!end || videoDate <= end);
    });
    setFilteredCourse(filtered);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://api.hachion.co/corporatecourse/add", courseData);
      if (response.status === 201) {
        alert(response.data);
        fetchCourses();
        resetCourseData();
      }
    } catch {
      alert("Error adding course.");
    }
  };
  const handleSave = async () => {
    try {
      const response = await axios.put(`https://api.hachion.co/corporatecourse/update/${editedData.corporatecourse_id}`, editedData);
      fetchCourses();
      setMessage("Course updated successfully!");
      setTimeout(() => setMessage(""), 5000);
      setOpen(false);
    } catch {
      setMessage("Error updating course.");
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Course?")) {
      await axios.delete(`https://api.hachion.co/corporatecourse/delete/${id}`);
      fetchCourses();
    }
  };
  const filteredCourseOptions = course.filter(
    (c) => c.courseCategory === courseData.category_name
  );
  const displayedCourse = filteredCourse.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="course-category">
          <h3>Corporate Training Courses</h3>
          {showAddCourse ? (
            <>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="#!" onClick={() => setShowAddCourse(false)}>
                      Corporate Training Courses <MdKeyboardArrowRight />
                    </a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Add Corporate Course
                  </li>
                </ol>
              </nav>
              <div className="category">
                <div className="category-header"><p style={{ marginBottom: 0 }}>Add Corporate Course</p></div>
                <div className="course-details">
                  <div className="course-row">
                    <div className="col-md-3">
                      <label className="form-label">Category Name</label>
                      <select className="form-select" name="category_name" value={courseData.category_name} onChange={(e) => setCourseData({ ...courseData, category_name: e.target.value })}>
                        <option value="">Select Category</option>
                        {category.map((c) => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Course Name</label>
                      <select className="form-select" name="course_name" value={courseData.course_name} onChange={(e) => setCourseData({ ...courseData, course_name: e.target.value })} disabled={!courseData.category_name}>
                        <option value="">Select Course</option>
                        {filteredCourseOptions.map((c) => (
                          <option key={c.id} value={c.courseName}>{c.courseName}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col" style={{ display: 'flex', gap: 20 }}>
                    <label className="form-label">Status:</label>
                    <Switch checked={courseData.status} onChange={(e) => setCourseData({ ...courseData, status: e.target.checked })} color="primary" />
                    <span>{courseData.status ? 'Enable' : 'Disable'}</span>
                  </div>
                  <div className="course-row">
                    <button className="submit-btn" onClick={handleSubmit}>Submit</button>
                    <button className="reset-btn" onClick={resetCourseData}>Reset</button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="category">
                <div className="category-header"><p style={{ marginBottom: 0 }}>View Corporate Training Courses</p></div>
                <div className="date-schedule">
                  Start Date
                  <DatePicker value={startDate} onChange={setStartDate} sx={{ '& .MuiIconButton-root': { color: '#00aeef' } }} />
                  End Date
                  <DatePicker value={endDate} onChange={setEndDate} sx={{ '& .MuiIconButton-root': { color: '#00aeef' } }} />
                  <button className="filter" onClick={handleDateFilter}>Filter</button>
                </div>
                <div className="entries">
                  <div className="entries-left">
                    <p>Show</p>
                    <div className="btn-group">
                      <button type="button" className="btn-number dropdown-toggle" data-bs-toggle="dropdown">{rowsPerPage}</button>
                      <ul className="dropdown-menu">
                        {[10, 25, 50].map(num => (
                          <li key={num}><a className="dropdown-item" href="#!" onClick={() => handleRowsPerPageChange(num)}>{num}</a></li>
                        ))}
                      </ul>
                    </div>
                    <p>entries</p>
                  </div>
                  <div className="entries-right">
                    <div className="search-div">
                      <input className="search-input" type="search" placeholder="Enter Courses, Category or Keywords" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                      <button className="btn-search"><IoSearch /></button>
                    </div>
                    <button className="btn-category" onClick={() => setShowAddCourse(true)}><FiPlus /> Add Corporate Course</button>
                  </div>
                </div>
              </div>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center"><Checkbox /></StyledTableCell>
                      <StyledTableCell align="center">S.No.</StyledTableCell>
                      <StyledTableCell align="center">Category Name</StyledTableCell>
                      <StyledTableCell align="center">Course Name</StyledTableCell>
                      <StyledTableCell align="center">Status</StyledTableCell>
                      <StyledTableCell align="center">Created Date</StyledTableCell>
                      <StyledTableCell align="center">Action</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayedCourse.length > 0 ? displayedCourse.map((row, index) => (
                      <StyledTableRow key={row.corporatecourse_id}>
                        <StyledTableCell align="center"><Checkbox /></StyledTableCell>
                        <StyledTableCell align="center">{index + 1 + (currentPage - 1) * rowsPerPage}</StyledTableCell>
                        <StyledTableCell align="center">{row.category_name}</StyledTableCell>
                        <StyledTableCell align="center">{row.course_name}</StyledTableCell>
                        <StyledTableCell align="center">{row.status ? "Enabled" : "Disabled"}</StyledTableCell>
                        <StyledTableCell align="center">{row.date}</StyledTableCell>
                        <StyledTableCell align="center">
                          <FaEdit onClick={() => { setEditedData(row); setOpen(true); }} className="edit" />
                          <RiDeleteBin6Line onClick={() => handleDelete(row.corporatecourse_id)} className="delete" />
                        </StyledTableCell>
                      </StyledTableRow>
                    )) : (
                      <StyledTableRow><StyledTableCell colSpan={7} align="center">No data available.</StyledTableCell></StyledTableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <div className="pagination-container">
                <AdminPagination currentPage={currentPage} rowsPerPage={rowsPerPage} totalRows={filteredCourse.length} onPageChange={handlePageChange} />
              </div>
              {message && <div className="success-message">{message}</div>}
            </>
          )}
        </div>
      </LocalizationProvider>
      <Dialog className="dialog-box" open={open} onClose={() => setOpen(false)} aria-labelledby="edit-schedule-dialog"
          PaperProps={{
            style: { borderRadius: 20 },
          }}>
        <div >
          <DialogTitle className="dialog-title" id="edit-schedule-dialog">Edit Corporate Course
          <Button onClick={() => setOpen(false)} className="close-btn"><IoMdCloseCircleOutline style={{ color: "white", fontSize: "2rem" }} /></Button>
          </DialogTitle>
            </div>
            <DialogContent>
          <div className="col">
            <label className="form-label">Category Name</label>
            <select className="form-select" name="category_name" value={editedData.category_name || ""} onChange={(e) => setEditedData({ ...editedData, category_name: e.target.value })}>
              <option value="">Select Category</option>
              {category.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="col">
            <label className="form-label">Course Name</label>
            <select className="form-select" name="course_name" value={editedData.course_name || ""} onChange={(e) => setEditedData({ ...editedData, course_name: e.target.value })}>
              <option value="">Select Course</option>
              {course.map((c) => (
                <option key={c.id} value={c.courseName}>{c.courseName}</option>
              ))}
            </select>
          </div>
          <div className="col" style={{ display: 'flex', gap: 20 }}>
            <label className="form-label">Status:</label>
            <Switch checked={editedData.status} onChange={(e) => setEditedData({ ...editedData, status: e.target.checked })} color="primary" />
            <span>{editedData.status ? 'Enable' : 'Disable'}</span>
          </div>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center' }}>
          <Button onClick={handleSave} className="update-btn">Update</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
