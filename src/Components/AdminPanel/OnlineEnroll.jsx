import * as React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { IoSearch } from "react-icons/io5";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { RiCloseCircleLine, RiDeleteBin6Line } from 'react-icons/ri';
import AdminPagination from './AdminPagination';
import './Admin.css';
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FaCheckCircle } from 'react-icons/fa';

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

export default function OnlineEnroll() {
  const [enrollData, setEnrollData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [message, setMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // ADDED: State for time period and mode filters
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedMode, setSelectedMode] = useState('');

  // ADDED: State for checkbox selection
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    axios.get("https://api.test.hachion.co/enroll")
      .then((response) => {
        setEnrollData(response.data);
        setFilteredData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching enrollment data:", error);
      });
  }, []);

  // ADDED: Handle period change
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
    applyFilters(period, selectedMode, newStartDate, newEndDate);
  };

  // ADDED: Handle mode change (filter by enrollmentStatus)
  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    applyFilters(selectedPeriod, mode, startDate, endDate);
  };

  // ADDED: Apply all filters
  const applyFilters = (period, mode, start, end) => {
    let filtered = [...enrollData];

    // Apply date range filter using enroll_date
    if (start || end) {
      const startTime = start ? dayjs(start).startOf('day').toDate().getTime() : null;
      const endTime = end ? dayjs(end).endOf('day').toDate().getTime() : null;

      filtered = filtered.filter((item) => {
        const enrollDateValue = item.enroll_date || item.date;
        if (!enrollDateValue) return false;
        const enrollDate = dayjs(enrollDateValue).toDate().getTime();
        return (
          (!startTime || enrollDate >= startTime) &&
          (!endTime || enrollDate <= endTime)
        );
      });
    }

    // Apply period filter
    if (period) {
      const today = dayjs();
      const startOfWeek = today.startOf('week');
      const startOfMonth = today.startOf('month');
      const startOfYear = today.startOf('year');

      filtered = filtered.filter((item) => {
        const enrollDateValue = item.enroll_date || item.date;
        if (!enrollDateValue) return false;
        const enrollDate = dayjs(enrollDateValue);
        switch (period) {
          case 'thisWeek':
            return enrollDate.isSame(startOfWeek, 'week') || enrollDate.isAfter(startOfWeek);
          case 'thisMonth':
            return enrollDate.isSame(startOfMonth, 'month') || enrollDate.isAfter(startOfMonth);
          case 'thisYear':
            return enrollDate.isSame(startOfYear, 'year') || enrollDate.isAfter(startOfYear);
          default:
            return true;
        }
      });
    }

    // Apply mode filter based on enrollmentStatus
    if (mode && mode !== 'both') {
      filtered = filtered.filter((item) => {
        const status = (item.enrollmentStatus || item.mode || '').toString().toLowerCase();
        return status === mode.toLowerCase();
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page
  };

  const handleDeleteConfirmation = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this enrollment?");
    if (confirmed) {
      handleDelete(id);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://api.test.hachion.co/enroll/delete/${id}`);
      setEnrollData((prev) => prev.filter((item) => item.id !== id));
      setFilteredData((prev) => prev.filter((item) => item.id !== id));

      // Remove from selectedIds if present
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));

      setSuccessMessage("✅ Enrollment deleted successfully.");
      setErrorMessage("");
    } catch (error) {
      console.error("Error deleting entry:", error);
      setErrorMessage("❌ Failed to delete enrollment.");
      setSuccessMessage("");
    }
  };

  const searchedData = filteredData.filter((item) => {
    return (
      searchTerm === '' ||
      [item.batchId, item.studentId, item.name, item.email, item.mobile, item.enroll_date, item.completion_date, item.course_name, item.mode]
        .map(field => (field || '').toLowerCase())
        .some(field => field.includes(searchTerm.toLowerCase()))
    );
  });

  const handleDateFilter = () => {
    applyFilters(selectedPeriod, selectedMode, startDate, endDate);
  };

  const handleDateReset = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedPeriod('');
    setSelectedMode('');
    setFilteredData(enrollData);
    setCurrentPage(1); // Reset to first page
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, window.scrollY);
  };

  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  const displayedCategories = searchedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // ADDED: Handle Select All checkbox
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = displayedCategories.map(enrollment => enrollment.id);
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
      if (newSelectedIds.length === displayedCategories.length) {
        setSelectAll(true);
      }
    }
  };

  // ADDED: Update selectAll state when page changes
  useEffect(() => {
    const allCurrentPageIds = displayedCategories.map(enrollment => enrollment.id);
    const allSelected = allCurrentPageIds.length > 0 &&
      allCurrentPageIds.every(id => selectedIds.includes(id));
    setSelectAll(allSelected);
  }, [currentPage, displayedCategories, selectedIds]);

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
        const updatedEnrollments = enrollData.filter(item => !selectedIds.includes(item.id));
        setEnrollData(updatedEnrollments);
        setFilteredData(updatedEnrollments);

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
      <div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className='course-category'>
            <div className='category'>
              <div className='category-header'>
                <p style={{ marginBottom: 0 }}>View Online Enrollment List</p>
              </div>

              {/* ADDED: Success and Error Messages */}
              {successMessage && <div style={{ color: "green", fontWeight: "bold", textAlign: "center", marginTop: "10px" }}>{successMessage}</div>}
              {errorMessage && <div style={{ color: "red", fontWeight: "bold", textAlign: "center", marginTop: "10px" }}>{errorMessage}</div>}

              <div className='date-schedule' style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                Start Date
                <DatePicker
                  value={startDate}
                  onChange={(date) => setStartDate(date)}
                  isClearable
                  sx={{
                    '& .MuiIconButton-root': { color: '#00aeef' }
                  }}
                />
                End Date
                <DatePicker
                  value={endDate}
                  onChange={(date) => setEndDate(date)}
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
                <select
                  className="form-select mode-select"
                  onChange={(e) => handleModeChange(e.target.value)}
                  value={selectedMode}
                  style={{ width: '150px' }}
                >
                  <option value="">All Modes</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="both">Both</option>
                </select>

                <button className='filter' onClick={handleDateFilter}>Filter</button>
                <button className="filter" onClick={handleDateReset}>Reset</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', padding: '1.5vh', gap: '30' }}>
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
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2vh' }}>
                  <div className="search-div" role="search" style={{ border: '1px solid #d3d3d3' }}>
                    <input
                      className="search-input"
                      type="search"
                      placeholder="Enter Names, Courses, or Mode"
                      aria-label="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
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
                    indeterminate={selectedIds.length > 0 && selectedIds.length < displayedCategories.length}
                  />
                </StyledTableCell>
                <StyledTableCell sx={{ width: 50 }} align='center'>S.No.</StyledTableCell>
                <StyledTableCell align="center">Batch ID</StyledTableCell>
                <StyledTableCell align="center">Student ID</StyledTableCell>
                <StyledTableCell align="center">Student Name</StyledTableCell>
                <StyledTableCell align="center">Email</StyledTableCell>
                <StyledTableCell align="center">Mobile</StyledTableCell>
                <StyledTableCell align="center">Course Name</StyledTableCell>
                <StyledTableCell align="center">Enrollment Date</StyledTableCell>
                <StyledTableCell align="center">Week</StyledTableCell>
                <StyledTableCell align="center">Time</StyledTableCell>
                <StyledTableCell align="center">Mode</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center">Trainer</StyledTableCell>
                <StyledTableCell align="center">Enrollment Status</StyledTableCell>
                <StyledTableCell align="center">Resend email count</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedCategories.length > 0 ? (
                displayedCategories.map((row, index) => (
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
                    <StyledTableCell align="left">{row.batchId}</StyledTableCell>
                    <StyledTableCell align="left">{row.studentId}</StyledTableCell>
                    <StyledTableCell align="left">{row.name}</StyledTableCell>
                    <StyledTableCell align="left">{row.email}</StyledTableCell>
                    <StyledTableCell align="center">{row.mobile}</StyledTableCell>
                    <StyledTableCell align="left">{row.course_name}</StyledTableCell>
                    <StyledTableCell align="center">{row.enroll_date ? dayjs(row.enroll_date).format('MMM-DD-YYYY').toUpperCase() : ''}</StyledTableCell>
                    <StyledTableCell align="center">{row.week}</StyledTableCell>
                    <StyledTableCell align="center">{row.time}</StyledTableCell>
                    <StyledTableCell align="center">{row.mode}</StyledTableCell>
                    <StyledTableCell align="center">
                      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                        {row.studentStatus === 'Completed' ? (
                          <span className="approved" style={{
                            color: 'green',
                            fontWeight: 'bold',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor: '#e6ffe6'
                          }}>
                            {row.studentStatus === 'completed' ? 'Completed' : 'Completed'} {/* Display 'Completed' for both 'completed' and 'approved' */}
                          </span>
                        ) : row.studentStatus === 'Pending' ? (
                          <span className="rejected" style={{
                            color: 'red',
                            fontWeight: 'bold',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor: '#ffe6e6'
                          }}>
                            Pending
                          </span>
                        ) : (
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                            <span
                              className="approve"
                              style={{
                                cursor: 'pointer',
                                color: 'green',
                                fontSize: '1.5rem',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                             onClick={async () => {
  const confirmed = window.confirm("Are you sure you want to approve this enrollment?");
  if (confirmed) {
    try {
      // ✅ CALL BACKEND API
      await axios.put("https://api.test.hachion.co/enroll/update-status", null, {
        params: {
          studentId: row.studentId,
          batchId: row.batchId,
          courseName: row.course_name,
          studentStatus: "Completed"
        }
      });

      // ✅ KEEP YOUR EXISTING CODE
      const updatedData = enrollData.map((item) =>
        item.id === row.id 
  ? { ...item, type: "approved", studentStatus: "Completed" } 
  : item
      );
      setEnrollData(updatedData);
      setFilteredData(updatedData);

      setSelectedIds(prev => prev.filter(id => id !== row.id));

      setSuccessMessage("✅ Enrollment approved successfully.");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 3000);

    } catch (error) {
      console.error(error);
      setErrorMessage("❌ Failed to update status");
      setSuccessMessage("");
    }
  }
}}
                            >
                              <FaCheckCircle />
                            </span>
                            <span
                              className="reject"
                              style={{
                                cursor: 'pointer',
                                color: 'red',
                                fontSize: '1.5rem',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            onClick={async () => {
  const confirmed = window.confirm("Are you sure you want to reject this enrollment?");
  if (confirmed) {
    try {
      // ✅ CALL BACKEND API (ADD THIS)
      await axios.put("https://api.test.hachion.co/enroll/update-status", null, {
        params: {
          studentId: row.studentId,
          batchId: row.batchId,
          courseName: row.course_name,
          studentStatus: "Pending"
        }
      });

      // ✅ KEEP YOUR EXISTING CODE
      const updatedData = enrollData.map((item) =>
        item.id === row.id 
          ? { ...item, type: "rejected", studentStatus: "Pending" } 
          : item
      );

      setEnrollData(updatedData);
      setFilteredData(updatedData);

      setSelectedIds(prev => prev.filter(id => id !== row.id));

      setSuccessMessage("❌ Enrollment rejected.");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 3000);

    } catch (error) {
      console.error(error);
      setErrorMessage("❌ Failed to update status");
      setSuccessMessage("");
    }
  }
}}
                            >
                              <RiCloseCircleLine />
                            </span>
                          </div>
                        )}
                      </div>
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.trainer}</StyledTableCell>
                    <StyledTableCell align="center">{row.enrollmentStatus}</StyledTableCell>
                    {/* <StyledTableCell align="center">{row.completion_date ? dayjs(row.completion_date).format('MMM-DD-YYYY').toUpperCase() : ''}</StyledTableCell> */}
                    <StyledTableCell align="center">{row.resendCount}</StyledTableCell>
                    <StyledTableCell align="center">
                      <RiDeleteBin6Line
                        className="delete"
                        onClick={() => handleDeleteConfirmation(row.id)}
                        style={{ cursor: "pointer", color: "red" }}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  {/* UPDATED: Changed colSpan from 15 to 17 to include checkbox column */}
                  <StyledTableCell colSpan={17} align="center">No data available</StyledTableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* REMOVED: Duplicate messages (already shown above) */}
        {/* {successMessage && <div style={{ color: "green" }}>{successMessage}</div>} */}

        <div className='pagination-container'>
          <AdminPagination
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            totalRows={searchedData.length}
            onPageChange={handlePageChange}
          />
        </div>
        {message && <div className="success-message">{message}</div>}
      </div>
    </>
  );
}