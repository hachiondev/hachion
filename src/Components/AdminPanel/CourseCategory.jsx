import React, { useState, useEffect } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { IoSearch } from "react-icons/io5";
import { FiPlus } from 'react-icons/fi';
import PropTypes from 'prop-types';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import './Admin.css';
import dayjs from 'dayjs';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { IoMdCloseCircleOutline } from "react-icons/io";
import { MdKeyboardArrowRight } from 'react-icons/md';
import AdminPagination from './AdminPagination';
import RequiredIndicator from './Common/RequiredIndicator';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#00AEEF',
    color: theme.palette.common.white,
    borderRight: '1px solid white',
    position: 'sticky',
    top: 0,
    zIndex: 1,
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

const CourseCategory = ({
  pageTitle = "Course Category",
  headerTitle = "View Course Category List",
  buttonLabel = "Add Category",
  onAddCategoryClick
}) => {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [editedRow, setEditedRow] = useState({ name: "", date: "" });
  const [courseData, setCourseData] = useState({
    category_name: "",
    date: null
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Validation states
  const [formErrors, setFormErrors] = useState({});
  const [editFormErrors, setEditFormErrors] = useState({});
  

  const API_URL = 'https://api.hachion.co/course-categories/all';

  // Fetch Courses on Component Mount
  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const filtered = categories.filter((course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  // Calculate if form is valid
  const isFormValid = () => {
    return courseData.category_name.trim() !== "" && courseData.date !== null;
  };

  // Calculate if edit form is valid
  const isEditFormValid = () => {
    return editedRow.name.trim() !== "" && editedRow.date !== "";
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(API_URL);
      setCategories(response.data);
      setFilteredCategories(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedRow((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field when user starts typing
    if (editFormErrors[name]) {
      setEditFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleClickOpen = (course) => {
    setEditedRow({
      id: course.id,
      name: course.name || "",
      date: course.date ? dayjs(course.date).format('MM-DD-YYYY') : "",
    });
    setOpen(true);
    setEditFormErrors({});
  };

  const handleDateFilter = () => {
    const filtered = categories.filter((item) => {
      const date = new Date(item.date);
      const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
      const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
      return (!start || date >= start) && (!end || date <= end);
    });
    setFilteredCategories(filtered);
  };

  const handleDateReset = () => {
    setStartDate(null);
    setEndDate(null);
    setFilteredCategories(categories);
  };

  const validateForm = () => {
    const errors = {};
    if (!courseData.category_name.trim()) {
      errors.category_name = "Category name is required";
    }
    if (!courseData.date) {
      errors.date = "Date is required";
    }
    return errors;
  };

  const validateEditForm = () => {
    const errors = {};
    if (!editedRow.name.trim()) {
      errors.name = "Category name is required";
    }
    if (!editedRow.date) {
      errors.date = "Date is required";
    }
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await axios.post("https://api.hachion.co/course-categories/add", {
        name: courseData.category_name,
        date: dayjs(courseData.date).format("YYYY-MM-DD"),
      });

      if (response.status === 200) {
        alert("Category added successfully");
        setCategories((prev) => [...prev, response.data]);
        setCourseData({ category_name: "", date: null });
        setFormErrors({});
        setShowAddCourse(false);
      }
    } catch (error) {
      console.error("Error adding category:", error.message);
      alert("Error adding category.");
    }
  };

  const handleEdit = async () => {
    const errors = validateEditForm();
    if (Object.keys(errors).length > 0) {
      setEditFormErrors(errors);
      return;
    }

    try {
      const response = await axios.put(
        `https://api.hachion.co/course-categories/update/${editedRow.id}`,
        {
          name: editedRow.name,
          date: dayjs(editedRow.date).format('YYYY-MM-DD')
        }
      );
      setCategories((prev) =>
        prev.map(curr =>
          curr.id === editedRow.id ? response.data : curr
        )
      );
      setMessage("Course updated successfully!");
      setTimeout(() => setMessage(""), 5000);
      setOpen(false);
      setEditFormErrors({});
    } catch (error) {
      setMessage("Error updating Courses.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`https://api.hachion.co/course-categories/delete/${id}`);
      console.log("Course category deleted successfully:", response.data);
      // Refresh the list after deletion
      fetchCourses();
    } catch (error) {
      console.error("Error deleting Video:", error);
    }
  };

  const handleDeleteConfirmation = (id) => {
    if (window.confirm("Are you sure you want to delete this Course Category?")) {
      handleDelete(id);
    }
  };

  const handleAddTrendingCourseClick = () => {
    setShowAddCourse(true);
    setCourseData({ category_name: "", date: null });
    setFormErrors({});
  };

  const handleBreadcrumbClick = (e) => {
    e.preventDefault();
    setShowAddCourse(false);
  };

  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, window.scrollY);
  };

  const displayedCategories = filteredCategories.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <>
      {showAddCourse ? (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="course-category">
            <h3>Course Category</h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="#!" onClick={handleBreadcrumbClick}>
                    View Course Category list
                  </a>
                  <MdKeyboardArrowRight />
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Add Category
                </li>
              </ol>
            </nav>
            <div className="category">
              <div className="category-header">
                <p style={{ marginBottom: 0 }}>Add Category</p>
              </div>
              <div className="date-schedule" style={{ display: "flex", flexDirection: "column" }}>
                <div className="mb-3">
                  <label htmlFor="categoryName" className="form-label">
                    Category Name <RequiredIndicator />
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.category_name ? 'is-invalid' : ''}`}
                    id="categoryName"
                    placeholder="Enter Category name"
                    value={courseData.category_name}
                    onChange={(e) => {
                      setCourseData({ ...courseData, category_name: e.target.value });
                      if (formErrors.category_name) {
                        setFormErrors({ ...formErrors, category_name: "" });
                      }
                    }}
                    style={{ width: '350px' }}
                  />
                  {formErrors.category_name && (
                    <div className="invalid-feedback d-block">{formErrors.category_name}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label>
                    Date <RequiredIndicator />
                  </label>
                  <br />
                  <DatePicker
                    value={courseData.date}
                    onChange={(newDate) => {
                      setCourseData({ ...courseData, date: newDate });
                      if (formErrors.date) {
                        setFormErrors({ ...formErrors, date: "" });
                      }
                    }}
                    sx={{
                      '& .MuiInputBase-root': {
                        width: '350px',
                      },
                      '& .MuiIconButton-root': { color: '#00aeef' }
                    }}
                    slotProps={{
                      textField: {
                        error: !!formErrors.date,
                        helperText: formErrors.date
                      }
                    }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <button
                    className="submit-btn"
                    onClick={handleSubmit}
                    disabled={!isFormValid()}
                    style={{ opacity: isFormValid() ? 1 : 0.6, cursor: isFormValid() ? 'pointer' : 'not-allowed' }}
                  >
                    Submit
                  </button>
                  <button
                    className="reset-btn"
                    onClick={() => {
                      setCourseData({ category_name: "", date: null });
                      setFormErrors({});
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </LocalizationProvider>
      ) : (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className='course-category'>
            <h3>{pageTitle}</h3>
            <div className='category'>
              <div className='category-header'>
                <p style={{ marginBottom: 0 }}>{headerTitle}</p>
              </div>
              <div className='date-schedule'>
                Start Date
                <DatePicker
                  value={startDate}
                  onChange={(newDate) => setStartDate(newDate)}
                  sx={{
                    '& .MuiIconButton-root': { color: '#00aeef' }
                  }}
                />
                End Date
                <DatePicker
                  value={endDate}
                  onChange={(newDate) => setEndDate(newDate)}
                  sx={{
                    '& .MuiIconButton-root': { color: '#00aeef' }
                  }}
                />
                <button className='filter' onClick={handleDateFilter}>Filter</button>
                <button className="filter" onClick={handleDateReset}>Reset</button>
              </div>
              <div className='entries'>
                <div className="entries-left">
                  <p style={{ marginBottom: '0' }}>Show</p>
                  <div className="btn-group">
                    <button type="button" className="btn-number dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                      {rowsPerPage}
                    </button>
                    <ul className="dropdown-menu">
                      <li><a className="dropdown-item" href="#!" onClick={(e) => { e.preventDefault(); handleRowsPerPageChange(10); }}>10</a></li>
                      <li><a className="dropdown-item" href="#!" onClick={(e) => { e.preventDefault(); handleRowsPerPageChange(25); }}>25</a></li>
                      <li><a className="dropdown-item" href="#!" onClick={(e) => { e.preventDefault(); handleRowsPerPageChange(50); }}>50</a></li>
                    </ul>
                  </div>
                  <p style={{ marginBottom: '0' }}>entries</p>
                </div>
                <div className='entries-right'>
                  <div className="entries-right">
                    <div className="search-div">
                      <input
                        className="search-input"
                        type="search"
                        placeholder="Enter Category or Keywords"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button className="btn-search"><IoSearch /></button>
                    </div>
                  </div>
                  <button type="button" className="btn-category" onClick={handleAddTrendingCourseClick}>
                    <FiPlus /> {buttonLabel}
                  </button>
                </div>
              </div>
              <TableContainer component={Paper} sx={{ padding: '0 10px' }}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell sx={{ width: 100 }} align="center">
                        <Checkbox />
                      </StyledTableCell>
                      <StyledTableCell sx={{ width: 150, fontSize: '16px' }} align="center">S.No.</StyledTableCell>
                      <StyledTableCell sx={{ fontSize: '16px' }} align="center">Category</StyledTableCell>
                      <StyledTableCell sx={{ width: 220, fontSize: '16px' }} align="center">Date</StyledTableCell>
                      <StyledTableCell sx={{ width: 220, fontSize: '16px' }} align="center">Action</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayedCategories.length > 0
                      ? displayedCategories.map((course, index) => (
                        <StyledTableRow key={course.id}>
                          <StyledTableCell sx={{ width: 100 }} align="center">
                            <Checkbox />
                          </StyledTableCell>
                          <StyledTableCell sx={{ width: 150, fontSize: '16px' }} align="center">
                            {index + 1 + (currentPage - 1) * rowsPerPage}
                          </StyledTableCell>
                          <StyledTableCell sx={{ fontSize: '16px' }} align="left">{course.name}</StyledTableCell>
                          <StyledTableCell sx={{ width: 220, fontSize: '16px' }} align="center">
                            {course.date ? dayjs(course.date).format('MM-DD-YYYY') : 'N/A'}
                          </StyledTableCell>
                          <StyledTableCell align="center" style={{ width: 220 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                              <FaEdit className="edit" onClick={() => handleClickOpen(course)} style={{ cursor: 'pointer' }} />
                              <RiDeleteBin6Line className="delete" onClick={() => handleDeleteConfirmation(course.id)} style={{ cursor: 'pointer' }} />
                            </div>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))
                      : (
                        <StyledTableRow>
                          <StyledTableCell colSpan={6} align="center">
                            No courses available.
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
                  totalRows={filteredCategories.length}
                  onPageChange={handlePageChange}
                />
              </div>
              {message && <div className="success-message">{message}</div>}
            </div>
          </div>
        </LocalizationProvider>
      )}
      <Dialog
        className="dialog-box"
        open={open}
        onClose={handleClose}
        aria-labelledby="edit-schedule-dialog"
        PaperProps={{
          style: { borderRadius: 20 },
        }}
      >
        <div>
          <DialogTitle className="dialog-title" id="edit-schedule-dialog">
            Edit Course Category
            <Button onClick={handleClose} className="close-btn">
              <IoMdCloseCircleOutline style={{ color: "white", fontSize: "2rem" }} />
            </Button>
          </DialogTitle>
        </div>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="mb-3">
              <label>
                Category Name <RequiredIndicator />
              </label>
              <input
                type="text"
                className={`form-control ${editFormErrors.name ? 'is-invalid' : ''}`}
                id="editCategoryName"
                placeholder="Enter Category name"
                name="name"
                value={editedRow.name || ""}
                onChange={handleInputChange}
              />
              {editFormErrors.name && (
                <div className="invalid-feedback d-block">{editFormErrors.name}</div>
              )}
            </div>
            <div className="mb-3">
              <label>
                Date <RequiredIndicator />
              </label>
              <br />
              <DatePicker
                value={editedRow.date ? dayjs(editedRow.date) : null}
                onChange={(newDate) => {
                  setEditedRow({ ...editedRow, date: newDate ? newDate.format('MM-DD-YYYY') : "" });
                  if (editFormErrors.date) {
                    setEditFormErrors({ ...editFormErrors, date: "" });
                  }
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    width: '100%',
                  },
                  '& .MuiIconButton-root': { color: '#00aeef' }
                }}
                slotProps={{
                  textField: {
                    error: !!editFormErrors.date,
                    helperText: editFormErrors.date,
                    fullWidth: true
                  }
                }}
              />
            </div>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions className="update" style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={handleEdit}
            className="update-btn"
            disabled={!isEditFormValid()}
            style={{ opacity: isEditFormValid() ? 1 : 0.6, cursor: isEditFormValid() ? 'pointer' : 'not-allowed' }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CourseCategory;