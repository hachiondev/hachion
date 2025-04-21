// import React from 'react'

// function WorkshopSchedule() {
//   return (
//     <div>WorkshopSchedule</div>
//   )
// }

// export default WorkshopSchedule


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
import dayjs from 'dayjs';
import { RiCloseCircleLine } from 'react-icons/ri';
import success from '../../Assets/success.gif';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { IoSearch } from "react-icons/io5";
import { FiPlus } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { IoMdCloseCircleOutline } from "react-icons/io";
import axios from 'axios';
import { MdKeyboardArrowRight } from 'react-icons/md';
import './Admin.css'; 
import AdminPagination from './AdminPagination'; 
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#00AEEF',
    color: theme.palette.common.white,
    borderRight: '1px solid white', // Add vertical lines
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

export default function WorkshopSchedule() {
 const[courses,setCourses]=useState([]);
 const[category,setCategory]=useState([]);
 const[courseCategory,setCourseCategory]=useState([]);
  const [error,setError]=useState([]);
  const [filteredCourses,setFilteredCourses]=useState([courses]);
  const[filterCourse,setFilterCourse]=useState([]);
  const [open, setOpen] = React.useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const[message,setMessage]=useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [editedRow, setEditedRow] = useState({bannerImage:null,category_name:"",course_name:"",date:null,time:null,time_zone:"",content:"",details:""});
  const [selectedRow, setSelectedRow] = React.useState({bannerImage:null,category_name:"",course_name:"",date:"",time:"",time_zone:"",content:"",details:""});
  const currentDate = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
      bannerImage:null,
      category_name:"",
      course_name:"",
      date:"",
        time:"",
        time_zone: "",
        content:"",
        details:"",
        created_date:"",
      });
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
            
            // Slice filteredCourses based on rowsPerPage and currentPage
            const displayedCategories = filteredCourses.slice(
              (currentPage - 1) * rowsPerPage,
              currentPage * rowsPerPage
            );
    const [selectedTime, setSelectedTime] = useState(null);
    const [rows, setRows] = useState([{ id:"", time: "", time_zone: ""}]);


const handleDateChange = (newValue) => {
  const parsedDate = dayjs(newValue); // Ensure proper parsing
  
  if (!parsedDate.isValid()) { // Validate the date
    console.error("Invalid date:", newValue);
    return;
  }

  setFormData((prevData) => ({
    ...prevData,
    date: parsedDate.format('YYYY-MM-DD'), // Format the date
  }));
};
useEffect(() => {
  const fetchCategory = async () => {
    try {
      const response = await axios.get("/HachionUserDashboad/course-categories/all");
      setCategory(response.data); // Assuming the data contains an array of trainer objects
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };
  fetchCategory();
}, []);
useEffect(() => {
  const fetchCourseCategory = async () => {
    try {
      const response = await axios.get("/HachionUserDashboad/courses/all");
      setCourseCategory(response.data); // Assuming the data contains an array of trainer objects
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };
  fetchCourseCategory();
}, []);
useEffect(() => {
  if (formData.category_name) {
    const filtered = courseCategory.filter(
      (course) => course.courseCategory === formData.category_name
    );
    setFilterCourse(filtered);
  } else {
    setFilterCourse([]); // Reset when no category is selected
  }
}, [formData.category_name]);

// Handle time change
const handleTimeChange = (newValue) => {
  setFormData((prevData) => ({
    ...prevData,
    time: newValue ? dayjs(newValue).format('hh:mm A') : null,
  }));
};

// const handleChange = (e) => {
//   const { name, value } = e.target;
//   setformData((prevData) => ({
//     ...prevData,
//     [name]: value,
//   }));
// };
// const handleChange = (e) => {
//   const { name, value } = e.target;
//   setFormData((prev) => ({
//     ...prev,
//     [name]: value
//   }));
// };

const handleChange = (e, quillField = null, quillValue = null) => {
  setFormData((prevData) => {
    let { name, value } = e?.target || {};

    // Handle ReactQuill input separately
    if (quillField) {
      name = quillField;
      value = quillValue.trim() === "" || quillValue === "<p><br></p>" ? "" : quillValue;
    }

    return { ...prevData, [name]: value };
  });
};

  const handleReset = () => {
    setFormData({
      bannerImage:null,
      category_name: "",
      course_name:"",
      time:"",
      time_zone: "",
      date:"",
      content:"",
      details:"",
      created_date: ""
    });
  };
 const handleSubmit = async (e) => {
    e.preventDefault();
  
    const currentDate = new Date().toISOString().split("T")[0];
  
    // Construct your JSON object
    const updatedFormData = {
      category_name: formData.category_name,
      course_name: formData.course_name || "Salesforce",
      time: formData.time,
      date: formData.date,
      time_zone: formData.time_zone || "GMT",
      content: formData.content || "",
      details: formData.details || "",
      created_date: currentDate,
    };
  
    // Construct FormData for multipart
    const formDataToSend = new FormData();
    formDataToSend.append("workshop", JSON.stringify(updatedFormData)); // send JSON as 'workshop'
  
    if (formData.bannerImage) {
      formDataToSend.append("bannerImage", formData.bannerImage); // only add if exists
    }
  
    try {
      const response = await axios.post(
        "/HachionUserDashboad/workshopschedule/add",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      alert("Form submitted successfully!");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error.response ? error.response.data : error.message);
      alert("Something went wrong. Please try again.");
    }
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
 
  const handleDateFilter = () => {
    const filtered = courses.filter((course) => {
      const courseDate = new Date(course.date); // Ensure schedule_date is parseable
      return (
        (!startDate || courseDate >= new Date(startDate)) &&
        (!endDate || courseDate <= new Date(endDate))
      );
    });
  
    setCourses(filtered);
  };

useEffect(() => {
  const fetchCourse = async () => {
    try {
      const response = await axios.get('/HachionUserDashboad/workshopschedule');
      setCourses(response.data);
      setFilteredCourses(response.data);
    //   setFilteredTrainers(response.data); // Set initial filtered categories to all data
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };
  fetchCourse();
}, []);
useEffect(() => {
  const filtered = courses.filter((course) =>
    course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  setFilteredCourses(filtered)

}, [searchTerm,filteredCourses]);
const startIndex = (currentPage -1) * rowsPerPage;
const paginatedData = filteredCourses.slice(startIndex, startIndex + rowsPerPage);
const pageCount = Math.ceil(filteredCourses.length / rowsPerPage);

const handleDeleteConfirmation = (id) => {

  if (window.confirm("Are you sure you want to delete this course?")) {
    console.log("Deleting ID:", id); // Debugging line
    handleDelete(id);
  }
};

const handleDelete = async (id) => {
  try {
    if (!id) {
      console.error("Error: ID is undefined or null");
      return;
    }

    const response = await axios.delete(`/HachionUserDashboad/workshopschedule/delete/${id}`);
    console.log("Courses deleted successfully:", response.data);
  } catch (error) {
    console.error("Error deleting workshop:", error.response ? error.response.data : error.message);
  }
};

  const handleAddTrendingCourseClick = () => setShowAddCourse(true);

const handleClickOpen = (row) => {
console.log(row);
  setSelectedRow(row); 
  setEditedRow(row)// Set the selected row data
  setOpen(true); // Open the modal
 
};

const handleClose = () => {
  setOpen(false); // Close the modal
};
const handleCloseModal=()=>{
  setShowAddCourse(false);
 
}
const handleSave = async () => {
  try {
    const formDataToSend = new FormData();

    // Add the updated JSON data as a string
    formDataToSend.append("workshop", JSON.stringify(editedRow));

    // If a new banner image is selected, add it
    if (editedRow.bannerImage) {
      formDataToSend.append("bannerImage", editedRow.bannerImage);
    }

    const response = await axios.put(
      `/HachionUserDashboad/workshopschedule/update/${selectedRow.id}`,
      formDataToSend,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Update only the edited row in the courses state
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === selectedRow.id ? response.data : course
      )
    );

    setMessage(true);
    setTimeout(() => {
      setMessage(false);
    }, 5000);

    setOpen(false); // Close the dialog
  } catch (error) {
    console.error("Error updating workshop:", error.response?.data || error.message);
  }
};

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setEditedRow((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }], 
    [{ indent: "-1" }, { indent: "+1" }], 
    ["blockquote"],
    ["image"],
    ["link"], 
    [{ color: [] }], 
    ["clean"],
  ],
};

// const handleCourseChange = (event) => setCourse(event.target.value);
  return (
    
    <>   
       {showAddCourse ?  
     (  <>       <div style={{ flexGrow: 1, padding: '20px' }}>
        
      
        <div className='course-category'>
        <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                <a href="#!" onClick={() => setShowAddCourse(false)}> Workshop Schedule </a> <MdKeyboardArrowRight />
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                Add Workshop Schedule
                </li>
              </ol>
            </nav>
      <div className='category'>
      <div className='category-header'>
      <p>Add Workshop Schedule</p>
      </div>
      <div className='course-details'>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='course-row'>
      <div class="col-md-3">
          <label for="inputState" class="form-label">Category Name</label>
          <select id="inputState" class="form-select" name='category_name' value={formData.category_name} onChange={handleChange}>
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
        <label htmlFor="course" className="form-label">Course Name</label>
        <select
          id="course"
          className="form-select"
          name="course_name"
          value={formData.course_name}
          onChange={handleChange}
          disabled={!formData.category_name}
        >
          <option value="" disabled>Select Course</option>
          {filterCourse.map((curr) => (
            <option key={curr.id} value={curr.courseName}>{curr.courseName}</option>
          ))}
        </select>
      </div>

      <div className="col-md-3">
                <label className="form-label">Banner Image (width=1440px, height=420px)</label>
                <input
                  type="file"
                  className="schedule-input"
                  accept="image/*"
                  name="bannerImage"
                  onChange={(e) =>
                    setFormData({ ...formData, bannerImage: e.target.files[0] })
                  }
                  
                />
              </div>
        </div>
        
        <div className='course-row d-flex align-items-center'>
      <div className='col'>
        <label className="form-label d-block">Date</label>
        <DatePicker
                        value={formData.date ? dayjs(formData.date) : null}
                        onChange={(newValue) => handleDateChange(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                        sx={{
                         '& .MuiIconButton-root':{color: '#00aeef'}
                        }}                
                      />
      </div>

      {/* Time Field (12-hour format) */}
      <div className="col">
        <label className="form-label d-block">Time</label>
        <DemoContainer components={['TimePicker']}>
                        <TimePicker
                          label="Select Time"
                          ampm={true}
                          value={formData.time ? dayjs(formData.time, 'hh:mm A') : null}
                          onChange={handleTimeChange}
                          renderInput={(params) => <TextField {...params} />}
                          sx={{
                            '& .MuiIconButton-root':{color: '#00aeef'}
                          }}
                        />
                      </DemoContainer>
      </div>

      {/* Time Zone Field */}
      <div className="col">
        <label className="form-label d-block">Time Zone</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Time Zone"
          name="time_zone"
          value={formData.time_zone || "EST"}
          onChange={handleChange}
        />
      </div>
      </div>
      </LocalizationProvider>
      {/* <label className="form-label d-block">Key Takeaways</label>
        <input type='text' placeholder='enter content' name='content' value={formData.content} onChange={handleChange}/> */}
        
        <div className='course-row' style={{ paddingBottom: "20px" }}>
         <div class="mb-3" style={{ paddingBottom: "20px" }}>
         <label for="exampleFormControlTextarea1" class="form-label">Key Takeaways</label>
           <ReactQuill
             theme="snow"
             id="content"
             name="content"
             value={formData.content}
             onChange={(value) => handleChange(null, "content", value)}
           style={{ height: "500px" }} // Increased editor height
           modules={{
            toolbar: [
              [{ header: [1, 2, 3, 4, 5, 6, false] }], // Paragraph & heading options
              ["bold", "italic", "underline"], // Text formatting
              [{ list: "ordered" }, { list: "bullet" }], // Bullet points & numbering
              [{ align: [] }], // Text alignment
              [{ indent: "-1" }, { indent: "+1" }], // Indentation
              ["blockquote"], // Blockquote for paragraph formatting
              ["image"],
              ["link"], // Insert links
              [{ color: [] }], // Full color picker
              ["clean"], // Remove formatting
            ],
          }}
          formats={[
            "header",
            "bold",
            "italic",
            "underline",
            "list",
            "bullet",
            "align",
            "indent",
            "blockquote",
            "image",
            "link",
            "color",
          ]}
        />
         {error && <p className="error-message">{error}</p>}
         </div> 
         
         <div class="mb-3" style={{ paddingBottom: "20px" }}>
         <label for="exampleFormControlTextarea1" class="form-label">Workshop Details</label>
           <ReactQuill
             theme="snow"
             id="details"
             name="details"
             value={formData.details}
             onChange={(value) => handleChange(null, "details", value)}
           style={{ height: "500px" }} // Increased editor height
           modules={{
            toolbar: [
              [{ header: [1, 2, 3, 4, 5, 6, false] }], // Paragraph & heading options
              ["bold", "italic", "underline"], // Text formatting
              [{ list: "ordered" }, { list: "bullet" }], // Bullet points & numbering
              [{ align: [] }], // Text alignment
              [{ indent: "-1" }, { indent: "+1" }], // Indentation
              ["blockquote"], // Blockquote for paragraph formatting
              ["image"],
              ["link"], // Insert links
              [{ color: [] }], // Full color picker
              ["clean"], // Remove formatting
            ],
          }}
          formats={[
            "header",
            "bold",
            "italic",
            "underline",
            "list",
            "bullet",
            "align",
            "indent",
            "blockquote",
            "image",
            "link",
            "color",
          ]}
         />
         {error && <p className="error-message">{error}</p>}
         </div> 
         </div>
          
          <div className="course-row">
        <button className='submit-btn' data-bs-toggle='modal'
                  data-bs-target='#exampleModal' onClick={handleSubmit}>Submit</button>
        <button className='reset-btn' onClick={handleReset}>Reset</button>
      </div>
      </div>
      </div>
   </div>
   </div>
      </>
    
):(<div>
   <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='course-category'>
        <p>Workshop Schedule</p>
        <div className='category'>
          <div className='category-header'>
            <p>View Workshop Schedule</p>
          </div>
          <div className='date-schedule'>
            Start Date
            <DatePicker 
    selected={startDate} 
    onChange={(date) => setStartDate(date)} 
    isClearable 
    sx={{
       '& .MuiIconButton-root':{color: '#00aeef'}
    }}
  />
            End Date
            <DatePicker 
    selected={endDate} 
    onChange={(date) => setEndDate(date)} 
    isClearable 
    sx={{
      '& .MuiIconButton-root':{color: '#00aeef'}
    }}
  />
            <button className='filter' onClick={handleDateFilter}>Filter</button>
           
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
              <button type="button" className="btn-category" onClick={handleAddTrendingCourseClick}>
                <FiPlus /> Add Workshop Schedule
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
            <StyledTableCell align="center" sx={{width: '50px'}}>
              <Checkbox />
            </StyledTableCell>
            <StyledTableCell align="center">S.No.</StyledTableCell>
            <StyledTableCell align="center">Banner Image</StyledTableCell>
            <StyledTableCell align="center">Category Name</StyledTableCell>
            <StyledTableCell align="center">Course Name</StyledTableCell>
            <StyledTableCell align="center">Date</StyledTableCell>
            <StyledTableCell align="center">Time</StyledTableCell>
            <StyledTableCell align="center">Key Takeaways</StyledTableCell>
            <StyledTableCell align="center">Workshop Details</StyledTableCell>
            <StyledTableCell align="center">Created Date</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {displayedCategories.length > 0 ? (
        displayedCategories.map((course, index) => (
            <StyledTableRow key={course.id}>
              <StyledTableCell align="center"><Checkbox /></StyledTableCell>
              <StyledTableCell align="center">{index + 1 + (currentPage - 1) * rowsPerPage}</StyledTableCell>
              <StyledTableCell align="center">
              {course.banner_image ? <img
                src={`/HachionUserDashboad/${course.banner_image}`} 
                    alt={`Banner`}
                    style={{ width: "100px", height: "50px" }}
                /> : 'No Banner'}
              </StyledTableCell>
              <StyledTableCell align="left">{course.category_name}</StyledTableCell>
              <StyledTableCell align="left">{course.course_name}</StyledTableCell>
              <StyledTableCell align="center">{course.date ? dayjs(course.date).format('MM-DD-YYYY') : 'N/A'}</StyledTableCell>
              <StyledTableCell align="center">{course.time} {course.time_zone}</StyledTableCell>
              <StyledTableCell align="left">
                  {course.content ? (
                      <div 
                      style={{ Width: '400px',height: '100px',
                        overflowY: 'auto', wordWrap: 'break-word', whiteSpace: 'pre-line' }}
                      dangerouslySetInnerHTML={{ __html: course.content }} />
                  ) : (
                      <p>No content is available</p>
                  )}
              </StyledTableCell>
              <StyledTableCell align="left">
                  {course.details ? (
                      <div 
                      style={{ Width: '400px',height: '100px',
                        overflowY: 'auto', wordWrap: 'break-word', whiteSpace: 'pre-line' }}
                      dangerouslySetInnerHTML={{ __html: course.details }} />
                  ) : (
                      <p>No details is available</p>
                  )}
              </StyledTableCell>
              {/* <StyledTableCell align="center">
              <div className="qa-sub-content" dangerouslySetInnerHTML={{ __html: course.content.trim() || "" }} /></StyledTableCell> */}
              {/* <StyledTableCell align="center">
              <div className="qa-sub-content" dangerouslySetInnerHTML={{ __html: course.details.trim() || "" }} /></StyledTableCell> */}
              <StyledTableCell align="center">{course.created_date ? dayjs(course.created_date).format('MM-DD-YYYY') : 'N/A'}</StyledTableCell>
              <StyledTableCell align="center">
              <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                  <FaEdit className="edit" onClick={() => handleClickOpen(course)} /> {/* Open modal on edit click */}
                  <RiDeleteBin6Line className="delete"  onClick={() => handleDeleteConfirmation(course.id)} />
                  </div>
                  </StyledTableCell>
      </StyledTableRow>
        ))
      ) : (
        <StyledTableRow>
          <StyledTableCell colSpan={11} align="center">
          No Workshop schedules available
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
          totalRows={filteredCourses.length} // Use the full list for pagination
          onPageChange={handlePageChange}
        />
                  </div>
        {message && <div className="success-message">{message}</div>}

        </div>)}

      <Dialog className="dialog-box" open={open} onClose={handleClose} aria-labelledby="edit-schedule-dialog"
          PaperProps={{
            style: { borderRadius: 20 },
          }}>
        <div className="dialog-title">
        <DialogTitle >Edit Workshop Schedule  </DialogTitle>
        <Button onClick={handleClose} className='close-btn'>
            <IoMdCloseCircleOutline style={{color:'white',fontSize:'2rem'}}/>
          </Button>
        </div>
        <DialogContent>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="course-row">
        <div className="col">
          <label htmlFor="inputState" className="form-label">Category Name</label>
          <select
            id="inputState"
            className="form-select"
            name="category_name"
            value={editedRow.category_name || ""}
            onChange={handleInputChange}
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
          <label htmlFor="inputState" className="form-label">Course Name</label>
          <select
            id="inputState"
            className="form-select"
            name="course_name"
            value={editedRow.course_name || ""}
            onChange={handleInputChange}
          >
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

        <div className="course-row">
        <div className="col">
        <label className="form-label">Banner Image</label>
        <input
          type="file"
          className="form-control"
          name="bannerImage"
          onChange={(e) =>
            setEditedRow({ ...editedRow, bannerImage: e.target.files[0] })
          }
          required
        />
        </div>

        <div className="col">
          <label className="form-label">Date</label>
       <DatePicker
                 sx={{
                   '& .MuiIconButton-root':{color: '#00aeef'}
                }}
         value={editedRow.date ? dayjs(editedRow.date) : null}
         onChange={handleDateChange}
         renderInput={(params) => <TextField {...params} />}
       />
       </div>
       </div>

       <div className="course-row">
        <div className="col">
          <label className="form-label">Time</label>
        <TimePicker
                 sx={{
                   '& .MuiIconButton-root':{color: '#00aeef'}
                }}
          // label="Select Time"
          value={editedRow.time ? dayjs(editedRow.time, 'hh:mm A') : null}
          ampm={true}
          onChange={handleTimeChange}
          renderInput={(params) => <TextField {...params} />}
          />
  </div>

  <div className="col">
    <label className="form-label">Time Zone</label>
    <input
      type="text"
      className="form-control"
      placeholder="Enter Time Zone"
      name="time_zone"
      value={editedRow.time_zone || ""}
      onChange={handleInputChange}
    />
  </div>
        </div>

        <label htmlFor="content">Key Takeaways</label>
            <ReactQuill 
              id="content"
              name="content"
              value={editedRow.content || ""}
              onChange={(value) => setEditedRow((prevData)=> ({ ...prevData, content: value }))}
              modules={quillModules}
            />

      <label htmlFor="details">Workshop Details</label>
            <ReactQuill 
              id="details"
              name="details"
              value={editedRow.details || ""}
              onChange={(value) => setEditedRow((prevData)=> ({ ...prevData, details: value }))}
              modules={quillModules}
            />

      </LocalizationProvider>
    
        </DialogContent>
        <DialogActions>
         
          <Button onClick={handleSave} className='update-btn'>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* <div
                  className='modal fade'
                  id='exampleModal'
                  tabIndex='-1'
                  aria-labelledby='exampleModalLabel'
                  aria-hidden='true'
                >
                  <div className='modal-dialog'>
                    <div className='modal-content'>
                      <button
                        data-bs-dismiss='modal'
                        className='close-btn'
                        aria-label='Close'
                        onClick={handleCloseModal}
                      >
                        <RiCloseCircleLine />
                      </button>

                      <div className='modal-body'>
                        <img
                          src={success}
                          alt='Success'
                          className='success-gif'
                        />
                        <p className='modal-para'>
                    Workshop Added Successfully
                        </p>
                      </div>
                    </div>
                    </div>
                    </div> */}

 </> );
}