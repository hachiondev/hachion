import React, { useEffect, useState } from 'react';
import { styled} from '@mui/material/styles';
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

  const [reviewData, setReviewData] = useState({
    review_id: "",
    category_name: "",
    course_name: "",
    emp_name: "",
    company_logo: null,
    rating: "",
    location: "",
    role: "",
    company: "",
    comment: ""
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setReviewData((prev) => ({ ...prev, company_logo: file }));
  };

  const handleEditClick = (curr) => {
    setSelectedReview(curr.review_id);
    setReviewData({
      review_id: curr.review_id,
      emp_name: curr.emp_name,
      company: curr.company,
      role: curr.role,
      rating: curr.rating,
      location: curr.location,
      category_name: curr.category_name,
      course_name: curr.course_name,
      comment: curr.review,
      company_logo: null
    });
    setShowForm(true);
  };

  const handleReset = () => {
    setReviewData({
      review_id: "",
      category_name: "",
      course_name: "",
      emp_name: "",
      company_logo: null,
      rating: "",
      location: "",
      role: "",
      company: "",
      comment: ""
    });
    setSelectedReview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString().split("T")[0];
    const reviewObject = {
      emp_name: reviewData.emp_name,
      company: reviewData.company,
      role: reviewData.role,
      rating: reviewData.rating,
      location: reviewData.location,
      category_name: reviewData.category_name,
      course_name: reviewData.course_name,
      review: reviewData.comment,
      date: currentDate
    };

    const formData = new FormData();
    formData.append("review", JSON.stringify(reviewObject));
    if (reviewData.company_logo) formData.append("user_image", reviewData.company_logo);

    try {
      if (selectedReview) {
        // Edit existing review
        const response = await axios.put(
          `https://api.test.hachion.co/userreview/update/${selectedReview}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        if (response.status === 200) {
          setReview((prev) =>
            prev.map((rev) =>
              rev.review_id === selectedReview ? response.data : rev
            )
          );
          setMessage("✅ Review updated successfully");
        }
      } else {
        // Add new review
        const response = await axios.post(
          "https://api.test.hachion.co/userreview/add",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        if (response.status === 201) {
          setReview((prev) => [...prev, response.data]);
          setMessage("✅ Review added successfully");
        }
      }
      handleReset();
      setShowForm(false);
      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      console.error(error);
      setMessage("❌ Error saving review");
    }
  };

  const handleDelete = async (review_id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await axios.delete(`https://api.test.hachion.co/userreview/delete/${review_id}`);
      setReview((prev) => prev.filter((rev) => rev.review_id !== review_id));
      setMessage("✅ Review deleted successfully");
      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to delete review");
    }
  };

  useEffect(() => {
    const fetchCourseCategory = async () => {
      try {
        const response = await axios.get("https://api.test.hachion.co/courses/all");
        setCourseCategory(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCourseCategory();
  }, []);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get('https://api.test.hachion.co/userreview');
        const filteredReviews = response.data.filter(review => review.type === true);
        setReview(filteredReviews);
        setFilteredReview(filteredReviews);
      } catch (error) {
        console.error(error);
      }
    };
    fetchReview();
  }, []);

  useEffect(() => {
    if (reviewData.category_name) {
      const filtered = courseCategory.filter(
        (course) => course.courseCategory === reviewData.category_name
      );
      setFilterCourse(filtered);
    } else {
      setFilterCourse([]);
    }
  }, [reviewData.category_name, courseCategory]);

  const displayedReviews = filteredReview.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

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
                    name="emp_name"
                    value={reviewData.emp_name}
                    onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Company Logo</label>
                  <input type="file" className="form-control"
                    name="company_logo"
                    onChange={handleFileChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Company</label>
                  <input type="text" className="form-control" placeholder='Enter Company Name'
                    name="company"
                    value={reviewData.company}
                    onChange={handleChange} />
                </div>
              </div>
              <div className='course-row'>
                <div className="col-md-4">
                  <label className="form-label">Employee Rating</label>
                  <input type="number" className="form-control"
                    name="rating"
                    value={reviewData.rating}
                    onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Role</label>
                  <input type="text" className="form-control" placeholder='Enter Role'
                    name="role"
                    value={reviewData.role}
                    onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Location</label>
                  <input type="text" className="form-control" placeholder='Enter Location'
                    name="location"
                    value={reviewData.location}
                    onChange={handleChange} />
                </div>
              </div>
              <div className='course-row'>
                <div className="col-md-3">
                  <label className="form-label">Category Name</label>
                  <select className="form-select" name='category_name' value={reviewData.category_name} onChange={handleChange}>
                    <option value="" disabled>Select Category</option>
                    {course.map((curr) => (
                      <option key={curr.id} value={curr.name}>{curr.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Course Name</label>
                  <select className="form-select" name='course_name' value={reviewData.course_name} onChange={handleChange} disabled={!reviewData.category_name}>
                    <option value="" disabled>Select Course</option>
                    {filterCourse.map((curr) => (
                      <option key={curr.id} value={curr.courseName}>{curr.courseName}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-6">
                <label for="exampleFormControlTextarea1" class="form-label">Comment</label>
                <textarea class="form-control" id="exampleFormControlTextarea1" rows="6"
                  name="comment"
                  value={reviewData.comment}
                  onChange={handleChange}></textarea>
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
                  <button className="filter" onClick={() => { }}>Filter</button>
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
                      <input className="search-input" type="search" placeholder="Enter Name, Technology or Keywords" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                      <button className="btn-search" type="submit"><IoSearch style={{ fontSize: '2rem' }} /></button>
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
                  <StyledTableCell align="center">Rating</StyledTableCell>
                  <StyledTableCell align="center">Location</StyledTableCell>
                  <StyledTableCell align="center">Technology</StyledTableCell>
                  <StyledTableCell align="center">Comment </StyledTableCell>
                  <StyledTableCell align="center">Date </StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedReviews.length > 0 ? displayedReviews.map((curr, index) => (
                  <StyledTableRow key={curr.review_id}>
                    <StyledTableCell align="center"><Checkbox /></StyledTableCell>
                    <StyledTableCell align="center">{index + 1 + (currentPage - 1) * rowsPerPage}</StyledTableCell>
                    <StyledTableCell align="center">{curr.company_logo ? <img src={`https://api.test.hachion.co/userreview/${curr.company_logo}`} width="50" height="50" alt="Company" /> : "No Image"}</StyledTableCell>
                    <StyledTableCell align="left">{curr.emp_name}</StyledTableCell>
                    <StyledTableCell align="center">{curr.company}</StyledTableCell>
                    <StyledTableCell align="center">{curr.role}</StyledTableCell>
                    <StyledTableCell align="center">{curr.rating}</StyledTableCell>
                    <StyledTableCell align="center">{curr.location}</StyledTableCell>
                    <StyledTableCell align="left">{curr.course_name}</StyledTableCell>
                    <StyledTableCell align="left" style={{ maxWidth: '800px', wordWrap: 'break-word', whiteSpace: 'pre-line' }}>{curr.review}</StyledTableCell>
                    <StyledTableCell align="center">{curr.date ? dayjs(curr.date).format("MM-DD-YYYY") : "N/A"}</StyledTableCell>
                    <StyledTableCell align="center">
                      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                        <FaEdit className="edit" onClick={() => handleEditClick(curr)} />
                        <RiDeleteBin6Line className="delete" onClick={() => handleDelete(curr.review_id)} />
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                )) : <StyledTableRow><StyledTableCell colSpan={12} align="center">No Data Available</StyledTableCell></StyledTableRow>}
              </TableBody>
            </Table>
          </TableContainer>

          <div className='pagination-container'>
            <AdminPagination currentPage={currentPage} rowsPerPage={rowsPerPage} totalRows={filteredReview.length} onPageChange={handlePageChange} />
          </div>

          {message && <div className="success-message">{message}</div>}
        </div>
      )}
    </>
  );
}
