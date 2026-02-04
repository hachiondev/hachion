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
import { RiCloseCircleLine } from 'react-icons/ri';
import success from '../../Assets/success.gif';
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
import { GoPlus } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { MdKeyboardArrowRight } from 'react-icons/md';
import AdminPagination from './AdminPagination';
import dayjs from 'dayjs';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#00AEEF',
    color: theme.palette.common.white,
    borderRight: '1px solid white', // Add vertical lines
    padding: '3px 5px',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: '3px 4px',
    borderRight: '1px solid #e0e0e0', // Add vertical lines for body rows
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

export default function Support() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [support, setSupport] = useState([]);
  const [filteredSupport, setFilteredSupport] = useState([])
  const [open, setOpen] = React.useState(false);
  const currentDate = new Date().toISOString().split('T')[0];
  const [message, setMessage] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [editedData, setEditedData] = useState({ name: "", email: "", password: "", mobile: "", address: "" });
  const [supportData, setSupportData] = useState({
    support_id: "",
    name: "",
    email: "",
    mobile: "",
    password: "",
    address: "",
    date: currentDate,
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // ADD: State for checkbox selection
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, window.scrollY);
  };

  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  const displayedCourse = filteredSupport.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleReset = () => {
    setSupportData({
      support_id: "",
      name: "",
      email: "",
      mobile: "",
      password: "",
      address: "",
      date: currentDate,
    });
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
  };

  useEffect(() => {
    const fetchSupport = async () => {
      try {
        const response = await axios.get('https://api.test.hachion.co/support');
        setSupport(response.data);
        setFilteredSupport(response.data);
      } catch (error) {
        console.error("Error fetching support:", error.message);
      }
    };
    fetchSupport();
  }, []);

  // ADD: Handle Select All checkbox
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = displayedCourse.map(item => item.support_id);
      setSelectedIds(allIds);
      setSelectAll(true);
    } else {
      setSelectedIds([]);
      setSelectAll(false);
    }
  };

  // ADD: Handle individual checkbox
  const handleSelectOne = (support_id) => {
    if (selectedIds.includes(support_id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== support_id));
      setSelectAll(false);
    } else {
      const newSelectedIds = [...selectedIds, support_id];
      setSelectedIds(newSelectedIds);
      // Check if all items are selected
      if (newSelectedIds.length === displayedCourse.length) {
        setSelectAll(true);
      }
    }
  };

  // ADD: Update selectAll state when page changes
  useEffect(() => {
    const allCurrentPageIds = displayedCourse.map(item => item.support_id);
    const allSelected = allCurrentPageIds.length > 0 &&
      allCurrentPageIds.every(id => selectedIds.includes(id));
    setSelectAll(allSelected);
  }, [currentPage, displayedCourse, selectedIds]);

  // ADD: Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      setErrorMessage("❌ Please select at least one support to delete");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    const confirmMessage = `Are you sure you want to delete ${selectedIds.length} selected ${selectedIds.length === 1 ? 'support' : 'supports'}?`;

    if (window.confirm(confirmMessage)) {
      try {
        // Delete all selected supports
        const deletePromises = selectedIds.map(support_id =>
          axios.delete(`https://api.test.hachion.co/support/delete/${support_id}`)
        );

        await Promise.all(deletePromises);

        // Update state
        const updatedSupport = support.filter(item => !selectedIds.includes(item.support_id));
        setSupport(updatedSupport);
        setFilteredSupport(updatedSupport);

        setSelectedIds([]);
        setSelectAll(false);

        setSuccessMessage(`✅ ${selectedIds.length} ${selectedIds.length === 1 ? 'support' : 'supports'} deleted successfully`);
        setErrorMessage("");

        setTimeout(() => {
          setSuccessMessage("");
        }, 6000);
      } catch (error) {
        console.error("Error deleting supports:", error);
        setSuccessMessage("");
        setErrorMessage("❌ Error deleting some supports. Please try again.");
        setTimeout(() => {
          setErrorMessage("");
        }, 6000);
      }
    }
  };

  // UPDATED: handleDeleteConfirmation function
  const handleDeleteConfirmation = (support_id) => {
    let idsToDelete = selectedIds;

    // If a specific support_id is provided (single delete), use that
    if (support_id) {
      idsToDelete = [support_id];
    }

    // If no support_id provided and nothing selected, show alert
    if (!support_id && (!idsToDelete || idsToDelete.length === 0)) {
      alert("Please select at least one support to delete.");
      return;
    }

    const confirmMessage = support_id 
      ? "Are you sure you want to delete this Support?"
      : `Are you sure you want to delete ${idsToDelete.length} selected ${idsToDelete.length === 1 ? 'support' : 'supports'}?`;

    if (window.confirm(confirmMessage)) {
      handleDelete(idsToDelete);
    }
  };

  // UPDATED: handleDelete function to handle both single and bulk delete
  const handleDelete = async (ids) => {
    try {
      const deletePromises = ids.map(support_id =>
        axios.delete(`https://api.test.hachion.co/support/delete/${support_id}`)
      );

      await Promise.all(deletePromises);

      // Update state
      const updatedSupport = support.filter(item => !ids.includes(item.support_id));
      setSupport(updatedSupport);
      setFilteredSupport(updatedSupport);

      // Remove from selectedIds
      setSelectedIds(prev => prev.filter(id => !ids.includes(id)));
      setSelectAll(false);

      setSuccessMessage(`✅ ${ids.length} ${ids.length === 1 ? 'support' : 'supports'} deleted successfully`);
      setErrorMessage("");

      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      console.error("Error deleting support(s):", error);
      setSuccessMessage("");
      setErrorMessage("❌ Failed to delete support(s)");
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const handleDateFilter = () => {
    const filtered = support.filter((item) => {
      const videoDate = new Date(item.date);
      const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
      const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

      return (
        (!start || videoDate >= start) &&
        (!end || videoDate <= end)
      );
    });

    setFilteredSupport(filtered);
    // Reset selection on filter
    setSelectedIds([]);
    setSelectAll(false);
  };

  const handleDateReset = () => {
    setStartDate(null);
    setEndDate(null);
    setFilteredSupport(support);
    // Reset selection on reset
    setSelectedIds([]);
    setSelectAll(false);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `https://api.test.hachion.co/support/update/${editedData.support_id}`, editedData
      );
      setSupport((prev) =>
        prev.map(curr =>
          curr.support_id === editedData.support_id ? response.data : curr
        )
      );
      setFilteredSupport((prev) =>
        prev.map(curr =>
          curr.support_id === editedData.support_id ? response.data : curr
        )
      );
      
      // Remove from selectedIds if present
      setSelectedIds(prev => prev.filter(id => id !== editedData.support_id));

      setSuccessMessage("Support Details updated successfully!");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 5000);
      setOpen(false);
    } catch (error) {
      setErrorMessage("Error updating Support details");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  useEffect(() => {
    const filtered = support.filter(support =>
      support.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      support.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      support.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSupport(filtered);
    // Reset selection on search
    setSelectedIds([]);
    setSelectAll(false);
  }, [searchTerm, support]);

  const handleClickOpen = (row) => {
    console.log(row);
    setEditedData(row);
    setOpen(true);
  };

  const handleChange = (e) => {
    console.log(e.target.name, e.target.value);
    setSupportData({
      ...supportData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentDate = new Date().toISOString().split("T")[0];
    const dataToSubmit = {
      ...supportData,
      date: currentDate,
    };

    try {
      const response = await axios.post("https://api.test.hachion.co/support/add", dataToSubmit);
      if (response.status === 200) {
        setSuccessMessage("Support added successfully");
        setErrorMessage("");
        
        // Add new support to the list
        const newSupport = response.data;
        setSupport(prev => [newSupport, ...prev]);
        setFilteredSupport(prev => [newSupport, ...prev]);
        
        handleReset();
        setShowAddCourse(false);
        
        setTimeout(() => setSuccessMessage(""), 5000);
      }
    } catch (error) {
      console.error("Error adding support:", error.message);
      setErrorMessage("Error adding support.");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const handleAddTrendingCourseClick = () => {
    setShowAddCourse(true);
  }

  return (
    <>
      {showAddCourse ? (
        <div className='course-category'>
          <h3>Support</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#!" onClick={() => setShowAddCourse(false)}>Support Details</a> <MdKeyboardArrowRight />
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Add Support
              </li>
            </ol>
          </nav>
          <div className='category'>
            <div className='category-header'>
              <p style={{ marginBottom: 0 }}>Add Support</p>
            </div>

            <div className="course-row">
              <div className="col">
                <label className='form-label'>Name</label>
                <input type="text" className="schedule-input" placeholder="Enter Name" aria-label="First name"
                  name='name' value={supportData.name} onChange={handleChange} />
              </div>
              <div className="col">
                <label className='form-label'>Mobile</label>
                <input type="number" className="schedule-input" placeholder="Enter Mobile" aria-label="First name"
                  name='mobile' value={supportData.mobile} onChange={handleChange} />
              </div>
            </div>

            <div className='course-row'>
              <div className="col">
                <label className='form-label'>Email</label>
                <input type="email" className="schedule-input" placeholder="Enter Title" aria-label="First name"
                  name='email' value={supportData.email} onChange={handleChange} />
              </div>
              <div className="col">
                <label className='form-label'>Password</label>
                <input type="password" className="schedule-input" placeholder="Enter Title" aria-label="First name"
                  name='password' value={supportData.password} onChange={handleChange} />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="exampleFormControlTextarea1" className="form-label">Address</label>
              <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"
                name='address' value={supportData.address} onChange={handleChange}></textarea>
            </div>

            <div className="course-row">
              <button className='submit-btn' onClick={handleSubmit}>Submit</button>
              <button className='reset-btn' onClick={handleReset}>Reset</button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className='course-category'>
              <h3>Support</h3>
              <div className='category'>
                <div className='category-header'>
                  <p style={{ marginBottom: 0 }}>Support Details</p>
                </div>
                
                {/* ADD: Success and Error Messages */}
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
                  <button className='filter' onClick={handleDateFilter} >Filter</button>
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
                      <button className="btn-search" type="submit"  ><IoSearch style={{ fontSize: '2rem' }} /></button>
                    </div>
                    
                    {/* ADD: Bulk Delete Button */}
                    {selectedIds.length > 0 && (
                      <button
                        type="button"
                        className="btn-category"
                        onClick={() => handleDeleteConfirmation()}
                        style={{ 
                          backgroundColor: '#dc3545', 
                          marginRight: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <RiDeleteBin6Line /> Delete Selected ({selectedIds.length})
                      </button>
                    )}
                    
                    <button type="button" className="btn-category" onClick={handleAddTrendingCourseClick} >
                      <FiPlus /> Add Support
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
                  {/* ADD: Select All Checkbox */}
                  <StyledTableCell sx={{ width: 70 }} align="center">
                    <Checkbox
                      checked={selectAll}
                      onChange={handleSelectAll}
                      indeterminate={selectedIds.length > 0 && selectedIds.length < displayedCourse.length}
                    />
                  </StyledTableCell>
                  <StyledTableCell sx={{ width: 80 }} align='center'>S.No.</StyledTableCell>
                  <StyledTableCell align='center'>Name</StyledTableCell>
                  <StyledTableCell align='center'>Email</StyledTableCell>
                  <StyledTableCell align="center">Password</StyledTableCell>
                  <StyledTableCell align="center">Mobile</StyledTableCell>
                  <StyledTableCell align="center">Address</StyledTableCell>
                  <StyledTableCell align="center">Created Date</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedCourse.length > 0
                  ? displayedCourse.map((row, index) => (
                    <StyledTableRow key={row.support_id}>
                      {/* ADD: Individual Checkbox */}
                      <StyledTableCell align="center">
                        <Checkbox
                          checked={selectedIds.includes(row.support_id)}
                          onChange={() => handleSelectOne(row.support_id)}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">{index + 1 + (currentPage - 1) * rowsPerPage}
                      </StyledTableCell>
                      <StyledTableCell align="center">{row.name}</StyledTableCell>
                      <StyledTableCell align="center">{row.email}</StyledTableCell>
                      <StyledTableCell align="center">{row.password}</StyledTableCell>
                      <StyledTableCell align="center">{row.mobile}</StyledTableCell>
                      <StyledTableCell align="center">{row.address}</StyledTableCell>
                      <StyledTableCell align="center">{row.date ? dayjs(row.date).format('MMM-DD-YYYY').toUpperCase() : 'N/A'}</StyledTableCell>
                      <StyledTableCell align="center">
                        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                          <FaEdit className="edit" onClick={() => handleClickOpen(row)} />
                          <RiDeleteBin6Line
                            className="delete"
                            onClick={() => handleDeleteConfirmation(row.support_id)}
                          />
                        </div>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                  : (
                    <StyledTableRow>
                      {/* UPDATED: Changed colSpan from 9 to 10 to include checkbox column */}
                      <StyledTableCell colSpan={10} align="center">
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
              totalRows={filteredSupport.length}
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
        <div >
          <DialogTitle className="dialog-title" id="edit-schedule-dialog">Edit Support
            <Button onClick={handleClose} className="close-btn">
              <IoMdCloseCircleOutline style={{ color: "white", fontSize: "2rem" }} />
            </Button>
          </DialogTitle>
        </div>
        <DialogContent>
          <div className="course-row">
            <div className="col">
              <label className='form-label'>Name</label>
              <input type="text" className="schedule-input" aria-label="First name" name='name' value={editedData.name} onChange={handleInputChange} />
            </div>
            <div className="col">
              <label className='form-label'>Mobile</label>
              <input type="number" className="schedule-input" aria-label="First name" name='mobile' value={editedData.mobile} onChange={handleInputChange} />
            </div>
          </div>

          <div className="course-row">
            <div className="col">
              <label className='form-label'>Email</label>
              <input type="text" className="schedule-input" aria-label="First name" name='email' value={editedData.email} onChange={handleInputChange} />
            </div>
            <div className="col">
              <label className='form-label'>Password</label>
              <input type="password" className="schedule-input" aria-label="First name" name='password' value={editedData.password} onChange={handleInputChange} />
            </div>
          </div>
          <div className="col">
            <label className='form-label'>Address</label>
            <input type="text" className="form-control" aria-label="First name" name='address' value={editedData.address} onChange={handleInputChange} />
          </div>
        </DialogContent>
        <DialogActions className="update" style={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={handleSave} className="update-btn">Update</Button>
        </DialogActions>
      </Dialog>
    </>);
}