import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';
import { styled } from '@mui/material/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { IoSearch } from 'react-icons/io5';
import { FiPlus } from 'react-icons/fi';
import { MdKeyboardArrowRight } from 'react-icons/md';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import AdminPagination from './AdminPagination';
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#00AEEF',
    color: theme.palette.common.white,
    borderRight: '1px solid white',
    position: 'sticky',
    top: 0,
    zIndex: 1,
    padding: '3px 5px',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: '3px 4px',
    borderRight: '1px solid #e0e0e0',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover },
  '&:last-child td, &:last-child th': { border: 0 },
}));

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    id: "", category_name: "", title: "",shortTitle:"", author: "", authorImage: "",
    blog_image: "", blog_pdf: "", description: "",
    date: new Date().toISOString().split('T')[0],
    meta_title: "", meta_keyword: "", meta_description: ""
  });
  const [formMode, setFormMode] = useState('Add');
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [allBlogs, setAllBlogs] = useState([]);

  
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [shortTitleError, setShortTitleError] = useState("");

  useEffect(() => {
    axios.get("https://api.test.hachion.co/course-categories/all")
      .then(res => setCategories(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    axios.get("https://api.test.hachion.co/blog")
      .then(res => {
        setAllBlogs(res.data);
        setBlogs(res.data);
        setFilteredBlogs(res.data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const filtered = blogs.filter(blog =>
      blog.category_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBlogs(filtered);
    setCurrentPage(1); 
  }, [blogs, searchTerm]);

  const displayedBlogs = filteredBlogs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = displayedBlogs.map(blog => blog.id);
      setSelectedIds(allIds);
      setSelectAll(true);
    } else {
      setSelectedIds([]);
      setSelectAll(false);
    }
  };

  
  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
      setSelectAll(false);
    } else {
      const newSelectedIds = [...selectedIds, id];
      setSelectedIds(newSelectedIds);
      
      if (newSelectedIds.length === displayedBlogs.length) {
        setSelectAll(true);
      }
    }
  };

  
  useEffect(() => {
    const allCurrentPageIds = displayedBlogs.map(blog => blog.id);
    const allSelected = allCurrentPageIds.length > 0 &&
      allCurrentPageIds.every(id => selectedIds.includes(id));
    setSelectAll(allSelected);
  }, [currentPage, displayedBlogs, selectedIds]);

  
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      setErrorMessage("❌ Please select at least one blog to delete");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    const confirmMessage = `Are you sure you want to delete ${selectedIds.length} selected ${selectedIds.length === 1 ? 'blog' : 'blogs'}?`;

    if (window.confirm(confirmMessage)) {
      try {
        
        const deletePromises = selectedIds.map(id =>
          axios.delete(`https://api.test.hachion.co/blog/delete/${id}`)
        );

        await Promise.all(deletePromises);

        
        const updatedBlogs = blogs.filter(item => !selectedIds.includes(item.id));
        setBlogs(updatedBlogs);
        setAllBlogs(updatedBlogs);
        setFilteredBlogs(updatedBlogs);

        setSelectedIds([]);
        setSelectAll(false);

        setSuccessMessage(`✅ ${selectedIds.length} ${selectedIds.length === 1 ? 'blog' : 'blogs'} deleted successfully`);
        setErrorMessage("");

        setTimeout(() => {
          setSuccessMessage("");
        }, 6000);
      } catch (error) {
        console.error("Error deleting blogs:", error);
        setSuccessMessage("");
        setErrorMessage("❌ Error deleting some blogs. Please try again.");
        setTimeout(() => {
          setErrorMessage("");
        }, 6000);
      }
    }
  };

  const handleInputChange = (e, field = null, value = null) => {
  const name = field || e.target.name;
  const val = field ? value : e.target.value;

  setFormData(prev => ({ ...prev, [name]: val }));

  if (name === "shortTitle") {
    setShortTitleError("");
  }
};

// ✅ Check if all mandatory fields are filled
const isFormValid = () => {
  return (
    formData.category_name &&
    formData.title &&
    formData.shortTitle &&
    formData.author &&
    formData.description &&
    formData.meta_title &&
    formData.meta_keyword &&
    formData.meta_description &&
    (formData.blog_image || formData.id) &&
    !shortTitleError
  );
};
const validateShortTitle = async () => {

  
  if (formData.id) return;

  if (!formData.shortTitle) return;

  try {

    await axios.get(
      "https://api.test.hachion.co/blog/shortTitle",
      { params: { shortTitle: formData.shortTitle } }
    );

    setShortTitleError("");

  } catch (error) {

    const backendMessage =
  error.response?.data?.message ||
  error.response?.data ||
  "Invalid Short Title";

setShortTitleError(backendMessage);
  }

};
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, [e.target.name]: file }));
  };

  const handleReset = () => {
    setFormData({
      id: "", category_name: "", shortTitle:"", title: "", author: "", authorImage: "",
      blog_image: "", blog_pdf: "", description: "",
      date: new Date().toISOString().split('T')[0],
      meta_title: "", meta_keyword: "", meta_description: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
 if (!isFormValid()) {
    setErrorMessage("❌ Please fill all mandatory fields");
    return;
  }
      if (shortTitleError) {
    setErrorMessage(shortTitleError);
    return;
  }
// if (
//   !formData.category_name ||
//   !formData.title ||
//   !formData.shortTitle ||
//   !formData.author ||
//   !formData.description ||
//   !formData.meta_title ||
//   !formData.meta_keyword ||
//   !formData.meta_description
// ) {
//   setErrorMessage("❌ All fields are mandatory");
//   return;
// }
   const blogPayload = JSON.stringify({
  category_name: formData.category_name,
  title: formData.title,
  shortTitle: formData.shortTitle,
  author: formData.author,
      description: formData.description,
      date: formData.date,
      meta_keyword: formData.meta_keyword,
      meta_description: formData.meta_description,
      meta_title: formData.meta_title
    });
    const formDataToSend = new FormData();
    formDataToSend.append("blogData", blogPayload);
    if (formData.authorImage) formDataToSend.append("authorImage", formData.authorImage);
    if (formData.blog_image) formDataToSend.append("blogImage", formData.blog_image);
    if (formData.blog_pdf) formDataToSend.append("blogPdf", formData.blog_pdf);
    try {
      const endpoint = formData.id
        ? `https://api.test.hachion.co/blog/update/${formData.id}`
        : "https://api.test.hachion.co/blog/add";
      const method = formData.id ? axios.put : axios.post;
      const response = await method(endpoint, formDataToSend, {
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        timeout: 60000,
      });
      if (response.status === 200 || response.status === 201) {
        setSuccessMessage(`✅ Blog ${formData.id ? "updated" : "added"} successfully`);
        setErrorMessage("");
        setBlogs(prev =>
          formData.id
            ? prev.map(blog => (blog.id === formData.id ? { ...blog, ...response.data } : blog))
            : [...prev, response.data]
        );
        setAllBlogs(prev =>
          formData.id
            ? prev.map(blog => (blog.id === formData.id ? { ...blog, ...response.data } : blog))
            : [...prev, response.data]
        );
        handleReset();
        setShowForm(false);

        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      }
   } catch (error) {

  console.error("Error submitting blog:", error);

  const backendMessage =
    error.response?.data?.message ||
    error.response?.data ||
    error.message ||
    "Error submitting blog";

  setSuccessMessage("");
  setErrorMessage(backendMessage);

}
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Blog?")) return;
    try {
      await axios.delete(`https://api.test.hachion.co/blog/delete/${id}`);
      setBlogs(prev => prev.filter(blog => blog.id !== id));
      setAllBlogs(prev => prev.filter(blog => blog.id !== id));
      setFilteredBlogs(prev => prev.filter(blog => blog.id !== id));

      
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));

      setSuccessMessage("✅ Blog deleted successfully");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage("❌ Failed to delete blog");
    }
  };

  const handleEdit = async (id) => {
    setFormMode('Edit');
    setShowForm(true);
    try {
      const res = await axios.get(`https://api.test.hachion.co/blog/${id}`);
      const blog = res.data;
      setFormData({
  id: blog.id,
  category_name: blog.category_name || '',
  title: blog.title || '',
  shortTitle: blog.shortTitle || '',
  author: blog.author || '',
        description: blog.description || '',
        blog_image: '',
        blog_pdf: '',
        date: blog.date || new Date().toISOString().split('T')[0],
        meta_title: blog.meta_title || '',
        meta_keyword: blog.meta_keyword || '',
        meta_description: blog.meta_description || ''
      });
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage("❌ Failed to fetch blog details");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  const handleAddClick = () => {
    setFormMode('Add');
    setShowForm(true);
    handleReset();
  };

  const handleDateFilter = () => {
    const filtered = allBlogs.filter((item) => {
      const itemDate = dayjs(item.date);
      return (
        (!startDate || itemDate.isAfter(dayjs(startDate).subtract(1, 'day'))) &&
        (!endDate || itemDate.isBefore(dayjs(endDate).add(1, 'day')))
      );
    });
    setBlogs(filtered);
    setFilteredBlogs(filtered);
    setSelectedIds([]); 
    setSelectAll(false);
    setCurrentPage(1);
  };

  const handleDateReset = () => {
    setStartDate(null);
    setEndDate(null);
    setBlogs(allBlogs);
    setFilteredBlogs(allBlogs);
    setSelectedIds([]); 
    setSelectAll(false);
    setCurrentPage(1);
  };

  return (
    <>
      {showForm ? (
        <div className="course-category">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#!" onClick={() => { setShowForm(false); handleReset(); }}>
                  Blogs
                </a>
                <MdKeyboardArrowRight />
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {formMode === 'Add' ? 'Add Blog Details' : 'Edit Blog Details'}
              </li>
            </ol>
          </nav>
          <div className="category">
            <div className="category-header">
              <p style={{ marginBottom: 0 }}>{formMode === 'Add' ? 'Add Blog' : 'Edit Blog'}</p>
             
            </div>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="course-details">
                <div className="course-row">
                  <div className="col-md-3">
                    <label className="form-label">Category Name <span style={{color:"red"}}>*</span></label>
                    <select
                      name="category_name"
                      className="form-select"
                      value={formData.category_name}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Blog Title <span style={{color:"red"}}>*</span></label>
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      placeholder="Enter Title"
                      value={formData.title}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Short Blog URL <span style={{color:"red"}}>*</span></label>
                    <input
  type="text"
  name="shortTitle"
  className="form-control"
  placeholder="Enter Short Title"
  value={formData.shortTitle}
  onChange={handleInputChange}
  onBlur={validateShortTitle}
/>

{shortTitleError && (
  <div style={{ color: "red", fontSize: "13px", marginTop: "4px" }}>
    {shortTitleError}
  </div>
)}
                  </div>
                </div>
                <div className="course-row">
                  <div className="col-md-4">
                    <label className="form-label">Author Image</label>
                    <input
                      type="file"
                      name="authorImage"
                      accept="image/*"
                      className="form-control"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Author <span style={{color:"red"}}>*</span></label>
                    <input
                      type="text"
                      name="author"
                      className="form-control"
                      placeholder="Enter Author"
                      value={formData.author}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Blog Image (w-360 x h-160px) <span style={{color:"red"}}>*</span></label>
                    <input
                      type="file"
                      name="blog_image"
                      accept="image/*"
                      className="form-control"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Description <span style={{color:"red"}}>*</span></label>
                  <ReactQuill
                    theme="snow"
                    value={formData.description}
                    onChange={(content) => handleInputChange(null, "description", content)}
                    style={{ height: "300px", marginBottom: "40px" }}
                  />
                </div>
                <div className="course-row">
                  <div className="col-md-4">
                    <label className="form-label">Meta Title <span style={{color:"red"}}>*</span></label>
                    <input
                      type="text"
                      name="meta_title"
                      className="form-control"
                      value={formData.meta_title}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Meta Keywords <span style={{color:"red"}}>*</span></label>
                    <input
                      type="text"
                      name="meta_keyword"
                      className="form-control"
                      value={formData.meta_keyword}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Meta Description <span style={{color:"red"}}>*</span></label>
                    <input
                      type="text"
                      name="meta_description"
                      className="form-control"
                      value={formData.meta_description}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="course-row">
                  

{successMessage && (
  <div style={{ color: "green", fontWeight: "bold", margin: "10px 0" }}>
    {successMessage}
  </div>
)}

{errorMessage && (
  <div style={{ color: "red", fontWeight: "bold", margin: "10px 0" }}>
    {errorMessage}
  </div>
)}
                  <button
  type="submit"
  className="submit-btn"
  disabled={!isFormValid()}
  style={{
    opacity: isFormValid() ? 1 : 0.5,
    cursor: isFormValid() ? "pointer" : "not-allowed"
  }}
>
  {formMode === 'Add' ? 'Submit' : 'Update'}
</button>
                  <button type="button" className="reset-btn" onClick={handleReset}>
                    Reset
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="course-category">
            <h3>Blog</h3>
            <div className="category">
              <div className="category-header">
                <p style={{ marginBottom: 0 }}>Blog Details</p>
              </div>

              {/* ADDED: Success and Error Messages */}
              {/* {successMessage && <div style={{ color: "green", fontWeight: "bold", textAlign: "center", marginTop: "10px" }}>{successMessage}</div>}
              {errorMessage && <div style={{ color: "red", fontWeight: "bold", textAlign: "center", marginTop: "10px" }}>{errorMessage}</div>} */}

              <div className="date-schedule">
                Start Date
                <DatePicker value={startDate} onChange={setStartDate} />
                End Date
                <DatePicker value={endDate} onChange={setEndDate} />
                <button className='filter' onClick={handleDateFilter}>Filter</button>
                <button className="filter" onClick={handleDateReset}>Reset</button>
              </div>
              <div className="entries">
                <div className="entries-left">
                  <p>Show</p>
                  <div className="btn-group">
                    <button className="btn-number dropdown-toggle" data-bs-toggle="dropdown">
                      {rowsPerPage}
                    </button>
                    <ul className="dropdown-menu">
                      {[10, 25, 50].map((val) => (
                        <li key={val}>
                          <a href="#!" className="dropdown-item" onClick={() => handleRowsPerPageChange(val)}>
                            {val}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p>entries</p>
                </div>
                <div className="entries-right">
                  <div className="search-div" role="search" style={{ border: '1px solid #d3d3d3' }}>
                    <input
                      className="search-input"
                      type="search"
                      placeholder="Search Blogs"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn-search"><IoSearch /></button>
                  </div>

                  {/* ADDED: Bulk Delete Button */}
                  {selectedIds.length > 0 && (
                    <button
                      type="button"
                      className="btn-category"
                      onClick={handleBulkDelete}
                      style={{ backgroundColor: '#dc3545', marginRight: '10px' }}
                    >
                      <RiDeleteBin6Line /> Delete Selected ({selectedIds.length})
                    </button>
                  )}

                  <button className="btn-category" onClick={handleAddClick}>
                    <FiPlus /> Add Blog
                  </button>
                </div>
              </div>
            </div>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {/* ADDED: Select All Checkbox */}
                    <StyledTableCell align="center">
                      <Checkbox
                        checked={selectAll}
                        onChange={handleSelectAll}
                        indeterminate={selectedIds.length > 0 && selectedIds.length < displayedBlogs.length}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">S.No.</StyledTableCell>
                    <StyledTableCell align="center">Category</StyledTableCell>
                    <StyledTableCell align="center">Image</StyledTableCell>
                    <StyledTableCell align="center">Title</StyledTableCell>
                    <StyledTableCell align="center">PDF</StyledTableCell>
                    <StyledTableCell align="center">Description</StyledTableCell>
                    <StyledTableCell align="center">Author Image</StyledTableCell>
                    <StyledTableCell align="center">Author</StyledTableCell>
                    <StyledTableCell align="center">Date</StyledTableCell>
                    <StyledTableCell align="center">Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedBlogs.length > 0 ? displayedBlogs.map((blog, index) => (
                    <StyledTableRow key={blog.id}>
                      {/* ADDED: Individual Checkbox */}
                      <StyledTableCell align="center">
                        <Checkbox
                          checked={selectedIds.includes(blog.id)}
                          onChange={() => handleSelectOne(blog.id)}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">{index + 1 + (currentPage - 1) * rowsPerPage}</StyledTableCell>
                      <StyledTableCell align="center">{blog.category_name}</StyledTableCell>
                      <StyledTableCell align="center">
                        {blog.blog_image ? (
                          <img src={`https://api.test.hachion.co/blogs/${blog.blog_image}`} alt="Blog" width="50" />
                        ) : 'No Image'}
                      </StyledTableCell>
                      <StyledTableCell align="left"
                        style={{ maxHeight: '100px', maxWidth: '200px', whiteSpace: 'wrap' }}>{blog.title}</StyledTableCell>
                      <StyledTableCell align="left" style={{ width: '100px' }}>
                        {blog.blog_pdf ? (
                          blog.blog_pdf.split('/').pop()
                        ) : (
                          'No PDF'
                        )}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <div
                          style={{ maxHeight: '100px', overflowY: 'auto', maxWidth: '500px' }}
                          dangerouslySetInnerHTML={{ __html: blog.description }}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {blog.authorImage ? (
                          <img src={`https://api.test.hachion.co/uploads/test/blogs/${blog.authorImage}`} alt="Author" width="50" />
                        ) : 'No Image'}
                      </StyledTableCell>
                      <StyledTableCell align="center">{blog.author}</StyledTableCell>
                      <StyledTableCell align="center">{dayjs(blog.date).format('MMM-DD-YYYY').toUpperCase()}</StyledTableCell>
                      <StyledTableCell align="center">
                        <FaEdit className="edit" onClick={() => handleEdit(blog.id)} />
                        <RiDeleteBin6Line className="delete" onClick={() => handleDelete(blog.id)} />
                      </StyledTableCell>
                    </StyledTableRow>
                  )) : (
                    <StyledTableRow>
                      {/* UPDATED: Changed colSpan from 10 to 11 to include checkbox column */}
                      <StyledTableCell colSpan={11} align="center">No blogs found</StyledTableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="pagination-container">
              <AdminPagination
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                totalRows={filteredBlogs.length}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </LocalizationProvider>
      )}
    </>
  );
};

export default Blogs;