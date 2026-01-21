import React, { useState } from 'react';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import { Helmet } from 'react-helmet';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { FaEdit, FaTimesCircle } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import '../Admin.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { IoClose, IoSearch } from 'react-icons/io5';
import { FiPlus, FiUpload } from 'react-icons/fi';
import { MdKeyboardArrowRight } from 'react-icons/md';
import AdminPagination from '../AdminPagination';
import { BsFileEarmarkPdfFill } from 'react-icons/bs';
import { GoPlus } from 'react-icons/go';
import { useCategories } from "../../../Api/hooks/HomePageApi/NavbarApi/useCategories";
import { useCourses } from "../../../Api/hooks/HomePageApi/NavbarApi/useCourses";
import { useAddProjects } from "../../../Api/hooks/AdminProjects/useAddProjects";
import { useProjects } from "../../../Api/hooks/AdminProjects/useProjects";
import { useUpdateProject } from "../../../Api/hooks/AdminProjects/useUpdateProject";
import { useDeleteProject } from "../../../Api/hooks/AdminProjects/useDeleteProject";
import dayjs from 'dayjs';


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
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const GeoKeyword = ({
  pageTitle = 'GeoKeyword',
  headerTitle = 'View GeoKeyword List',
  buttonLabel = 'Add GeoKeyword',
}) => {
  const [formMode, setFormMode] = useState('Add');
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editingProjectId, setEditingProjectId] = useState(null);

  const { data: categories = [], isLoading } = useCategories();


  const { data: projects = [], isLoading: projectsLoading } = useProjects();

  const { mutate: updateProject } = useUpdateProject();
  const { mutate: deleteProject } = useDeleteProject();


  const isEditMode = formMode === "Edit";

  const [formData, setFormData] = useState({
    courseCategory: "",
    courseName: "",
  });


  const showTimedMessage = (type, message, duration = 6000) => {
    if (type === "success") {
      setSuccessMessage(message);
      setErrorMessage("");
    } else {
      setErrorMessage(message);
      setSuccessMessage("");
    }

    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, duration);
  };



  const currentDate = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [payload, setPayload] = useState(null);


  const { mutate: saveProjects, data: projectResponse, isPending: isSavingProjects } = useAddProjects();
  const { data: allCourses = [] } = useCourses();

  const filteredCoursesByCategory = allCourses.filter(
    (c) => c.courseCategory === formData.courseCategory
  );



  const [rows, setRows] = useState([
    { id: 1, title: '', topic: '' }
  ]);

  const hasCategory = formData.courseCategory?.trim() !== "";


  const hasCourseName = formData.courseName?.trim() !== "";

  const allProjectsComplete = rows.every(row =>
    row.title.trim() !== '' &&
    row.topic &&
    row.topic.trim() !== '' &&
    row.topic !== '<p><br></p>'
  );


  const hasAtLeastOneProject = rows.length > 0;


  const isSubmitDisabled = !hasCategory || !hasCourseName || !allProjectsComplete || !hasAtLeastOneProject;


  const handleDateFilter = () => {

    console.log('Filter applied');
  };

  const handleDateReset = () => {
    setStartDate(null);
    setEndDate(null);
    setSearchTerm('');
  };

  const handleInputChange = (e, quillField = null, quillValue = null) => {
    setFormData((prevData) => {
      let { name, value } = e?.target || {};
      if (quillField) {
        name = quillField;
        value = quillValue.trim() === "" || quillValue === "<p><br></p>" ? "" : quillValue;
      }
      return { ...prevData, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasCategory) {
      showTimedMessage("error", "❌ Please select a Category Name.");

      return;
    }

    if (!hasCourseName) {
      showTimedMessage("error", "❌ Please select a Course Name.");

      return;
    }

    if (!hasAtLeastOneProject) {
      setErrorMessage("❌ Please add at least one project.");
      return;
    }

    if (!allProjectsComplete) {
      setErrorMessage("❌ Please fill both GeoKeyword and Description for all project rows.");
      return;
    }
    if (formMode === "Edit") {
      updateProject({
        id: editingProjectId,
        payload: {
          courseCategory: formData.courseCategory,
          courseName: formData.courseName,
          projectName: rows[0].title,
          description: rows[0].topic,
        },
      });

      showTimedMessage("success", "⚡ Project updated successfully!");
    } else {
      const projectPayload = rows.map(row => ({
        courseCategory: formData.courseCategory,
        courseName: formData.courseName,
        projectName: row.title,
        description: row.topic,
      }));

      saveProjects(projectPayload);
      showTimedMessage("success", "⏳ Saving projects...");
    }

    setErrorMessage("");
    setEditingProjectId(null);
    setFormMode("Add");
    setShowAddCourse(false);


    setShowAddCourse(false);

  };

  const handleEditClick = (project) => {
    setFormMode("Edit");
    setShowAddCourse(true);
    setEditingProjectId(project.projectId);


    setFormData({
      courseCategory: project.courseCategory,
      courseName: project.courseName,
    });


    setRows([
      {
        id: 1,
        title: project.projectName,
        topic: project.description,
      },
    ]);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, window.scrollY);
  };

  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };
  const stripHtml = (html = "") =>
    html
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

  const filteredProjects = projects.filter((item) => {
    const projectDate = new Date(item.date);

    const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
    const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

    const search = searchTerm.toLowerCase();

    const matchSearch =
      item.projectName?.toLowerCase().includes(search) ||
      item.courseName?.toLowerCase().includes(search) ||
      item.courseCategory?.toLowerCase().includes(search) ||
      stripHtml(item.description).includes(search);

    const inRange =
      (!start || projectDate >= start) &&
      (!end || projectDate <= end);

    return matchSearch && inRange;
  });

  const displayedProjects = filteredProjects.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );


  const handleDeleteConfirmation = (id) => {
    if (window.confirm("Are you sure you want to delete this Course?")) {

      deleteProject(id);
      showTimedMessage("success", "🗑️ Project deleted successfully!");
    }
  };

  const handleAddTrendingCourseClick = () => {
    setFormMode('Add');
    setShowAddCourse(true);

  };

  const addRow = () => {
    const newId = rows.length > 0 ? Math.max(...rows.map(row => row.id)) + 1 : 1;
    setRows([...rows, { id: newId, title: '', topic: '' }]);
  };

  const deleteRow = (id) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== id));
    } else {

      setRows([{ id: 1, title: '', topic: '' }]);
    }
  };


  React.useEffect(() => {
    if (!payload) return;
    if (isSavingProjects) return;

    if (projectResponse) {
      showTimedMessage("success", "⚡ Projects saved successfully!");

      setPayload(null);
    }
  }, [projectResponse, isSavingProjects]);


  const handleRowChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  return (
    <>
      {showAddCourse ? (
        <div className="course-category">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#!" onClick={() => { setShowAddCourse(false); setFormMode('Add'); }}>
                  GeoKeyword
                </a>
                <MdKeyboardArrowRight />
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {formMode === 'Add' ? 'Add GeoKeyword Details' : 'Edit GeoKeyword Details'}
              </li>
            </ol>
          </nav>
          <div className="category">
            <div className="category-header">
              <p style={{ marginBottom: 0 }}>{formMode === 'Add' ? 'Add GeoKeyword Details' : 'Edit GeoKeyword Details'}</p>
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="course-details">
                <div className="course-row">
                  <div className="col">
                    <label className="form-label">
                      Category Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      className="form-select"
                      name="courseCategory"
                      value={formData.courseCategory}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Category</option>

                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>

                  </div>
                  <div className="col">
                    <label className="form-label">
                      Course Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      className="form-select"
                      name="courseName"
                      value={formData.courseName}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Course</option>
                      {filteredCoursesByCategory.map((course) => (
                        <option key={course.id} value={course.courseName}>
                          {course.courseName}
                        </option>
                      ))}

                    </select>
                  </div>
                </div>
              </div>

              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650, marginTop: 5 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align='center' sx={{ fontSize: '16px', width: '25%' }}>
                        GeoKeyword <span style={{ color: "red" }}>*</span>
                      </StyledTableCell>
                      {/* <StyledTableCell align="center" sx={{ fontSize: '16px', width: '30%' }}>
                        Description <span style={{ color: "red" }}>*</span>
                      </StyledTableCell> */}
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
                            placeholder="Enter GeoKeyword (Required)"
                            required
                            style={{
                              borderColor: row.title.trim() === '' ? 'red' : '#ced4da'
                            }}
                          />
                        </StyledTableCell>
                        {/* <StyledTableCell align='center' style={{ maxWidth: 500, overflow: 'hidden' }}>
                          <div style={{ maxWidth: '100%' }}>
                            <ReactQuill
                              theme="snow"
                              value={row.topic}
                              onChange={(value) => {
                                const updatedRows = [...rows];
                                updatedRows[index].topic = value;
                                setRows(updatedRows);
                              }}
                              style={{
                                width: '100%',
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word',
                              }}
                              placeholder="Enter GeoKeyword description (Required)"
                            />
                          </div>
                        </StyledTableCell> */}

                        <StyledTableCell align="center">
                          {!isEditMode && (
                            <>
                              <GoPlus
                                onClick={addRow}
                                style={{
                                  fontSize: "2rem",
                                  color: "#00AEEF",
                                  marginRight: "10px",
                                  cursor: "pointer",
                                }}
                              />
                              <IoClose
                                onClick={() => deleteRow(row.id)}
                                style={{
                                  fontSize: "2rem",
                                  color: "red",
                                  cursor: "pointer",
                                }}
                              />
                            </>
                          )}
                        </StyledTableCell>

                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Show error messages */}
              {errorMessage && (
                <p style={{ color: "red", fontWeight: "bold", margin: "10px 0", textAlign: "center" }}>
                  {errorMessage}
                </p>
              )}

              <div className="course-row">

                <button
                  className="submit-btn"
                  onClick={handleSubmit}
                  disabled={isSubmitDisabled}
                >
                  {isEditMode ? "Update" : "Submit"}
                </button>

              </div>
            </form>

            <Helmet>
              <title>{formData.headerTitle || 'Default Title'}</title>
              <meta name="description" content={formData.courseKeywordDescription || 'Default Description'} />
              <meta name="keywords" content={formData.courseKeyword || 'Default Keywords'} />
            </Helmet>
          </div>
        </div>
      ) : (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="course-category">
            <p>{pageTitle}</p>
            <div className="category">
              <div className="category-header">
                <p style={{ marginBottom: 0 }}>{headerTitle}</p>
              </div>

              <div className="date-schedule">
                Start Date
                <DatePicker
                  value={startDate}
                  onChange={setStartDate}
                  sx={{ '& .MuiIconButton-root': { color: '#00aeef' } }}
                />
                End Date
                <DatePicker
                  value={endDate}
                  onChange={setEndDate}
                  sx={{ '& .MuiIconButton-root': { color: '#00aeef' } }}
                />
                <button className="filter" onClick={handleDateFilter}>Filter</button>
                <button className="filter" onClick={handleDateReset}>Reset</button>
              </div>

              <div className="entries">
                <div className="entries-left">
                  <p>Show</p>
                  <div className="btn-group">
                    <button type="button" className="btn-number dropdown-toggle" data-bs-toggle="dropdown">
                      {rowsPerPage}
                    </button>
                    <ul className="dropdown-menu">
                      {[10, 25, 50].map((num) => (
                        <li key={num}>
                          <a className="dropdown-item" href="#!" onClick={() => handleRowsPerPageChange(num)}>{num}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p>entries</p>
                </div>
                <div className="entries-right">
                  <div className="search">
                    <div className="search-div" style={{ border: '1px solid #d3d3d3' }}>
                      <input
                        type="search"
                        className="search-input"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button className="btn-search"><IoSearch /></button>
                    </div>
                  </div>
                  <button className="btn-category" onClick={handleAddTrendingCourseClick}>
                    <FiPlus /> {buttonLabel}
                  </button>
                </div>
              </div>

              <TableContainer component={Paper} sx={{ padding: '0 10px' }}>
                <Table sx={{ minWidth: 700 }}>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center"><Checkbox /></StyledTableCell>
                      <StyledTableCell align="center">S.No.</StyledTableCell>
                      <StyledTableCell align="center">Category Name</StyledTableCell>
                      <StyledTableCell align="center">Course Name</StyledTableCell>
                      <StyledTableCell align="center">GeoKeyword</StyledTableCell>
                      {/* <StyledTableCell align="center">Description</StyledTableCell> */}
                      <StyledTableCell align="center">Date</StyledTableCell>
                      <StyledTableCell align="center">Action</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayedProjects.length > 0 ? (
                      displayedProjects.map((project, idx) => (
                        <StyledTableRow key={project.projectId}>
                          <StyledTableCell align="center">
                            <Checkbox />
                          </StyledTableCell>

                          <StyledTableCell align="center">
                            {idx + 1 + (currentPage - 1) * rowsPerPage}
                          </StyledTableCell>

                          <StyledTableCell align="left">
                            {project.courseCategory}
                          </StyledTableCell>

                          <StyledTableCell align="left">
                            {project.courseName}
                          </StyledTableCell>

                          <StyledTableCell align="left">
                            {project.projectName}
                          </StyledTableCell>

                          {/* <StyledTableCell align="left">
                            <div
                              dangerouslySetInnerHTML={{ __html: project.description }}
                            />
                          </StyledTableCell> */}
                          <StyledTableCell align="center">
                            {project.date
                              ? dayjs(project.date, "YYYY-MM-DD").format("MMM-DD-YYYY").toUpperCase()
                              : "N/A"}
                          </StyledTableCell>


                          <StyledTableCell align="center">
                            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                              <FaEdit
                                className="edit"
                                onClick={() => handleEditClick(project)}
                                style={{ cursor: "pointer", color: "#00AEEF" }}
                              />
                              <RiDeleteBin6Line
                                className="delete"
                                onClick={() => handleDeleteConfirmation(project.projectId)}
                                style={{ cursor: "pointer", color: "#FF0000" }}
                              />
                            </div>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))
                    ) : (
                      <StyledTableRow>
                        <StyledTableCell colSpan={8} align="center">
                          No GeoKeyword available.
                        </StyledTableCell>
                      </StyledTableRow>
                    )}
                  </TableBody>

                </Table>
              </TableContainer>

              {successMessage && <p style={{ color: "green", fontWeight: "bold", margin: "10px 0" }}>{successMessage}</p>}
              {errorMessage && <p style={{ color: "red", fontWeight: "bold", margin: "10px 0" }}>{errorMessage}</p>}

              <div className="pagination-container">
                <AdminPagination
                  currentPage={currentPage}
                  rowsPerPage={rowsPerPage}
                  totalRows={filteredProjects.length}

                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </LocalizationProvider>
      )}
    </>
  );
};

export default GeoKeyword;