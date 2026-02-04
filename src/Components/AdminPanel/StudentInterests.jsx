import * as React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { tableCellClasses } from '@mui/material/TableCell';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { IoSearch } from "react-icons/io5";
import { useState, useEffect } from 'react';
import AdminPagination from './AdminPagination';
import { RiDeleteBin6Line } from 'react-icons/ri';
import './Admin.css';
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

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

export default function StudentInterests() {
  const [studentInterest, setStudentInterest] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredRows, setFilteredRows] = useState([]);
  
  // ADDED: State for checkbox selection
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchStudentInterests = async () => {
      try {
        const response = await axios.get("https://api.test.hachion.co/popup-onboarding/getAllOnboarding");
        setStudentInterest(response.data);
        setFilteredRows(response.data);
      } catch (err) {
        console.error("Error fetching student interests:", err);
      }
    };
    fetchStudentInterests();
  }, []);

  const filteredData = studentInterest.filter((item) => {
    const date = new Date(item.date || item.payment_date);
    const matchesSearch =
      searchTerm === '' ||
      [item.name, item.student_ID]
        .map(field => (field || '').toLowerCase())
        .some(field => field.includes(searchTerm.toLowerCase()));
    const inDateRange =
      (!startDate || date >= new Date(startDate)) &&
      (!endDate || date <= new Date(endDate));
    return matchesSearch && inDateRange;
  });

  const displayedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // ADDED: Handle Select All checkbox
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = displayedData.map(item => item.popupOnboardingId);
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
      if (newSelectedIds.length === displayedData.length) {
        setSelectAll(true);
      }
    }
  };

  // ADDED: Update selectAll state when page changes
  useEffect(() => {
    const allCurrentPageIds = displayedData.map(item => item.popupOnboardingId);
    const allSelected = allCurrentPageIds.length > 0 && 
                       allCurrentPageIds.every(id => selectedIds.includes(id));
    setSelectAll(allSelected);
  }, [currentPage, displayedData, selectedIds]);

  // ADDED: Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      setErrorMessage("❌ Please select at least one record to delete");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    const confirmMessage = `Are you sure you want to delete ${selectedIds.length} selected ${selectedIds.length === 1 ? 'record' : 'records'}?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        // Delete all selected records
        const deletePromises = selectedIds.map(id => 
          axios.delete(`https://api.test.hachion.co/popup-onboarding/${id}`)
        );
        
        await Promise.all(deletePromises);

        // Update state
        const updatedData = studentInterest.filter(item => !selectedIds.includes(item.popupOnboardingId));
        setStudentInterest(updatedData);
        setFilteredRows(updatedData);
        
        setSelectedIds([]);
        setSelectAll(false);
        
        setSuccessMessage(`✅ ${selectedIds.length} ${selectedIds.length === 1 ? 'record' : 'records'} deleted successfully`);
        setErrorMessage("");
        
        setTimeout(() => {
          setSuccessMessage("");
        }, 6000);
      } catch (error) {
        console.error("Error deleting records:", error);
        setSuccessMessage("");
        setErrorMessage("❌ Error deleting some records. Please try again.");
        setTimeout(() => {
          setErrorMessage("");
        }, 6000);
      }
    }
  };

  const handleDateFilter = () => {
    const filtered = studentInterest.filter((item) => {
      const itemDate = dayjs(item.date);
      return (
        (!startDate || itemDate.isAfter(dayjs(startDate).subtract(1, 'day'))) &&
        (!endDate || itemDate.isBefore(dayjs(endDate).add(1, 'day')))
      );
    });
    setFilteredRows(filtered);
    setSelectedIds([]); // Reset selection on filter
    setSelectAll(false);
  };

  const handleDateReset = () => {
    setStartDate(null);
    setEndDate(null);
    setFilteredRows(studentInterest);
    setSelectedIds([]); // Reset selection on reset
    setSelectAll(false);
  };

  useEffect(() => {
    setFilteredRows(studentInterest);
  }, [studentInterest]);

  // UPDATED: handleDelete function to remove from selectedIds
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(`https://api.test.hachion.co/popup-onboarding/${id}`);

        const updatedData = studentInterest.filter(item => item.popupOnboardingId !== id);
        setStudentInterest(updatedData);
        setFilteredRows(updatedData);
        
        // Remove from selectedIds if present
        setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
        
        setSuccessMessage("✅ Record deleted successfully.");
        setErrorMessage("");
      } catch (err) {
        console.error("Error deleting record:", err);
        setSuccessMessage("");
        setErrorMessage("❌ Failed to delete record.");
      }
    }
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className='course-category'>
          <h3>Student Interests</h3>
          <div className='category-header'>
            <p style={{ marginBottom: 0 }}>View Student Interests</p>
          </div>
          
          {/* ADDED: Success and Error Messages */}
          {successMessage && <div style={{ color: "green", fontWeight: "bold", textAlign: "center", marginTop: "10px" }}>{successMessage}</div>}
          {errorMessage && <div style={{ color: "red", fontWeight: "bold", textAlign: "center", marginTop: "10px" }}>{errorMessage}</div>}
          
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
            <button className='filter' onClick={handleDateFilter}>Filter</button>
            <button className="filter" onClick={handleDateReset}>Reset</button>
          </div>
          <div className='entries'>
            <div className='entries-left'>
              <p style={{ marginBottom: '0' }}>Show</p>
              <div className="btn-group">
                <button type="button" className="btn-number dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                  {rowsPerPage}
                </button>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="#!" onClick={() => setRowsPerPage(10)}>10</a></li>
                  <li><a className="dropdown-item" href="#!" onClick={() => setRowsPerPage(25)}>25</a></li>
                  <li><a className="dropdown-item" href="#!" onClick={() => setRowsPerPage(50)}>50</a></li>
                </ul>
              </div>
              <p style={{ marginBottom: '0' }}>entries</p>
            </div>
            <div className='entries-right'>
              <div className="search-div" role="search" style={{ border: '1px solid #d3d3d3' }}>
                <input
                  className="search-input"
                  type="search"
                  placeholder="Enter Student ID, Name"
                  aria-label="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn-search" type="submit">
                  <IoSearch style={{ fontSize: '2rem' }} />
                </button>
              </div>
              
              {/* ADDED: Bulk Delete Button */}
              {selectedIds.length > 0 && (
                <button 
                  type="button" 
                  className="btn-category" 
                  onClick={handleBulkDelete}
                  style={{ backgroundColor: '#dc3545', marginLeft: '10px' }}
                >
                  <RiDeleteBin6Line /> Delete Selected ({selectedIds.length})
                </button>
              )}
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
                  indeterminate={selectedIds.length > 0 && selectedIds.length < displayedData.length}
                />
              </StyledTableCell>
              <StyledTableCell align='center'>S.No.</StyledTableCell>
              <StyledTableCell align='center'>Student ID</StyledTableCell>
              <StyledTableCell align='center'>Student Name</StyledTableCell>
              <StyledTableCell align='center'>Q1</StyledTableCell>
              <StyledTableCell align="center">Q2</StyledTableCell>
              <StyledTableCell align="center">Q3</StyledTableCell>
              <StyledTableCell align="center">Q4</StyledTableCell>
              <StyledTableCell align="center">Q5</StyledTableCell>
              <StyledTableCell align='center'>Q6</StyledTableCell>
              <StyledTableCell align="center">Q7</StyledTableCell>
              <StyledTableCell align="center">Q8</StyledTableCell>
              <StyledTableCell align="center">Q9</StyledTableCell>
              <StyledTableCell align="center">Q10</StyledTableCell>
              <StyledTableCell align="center">Q11</StyledTableCell>
              <StyledTableCell align="center">Created Date </StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedData.length > 0 ? (
              displayedData.map((row, index) => (
                <StyledTableRow key={row.popupOnboardingId || index}>
                  {/* ADDED: Individual Checkbox */}
                  <StyledTableCell align='center'>
                    <Checkbox 
                      checked={selectedIds.includes(row.popupOnboardingId)}
                      onChange={() => handleSelectOne(row.popupOnboardingId)}
                    />
                  </StyledTableCell>
                  <StyledTableCell>{index + 1 + (currentPage - 1) * rowsPerPage}</StyledTableCell>
                  <StyledTableCell align="center">{row.studentId}</StyledTableCell>
                  <StyledTableCell align="left">{row.studentName}</StyledTableCell>
                  <StyledTableCell align="left">{row.currentRole}</StyledTableCell>
                  <StyledTableCell align="left">{row.primaryGoal}</StyledTableCell>
                  <StyledTableCell align="left">
                    {Array.isArray(row.areasOfInterest) ? row.areasOfInterest.join(', ') : row.areasOfInterest}
                  </StyledTableCell>

                  <StyledTableCell align="left">
                    {Array.isArray(row.preferToLearn) ? row.preferToLearn.join(', ') : row.preferToLearn}
                  </StyledTableCell>
                  <StyledTableCell align="left">{row.preferredTrainingMode}</StyledTableCell>
                  <StyledTableCell align="left">{row.currentSkill}</StyledTableCell>
                  <StyledTableCell align="left">{row.lookingForJob}</StyledTableCell>
                  <StyledTableCell align="left">{row.realTimeProjects}</StyledTableCell>
                  <StyledTableCell align="left">{row.certificationOrPlacement}</StyledTableCell>
                  <StyledTableCell align="left">{row.speakToCourseAdvisor}</StyledTableCell>
                  <StyledTableCell align="left">{row.whereYouHeard}</StyledTableCell>
                  <StyledTableCell align="center">{row.fillingDate ? dayjs(row.fillingDate).format('MMM-DD-YYYY').toUpperCase() : ''}</StyledTableCell>
                  <StyledTableCell align="center">
                    <RiDeleteBin6Line
                      className="delete"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDelete(row.popupOnboardingId)}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                {/* UPDATED: Changed colSpan from 17 to 18 to include checkbox column */}
                <StyledTableCell colSpan={18} align="center">No data available</StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <div className='pagination-container'>
        <AdminPagination
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          totalRows={filteredData.length}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}