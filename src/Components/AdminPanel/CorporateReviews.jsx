import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import './Admin.css';
import dayjs from 'dayjs';
import { IoSearch } from "react-icons/io5";
import { FiPlus } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { MdKeyboardArrowRight } from 'react-icons/md';
import axios from 'axios';
import AdminPagination from './AdminPagination';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const API_BASE = 'https://api.hachion.co';

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
  '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover },
  '&:last-child td, &:last-child th': { border: 0 },
}));

export default function CorporateReview() {
  const [course, setCourse] = useState([]);
  const [courseCategory, setCourseCategory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [review, setReview] = useState([]);
  const [filterCourse, setFilterCourse] = useState([]);
  const [filteredReview, setFilteredReview] = useState([]);
  const [message, setMessage] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
 const [existingLogo, setExistingLogo] = useState("");

  const [reviewData, setReviewData] = useState({
    corporateReviewId: "",
    categoryName: "",
    courseName: "",
    employeeName: "",
    companyLogo: null,
    employeeRating: "",
    location: "",
    role: "",
    company: "",
    comment: ""
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleRowsPerPageChange = (rows) => { setRowsPerPage(rows); setCurrentPage(1); };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setReviewData((prev) => ({ ...prev, companyLogo: file }));
  };

  const handleEditClick = (curr) => {
    setSelectedReview(curr.corporateReviewId);
    setExistingLogo(curr.companyLogo || "");
    setReviewData({
      corporateReviewId: curr.corporateReviewId,
      employeeName: curr.employeeName,
      company: curr.company,
      role: curr.role,
      employeeRating: curr.employeeRating,
      location: curr.location,
      categoryName: curr.categoryName ?? "",
      courseName: curr.courseName,
      comment: curr.comment,
      companyLogo: null
    });
    setShowForm(true);
  };

  const handleReset = () => {
    setReviewData({
      corporateReviewId: "",
      categoryName: "",
      courseName: "",
      employeeName: "",
      companyLogo: null,
      employeeRating: "",
      location: "",
      role: "",
      company: "",
      comment: ""
    });
    setSelectedReview(null);
    setExistingLogo("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString().split("T")[0];
    const reviewObject = {
      employeeName: reviewData.employeeName,
      company: reviewData.company,
      role: reviewData.role,
      employeeRating: reviewData.employeeRating,
      location: reviewData.location,
      categoryName: reviewData.categoryName, 
      courseName: reviewData.courseName,
      comment: reviewData.comment,          
      date: currentDate
    };

    const formData = new FormData();
    formData.append("review", JSON.stringify(reviewObject));
    if (reviewData.companyLogo) {
      
      formData.append("company_logo", reviewData.companyLogo);
    }

    try {
      if (selectedReview) {
        
        const response = await axios.put(
          `${API_BASE}/corporatereview/update/${selectedReview}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        if (response.status === 200) {
          
          await fetchReview();
          setMessage("✅ Corporate review updated successfully");
        }
      } else {
        
        const response = await axios.post(
          `${API_BASE}/corporatereview/add`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (response.status === 201) {
          await fetchReview();
          setMessage("✅ Corporate review added successfully");
        }
      }
      handleReset();
      setShowForm(false);
      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      console.error(error);
      setMessage("❌ Error saving corporate review");
    }
  };

  const handleDelete = async (corporateReviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await axios.delete(`${API_BASE}/corporatereview/delete/${corporateReviewId}`);
      setReview((prev) => prev.filter((rev) => rev.corporateReviewId !== corporateReviewId));
      setFilteredReview((prev) => prev.filter((rev) => rev.corporateReviewId !== corporateReviewId));
      setMessage("✅ Corporate review deleted successfully");
      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to delete corporate review");
    }
  };

  const fetchCourseCategory = async () => {
    try {
      const response = await axios.get(`${API_BASE}/courses/all`);
      setCourseCategory(response.data || []);
      
      setCourse(
        Array.from(
          new Set((response.data || []).map((c) => c.courseCategory))
        ).map((name, i) => ({ id: i + 1, name }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const fetchReview = async () => {
    try {
      const response = await axios.get(`${API_BASE}/corporatereview`);
      const list = response.data || [];
      setReview(list);
      setFilteredReview(list); 
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchCourseCategory(); }, []);
  useEffect(() => { fetchReview(); }, []);

  useEffect(() => {
    if (reviewData.categoryName) {
      const filtered = courseCategory.filter(
        (c) => c.courseCategory === reviewData.categoryName
      );
      setFilterCourse(filtered);
    } else {
      setFilterCourse([]);
    }
  }, [reviewData.categoryName, courseCategory]);

  useEffect(() => {
    const term = (searchTerm || "").toLowerCase();
    const byTerm = review.filter((r) =>
      [r.employeeName, r.company, r.role, r.location, r.courseName, r.comment]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term))
    );

    const byDate = byTerm.filter((r) => {
      if (!startDate && !endDate) return true;
      const d = r.date ? dayjs(r.date) : null;
      if (!d) return false;
      const afterStart = startDate ? d.isSame(dayjs(startDate), 'day') || d.isAfter(dayjs(startDate), 'day') : true;
      const beforeEnd = endDate ? d.isSame(dayjs(endDate), 'day') || d.isBefore(dayjs(endDate), 'day') : true;
      return afterStart && beforeEnd;
    });

    setFilteredReview(byDate);
    setCurrentPage(1);
  }, [searchTerm, startDate, endDate, review]);

  const displayedReviews = filteredReview.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const logoSrc = (companyLogo) => {
    if (!companyLogo) return null;
    
    const filename = companyLogo.replace(/^logos\//, '');
    return `${API_BASE}/corporatereview/logos/${filename}`;
  };

  return (
    <>
      {showForm && (
        <div className='course-category'>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#!" onClick={() => { setShowForm(false); handleReset(); }}>Corporate Reviews</a> <MdKeyboardArrowRight />
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {selectedReview ? "Edit Corporate Review" : "Add Corporate Review"}
              </li>
            </ol>
          </nav>
          <div className='category'>
            <div className='category-header'>
              <p style={{ marginBottom: 0 }}>{selectedReview ? "Edit Corporate Review" : "Add Corporate Review"}</p>
            </div>
            <div className='course-details'>
              <div className='course-row'>
                <div className="col-md-4">
                  <label className="form-label">Employee Name</label>
                  <input type="text" className="form-control" placeholder='Enter Name'
                    name="employeeName" value={reviewData.employeeName} onChange={handleChange} />
                </div>
                {/* <div className="col-md-4">
                  <label className="form-label">Company Logo</label>
                  <input type="file" className="form-control"
                    name="companyLogo" onChange={handleFileChange} />
                </div> */}
                <div className="col-md-4">
  <label className="form-label">Company Logo</label>
  <div className="d-flex align-items-center" style={{ gap: 8 }}>
    {(existingLogo || reviewData.companyLogo) ? (
      <img
        src={
          reviewData.companyLogo
            ? URL.createObjectURL(reviewData.companyLogo)
            : `${API_BASE}/corporatereview/logos/${String(existingLogo).replace(/^logos\//, '')}`
        }
        alt="Company"
        width={50}
        height={50}
        style={{ objectFit: 'cover', borderRadius: 6 }}
      />
    ) : null}

    <input
      type="file"
      className="form-control"
      name="companyLogo"
      onChange={handleFileChange}
      accept="image/*"
    />
  </div>

  <small className="text-muted" style={{ display: 'block', marginTop: 4 }}>
    {reviewData.companyLogo?.name
      ? reviewData.companyLogo.name
      : (existingLogo ? existingLogo.replace(/^logos\//, '') : 'No file chosen')}
  </small>
</div>

                <div className="col-md-4">
                  <label className="form-label">Company</label>
                  <input type="text" className="form-control" placeholder='Enter Company Name'
                    name="company" value={reviewData.company} onChange={handleChange} />
                </div>
              </div>

              <div className='course-row'>
                <div className="col-md-4">
                  <label className="form-label">Employee Rating</label>
                  <input type="number" className="form-control"
                    name="employeeRating" value={reviewData.employeeRating} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Role</label>
                  <input type="text" className="form-control" placeholder='Enter Role'
                    name="role" value={reviewData.role} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Location</label>
                  <input type="text" className="form-control" placeholder='Enter Location'
                    name="location" value={reviewData.location} onChange={handleChange} />
                </div>
              </div>

              <div className='course-row'>
                <div className="col-md-3">
                  <label className="form-label">Category Name</label>
                  <select className="form-select" name='categoryName' value={reviewData.categoryName} onChange={handleChange}>
                    <option value="" disabled>Select Category</option>
                    {course.map((curr) => (
                      <option key={curr.id} value={curr.name}>{curr.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Course Name</label>
                  <select className="form-select" name='courseName' value={reviewData.courseName} onChange={handleChange} disabled={!reviewData.categoryName}>
                    <option value="" disabled>Select Course</option>
                    {filterCourse.map((curr) => (
                      <option key={curr.id} value={curr.courseName}>{curr.courseName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="comment" className="form-label">Comment</label>
                <textarea className="form-control" id="comment" rows="6"
                  name="comment" value={reviewData.comment} onChange={handleChange}></textarea>
              </div>

              <div className='course-row'>
                <button className='submit-btn' onClick={handleSubmit}>{selectedReview ? "Update" : "Submit"}</button>
                <button className='reset-btn' onClick={handleReset}>Reset</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!showForm && (
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className='course-category'>
              <div className='category'>
                <div className='category-header'>
                  <p style={{ marginBottom: 0 }}>Corporate Reviews</p>
                </div>
                <div className='date-schedule'>
                  Start Date
                  <DatePicker value={startDate} onChange={setStartDate} />
                  End Date
                  <DatePicker value={endDate} onChange={setEndDate} />
                  <button className="filter" onClick={() => { /* filters run automatically via useEffect */ }}>Filter</button>
                  <button className="filter" onClick={() => { setStartDate(null); setEndDate(null); setSearchTerm(""); }}>Reset</button>
                </div>
                <div className='entries'>
                  <div className='entries-left'>
                    <p style={{ marginBottom: '0' }}>Show</p>
                    <div className="btn-group">
                      <button type="button" className="btn-number dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">{rowsPerPage}</button>
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
                      <input className="search-input" type="search" placeholder="Enter Name, Technology or Keywords"
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                      <button className="btn-search" type="button"><IoSearch style={{ fontSize: '2rem' }} /></button>
                    </div>
                    <button type="button" className="btn-category" onClick={() => setShowForm(true)}><FiPlus /> Add Corporate Review</button>
                  </div>
                </div>
              </div>
            </div>
          </LocalizationProvider>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align='center'><Checkbox /></StyledTableCell>
                  <StyledTableCell align='center'>S.No.</StyledTableCell>
                  <StyledTableCell align='center'>Company Logo</StyledTableCell>
                  <StyledTableCell align='center'>Employee Name</StyledTableCell>
                  <StyledTableCell align="center">Company</StyledTableCell>
                  <StyledTableCell align="center">Role</StyledTableCell>
                  <StyledTableCell align="center">Employee Rating</StyledTableCell>
                  <StyledTableCell align="center">Location</StyledTableCell>
                  <StyledTableCell align="center">Technology</StyledTableCell>
                  <StyledTableCell align="center">Comment</StyledTableCell>
                  <StyledTableCell align="center">Date</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedReviews.length > 0 ? displayedReviews.map((curr, index) => (
                  <StyledTableRow key={curr.corporateReviewId}>
                    <StyledTableCell align="center"><Checkbox /></StyledTableCell>
                    <StyledTableCell align="center">{index + 1 + (currentPage - 1) * rowsPerPage}</StyledTableCell>
                    <StyledTableCell align="center">
                      {curr.companyLogo
                        ? <img src={logoSrc(curr.companyLogo)} width="50" height="50" alt="Company" />
                        : "No Image"}
                    </StyledTableCell>
                    <StyledTableCell align="left">{curr.employeeName}</StyledTableCell>
                    <StyledTableCell align="center">{curr.company}</StyledTableCell>
                    <StyledTableCell align="center">{curr.role}</StyledTableCell>
                    <StyledTableCell align="center">{curr.employeeRating}</StyledTableCell>
                    <StyledTableCell align="center">{curr.location}</StyledTableCell>
                    <StyledTableCell align="left">{curr.courseName}</StyledTableCell>
                    <StyledTableCell align="left" style={{ maxWidth: '800px', wordWrap: 'break-word', whiteSpace: 'pre-line' }}>{curr.comment}</StyledTableCell>
                    <StyledTableCell align="center">{curr.date ? dayjs(curr.date).format("MM-DD-YYYY") : "N/A"}</StyledTableCell>
                    <StyledTableCell align="center">
                      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                        <FaEdit className="edit" onClick={() => handleEditClick(curr)} />
                        <RiDeleteBin6Line className="delete" onClick={() => handleDelete(curr.corporateReviewId)} />
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                )) : (
                  <StyledTableRow>
                    <StyledTableCell colSpan={12} align="center">No Data Available</StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <div className='pagination-container'>
            <AdminPagination
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              totalRows={filteredReview.length}
              onPageChange={handlePageChange}
            />
          </div>

          {message && <div className="success-message">{message}</div>}
        </div>
      )}
    </>
  );
}
