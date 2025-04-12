import  React, { useEffect } from 'react';
import { useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io'
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
import dayjs from 'dayjs';
import { RiCloseCircleLine } from 'react-icons/ri';
import success from '../../Assets/success.gif';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
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
import { GoPlus } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { MdKeyboardArrowRight } from 'react-icons/md';
import AdminPagination from './AdminPagination'; 
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'

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


export default function Curriculum() {
    const [courseCategory,setCourseCategory]=useState([]);
  const [course,setCourse]=useState([]);
  const [filterCourse,setFilterCourse]=useState([]);
  const [searchTerm,setSearchTerm]=useState("")
    const [showAddCourse, setShowAddCourse] = useState(false);
    const[curriculum,setCurriculum]=useState([]);
    const[filteredCurriculum,setFilteredCurriculum]=useState([])
    const [open, setOpen] = React.useState(false);
    const [rows, setRows] = useState([{ id:"",title:"",topic:"",linl: "" }]);
    const currentDate = new Date().toISOString().split('T')[0];
    const[message,setMessage]=useState(false);
    const [startDate, setStartDate] = useState(null);
    const [displayedCategories, setDisplayedCategories] = useState([]);
    const [allData, setAllData] = useState([]); // All fetched data
// Data to be displayed
const [filterData, setFilterData] = useState({
  category_name: "",
  course_name: "",
});

    const [endDate, setEndDate] = useState(null);
    const [editedRow, setEditedRow] = useState({curriculum_id:"",category_name:"",course_name:"",curriculum_pdf:"",title:"",topic:"", link:""});
    const [curriculumData, setCurriculumData] = useState({
        curriculum_id:"",
          category_name:"",
            course_name: "",
         curriculum_pdf:"",
         title:"",
         topic: "<ul><li></li></ul>",
         link: "",
            date:currentDate,
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
        
        // Slice filteredCurriculum based on rowsPerPage and currentPage
        useEffect(() => {
          const displayed = filteredCurriculum.slice(
            (currentPage - 1) * rowsPerPage,
            currentPage * rowsPerPage
          );
          setDisplayedCategories(displayed);
        }, [filteredCurriculum, currentPage, rowsPerPage]);

        const quillModules = {
          toolbar: [
              [{ 'list': 'ordered' }, { 'list': 'bullet' }], 
              ['bold', 'italic', 'underline', 'strike'], 
              [{ 'color': [] }, { 'background': [] }], 
              ['link'], 
              ['clean'] 
          ]
      };

         const handleReset=()=>{
            setCurriculumData({
                curriculum_id:"",
                  category_name:"",
                    course_name: "",
                 curriculum_pdf:"",
                    date:""
                 });
        
         }
         const addRow = () => {
          setRows([...rows, { id: Date.now(), title: "", topic: "", link: "" }]);
      };
      
      const deleteRow = (id) => {
          setRows(rows.filter(row => row.id !== id));
      };
                
    const handleClose = () => {
      setOpen(false); // Close the modal
    };
    useEffect(() => {
      const fetchCategory = async () => {
        try {
          const response = await axios.get("https://api.hachion.co/course-categories/all");
          setCourse(response.data); // Assuming the data contains an array of trainer objects
        } catch (error) {
          console.error("Error fetching categories:", error.message);
        }
      };
      fetchCategory();
    }, []);
    useEffect(() => {
      const fetchCourseCategory = async () => {
        try {
          const response = await axios.get("https://api.hachion.co/courses/all");
          setCourseCategory(response.data); // Assuming the data contains an array of trainer objects
        } catch (error) {
          console.error("Error fetching categories:", error.message);
        }
      };
      fetchCourseCategory();
    }, []);
    useEffect(() => {
      if (curriculumData.category_name) {
        const filtered = courseCategory.filter(
          (course) => course.courseCategory === curriculumData.category_name
        );
        setFilterCourse(filtered);
      } else {
        setFilterCourse([]); // Reset when no category is selected
      }
    }, [curriculumData.category_name, courseCategory]);
  //   useEffect(() => {
  //     const fetchCurriculum = async () => {
  //         try {
  //             const response = await axios.get('https://api.hachion.co/curriculum');
  //             setCurriculum(response.data); // Use the curriculum state
  //         } catch (error) {
  //             console.error("Error fetching curriculum:", error.message);
  //         }
  //     };
  //     fetchCurriculum();
  //     setFilteredCurriculum(curriculum)
  // }, [curriculum]); // Empty dependency array ensures it runs only once
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://api.hachion.co/curriculum");
        setAllData(response.data);
        setFilteredCurriculum(response.data); // Used for paginated display
      } catch (error) {
        console.error("Error fetching curriculum data", error);
      }
    };
    fetchData();
  }, []);
  
  
    const handleDeleteConfirmation = (curriculum_id) => {
        if (window.confirm("Are you sure you want to delete this Curriculum?")) {
          handleDelete(curriculum_id);
        }
      };
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedRow((prev) => ({
          ...prev,
          [name]: value,
        }));
      };
      const handleDateFilter = () => {
        const filtered = curriculum.filter((item) => {
          const curriculumDate = new Date(item.date); // Parse the date field
          const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
          const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
      
          return (
            (!start || curriculumDate >= start) &&
            (!end || curriculumDate <= end)
          );
        });
      
        setFilteredCurriculum(filtered);
      };
      const handleSave = async () => {
        try {
          const formData = new FormData();
      
          // Construct only the necessary fields
          const curriculumData = {
            category_name: editedRow.category_name,
            course_name: editedRow.course_name,
            title: editedRow.title,
            topic: editedRow.topic,
            link: editedRow.link,
          };
      
          formData.append("curriculumData", JSON.stringify(curriculumData));
      
          // Append file only if it is selected and is a File object
          if (
            editedRow.curriculum_pdf &&
            editedRow.curriculum_pdf instanceof File
          ) {
            formData.append("curriculumPdf", editedRow.curriculum_pdf);
          }
      
          const response = await axios.put(
            `http://13.219.46.20:8080/curriculum/update/${editedRow.curriculum_id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
      
          setCurriculum((prev) =>
            prev.map((curr) =>
              curr.curriculum_id === editedRow.curriculum_id ? response.data : curr
            )
          );
      
          setMessage("Curriculum updated successfully!");
          setTimeout(() => setMessage(""), 5000);
          setOpen(false);
        } catch (error) {
          console.error("Error updating curriculum:", error);
          setMessage("Error updating Curriculum.");
        }
      };
      

      const handleDelete = async (curriculum_id) => {
       
         try { 
          const response = await axios.delete(`https://api.hachion.co/curriculum/delete/${curriculum_id}`); 
          console.log("Curriculum deleted successfully:", response.data); 
        } catch (error) { 
          console.error("Error deleting Curriculum:", error); 
        } }; 
        useEffect(() => {
          const filtered = curriculum.filter(curriculum =>
              (curriculum.course_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
              (curriculum.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
              (curriculum.topic?.toLowerCase() || "").includes(searchTerm.toLowerCase())
          );
          setFilteredCurriculum(filtered);
      }, [searchTerm, curriculum]);      
      const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setCurriculumData((prev) => ({
                ...prev,
                curriculum_pdf: file, // Store the file object directly
            }));
        }
    };
    
    const handleEditFileUpload =  (e) => {
      setEditedRow(prev => ({
        ...prev,
        curriculum_pdf: e.target.files[0], // this must be a File object
      }));
  };
  
  
        
        const handleCloseModal=()=>{
          setShowAddCourse(false);
         
        }
        const handleClickOpen = (row) => {
          console.log(row);
            setEditedRow(row)// Set the selected row data
            setOpen(true); // Open the modal
            
          };
    const handleChange = (e) => {
      const { name, value } = e.target;
      setCurriculumData((prevData) => ({
          ...prevData,
          [name]: value
      }));
  };
  const handlefilterChange = (e) => {
    const { name, value } = e.target;
    const newFilter = { ...filterData, [name]: value };
    setFilterData(newFilter);
  
    const filtered = allData.filter((item) =>
      (!newFilter.category_name || item.category_name === newFilter.category_name) &&
      (!newFilter.course_name || item.course_name === newFilter.course_name)
    );
  
    setFilteredCurriculum(filtered);
    setCurrentPage(1); // Reset to first page
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const currentDate = new Date().toISOString().split("T")[0];
    const formData = new FormData();
    
    // Append curriculum data fields (even if some are optional)
    formData.append("curriculumData", JSON.stringify({
      category_name: curriculumData?.category_name || "",
      course_name: curriculumData?.course_name || "",
      title: curriculumData?.title || "",
      topic: curriculumData?.topic || "",
      link: curriculumData?.link || "",
      date: currentDate
    }));
  
    // Append PDF only if it's provided
    if (curriculumData?.curriculum_pdf) {
      formData.append("curriculumPdf", curriculumData.curriculum_pdf);
    }
  
    console.log("Data being sent:", Object.fromEntries(formData)); // Debugging
  
    try {
      const response = await axios.post("http://13.219.46.20:8080/curriculum/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data" // Important for file uploads
        }
      });
  
      if (response.status === 201) { // HTTP 201 means "Created"
        alert("Curriculum details added successfully");
        setCurriculumData({}); // Reset form state
        handleReset(); // Call reset function if available
      }
    } catch (error) {
      console.error("Error adding curriculum:", error.response?.data || error.message);
      alert("Error adding curriculum.");
    }
  };
     
    const handleAddTrendingCourseClick = () => setShowAddCourse(true);
  return (
    
    <>  
     {showAddCourse ?  (<div className='course-category'>
      <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                      <a href="#!" onClick={() => setShowAddCourse(false)}>Curriculum </a> <MdKeyboardArrowRight />
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                      Add Curriculum
                      </li>
                    </ol>
                  </nav>
<div className='category'>
<div className='category-header'>
<p>Add Curriculum</p>
</div>
<div className='course-details'>
<div className='course-row'>
<div class="col-md-3">
    <label for="inputState" class="form-label">Category Name</label>
    <select id="inputState" class="form-select" name='category_name' value={curriculumData.category_name} onChange={handleChange}>
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
  <div className="col-md-3">
        <label htmlFor="course" className="form-label">Course Name</label>
        <select
          id="course"
          className="form-select"
          name="course_name"
          value={curriculumData.course_name}
          onChange={handleChange}
          disabled={!curriculumData.category_name}
        >
          <option value="" disabled>Select Course</option>
          {filterCourse.map((curr) => (
            <option key={curr.id} value={curr.courseName}>{curr.courseName}</option>
          ))}
        </select>
      </div>
  <div class="mb-3">
  <label for="formFile" class="form-label">Curriculum PDF</label>
  <input
    className="form-control"
    type="file"
    id="formFile"
    name='curriculum_pdf'
    onChange={handleFileUpload}
/>

</div>
  </div>
  <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650,marginTop:5 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align='center' sx={{ fontSize: '16px', width: '35%' }}> Title</StyledTableCell>
            <StyledTableCell align="center" sx={{ fontSize: '16px' }}>Topic</StyledTableCell>
            <StyledTableCell align="center" sx={{ fontSize: '16px' }}>Video Link</StyledTableCell>
            <StyledTableCell align="center" sx={{ fontSize: '16px', width: '180px' }}>Add/Delete Row</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {rows.map((row) => (
            <StyledTableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: '1px solid #d3d3d3 '} }}
            >
              <StyledTableCell component="th" scope="row" align='center' sx={{ padding: 0, }}>
               <input className='table-curriculum' name='title' value={rows.title} onChange={handleChange}/>
              </StyledTableCell>
              <StyledTableCell sx={{ padding: 0 }} align="center">
    <ReactQuill
        theme="snow"
        modules={quillModules}
        value={curriculumData.topic} 
        onChange={(value) => setCurriculumData((prevData) => ({
            ...prevData,
            topic: value
        }))}
    />
</StyledTableCell>
              <StyledTableCell component="th" scope="row" align='center' sx={{ padding: 0, }}>
               <input className='table-curriculum' name='link' value={rows.link} onChange={handleChange}/>
              </StyledTableCell>
              <StyledTableCell align="center" sx={{ padding: 0 }}><><GoPlus style={{fontSize:'2rem',color:'#00AEEF',marginRight:'10px'}} onClick={addRow} />
                    <IoClose style={{fontSize:'2rem',color:'red'}} onClick={()=>deleteRow(row.id)}/></></StyledTableCell>
                  </StyledTableRow>
    
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  
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
       
        <div className='category'>
          <div className='category-header'>
            <p>View Curriculum</p>
          </div>
          <div className='date-schedule'>
            Start Date
            <DatePicker 
    selected={startDate} 
    onChange={(date) => setStartDate(date)} 
    isClearable 
    sx={{
       '& .MuiIconButton-root':{color: '#00aeef'}
    }}/>
            End Date
            <DatePicker 
    selected={endDate} 
    onChange={(date) => setEndDate(date)} 
    isClearable 
    sx={{
      '& .MuiIconButton-root':{color: '#00aeef'}
    }}
  />
            <button className='filter' onClick={handleDateFilter} >Filter</button>
           
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
              <button type="button" className="btn-category" onClick={handleAddTrendingCourseClick} >
                <FiPlus /> Add Curriculum
              </button>
            </div>
          </div>

        </div>
      </div>
    </LocalizationProvider>
    <div className='course-details'>
<div className='course-row'>
<div class="col-md-3">
    <label for="inputState" class="form-label">Category Name</label>
    <select
  id="inputState"
  className="form-select"
  name="category_name"
  value={filterData.category_name}
  onChange={handlefilterChange}
>
  <option value="" disabled>Select Category</option>
  {course.map((curr) => (
    <option key={curr.id} value={curr.name}>{curr.name}</option>
  ))}
</select>
</div>
<div className="col-md-3">
<label htmlFor="course" className="form-label">Course Name</label>

<select
  id="course"
  className="form-select"
  name="course_name"
  value={filterData.course_name}
  onChange={handlefilterChange}
  
>
  <option value="" disabled>Select Course</option>
  {courseCategory.map((curr) => (
    <option key={curr.id} value={curr.courseName}>{curr.courseName}</option>
  ))}
</select>
      </div>
  {/* <div class="mb-3">
  <label for="formFile" class="form-label">Curriculum PDF</label>
  <input class="form-control" type="file" id="formFile"
          name="curriculum_pdf"
          onChange={handleChange}/>
</div> */}
<div style={{marginTop: '50px'}}>
  <button className="filter" onClick={() => {
  setFilterData({ category_name: "", course_name: "" });
  setFilteredCurriculum(allData);
    setCurrentPage(1);}}>
  Reset Filter
</button>
</div>
</div>
</div>

  <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell  align='center' sx={{ width: '100px' }}>
              <Checkbox />
            </StyledTableCell>
            <StyledTableCell align='center' sx={{ width: '100px' }}>S.No.</StyledTableCell>
            <StyledTableCell align="center">Title</StyledTableCell>
            <StyledTableCell align="center">Topic</StyledTableCell>
            <StyledTableCell align="center">Video Link</StyledTableCell>
            <StyledTableCell align="center">Created Date</StyledTableCell>
            <StyledTableCell align="center" sx={{ width: '150px' }}>Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {displayedCategories.length > 0 ? (
  displayedCategories.map((course, index) => (
    <StyledTableRow key={course.curr_id}>
      <StyledTableCell align="center">
        <Checkbox />
      </StyledTableCell>
      <StyledTableCell align="center">
        {index + 1 + (currentPage - 1) * rowsPerPage}
      </StyledTableCell>
      <StyledTableCell align="left">{course.title}</StyledTableCell>
      <StyledTableCell align="left">
    {course.topic ? (
        <div 
        style={{ maxWidth: '800px', wordWrap: 'break-word', whiteSpace: 'pre-line' }}
        dangerouslySetInnerHTML={{ __html: course.topic }} />
    ) : (
        <p>No topics available</p>
    )}
</StyledTableCell>
      <StyledTableCell align="left">{course.link}</StyledTableCell>
      <StyledTableCell align="center">{course.date ? dayjs(course.date).format('MM-DD-YYYY') : 'N/A'}</StyledTableCell>
      <StyledTableCell align="center">
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <FaEdit className="edit" onClick={() => handleClickOpen(course)} />
          <RiDeleteBin6Line
            className="delete"
            onClick={() => handleDeleteConfirmation(course.curriculum_id)}
          />
        </div>
      </StyledTableCell>
    </StyledTableRow>
  ))
) : (
  <p>No categories available</p>
)}
</TableBody>
    </Table>
    </TableContainer>
    <div className='pagination-container'>
          <AdminPagination
      currentPage={currentPage}
      rowsPerPage={rowsPerPage}
      totalRows={filteredCurriculum.length} // Use the full list for pagination
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
    <DialogTitle  id="edit-schedule-dialog">Edit Curriculum</DialogTitle>
    <Button onClick={handleClose} className="close-btn">
      <IoMdCloseCircleOutline style={{ color: "white", fontSize: "2rem" }} />
    </Button>
  </div>
  <DialogContent>
  <div className="course-row">
    <div className="col">
      <label htmlFor="categoryName" className="form-label">Category Name</label>
      <select
        id="categoryName"
        className="form-select"
        name="category_name"
        value={editedRow.category_name || ""}
        onChange={handleInputChange}
      >
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
      <label htmlFor="courseName" className="form-label">Course Name</label>
      <select
        id="courseName"
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

    <div className="mb-3">
      <label htmlFor="curriculumPDF" className="form-label">Curriculum's PDF</label>
      <input
  type="file"
  accept=".pdf"
  onChange={(e) =>
    setEditedRow((prev) => ({
      ...prev,
      curriculum_pdf: e.target.files[0], // must be a File object
    }))
  }
/>

    </div>

    <label htmlFor="title">Title</label>
    <input
      id="title"
      className="form-control"
      name="title"
      value={editedRow.title || ""}
      onChange={handleInputChange}
    />

    <label htmlFor="topic">Topic</label>
    <ReactQuill 
      id="topic"
      name="topic"
      value={editedRow.topic || ""}
      onChange={(value) => setEditedRow((prevData)=> ({ ...prevData, topic: value }))}
      modules={quillModules}
    />

    <label htmlFor="topic">Video Link</label>
    <input id="link" className="form-control" name='link' value={editedRow.link || ""}
      onChange={handleInputChange}/>
  </DialogContent>
  <DialogActions className="update" style={{ display: 'flex', justifyContent: 'center' }}>
    <Button onClick={handleSave} className="update-btn">Update</Button>
  </DialogActions>
</Dialog>

   
   
 </> );
}