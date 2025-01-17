import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
import success from '../../Assets/success.gif';
import { RiCloseCircleLine } from 'react-icons/ri';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { IoSearch } from 'react-icons/io5';
import { FiPlus } from 'react-icons/fi';
import { MdKeyboardArrowRight } from 'react-icons/md';
import AdminPagination from './AdminPagination'; 

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#00AEEF',
    color: theme.palette.common.white,
    borderRight: '1px solid white',
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
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

const Blogs = () => {
  const [formMode, setFormMode] = useState('Add'); 

  const [searchTerm,setSearchTerm]=useState("");
  const[blogs,setBlogs]=useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddCourse,setShowAddCourse]=useState(false);
  const [filteredBlogs,setFilteredBlogs]=useState([])
  const[message,setMessage]=useState(false);
  const currentDate = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
  const [formData, setFormData] = useState({
    id:"",
   category_name:"",
   title:"",
   author:"",
   blog_image:"",
   blog_pdf:"",
   description:"",
    date:currentDate,
  });
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get("http://160.153.175.69:8080/course-categories/all");
        setCategories(response.data); // Assuming the data contains an array of trainer objects
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };
    fetchCategory();
  }, []);
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prevState) => ({ ...prevState, blog_pdf: file }));
  };
  useEffect(() => {
    const filtered = blogs.filter(blogs =>
        blogs.category_name.toLowerCase().includes(searchTerm.toLowerCase())||
        blogs.title.toLowerCase().includes(searchTerm.toLowerCase())||
        blogs.author.toLowerCase().includes(searchTerm.toLowerCase())
        
    );
    setFilteredBlogs(filtered);
}, [searchTerm, blogs]);
  useEffect(() => {
    const fetchBlogs = async () => {
        try {
            const response = await axios.get('http://160.153.175.69:8080/HachionUserDashboad/blog/blog');
            setBlogs(response.data); // Use the curriculum state
        } catch (error) {
            console.error("Error fetching blogs:", error.message);
        }
    };
    fetchBlogs();
    setFilteredBlogs(blogs)
}, [blogs]);
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  setFormData((prevState) => ({ ...prevState, blog_image: file }));
};
const handleSubmit = async (e) => {
  e.preventDefault();

  const currentDate = new Date().toISOString().split("T")[0]; // Today's date

  // Create FormData object
  const formDataToSend = new FormData();
  formDataToSend.append("category_name", formData.category_name);
  formDataToSend.append("title", formData.title);
  formDataToSend.append("author", formData.author);
  formDataToSend.append("description", formData.description);
  formDataToSend.append("date", currentDate);

  // Add files to FormData
  if (formData.blog_image) formDataToSend.append("blog_image", formData.blog_image);
  if (formData.blog_pdf) formDataToSend.append("blog_pdf", formData.blog_pdf);

  try {
    if (formData.id) {
      // Edit operation
      const response = await axios.put(
        `http://160.153.175.69:8080/HachionUserDashboad/blog/blog/update/${formData.id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        alert("Blog updated successfully");
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog.id === formData.id ? { ...blog, ...response.data } : blog
          )
        );
      }
    } else {
      // Add operation
      const response = await axios.post(
        "http://160.153.175.69:8080/HachionUserDashboad/blog/blog/add",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        alert("Blog added successfully");
        setBlogs((prevBlogs) => [...prevBlogs, response.data]);
      }
    }

    handleReset(); // Clear form fields
  } catch (error) {
    console.error("Error submitting blog:", error.message);
    alert("Error submitting blog.");
  }
};

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
const displayedCategories = filteredBlogs.slice(
  (currentPage - 1) * rowsPerPage,
  currentPage * rowsPerPage
);
  
const handleReset=()=>{
  setFormData([{
    id:"",
   category_name:"",
   title:"",
   author:"",
   blog_image:"",
   blog_pdf:"",
   description:"",
    date:currentDate,
       }]);

}
const handleDeleteConfirmation = (id) => {
  if (window.confirm("Are you sure you want to delete this Blogs?")) {
    handleDelete(id);
  }
};
const handleDelete = async (id) => {
       
  try { 
   const response = await axios.delete(`http://160.153.175.69:8080/HachionUserDashboad/blog/blog/delete/${id}`); 
   console.log("Blogs deleted successfully:", response.data); 
 } catch (error) { 
   console.error("Error deleting Blogs:", error); 
 } }; 

   
 const handleCloseModal=()=>{
  setShowAddCourse(false);
 
}
const handleEditClick = async (id) => {
  setFormMode('Edit');
  setShowAddCourse(true);
  try {
    const response = await fetch(`http://160.153.175.69:8080/HachionUserDashboad/blog/blog/${id}`);
    if (response.ok) {
      const blog = await response.json();
      setFormData({
        id: blog.id, // Ensure the unique identifier is included
        category_name: blog.category_name || '',
        blog_image: '', // Handle file uploads differently if needed
       blog_pdf: '',
        author: blog.author || '',
        title: blog.title || '',
        description: blog.description || '',
       
      });
    } else {
      console.error('Failed to fetch blogs');
    }
  } catch (error) {
    console.error('Error fetching blogs:', error);
  }
};

  const handleAddTrendingCourseClick = () => {
    setFormMode('Add'); // Explicitly set formMode to 'Add'
    setShowAddCourse(true); // Show the form
    handleReset(); // Reset the form fields for a clean form
  };
  
  return (<>{
    showAddCourse?( <> <div className="course-category">
      <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                <a href="#!" onClick={() => {
                setShowAddCourse(false); // Hide the add/edit form
                setFormMode('Add'); // Reset to 'Add' mode
                handleReset(); // Clear any existing form data
            }}>
              Blogs
            </a>
            <MdKeyboardArrowRight />
                </li>
                <li className="breadcrumb-item active" aria-current="page">
      {formMode === 'Add' ? 'Add Course Details' : 'Edit Course Details'}
    </li>
              </ol>
            </nav>
      <div className="category">
        <div className="category-header">
          <p>{formMode === 'Add' ? 'Add Course Details' : 'Edit Course Details'}</p>
        </div>
        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}
        </div>
        <form onSubmit={handleSubmit} enctype="multipart/form-data">
          <div className='course-details'>
            <div className="course-row">
              <div className="col-md-4">
                <label className="form-label">Category Name</label>
                <select id="inputState" class="form-select" name='category_name' value={formData.category_name} onChange={handleInputChange}>
    <option value="" disabled>
          Select Category
        </option>
        {categories.map((curr) => (
          <option key={curr.id} value={curr.name}>
            {curr.name}
          </option>
        ))}
    
                </select>
              </div>
             
              <div className="col-md-4">
                <label className="form-label">Blog Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="Enter Title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="course-row">
              <div className="col-md-4">
                <label className="form-label">Author</label>
                <input
                  type="text"
                  name="author"
                  className="form-control"
                  placeholder="Enter author name"
                  value={formData.author}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Blog Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="blog_image"
                   accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div class="mb-3">
  <label for="formFile" class="form-label">Blog PDF</label>
  <input
    className="form-control"
    type="file"
    name="blog_pdf"
    accept="application/pdf"
    id="formFile"
    onChange={handleFileUpload}
/>
</div>
</div>
              <div className="col-md-4">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  name="description"
                  className="form-control"
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="course-row">
            <button className='submit-btn' data-bs-toggle='modal'
                  data-bs-target='#exampleModal'type='submit'>{formMode === 'Add' ? 'Submit' : 'Update'}</button>
              <button type="button" className="reset-btn" onClick={handleReset}>
                Reset
              </button>
              
            </div>
            </form>
            </div>
   </> ):(   <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="course-category">
        <p>Blog</p>
        <div className="category">
          <div className="category-header">
            <p>Blog Details</p>
          </div>
          <div className="date-schedule">
            Start Date
            <DatePicker value={startDate} onChange={(date) => setStartDate(date)} 
              sx={{
                '& .MuiIconButton-root':{color: '#00aeef'}
              }}/>
            End Date
            <DatePicker value={endDate} onChange={(date) => setEndDate(date)}
            sx={{
               '& .MuiIconButton-root':{color: '#00aeef'}
            }} />
            <button className="filter" >
              Filter
            </button>
          </div>
          <div className="entries">
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
            <div className="entries-right">
            <div className="search">
            <div className="search-div" role="search" style={{ border: '1px solid #d3d3d3' }}>
            <input
      className="search-input"
      type="search"
      placeholder="Enter Courses, Category or Keywords"
      aria-label="Search"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
              <button className="btn-search" >
                <IoSearch />
              </button>
              </div>
              </div>
              <button className="btn-category" onClick={handleAddTrendingCourseClick}>
                <FiPlus />
               Add Blog
              </button>
            </div>
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
                <StyledTableCell sx={{ width: 220, fontSize: '16px' }} align="center">Category Name</StyledTableCell>
                <StyledTableCell sx={{ fontSize: '16px' }} align="center">Blog Image</StyledTableCell>
                <StyledTableCell sx={{ width: 200, fontSize: '16px' }} align="center">Blog Title</StyledTableCell>
                <StyledTableCell sx={{ width: 200, fontSize: '16px' }} align="center">Author</StyledTableCell>
                <StyledTableCell sx={{ width: 200, fontSize: '16px' }} align="center">Blog PDF</StyledTableCell>
                <StyledTableCell sx={{ width: 200, fontSize: '16px' }} align="center">Description</StyledTableCell>
                <StyledTableCell sx={{ width: 200, fontSize: '16px' }} align="center">Created Date</StyledTableCell>
                <StyledTableCell sx={{ width: 200, fontSize: '16px' }} align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
      {displayedCategories.length > 0 ? (
        displayedCategories.map((blogs, index) => (
          <StyledTableRow key={blogs.id}>
            <StyledTableCell sx={{ width: 100 }} align="center">
              <Checkbox />
            </StyledTableCell>
            <StyledTableCell sx={{ width: 150, fontSize: '16px' }} align="center">{index + 1 + (currentPage - 1) * rowsPerPage}
            </StyledTableCell>
            <StyledTableCell sx={{ fontSize: '16px' }} align="left">
              {blogs.category_name}
            </StyledTableCell>
            <StyledTableCell sx={{ width: 220}} align="center">
            {blogs.blog_image ? (
    <img
    src={`http://160.153.175.69:8080/${blogs.blog_image}`} 
      alt={blogs.category_name}
      width="50"
    />
  ) : (
    'No Image'
  )}
            </StyledTableCell>
          
            <StyledTableCell sx={{ width: 200, fontSize: '16px' }} align="center">{blogs.title}</StyledTableCell>
            <StyledTableCell sx={{ width: 200, fontSize: '16px' }} align="center">{blogs.author}</StyledTableCell>
            <StyledTableCell sx={{ width: 200, fontSize: '16px' }} align="center">  <p>
    <a 
      href={`http://160.153.175.69:8080/${blogs.blog_pdf}`} 
      target="_blank" 
      rel="noopener noreferrer"
    >
      View or Download PDF
    </a>
  </p></StyledTableCell>
            <StyledTableCell sx={{ width: 200, fontSize: '16px' }} align="center">{blogs.description}</StyledTableCell>
            <StyledTableCell sx={{ width: 200, fontSize: '16px' }} align="center">{blogs.date}</StyledTableCell>
            <StyledTableCell align="center" style={{ width: 200, }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
              <FaEdit
                className="edit"
                onClick={() => handleEditClick(blogs.id)}
                style={{ cursor: "pointer", marginRight: "10px" }}
              />
              <RiDeleteBin6Line
                className="delete"
                onClick={() => handleDeleteConfirmation(blogs.id)}
                style={{ cursor: "pointer" }}
              />
              </div>
            </StyledTableCell>
          </StyledTableRow>
        ))
      ) : (
        <StyledTableRow>
          <StyledTableCell colSpan={6} align="center">
            No blogs available.
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
         totalRows={filteredBlogs.length} // Use the full list for pagination
         onPageChange={handlePageChange}
       />
                 </div>
      </div>
    </LocalizationProvider>)
    }
    <div
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
                     Blogs Added Successfully
                        </p>
                      </div>
                    </div>
                    </div>
                    </div>
   </>
  );
};

export default Blogs;