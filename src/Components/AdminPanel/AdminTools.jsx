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
import { useCategories } from "../../Api/hooks/HomePageApi/NavbarApi/useCategories";
import { useCourses } from "../../Api/hooks/HomePageApi/NavbarApi/useCourses";
import { useAddTools } from "../../Api/hooks/AdminTools/useAddTools";
import { useGetAllToolsFlat } from "../../Api/hooks/AdminTools/useGetAllToolsFlat";
import { useUpdateToolItem } from "../../Api/hooks/AdminTools/useUpdateToolItem";
import { useDeleteToolItem } from "../../Api/hooks/AdminTools/useDeleteToolItem";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);


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

const extractOriginalFileName = (imageUrl) => {
  if (!imageUrl) return null;

  const fileName = imageUrl.split("/").pop(); 
  const parts = fileName.split("_");
  return parts.length >= 3 ? parts.slice(2).join("_") : fileName;
};

export default function AdminTools() {

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [tools, setTools] = useState([]);
  const [filteredTools, setFilteredTools] = useState([])
  const [message, setMessage] = useState(false);
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
  { id: Date.now(), toolKey: null, toolImages: null, preview: null }
]);


  const [endDate, setEndDate] = useState(null);
  const [toolsData, setToolsData] = useState({
    tool_id: "",
    category_name: '',
    courseName: '',
    toolsName: '',
    toolsLink: '',
  });
  const [editingRow, setEditingRow] = useState(null);

const [toolNames, setToolNames] = useState([]);

const [selectedTools, setSelectedTools] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError
  } = useCategories();
  const {
    data: courses = [],
    isLoading: coursesLoading,
    error: coursesError
  } = useCourses();

  const {
    mutate: addTools,
    isLoading: isAdding,
    error: addError,
  } = useAddTools();

const removeImageOnly = (rowId) => {
  setRows((prevRows) =>
    prevRows.map((row) =>
      row.id === rowId
        ? {
            ...row,
            toolImages: null,
            preview: null,
          }
        : row
    )
  );
};

  const {
    data: toolsFlat = [],
    isLoading: toolsLoading,
    error: toolsError,
  } = useGetAllToolsFlat();

  const {
    mutate: updateTool,
    isLoading: isUpdating,
  } = useUpdateToolItem();

  const {
    mutate: deleteToolItem,
    isLoading: isDeleting,
  } = useDeleteToolItem();

  const isEditMode = !!toolsData.tool_id;
  const isRowValid = (row) => {
  return (
    row.toolsLink &&
    row.toolsLink.trim() !== ""
    
  );
};

  const isFormValid = React.useMemo(() => {
    if (!toolsData.category_name || !toolsData.courseName) {
      return false;
    }

    if (isEditMode) {
      return rows.length === 1 && isRowValid(rows[0]);
    }

    return rows.length > 0 && rows.every(isRowValid);
  }, [toolsData, rows, isEditMode]);

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
  setRows([...rows, { id: Date.now(), toolKey: null, toolImages: null, preview: null }]);
};

const deleteRow = (id) => {
  setRows((prevRows) => {
    const rowToDelete = prevRows.find((r) => r.id === id);

    if (rowToDelete?.toolKey) {
      setSelectedTools((prev) => prev.filter((t) => t !== rowToDelete.toolKey));
    }

    return prevRows.filter((r) => r.id !== id);
  });
};

  const handleRowsPerPageChange = (rowsCount) => {
    setRowsPerPage(rowsCount);
    setCurrentPage(1);
  };
const handleReset = () => {
  setToolsData({
    tool_id: "",
    category_name: "",
    courseName: "",
    toolsName: "",
    toolsLink: "",
  });
  setRows([{ id: Date.now(), toolImages: null, preview: null }]);
  setSelectedTools([]); 
};


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
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

useEffect(() => {
  axios.get("https://api.test.hachion.co/api/tools/names")
    .then(res => setToolNames(res.data))
    .catch(() => setToolNames([]));
}, []);

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

    setEditingRow(null);

    setToolsData({
      tool_id: "",
      category_name: "",
      courseName: "",
      toolsName: "",
      toolsLink: "",
    });

   setRows([
  { id: Date.now(), toolKey: null, toolImages: null, preview: null }
]);


    setShowAddCourse(true);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleImageSelect = (file, index) => {
    if (!file) return;
    const updated = [...rows];
    updated[index].toolImages = file;
    updated[index].preview = URL.createObjectURL(file);
    setRows(updated);
  };
  const filteredCourses = React.useMemo(() => {
    if (!toolsData.category_name) return [];

    return courses.filter(
      (c) => c.courseCategory === toolsData.category_name
    );
  }, [courses, toolsData.category_name]);

  const handleSubmit = () => {
    if (!toolsData.category_name || !toolsData.courseName) {
      setErrorMessage("Please select Category and Course");
      return;
    }

    const row = rows[0];

    if (!row.toolsName || !row.toolsLink) {
      setErrorMessage("Tools name and link are required");
      return;
    }

    if (toolsData.tool_id) {
      updateTool(
        {
          itemId: toolsData.tool_id,
          category_name: toolsData.category_name,
          courseName: toolsData.courseName,
          toolsName: row.toolsName,
          toolsLink: row.toolsLink,
          toolImage: row.toolImages || null,
        },
        {
          onSuccess: () => {
            setSuccessMessage("Tool updated successfully");
            setShowAddCourse(false);
            setEditingRow(null);
            setRows([{ id: Date.now(), toolImages: null, preview: null }]);
            setToolsData({ tool_id: "", category_name: "", courseName: "" });
          },
          onError: (err) => {
            setErrorMessage(
              err?.response?.data?.message || "Update failed"
            );
          },
        }
      );
      return;
    }

   const validRows = rows.filter(
  r =>
    r.toolsName &&
    r.toolsLink &&
    (r.toolImages instanceof File || typeof r.toolImages === "string")
);

if (validRows.length === 0) {
  setErrorMessage("Please add at least one valid tool");
  return;
}


    addTools(
      {
        category_name: toolsData.category_name,
        courseName: toolsData.courseName,
        rows: validRows,
      },
      {
        onSuccess: () => {
          setSuccessMessage("Tools added successfully");
          setShowAddCourse(false);
          setRows([{ id: Date.now(), toolImages: null, preview: null }]);
          setToolsData({ category_name: "", courseName: "" });
        },
        onError: (err) => {
          setErrorMessage(
            err?.response?.data?.message || "Failed to add tools"
          );
        },
      }
    );
  };

  const handleEditClick = (row) => {
    setEditingRow(row);

    setToolsData({
      tool_id: row.id,
      category_name: row.category_name,
      courseName: row.courseName,
    });

    setRows([
      {
        id: row.id,
        toolImages: null,
        preview: row.imageUrl
          ? `https://api.test.hachion.co/uploads/test/tools_images/${row.imageUrl}`
          : null,
        toolsName: row.toolsName,
        toolsLink: row.toolsLink,
      },
    ]);

    setShowAddCourse(true);
  };
  const handleDeleteClick = (row) => {
    if (!window.confirm("Are you sure you want to delete this tool?")) {
      return;
    }

    deleteToolItem(
      {
        itemId: row.id,
        category_name: row.category_name,
        courseName: row.courseName,
      },
      {
        onSuccess: () => {
          setSuccessMessage("Tool deleted successfully");
          setErrorMessage("");
        },
        onError: (err) => {
          setErrorMessage(
            err?.response?.data || "Failed to delete tool"
          );
        },
      }
    );
  };
const handleToolCheckboxChange = async (toolName, isChecked) => {
  if (isChecked) {
    try {
      const res = await axios.get(
        "https://api.test.hachion.co/api/tools/details",
        { params: { toolName } }
      );

      const tool = res.data;

      setSelectedTools((prev) =>
        prev.includes(toolName) ? prev : [...prev, toolName]
      );

  
      setRows((prevRows) => {
        const firstRowEmpty =
          prevRows.length === 1 &&
          !prevRows[0].toolsName &&
          !prevRows[0].toolsLink &&
          !prevRows[0].preview;
const newRow = {
  id: Date.now() + Math.random(),
  toolKey: toolName,
  toolsName: tool.toolsName,
  toolsLink: tool.toolsLink,

  
  toolImages: tool.imageUrl,

  preview: tool.imageUrl
    ? `https://api.test.hachion.co/uploads/test/tools_images/${tool.imageUrl}`
    : null,
};


        if (firstRowEmpty) {
          return [{ ...prevRows[0], ...newRow, id: prevRows[0].id }];
        }

        return [...prevRows, newRow];
      });
    } catch (e) {
      setErrorMessage("Failed to load tool details");
    }
  } else {
    
    setSelectedTools((prev) => prev.filter((t) => t !== toolName));

    setRows((prevRows) => prevRows.filter((row) => row.toolKey !== toolName));
  }
};


  useEffect(() => {
    if (toolsFlat.length > 0) {
      setAllData(toolsFlat);
      setFilteredTools(toolsFlat);
    }
  }, [toolsFlat]);

  return (
    <>
      {showAddCourse ? (
        <div className='course-category'>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                {/* <a href="#!" onClick={() => setShowAddCourse(false)}>Tools Covered </a> <MdKeyboardArrowRight /> */}
                <a
                  href="#!"
                  onClick={() => {
                    setShowAddCourse(false);


                    setEditingRow(null);
                    setToolsData({
                      tool_id: "",
                      category_name: "",
                      courseName: "",
                      toolsName: "",
                      toolsLink: "",
                    });
                    setRows([{ id: Date.now(), toolImages: null, preview: null }]);
                  }}
                >
                  Tools Covered
                </a>
                <MdKeyboardArrowRight />
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
                  <label htmlFor="inputState" className="form-label">Category Name <span className="required">*</span></label>
                  {/* <select id="inputState" className="form-select" name='category_name' value={toolsData.category_name} onChange={handleChange}> */}
                  <select
                    id="inputState"
                    className="form-select"
                    name="category_name"
                    value={toolsData.category_name}
                    onChange={handleChange}
                    disabled={!!toolsData.tool_id}
                  >

                    <option value="" disabled>
                      Select Category
                    </option>
                    {categoriesLoading && (
                      <option disabled>Loading categories...</option>
                    )}

                    {categoriesError && (
                      <option disabled>Error loading categories</option>
                    )}

                    {categories.map((curr) => (
                      <option key={curr.id} value={curr.name}>
                        {curr.name}
                      </option>
                    ))}

                  </select>
                </div>
                <div className="col-md-3">
                  <label htmlFor="course" className="form-label">Course Name <span className="required">*</span></label>

                  <select
                    id="course"
                    className="form-select"
                    name="courseName"
                    value={toolsData.courseName}
                    onChange={handleChange}
                    disabled={!toolsData.category_name || !!toolsData.tool_id}

                  >
                    <option value="" disabled>
                      Select Course
                    </option>

                    {!toolsData.category_name && (
                      <option disabled>Select category first</option>
                    )}

                    {coursesLoading && (
                      <option disabled>Loading courses...</option>
                    )}

                    {coursesError && (
                      <option disabled>Error loading courses</option>
                    )}

                    {filteredCourses.map((curr, index) => (
                      <option
                        key={`${curr.courseName}-${index}`}
                        value={curr.courseName}
                      >
                        {curr.courseName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
  <label htmlFor="toolName" className="form-label">Tool Name 
    {/* <span className="required">*</span> */}
    </label>
  <div className="dropdown">
    <button
      className="form-select d-flex justify-content-between align-items-center"
      type="button"
      id="toolDropdown"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      style={{ textAlign: 'left' }}
    >
      {/* <span>
        {rows[0]?.selectedTools && rows[0]?.selectedTools.length > 0 
          ? `${rows[0]?.selectedTools.length} tool${rows[0]?.selectedTools.length !== 1 ? 's' : ''} selected` 
          : 'Select Tools'}
      </span> */}
      <span>
  {selectedTools.length > 0
    ? `${selectedTools.length} tool${selectedTools.length !== 1 ? "s" : ""} selected`
    : "Select Tools"}
</span>

    </button>
    <ul className="dropdown-menu" aria-labelledby="toolDropdown" style={{ width: '100%', maxHeight: '300px', overflowY: 'auto' }}>
     {toolNames.map((tool, index) => (

        <li key={index}>
          <div className="dropdown-item">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`tool-${index}`}
                
                checked={selectedTools.includes(tool)}


                onChange={(e) => handleToolCheckboxChange(tool, e.target.checked)}
                disabled={isEditMode}
              />
              <label className="form-check-label" htmlFor={`tool-${index}`}>
                {tool}
              </label>
            </div>
          </div>
        </li>
      ))}
      <li>
        <hr className="dropdown-divider" />
      </li>
      <li>
        <div className="dropdown-item">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="tool-other"
              checked={rows[0]?.selectedTools?.includes('Other') || false}
              onChange={(e) => handleToolCheckboxChange('Other (Custom)', e.target.checked)}
              disabled={isEditMode}
            />
            <label className="form-check-label" htmlFor="tool-other">
              Other (Custom)
            </label>
          </div>
        </div>
      </li>
    </ul>
  </div>
  
  {/* Display selected tools as tags */}
  {/* {rows[0]?.selectedTools && rows[0]?.selectedTools.length > 0 && (
    <div className="selected-tools-container mt-2">
      <small className="text-muted">Selected: </small>
      <div className="d-flex flex-wrap gap-1 mt-1">
        {rows[0].selectedTools.map((tool, index) => (
          <span key={index} className="badge bg-primary d-flex align-items-center">
            {tool}
            {!isEditMode && (
              <button 
                type="button" 
                className="btn-close btn-close-white ms-1" 
                style={{ fontSize: '0.5rem' }}
                onClick={() => handleToolCheckboxChange(tool, false)}
                aria-label="Remove"
              ></button>
            )}
          </span>
        ))}
      </div>
    </div>
  )} */}
  {selectedTools.length > 0 && (
  <div className="selected-tools-container mt-2">
    <small className="text-muted">Selected:</small>
    <div className="d-flex flex-wrap gap-1 mt-1">
      {selectedTools.map((tool, index) => (
        <span
          key={index}
          className="badge bg-primary d-flex align-items-center"
        >
          {tool}
          {!isEditMode && (
            <button
              type="button"
              className="btn-close btn-close-white ms-1"
              style={{ fontSize: "0.5rem" }}
              onClick={() => handleToolCheckboxChange(tool, false)}
            />
          )}
        </span>
      ))}
    </div>
  </div>
)}

</div>
              </div>

              <TableContainer component={Paper}>
                <Table sx={{ maxWidth: 800, marginTop: 5 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">Tools Images <span className="required">*</span></StyledTableCell>
                      <StyledTableCell align="center">Tools Name 
                        {/* <span className="required">*</span> */}
                        </StyledTableCell>
                      <StyledTableCell align="center">Tools Download Link <span className="required">*</span></StyledTableCell>
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
    position: "absolute",
    top: -8,
    right: -8,
    fontSize: "1.2rem",
    color: "red",
    cursor: "pointer",
    backgroundColor: "#fff",
    borderRadius: "50%",
  }}
  onClick={() => removeImageOnly(row.id)}   
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
                            disabled={isEditMode}
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

              <div className="course-row" style={{ gap: 12 }}>
                <button
                  className='submit-btn'
                  onClick={handleSubmit}
                  disabled={!isFormValid || isAdding || isUpdating}
                  style={{
                    opacity: (!isFormValid || isAdding || isUpdating) ? 0.6 : 1,
                    cursor: (!isFormValid || isAdding || isUpdating) ? "not-allowed" : "pointer",
                  }}
                >
                  {toolsData.tool_id ? "Update" : "Submit"}
                </button>
                {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}

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
                      '& .MuiIconButton-root': { color: '#00aeef' }
                    }}
                  />
                  End Date
                  <DatePicker
                    value={endDate}
                    onChange={(date) => setEndDate(date)}
                    slotProps={{ actionBar: { actions: ['clear'] } }}
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
                  <StyledTableCell align='center' sx={{ width: '50px' }}>
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
                      {/* <StyledTableCell align="left">
                        {(courseRow.toolImages || []).length ? (
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {courseRow.toolImages.slice(0, 4).map((img, i) => (
                              <img key={i} src={img.url} alt={img.name} style={{ width: 40, height: 28, objectFit: 'cover', borderRadius: 4, border: '1px solid #ddd' }} />
                            ))}
                            {courseRow.toolImages.length > 4 && <span>+{courseRow.toolImages.length - 4}</span>}
                          </div>
                        ) : ("")}
                      </StyledTableCell> */}
                      <StyledTableCell align="center">
                        {courseRow.imageUrl && (
                          <img
                            src={`https://api.test.hachion.co/uploads/test/tools_images/${courseRow.imageUrl}`}
                            alt={courseRow.toolsName}
                            style={{
                              width: 40,
                              height: 28,
                              objectFit: "cover",
                              borderRadius: 4,
                              border: "1px solid #ddd",
                            }}
                          />
                        )}
                      </StyledTableCell>

                      <StyledTableCell align="left">{courseRow.toolsName}</StyledTableCell>
                      <StyledTableCell align="left">{courseRow.toolsLink}</StyledTableCell>
                      <StyledTableCell align="center">
                        {courseRow.createdDate
                          ? dayjs(courseRow.createdDate).format("MMM-DD-YYYY").toUpperCase()
                          : "N/A"}
                      </StyledTableCell>


                      <StyledTableCell align="center">
                        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                          <FaEdit className="edit" onClick={() => handleEditClick(courseRow)} style={{ cursor: 'pointer' }} />
                          {/* <RiDeleteBin6Line className="delete" onClick={() => handleDeleteClick(courseRow.curr_id)} style={{ cursor: 'pointer' }} /> */}
                          <RiDeleteBin6Line
                            className="delete"
                            onClick={() => handleDeleteClick(courseRow)}
                            style={{ cursor: "pointer" }}
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
