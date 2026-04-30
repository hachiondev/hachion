import React, { useEffect } from 'react';
import { useState } from 'react';
import { duration, styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import './Admin.css';
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { IoSearch } from "react-icons/io5";

import { RiDeleteBin6Line } from 'react-icons/ri';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import axios from 'axios';

import { MdKeyboardArrowRight } from 'react-icons/md';
import AdminPagination from './AdminPagination';
import { AiFillCaretDown } from 'react-icons/ai';
import { Menu, MenuItem } from '@mui/material';
import Flag from 'react-world-flags';
import { countries as staticCountries } from '../../countryUtils';
import Select from 'react-select';
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

export default function LeadDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  
  const [registerStudent, setRegisterStudent] = useState([]);
  // const [filteredStudent, setFilteredStudent] = useState([])
  const [open, setOpen] = React.useState(false);
  const currentDate = new Date().toISOString().split('T')[0];
  // const [message, setMessage] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [editedData, setEditedData] = useState({ student_Id: "", userName: "", email: "", mobile: "", whatsapp: "", location: "", country: "", time_zone: "", analyst_name: "", source: "", remarks: "", comments: "", date: currentDate, visa_status: "", mode: "" });
  const [mobileError, setMobileError] = useState("");
  const [whatsappError, setWhatsappError] = useState("");

  const [anchorElCountry, setAnchorElCountry] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState({
    name: '',
    code: '',
    flag: ''
  });
  
  const [countries, setCountries] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");
const [demoFilter, setDemoFilter] = useState("");
const [leadTags, setLeadTags] = useState([]);
const [leadStatuses, setLeadStatuses] = useState([]);
const [showAllData, setShowAllData] = useState(false);
  // ADDED: State for checkbox selection
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, window.scrollY);
  };

const today = dayjs().startOf('day');
const next7Days = dayjs().add(7, 'day').endOf('day');

const filteredStudent = registerStudent.filter(item => {

  const matchesSearch = searchTerm
    ? (
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.leadStatus?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.coordinator?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : true;

  const matchesTag = demoFilter ? item.leadTag === demoFilter : true;
  const matchesStatus = statusFilter ? item.leadStatus === statusFilter : true;

  // 🔥 ALL button → show all ONLY when no date is selected
if (showAllData && !startDate && !endDate) {
  return matchesSearch && matchesTag && matchesStatus;
}

  // ❗ If dropdown selected and NO date → return ALL DB filtered by dropdown
  // if ((demoFilter || statusFilter) && !startDate && !endDate) {
  //   return matchesSearch && matchesTag && matchesStatus;
  // }
  // 🔥 ALWAYS apply dropdown filter first
if (!(matchesTag && matchesStatus)) {
  return false;
}

// 🔥 If dropdown selected but NO date → show ALL filtered records
if ((demoFilter || statusFilter) && !startDate && !endDate) {
  return matchesSearch;
}
// 🔥 If NO dropdown and NO date → default 7 days
if (!demoFilter && !statusFilter && !startDate && !endDate) {

  if (!item.lastCallMadeOn) return false;
const callDate = dayjs(item.lastCallMadeOn, [
  "DD-MMM-YY",
  "YYYY-MM-DD",
  "DD-MMM-YYYY",
  "DD-MMMM-YYYY",   
  "DD MMMM YYYY",   
  "DD MMM YYYY",    
  "DD/MM/YYYY"      
]);

  if (!callDate.isValid()) return false;

  const inNext7Days =
    callDate.isAfter(today.subtract(1, 'day')) &&
    callDate.isBefore(next7Days.add(1, 'day'));

  return inNext7Days && matchesSearch;
}

  // ❗ If no date and no dropdown → default 7 days
  if (!item.lastCallMadeOn) return false;

const callDate = dayjs(item.lastCallMadeOn, [
  "DD-MMM-YY",
  "YYYY-MM-DD",
  "DD-MMM-YYYY",
  "DD-MMMM-YYYY",   
  "DD MMMM YYYY",   
  "DD MMM YYYY",    
  "DD/MM/YYYY"      
]);

  if (!callDate.isValid()) return false;

  // 🔥 Date filter (with dropdown support)
  if (startDate || endDate) {
    const start = startDate ? dayjs(startDate).startOf('day') : null;
    const end = endDate ? dayjs(endDate).endOf('day') : null;

const inRange =
  (!start || callDate.isSame(start, 'day') || callDate.isAfter(start)) &&
  (!end || callDate.isSame(end, 'day') || callDate.isBefore(end));
    return inRange && matchesSearch && matchesTag && matchesStatus;
  }

  // 🔥 Default → 7 days
  const inNext7Days =
    callDate.isAfter(today.subtract(1, 'day')) &&
    callDate.isBefore(next7Days.add(1, 'day'));

  return inNext7Days && matchesSearch && matchesTag && matchesStatus;
});
const displayedCourse = filteredStudent.slice(
  (currentPage - 1) * rowsPerPage,
  currentPage * rowsPerPage
);
const hasFetched = React.useRef(false);

useEffect(() => {
  if (hasFetched.current) return;
  hasFetched.current = true;

  const fetchStudent = async () => {
    try {
      const response = await axios.get('https://api.test.hachion.co/lead-dashboard');
      setRegisterStudent(response.data);
    } catch (error) {
      console.error("Error fetching student list:", error.message);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [tagRes, statusRes] = await Promise.all([
        axios.get('https://api.test.hachion.co/register-leadtag'),
        axios.get('https://api.test.hachion.co/register-leadstatus')
      ]);

      setLeadTags(tagRes.data || []);
      setLeadStatuses(statusRes.data || []);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  fetchStudent();
  fetchDropdownData();

}, []);
  

  const handleDateReset = () => {
    setStartDate(null);
    setEndDate(null);
    setSearchTerm('');
    setShowAllData(false)
    setDemoFilter("");
  setStatusFilter("");
    setCurrentPage(1);
  };

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const parsed = dayjs(dateStr, [
    "YYYY-MM-DD",
    "DD-MMM-YY",
    "DD-MMM-YYYY",
    "DD-MMMM-YYYY",
    "DD MMMM YYYY",   // ✅ handles "13 April 2026"
    "DD MMM YYYY"
  ], true);

  if (parsed.isValid()) {
    return parsed.format("MMM-DD-YYYY"); // ✅ FINAL FORMAT
  }

  return dateStr; // fallback
};

const parseDate = (dateStr) => {
  if (!dateStr) return new Date(0);

  const parsed = dayjs(dateStr, [
    "DD-MMM-YY",
    "YYYY-MM-DD",
    "DD-MMM-YYYY",
    "DD-MMMM-YYYY",
    "DD MMMM YYYY",
    "DD MMM YYYY"
  ]);

  return parsed.isValid() ? parsed.toDate() : new Date(0);
};

const sortByFollowUp = (order) => {
  const sorted = [...registerStudent].sort((a, b) => {
    const dateA = parseDate(a.lastCallMadeOn);
    const dateB = parseDate(b.lastCallMadeOn);

    return order === "asc" ? dateA - dateB : dateB - dateA;
  });

  setRegisterStudent(sorted); // ✅ ONLY CHANGE
};
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = displayedCourse.map(student => student.id);
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
    const allCurrentPageIds = displayedCourse.map(student => student.id);
    const allSelected = allCurrentPageIds.length > 0 && 
                       allCurrentPageIds.every(id => selectedIds.includes(id));
    setSelectAll(allSelected);
  }, [currentPage, displayedCourse, selectedIds]);

  // ADDED: Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      setErrorMessage("Please select at least one student to delete");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    const confirmMessage = `Are you sure you want to delete ${selectedIds.length} selected ${selectedIds.length === 1 ? 'student' : 'students'}?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        // Delete all selected students
        await Promise.all(
          selectedIds.map(id =>
            axios.delete(`https://api.test.hachion.co/registerstudent/delete/${id}`)
          )
        );

        // Update state
        const updatedStudents = registerStudent.filter(item => !selectedIds.includes(item.id));
        setRegisterStudent(updatedStudents);
        // setFilteredStudent(updatedStudents);
        
        setSelectedIds([]);
        setSelectAll(false);
        
        setSuccessMessage(`${selectedIds.length} ${selectedIds.length === 1 ? 'student' : 'students'} deleted successfully`);
        setErrorMessage("");
        
        setTimeout(() => {
          setSuccessMessage("");
        }, 6000);
      } catch (error) {
        console.error("Error deleting students:", error);
        setSuccessMessage("");
        setErrorMessage("Error deleting some students. Please try again.");
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
              <p style={{ marginBottom: 0 }}>Lead Dashboard List</p>
            </div>

            {successMessage && (
              <p style={{ color: "green", fontWeight: "bold", textAlign: "center", marginTop: "10px" }}>
                {successMessage}
              </p>
            )}

            {errorMessage && (
              <p style={{ color: "red", fontWeight: "bold", textAlign: "center", marginTop: "10px" }}>
                {errorMessage}
              </p>
            )}

            <div className='date-schedule'>
              Start Date
              <DatePicker 
  value={startDate} 
  onChange={(date) => {
    setStartDate(date);
    setShowAllData(false); // 🔥 disable ALL when date selected
  }} 
  slotProps={{ textField: { size: "small", sx: { width: "170px" } } }} 
/>
              End Date
              <DatePicker 
  value={endDate} 
  onChange={(date) => {
    setEndDate(date);
    setShowAllData(false); // 🔥 disable ALL when date selected
  }} 
  slotProps={{ textField: { size: "small", sx: { width: "170px" } } }} 
/>

<button  className="filter"  onClick={() => {   setStatusFilter("");    setDemoFilter("");  setStartDate(null); setEndDate(null);  setShowAllData(true);}}>
  All
</button>

<select value={demoFilter} onChange={(e) => setDemoFilter(e.target.value)}
style={{ marginLeft:"10px", height:"36px", borderRadius:"15px", border:"1px solid #ccc", padding:"0 12px", outline:"none" }}>

  <option value="">Status</option>
  {leadTags.map((tag, index) => (
    <option key={index} value={tag}>{tag}</option>
  ))}
</select>
<select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
style={{ marginLeft:"10px", height:"36px", borderRadius:"15px", border:"1px solid #ccc", padding:"0 12px", outline:"none" }}>

  <option value="">Demo</option>
  {leadStatuses.map((status, index) => (
    <option key={index} value={status}>{status}</option>
  ))}


</select>
              {/* <button className='filter' onClick={handleDateFilter}>Filter</button> */}
              <button className="filter" onClick={handleDateReset}>Reset</button>
            </div>

            <div className='entries'>
              <div className='entries-left'>
                <p style={{ marginBottom: '0' }}>Show</p>
                <div className="btn-group">
                  <button type="button" className="btn-number dropdown-toggle">
                    {rowsPerPage}
                  </button>
                </div>
                <p style={{ marginBottom: '0' }}>entries</p>
              </div>

              <div className='entries-right'>
                <div className="search-div" role="search" style={{ border: '1px solid #d3d3d3' }}>
                                        <input className="search-input" type="search" placeholder="Enter Courses, Category or Keywords" aria-label="Search"
                                          value={searchTerm}
                                          onChange={(e) => setSearchTerm(e.target.value)} />
                                        <button className="btn-search" type="submit"  ><IoSearch style={{ fontSize: '2rem' }} /></button>
                                      </div>

              </div>
            </div>

          </div>
        </div>
      </LocalizationProvider>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell align='center'>
                <Checkbox
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </StyledTableCell>

              <StyledTableCell align='center'>S.No.</StyledTableCell>
              <StyledTableCell align='center'>Name</StyledTableCell>
              <StyledTableCell align='center'>Course Name</StyledTableCell>
              <StyledTableCell align='center'>Demo</StyledTableCell>
              <StyledTableCell align='center'>Status </StyledTableCell>
              {/* <StyledTableCell align='center'>Next Follow up</StyledTableCell> */}
               <StyledTableCell align='center'>
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
    Next Follow Up
    <span style={{
      display: "flex",
      flexDirection: "column",
      marginLeft: "6px",
      cursor: "pointer"
    }}>
      <span
        style={{
          width: 0,
          height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderBottom: "7px solid white",
          marginBottom: "2px"
        }}
        onClick={() => sortByFollowUp("asc")}
      ></span>

      <span
        style={{
          width: 0,
          height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: "7px solid white"
        }}
        onClick={() => sortByFollowUp("desc")}
      ></span>
    </span>
  </div>
</StyledTableCell>
              <StyledTableCell align='center'>Coordinator</StyledTableCell>
              {/* <StyledTableCell align='center'>Action</StyledTableCell> */}
            </TableRow>
          </TableHead>

          <TableBody>
            {displayedCourse.length > 0 ? (
              displayedCourse.map((row, index) => (
                <StyledTableRow key={row.id}>

                  <StyledTableCell align='center'>
                    <Checkbox
                      checked={selectedIds.includes(row.id)}
                      onChange={() => handleSelectOne(row.id)}
                    />
                  </StyledTableCell>

                  <StyledTableCell align="center">
                    {index + 1 + (currentPage - 1) * rowsPerPage}
                  </StyledTableCell>

                  <StyledTableCell align="center">{row.name}</StyledTableCell>
                  <StyledTableCell align="center">{row.course}</StyledTableCell>
                 <StyledTableCell>{row.leadTag || "-"}</StyledTableCell>
<StyledTableCell>{row.leadStatus || "-"}</StyledTableCell>
{/* <StyledTableCell>{row.lastCallMadeOn || "-"}</StyledTableCell> */}
<StyledTableCell>
  {row.lastCallMadeOn ? formatDate(row.lastCallMadeOn) : "-"}
</StyledTableCell>
<StyledTableCell>{row.coordinator || "-"}</StyledTableCell>
                  {/* <StyledTableCell align="center">
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <RiDeleteBin6Line
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeleteConfirmation(row.id)}
                      />
                    </div>
                  </StyledTableCell> */}

                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={7} align="center">
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
          totalRows={filteredStudent.length}
          onPageChange={handlePageChange}
        />
      </div>

    </div>
  </>

);
}