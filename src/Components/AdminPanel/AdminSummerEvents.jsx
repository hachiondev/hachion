import  React, { useEffect } from 'react';
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


export default function AdminSummerEvents() {
  const [category,setCategory]=useState([]);
  const [course,setCourse]=useState([]); 
  const [searchTerm,setSearchTerm]=useState("")
  const [showAddCourse, setShowAddCourse] = useState(false);
  const[summerCourse,setSummerCourse]=useState([]);
  const[filteredCourse,setFilteredCourse]=useState([])
  const[filterCourse,setFilterCourse]=useState([]); 
  const [open, setOpen] = React.useState(false);
  const currentDate = new Date().toISOString().split('T')[0];
  const[message,setMessage]=useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [editedData, setEditedData] = useState({title:"",category_name:"",course_name:"",status:false, titleStatus:true, summerevents_id:""});
  const [courseData, setCourseData] = useState({
      summerevents_id:"",
      title:"",
      category_name:"",
      course_name: "",
      date:currentDate,
      status:false,
      titleStatus:true
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [status, setStatus] = useState(false);

  
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
      titleStatus: e.target.checked,
    }));
  };

  const handleInputStatusChange = (e) => {
    setEditedData((prevData) => ({
      ...prevData,
      status: e.target.checked,
      titleStatus: e.target.checked,
    }));
  };

  
  const displayedCourse = filteredCourse.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleReset=()=>{
    setCourseData({
      summerevents_id:"",
      title:"",
      category_name:"",
      course_name: "",
      date:currentDate,
      status:false,
      titleStatus:true
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
        const response = await axios.get('https://api.test.hachion.co/summerevents');
        setSummerCourse(response.data); 
        setFilteredCourse(response.data || []);
      } catch (error) {
        console.error("Error fetching video:", error.message);
      }
    };
    fetchCourse();
  }, []); 

  const handleDeleteConfirmation = (summerevents_id) => {
    if (window.confirm("Are you sure you want to delete this Course?")) {
      handleDelete(summerevents_id);
    }
  };

  const handleDateFilter = () => {
    const filtered = summerCourse.filter((item) => {
      const videoDate = new Date(item.date); 
      const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
      const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
  
      return (
        (!start || videoDate >= start) &&
        (!end || videoDate <= end)
      );
    });
  
    setFilteredCourse(filtered);
    setCurrentPage(1);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `https://api.test.hachion.co/summerevents/update/${editedData.summerevents_id}`,editedData
      );
      setSummerCourse((prev) =>
        prev.map(curr =>
          curr.summerevents_id === editedData.summerevents_id ? response.data : curr
        )
      );
      setMessage("Summer Course updated successfully!");
      setTimeout(() => setMessage(""), 5000);
      setOpen(false);
      setEditCourseOptions([]);
    } catch (error) {
      setMessage("Error updating Courses.");
    }
  };
          
  const handleDelete = async (summerevents_id) => {
    try { 
      const response = await axios.delete(`https://api.test.hachion.co/summerevents/delete/${summerevents_id}`); 
      console.log("Summer Courses deleted successfully:", response.data); 
    } catch (error) { 
      console.error("Error deleting Courses:", error); 
    } };

  
  useEffect(() => {
    const filtered = summerCourse.filter(summerCourse =>
      summerCourse.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      summerCourse.category_name.toLowerCase().includes(searchTerm.toLowerCase()) 
    );
    setFilteredCourse(filtered);
    setCurrentPage(1);
  }, [searchTerm, summerCourse]);
        
  
  const handleClickOpen = async (row) => {
    setEditedData({
      summerevents_id: row.summerevents_id,
      title: row.title || "",
      category_name: row.category_name || "",
      course_name: row.course_name || "",
      status: row.status ?? false,
      titleStatus: row.titleStatus ?? true
    });
    if (row.category_name) {
      const names = await fetchCourseNamesByCategory(row.category_name);
      setEditCourseOptions(names);
    } else {
      setEditCourseOptions([]);
    }
    setOpen(true); 
  };

  
  useEffect(() => {
    let ignore = false;
    (async () => {
      if (open && editedData.category_name) {
        const names = await fetchCourseNamesByCategory(editedData.category_name);
        if (!ignore) setEditCourseOptions(names);
      } else if (open && !editedData.category_name) {
        setEditCourseOptions([]);
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
      const response = await axios.post("https://api.test.hachion.co/summerevents/add", dataToSubmit);
      if (response.status === 201) {
        alert(response.data);
        setCourseData([...courseData, dataToSubmit]); 
        handleReset(); 
      }
    } catch (error) {
      console.error("Error adding courses:", error.message);
    }
  };

  const handleAddSummerCourseClick = () => {setShowAddCourse(true)}

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
  setFilteredCourse(summerCourse);
  setCurrentPage(1);
};

  return (
    
    <>  
     {showAddCourse ?  (
      <div className='course-category'>
        <h3>Kids Courses</h3>
        <nav aria-label="breadcrumb">
                      <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                        <a href="#!" onClick={() => setShowAddCourse(false)}>Kids Courses</a> <MdKeyboardArrowRight />
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                        Add Kids Course
                        </li>
                      </ol>
                    </nav>

              <div className="category">
                  <div className="category-header">
                    <p style={{ marginBottom: 0 }}>Enable/Disable Kids Component</p>
                  </div>
            <div className='course-details'>
            <div className='course-row'>
            <div className="col-md-3">
                  <label className="form-label">Kids Title</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="Enter Title"
                    value={courseData.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col" style={{ display: 'flex', gap: 20 }}> 
                  <label className="form-label">Title Status:</label>
                  <Switch
                    checked={courseData?.titleStatus ?? true}
                    onChange={handleStatusChange}
                    color="primary"
                  />
                  <span>{courseData?.titleStatus ? 'Enable' : 'Disable'}</span>
                </div>
              </div>
            </div>
          </div>
    <div className="category">
      <div className="category-header">
        <p style={{ marginBottom: 0 }}>Add Kids Course</p>
      </div>
      <div className='course-details'>
        <div className='course-row'>
          <div className="col-md-3">
            <label htmlFor="inputState" className="form-label">Category Name</label>
            <select id="inputState" className="form-select" name='category_name' value={courseData.category_name} onChange={handleChange}>
              <option value="" disabled>
                Select Category
              </option>
              {category.map((curr) => (
                <option key={curr.id} value={curr.name}>
                  {curr.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label htmlFor="inputState" className="form-label">Course Name</label>
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
          <button className='submit-btn' data-bs-toggle='modal'
            data-bs-target='#exampleModal' onClick={handleSubmit}>Submit</button>
          <button className='reset-btn' onClick={handleReset}>Reset</button>
        </div>
      </div>
    </div>
</div>

):(<div>
   <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='course-category'>
      <h3>Kids Courses</h3>
        <div className='category'>
          <div className='category-header'>
            <p style={{ marginBottom: 0 }}>Kids Course Details</p>
          </div>
          <div className='date-schedule'>
            Start Date
            <DatePicker 
              selected={startDate} 
              onChange={(date) => setStartDate(date)} 
              isClearable 
              sx={{'& .MuiIconButton-root':{color: '#00aeef'}}}
            />
            End Date
            <DatePicker 
              selected={endDate} 
              onChange={(date) => setEndDate(date)} 
              isClearable 
              sx={{'& .MuiIconButton-root':{color: '#00aeef'}}}
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
                  onChange={(e) => setSearchTerm(e.target.value)}/>
                <button className="btn-search" type="submit"  ><IoSearch style={{ fontSize: '2rem' }} /></button>
              </div>
              <button type="button" className="btn-category" onClick={handleAddSummerCourseClick} >
                <FiPlus /> Add Kids Course
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
            <Checkbox
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
            <StyledTableRow key={row.summerevents_id}>
              <StyledTableCell align="center">
                          <Checkbox />
                        </StyledTableCell>
              <StyledTableCell align="center">{index + 1 + (currentPage - 1) * rowsPerPage}
              </StyledTableCell>
              <StyledTableCell align="left">{row.category_name}</StyledTableCell>
              <StyledTableCell align="left">{row.course_name}</StyledTableCell>
              <StyledTableCell align="center">
                {row.status ? "Enabled" : "Disabled"}
              </StyledTableCell>
              <StyledTableCell align="center">{row.date}</StyledTableCell>
              <StyledTableCell align="center">
              <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
                <FaEdit className="edit" onClick={() => handleClickOpen(row)} />
                <RiDeleteBin6Line
                  className="delete"
                  onClick={() => handleDeleteConfirmation(row.summerevents_id)}
                />
                </div>
              </StyledTableCell>
            </StyledTableRow>
          ))
          : (
            <StyledTableRow>
              <StyledTableCell colSpan={6} align="center">
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
      totalRows={filteredCourse.length} 
      onPageChange={handlePageChange}
    />
              </div>
    {message && <div className="success-message">{message}</div>}

    </div>)}

    <Dialog className="dialog-box" open={open} onClose={handleClose} aria-labelledby="edit-schedule-dialog"
    PaperProps={{
      style: { borderRadius: 20 },
    }}>
  <div >
    <DialogTitle className="dialog-title" id="edit-schedule-dialog">Edit Kids Course
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
          setEditedData((prev) => ({ ...prev, course_name: "" })); 
        }}
      >
         <option value="" disabled>
          Select Category
        </option>
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
        <option value="" disabled>
          {editedData.category_name ? 'Select Course' : 'Select Category first'}
        </option>
        {editCourseOptions.length > 0 ? (
          editCourseOptions.map((current) => (
            <option key={current.id} value={current.courseName}>
              {current.courseName}
            </option>
          ))
        ) : (
          editedData.category_name ? <option disabled>Loading...</option> : null
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

   
   
 </> );
}
