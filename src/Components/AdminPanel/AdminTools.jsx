import  React, { useEffect } from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
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
import axios from 'axios';
import { GoPlus } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { MdKeyboardArrowRight } from 'react-icons/md';
import AdminPagination from './AdminPagination'; 
import 'react-quill/dist/quill.snow.css'
import { FiUpload } from "react-icons/fi";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#00AEEF',
    color: theme.palette.common.white,
    padding: '3px 5px',
    borderRight: '1px solid white', 
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

export default function AdminTools() {
  const [courseCategory,setCourseCategory]=useState([]);
  const [course,setCourse]=useState([]);
  const [filterCourse,setFilterCourse]=useState([]);
  const [searchTerm,setSearchTerm]=useState("");
  const [showAddCourse, setShowAddCourse] = useState(false);
  const[tools,setTools]=useState([]);
  const[filteredTools,setFilteredTools]=useState([])
  const[message,setMessage]=useState(false);
  const [startDate, setStartDate] = useState(null);
  const [displayedCategories, setDisplayedCategories] = useState([]);
  const [allData, setAllData] = useState([]); 
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [filterData, setFilterData] = useState({
    category_name: "",
    courseName: "",
  });
  const [rows, setRows] = useState([
    { id: Date.now(), tool_image: null, preview: null }
  ]);
  const [endDate, setEndDate] = useState(null);
  const [toolsData, setToolsData] = useState({
    tool_id: "",
    category_name: '',
    courseName: '',
    toolsName: '',
    toolsLink: '',
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
    setRows([...rows, { id: Date.now(), tool_image: null, preview: null }]);
  };
  
  const deleteRow = (id) => {
    setRows(rows.filter(row => row.id !== id));
  }; 

  const handleRowsPerPageChange = (rowsCount) => {
    setRowsPerPage(rowsCount);
    setCurrentPage(1); 
  };

  const handleReset=()=>{
    setToolsData({
      tool_id:"",
      category_name:"",
      courseName: "",
      toolsName: "",
      toolsLink: "",
    });
    setRows([{ id: Date.now(), tool_image: null, preview: null }]);
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get("https://api.hachion.co/course-categories/all");
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

  useEffect(() => {
    if (!toolsData.category_name) {
      setFilterCourse([]);
      return;
    }

    const matched = (courseCategory || []).filter(c => {
      const cat = (c.category_name || c.category || "").toString().trim();
      return cat === toolsData.category_name;
    });

    const normalized = matched.map((c) => ({
      id: c.id || c._id || c.course_id || `${c.courseName}-${c.id}`,
      courseName: c.courseName || c.title || c.name || ""
    })).filter(c => !!c.courseName);

    setFilterCourse(normalized);
  }, [toolsData.category_name, courseCategory]);

  const normalizeToDate = (val) => {
    if (!val) return null;
    if (dayjs.isDayjs(val)) return val.toDate();
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  };

  const handleDateFilter = () => {
    const filtered = tools.filter((item) => {
      const toolsDate = normalizeToDate(item.date);
      const start = startDate ? dayjs(startDate).startOf('day').toDate() : null;
      const end = endDate ? dayjs(endDate).endOf('day').toDate() : null;

      const matchSearch =
        (item.category_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.courseName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.date ? dayjs(item.date).format('YYYY-MM-DD') : "").toLowerCase().includes(searchTerm.toLowerCase());

      const inRange =
        (!start || (toolsDate && toolsDate >= start)) &&
        (!end || (toolsDate && toolsDate <= end));

      return matchSearch && inRange;
    });

    setFilteredTools(filtered);
  };

  const handleDateReset = () => {
    setStartDate(null);
    setEndDate(null);
    setSearchTerm('');
    setFilteredTools(tools);
  };

  useEffect(() => {
    const filtered = allData.filter((item) => {
      const toolsDate = normalizeToDate(item.date);
      const start = startDate ? dayjs(startDate).startOf('day').toDate() : null;
      const end = endDate ? dayjs(endDate).endOf('day').toDate() : null;

      const inDateRange =
        (!start || (toolsDate && toolsDate >= start)) &&
        (!end || (toolsDate && toolsDate <= end));

      const matchesSearch =
        (item.category_name || "").toLowerCase().includes((searchTerm || "").toLowerCase()) ||
        (item.courseName || "").toLowerCase().includes((searchTerm || "").toLowerCase()) ||
        (item.date ? dayjs(item.date).format('YYYY-MM-DD') : "").toLowerCase().includes((searchTerm || "").toLowerCase());

      const matchesCategory =
        !filterData.category_name || item.category_name === filterData.category_name;

      const matchesCourse =
        !filterData.courseName || item.courseName === filterData.courseName;

      return inDateRange && matchesSearch && matchesCategory && matchesCourse;
    });

    setFilteredTools(filtered);
    setCurrentPage(1);
  }, [allData, searchTerm, startDate, endDate, filterData]);

  useEffect(() => {
    const startIdx = (currentPage - 1) * rowsPerPage;
    const endIdx = startIdx + rowsPerPage;
    setDisplayedCategories(filteredTools.slice(startIdx, endIdx));
  }, [filteredTools, currentPage, rowsPerPage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setToolsData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    if (name === 'category_name') {
      setToolsData((prev) => ({ ...prev, courseName: "" }));
    }
  };

  const handleAddTrendingCourseClick = () => {
    setShowAddCourse(true);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleImageSelect = (file, index) => {
    if (!file) return;
    const updated = [...rows];
    updated[index].tool_image = file;
    updated[index].preview = URL.createObjectURL(file);
    setRows(updated);
  };

  const handleSubmit = () => {
    if (!toolsData.category_name || !toolsData.courseName) {
      setErrorMessage("Please select Category Name and Course Name.");
      setSuccessMessage("");
      return;
    }
    const selectedImages = rows
      .filter(r => !!r.tool_image)
      .map(r => ({ name: r.tool_image.name, url: r.preview }));

    const payload = {
      curr_id: toolsData.tool_id || Date.now(),
      category_name: toolsData.category_name,
      courseName: toolsData.courseName,
      tool_image: selectedImages,
      date: new Date()
    };

    if (toolsData.tool_id) {
      const updated = allData.map(item => item.curr_id === toolsData.tool_id ? payload : item);
      setAllData(updated);
      setSuccessMessage("Tools updated successfully.");
    } else {
      setAllData([payload, ...allData]);
      setSuccessMessage("Tools added successfully.");
    }
    setErrorMessage("");
    setToolsData({ tool_id: "", category_name: "", courseName: "" });
    setRows([{ id: Date.now(), tool_image: null, preview: null }]);
    setShowAddCourse(false);
  };

  const handleEditClick = (row) => {
    setToolsData({
      tool_id: row.curr_id,
      category_name: row.category_name,
      courseName: row.courseName,
    });
    const incoming = (row.tool_image || []);
    if (incoming.length > 0) {
      const preRows = incoming.map((img) => ({
        id: Date.now() + Math.random(),
        tool_image: null,
        preview: img.url || null
      }));
      setRows(preRows.length ? preRows : [{ id: Date.now(), tool_image: null, preview: null }]);
    } else {
      setRows([{ id: Date.now(), tool_image: null, preview: null }]);
    }
    setShowAddCourse(true);
  };

  const handleDeleteClick = (id) => {
    const updated = allData.filter(item => item.curr_id !== id);
    setAllData(updated);
    setSuccessMessage("Tools deleted.");
    setErrorMessage("");
  };

  useEffect(() => {
    setTools(allData);
    setFilteredTools(allData);
  }, [allData]);

  return (
    <>  
      {showAddCourse ?  (
        <div className='course-category'>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#!" onClick={() => setShowAddCourse(false)}>Tools Covered </a> <MdKeyboardArrowRight />
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {toolsData.tool_id ? "Edit Tools" : "Add Tools"}
              </li>
            </ol>
          </nav>
          <div className='category'>
            <div className='category-header'>
              <p style={{ marginBottom: 0 }}>{toolsData.tool_id ? "Edit Tools" : "Add Tools"}</p>
            </div>
            <div className='course-details'>
              <div className='course-row'>
                <div className="col-md-3">
                  <label htmlFor="inputState" className="form-label">Category Name</label>
                  <select id="inputState" className="form-select" name='category_name' value={toolsData.category_name} onChange={handleChange}>
                    <option value="" disabled>
                      Select Category
                    </option>
                    {course.map((curr) => (
                      <option key={curr.id || curr._id || curr.name} value={curr.name}>
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
                    name="courseName"
                    value={toolsData.courseName}
                    onChange={handleChange}
                    disabled={!toolsData.category_name}
                  >
                    <option value="" disabled>Select Course</option>
                    {filterCourse.map((curr) => (
                      <option key={curr.id} value={curr.courseName}>{curr.courseName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <TableContainer component={Paper}>
                <Table sx={{ maxWidth: 800,marginTop:5 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">Tools Images</StyledTableCell>
                      <StyledTableCell align="center">Tools Name</StyledTableCell>
                      <StyledTableCell align="center">Tools Download Link</StyledTableCell>
                      <StyledTableCell align="center" sx={{ width: '150px' }}>Add/Delete Row</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, index) => (
                      <StyledTableRow key={row.id}>
                        <StyledTableCell align="center">
                          {row.preview ? (
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                              <img
                                src={row.preview}
                                alt="tool"
                                style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid #ccc' }}
                              />
                              <IoClose
                                style={{
                                  position: 'absolute',
                                  top: -8,
                                  right: -8,
                                  fontSize: '1.2rem',
                                  color: 'red',
                                  cursor: 'pointer',
                                  backgroundColor: '#fff',
                                  borderRadius: '50%',
                                }}
                                onClick={() => {
                                  const updated = [...rows];
                                  updated[index].tool_image = null;
                                  updated[index].preview = null;
                                  setRows(updated);
                                }}
                              />
                            </div>
                          ) : (
                            <label style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                              <FiUpload className="edit" />
                              <span>Upload Image</span>
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => handleImageSelect(e.target.files?.[0], index)}
                              />
                            </label>
                          )}
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                          <input
                            className='table-curriculum'
                            name='toolsName'
                            value={row.toolsName}
                            onChange={(e) => handleRowChange(index, 'toolsName', e.target.value)}
                          />
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                          <input
                            className='table-curriculum'
                            name='toolsLink'
                            value={row.toolsLink}
                            onChange={(e) => handleRowChange(index, 'toolsLink', e.target.value)}
                          />
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                          <GoPlus onClick={addRow} style={{ fontSize: '2rem', color: '#00AEEF', marginRight: '10px' }} />
                          <IoClose onClick={() => deleteRow(row.id)} style={{ fontSize: '2rem', color: 'red' }} />
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <div className="course-row" style={{ gap: 12 }}>
                <button className='submit-btn' onClick={handleSubmit}>
                  {toolsData.tool_id ? "Update" : "Submit"}
                </button>
                <button className='reset-btn' onClick={handleReset}>Reset</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className='course-category'>
              <div className='category'>
                <div className='category-header'>
                  <p style={{ marginBottom: 0 }}>Tools Covered</p>
                </div>

                <div className='date-schedule'>
                  Start Date
                  <DatePicker 
                    value={startDate}
                    onChange={(date) => setStartDate(date)}
                    slotProps={{ actionBar: { actions: ['clear'] } }}
                    sx={{
                      '& .MuiIconButton-root':{color: '#00aeef'}
                    }}
                  />
                  End Date
                  <DatePicker 
                    value={endDate}
                    onChange={(date) => setEndDate(date)} 
                    slotProps={{ actionBar: { actions: ['clear'] } }}
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
                      <input
                        className="search-input"
                        type="search"
                        placeholder="Enter Courses, Category or Keywords"
                        aria-label="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button className="btn-search" type="button"><IoSearch style={{ fontSize: '2rem' }} /></button>
                    </div>
                    <button type="button" className="btn-category" onClick={handleAddTrendingCourseClick} >
                      <FiPlus /> Add Tools
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
                  <StyledTableCell  align='center' sx={{ width: '50px' }}>
                    <Checkbox />
                  </StyledTableCell>
                  <StyledTableCell align='center' sx={{ width: '80px' }}>S.No.</StyledTableCell>
                  <StyledTableCell align="center">Category Name</StyledTableCell>
                  <StyledTableCell align="center">Course Name</StyledTableCell>
                  <StyledTableCell align="center">Tools Images</StyledTableCell>
                  <StyledTableCell align="center">Tools Name</StyledTableCell>
                  <StyledTableCell align="center">Tools Download Link</StyledTableCell>
                  <StyledTableCell align="center">Created Date</StyledTableCell>
                  <StyledTableCell align="center" sx={{ width: '100px' }}>Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedCategories.length > 0 ? (
                  displayedCategories.map((courseRow, index) => (
                    <StyledTableRow key={courseRow.curr_id}>
                      <StyledTableCell align="center">
                        <Checkbox />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {index + 1 + (currentPage - 1) * rowsPerPage}
                      </StyledTableCell>
                      <StyledTableCell align="left">{courseRow.category_name}</StyledTableCell>
                      <StyledTableCell align="left">{courseRow.courseName}</StyledTableCell>
                      <StyledTableCell align="left">
                        {(courseRow.tool_image || []).length ? (
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {courseRow.tool_image.slice(0, 4).map((img, i) => (
                              <img key={i} src={img.url} alt={img.name} style={{ width: 40, height: 28, objectFit: 'cover', borderRadius: 4, border: '1px solid #ddd' }} />
                            ))}
                            {courseRow.tool_image.length > 4 && <span>+{courseRow.tool_image.length - 4}</span>}
                          </div>
                        ) : ("")}
                      </StyledTableCell>
                      <StyledTableCell align="left">{courseRow.toolsName}</StyledTableCell>
                      <StyledTableCell align="left">{courseRow.toolsLink}</StyledTableCell>
                      <StyledTableCell align="center">
                        {courseRow.date ? dayjs(courseRow.date).format('MM-DD-YYYY') : 'N/A'}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                          <FaEdit className="edit" onClick={() => handleEditClick(courseRow)} style={{ cursor: 'pointer' }} />
                          <RiDeleteBin6Line className="delete" onClick={() => handleDeleteClick(courseRow.curr_id)} style={{ cursor: 'pointer' }} />
                        </div>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <StyledTableRow>
                    <StyledTableCell colSpan={9} align="center">
                      No data available.
                    </StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
          {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}

          {(filteredTools.length > 0) && (
            <div className='pagination-container'>
              <AdminPagination
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                totalRows={filteredTools.length} 
                onPageChange={handlePageChange}
              />
            </div>
          )}

          {message && <div className="success-message">{message}</div>}
        </div>
      )}
    </>
  );
}
