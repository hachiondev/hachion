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
    id: "", category_name: "", title: "", author: "",
    blog_image: "", blog_pdf: "", description: "",
    date: new Date().toISOString().split('T')[0],
    meta_title: "", meta_keyword: "", meta_description: "" });
  const [formMode, setFormMode] = useState('Add');
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  useEffect(() => {
    axios.get("https://api.hachion.co/course-categories/all")
      .then(res => setCategories(res.data))
      .catch(console.error);
  }, []);
  useEffect(() => {
    axios.get("https://api.hachion.co/blog")
      .then(res => setBlogs(res.data))
      .catch(console.error);
  }, []);
  useEffect(() => {
    const filtered = blogs.filter(blog =>
      blog.category_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBlogs(filtered);
  }, [blogs, searchTerm]);
  const handleInputChange = (e, field = null, value = null) => {
    const name = field || e.target.name;
    const val = field ? value : e.target.value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, [e.target.name]: file }));
  };
  const handleReset = () => {
    setFormData({
      id: "", category_name: "", title: "", author: "",
      blog_image: "", blog_pdf: "", description: "",
      date: new Date().toISOString().split('T')[0],
      meta_title: "", meta_keyword: "", meta_description: ""
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const blogPayload = JSON.stringify({
      category_name: formData.category_name,
      title: formData.title,
      author: formData.author,
      description: formData.description,
      date: formData.date,
      meta_keyword: formData.meta_keyword,
      meta_description: formData.meta_description,
      meta_title: formData.meta_title
    });
    const formDataToSend = new FormData();
    formDataToSend.append("blogData", blogPayload);
    if (formData.blog_image) formDataToSend.append("blogImage", formData.blog_image);
    if (formData.blog_pdf) formDataToSend.append("blogPdf", formData.blog_pdf);
    try {
      const endpoint = formData.id
        ? `https://api.hachion.co/blog/update/${formData.id}`
        : "https://api.hachion.co/blog/add";
      const method = formData.id ? axios.put : axios.post;
      const response = await method(endpoint, formDataToSend, {
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        timeout: 60000,
      });
      if (response.status === 200 || response.status === 201) {
        alert(`Blog ${formData.id ? "updated" : "added"} successfully`);
        setBlogs(prev =>
          formData.id
            ? prev.map(blog => (blog.id === formData.id ? { ...blog, ...response.data } : blog))
            : [...prev, response.data]
        );
        handleReset();
        setShowForm(false);
      }
    } catch (error) {
      const backendMessage = error.response?.data || error.message;
      console.error("Error submitting blog:", error);
      alert("You are getting error please contact our support team");
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Blog?")) return;
    try {
      await axios.delete(`https://api.hachion.co/blog/delete/${id}`);
      setBlogs(prev => prev.filter(blog => blog.id !== id));
    } catch (error) {
      alert("Failed to delete blog");
    }
  };
  const handleEdit = async (id) => {
    setFormMode('Edit');
    setShowForm(true);
    try {
      const res = await axios.get(`https://api.hachion.co/blog/${id}`);
      const blog = res.data;
      setFormData({
        id: blog.id,
        category_name: blog.category_name || '',
        title: blog.title || '',
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
      alert("Failed to fetch blog details");
    }
  };
  const displayedBlogs = filteredBlogs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
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
                  <label className="form-label">Category Name</label>
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
                    placeholder="Enter Author"
                    value={formData.author}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Blog Image</label>
                  <input
                    type="file"
                    name="blog_image"
                    accept="image/*"
                    className="form-control"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Blog PDF</label>
                  <input
                    type="file"
                    name="blog_pdf"
                    accept="application/pdf"
                    className="form-control"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={(content) => handleInputChange(null, "description", content)}
                  style={{ height: "300px", marginBottom: "40px" }}
                />
              </div>
              <div className="course-row">
                <div className="col-md-4">
                  <label className="form-label">Meta Title</label>
                  <input
                    type="text"
                    name="meta_title"
                    className="form-control"
                    value={formData.meta_title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Meta Keywords</label>
                  <input
                    type="text"
                    name="meta_keyword"
                    className="form-control"
                    value={formData.meta_keyword}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Meta Description</label>
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
                <button type="submit" className="submit-btn">
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
              <div className="category-header"><p style={{ marginBottom: 0 }}>Blog Details</p></div>
              <div className="date-schedule">
                Start Date
                <DatePicker value={startDate} onChange={setStartDate} />
                End Date
                <DatePicker value={endDate} onChange={setEndDate} />
                <button className="filter">Filter</button>
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
                  <div className="search-div" role="search">
                    <input
                      className="search-input"
                      type="search"
                      placeholder="Search Blogs"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn-search"><IoSearch /></button>
                  </div>
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
                    <StyledTableCell align="center"><Checkbox /></StyledTableCell>
                    <StyledTableCell align="center">S.No.</StyledTableCell>
                    <StyledTableCell align="center">Category</StyledTableCell>
                    <StyledTableCell align="center">Image</StyledTableCell>
                    <StyledTableCell align="center">Title</StyledTableCell>
                    <StyledTableCell align="center">Author</StyledTableCell>
                    <StyledTableCell align="center">PDF</StyledTableCell>
                    <StyledTableCell align="center">Description</StyledTableCell>
                    <StyledTableCell align="center">Date</StyledTableCell>
                    <StyledTableCell align="center">Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedBlogs.length > 0 ? displayedBlogs.map((blog, index) => (
                    <StyledTableRow key={blog.id}>
                      <StyledTableCell align="center"><Checkbox /></StyledTableCell>
                      <StyledTableCell align="center">{index + 1 + (currentPage - 1) * rowsPerPage}</StyledTableCell>
                      <StyledTableCell align="center">{blog.category_name}</StyledTableCell>
                      <StyledTableCell align="center">
                        {blog.blog_image ? (
                          <img src={`https://api.hachion.co/blogs/${blog.blog_image}`} alt="Blog" width="50" />
                        ) : 'No Image'}
                      </StyledTableCell>
                      <StyledTableCell align="left"
                      style={{ maxHeight: '100px', maxWidth: '200px', whiteSpace: 'wrap' }}>{blog.title}</StyledTableCell>
                      <StyledTableCell align="center">{blog.author}</StyledTableCell>
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
                      <StyledTableCell align="center">{blog.date}</StyledTableCell>
                      <StyledTableCell align="center">
                        <FaEdit className="edit" onClick={() => handleEdit(blog.id)} />
                        <RiDeleteBin6Line className="delete" onClick={() => handleDelete(blog.id)} />
                      </StyledTableCell>
                    </StyledTableRow>
                  )) : (
                    <StyledTableRow>
                      <StyledTableCell colSpan={10} align="center">No blogs found</StyledTableCell>
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
