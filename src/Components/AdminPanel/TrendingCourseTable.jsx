import React, { useEffect } from 'react';
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
import Switch from '@mui/material/Switch';
import { MdKeyboardArrowRight } from 'react-icons/md';
import AdminPagination from './AdminPagination';
import dayjs from 'dayjs';

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

export default function TrendingCourseTable() {
  const [category, setCategory] = useState([]);
  const [course, setCourse] = useState([]);
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [trendingCourse, setTrendingCourse] = useState([]);
  const [filteredCourse, setFilteredCourse] = useState([])
  const [filterCourse, setFilterCourse] = useState([]);
  const [open, setOpen] = React.useState(false);
  const currentDate = new Date().toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [editedData, setEditedData] = useState({ trendingcourse_id: "", category_name: "", course_name: "", status: false });
  const [courseData, setCourseData] = useState({
    trendingcourse_id: "",
    category_name: "",
    course_name: "",
    date: currentDate,
    status: false
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [status, setStatus] = useState(false);

  // ADDED: State for checkbox selection
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [editCourseOptions, setEditCourseOptions] = useState([]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, window.scrollY);
  };


  const fetchCourseNamesByCategory = async (categoryName) => {
    if (!categoryName) return [];
    const url = `https://api.test.hachion.co/courses/coursenames-by-category?categoryName=${encodeURIComponent(categoryName)}`;
    try {
      const { data } = await axios.get(url);

      if (Array.isArray(data)) {
        return data.map((n) => ({ id: n, courseName: n }));
      }
      return [];
    } catch (err) {
      console.error('Error fetching course names by category:', err?.message || err);
      return [];
    }
  };


  useEffect(() => {
    let ignore = false;
    (async () => {
      if (courseData.category_name) {
        const names = await fetchCourseNamesByCategory(courseData.category_name);
        if (!ignore) setFilterCourse(names);
      } else {
        setFilterCourse([]);
      }
    })();
    return () => { ignore = true; };
  }, [courseData.category_name]);

  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  const handleSwitchToggle = () => {
    setStatus(!status);
  };

  const handleStatusChange = (e) => {
    setCourseData((prevData) => ({
      ...prevData,
      status: e.target.checked,
    }));
  };

  const handleInputStatusChange = (e) => {
    setEditedData((prevData) => ({
      ...prevData,
      status: e.target.checked,
    }));
  };


  const displayedCourse = filteredCourse.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleReset = () => {
    setCourseData({
      trendingcourse_id: "",
      category_name: "",
      course_name: "",
      date: currentDate,
      status: false
    });
    setFilterCourse([]);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setOpen(false);
    setEditCourseOptions([]);
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get('https://api.test.hachion.co/trendingcourse');
        setTrendingCourse(response.data);
        setFilteredCourse(response.data || []);
      } catch (error) {
        console.error("Error fetching video:", error.message);
      }
    };
    fetchCourse();
  }, []);

  const handleDeleteConfirmation = (trendingcourse_id) => {
    if (window.confirm("Are you sure you want to delete this Course?")) {
      handleDelete(trendingcourse_id);
    }
  };

  const handleDateFilter = () => {
    const filtered = trendingCourse.filter((item) => {
      const videoDate = new Date(item.date);
      const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
      const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
      return (!start || videoDate >= start) && (!end || videoDate <= end);
    });
    setFilteredCourse(filtered);
    setCurrentPage(1);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `https://api.test.hachion.co/trendingcourse/update/${editedData.trendingcourse_id}`, editedData
      );
      setTrendingCourse((prev) =>
        prev.map(curr =>
          curr.trendingcourse_id === editedData.trendingcourse_id ? response.data : curr
        )
      );

      setFilteredCourse(prev =>
        prev.map(curr =>
          curr.trendingcourse_id === editedData.trendingcourse_id
            ? response.data
            : curr
        )
      );
      setSuccessMessage("✅ Trending course updated successfully.");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 6000);

      setOpen(false);
      setEditCourseOptions([]);
    } catch (error) {

      setErrorMessage("❌ Failed to update trending course.");
      setSuccessMessage("");

      setTimeout(() => setErrorMessage(""), 6000);

    }
  };

  const handleDelete = async (trendingcourse_id) => {
    try {

      await axios.delete(
        `https://api.test.hachion.co/trendingcourse/delete/${trendingcourse_id}`
      );

      // Remove from selectedIds if present
      setSelectedIds(prev => prev.filter(id => id !== trendingcourse_id));

      setTrendingCourse(prev =>
        prev.filter(item => item.trendingcourse_id !== trendingcourse_id)
      );
      setFilteredCourse(prev =>
        prev.filter(item => item.trendingcourse_id !== trendingcourse_id)
      );
      setSuccessMessage("✅ Trending course deleted successfully.");
      setErrorMessage("");

      setTimeout(() => setSuccessMessage(""), 6000);

    } catch (error) {

      setErrorMessage("❌ Failed to delete trending course.");
      setSuccessMessage("");

      setTimeout(() => setErrorMessage(""), 6000);

    }
  };


  useEffect(() => {
    const filtered = trendingCourse.filter(trendingCourse =>
      (trendingCourse.course_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (trendingCourse.category_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourse(filtered);
    setCurrentPage(1);
  }, [searchTerm, trendingCourse]);


  const handleClickOpen = async (row) => {
    setEditedData({
      trendingcourse_id: row.trendingcourse_id,
      category_name: row.category_name,
      course_name: row.course_name,
      status: row.status
    });
    const names = await fetchCourseNamesByCategory(row.category_name);
    setEditCourseOptions(names);
    setOpen(true);
  };


  useEffect(() => {
    let ignore = false;
    (async () => {
      if (open && editedData.category_name) {
        const names = await fetchCourseNamesByCategory(editedData.category_name);
        if (!ignore) setEditCourseOptions(names);
      }
    })();
    return () => { ignore = true; };
  }, [open, editedData.category_name]);

  const handleChange = (e) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentDate = new Date().toISOString().split("T")[0];
    const dataToSubmit = {
      ...courseData,
      date: currentDate,
    };

    try {
      const response = await axios.post(
        "https://api.test.hachion.co/trendingcourse/add",
        dataToSubmit
      );

      if (response.status === 201) {

        const newTrendingCourse = {
          trendingcourse_id: Date.now(),
          category_name: courseData.category_name,
          course_name: courseData.course_name,
          status: courseData.status,
          date: currentDate
        };


        setTrendingCourse(prev => [...prev, newTrendingCourse]);
        setFilteredCourse(prev => [...prev, newTrendingCourse]);

        setSuccessMessage("✅ Trending course added successfully.");
        setErrorMessage("");

        setTimeout(() => setSuccessMessage(""), 6000);

        handleReset();
        setShowAddCourse(false);
      }

    } catch (error) {
      console.error("Error adding courses:", error);

      setErrorMessage("❌ Failed to add trending course.");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 6000);

    }
  };
  const handleAddTrendingCourseClick = () => { setShowAddCourse(true) }

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get("https://api.test.hachion.co/course-categories/all");
        setCategory(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };
    fetchCategory();
  }, []);


  useEffect(() => {
    console.log("Updated course state:", course);
  }, [course]);

  const handleDateReset = () => {
    setStartDate(null);
    setEndDate(null);
    setFilteredCourse(trendingCourse);
    setCurrentPage(1);
  };

  const isFormValid =
    courseData.category_name &&
    courseData.course_name;

  // ADDED: Handle Select All checkbox
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = displayedCourse.map(course => course.trendingcourse_id);
      setSelectedIds(allIds);
      setSelectAll(true);
    } else {
      setSelectedIds([]);
      setSelectAll(false);
    }
  };

  // ADDED: Handle individual checkbox
  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
      setSelectAll(false);
    } else {
      const newSelectedIds = [...selectedIds, id];
      setSelectedIds(newSelectedIds);
      // Check if all items are selected
      if (newSelectedIds.length === displayedCourse.length) {
        setSelectAll(true);
      }
    }
  };

  // ADDED: Update selectAll state when page changes
  useEffect(() => {
    const allCurrentPageIds = displayedCourse.map(course => course.trendingcourse_id);
    const allSelected = allCurrentPageIds.length > 0 && 
                       allCurrentPageIds.every(id => selectedIds.includes(id));
    setSelectAll(allSelected);
  }, [currentPage, displayedCourse, selectedIds]);

  // ADDED: Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      setErrorMessage("Please select at least one course to delete");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    const confirmMessage = `Are you sure you want to delete ${selectedIds.length} selected ${selectedIds.length === 1 ? 'course' : 'courses'}?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        // Delete all selected courses
        await Promise.all(
          selectedIds.map(id =>
            axios.delete(`https://api.test.hachion.co/trendingcourse/delete/${id}`)
          )
        );

        // Update state
        const updatedCourses = trendingCourse.filter(item => !selectedIds.includes(item.trendingcourse_id));
        setTrendingCourse(updatedCourses);
        setFilteredCourse(updatedCourses);
        
        setSelectedIds([]);
        setSelectAll(false);
        
        setSuccessMessage(`${selectedIds.length} ${selectedIds.length === 1 ? 'course' : 'courses'} deleted successfully`);
        setErrorMessage("");
        
        setTimeout(() => {
          setSuccessMessage("");
        }, 6000);
      } catch (error) {
        console.error("Error deleting courses:", error);
        setSuccessMessage("");
        setErrorMessage("Error deleting some courses. Please try again.");
        setTimeout(() => {
          setErrorMessage("");
        }, 6000);
      }
    }
  };

  return (
    <>
      {showAddCourse ? (
        <div className='course-category'>
          <h3>Trending Courses</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#!" onClick={() => setShowAddCourse(false)}>Trending Courses</a> <MdKeyboardArrowRight />
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Add Trending Course
              </li>
            </ol>
          </nav>

          <div className="category">
            <div className="category-header">
              <p style={{ marginBottom: 0 }}>Add Trending Course</p>
            </div>
            <div className='course-details'>
              <div className='course-row'>

                <div className="col-md-3">
                  <label htmlFor="inputState" className="form-label">Category Name <span style={{ color: "red" }}>*</span></label>
                  <select id="inputState" className="form-select" name='category_name' value={courseData.category_name} onChange={handleChange}>
                    <option value="" disabled>Select Category</option>
                    {category.map((curr) => (
                      <option key={curr.id} value={curr.name}>
                        {curr.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label htmlFor="inputState" className="form-label">Course Name <span style={{ color: "red" }}>*</span></label>
                  <select
                    id="inputState"
                    className="form-select"
                    name="course_name"
                    value={courseData.course_name}
                    onChange={handleChange}
                    disabled={!courseData.category_name}
                  >
                    <option value="" disabled>Select Course</option>
                    {filterCourse.map((curr) => (
                      <option key={curr.id} value={curr.courseName}>{curr.courseName}</option>
                    ))}
                  </select>
                </div>

              </div>

              <div className="col" style={{ display: 'flex', gap: 20 }}>
                <label className="form-label">Status:</label>
                <Switch
                  checked={courseData?.status ?? false}
                  onChange={handleStatusChange}
                  color="primary"
                />
                <span>{courseData?.status ? 'Enable' : 'Disable'}</span>
              </div>

              <div className="course-row">
                <button
                  className='submit-btn'
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                  style={{
                    cursor: !isFormValid ? "not-allowed" : "pointer",
                    opacity: !isFormValid ? 0.6 : 1
                  }}
                >
                  Submit
                </button>

                <button className='reset-btn' onClick={handleReset}>Reset</button>
              </div>
            </div>
          </div>
        </div>

      ) : (<div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className='course-category'>
            <h3>Trending Courses</h3>
            <div className='category'>
              <div className='category-header'>
                <p style={{ marginBottom: 0 }}>Trending Courses Details</p>
              </div>
              
              {/* ADDED: Success and Error Messages */}
              {successMessage && <p style={{ color: "green", fontWeight: "bold", textAlign: "center", marginTop: "10px" }}>{successMessage}</p>}
              {errorMessage && <p style={{ color: "red", fontWeight: "bold", textAlign: "center", marginTop: "10px" }}>{errorMessage}</p>}
              
              <div className='date-schedule'>
                Start Date
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  isClearable
                  sx={{ '& .MuiIconButton-root': { color: '#00aeef' } }}
                />
                End Date
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  isClearable
                  sx={{ '& .MuiIconButton-root': { color: '#00aeef' } }}
                />
                <button className='filter' onClick={handleDateFilter} >Filter</button>
                <button className='filter' onClick={handleDateReset} >Reset</button>
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
                  
                  {/* ADDED: Bulk Delete Button */}
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
                  
                  <button type="button" className="btn-category" onClick={handleAddTrendingCourseClick} >
                    <FiPlus /> Add Trending Course
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
                <StyledTableCell sx={{ width: 70 }} align="center">
                  {/* ADDED: Select All Checkbox */}
                  <Checkbox 
                    checked={selectAll}
                    onChange={handleSelectAll}
                    indeterminate={selectedIds.length > 0 && selectedIds.length < displayedCourse.length}
                  />
                </StyledTableCell>
                <StyledTableCell sx={{ width: 80 }} align='center'>S.No.</StyledTableCell>
                <StyledTableCell align='center'>Category Name</StyledTableCell>
                <StyledTableCell align='center'>Course Name</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center">Created Date</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>

              {displayedCourse.length > 0
                ? displayedCourse.map((row, index) => (
                  <StyledTableRow key={row.trendingcourse_id}>
                    {/* ADDED: Individual Checkbox */}
                    <StyledTableCell align="center">
                      <Checkbox 
                        checked={selectedIds.includes(row.trendingcourse_id)}
                        onChange={() => handleSelectOne(row.trendingcourse_id)}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">{index + 1 + (currentPage - 1) * rowsPerPage}</StyledTableCell>
                    <StyledTableCell align="left">{row.category_name}</StyledTableCell>
                    <StyledTableCell align="left">{row.course_name}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.status ? "Enabled" : "Disabled"}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.date
                        ? dayjs(row.date).format("MMM-DD-YYYY").toUpperCase()
                        : "N/A"}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                        <FaEdit className="edit" onClick={() => handleClickOpen(row)} />
                        <RiDeleteBin6Line
                          className="delete"
                          onClick={() => handleDeleteConfirmation(row.trendingcourse_id)}
                        />
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
                : (
                  <StyledTableRow>
                    {/* UPDATED: Changed colSpan from 6 to 7 to include checkbox column */}
                    <StyledTableCell colSpan={7} align="center">
                      No data available.
                    </StyledTableCell>
                  </StyledTableRow>
                )}

            </TableBody>
          </Table>
        </TableContainer>

        {/* REMOVED: Duplicate success/error messages (already shown above) */}
        {/* {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>} */}

        <div className='pagination-container'>
          <AdminPagination
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            totalRows={filteredCourse.length}
            onPageChange={handlePageChange}
          />
        </div>

      </div>)}

      <Dialog className="dialog-box" open={open} onClose={handleClose} aria-labelledby="edit-schedule-dialog"
        PaperProps={{ style: { borderRadius: 20 } }}>
        <div >
          <DialogTitle className="dialog-title" id="edit-schedule-dialog">Edit Trending Course
            <Button onClick={handleClose} className="close-btn">
              <IoMdCloseCircleOutline style={{ color: "white", fontSize: "2rem" }} />
            </Button>
          </DialogTitle>
        </div>
        <DialogContent>

          <div className="col">
            <label htmlFor="categoryName" className="form-label">Category Name</label>
            <select
              id="categoryName"
              className="form-select"
              name="category_name"
              value={editedData.category_name || ""}
              onChange={(e) => {
                handleInputChange(e);
                setEditedData((prev) => ({
                  ...prev,
                  course_name: ""
                }));
              }}
            >
              <option value="" disabled>Select Category</option>
              {category.map((curr) => (
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
              value={editedData.course_name || ""}
              onChange={handleInputChange}
              disabled={!editedData.category_name}
            >
              <option value="" disabled>Select Course</option>
              {editCourseOptions.length > 0 ? (
                editCourseOptions.map((current) => (
                  <option key={current.id} value={current.courseName}>
                    {current.courseName}
                  </option>
                ))
              ) : (
                <option disabled>{editedData.category_name ? 'Loading...' : 'Select Category first'}</option>
              )}
            </select>
          </div>

          <div className="col" style={{ display: 'flex', gap: 20 }}>
            <label className="form-label">Status:</label>
            <Switch
              checked={editedData?.status ?? false}
              onChange={handleInputStatusChange}
              color="primary"
            />
            <span>{editedData?.status ? 'Enable' : 'Disable'}</span>
          </div>

        </DialogContent>
        <DialogActions className="update" style={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={handleSave} className="update-btn">Update</Button>
        </DialogActions>
      </Dialog>
    </>);
}