// Trainer.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Admin.css';
import { styled } from '@mui/material/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { IoSearch } from 'react-icons/io5';
import { FiPlus } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import AdminPagination from './AdminPagination';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

// helper
const normalizeTrainer = (t) => ({
  ...t,
  trainerRating: t.trainerRating ?? t.trainerRating ?? '',
});

const toBackendTrainer = (t) => {
  const out = { ...t };
  out.trainer_id = t.id || t.trainer_id;
  delete out.id;
  if (out.trainerRating !== undefined && out.trainerRating !== null && out.trainerRating !== '') {
    out.trainerRating = Number(out.trainerRating);
  }
  return out;
};

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
  '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover },
  '&:last-child td, &:last-child th': { border: 0 },
}));

function getCurrentDateString() {
  return new Date().toISOString().split('T')[0];
}

export default function Trainer() {
  const [trainers, setTrainers] = useState([]);
  const [allTrainers, setAllTrainers] = useState([]);
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const [courseCategory, setCourseCategory] = useState([]);
  const [courseCategoriesList, setCourseCategoriesList] = useState([]);
  const [filterCourse, setFilterCourse] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('Add');
  const [formData, setFormData] = useState({
    id: '',
    trainer_name: '',
    // profileImage: '',
    trainerRating: '',
    course_name: '',
    category_name: '',
    summary: '',
    demo_link_1: '',
    demo_link_2: '',
    demo_link_3: '',
    date: getCurrentDateString(),
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // fetch data
  useEffect(() => {
    fetchTrainers();
    fetchCourseCategories();
    fetchCourseList();
  }, []);

  const fetchTrainers = async () => {
    try {
      const res = await axios.get('https://api.test.hachion.co/trainers');
      const normalized = Array.isArray(res.data) ? res.data.map(normalizeTrainer) : [];
      setTrainers(normalized);
      setFilteredTrainers(normalized);
      setAllTrainers(normalized);
    } catch (err) {
      console.error('Error fetching trainers:', err);
    }
  };

  const fetchCourseCategories = async () => {
    try {
      const res = await axios.get('https://api.test.hachion.co/course-categories/all');
      setCourseCategoriesList(res.data || []);
    } catch (err) {
      console.error('Error fetching course categories:', err);
    }
  };

  const fetchCourseList = async () => {
    try {
      const res = await axios.get('https://api.test.hachion.co/courses/all');
      setCourseCategory(res.data || []);
    } catch (err) {
      console.error('Error fetching courses list:', err);
    }
  };

  useEffect(() => {
    if (formData.category_name) {
      const filtered = courseCategory.filter((c) => c.courseCategory === formData.category_name);
      setFilterCourse(filtered);
    } else {
      setFilterCourse([]);
    }
  }, [formData.category_name, courseCategory]);

  // search
  useEffect(() => {
    const filtered = trainers.filter((trainer) =>
      (trainer.trainer_name || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (trainer.course_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (trainer.summary || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTrainers(filtered);
    setCurrentPage(1);
  }, [searchTerm, trainers]);

  // date filter
  const handleDateFilter = () => {
    const filtered = trainers.filter((item) => {
      const trainerDate = dayjs(item.date);
      const start = startDate ? dayjs(startDate) : null;
      const end = endDate ? dayjs(endDate) : null;
      return (!start || !trainerDate.isBefore(start, 'day')) && (!end || !trainerDate.isAfter(end, 'day'));
    });
    setFilteredTrainers(filtered);
    setCurrentPage(1);
  };

  const handleDateReset = () => {
    setStartDate(null);
    setEndDate(null);
    setFilteredTrainers(allTrainers);
    setCurrentPage(1);
  };

  // pagination
  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const displayedCourse = filteredTrainers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // input
  const handleInputChange = (e, field = null, value = null) => {
    const name = field ?? e.target.name;
    const val = field ? value : e.target.value;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'trainerRating' ? (val === '' ? '' : Number(val)) : val,
    }));
  };

  const handleReset = () => {
    setFormData({
      id: '',
      trainer_name: '',
      // profileImage: '',
      trainerRating: '',
      course_name: '',
      category_name: '',
      summary: '',
      demo_link_1: '',
      demo_link_2: '',
      demo_link_3: '',
      date: getCurrentDateString(),
    });
    setFormMode('Add');
  };

  const openAddForm = () => {
    setFormMode('Add');
    setShowForm(true);
    handleReset();
  };

  // save trainer
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!formData.trainer_name || !formData.course_name || !formData.category_name) {
      setErrorMessage('⚠️ Please fill in all required fields.');
      return;
    }

    try {
      const payload = toBackendTrainer(formData);
      let response;

      if (formData.id) {
        response = await axios.put(
          `https://api.test.hachion.co/trainer/update/${formData.id}`,
          payload,
          { headers: { 'Content-Type': 'application/json' } }
        );
        const updated = normalizeTrainer(response.data);
        setTrainers((prev) => prev.map((t) => (t.trainer_id === formData.id ? updated : t)));
        setFilteredTrainers((prev) => prev.map((t) => (t.trainer_id === formData.id ? updated : t)));
        setAllTrainers((prev) => prev.map((t) => (t.trainer_id === formData.id ? updated : t)));
        setSuccessMessage('✅ Trainer updated successfully.');
      } else {
        response = await axios.post('https://api.test.hachion.co/trainer/add', payload, {
          headers: { 'Content-Type': 'application/json' },
        });
        const added = normalizeTrainer(response.data);
        setTrainers((prev) => [...prev, added]);
        setFilteredTrainers((prev) => [...prev, added]);
        setAllTrainers((prev) => [...prev, added]);
        setSuccessMessage('✅ Trainer added successfully.');
      }

      handleReset();
      setShowForm(false);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (error) {
      console.error('Error adding/updating trainer:', error);
      if (
        error.response &&
        error.response.status === 409 &&
        error.response.data === 'Trainer with the same name, category, and course already exists.'
      ) {
        setErrorMessage('❌ A trainer with the same name already exists for this category and course.');
      } else {
        setErrorMessage('❌ Something went wrong while saving the trainer. Please try again.');
      }
      setSuccessMessage('');
    }
  };

  const handleDeleteConfirmation = (id) => {
    if (window.confirm('Are you sure you want to delete this trainer?')) handleDelete(id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://api.test.hachion.co/trainer/delete/${id}`);
      setTrainers((prev) => prev.filter((t) => t.trainer_id !== id));
      setFilteredTrainers((prev) => prev.filter((t) => t.trainer_id !== id));
      setAllTrainers((prev) => prev.filter((t) => t.trainer_id !== id));
      setSuccessMessage('✅ Trainer deleted successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting Trainer:', error);
      setErrorMessage('❌ Failed to delete trainer. Please try again.');
    }
  };

  const handleEdit = async (row) => {
    setFormMode('Edit');
    setShowForm(true);
    try {
      if (row?.trainer_id) {
        const res = await axios.get(`https://api.test.hachion.co/trainer/${row.trainer_id}`);
        const trainer = res.data || row;
        setFormData({
          id: trainer.trainer_id || '',
          trainer_name: trainer.trainer_name || '',
          // profileImage: '',
          trainerRating: trainer.trainerRating || '',
          course_name: trainer.course_name || '',
          category_name: trainer.category_name || '',
          summary: trainer.summary || '',
          demo_link_1: trainer.demo_link_1 || '',
          demo_link_2: trainer.demo_link_2 || '',
          demo_link_3: trainer.demo_link_3 || '',
          date: trainer.date || getCurrentDateString(),
        });
      }
    } catch (error) {
      console.error('Failed to fetch trainer details for edit:', error);
      setFormData((prev) => ({ ...prev, ...row }));
    }
  };

  // render
  return (
    <>
      {showForm ? (
        <div className="course-category">
          <h3>Trainer</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#!" onClick={() => { setShowForm(false); handleReset(); }}>
                  View Trainer
                </a>
                <MdKeyboardArrowRight />
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {formMode === 'Add' ? 'Add Trainer' : 'Edit Trainer'}
              </li>
            </ol>
          </nav>

          <div className="category">
            <div className="category-header">
              <p style={{ marginBottom: 0 }}>{formMode === 'Add' ? 'Add Trainer' : 'Edit Trainer'}</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="course-details">
                <div className="course-row">
                  <div className="col-md-3">
                    <label className="form-label">Trainer</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Trainer name"
                      name="trainer_name"
                      value={formData.trainer_name}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* <div className="col-md-3">
                    <label className="form-label">Trainer Image</label>
                    <input
                      type="file"
                      className="form-control"
                      name="profileImage"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div> */}

                  <div className="col-md-3">
                    <label className="form-label">Trainer Rating</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter Trainer rating"
                      name="trainerRating"
                      value={formData.trainerRating}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="course-row">
                  <div className="col-md-3">
                    <label className="form-label">Category Name</label>
                    <select
                      className="form-select"
                      name="category_name"
                      value={formData.category_name}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>Select Category</option>
                      {courseCategoriesList.map((curr) => (
                        <option key={curr.id} value={curr.name}>{curr.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Course Name</label>
                    <select
                      className="form-select"
                      name="course_name"
                      value={formData.course_name}
                      onChange={handleInputChange}
                      disabled={!formData.category_name}
                    >
                      <option value="" disabled>Select Course</option>
                      {filterCourse.map((curr) => (
                        <option key={curr.id} value={curr.courseName}>{curr.courseName}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="form-label">Trainer Profile Summary</label>
                  <ReactQuill
                    theme="snow"
                    value={formData.summary}
                    onChange={(content) => handleInputChange(null, 'summary', content)}
                    style={{ height: '300px', marginBottom: '20px' }}
                  />
                </div>

                <div className="row align-items-center">
                  <div className="col-md-3">
                    <label className="form-label">Demo Link 1</label>
                    <input
                      type="text"
                      className="form-control"
                      name="demo_link_1"
                      value={formData.demo_link_1}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="row align-items-center">
                  <div className="col-md-3">
                    <label className="form-label">Demo Link 2 (Optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="demo_link_2"
                      value={formData.demo_link_2}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="row align-items-center">
                  <div className="col-md-3">
                    <label className="form-label">Demo Link 3 (Optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="demo_link_3"
                      value={formData.demo_link_3}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {successMessage && <p style={{ color: 'green', fontWeight: 'bold' }}>{successMessage}</p>}
                {errorMessage && <p style={{ color: 'red', fontWeight: 'bold' }}>{errorMessage}</p>}

                <div className="course-row">
                  <button type="submit" className="submit-btn">{formMode === 'Add' ? 'Submit' : 'Update'}</button>
                  <button type="button" className="reset-btn" onClick={handleReset}>Reset</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="course-category">
            <h3>Trainer</h3>
            <div className="category">
              <div className="category-header">
                <p style={{ marginBottom: 0 }}>View Trainer</p>
              </div>

              <div className="date-schedule">
                Start Date
                <DatePicker value={startDate} onChange={setStartDate} />
                End Date
                <DatePicker value={endDate} onChange={setEndDate} />
                <button className="filter" onClick={handleDateFilter}>Filter</button>
                <button className="filter" onClick={handleDateReset}>Reset</button>
              </div>

              <div className="entries">
                <div className="entries-left">
                  <p>Show</p>
                  <div className="btn-group">
                    <button className="btn-number dropdown-toggle" data-bs-toggle="dropdown">{rowsPerPage}</button>
                    <ul className="dropdown-menu">
                      {[10, 25, 50].map((val) => (
                        <li key={val}>
                          <a href="#!" className="dropdown-item" onClick={() => handleRowsPerPageChange(val)}>{val}</a>
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
                      placeholder="Enter Courses, Category or Keywords"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn-search"><IoSearch style={{ fontSize: '2rem' }} /></button>
                  </div>
                  <button className="btn-category" onClick={openAddForm}><FiPlus /> Add Trainer</button>
                </div>
              </div>
            </div>

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell sx={{ width: 50 }} align="center"><Checkbox /></StyledTableCell>
                    <StyledTableCell sx={{ width: 60 }}>S.No.</StyledTableCell>
                    {/* <StyledTableCell align="center">Trainer Image</StyledTableCell> */}
                    <StyledTableCell align="center">Trainer Name</StyledTableCell>
                    <StyledTableCell align="center">Rating</StyledTableCell>
                    <StyledTableCell align="center">Course Name</StyledTableCell>
                    <StyledTableCell align="center">Demo 1</StyledTableCell>
                    <StyledTableCell align="center">Demo 2</StyledTableCell>
                    <StyledTableCell align="center">Demo 3</StyledTableCell>
                    <StyledTableCell align="center">Summary</StyledTableCell>
                    <StyledTableCell align="center">Created Date</StyledTableCell>
                    <StyledTableCell align="center">Action</StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {displayedCourse.length > 0 ? (
                    displayedCourse.map((row, index) => (
                      <StyledTableRow key={row.trainer_id || index}>
                        <StyledTableCell align="center"><Checkbox /></StyledTableCell>
                        <StyledTableCell align="center">{index + 1 + (currentPage - 1) * rowsPerPage}</StyledTableCell>

                        {/* <StyledTableCell align="center">
                          {row.profileImage ? (
                            <img src={row.profileImage} alt="User" width="50" height="50" />
                          ) : 'No Image'}
                        </StyledTableCell> */}

                        <StyledTableCell align="left">{row.trainer_name}</StyledTableCell>
                        <StyledTableCell align="center">{row.trainerRating}</StyledTableCell>
                        <StyledTableCell sx={{ width: 100 }} align="left">{row.course_name}</StyledTableCell>
                        <StyledTableCell sx={{ width: 200, whiteSpace: 'pre-wrap' }} align="left">{row.demo_link_1}</StyledTableCell>
                        <StyledTableCell sx={{ width: 200, whiteSpace: 'pre-wrap' }} align="left">{row.demo_link_2}</StyledTableCell>
                        <StyledTableCell sx={{ width: 200, whiteSpace: 'pre-wrap' }} align="left">{row.demo_link_3}</StyledTableCell>

                        <StyledTableCell sx={{ width: 400, whiteSpace: 'pre-wrap' }} align="left">
                          <div style={{ maxHeight: '120px', overflowY: 'auto', maxWidth: '500px' }}
                            dangerouslySetInnerHTML={{ __html: row.summary || '' }} />
                        </StyledTableCell>

                        <StyledTableCell align="center">
                          {row.date ? dayjs(row.date).format('MM-DD-YYYY') : ''}
                        </StyledTableCell>

                        <StyledTableCell align="center">
                          <FaEdit className="edit" onClick={() => handleEdit(row)} />
                          <RiDeleteBin6Line className="delete" onClick={() => handleDeleteConfirmation(row.trainer_id)} />
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <StyledTableRow>
                      <StyledTableCell colSpan={12} align="center">No data available.</StyledTableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {successMessage && <p style={{ color: 'green', fontWeight: 'bold', margin: 0 }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: 'red', fontWeight: 'bold', margin: 0 }}>{errorMessage}</p>}

            <div className="pagination-container">
              <AdminPagination
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                totalRows={filteredTrainers.length}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </LocalizationProvider>
      )}
    </>
  );
}
