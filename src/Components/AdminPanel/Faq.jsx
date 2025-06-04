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
import 'react-quill/dist/quill.snow.css'; 

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#00AEEF',
    color: theme.palette.common.white,
    borderRight: '1px solid white', // Add vertical lines
    padding: '3px 5px',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderRight: '1px solid #e0e0e0', // Add vertical lines for body rows
    padding: '3px 4px',
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


export default function Faq() {
    const [courseCategory,setCourseCategory]=useState([]);
  const [course,setCourse]=useState([]);
  const [searchTerm,setSearchTerm]=useState("")
    const [showAddCourse, setShowAddCourse] = useState(false);
    const[curriculum,setCurriculum]=useState([]);
    const[filterCourse,setFilterCourse]=useState([]);
    const[filteredCurriculum,setFilteredCurriculum]=useState([])
    const [homeFilter,setHomeFilter]=useState([]);
    const [open, setOpen] = React.useState(false);
    const [rows, setRows] = useState([{ id:Date.now(),faq_title:"",description:"" }]);
    const currentDate = new Date().toISOString().split('T')[0];
    const[message,setMessage]=useState(false);
    const [displayedCategories, setDisplayedCategories] = useState([]);
        const [allData, setAllData] = useState([]); // All fetched data
        const [catChange, setCatChange] = useState(0);
    // Data to be displayed
    const [filterData, setFilterData] = useState({
      category_name: "",
      course_name: "",
    });
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [editedRow, setEditedRow] = useState({faq_id:"",category_name:"",course_name:"",faq_pdf:"",faq_title:"",description:""});
    const [curriculumData, setCurriculumData] = useState({
    
          category_name:"",
            course_name: "",
         faq_pdf:"",
            date:currentDate,
         });
        const [currentPage, setCurrentPage] = useState(1);
           const [rowsPerPage, setRowsPerPage] = useState(10);
           
           const handlePageChange = (page) => {
            setCurrentPage(page);
            window.scrollTo(0, window.scrollY);
          };
          const handleRowChange = (index, field, value) => {
            const updatedRows = [...rows];
            updatedRows[index][field] = value;
            setRows(updatedRows);
          };
          const addRow = () => {
            setRows([...rows, { id: Date.now(), faq_title: '', description: '' }]);
          };
          
          const deleteRow = (id) => {
            setRows(rows.filter(row => row.id !== id));
          };
        
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
                faq_id:"",
                  category_name:"",
                    course_name: "",
                 faq_pdf:"",
                    date:"",
                    faq_title:"",
         description:"",
                 });
        
         }
     
                
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
          if (curriculumData.category_name) {
            const filtered = courseCategory.filter(
              (course) => course.courseCategory === curriculumData.category_name
            );
            setFilterCourse(filtered);
          } else {
            setFilterCourse([]); // Reset when no category is selected
          }
        }, [curriculumData.category_name, courseCategory]);
          useEffect(() => {
              if (filterData.category_name) {
                const filtered = courseCategory.filter(
                  (course) => course.courseCategory === filterData.category_name
                );
                setHomeFilter(filtered);
              } else {
                setHomeFilter([]); 
              }
            }, [filterData.category_name, courseCategory]);
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
  

    const handleDeleteConfirmation = (faq_id) => {
        if (window.confirm("Are you sure you want to delete this Faq?")) {
          handleDelete(faq_id);
        }
      };
      // const handleInputChange = (e) => {
      //   const { name, value } = e.target;
      //   setEditedRow((prev) => ({
      //     ...prev,
      //     [name]: value,
      //   }));
      // };

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedRow((prev) => ({
          ...prev,
          [name]: value,
          ...(name === "category_name" && { course_name: "" }), // Reset course when category changes
        }));
        if (editedRow.category_name) {
          // alert(name);
          //alert(value);
          setCatChange(1);
          const filtered = courseCategory.filter(
            (course) => course.courseCategory === value
          );
          setFilterCourse(filtered);
        } else {
          setCatChange(0);
          setFilterCourse([]);
        }
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
            faq_title: editedRow.faq_title,
          description: editedRow.description,
            
          };
      
          formData.append("faqData", JSON.stringify(curriculumData));
      
          // Append file only if it is selected and is a File object
          if (
            editedRow.faq_pdf &&
            editedRow.faq_pdf instanceof File
          ) {
            formData.append("faqPdf", editedRow.faq_pdf);
          }
      
          const response = await axios.put(
            `https://api.hachion.co/faq/update/${editedRow.faq_id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data", 
              },
              maxBodyLength: Infinity,  
              maxContentLength: Infinity, 
              timeout: 60000  
            });
      
          setCurriculum((prev) =>
            prev.map((curr) =>
              curr.faq_id === editedRow.faq_id ? response.data : curr
            )
          );
      
          setMessage("FAQ updated successfully!");
          setTimeout(() => setMessage(""), 5000);
          setOpen(false);
        } catch (error) {
          const backendMessage = error.response?.data || error.message;
          console.error("Error updating faq:", error);
          setMessage(backendMessage);
        }
      };
      
  
      const handlefilterChange = (e) => {
        const { name, value } = e.target;
        const newFilter = { ...filterData, [name]: value };
        setFilterData(newFilter);
      
        const filtered = allData.filter(
      (item) =>
        (!newFilter.category_name ||
          item.category_name === newFilter.category_name) &&
        (!newFilter.course_name || item.course_name === newFilter.course_name)
    );

    setFilteredCurriculum(filtered);
    setCurrentPage(1); // Reset to first page

    if (name) {
      // alert(name);
      // alert(value);
      setCatChange(1);
      const filtered = courseCategory.filter(
        (course) => course.courseCategory === value
      );
      setFilterCourse(filtered);
    } else {
      setCatChange(0);
      setFilterCourse([]);
    }
  };
        useEffect(() => {
          const fetchData = async () => {
            try {
              const response = await axios.get("https://api.hachion.co/faq");
              setAllData(response.data);
              setFilteredCurriculum(response.data); // Used for paginated display
            } catch (error) {
              console.error("Error fetching curriculum data", error);
            }
          };
          fetchData();
        }, []);
      const handleDelete = async (faq_id) => {
       
         try { 
          const response = await axios.delete(`https://api.hachion.co/faq/delete/${faq_id}`); 
          console.log("FAQ deleted successfully:", response.data); 
        } catch (error) { 
          console.error("Error deleting Faq:", error); 
        } }; 
        useEffect(() => {
          const filtered = curriculum.filter(curriculum =>
              (curriculum.course_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
              (curriculum.faq_title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
              (curriculum.description?.toLowerCase() || "").includes(searchTerm.toLowerCase())
          );
          setFilteredCurriculum(filtered);
      }, [searchTerm, curriculum]);      
      const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setCurriculumData((prev) => ({
                ...prev,
                faq_pdf: file, // Store the file object directly
            }));
        }
    };
    
    const handleEditFileUpload = async (e) => {
      const file = e.target.files[0];
      if (file) {
          setEditedRow((prev) => ({
              ...prev,
              faq_pdf: file, // Store the file object directly
          }));
      }
  };
  
        const handleClickOpen = (row) => {
          console.log("Editing row:", row);
          setEditedRow(row); 
          if (row.category_name) {
            const filtered = courseCategory.filter(
              (course) => course.courseCategory === row.category_name
            );
            setFilterCourse(filtered);
          }
          setOpen(true); 
        };
        
    const handleChange = (e) => {
      const { name, value } = e.target;
      setCurriculumData((prevData) => ({
          ...prevData,
          [name]: value
      }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const currentDate = new Date().toISOString().split("T")[0];


  const uploadPromises = rows.map(async (row) => {
    const formData = new FormData();

    // Append static shared values
    formData.append("faqData", JSON.stringify({
      category_name: curriculumData.category_name,
      course_name: curriculumData.course_name,
      faq_title: row.faq_title || "",
      description: row.description || "",
      date: currentDate,
    }));

    // Add the same PDF to each entry
    if (curriculumData.faq_pdf) {
      formData.append("faqPdf", curriculumData.faq_pdf);
    }

    try {
      const response = await axios.post("https://api.hachion.co/faq/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        timeout: 60000,
      });

      return response.status === 201;
    } catch (error) {
      const backendMessage = error.response?.data || error.message;
      console.error("Error adding faq:", backendMessage);
      return { success: false, error: backendMessage };
    }
  });

  const results = await Promise.all(uploadPromises);
  const allSuccessful = results.every((status) => status);

  if (allSuccessful) {
    alert("All faq entries added successfully.");
    setShowAddCourse(false);
    setCurriculumData({});
    setRows([{ id: Date.now(), faq_title: "", description: "" }]); // Reset to initial row
  } else {
    alert("Some entries failed to upload. Please check the console for errors.");
  }
};
        
    const handleAddTrendingCourseClick = () => setShowAddCourse(true);
  return (
    
    <>  
     {showAddCourse ?  (<div className='course-category'>
      <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                      <a href="#!" onClick={() => setShowAddCourse(false)}>FAQ </a> <MdKeyboardArrowRight />
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                      Add Faq's
                      </li>
                    </ol>
                  </nav>
<div className='category'>
<div className='category-header'>
<p style={{ marginBottom: 0 }}>Add Faq</p>
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
  <label for="formFile" class="form-label">Faq PDF</label>
  <input
    className="form-control"
    type="file"
    id="formFile"
    name='faq_pdf'
    onChange={handleFileUpload}
/>

</div>
  </div>
  <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650,marginTop:5 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align='center' sx={{ fontSize: '16px', width: '35%' }}> Title</StyledTableCell>
            <StyledTableCell align="center" sx={{ fontSize: '16px' }}>Description</StyledTableCell>
            <StyledTableCell align="center" sx={{ fontSize: '16px', width: '180px' }}>Add/Delete Row</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {rows.map((row,index) => (
            <StyledTableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: '1px solid #d3d3d3 '} }}
            >
              <StyledTableCell component="th" scope="row" align='center' sx={{ padding: 0, }}>
               <input className='table-curriculum' name='faq_title' value={row.faq_title}
        onChange={(e) => handleRowChange(index, 'faq_title', e.target.value)}/>
              </StyledTableCell>
              <StyledTableCell sx={{ padding: 0 }} align="center">
    <ReactQuill
        theme="snow"
        modules={quillModules}
        value={row.description}
        onChange={(value) =>
          setRows((prevRows) =>
            prevRows.map((r) =>
              r.id === row.id ? { ...r, description: value } : r
            )
          )
        }
    />
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
            <p style={{ marginBottom: 0 }}>View FAQ's</p>
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
                <FiPlus /> Add Faq
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
    <select id="inputState" class="form-select" name='category_name' value={filterData.category_name} onChange={handlefilterChange}>
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
          value={filterData.course_name}
          onChange={handlefilterChange}
          disabled={!filterData.category_name}
        >
          <option value="" disabled>Select Course</option>
          {homeFilter.map((curr) => (
            <option key={curr.id} value={curr.courseName}>{curr.courseName}</option>
          ))}
        </select>
      </div>
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
{(filterData.category_name || filterData.course_name) ?(
  <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell  align='center' sx={{ width: '100px' }}>
              <Checkbox />
            </StyledTableCell>
            <StyledTableCell align='center' sx={{ width: '100px' }}>S.No.</StyledTableCell>
            <StyledTableCell align="center">Title</StyledTableCell>
            <StyledTableCell align="center">Description</StyledTableCell>
            {/* <StyledTableCell align="center">faq pdf</StyledTableCell> */}
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
      <StyledTableCell align="left" style={{ maxWidth: '500px', wordWrap: 'break-word', whiteSpace: 'pre-line' }} 
      >{course.faq_title}</StyledTableCell>
      <StyledTableCell align="left">
  <div 
    style={{ maxWidth: '1000px', wordWrap: 'break-word', whiteSpace: 'pre-line' }} 
    dangerouslySetInnerHTML={{ __html: course.description || 'No topics available' }} 
  />
</StyledTableCell>
{/* <StyledTableCell align="center">{course.faq_pdf}</StyledTableCell> */}
      <StyledTableCell align="center">{course.date ? dayjs(course.date).format('MM-DD-YYYY') : 'N/A'}</StyledTableCell>
      <StyledTableCell align="center">
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <FaEdit className="edit" onClick={() => handleClickOpen(course)} />
          <RiDeleteBin6Line
            className="delete"
            onClick={() => handleDeleteConfirmation(course.faq_id)}
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
    </TableContainer>):(<p>Please select category or courses to display data</p>)}
    {(filterData.category_name || filterData.course_name) ?(
    <div className='pagination-container'>
          <AdminPagination
      currentPage={currentPage}
      rowsPerPage={rowsPerPage}
      totalRows={filteredCurriculum.length} // Use the full list for pagination
      onPageChange={handlePageChange}
    />
              </div>):(<p></p>)}
    {message && <div className="success-message">{message}</div>}

    </div>)}

    <Dialog className="dialog-box" open={open} onClose={handleClose} aria-labelledby="edit-schedule-dialog"
    PaperProps={{
      style: { borderRadius: 20 },
    }}>
  <div className="dialog-title">
    <DialogTitle  id="edit-schedule-dialog">Edit FAQ</DialogTitle>
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
                {catChange
                  ? filterCourse.map((curr) => (
                      <option key={curr.id} value={curr.courseName}>
                        {curr.courseName}
                      </option>
                    ))
                  : courseCategory.map((curr) => (
                      <option key={curr.id} value={curr.courseName}>
                        {curr.courseName}
                      </option>
                    ))}
      </select>
    </div>
    </div>

    <div className="mb-3">
      <label htmlFor="faqPDF" className="form-label">FAQ's PDF</label>
      <input
        className="form-control-sample"
        type="file"
        id="faqPDF"
        accept='.pdf'
        name="faq_pdf"
        onChange={(e) =>
          setEditedRow((prev) => ({
            ...prev,
            faq_pdf: e.target.files[0], // must be a File object
          }))
        }
        
    
      />
    </div>

    <label htmlFor="title">Title</label>
    <input
      id="title"
      className="form-control"
      name="faq_title"
      value={editedRow.faq_title || ""}
      onChange={handleInputChange}
    />

<label htmlFor="topic">Description</label>
<ReactQuill
  theme="snow"
  modules={quillModules}
  value={editedRow.description || ""}
  onChange={(value) =>
    setEditedRow((prevData) => ({
      ...prevData,
      description: value
    }))
  }
/>
  </DialogContent>
  <DialogActions className="update" style={{ display: 'flex', justifyContent: 'center' }}>
    <Button onClick={handleSave} className="update-btn">Update</Button>
  </DialogActions>
</Dialog>


   
 </> );
}