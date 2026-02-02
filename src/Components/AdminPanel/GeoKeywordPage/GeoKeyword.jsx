import React, { useState } from 'react';
import axios from "axios";

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
import { useUpdateProject } from "../../../Api/hooks/AdminProjects/useUpdateProject";
import { useDeleteProject } from "../../../Api/hooks/AdminProjects/useDeleteProject";
import dayjs from 'dayjs';

const fetchGeoKeywordsByCategoryCourse = async (categoryName, courseName) => {
  const res = await axios.get(
    "https://api.test.hachion.co/api/admin/geo-keywords/by-category-course",
    {
      params: { categoryName, courseName },
    }
  );
  return res.data; // GeoKeywordResponse
};


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
  const [editingGeoKeywordId, setEditingGeoKeywordId] = useState(null);
  
  // New state for checkbox selection
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const { data: categories = [], isLoading } = useCategories();
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  const { mutate: updateProject } = useUpdateProject();
  const { mutate: deleteProject } = useDeleteProject();

  const isEditMode = formMode === "Edit";
  const isAddMode = formMode === "Add";

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
  const [isSavingProjects, setIsSavingProjects] = useState(false);

  const { data: allCourses = [] } = useCourses();

  const filteredCoursesByCategory = allCourses.filter(
    (c) => c.courseCategory === formData.courseCategory
  );
  
  const [rows, setRows] = useState([
    { id: 1, title: '', isExisting: false }
  ]);

  const hasCategory = formData.courseCategory?.trim() !== "";
  const hasCourseName = formData.courseName?.trim() !== "";
  const allProjectsComplete = rows.every(row =>
    row.title && row.title.trim() !== ''
  );
  const hasAtLeastOneProject = rows.length > 0;
  const isSubmitDisabled = !hasCategory || !hasCourseName || !allProjectsComplete || !hasAtLeastOneProject;
  
  React.useEffect(() => {
    if (
      isAddMode &&
      formData.courseCategory &&
      formData.courseName
    ) {
      const loadExistingGeoKeywords = async () => {
        try {
          setIsSavingProjects(true);

          const response = await fetchGeoKeywordsByCategoryCourse(
            formData.courseCategory,
            formData.courseName
          );

          if (response?.geoKeywords?.length > 0) {
            setRows(
              response.geoKeywords.map((kw, index) => ({
                id: index + 1,
                title: kw.geoKeywordName,
                isExisting: true,
              }))
            );
          } else {
            setRows([{ id: 1, title: "" }]);
          }
        } catch (err) {
          console.error("Failed to load existing geo keywords", err);
        } finally {
          setIsSavingProjects(false);
        }
      };

      loadExistingGeoKeywords();
    }
  }, [
    isAddMode,
    formData.courseCategory,
    formData.courseName,
  ]);

  React.useEffect(() => {
    const fetchGeoKeywords = async () => {
      try {
        setProjectsLoading(true);
        const res = await axios.get(
          "https://api.test.hachion.co/api/admin/geo-keywords"
        );
        setProjects(res.data);
      } catch (error) {
        console.error(error);
        setErrorMessage("❌ Failed to load GeoKeywords");
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchGeoKeywords();
  }, []);
  
  const [autoLoaded, setAutoLoaded] = useState(false);

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
      setErrorMessage("❌ Please fill GeoKeyword for all rows.");
      return;
    }
    
    if (formMode === "Edit") {
      try {
        setIsSavingProjects(true);

        await axios.put(
          "https://api.test.hachion.co/api/admin/geo-keywords/update",
          {
            geoKeywordId: editingGeoKeywordId,
            geoKeywordName: rows[0].title,
          }
        );

        showTimedMessage("success", "⚡ GeoKeyword updated successfully!");
        
        setProjects(prev =>
          prev.map(item =>
            item.geoKeywordId === editingGeoKeywordId
              ? { ...item, geoKeywordName: rows[0].title }
              : item
          )
        );

        setFormData({
          courseCategory: "",
          courseName: "",
        });
        setRows([{ id: 1, title: "" }]);
        setEditingGeoKeywordId(null);
        setFormMode("Add");
        setShowAddCourse(false);
      } catch (error) {
        showTimedMessage(
          "error",
          error.response?.data?.message ||
            "❌ GeoKeyword already exists for this Category & Course"
        );
      } finally {
        setIsSavingProjects(false);
      }
    } else {
      try {
        setIsSavingProjects(true);

        const geoKeywordPayload = {
          categoryName: formData.courseCategory,
          courseName: formData.courseName,
          geoKeywords: rows.map(row => row.title),
        };

        const response = await axios.post(
          "https://api.test.hachion.co/api/admin/geo-keywords",
          geoKeywordPayload
        );

        console.log("GeoKeyword API Response:", response.data);
        showTimedMessage("success", "⚡ GeoKeywords saved successfully!");

        // Refresh the list after successful addition
        const refreshRes = await axios.get(
          "https://api.test.hachion.co/api/admin/geo-keywords"
        );
        setProjects(refreshRes.data);

        setFormData({
          courseCategory: "",
          courseName: "",
        });
        setRows([{ id: 1, title: "" }]);
        setShowAddCourse(false);
      } catch (error) {
        console.error(error);
        showTimedMessage("error", "❌ Failed to save GeoKeywords");
      } finally {
        setIsSavingProjects(false);
      }
    }
  };

  const handleEditClick = async (project) => {
    try {
      setFormMode("Edit");
      setShowAddCourse(true);
      setIsSavingProjects(true);

      setFormData({
        courseCategory: project.categoryName,
        courseName: project.courseName,
      });

      const response = await fetchGeoKeywordsByCategoryCourse(
        project.categoryName,
        project.courseName
      );

      setRows([
        {
          id: 1,
          title: project.geoKeywordName,
        },
      ]);

      setEditingGeoKeywordId(project.geoKeywordId);
    } catch (error) {
      showTimedMessage(
        "error",
        error.response?.data?.message ||
          "❌ Failed to load GeoKeywords for editing"
      );
    } finally {
      setIsSavingProjects(false);
    }
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
    const projectDate = new Date(item.groupCreatedDate);
    const search = searchTerm.toLowerCase();

    const matchSearch =
      item.geoKeywordName?.toLowerCase().includes(search) ||
      item.courseName?.toLowerCase().includes(search) ||
      item.categoryName?.toLowerCase().includes(search);

    const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
    const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

    const inRange =
      (!start || projectDate >= start) &&
      (!end || projectDate <= end);

    return matchSearch && inRange;
  });

  const displayedProjects = filteredProjects.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  
  // Handle Select All checkbox
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = displayedProjects.map(project => project.geoKeywordId);
      setSelectedIds(allIds);
      setSelectAll(true);
    } else {
      setSelectedIds([]);
      setSelectAll(false);
    }
  };

  // Handle individual checkbox
  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
      setSelectAll(false);
    } else {
      const newSelectedIds = [...selectedIds, id];
      setSelectedIds(newSelectedIds);
      // Check if all items are selected
      if (newSelectedIds.length === displayedProjects.length) {
        setSelectAll(true);
      }
    }
  };

  // Update selectAll state when page changes
  React.useEffect(() => {
    const allCurrentPageIds = displayedProjects.map(project => project.geoKeywordId);
    const allSelected = allCurrentPageIds.length > 0 && 
                       allCurrentPageIds.every(id => selectedIds.includes(id));
    setSelectAll(allSelected);
  }, [currentPage, displayedProjects, selectedIds]);

  const handleDeleteConfirmation = async (geoKeywordId) => {
    if (!geoKeywordId) {
      showTimedMessage("error", "❌ Invalid GeoKeyword ID");
      return;
    }

    if (window.confirm("Are you sure you want to delete this GeoKeyword?")) {
      try {
        await axios.delete(
          `https://api.test.hachion.co/api/admin/geo-keywords/${geoKeywordId}`
        );

        setProjects((prev) =>
          prev.filter((item) => item.geoKeywordId !== geoKeywordId)
        );

        // Remove from selectedIds if present
        setSelectedIds(prev => prev.filter(id => id !== geoKeywordId));

        showTimedMessage("success", "🗑️ GeoKeyword deleted successfully!");
      } catch (error) {
        showTimedMessage(
          "error",
          error.response?.data?.message || "❌ Failed to delete GeoKeyword"
        );
      }
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      showTimedMessage("error", "Please select at least one GeoKeyword to delete");
      return;
    }

    const confirmMessage = `Are you sure you want to delete ${selectedIds.length} selected ${selectedIds.length === 1 ? 'GeoKeyword' : 'GeoKeywords'}?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        setIsSavingProjects(true);
        
        // Delete all selected GeoKeywords
        await Promise.all(
          selectedIds.map(id =>
            axios.delete(`https://api.test.hachion.co/api/admin/geo-keywords/${id}`)
          )
        );

        // Update state
        const updatedProjects = projects.filter(item => !selectedIds.includes(item.geoKeywordId));
        setProjects(updatedProjects);
        
        setSelectedIds([]);
        setSelectAll(false);
        
        showTimedMessage("success", `${selectedIds.length} ${selectedIds.length === 1 ? 'GeoKeyword' : 'GeoKeywords'} deleted successfully`);
      } catch (error) {
        console.error("Error deleting GeoKeywords:", error);
        showTimedMessage("error", "Error deleting some GeoKeywords. Please try again.");
      } finally {
        setIsSavingProjects(false);
      }
    }
  };

  const handleAddTrendingCourseClick = async () => {
    setFormMode("Add");
    setEditingGeoKeywordId(null);
    setAutoLoaded(true);
    setShowAddCourse(true);

    setFormData({
      courseCategory: "",
      courseName: "",
    });

    setRows([{ id: 1, title: "" }]);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const addRow = () => {
    const newId = rows.length > 0 ? Math.max(...rows.map(row => row.id)) + 1 : 1;
    setRows([...rows, { id: newId, title: '', isExisting: false }]);
  };

  const deleteRow = (id) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== id));
    } else {
      setRows([{ id: 1, title: '', isExisting: false }]);
    }
  };

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
                      disabled={isEditMode}
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
                      disabled={isEditMode}
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
                            placeholder={
                              row.isExisting && isAddMode
                                ? "Existing GeoKeyword (Locked)"
                                : "Enter GeoKeyword (Required)"
                            }
                            required
                            disabled={isAddMode && row.isExisting}
                            style={{
                              backgroundColor: isAddMode && row.isExisting ? "#f5f5f5" : "white",
                              cursor: isAddMode && row.isExisting ? "not-allowed" : "text",
                              borderColor:
                                !row.title || row.title.trim() === '' ? 'red' : '#ced4da'
                            }}
                          />
                        </StyledTableCell>

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
                  disabled={isSubmitDisabled || isSavingProjects}
                  style={{
                    cursor: isSavingProjects ? "not-allowed" : "pointer",
                    opacity: isSavingProjects ? 0.7 : 1,
                  }}
                >
                  {isSavingProjects
                    ? isEditMode
                      ? "Updating..."
                      : "Submitting..."
                    : isEditMode
                    ? "Update"
                    : "Submit"}
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

              {/* Success and Error Messages */}
              {successMessage && <p style={{ color: "green", fontWeight: "bold", textAlign: "center", marginTop: "10px" }}>{successMessage}</p>}
              {errorMessage && <p style={{ color: "red", fontWeight: "bold", textAlign: "center", marginTop: "10px" }}>{errorMessage}</p>}

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
                  <button className="btn-category" onClick={handleAddTrendingCourseClick}>
                    <FiPlus /> {buttonLabel}
                  </button>
                </div>
              </div>

              <TableContainer component={Paper} sx={{ padding: '0 10px' }}>
                <Table sx={{ minWidth: 700 }}>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center" sx={{ width: '50px' }}>
                        <Checkbox 
                          checked={selectAll}
                          onChange={handleSelectAll}
                          indeterminate={selectedIds.length > 0 && selectedIds.length < displayedProjects.length}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">S.No.</StyledTableCell>
                      <StyledTableCell align="center">Category Name</StyledTableCell>
                      <StyledTableCell align="center">Course Name</StyledTableCell>
                      <StyledTableCell align="center">GeoKeyword</StyledTableCell>
                      <StyledTableCell align="center">Date</StyledTableCell>
                      <StyledTableCell align="center">Action</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayedProjects.length > 0 ? (
                      displayedProjects.map((project, idx) => (
                        <StyledTableRow key={`${project.geoKeywordGroupId}-${idx}`}>
                          <StyledTableCell align="center">
                            <Checkbox 
                              checked={selectedIds.includes(project.geoKeywordId)}
                              onChange={() => handleSelectOne(project.geoKeywordId)}
                            />
                          </StyledTableCell>

                          <StyledTableCell align="center">
                            {idx + 1 + (currentPage - 1) * rowsPerPage}
                          </StyledTableCell>

                          <StyledTableCell align="left">
                            {project.categoryName}
                          </StyledTableCell>

                          <StyledTableCell align="left">
                            {project.courseName}
                          </StyledTableCell>

                          <StyledTableCell align="left">
                            {project.geoKeywordName}
                          </StyledTableCell>
                          
                          <StyledTableCell align="center">
                            {project.groupCreatedDate
                              ? dayjs(project.groupCreatedDate).format("MMM-DD-YYYY").toUpperCase()
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
                                onClick={() => handleDeleteConfirmation(project.geoKeywordId)}
                                style={{ cursor: "pointer", color: "#FF0000" }}
                              />
                            </div>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))
                    ) : (
                      <StyledTableRow>
                        <StyledTableCell colSpan={7} align="center">
                          No GeoKeyword available.
                        </StyledTableCell>
                      </StyledTableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

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