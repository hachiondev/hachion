import React, { useEffect } from 'react';
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
import { FiUpload } from "react-icons/fi";
import { FaTimesCircle } from 'react-icons/fa';
import { BsFileEarmarkPdfFill } from 'react-icons/bs';

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

export default function Curriculum() {
  const [courseCategory, setCourseCategory] = useState([]);
  const [course, setCourse] = useState([]);
  const [filterCourse, setFilterCourse] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [homeFilter, setHomeFilter] = useState([]);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [curriculum, setCurriculum] = useState([]);
  const [filteredCurriculum, setFilteredCurriculum] = useState([])
  const [open, setOpen] = React.useState(false);
  const currentDate = new Date().toISOString().split('T')[0];
  const [message, setMessage] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [displayedCategories, setDisplayedCategories] = useState([]);
  const [allData, setAllData] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [brochureError, setBrochureError] = useState("");
  const [curriculumError, setCurriculumError] = useState("");
  const [filterData, setFilterData] = useState({
    category_name: "",
    course_name: "",
  });

  const [endDate, setEndDate] = useState(null);
  const [editedRow, setEditedRow] = useState({ curriculum_id: "", category_name: "", course_name: "", curriculum_pdf: "", brochure_pdf: "", title: "", topic: "", link: "", assessment_pdf: "" });
  const [rows, setRows] = useState([
    { id: Date.now(), title: '', topic: '', link: '', assessment_pdf: '' }
  ]);

  const [curriculumData, setCurriculumData] = useState({
    category_name: '',
    course_name: '',
    curriculum_pdf: null,
    brochure_pdf: null,
  });
  const areMandatoryFieldsFilled = () => {
    const hasCategory = curriculumData.category_name?.trim() !== "";
    const hasCourse = curriculumData.course_name?.trim() !== "";

    return hasCategory && hasCourse;
  };

  const isSubmitDisabled = !areMandatoryFieldsFilled();

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
  const handlePdfUpload = (index, event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const updatedRows = [...rows];
      updatedRows[index].assessment_pdf = file;
      setRows(updatedRows);
    } else {
      alert('Please upload a valid PDF file.');
    }
  };
  const addRow = () => {
    setRows([...rows, { id: Date.now(), title: '', topic: '', link: '', assessment_pdf: '' }]);
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
  const handleReset = () => {
    setCurriculumData({
      curriculum_id: "",
      category_name: "",
      course_name: "",
      curriculum_pdf: "",
      brochure_pdf: "",
      date: "",
      title: "",
      link: "",
      topic: "",
      assessment_pdf: ""
    });
  }
  const handleClose = () => {
    setOpen(false);
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
    if (curriculumData.category_name) {
      const filtered = courseCategory.filter(
        (course) => course.courseCategory === curriculumData.category_name
      );
      setFilterCourse(filtered);
    } else {
      setFilterCourse([]);
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
    const fetchData = async () => {
      try {
        const response = await axios.get("https://api.hachion.co/curriculum");
        setAllData(response.data);
        setFilteredCurriculum(response.data);
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
      const curriculumDate = new Date(item.date);
      const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
      const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

      const matchSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.assessment_pdf.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      const formData = new FormData();
      const curriculumData = {
        category_name: editedRow.category_name,
        course_name: editedRow.course_name,
        title: editedRow.title,
        topic: editedRow.topic,
        link: editedRow.link,

      };

      formData.append("curriculumData", JSON.stringify(curriculumData));


      if (editedRow.curriculum_pdf && editedRow.curriculum_pdf instanceof File) {
        formData.append("curriculumPdf", editedRow.curriculum_pdf);
      }
      if (editedRow.brochure_pdf && editedRow.brochure_pdf instanceof File) {
        formData.append("brochurePdf", editedRow.brochure_pdf);
      }

      if (editedRow.assessment_pdf && editedRow.assessment_pdf instanceof File) {
        formData.append("assessmentPdf", editedRow.assessment_pdf);
      }

      const response = await axios.put(
        `https://api.hachion.co/curriculum/update/${editedRow.curriculum_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
          timeout: 60000
        }
      );

      setAllData((prev) =>
        prev.map((item) =>
          item.curriculum_id === editedRow.curriculum_id ? response.data : item
        )
      );


      const currentCategory = editedRow.category_name;
      const currentCourse = editedRow.course_name;

      setFilteredCurriculum((prev) =>
        prev.map((item) =>
          item.curriculum_id === editedRow.curriculum_id ? response.data : item
        ).filter(
          (item) =>
            item.category_name === currentCategory &&
            item.course_name === currentCourse
        )
      );



      setMessage("Curriculum updated successfully!");
      setTimeout(() => setMessage(""), 5000);
      setOpen(false);
    } catch (error) {
      const backendMessage = error.response?.data?.message || error.response?.data || error.message;
      console.error("Error updating curriculum:", backendMessage);
      setMessage(backendMessage);
    }
  };

  const handleDelete = async (curriculum_id) => {
    try {
      const response = await axios.delete(
        `https://api.hachion.co/curriculum/delete/${curriculum_id}`
      );

      console.log("Curriculum deleted successfully:", response.data);
      setAllData(prev => prev.filter(item => item.curriculum_id !== curriculum_id));
      setFilteredCurriculum(prev => prev.filter(item => item.curriculum_id !== curriculum_id));


      setSuccessMessage("Curriculum deleted successfully!");
      setErrorMessage("");

      setTimeout(() => setSuccessMessage(""), 4000);

    } catch (error) {
      console.error("Error deleting Curriculum:", error);

      setErrorMessage("Failed to delete curriculum.");
      setSuccessMessage("");

      setTimeout(() => setErrorMessage(""), 4000);
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
        (item.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.topic || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.link || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.assessment_pdf || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.curriculum_pdf || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.brochure_pdf || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.date || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        !filterData.category_name || item.category_name === filterData.category_name;

      const matchesCourse =
        !filterData.course_name || item.course_name === filterData.course_name;

      return inDateRange && matchesSearch && matchesCategory && matchesCourse;
    });

    setFilteredCurriculum(filtered);
    setCurrentPage(1);
  }, [allData, searchTerm, startDate, endDate, filterData]);

  const handleCurriculumFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurriculumData((prev) => ({
        ...prev,
        curriculum_pdf: file,
      }));
      setCurriculumError("");
    }
  };

  const handleBrochureFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurriculumData((prev) => ({
        ...prev,
        brochure_pdf: file,
      }));
      setBrochureError("");
    }
  };


  const handleEditFileUpload = (e) => {
    setEditedRow(prev => ({
      ...prev,
      curriculum_pdf: e.target.files[0],
      brochure_pdf: e.target.files[0],
    }));
  };

  const handleClickOpen = (row) => {
    setEditedRow(row)
    setOpen(true);
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
    setCurrentPage(1);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString().split("T")[0];

    let allSuccessful = true;

    for (const row of rows) {
      const formData = new FormData();
      formData.append("curriculumData", JSON.stringify({
        category_name: curriculumData.category_name,
        course_name: curriculumData.course_name,
        title: row.title || "",
        topic: row.topic || "",
        link: row.link || "",
        date: currentDate,
      }));


      if (curriculumData.curriculum_pdf) {
        formData.append("curriculumPdf", curriculumData.curriculum_pdf);
      }
      if (curriculumData.brochure_pdf) {
        formData.append("brochurePdf", curriculumData.brochure_pdf);
      }


      if (row.assessment_pdf && row.assessment_pdf instanceof File) {
        formData.append("assessmentPdf", row.assessment_pdf);
      }

      try {
        const response = await axios.post("https://api.hachion.co/curriculum/add", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
          timeout: 60000,
        });

        if (response.status !== 201) {
          allSuccessful = false;
          setSuccessMessage("");
          setErrorMessage("❌ Failed to add curriculum entry.");
          break;
        }
      } catch (error) {
        const backendMessage =
          error.response?.data?.message || error.response?.data || error.message;

        console.error("Error adding curriculum:", backendMessage);

        allSuccessful = false;
        setSuccessMessage("");

        const msgString = String(backendMessage);

        const FILE_NAME_RULE =
          "Only letters, numbers, hyphens (-), underscores (_), ampersands (&), slashes (/), dots (.), and spaces are allowed.";


        if (msgString.includes("Invalid Brochure PDF")) {
          setBrochureError(FILE_NAME_RULE);
          setCurriculumError("");
          setErrorMessage("");
          break;
        }


        if (msgString.includes("Invalid file name") ||
          msgString.includes("Invalid Curriculum PDF")) {

          setCurriculumError(FILE_NAME_RULE);
          setBrochureError("");
          setErrorMessage("");
          break;
        }


        setErrorMessage("❌ Error uploading file: " + msgString);
        setCurriculumError("");
        setBrochureError("");
        break;
      }


    }

    if (allSuccessful) {

      setSuccessMessage("✅ All curriculum entries added successfully.");
      setErrorMessage("");
      setShowAddCourse(false);
      setCurriculumData({});
      setRows([{ id: Date.now(), title: "", topic: "", link: "", assessment_pdf: "" }]);
    }
  };

  const handleAddTrendingCourseClick = () => setShowAddCourse(true);
  return (

    <>
      {showAddCourse ? (<div className='course-category'>
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
            <p style={{ marginBottom: 0 }}>Add Curriculum</p>
          </div>
          <div className='course-details'>
            <div className='course-row'>
              <div class="col-md-3">
                <label htmlFor="inputState" className="form-label">
                  Category Name <span style={{ color: "red" }}>*</span>
                </label>
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
                <label htmlFor="course" className="form-label">
                  Course Name <span style={{ color: "red" }}>*</span>
                </label>
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
            </div>
            <div className='course-row'>
              <div class="col-md-3">
                <label for="curriculumFile" class="form-label">Curriculum PDF</label>
                <input
                  className="form-control"
                  type="file"
                  id="curriculumFile"
                  name="curriculum_pdf"
                  accept=".pdf"
                  onChange={handleCurriculumFileUpload}
                />
                {curriculumError && (
                  <p
                    style={{
                      color: "red",
                      fontSize: "0.8rem",
                      marginTop: "4px",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {curriculumError}
                  </p>
                )}
              </div>

              <div className="col-md-3">
                <label htmlFor="brochureFile" className="form-label">Brochure PDF</label>

                <input
                  type="file"
                  className="form-control"
                  id="brochureFile"
                  name="brochure_pdf"
                  accept=".pdf"
                  onChange={handleBrochureFileUpload}
                />

                {brochureError && (
                  <p
                    style={{
                      color: "red",
                      fontSize: "0.8rem",
                      marginTop: "4px",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {brochureError}
                  </p>
                )}
              </div>

            </div>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650, marginTop: 5 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align='center' sx={{ fontSize: '16px', width: '25%' }}> Title</StyledTableCell>
                    <StyledTableCell align="center" sx={{ fontSize: '16px', width: '30%' }}>Topic</StyledTableCell>
                    <StyledTableCell align="center" sx={{ fontSize: '16px' }}>Video Link</StyledTableCell>
                    <StyledTableCell align="center" sx={{ fontSize: '16px' }}>Assessment PDF</StyledTableCell>
                    <StyledTableCell align="center" sx={{ fontSize: '16px', width: '120px' }}>Add/Delete Row</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell align='center'>
                        <input
                          className='table-curriculum'
                          name='title'
                          value={row.title}
                          onChange={(e) => handleRowChange(index, 'title', e.target.value)}
                        />
                      </StyledTableCell>
                      <StyledTableCell align='center' style={{ maxWidth: 300, overflow: 'hidden' }}>
                        <div style={{ maxWidth: '100%' }}>
                          <ReactQuill
                            theme="snow"
                            modules={quillModules}
                            value={row.topic}
                            onChange={(value) =>
                              setRows((prevRows) =>
                                prevRows.map((r) =>
                                  r.id === row.id ? { ...r, topic: value } : r
                                )
                              )
                            }
                            style={{
                              width: '100%',
                              wordWrap: 'break-word',
                              overflowWrap: 'break-word',
                            }}
                          />
                        </div>
                      </StyledTableCell>
                      <StyledTableCell align='center'>
                        <input
                          className='table-curriculum'
                          name='link'
                          value={row.link}
                          onChange={(e) => handleRowChange(index, 'link', e.target.value)}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.assessment_pdf ? (
                          <div style={{ position: 'relative', display: 'inline-block', maxWidth: 200 }}>
                            <div
                              style={{
                                padding: '6px 12px',
                                backgroundColor: '#f5f5f5',
                                borderRadius: 4,
                                border: '1px solid #ccc',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                cursor: 'pointer',
                              }}
                              onClick={() =>
                                window.open(URL.createObjectURL(row.assessment_pdf), '_blank')
                              }
                            >
                              <BsFileEarmarkPdfFill size={20} className="edit" />
                              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {row.assessment_pdf.name}
                              </span>
                            </div>

                            <FaTimesCircle
                              style={{
                                position: 'absolute',
                                top: -8,
                                right: -8,
                                fontSize: '1rem',
                                color: 'red',
                                cursor: 'pointer',
                                backgroundColor: '#fff',
                                borderRadius: '50%',
                              }}
                              onClick={() => {
                                const updatedRows = [...rows];
                                updatedRows[index].assessment_pdf = null;
                                setRows(updatedRows);
                              }}
                            />
                          </div>
                        ) : (
                          <label style={{ cursor: 'pointer' }}>
                            <FiUpload className="edit" />
                            <input
                              type="file"
                              accept=".pdf"
                              style={{ display: 'none' }}
                              onChange={(e) => handlePdfUpload(index, e)}
                            />
                          </label>
                        )}
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
            <div className="course-row">
              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
                style={{
                  backgroundColor: isSubmitDisabled ? "#cccccc" : "#00AAEF",
                  color: isSubmitDisabled ? "#666666" : "#ffffff",
                  cursor: isSubmitDisabled ? "not-allowed" : "pointer",
                  opacity: isSubmitDisabled ? 0.7 : 1,
                }}
              >
                Submit
              </button>
              <button className="reset-btn" onClick={handleReset}>
                Reset
              </button>
            </div>

          </div>
        </div>
      </div>
      ) : (<div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className='course-category'>
            <div className='category'>
              <div className='category-header'>
                <p style={{ marginBottom: 0 }}>View Curriculum</p>
              </div>
              <div className='date-schedule'>
                Start Date
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  isClearable
                  sx={{
                    '& .MuiIconButton-root': { color: '#00aeef' }
                  }} />
                End Date
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  isClearable
                  sx={{
                    '& .MuiIconButton-root': { color: '#00aeef' }
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
                      onChange={(e) => setSearchTerm(e.target.value)} />
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
            <div style={{ marginTop: '50px' }}>
              <button className="filter" onClick={() => {
                setFilterData({ category_name: "", course_name: "" });
                setFilteredCurriculum(allData);
                setCurrentPage(1);
              }}>
                Reset Filter
              </button>
            </div>
          </div>
        </div>
        {(filterData.category_name || filterData.course_name) ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align='center' sx={{ width: '50px' }}>
                    <Checkbox />
                  </StyledTableCell>
                  <StyledTableCell align='center' sx={{ width: '50px' }}>S.No.</StyledTableCell>
                  <StyledTableCell align="center">Title</StyledTableCell>
                  <StyledTableCell align="center">Topic</StyledTableCell>
                  <StyledTableCell align="center">Video Link</StyledTableCell>
                  <StyledTableCell align="center">Assessment PDF</StyledTableCell>
                  <StyledTableCell align="center">Curriculum PDF</StyledTableCell>
                  <StyledTableCell align="center">Brochure PDF</StyledTableCell>
                  <StyledTableCell align="center">Created Date</StyledTableCell>
                  <StyledTableCell align="center" sx={{ width: '100px' }}>Action</StyledTableCell>
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
                      <StyledTableCell align="left"
                        style={{ width: '200px', whiteSpace: 'wrap' }}>{course.title}</StyledTableCell>
                      <StyledTableCell align="left">
                        {course.topic ? (
                          <div
                            style={{ maxWidth: '800px', wordWrap: 'break-word', whiteSpace: 'pre-line' }}
                            dangerouslySetInnerHTML={{ __html: course.topic }} />
                        ) : (
                          <p>No topics available</p>
                        )}

                      </StyledTableCell>
                      <StyledTableCell align="left" style={{ maxWidth: '100px', wordWrap: 'break-word', whiteSpace: 'pre-line' }}>{course.link}</StyledTableCell>
                      <StyledTableCell align="left" style={{ maxWidth: '100px', wordWrap: 'break-word', whiteSpace: 'pre-line' }}> {course.assessment_pdf ? course.assessment_pdf.split("/").pop() : ""}</StyledTableCell>
                      <StyledTableCell align="left" style={{ maxWidth: '100px', wordWrap: 'break-word', whiteSpace: 'pre-line' }}>
                        {course.curriculum_pdf ? (
                          course.curriculum_pdf.split('/').pop()
                        ) : (
                          'No PDF'
                        )}
                      </StyledTableCell>
                      <StyledTableCell align="left" style={{ width: '100px' }}>
                        {course.brochure_pdf ? (
                          course.brochure_pdf.split('/').pop()
                        ) : (
                          'No PDF'
                        )}
                      </StyledTableCell>
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
                  <StyledTableRow>
                    <StyledTableCell colSpan={9} align="center">
                      No data available.
                    </StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>

          </TableContainer>) : (<p>Please select category and courses to display data</p>)}
        {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}
        {(filterData.category_name || filterData.course_name) ?
          (<div className='pagination-container'>
            <AdminPagination
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              totalRows={filteredCurriculum.length}
              onPageChange={handlePageChange}
            />
          </div>) : (<p></p>)}
        {message && <div className="success-message">{message}</div>}

      </div>)}

      <Dialog className="dialog-box" open={open} onClose={handleClose} aria-labelledby="edit-schedule-dialog"
        PaperProps={{
          style: { borderRadius: 20 },
        }}>
        <div className="dialog-title">
          <DialogTitle id="edit-schedule-dialog">Edit Curriculum</DialogTitle>
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

          <div className="col-md-3">
            <label className="form-label">Curriculum's PDF</label>

            <label
              htmlFor="curriculumPdfEdit"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: "1px solid #ced4da",
                borderRadius: "4px",
                padding: "6px 10px",
                cursor: "pointer",
                backgroundColor: "#fff",
              }}
            >
              <BsFileEarmarkPdfFill size={18} className="edit" />
              <span
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 180,
                  fontSize: "0.9rem",
                }}
              >
                {editedRow.curriculum_pdf
                  ? editedRow.curriculum_pdf.name ||
                  editedRow.curriculum_pdf.split("/").pop()
                  : "Select Curriculum PDF"}
              </span>
            </label>

            <input
              id="curriculumPdfEdit"
              type="file"
              accept=".pdf"
              style={{ display: "none" }}
              onChange={(e) =>
                setEditedRow((prev) => ({
                  ...prev,
                  curriculum_pdf: e.target.files[0],
                }))
              }
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="curriculumPDF" className="form-label">Curriculum's PDF</label>

            {editedRow.curriculum_pdf ? (
              <div
                style={{
                  marginBottom: 8,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <BsFileEarmarkPdfFill size={20} className="edit" />
                <span
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 180,
                  }}
                >
                  {editedRow.curriculum_pdf.name ||
                    editedRow.curriculum_pdf.split('/').pop()}
                </span>
              </div>
            ) : (
              <p
                style={{
                  fontSize: '0.85rem',
                  color: '#888',
                  marginBottom: 8,
                }}
              >
                No PDF
              </p>
            )}

            <input
              id="curriculumPDF"
              type="file"
              accept=".pdf"
              onChange={(e) =>
                setEditedRow((prev) => ({
                  ...prev,
                  curriculum_pdf: e.target.files[0],
                }))
              }
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="brochurePDF" className="form-label">Brochure PDF</label>

            {editedRow.brochure_pdf ? (
              <div
                style={{
                  marginBottom: 8,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <BsFileEarmarkPdfFill size={20} className="edit" />
                <span
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 180,
                  }}
                >
                  {editedRow.brochure_pdf.name ||
                    editedRow.brochure_pdf.split('/').pop()}
                </span>
              </div>
            ) : (
              <p
                style={{
                  fontSize: '0.85rem',
                  color: '#888',
                  marginBottom: 8,
                }}
              >
                No PDF
              </p>
            )}

            <input
              id="brochurePDF"
              type="file"
              accept=".pdf"
              onChange={(e) =>
                setEditedRow((prev) => ({
                  ...prev,
                  brochure_pdf: e.target.files[0],
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
            onChange={(value) => setEditedRow((prevData) => ({ ...prevData, topic: value }))}
            modules={quillModules}
          />

          <label htmlFor="topic">Video Link</label>
          <input id="link" className="form-control" name='link' value={editedRow.link || ""}
            onChange={handleInputChange} />

          <label htmlFor="assessment_pdf" className="form-label">Assessment PDF :</label>

          {editedRow.assessment_pdf ? (
            <div style={{ position: 'relative', display: 'inline-block', maxWidth: 200, marginTop: 4 }}>
              <div
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: 4,
                  border: '1px solid #ccc',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'default',
                }}
              >
                <BsFileEarmarkPdfFill size={20} className="edit" />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {editedRow.assessment_pdf.name || editedRow.assessment_pdf.split('/').pop()}
                </span>

              </div>

              <FaTimesCircle
                style={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  fontSize: '1rem',
                  color: 'red',
                  cursor: 'pointer',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                }}
                onClick={() =>
                  setEditedRow((prev) => ({
                    ...prev,
                    assessment_pdf: null,
                  }))
                }
              />
            </div>
          ) : (
            <label style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <FiUpload size={20} className="edit" />
              <span style={{ fontSize: '0.95rem' }}>Upload PDF</span>
              <input
                type="file"
                accept=".pdf"
                style={{ display: 'none' }}
                onChange={(e) =>
                  setEditedRow((prev) => ({
                    ...prev,
                    assessment_pdf: e.target.files[0],
                  }))
                }
              />
            </label>
          )}

        </DialogContent>
        <DialogActions className="update" style={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={handleSave} className="update-btn">Update</Button>
        </DialogActions>
      </Dialog>
    </>);
}