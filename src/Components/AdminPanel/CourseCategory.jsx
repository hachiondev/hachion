import React, { useState, useEffect } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { IoSearch } from "react-icons/io5";
import { FiPlus } from 'react-icons/fi';
import PropTypes from 'prop-types';
import axios from 'axios';
import CategoryTable from './CategoryTable';
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
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = React.useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [editedRow, setEditedRow] = useState({ name: "", date: "" })
  const [courseData, setCourseData] = useState([{
    name: "",
    date: ""
  }]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isUpdating, setIsUpdating] = useState(false);

  // New state for checkbox selection
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, window.scrollY);
  };

  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  const displayedCategories = filteredCategories.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const API_URL = 'https://api.test.hachion.co/course-categories/all';

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedRow((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(API_URL);
      setCategories(response.data);
      setFilteredCategories(response.data);
      console.log(filteredCategories);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleClickOpen = (course) => {
    setEditedRow({
      ...course,
      date: course.date ? dayjs(course.date).format('MM-DD-YYYY') : null,
    });
    setOpen(true);
  };

  const formattedDate = courseData.date ? dayjs(courseData.date).format('MM-DD-YYYY') : null;

  useEffect(() => {
    const filtered = categories.filter((course) =>
      (course?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

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

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "https://api.test.hachion.co/course-categories/add",
        {
          name: courseData.category_name,
          date: dayjs(courseData.date).format("YYYY-MM-DD"),
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Category added successfully");
        setErrorMessage("");

        const newCategory = {
          id: response.data.id,
          name: response.data.name || courseData.category_name,
          date: response.data.date || dayjs(courseData.date).format("YYYY-MM-DD"),
        };

        setCategories((prev) => [...prev, newCategory]);
        setFilteredCategories((prev) => [...prev, newCategory]);

        setCourseData({ category_name: "", date: null });

        setTimeout(() => {
          setSuccessMessage("");
          setShowAddCourse(false);
        }, 3000);
      }

    } catch (error) {
      console.error("Error adding category:", error);
      setSuccessMessage("");
      setErrorMessage("Error adding category. Please try again.");
      setTimeout(() => {
        setErrorMessage("");
      }, 6000);
    }
  };

  const handleEdit = async () => {
     if (isUpdating) return;

  setIsUpdating(true);
    try {
      const payload = {
        id: editedRow.id,
        name: editedRow.name,
        date: dayjs(editedRow.date).format("YYYY-MM-DD")
      };

      await axios.put(
        `https://api.test.hachion.co/course-categories/update/${editedRow.id}`,
        payload
      );

      setCategories(prev =>
        prev.map(item =>
          item.id === editedRow.id
            ? { ...item, ...payload }
            : item
        )
      );

      setFilteredCategories(prev =>
        prev.map(item =>
          item.id === editedRow.id
            ? { ...item, ...payload }
            : item
        )
      );

      setSuccessMessage("Category updated successfully");
      setErrorMessage("");

      setTimeout(() => setSuccessMessage(""), 6000);
      setOpen(false);
      setIsUpdating(false);

    } catch (error) {
      setSuccessMessage("");
      setErrorMessage("Error updating category");
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://api.test.hachion.co/course-categories/delete/${id}`
      );

      setCategories((prev) => prev.filter((item) => item.id !== id));
      setFilteredCategories((prev) => prev.filter((item) => item.id !== id));

      setSuccessMessage("Category deleted successfully");
      setErrorMessage("");

      setTimeout(() => {
        setSuccessMessage("");
      }, 6000);
    } catch (error) {
      console.error("Error deleting category:", error);
      setSuccessMessage("");
      setErrorMessage("Error deleting category");
      setTimeout(() => {
        setErrorMessage("");
      }, 6000);
    }
  };

  const handleDeleteConfirmation = (id) => {
    if (window.confirm("Are you sure you want to delete this Course Category?")) {
      handleDelete(id);
    }
  };

  // Handle Select All checkbox
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = displayedCategories.map(category => category.id);
      setSelectedIds(allIds);
      setSelectAll(true);
    } else {
      setSelectedIds([]);
      setSelectAll(false);
    }
  };

  // Handle individual checkbox
  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
      setSelectAll(false);
    } else {
      const newSelectedIds = [...selectedIds, id];
      setSelectedIds(newSelectedIds);
      // Check if all items are selected
      if (newSelectedIds.length === displayedCategories.length) {
        setSelectAll(true);
      }
    }
  };

  // Update selectAll state when page changes
  useEffect(() => {
    const allCurrentPageIds = displayedCategories.map(cat => cat.id);
    const allSelected = allCurrentPageIds.length > 0 &&
      allCurrentPageIds.every(id => selectedIds.includes(id));
    setSelectAll(allSelected);
  }, [currentPage, displayedCategories, selectedIds]);

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      setErrorMessage("Please select at least one category to delete");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    const confirmMessage = `Are you sure you want to delete ${selectedIds.length} selected ${selectedIds.length === 1 ? 'category' : 'categories'}?`;

    if (window.confirm(confirmMessage)) {
      try {
        // Delete all selected categories
        await Promise.all(
          selectedIds.map(id =>
            axios.delete(`https://api.test.hachion.co/course-categories/delete/${id}`)
          )
        );

        // Update state
        setCategories(prev => prev.filter(item => !selectedIds.includes(item.id)));
        setFilteredCategories(prev => prev.filter(item => !selectedIds.includes(item.id)));

        setSelectedIds([]);
        setSelectAll(false);

        setSuccessMessage(`${selectedIds.length} ${selectedIds.length === 1 ? 'category' : 'categories'} deleted successfully`);
        setErrorMessage("");

        setTimeout(() => {
          setSuccessMessage("");
        }, 6000);
      } catch (error) {
        console.error("Error deleting categories:", error);
        setSuccessMessage("");
        setErrorMessage("Error deleting some categories. Please try again.");
        setTimeout(() => {
          setErrorMessage("");
        }, 6000);
      }
    }
  };

  const handleAddTrendingCourseClick = () => setShowAddCourse(true);

  return (<>
    {showAddCourse ? (<>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="course-category">
          <h3>Course Category</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#!" onClick={() => setShowAddCourse(false)}>View Course Category list</a> <MdKeyboardArrowRight />
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
                  Category Name <span style={{ color: "red", marginLeft: "4px" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="categoryName"
                  placeholder="Enter Category name"
                  value={courseData.category_name}
                  onChange={(e) =>
                    setCourseData({ ...courseData, category_name: e.target.value })}
                  style={{ width: '350px' }}
                />
              </div>
              <div className="mb-3">
                Date <span style={{ color: "red", marginLeft: "4px" }}>*</span><br />
                <DatePicker
                  value={courseData.date}
                  onChange={(newDate) =>
                    setCourseData({ ...courseData, date: newDate })
                  }
                  sx={{
                    '& .MuiInputBase-root': {
                      width: '350px',
                    }, '& .MuiIconButton-root': { color: '#00aeef' }
                  }}
                />
              </div>
              {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
              {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}
              <div style={{ display: "flex", flexDirection: "row" }}>
                <button
                  className="submit-btn"
                  onClick={handleSubmit}
                  disabled={!courseData.category_name?.trim() || !courseData.date}
                  style={{
                    opacity:
                      courseData.category_name?.trim() && courseData.date ? 1 : 0.5,
                    cursor:
                      courseData.category_name?.trim() && courseData.date
                        ? "pointer"
                        : "not-allowed",
                  }}
                >
                  Submit
                </button>

                <button
                  className="reset-btn"
                  onClick={() => setCourseData({ category_name: "", date: null })}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </LocalizationProvider>
    </>) : (<LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='course-category'>
        <h3>{pageTitle}</h3>
        <div className='category'>
          <div className='category-header'>
            <p style={{ marginBottom: 0 }}>{headerTitle}</p>
          </div>
          <div className='date-schedule'>
            Start Date
            <DatePicker value={startDate} onChange={(newDate) => setStartDate(newDate)}
              sx={{
                '& .MuiIconButton-root': { color: '#00aeef' }
              }} />
            End Date
            <DatePicker value={endDate} onChange={(newDate) => setEndDate(newDate)}
              sx={{
                '& .MuiIconButton-root': { color: '#00aeef' }
              }} />
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
                  <li><a className="dropdown-item" href="#!" onClick={() => handleRowsPerPageChange(10)}>10</a></li>
                  <li><a className="dropdown-item" href="#!" onClick={() => handleRowsPerPageChange(25)}>25</a></li>
                  <li><a className="dropdown-item" href="#!" onClick={() => handleRowsPerPageChange(50)}>50</a></li>
                </ul>
              </div>
              <p style={{ marginBottom: '0' }}>entries</p>
            </div>
            <div className='entries-right'>
              <div className="entries-right">
                <div className="search-div">
                  <input className="search-input" type="search" placeholder="Enter Category or Keywords" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  <button className="btn-search"><IoSearch /></button>
                </div>
              </div>
              {selectedIds.length > 0 && (
                <button
                  type="button"
                  className="btn-category"
                  onClick={handleBulkDelete}
                  style={{ backgroundColor: '#dc3545', marginRight: '10px' }}
                >
                  <RiDeleteBin6Line /> Delete Selected ({selectedIds.length})
                </button>
              )}
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
                    <Checkbox
                      checked={selectAll}
                      onChange={handleSelectAll}
                      indeterminate={selectedIds.length > 0 && selectedIds.length < displayedCategories.length}
                    />
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
                        <Checkbox
                          checked={selectedIds.includes(course.id)}
                          onChange={() => handleSelectOne(course.id)}
                        />
                      </StyledTableCell>
                      <StyledTableCell sx={{ width: 150, fontSize: '16px' }} align="center">
                        {index + 1 + (currentPage - 1) * rowsPerPage}
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontSize: '16px' }} align="left">{course.name}</StyledTableCell>
                      <StyledTableCell sx={{ width: 220, fontSize: '16px' }} align="center">
                        {course.date ? dayjs(course.date).format('MM-DD-YYYY') : 'N/A'}</StyledTableCell>
                      <StyledTableCell align="center" style={{ width: 220, }}>
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
            {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}

            <AdminPagination
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              totalRows={filteredCategories.length}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </LocalizationProvider>)}
    <Dialog className="dialog-box" open={open} onClose={handleClose} aria-labelledby="edit-schedule-dialog"
      PaperProps={{
        style: { borderRadius: 20 },
      }}>
      <div >
        <DialogTitle className="dialog-title" id="edit-schedule-dialog">Edit Course Category
          <Button onClick={handleClose} className="close-btn">
            <IoMdCloseCircleOutline style={{ color: "white", fontSize: "2rem" }} />
          </Button>
        </DialogTitle>
      </div>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <label>Category Name</label>
         <input
  type="text"
  className="form-control"
  id="categoryName"
  placeholder="Enter Category name"
  name="name"
  value={editedRow.name || ""}
  onChange={handleInputChange}
  style={{
    backgroundColor: "#fff",
    color: "#000",
    cursor: "text"
  }}
/>

          <div className="mb-3">
            Date <br />
            <DatePicker
              value={editedRow.date ? dayjs(editedRow.date) : null}
              onChange={(newDate) =>
                setEditedRow({ ...editedRow, date: newDate })
              }
              sx={{
                '& .MuiInputBase-root': {
                  width: '552px',
                }, '& .MuiIconButton-root': { color: '#00aeef' }
              }}
            />
          </div>

        </LocalizationProvider>

      </DialogContent>
      <DialogActions className="update" style={{ display: 'flex', justifyContent: 'center' }}>
        {/* <Button onClick={handleEdit} className="update-btn">Update</Button> */}
        <Button
  onClick={handleEdit}
  className="update-btn"
  disabled={isUpdating}
  style={{
    opacity: isUpdating ? 0.6 : 1,
    cursor: isUpdating ? "not-allowed" : "pointer"
  }}
>
  {isUpdating ? "Updating..." : "Update"}
</Button>
      </DialogActions>
    </Dialog>

  </>);
};

export default CourseCategory;