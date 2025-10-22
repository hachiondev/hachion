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
import dayjs from 'dayjs';
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
import { MdKeyboardArrowRight } from 'react-icons/md';
import AdminPagination from './AdminPagination'; 
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 

const htmlToText = (html) => {
  const doc = new DOMParser().parseFromString(html || "", "text/html");
  return (doc.body.textContent || "").trim();
};

const API_BASE = "https://api.test.hachion.co/general-faq";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#00AEEF',
    color: theme.palette.common.white,
    borderRight: '1px solid white', 
    padding: '3px 5px',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderRight: '1px solid #e0e0e0', 
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

export default function GeneralFaq() {
    const [courseCategory,setCourseCategory]=useState([]);
  const [course,setCourse]=useState([]);
  const [searchTerm,setSearchTerm]=useState("")
    const [showAddCourse, setShowAddCourse] = useState(false);
    const[curriculum,setCurriculum]=useState([]);
    const[filterCourse,setFilterCourse]=useState([]);
    const[filteredCurriculum,setFilteredCurriculum]=useState([])
    const [homeFilter,setHomeFilter]=useState([]);
    const [open, setOpen] = React.useState(false);
    const [rows, setRows] = useState([{ id:Date.now(),faqTitle:"",description:"" }]);
    const currentDate = new Date().toISOString().split('T')[0];
    const[message,setMessage]=useState(false);
    const [successMessage, setSuccessMessage] = useState("");
      const [errorMessage, setErrorMessage] = useState("");
    const [displayedCategories, setDisplayedCategories] = useState([]);
        const [allData, setAllData] = useState([]); 
        const [catChange, setCatChange] = useState(0);
    
    const [filterData, setFilterData] = useState({
      category_name: "",
      course_name: "",
    });
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedFaqIds, setSelectedFaqIds] = useState([]);
    const [editedRow, setEditedRow] = useState({faqId:"",faqTitle:"",description:""});
    const [curriculumData, setCurriculumData] = useState({
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
            setRows([...rows, { id: Date.now(), faqTitle: '', description: '' }]);
          };
          
          const deleteRow = (id) => {
            setRows(rows.filter(row => row.id !== id));
          };
        
        const handleRowsPerPageChange = (rows) => {
          setRowsPerPage(rows);
          setCurrentPage(1); 
        };
        
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
                faqId:"",
                date:"",
                faqTitle:"",
                description:"",
                 });
         }
     
    const handleClose = () => {
      setOpen(false); 
    };
    useEffect(() => {
      const fetchCategory = async () => {
        try {
          const response = await axios.get("https://api.test.hachion.co/course-categories/all");
          setCourse(response.data); 
        } catch (error) {
          console.error("Error fetching categories:", error.message);
        }
      };
      fetchCategory();
    }, []);
   
    useEffect(() => {
      const fetchCourseCategory = async () => {
        try {
          const response = await axios.get("https://api.test.hachion.co/courses/all");
          setCourseCategory(response.data); 
        } catch (error) {
          console.error("Error fetching categories:", error.message);
        }
      };
      fetchCourseCategory();
    }, []);
  
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedRow((prev) => ({
          ...prev,
          [name]: value,
          ...(name === "category_name" && { course_name: "" }), 
        }));
        if (editedRow.category_name) {
          
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
          const curriculumDate = new Date(item.date); 
          const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
          const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
      
      const matchSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.date.toLowerCase().includes(searchTerm.toLowerCase());

    const inRange =
      (!start || curriculumDate >= start) &&
      (!end || curriculumDate <= end);

    return matchSearch && inRange;
  });
      
      setFilteredCurriculum(filtered);
      };
    const handleDateReset = () => {
    setStartDate(null);
    setEndDate(null);
     setSearchTerm('');
    setFilteredCurriculum(curriculum);
  };
      
      const handleSave = async () => {
  try {
    const payload = {
      faqTitle: editedRow.faqTitle,
      description: htmlToText(editedRow.description),
      date: editedRow.date || new Date().toISOString().split("T")[0]
    };

    const { data } = await axios.put(
      `${API_BASE}/update/${editedRow.faqId}`, 
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    setCurriculum(prev => prev.map(f => (f.faqId === editedRow.faqId ? data : f)));
    setMessage("FAQ updated successfully!");
    setTimeout(() => setMessage(""), 5000);
    setOpen(false);

    await fetchData(); 
  } catch (error) {
    const backendMessage = error?.response?.data || error.message;
    console.error("Error updating FAQ:", backendMessage);
    setMessage(String(backendMessage));
  }
};

      const handlefilterChange = (e) => {
        const { name, value } = e.target;
        const newFilter = { ...filterData, [name]: value };
        setFilterData(newFilter);
      
        const filtered = allData.filter(
    );

    setFilteredCurriculum(filtered);
    setCurrentPage(1); 

    if (name) {
      
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


const fetchData = async () => {
  try {
    const { data } = await axios.get(`${API_BASE}`);
    
    const sorted = [...data].sort((a, b) => {
      const ad = new Date(a.date || 0) - new Date(b.date || 0);
      if (ad !== 0) return ad;
      if (a.sortOrder != null && b.sortOrder != null) return a.sortOrder - b.sortOrder;
      
      return (a.faqId ?? 0) - (b.faqId ?? 0);
    });

    setAllData(sorted);
    setFilteredCurriculum(sorted);
  } catch (error) {
    console.error("Error fetching FAQ data", error);
  }
};


useEffect(() => { fetchData(); }, []);

  const handleCheckboxChange = (faqId) => {
  setSelectedFaqIds((prev) =>
    prev.includes(faqId)
      ? prev.filter((id) => id !== faqId)
      : [...prev, faqId]
  );
};

const handleDeleteConfirmation = (faqId) => {
  let idsToDelete = selectedFaqIds;

  
  if (faqId) {
    idsToDelete = [faqId];
  }

  if (!idsToDelete || idsToDelete.length === 0) {
    alert("Please select at least one FAQ to delete.");
    return;
  }

  if (window.confirm(`Are you sure you want to delete ${idsToDelete.length} selected FAQ(s)?`)) {
    handleDelete(idsToDelete);
  }
};
const handleDelete = async (ids) => {
  try {
    const response = await axios.post(`${API_BASE}/delete`, ids, {
      headers: { "Content-Type": "application/json" }
    });

    if (response.status === 200) {
      setSuccessMessage("✅ Selected FAQ(s) deleted successfully.");
      setErrorMessage("");
    } else {
      setSuccessMessage("");
      setErrorMessage("❌ Some FAQ(s) could not be deleted.");
    }

    await fetchData();
    setSelectedFaqIds(prev => prev.filter(id => !ids.includes(id)));
  } catch (error) {
    console.error("Error deleting FAQ(s):", error);
    setSuccessMessage("");
    setErrorMessage("❌ Something went wrong while deleting FAQ(s).");
  }
};

      useEffect(() => {
        const filtered = allData.filter((item) => {
          const curriculumDate = new Date(item.date);
          const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
          const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
      
          const inDateRange =
            (!start || curriculumDate >= start) &&
            (!end || curriculumDate <= end);
      
          const matchesSearch =
            (item.faqTitle || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.date || "").toLowerCase().includes(searchTerm.toLowerCase());
      
          return inDateRange && matchesSearch;
        });
      
        setFilteredCurriculum(filtered);
        setCurrentPage(1);
      }, [allData, searchTerm, startDate, endDate, filterData]);
    
        const handleClickOpen = (row) => {
  setEditedRow(row); 
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

  const today = new Date().toISOString().split("T")[0];
  const payloads = rows
    .filter(r => (r.faqTitle && r.faqTitle.trim()) || (r.description && r.description.trim()))
    .map((r, idx) => ({
      faqTitle: r.faqTitle || "",
      description: htmlToText(r.description),
      date: today,
      
      sortOrder: idx
    }));

  if (payloads.length === 0) {
    alert("Please add at least one row with Title or Description.");
    return;
  }

  try {
    
    for (const p of payloads) {
      await axios.post(`${API_BASE}/add`, p, {
        headers: { "Content-Type": "application/json" }
      });
    }

    alert("All FAQ entries added successfully in the same order.");
    setShowAddCourse(false);
    setCurriculumData({});
    setRows([{ id: Date.now(), faqTitle: "", description: "" }]);
    await fetchData();
  } catch (error) {
    console.error("Bulk add error:", error?.response?.data || error.message);
    alert("Something went wrong while adding FAQs.");
  }
};

    const handleAddTrendingCourseClick = () => setShowAddCourse(true);
  return (
    <>  
     {showAddCourse ?  (<div className='course-category'>
      <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                      <a href="#!" onClick={() => setShowAddCourse(false)}>General FAQ's </a> <MdKeyboardArrowRight />
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                      Add General FAQ's
                      </li>
                    </ol>
                  </nav>
<div className='category'>
<div className='category-header'>
<p style={{ marginBottom: 0 }}>Add General FAQ's</p>
</div>
<div className='course-details'>
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
               <input className='table-curriculum' name='faqTitle' value={row.faqTitle}
        onChange={(e) => handleRowChange(index, 'faqTitle', e.target.value)}/>
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
  {/* <button className='submit-btn' onClick={handleSubmit}></button> */}
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
            <p style={{ marginBottom: 0 }}>View General FAQ's</p>
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
      <button className="filter" onClick={handleDateFilter}>Filter</button>
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
  <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell  align='center' sx={{ width: '100px' }}>
               <Checkbox 
     checked={selectedFaqIds.includes(course.faqId)}
    onChange={() => handleCheckboxChange(course.faqId)}
  />
            </StyledTableCell>
            <StyledTableCell align='center' sx={{ width: '100px' }}>S.No.</StyledTableCell>
            <StyledTableCell align="center">Title</StyledTableCell>
            <StyledTableCell align="center">Description</StyledTableCell>
            <StyledTableCell align="center">Created Date</StyledTableCell>
            <StyledTableCell align="center" sx={{ width: '150px' }}>Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {displayedCategories.length > 0 ? (
  displayedCategories.map((course, index) => (
    <StyledTableRow key={course.curr_id}>
      <StyledTableCell align="center">
       <Checkbox
            checked={selectedFaqIds.includes(course.faqId)}
            onChange={() => handleCheckboxChange(course.faqId)}
          />
      </StyledTableCell>
      <StyledTableCell align="center">
        {index + 1 + (currentPage - 1) * rowsPerPage}
      </StyledTableCell>
      <StyledTableCell align="left" style={{ maxWidth: '500px', wordWrap: 'break-word', whiteSpace: 'pre-line' }} 
      >{course.faqTitle}</StyledTableCell>
      {/* <StyledTableCell align="left">
  <div 
    style={{ maxWidth: '1000px', wordWrap: 'break-word', whiteSpace: 'pre-line' }} 
    dangerouslySetInnerHTML={{ __html: course.description || 'No topics available' }} 
  />
</StyledTableCell> */}
<StyledTableCell align="left" style={{ maxWidth: '1000px', wordWrap: 'break-word', whiteSpace: 'pre-line' }}>
   {htmlToText(course.description) || 'No topics available'}
 </StyledTableCell>
      <StyledTableCell align="center">{course.date ? dayjs(course.date).format('MM-DD-YYYY') : 'N/A'}</StyledTableCell>
      <StyledTableCell align="center">
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <FaEdit className="edit" onClick={() => handleClickOpen(course)} />
          <RiDeleteBin6Line
            className="delete"
            onClick={() => handleDeleteConfirmation(course.faqId)}
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
      totalRows={filteredCurriculum.length} 
      onPageChange={handlePageChange}
    />
              </div>
    {message && <div className="success-message">{message}</div>}
 {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}
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

    <label htmlFor="title">Title</label>
    <input
      id="title"
      className="form-control"
      name="faqTitle"
      value={editedRow.faqTitle || ""}
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