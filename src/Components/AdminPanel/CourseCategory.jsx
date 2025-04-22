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
    borderRight: '1px solid white', // Add vertical lines
    position: 'sticky',             // Make header sticky
    top: 0,                         // Stick to the top of the container
    zIndex: 1,         
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
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
const CourseCategory = ({
  pageTitle = "Course Category",
  headerTitle = "View Course Category List",
  buttonLabel = "Add Category",
  onAddCategoryClick
}) => {
  const [categories, setCategories] = useState([]);
  const [message,setMessage]=useState("");
  const [open, setOpen] = React.useState(false);
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showAddCourse,setShowAddCourse]=useState(false);
const [editedRow, setEditedRow] = useState({name:"",date:""})
const [courseData, setCourseData] = useState([{
    name:"",
      date:""
   }]);
   const [currentPage, setCurrentPage] = useState(1);
   const [rowsPerPage, setRowsPerPage] = useState(10);
   
   const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, window.scrollY);
  };
  // Inside your CourseCategory component

const handleRowsPerPageChange = (rows) => {
  setRowsPerPage(rows);
  setCurrentPage(1); // Reset to the first page whenever rows per page changes
};

// Slice filteredCategories based on rowsPerPage and currentPage
const displayedCategories = filteredCategories.slice(
  (currentPage - 1) * rowsPerPage,
  currentPage * rowsPerPage
);


  const API_URL = '/HachionUserDashboad/course-categories/all';

  // Fetch Courses on Component Mount
  useEffect(() => {
    fetchCourses();
  }, [categories]);
  const handleClose = () => {
    setOpen(false); // Close the modal
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
      date: course.date ? dayjs(course.date).format('MM-DD-YYYY') : null, // Convert date to dayjs if it exists
    });
    setOpen(true);
  };
  
  const formattedDate = courseData.date ? dayjs(courseData.date).format('MM-DD-YYYY') : null;
  
  const handleFilter = () => {
    let filteredData = categories;

    if (startDate) {
      filteredData = filteredData.filter(category =>
        new Date(category.date) >= new Date(startDate)
      );
    }
    if (endDate) {
      filteredData = filteredData.filter(category =>
        new Date(category.date) <= new Date(endDate)
      );
    }
    if (searchTerm) {
      filteredData = filteredData.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCategories(filteredData);
  };

 
  const handleSubmit = async () => {
    try {
      const response = await axios.post("/HachionUserDashboad/course-categories/add", {
        name: courseData.category_name,
        date: dayjs(courseData.date).format("YYYY-MM-DD"),
      });

      if (response.status === 200) {
        alert("Category added successfully");
        setCategories((prev) => [...prev, response.data]);
        setCourseData({ name: "", date: null });
      }
    } catch (error) {
      console.error("Error adding category:", error.message);
      alert("Error adding category.");
    }
  };
  const handleEdit = async () => {
    try {
        const response = await axios.put(
            `/HachionUserDashboad/course-categories/update/${editedRow.id}`,
            editedRow
        );
        setCategories((prev) =>
            prev.map(curr =>
                curr.id === editedRow.id ? response.data : curr
            )
        );
        setMessage("Course updated successfully!");
        setTimeout(() => setMessage(""), 5000);
        setOpen(false);
    } catch (error) {
        setMessage("Error updating Courses.");
    }
};

  const handleDelete = async (id) => {
       
    try { 
     const response = await axios.delete(`/HachionUserDashboad/course-categories/delete/${id}`); 
     console.log("Course category deleted successfully:", response.data); 
   } catch (error) { 
     console.error("Error deleting Video:", error); 
   } }; 
   const handleDeleteConfirmation = (id) => {
    if (window.confirm("Are you sure you want to delete this Course Category?")) {
      handleDelete(id);
    }
  };

  const handleAddTrendingCourseClick = () => setShowAddCourse(true);
  
  return (<>
    {showAddCourse?(<>
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
            <p>Add Category</p>
          </div>
          <div className="date-schedule" style={{ display: "flex", flexDirection: "column" }}>
            <div className="mb-3">
              <label htmlFor="categoryName" className="form-label">
                Category Name
              </label>
              <input
                type="text"
                className="form-control"
                id="categoryName"
                placeholder="Enter Category name"
                value={courseData.category_name}
                onChange={(e) =>
                  setCourseData({ ...courseData, category_name: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              Date <br />
              <DatePicker
                value={courseData.date}
                onChange={(newDate) =>
                  setCourseData({ ...courseData, date: newDate })
                }
                sx={{
                  '& .MuiInputBase-root': {
                    width: '350px',
                  }, '& .MuiIconButton-root':{color: '#00aeef'}
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <button className="submit-btn" onClick={handleSubmit}>
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
   </>):(<LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='course-category'>
        <h3>{pageTitle}</h3>
        <div className='category'>
          <div className='category-header'>
            <p>{headerTitle}</p>
          </div>
          <div className='date-schedule'>
            Start Date
            <DatePicker value={startDate} onChange={(newDate) => setStartDate(newDate)} 
              sx={{
                 '& .MuiIconButton-root':{color: '#00aeef'}
              }}/>
            End Date
            <DatePicker value={endDate} onChange={(newDate) => setEndDate(newDate)} 
              sx={{
                 '& .MuiIconButton-root':{color: '#00aeef'}
              }}/>
            <button className='filter' onClick={handleFilter}>Filter</button>
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
              <div className="search">
              <div className="search-div" role="search" style={{ border: '1px solid #d3d3d3' }}>
                <input
                  className="search-input"
                  type="search"
                  placeholder="Enter Courses, Category or Keywords"
                  aria-label="Search"
                  value={searchTerm}
                  
                />
                <button className="btn-search" onClick={handleFilter} type="button">
                  <IoSearch />
                </button>
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
          {course.date ? dayjs(course.date).format('MM-DD-YYYY') : 'N/A'}</StyledTableCell>
          <StyledTableCell align="center" style={{ width: 220, }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
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
  totalRows={filteredCategories.length} // Use the full list for pagination
  onPageChange={handlePageChange}
/>
          </div>
      {message && <div className="success-message">{message}</div>}
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
    }, '& .MuiIconButton-root':{color: '#00aeef'}
  }}
/>
            </div>

 </LocalizationProvider>

  </DialogContent>
  <DialogActions className="update" style={{ display: 'flex', justifyContent: 'center' }}>
    <Button onClick={handleEdit} className="update-btn">Update</Button>
  </DialogActions>
</Dialog>

    </>);
};



export default CourseCategory;