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
import { MdKeyboardArrowRight } from 'react-icons/md';
import AdminPagination from './AdminPagination';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

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

export default function OfflineEnroll() {
  const [course, setCourse] = useState([]);
  const [courseCategory, setCourseCategory] = useState([]);
  const [filterCourse, setFilterCourse] = useState([]);
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [enroll, setEnroll] = useState([]);
  const [filteredEnroll, setFilteredEnroll] = useState([])
  const [open, setOpen] = React.useState(false);
  const currentDate = new Date().toISOString().split('T')[0];
  const [message, setMessage] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [editedData, setEditedData] = useState({ certificate_image: "", course_name: "", category_name: "", title: "", description: "", });
  const [enrollData, setEnrollData] = useState({
    id: "",
    certificate_image: null,
    course_name: "",
    date: currentDate,
    category_name: "",
    duration: "",
    batch_id: "",
    email: "",
    title: "",
    description: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // ADDED: State for checkbox selection
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const DURATION_OPTIONS = ["1 month", "2 months", "3 months", "6 months", "1 year"];
  // const BATCH_ID_OPTIONS = ["Batch A", "Batch B", "Batch C"];

  const [batchIds, setBatchIds] = useState([]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, window.scrollY);
  };

  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  // Fixed: Use filteredEnroll instead of filteredData
  const displayedCourse = filteredEnroll.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleFileChange = (e) => {
    setEnrollData((prev) => ({ ...prev, certificate_image: e.target.files[0] }));
  };

  const handleReset = () => {
    setEnrollData({
      id: "",
      certificate_image: null,
      course_name: "",
      date: currentDate,
      category_name: "",
      duration: "",
      batch_id: "",
      email: "",
      title: "",
      description: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEnrollInputChange = (e) => {
    const { name, value } = e.target;
    setEnrollData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isEnrollFormValid = () => {
    return (
      enrollData.category_name.trim() !== "" &&
      enrollData.course_name.trim() !== "" &&
      enrollData.duration.trim() !== "" &&
      enrollData.batch_id.trim() !== "" &&
      enrollData.email.trim() !== ""
    );
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteConfirmation = (id) => {
    if (window.confirm("Are you sure you want to delete this enrollment?")) {
      handleDelete(id);
    }
  };

  // ADDED: Fetch enrollments on component mount
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await axios.get("https://api.test.hachion.co/offline-enrollments");
       console.log("Offline Enrollment API Response:", response.data);

setEnroll(response.data);
setFilteredEnroll(response.data);

      } catch (error) {
        console.error("Error fetching enrollments:", error.message);
      }
    };

    fetchEnrollments();
    
    // Fetch course categories
    const fetchCourseCategories = async () => {
      try {
        const response = await axios.get("https://api.test.hachion.co/course-categories/all");
        setCourse(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };
    
    fetchCourseCategories();
  }, []);

  // Fetch courses when category changes
  useEffect(() => {
    const fetchCourses = async () => {
      if (!enrollData.category_name) {
        setFilterCourse([]);
        return;
      }

      try {
        const response = await axios.get("https://api.test.hachion.co/courses/category", {
          params: {
            courseCategory: enrollData.category_name,
          },
        });

        if (Array.isArray(response.data)) {
          setFilterCourse(response.data);
        } else {
          console.warn("No courses returned for category:", enrollData.category_name, response.data);
          setFilterCourse([]);
        }
      } catch (error) {
        if (error.response?.status === 404) {
          setFilterCourse([]);
          return;
        }
        console.error("Error fetching courses by category:", error.message);
        setFilterCourse([]);
      }
    };

    fetchCourses();
  }, [enrollData.category_name]);

  useEffect(() => {

  const fetchBatchIds = async () => {

    if (
      enrollData.category_name &&
      enrollData.course_name &&
      enrollData.duration
    ) {

      try {

        const response = await axios.get(
          "https://api.test.hachion.co/batch-ids",
          {
            params: {
              categoryName: enrollData.category_name,
              courseName: enrollData.course_name,
              duration: enrollData.duration
            }
          }
        );

        setBatchIds(response.data);

      } catch (error) {
        console.error("Error fetching batch ids:", error);
      }

    } else {
      setBatchIds([]);
    }
  };

  fetchBatchIds();

}, [
  enrollData.category_name,
  enrollData.course_name,
  enrollData.duration
]);

  const handleSave = async () => {
    try {
      // Add update logic here
      setMessage("Enrollment updated successfully!");
      setTimeout(() => setMessage(""), 5000);
      setOpen(false);
    } catch (error) {
      setMessage("Error updating enrollment.");
    }
  };
const handleDelete = async (id) => {

  try {

    await axios.delete(
      `https://api.test.hachion.co/offline-enroll/delete/${id}`
    );

    const updatedEnrollments = enroll.filter(
      item => item.id !== id
    );

    setEnroll(updatedEnrollments);
    setFilteredEnroll(updatedEnrollments);

    setSelectedIds(prev =>
      prev.filter(selectedId => selectedId !== id)
    );

    setSuccessMessage("✅ Enrollment deleted successfully.");
    setErrorMessage("");

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

  } catch (error) {

    console.error("Error deleting enrollment:", error);

    setErrorMessage("❌ Failed to delete enrollment.");
    setSuccessMessage("");

    setTimeout(() => {
      setErrorMessage("");
    }, 3000);
  }
};
  const handleClickOpen = (row) => {
    setEditedData(row);
    setOpen(true);
  };

  const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "category_name") {
    setEnrollData((prevData) => ({
      ...prevData,
      category_name: value,
      course_name: "",
      duration: "",
      batch_id: ""
    }));

    setBatchIds([]);
    return;
  }

  if (name === "course_name") {
    setEnrollData((prevData) => ({
      ...prevData,
      course_name: value,
      duration: "",
      batch_id: ""
    }));

    setBatchIds([]);
    return;
  }

  // if (name === "duration") {
  //   setEnrollData((prevData) => ({
  //     ...prevData,
  //     duration: value,
  //     batch_id: ""
  //   }));

  //   return;
  // }

  setEnrollData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

  // Handle period change
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    let newStartDate = null;
    let newEndDate = null;

    if (period === 'thisWeek') {
      // Set to Monday to Sunday of current week
      const today = dayjs();
      newStartDate = today.startOf('week').add(1, 'day'); // Monday
      newEndDate = today.endOf('week').add(1, 'day'); // Sunday
    } else if (period === 'thisMonth') {
      // Set to first to last day of current month
      const today = dayjs();
      newStartDate = today.startOf('month');
      newEndDate = today.endOf('month');
    } else if (period === 'thisYear') {
      // Set to Jan 1 to Dec 31 of current year
      const today = dayjs();
      newStartDate = today.startOf('year');
      newEndDate = today.endOf('year');
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
    applyFilters(period, newStartDate, newEndDate);
  };

  // Apply all filters
 const applyFilters = (period, start, end) => {

  let filtered = [...enroll];

  // Apply date filter
  if (start || end) {

    const startTime = start
      ? dayjs(start).startOf('day').toDate().getTime()
      : null;

    const endTime = end
      ? dayjs(end).endOf('day').toDate().getTime()
      : null;

    filtered = filtered.filter((item) => {

      const enrollDateValue =
        item.enroll_date || item.date;

      if (!enrollDateValue) return false;

      const enrollDate = dayjs(enrollDateValue)
        .toDate()
        .getTime();

      return (
        (!startTime || enrollDate >= startTime) &&
        (!endTime || enrollDate <= endTime)
      );

    });
  }

  // Apply period filter
  if (period) {

    const today = dayjs();

    filtered = filtered.filter((item) => {

      const enrollDate = dayjs(
        item.enroll_date || item.date
      );

      switch (period) {

        case 'thisWeek':
          return enrollDate.isSame(today, 'week');

        case 'thisMonth':
          return enrollDate.isSame(today, 'month');

        case 'thisYear':
          return enrollDate.isSame(today, 'year');

        default:
          return true;
      }

    });
  }
// Apply search filter for ALL columns
if (searchTerm) {

  const searchLower = searchTerm.toLowerCase();

  filtered = filtered.filter((item) => {

    return Object.values(item)
      .join(' ')
      .toLowerCase()
      .includes(searchLower);

  });
}
  setFilteredEnroll(filtered);
  setCurrentPage(1);
};

  // Updated handleDateFilter to work with filteredEnroll
 const handleDateFilter = () => {
  let filtered = [...enroll];

  // Apply date range filter
  if (startDate || endDate) {
    const startTime = startDate
      ? dayjs(startDate).startOf('day').toDate().getTime()
      : null;

    const endTime = endDate
      ? dayjs(endDate).endOf('day').toDate().getTime()
      : null;

    filtered = filtered.filter((item) => {
      const enrollDateValue = item.enroll_date || item.date;

      if (!enrollDateValue) return false;

      const enrollDate = dayjs(enrollDateValue)
        .toDate()
        .getTime();

      return (
        (!startTime || enrollDate >= startTime) &&
        (!endTime || enrollDate <= endTime)
      );
    });
  }

  // Apply period filter
  if (selectedPeriod) {
    const today = dayjs();

    filtered = filtered.filter((item) => {
      const enrollDate = dayjs(item.enroll_date || item.date);

      switch (selectedPeriod) {
        case 'thisWeek':
          return enrollDate.isSame(today, 'week');

        case 'thisMonth':
          return enrollDate.isSame(today, 'month');

        case 'thisYear':
          return enrollDate.isSame(today, 'year');

        default:
          return true;
      }
    });
  }
// Apply search filter for ALL columns
if (searchTerm) {

  const searchLower = searchTerm.toLowerCase();

  filtered = filtered.filter((item) => {

    return Object.values(item)
      .join(' ')
      .toLowerCase()
      .includes(searchLower);

  });
}
  setFilteredEnroll(filtered);
  setCurrentPage(1);
};

  // Updated handleDateReset
  const handleDateReset = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedPeriod('');
    setFilteredEnroll(enroll);
    setCurrentPage(1);
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (!isEnrollFormValid()) {
      setErrorMessage("Please fill all required fields before submitting.");
      setSuccessMessage("");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const payload = {
        email: enrollData.email,
        course_name: enrollData.course_name,
        enroll_date: currentDate,
        batch_id: enrollData.batch_id,
      };

      console.log("Payload:", payload);

      const response = await axios.post(
        "https://api.test.hachion.co/offline-enroll/add",
        payload
      );

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("✅ Offline Enrollment Added Successfully");
        setErrorMessage("");
        handleReset();

        const enrollResponse = await axios.get(
          "https://api.test.hachion.co/offline-enrollments"
        );

        setEnroll(enrollResponse.data);
        setFilteredEnroll(enrollResponse.data);

        setTimeout(() => setSuccessMessage(""), 5000);
      }
    } catch (error) {
      console.error("Error adding enrollment:", error);
      const backendMessage = error.response?.data || "Error adding enrollment.";
      setErrorMessage(backendMessage);
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleAddTrendingCourseClick = () => {
    setShowAddCourse(true);
  };

  // ADDED: Handle Select All checkbox
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = displayedCourse.map(enrollment => enrollment.id);
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
    const allCurrentPageIds = displayedCourse.map(enrollment => enrollment.id);
    const allSelected = allCurrentPageIds.length > 0 && 
                       allCurrentPageIds.every(id => selectedIds.includes(id));
    setSelectAll(allSelected);
  }, [currentPage, displayedCourse, selectedIds]);

  // ADDED: Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      setErrorMessage("Please select at least one enrollment to delete");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    const confirmMessage = `Are you sure you want to delete ${selectedIds.length} selected ${selectedIds.length === 1 ? 'enrollment' : 'enrollments'}?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        // Delete all selected enrollments
        await Promise.all(
          selectedIds.map(id =>
            axios.delete(`https://api.test.hachion.co/enroll/delete/${id}`)
          )
        );

        // Update state
        const updatedEnrollments = enroll.filter(item => !selectedIds.includes(item.id));
        setEnroll(updatedEnrollments);
        setFilteredEnroll(updatedEnrollments);
        
        setSelectedIds([]);
        setSelectAll(false);
        
        setSuccessMessage(`${selectedIds.length} ${selectedIds.length === 1 ? 'enrollment' : 'enrollments'} deleted successfully`);
        setErrorMessage("");
        
        setTimeout(() => {
          setSuccessMessage("");
        }, 6000);
      } catch (error) {
        console.error("Error deleting enrollments:", error);
        setSuccessMessage("");
        setErrorMessage("Error deleting some enrollments. Please try again.");
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
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#!" onClick={() => setShowAddCourse(false)}>Offline Enrollment</a> <MdKeyboardArrowRight />
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Add Enrollment
              </li>
            </ol>
          </nav>
          <div className='category'>
            <div className='category-header'>
              <p style={{ marginBottom: 0 }}>Add Enrollment</p>
            </div>
            <div className='course-details'>
              <div className='course-row'>
                <div className="col">
                  <label htmlFor="inputState" className="form-label">Category Name</label>
                  <select id="inputState" className="form-select" name='category_name' value={enrollData.category_name} onChange={handleChange}>
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
                    value={enrollData.course_name}
                    onChange={handleChange}
                    disabled={!enrollData.category_name}
                  >
                    <option value="" disabled>Select Course</option>
                    {filterCourse.map((curr) => (
                      <option key={curr.id} value={curr.courseName}>{curr.courseName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className='course-row'>
                <div className="col">
                  <label htmlFor="duration" className="form-label">Duration</label>
                  <select
                    id="duration"
                    className="form-select"
                    name="duration"
                    value={enrollData.duration}
                    onChange={handleChange}
                  >
                    <option value="" disabled>Select Duration</option>
                    {DURATION_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col">
                  <label htmlFor="batch_id" className="form-label">Batch ID</label>
                  <select
  id="batch_id"
  className="form-select"
  name="batch_id"
  value={enrollData.batch_id || ""}
  onChange={handleChange}
>
  <option value="">
    Select Batch
  </option>

  {batchIds.map((batchId, index) => (
    <option key={index} value={batchId}>
      {batchId}
    </option>
  ))}
</select>

                </div>
              </div>

              <div className='course-row'>
                <div className="col">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={enrollData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                  />
                </div>
                
              </div>

              <div className='course-row'>
                
              </div>

              <div className='course-row'>
                <button
                  className='submit-btn'
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isEnrollFormValid() || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
                <button className='reset-btn' type="button" onClick={handleReset} disabled={isSubmitting}>Reset</button>
              </div>

              {/* Success and Error Messages */}
              {successMessage && (
                <div style={{ color: "green", fontWeight: "bold", textAlign: "center", marginTop: "15px", padding: "10px", backgroundColor: "#d4edda", borderRadius: "4px" }}>
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div style={{ color: "red", fontWeight: "bold", textAlign: "center", marginTop: "15px", padding: "10px", backgroundColor: "#f8d7da", borderRadius: "4px" }}>
                  {errorMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className='course-category'>
              <div className='category'>
                <div className='category-header'>
                  <p style={{ marginBottom: 0 }}>View Offline Enrollment List</p>
                </div>
                
                {/* ADDED: Success and Error Messages */}
                {successMessage && <div style={{ color: "green", fontWeight: "bold", textAlign: "center", marginTop: "10px" }}>{successMessage}</div>}
                {errorMessage && <div style={{ color: "red", fontWeight: "bold", textAlign: "center", marginTop: "10px" }}>{errorMessage}</div>}
                
                <div className='date-schedule'>
                  Start Date
                  <DatePicker
                    value={startDate}
                    onChange={(date) => {
  setStartDate(date);
  applyFilters(selectedPeriod, date, endDate);
}}
                    isClearable
                    sx={{
                      '& .MuiIconButton-root': { color: '#00aeef' }
                    }}
                  />
                  End Date
                  <DatePicker
                    value={endDate}
                   onChange={(date) => {
  setEndDate(date);
  applyFilters(selectedPeriod, startDate, date);
}}              
 isClearable
                    sx={{
                      '& .MuiIconButton-root': { color: '#00aeef' }
                    }}
                  />
                  
                  {/* ADDED: Time Period Dropdown */}
                  <select
                    className="form-select period-select"
                    onChange={(e) => handlePeriodChange(e.target.value)}
                    value={selectedPeriod}
                    style={{ width: '150px', marginLeft: '10px' }}
                  >
                    <option value="">Select Period</option>
                    <option value="thisWeek">This Week</option>
                    <option value="thisMonth">This Month</option>
                    <option value="thisYear">This Year</option>
                  </select>

                  {/* ADDED: Mode Filter Dropdown */}
                  {/* <select
                    className="form-select mode-select"
                    onChange={(e) => {
                      // Handle mode selection if needed
                      console.log(e.target.value);
                    }}
                    style={{ width: '150px' }}
                  >
                    <option value="">All Modes</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="both">Both</option>
                  </select> */}
                  
                  <button className='filter' onClick={handleDateFilter}>Filter</button>
                  <button className='filter' onClick={handleDateReset}>Reset</button>
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
                      <input
                        className="search-input"
                        type="search"
                        placeholder="Enter Names, Courses, or Email"
                        aria-label="Search"
                        value={searchTerm}
                          onChange={(e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (!value) {
      setFilteredEnroll(enroll);
      return;
    }
    const filteredData = enroll.filter((item) => {
      return Object.values(item)
        .some((val) =>
          String(val)
            .toLowerCase()
            .includes(value.toLowerCase())
        );
    });
    setFilteredEnroll(filteredData);
    setCurrentPage(1);
  }}
/>
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
                    
                    <button type="button" className="btn-category" onClick={handleAddTrendingCourseClick}>
                      <FiPlus /> Add Enrollment
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
                  {/* ADDED: Select All Checkbox */}
                  <StyledTableCell align='center'>
                    <Checkbox 
                      checked={selectAll}
                      onChange={handleSelectAll}
                      indeterminate={selectedIds.length > 0 && selectedIds.length < displayedCourse.length}
                    />
                  </StyledTableCell>
                  <StyledTableCell sx={{ width: 50 }} align='center'>S.No.</StyledTableCell>
                  <StyledTableCell align="center">Student ID</StyledTableCell>
                  <StyledTableCell align="center">Student Name</StyledTableCell>
                  <StyledTableCell align="center">Email</StyledTableCell>
                  <StyledTableCell align="center">Mobile</StyledTableCell>
                  <StyledTableCell align="center">Course Name</StyledTableCell>
                  <StyledTableCell align="center">Enrollment Date</StyledTableCell>
                  <StyledTableCell align="center">Time</StyledTableCell>
                  <StyledTableCell align="center">Mode</StyledTableCell>
                  {/* <StyledTableCell align="center">Completed Date</StyledTableCell> */}
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedCourse.length > 0 ? (
                  displayedCourse.map((row, index) => (
                    <StyledTableRow key={row.id}>
                      {/* ADDED: Individual Checkbox */}
                      <StyledTableCell align="center">
                        <Checkbox 
                          checked={selectedIds.includes(row.id)}
                          onChange={() => handleSelectOne(row.id)}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {index + 1 + (currentPage - 1) * rowsPerPage}
                      </StyledTableCell>
                      <StyledTableCell align="left">{row.studentId || row.studentId}</StyledTableCell>
                      <StyledTableCell align="left">{row.name}</StyledTableCell>
                      <StyledTableCell align="left">{row.email}</StyledTableCell>
                      <StyledTableCell align="center">{row.mobile}</StyledTableCell>
                      <StyledTableCell align="left">{row.course_name}</StyledTableCell>
                      <StyledTableCell align="center">
                        {row.enroll_date ? dayjs(row.enroll_date).format('MMM-DD-YYYY').toUpperCase() : ''}
                      </StyledTableCell>
                      <StyledTableCell align="center">{row.time}</StyledTableCell>
                      <StyledTableCell align="center">{row.mode}</StyledTableCell>
                      {/* <StyledTableCell align="center">
                        {row.completion_date ? dayjs(row.completion_date).format('MMM-DD-YYYY').toUpperCase() : ''}
                      </StyledTableCell> */}
                      <StyledTableCell align="center">
                       <RiDeleteBin6Line
  className="delete"
  onClick={() => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this enrollment?"
    );

    if (confirmDelete) {
      handleDelete(row.id);
    }
  }}
  style={{ cursor: "pointer", color: "red" }}
/>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <StyledTableRow>
                    {/* UPDATED: Changed colSpan from 12 to 13 to include checkbox column */}
                    <StyledTableCell colSpan={13} align="center">No data available</StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <div className='pagination-container'>
            <AdminPagination
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              totalRows={filteredEnroll.length}
              onPageChange={handlePageChange}
            />
          </div>
          {message && <div className="success-message">{message}</div>}
        </div>
      )}

      <Dialog className="dialog-box" open={open} onClose={handleClose} aria-labelledby="edit-schedule-dialog"
        PaperProps={{
          style: { borderRadius: 20 },
        }}>
        <div>
          <DialogTitle className="dialog-title" id="edit-schedule-dialog">Edit Offline Enrollment
            <Button onClick={handleClose} className="close-btn">
              <IoMdCloseCircleOutline style={{ color: "white", fontSize: "2rem" }} />
            </Button>
          </DialogTitle>
        </div>
        <DialogContent>
          <div className="course-row">
            <div className="col">
              <label htmlFor="inputState" className="form-label">Category Name</label>
              <select id="inputState" className="form-select" name='category_name' value={editedData.category_name} onChange={handleInputChange}>
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
              <label htmlFor="inputState" className="form-label">Course Name</label>
              <select id="inputState" className="form-select" name='course_name' value={editedData.course_name} onChange={handleInputChange}>
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
        </DialogContent>
        <DialogActions className="update" style={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={handleSave} className="update-btn">Update</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}