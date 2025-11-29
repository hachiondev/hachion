import React, { useEffect, useState } from 'react';
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
import { FiPlus, FiUpload } from 'react-icons/fi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import axios from 'axios';
import { GoPlus } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { MdKeyboardArrowRight } from 'react-icons/md';
import AdminPagination from './AdminPagination'; 

const sortImages = (arr) =>
  arr.slice().sort((a, b) =>
    (a.categoryName || '').localeCompare(b.categoryName || '', 'en', { sensitivity: 'base' }) ||
    (a.courseName   || '').localeCompare(b.courseName   || '', 'en', { sensitivity: 'base' }) ||
    (a.originalFileName || '').localeCompare(b.originalFileName || '', 'en', { numeric: true, sensitivity: 'base' })
  );

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
    whiteSpace: 'nowrap',
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

export default function AdminUploadImage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [images, setImages] = useState([]); 
  const [filteredImages, setFilteredImages] = useState([]); 
  const [message, setMessage] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  
  const [course, setCourse] = useState([]); 
  const [courseCategory, setCourseCategory] = useState([]); 
  const [filterCourse, setFilterCourse] = useState([]); 
const [courseNames, setCourseNames] = useState([]);

  const [rows, setRows] = useState([{ id: Date.now(), tool_image: null, preview: null }]);

  const [imageData, setImageData] = useState({
    image_id: "",
    image_name: '',
    image_url: '',
    category_name: '',
    courseName: '',
  });

  
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  
  // const dataSource = filteredImages.length ? filteredImages : images;
  // const displayedCategories = dataSource.slice(
  //   (currentPage - 1) * rowsPerPage,
  //   currentPage * rowsPerPage
  // );

  const baseData = filteredImages.length ? filteredImages : images;
const dataSource = sortImages(baseData); // <-- enforce order here
const displayedCategories = dataSource.slice(
  (currentPage - 1) * rowsPerPage,
  currentPage * rowsPerPage
);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, window.scrollY);
  };

  const handleRowsPerPageChange = (rowsCount) => {
    setRowsPerPage(rowsCount);
    setCurrentPage(1); 
  };

  
  const addRow = () => setRows(prev => [...prev, { id: Date.now(), tool_image: null, preview: null }]);
  const deleteRow = (id) => setRows(prev => prev.filter(row => row.id !== id));

  const handleReset = () => {
    setImageData({
      image_id: "",
      image_name: "",
      image_url: "",
      category_name: '',
      courseName: '',
    });
    setRows([{ id: Date.now(), tool_image: null, preview: null }]);
    setSuccessMessage('');
    setErrorMessage('');
  };

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setImageData(prev => ({ ...prev, [name]: value }));

    if (name === "category_name") {
      
      const filtered = courseCategory.filter(c => {
        
        return (
          c.category_name === value ||
          c.category === value ||
          c.categoryName === value
        );
      });
      setFilterCourse(filtered);
      setImageData(prev => ({ ...prev, courseName: "" }));
    }
  };

  
  // const handleDateFilter = () => {
  //   const filtered = images.filter((item) => {
  //     const imageDate = item.date ? new Date(item.date) : null;
  //     const start = startDate ? dayjs(startDate).startOf('day').toDate() : null;
  //     const end = endDate ? dayjs(endDate).endOf('day').toDate() : null;

  //     const matchSearch =
  //       (item.image_name || "").toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       (item.image_url || "").toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       (item.date ? dayjs(item.date).format('YYYY-MM-DD') : "").toLowerCase().includes(searchTerm.toLowerCase());

  //     const inRange =
  //       (!start || (imageDate && imageDate >= start)) &&
  //       (!end || (imageDate && imageDate <= end));

  //     return matchSearch && inRange;
  //   });

  //   setFilteredImages(filtered);
  //   setCurrentPage(1);
  // };

  const handleDateFilter = () => {
  const start = startDate ? dayjs(startDate).startOf('day') : null;
  const end   = endDate   ? dayjs(endDate).endOf('day')   : null;

  const filtered = images.filter((item) => {
    const d = item.createdDate ? dayjs(item.createdDate) : null;
    const inRange =
      (!start || (d && d.isAfter(start.subtract(1, 'millisecond')))) &&
      (!end   || (d && d.isBefore(end.add(1, 'millisecond'))));
    return inRange;
  });

  setFilteredImages(sortImages(filtered));
  setCurrentPage(1);
};

  const handleDateReset = () => {
    setStartDate(null);
    setEndDate(null);
    setSearchTerm('');
    setFilteredImages([]);
    setCurrentPage(1);
  };

  const handleAddTrendingCourseClick = () => {
    setShowAddCourse(true);
    setSuccessMessage("");
    setErrorMessage("");
  };  
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get("https://api.test.hachion.co/course-categories/all");
        setCourse(response.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };
    fetchCategory();
  }, []);

  useEffect(() => {
  if (imageData.category_name) {   
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `https://api.test.hachion.co/courses/coursenames-by-category?categoryName=${encodeURIComponent(imageData.category_name)}`
        );
        setCourseNames(response.data || []);
      } catch (error) {
        console.error("Error fetching course names:", error.message);
      }
    };
    fetchCourses();
  }
}, [imageData.category_name]);


  useEffect(() => {
    const fetchImages = async () => {
      try {
        const resp = await axios.get("https://api.test.hachion.co/upload_images/all"); // adjust endpoint if different
        if (resp && resp.data) setImages(resp.data);
      } catch (err) {
      }
    };
    fetchImages();
  }, []);

  const handleFileChangeForRow = (e, index) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const updated = [...rows];
      updated[index].tool_image = file;
      updated[index].preview = URL.createObjectURL(file);
      setRows(updated);
    }
  };
const handleDelete = async (fileName) => {
  if (!window.confirm("Are you sure you want to delete this image?")) return;

  try {
    const response = await axios.delete(`https://api.test.hachion.co/upload_images/delete/${fileName}`);
    

    // setImages(prev =>
    //   prev.filter(courseRow => courseRow.fileName !== fileName)
    // );
setImages(prev => prev.filter(row => row.fileName !== fileName));
setFilteredImages(prev => prev.filter(row => row.fileName !== fileName));

    alert(response.data); 
  } catch (error) {
    console.error("Error deleting:", error);
    alert(error.response?.data || "Failed to delete");
  }
};


  return (
    <>  
      {showAddCourse ? (
        <div className='course-category'>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#!" onClick={() => setShowAddCourse(false)}>Uploaded Images </a> <MdKeyboardArrowRight />
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Upload Image
              </li>
            </ol>
          </nav>

          <div className='category'>
            <div className='category-header'>
              <p style={{ marginBottom: 0 }}> Upload Image</p>
            </div>

            <div className='course-details'>
              <div className='course-row'>
                <div className="col-md-3">
                  <label htmlFor="inputState" className="form-label">Category Name</label>
                  <select
                    id="inputState"
                    className="form-select"
                    name='category_name'
                    value={imageData.category_name}
                    onChange={handleChange}
                  >
                    <option value="">Select Category</option>
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
    value={imageData.courseName}
    onChange={handleChange}
    disabled={!imageData.category_name}
  >
    <option value="">Select Course</option>
    {courseNames.map((course, idx) => (
      <option key={idx} value={course}>
        {course}
      </option>
    ))}
  </select>
</div>
              </div>

              <div className='course-details'>
                <TableContainer component={Paper}>
                  <Table aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="center">Images</StyledTableCell>
                        <StyledTableCell align="center">Add/Delete Row</StyledTableCell>
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
                                  onChange={(e) => handleFileChangeForRow(e, index)}
                                />
                              </label>
                            )}
                          </StyledTableCell>

                          <StyledTableCell align='center'>
                            <GoPlus onClick={addRow} style={{ fontSize: '2rem', color: '#00AEEF', marginRight: '10px', cursor: 'pointer' }} />
                            <IoClose onClick={() => deleteRow(row.id)} style={{ fontSize: '2rem', color: 'red', cursor: 'pointer' }} />
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <div className="course-row" style={{ gap: 12, marginTop: 12 }}>
                 <button
  className='submit-btn'
  onClick={async () => {
    

    
    setErrorMessage("");
    setSuccessMessage("");

    try {
      
      if (!imageData.category_name || !imageData.courseName) {
      
        setErrorMessage("Please select category and course");
         setTimeout(() => setErrorMessage(""), 3000);
        return;
      }
      

      const hasFiles = rows.some(r => r.tool_image);
      if (!hasFiles) {
        
        setErrorMessage("Please upload at least one image");
         setTimeout(() => setErrorMessage(""), 3000);
        return;
      }
      
      const fd = new FormData();
      fd.append('categoryName', imageData.category_name);
      fd.append('courseName', imageData.courseName);
      rows.forEach((r, index) => {
        if (r.tool_image) {
          
          fd.append('files', r.tool_image);
        }
      });

      
      const response = await axios.post(
        'https://api.test.hachion.co/upload_images/upload',
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      
      setSuccessMessage(response.data || "Images uploaded successfully");

      // handleReset(); 

      const resp = await axios.get("https://api.test.hachion.co/upload_images/all");
      
      setImages(resp.data || []);

    } catch (err) {
      
      setErrorMessage(err.response?.data || "Error uploading images");
    }
  }}
>
  Submit
</button>

{successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
{errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}


                  <button className='reset-btn' onClick={handleReset}>Reset</button>
                </div>
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
                  <p style={{ marginBottom: 0 }}>Uploaded Images</p>
                </div>

                <div className='date-schedule' style={{ alignItems: 'center' }}>
                  <span style={{ marginRight: 8 }}>Start Date</span>
                  <DatePicker 
                    value={startDate}
                    onChange={(date) => setStartDate(date)}
                    slotProps={{ actionBar: { actions: ['clear'] } }}
                    sx={{'& .MuiIconButton-root':{color: '#00aeef'}, mr: 1}}
                  />
                  <span style={{ marginLeft: 12, marginRight: 8 }}>End Date</span>
                  <DatePicker 
                    value={endDate}
                    onChange={(date) => setEndDate(date)} 
                    slotProps={{ actionBar: { actions: ['clear'] } }}
                    sx={{'& .MuiIconButton-root':{color: '#00aeef'}}}
                  />
                  <button className="filter" onClick={handleDateFilter} style={{ marginLeft: 12 }}>Filter</button>
                  <button className="filter" onClick={handleDateReset} style={{ marginLeft: 8 }}>Reset</button>
                </div>

                <div className='entries' style={{ alignItems: 'center' }}>
                  <div className='entries-left' style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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

                  <div className='entries-right' style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div className="search-div" role="search" style={{ border: '1px solid #d3d3d3' }}>
                      <input
                        className="search-input"
                        type="search"
                        placeholder="Enter Image Name or Keywords"
                        aria-label="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button
                        className="btn-search"
                        type="button"
                        // onClick={() => {
                          
                        //   const filtered = images.filter(item =>
                        //     (item.image_name || '').toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                        //     (item.image_url || '').toString().toLowerCase().includes(searchTerm.toLowerCase())
                        //   );
                        //   setFilteredImages(filtered);
                        //   setCurrentPage(1);
                        // }}
                        onClick={() => {
  const q = searchTerm.toLowerCase();
  const filtered = images.filter(item =>
    (item.originalFileName || '').toLowerCase().includes(q) ||
    (item.fileUrl || '').toLowerCase().includes(q) ||
    (item.categoryName || '').toLowerCase().includes(q) ||
    (item.courseName || '').toLowerCase().includes(q)
  );
  setFilteredImages(sortImages(filtered)); // keep it sorted
  setCurrentPage(1);
}}

                      >
                        <IoSearch style={{ fontSize: '2rem' }} />
                      </button>
                    </div>

                    <button type="button" className="btn-category" onClick={handleAddTrendingCourseClick} >
                      <FiPlus /> Upload Image
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
                  <StyledTableCell align='center' sx={{ width: '50px' }}>
                    <Checkbox />
                  </StyledTableCell>
                  <StyledTableCell align='center' sx={{ width: '80px' }}>S.No.</StyledTableCell>
                  <StyledTableCell align="center">Category Name</StyledTableCell>
                  <StyledTableCell align="center">Course Name</StyledTableCell>
                  <StyledTableCell align="center">Images</StyledTableCell>
                  <StyledTableCell align="center">Image Names</StyledTableCell>
                  <StyledTableCell align="center">Image URL</StyledTableCell>
                  <StyledTableCell align="center">Created Date</StyledTableCell>
                  <StyledTableCell align="center" sx={{ width: '100px' }}>Action</StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
  {displayedCategories.length > 0 ? (
    displayedCategories.map((courseRow, index) => (
      // <StyledTableRow key={courseRow.uploadImagesCategoryId || index}>
      <StyledTableRow key={courseRow.fileUrl || `${courseRow.uploadImagesCategoryId}-${courseRow.fileName}`}>

        <StyledTableCell align="center"><Checkbox /></StyledTableCell>
        <StyledTableCell align="center">{index + 1 + (currentPage - 1) * rowsPerPage}</StyledTableCell>
        <StyledTableCell align="left">{courseRow.categoryName}</StyledTableCell>
        <StyledTableCell align="left">{courseRow.courseName}</StyledTableCell>

        <StyledTableCell align="left">
  {courseRow.fileUrl ? (
    <img
      src={courseRow.fileUrl}  
      alt={courseRow.originalFileName} 
      style={{
        width: 40,
        height: 28,
        objectFit: 'cover',
        borderRadius: 4,
        border: '1px solid #ddd'
      }}
    />
  ) : (
    ""
  )}
</StyledTableCell>


        <StyledTableCell align="left">
          {courseRow.originalFileName}
        </StyledTableCell>
        <StyledTableCell align="left">
          {courseRow.fileUrl}
        </StyledTableCell>

        <StyledTableCell align="center">
          {courseRow.createdDate ? dayjs(courseRow.createdDate).format('MM-DD-YYYY') : 'N/A'}
        </StyledTableCell>

        <StyledTableCell align="center">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
             <RiDeleteBin6Line
    className="delete"
    style={{ cursor: 'pointer', color: 'red', fontSize: '1.2rem' }}
     onClick={() => handleDelete(courseRow.fileName)}
  />           
          </div>
        </StyledTableCell>
      </StyledTableRow>
    ))
  ) : (
    <StyledTableRow>
      <StyledTableCell colSpan={9} align="center">No data available.</StyledTableCell>
    </StyledTableRow>
  )}
</TableBody>

            </Table>
          </TableContainer>

         
          {dataSource.length > 0 && (
            <div className='pagination-container' style={{ marginTop: 12 }}>
              <AdminPagination
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                totalRows={dataSource.length}
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
