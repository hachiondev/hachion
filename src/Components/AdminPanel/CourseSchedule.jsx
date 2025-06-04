import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { IoSearch } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { IoMdCloseCircleOutline } from "react-icons/io";
import axios from "axios";
import { GoPlus } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { MdKeyboardArrowRight } from "react-icons/md";
import "./Admin.css";
import AdminPagination from "./AdminPagination";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#00AEEF",
    color: theme.palette.common.white,
    borderRight: "1px solid white",
    padding: '3px 5px',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: '3px 4px',
    borderRight: "1px solid #e0e0e0",
  },
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
export default function CourseSchedule() {
  const [trainer, setTrainer] = useState([]);
  const [courses, setCourses] = useState([]);
  const [category, setCategory] = useState([]);
  const [courseCategory, setCourseCategory] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filterCourse, setFilterCourse] = useState([]);
  const [open, setOpen] = useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [message, setMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [catChange, setCatChange] = useState(0);
  const [editedRow, setEditedRow] = useState({
    schedule_category_name: "",
    schedule_course_name: "",
    trainer_name: "",
    schedule_date: null,
    schedule_frequency: "",
    schedule_time: null,
    schedule_duration: "",
    schedule_mode: "",
    pattern: "",
    meeting: "",
  });
  const [selectedRow, setSelectedRow] = useState({
    schedule_category_name: "",
    schedule_course_name: "",
    trainer_name: "",
    schedule_date: "",
    schedule_frequency: "",
    schedule_time: "",
    schedule_duration: "",
    schedule_mode: "",
    pattern: "",
    meeting: "",
  });
  const currentDate = new Date().toISOString().split("T")[0];
  const [courseData, setCourseData] = useState({
    course_schedule_id: "",
    schedule_category_name: "",
    schedule_course_name: "",
    trainer_name: "",
    created_date: currentDate,
   
  });
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
  const displayedCategories = filteredCourses.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const [rows, setRows] = useState([
    {
      id: "",
    schedule_date: null,
    schedule_frequency: "",
    schedule_week: "",
    schedule_time: null,
    schedule_duration: "",
    schedule_mode: "",
    pattern: "",
    meeting: "",
    },
  ]);
  const handleRowChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };
  const addRow = () => {
    setRows([...rows, { id: Date.now(),  schedule_date: "",  schedule_frequency: "", schedule_week: '',
      schedule_time:"",schedule_duration:"",schedule_mode:"",pattern:"",meeting:""
     }]);
  };
  
  const deleteRow = (id) => {
    setRows(rows.filter(row => row.id !== id));
  };
  const handleDateChange = (index, newValue) => {
    const parsedDate = dayjs(newValue);
    if (!parsedDate.isValid()) return;
  
    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index],
      schedule_date: parsedDate.format("MM-DD-YYYY"),
      schedule_week: parsedDate.format("dddd"),
    };
    setRows(updatedRows);
  };
  
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          "https://api.hachion.co/course-categories/all"
        );
        setCategory(response.data);
      } catch (error) {
      }
    };
    fetchCategory();
  }, []);
  useEffect(() => {
    const fetchCourseCategory = async () => {
      try {
        const response = await axios.get("https://api.hachion.co/courses/all");
        setCourseCategory(response.data);
      } catch (error) {
      }
    };
    fetchCourseCategory();
  }, []);
  useEffect(() => {
    if (courseData.schedule_category_name) {
      const filtered = courseCategory.filter(
        (course) => course.courseCategory === courseData.schedule_category_name
      );
      setFilterCourse(filtered);
    } else {
      setFilterCourse([]);
    }
  }, [courseData.schedule_category_name, courseCategory]);
  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const response = await axios.get("https://api.hachion.co/trainers");
        setTrainer(response.data);
      } catch (error) {
      }
    };
    fetchTrainer();
  }, []);
  const handleTimeChange = (index, newValue) => {
    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index],
      schedule_time: newValue ? dayjs(newValue).format("hh:mm A") : null,
    };
    setRows(updatedRows);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "schedule_category_name" && { schedule_course_name: "" }),
    }));
  };
  const handleReset = () => {
    setCourseData({
      schedule_category_name: "",
      schedule_course_name: "",
      schedule_date: "",
      schedule_week: "",
      schedule_time: "",
      schedule_frequency: "",
      schedule_duration: "",
      schedule_mode: "",
      trainer_name: "",
      created_date: "",
    });
  };
const handleSubmit = async () => {
  const newErrors = [];

  let hasError = false;

  rows.forEach((row, index) => {
    const rowErrors = {};

    if (!row.schedule_date) {
      rowErrors.schedule_date = "Date is required";
      hasError = true;
    }

    if (!row.schedule_frequency) {
      rowErrors.schedule_frequency = "Frequency is required";
      hasError = true;
    }

    if (!row.schedule_time) {
      rowErrors.schedule_time = "Time is required";
      hasError = true;
    }

    if (!row.schedule_duration) {
      rowErrors.schedule_duration = "Duration is required";
      hasError = true;
    }

    if (!row.schedule_mode) {
      rowErrors.schedule_mode = "Mode is required";
      hasError = true;
    }

    if (!row.pattern) {
      rowErrors.pattern = "Pattern is required";
      hasError = true;
    }

    if (!row.meeting) {
      rowErrors.meeting = "Meeting is required";
      hasError = true;
    }

    newErrors[index] = rowErrors;
  });

  if (hasError) {
    setFormErrors(newErrors);
    alert("Please fix the errors before submitting.");
    return;
  }

  const uploadPromises = rows.map(async (row) => {
    const formattedCourseData = {
      course_schedule_id: courseData.course_schedule_id,
      schedule_category_name: courseData.schedule_category_name,
      schedule_course_name: courseData.schedule_course_name,
      schedule_date: dayjs(row.schedule_date, "MM-DD-YYYY").format("YYYY-MM-DD"),
      schedule_week: row.schedule_week,
      schedule_time: row.schedule_time,
      schedule_duration: row.schedule_duration,
      schedule_mode: row.schedule_mode,
      trainer_name: courseData.trainer_name || "",
      created_date: courseData.created_date,
      meeting_link: row.meeting,
    };

    try {
      const response = await axios.post(
        "https://api.hachion.co/schedulecourse/add",
        formattedCourseData
      );
      return response.status === 201 || response.status === 200;
    } catch (error) {
      console.error("Error adding schedule:", error.response?.data || error.message);
      return false;
    }
  });

  const results = await Promise.all(uploadPromises);
  const allSuccessful = results.every((status) => status);

  if (allSuccessful) {
    alert("All schedule entries added successfully.");
    setShowAddCourse(false);
    setRows([{
      id: Date.now(),
      schedule_date: "",
      schedule_week: "",
      schedule_time: "",
      schedule_duration: "",
      schedule_mode: "",
      trainer_name: "",
      created_date: "",
      meeting: ""
    }]);
  } else {
    alert("Some schedule entries failed to upload. Please check the console for errors.");
  }
};
const isFormValid = () => {
  if (!courseData.schedule_category_name || !courseData.schedule_course_name) {
    return false;
  }

  for (let row of rows) {
    if (
      !row.schedule_date ||
      !row.schedule_time ||
      !row.schedule_duration ||
      !row.schedule_mode ||
      !row.pattern ||
      !row.meeting 
    ) {
      return false;
    }
  }

  return true;
};
  const handleDateFilter = () => {
    const filtered = courses.filter((course) => {
      const courseDate = new Date(course.schedule_date);
      return (
        (!startDate || courseDate >= new Date(startDate)) &&
        (!endDate || courseDate <= new Date(endDate))
      );
    });
    setFilteredCourses(filtered);
  };
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          "https://api.hachion.co/schedulecourse?userType=admin"
        );
        setCourses(response.data);
        setFilteredCourses(response.data);
      } catch (error) {
      }
    };
    fetchCourse();
  }, []);
  useEffect(() => {
    const filtered = courses.filter(
      (course) =>
        course.schedule_course_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        course.schedule_category_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        course.trainer_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);
  const handleDeleteConfirmation = (course_schedule_id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      handleDelete(course_schedule_id);
    }
  };
  const handleDelete = async (course_schedule_id) => {
    try {
      await axios.delete(
        `https://api.hachion.co/schedulecourse/delete/${course_schedule_id}`
      );
      setCourses((prevCourses) =>
        prevCourses.filter(
          (course) => course.course_schedule_id !== course_schedule_id
        )
      );
    } catch (error) {
    }
  };
  const handleAddTrendingCourseClick = () => setShowAddCourse(true);
  const handleClickOpen = (row) => {
    setSelectedRow(row);
    setEditedRow(row);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSave = async () => {
    try {
      const updatedEditedRow = {
        ...editedRow,
        schedule_date: dayjs(editedRow.schedule_date, "MM-DD-YYYY").format("YYYY-MM-DD"),
      };
      const response = await axios.put(
        `https://api.hachion.co/schedulecourse/update/${selectedRow.course_schedule_id}`,
        editedRow
      );
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.course_schedule_id === selectedRow.course_schedule_id
            ? response.data
            : course
        )
      );
      setMessage(true);
      setTimeout(() => {
        setMessage(false);
      }, 5000);
      setOpen(false);
    } catch (error) {
    }
  };
  const handleEditDateChange = (newValue) => {
    const parsedDate = dayjs(newValue);
    if (!parsedDate.isValid()) return;
  
    setEditedRow((prev) => ({
      ...prev,
      schedule_date: parsedDate.format("MM-DD-YYYY"),  // or use ISO format if backend expects it
      schedule_week: parsedDate.format("dddd"),
    }));
  };
  const handleEditTimeChange = (newValue) => {
    setEditedRow((prev) => ({
      ...prev,
      schedule_time: newValue ? dayjs(newValue).format("hh:mm A") : null,
    }));
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedRow((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "schedule_category_name" && { schedule_course_name: "" }),
    }));
    if (editedRow.schedule_category_name) {
      setCatChange(1);
      const filtered = courseCategory.filter(
        (course) => course.courseCategory === value
      );
      setFilterCourse(filtered);
    } else {
      setCatChange(0);
      setFilterCourse([]);
    }
  };

  const [formErrors, setFormErrors] = useState([]);

  const validateForm = () => {
  const rowErrors = [];

  // Validate main form fields
  const newErrors = {
    schedule_category_name: courseData.schedule_category_name ? "" : "Category is required",
    schedule_course_name: courseData.schedule_course_name ? "" : "Course is required",
    rows: [],
  };

  // Validate each row
  rows.forEach((row) => {
    const rowError = {
      schedule_date: row.schedule_date ? "" : "Date is required",
      schedule_frequency: row.schedule_frequency ? "" : "Frequency is required",
      schedule_time: row.schedule_time ? "" : "Time is required",
      schedule_duration: row.schedule_duration ? "" : "Duration is required",
      schedule_mode: row.schedule_mode ? "" : "Mode is required",
      pattern: row.pattern ? "" : "Pattern is required",
      meeting: row.meeting ? "" : "Meeting link is required",
    };
    rowErrors.push(rowError);
  });

  newErrors.rows = rowErrors;
  setFormErrors(newErrors);

  // Return true if no errors
  const hasMainErrors = newErrors.schedule_category_name || newErrors.schedule_course_name;
  const hasRowErrors = rowErrors.some((err) =>
    Object.values(err).some((val) => val !== "")
  );

  return !(hasMainErrors || hasRowErrors);
};

  return (
    <>
      {showAddCourse ? (
        <div style={{ flexGrow: 1, padding: "20px" }}>
          <div className="course-category">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="#!" onClick={() => setShowAddCourse(false)}>
                    Schedule
                  </a>
                  <MdKeyboardArrowRight />
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Add Schedule
                </li>
              </ol>
            </nav>
            <div className="category">
              <div className="category-header">
                <p style={{ marginBottom: 0 }}>Add Schedule</p>
              </div>
              <div className="course-details">
                <div className="course-row">
                  <div className="col-md-3">
                  <label htmlFor="inputState" className="form-label">
                    Category Name
                  </label>
                  <select
                    id="inputState"
                    className={`form-select ${formErrors.schedule_category_name ? "is-invalid" : ""}`}
                    name="schedule_category_name"
                    value={courseData.schedule_category_name}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {category.map((curr) => (
                      <option key={curr.id} value={curr.name}>
                        {curr.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.schedule_category_name && (
                    <div className="invalid-feedback">{formErrors.schedule_category_name}</div>
                  )}
                </div>
                  <div className="col-md-3">
                    <label htmlFor="course" className="form-label">
                      Course Name
                    </label>
                    <select
                      id="course"
                      className="form-select"
                      name="schedule_course_name"
                      value={courseData.schedule_course_name}
                      onChange={handleChange}
                      disabled={!courseData.schedule_category_name}
                    >
                      <option value="" disabled>
                        Select Course
                      </option>
                      {filterCourse.map((curr) => (
                        <option key={curr.id} value={curr.courseName}>
                          {curr.courseName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="inputState" className="form-label">
                      Trainer Name (Not Mandatory)
                    </label>
                    <select
                      id="inputState"
                      className="form-select"
                      name="trainer_name"
                      value={courseData.trainer_name}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        Select Trainer
                      </option>
                      {trainer.map((curr) => (
                        <option key={curr.id} value={curr.trainer_name}>
                          {curr.trainer_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <TableContainer component={Paper}>
                  <Table
                    sx={{ minWidth: 650, marginTop: 5 }}
                    aria-label="customized table"
                  >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TableHead>
                        <TableRow>
                          <StyledTableCell align="center" sx={{ fontSize: "16px" }}>
                            Date
                          </StyledTableCell>
                          <StyledTableCell align="center" sx={{ fontSize: "16px" }}>
                            Frequency
                          </StyledTableCell>
                          <StyledTableCell align="center" sx={{ fontSize: "16px" }}>
                            Time
                          </StyledTableCell>
                          <StyledTableCell align="center" sx={{ fontSize: "16px" }}>
                            Duration
                          </StyledTableCell>
                          <StyledTableCell align="center" sx={{ fontSize: "16px" }}>
                            Mode
                          </StyledTableCell>
                          <StyledTableCell align="center" sx={{ fontSize: "16px" }}>
                            Pattern
                          </StyledTableCell>
                          <StyledTableCell align="center" sx={{ fontSize: "16px", width: "500px" }}>
                            Meeting
                          </StyledTableCell>
                          <StyledTableCell align="center" sx={{ fontSize: "16px" }}>
                            Add/Delete Row
                          </StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row,index) => (
                          <StyledTableRow
                            key={row.id}
                            sx={{
                              "&:last-child td, &:last-child th": {
                                border: "1px solid #d3d3d3 ",
                              },
                            }}
                          >
                            <StyledTableCell component="th" scope="row" sx={{ padding: 0 }}>
                              <DatePicker
                              value={row.schedule_date ? dayjs(row.schedule_date, "MM-DD-YYYY") : null}
                              onChange={(newValue) => handleDateChange(index, newValue)}
                                renderInput={(params) => <TextField {...params} />}
                                sx={{
                                  "& .MuiInputBase-root": {
                                    width: "200px",
                                  },
                                  "& .MuiIconButton-root": {
                                    color: "#00aeef",
                                  },
                                }}
                              />
                              {formErrors[index]?.schedule_date && (
                      <div style={{ color: "red", fontSize: "12px" }}>
                        {formErrors[index].schedule_date}
                      </div>
                    )}
                            </StyledTableCell>
                            <StyledTableCell align="center" sx={{ padding: 0 }}>
                              <div className="col-md-3">
                                <select
                                  id="inputState"
                                  className="form-select"
                                  name="schedule_frequency"
                                  value={row.schedule_frequency}
                                  onChange={(e) => handleRowChange(index, 'schedule_frequency', e.target.value)}
                                >
                                  <option value="">Select</option>
                                  <option>Only Weekends</option>
                                  <option>Week Days</option>
                                  <option>Any Days</option>
                                </select>
                              </div>
                              {formErrors[index]?.schedule_frequency && (
                            <div style={{ color: "red", fontSize: "12px" }}>
                              {formErrors[index].schedule_frequency}
                            </div>
                          )}
                            </StyledTableCell>
                            <StyledTableCell align="center" sx={{ padding: 0 }}>
                              <TimePicker
                                label="Select Time"
                                ampm={true}
                                value={row.schedule_time ? dayjs(row.schedule_time, "hh:mm A") : null}
                                onChange={(newValue) => handleTimeChange(index, newValue)}
                                renderInput={(params) => <TextField {...params} />}
                                sx={{
                                  "& .MuiInputBase-root": {
                                    width: "200px",
                                  },
                                  "& .MuiIconButton-root": {
                                    color: "#00aeef",
                                  },
                                }}
                              />
                              {formErrors[index]?.schedule_time && (
                            <div style={{ color: "red", fontSize: "12px" }}>
                              {formErrors[index].schedule_time}
                            </div>
                          )}
                            </StyledTableCell>
                            <StyledTableCell align="center" sx={{ padding: 0 }}>
                              <input
                                name="schedule_duration"
                                className="table-curriculum"
                                value={rows.schedule_duration}
                                onChange={(e) => handleRowChange(index, 'schedule_duration', e.target.value)}
                              />
                              {formErrors[index]?.schedule_duration && (
                            <div style={{ color: "red", fontSize: "12px" }}>
                              {formErrors[index].schedule_duration}
                            </div>
                          )}
                            </StyledTableCell>
                            <StyledTableCell align="center" sx={{ padding: 0 }}>
                              <div className="col-md-3">
                                <select
                                  id="inputState"
                                  className="form-select"
                                  name="schedule_mode"
                                  value={rows.schedule_mode}
                                  onChange={(e) => handleRowChange(index, 'schedule_mode', e.target.value)}
                                >
                                  <option value="">Select</option>
                                  <option>Live Class</option>
                                  <option>Live Demo</option>
                                </select>
                              </div>
                              {formErrors[index]?.schedule_mode && (
                            <div style={{ color: "red", fontSize: "12px" }}>
                              {formErrors[index].schedule_mode}
                            </div>
                          )}
                            </StyledTableCell>
                            <StyledTableCell align="center" sx={{ padding: 0 }}>
                              <input
                                name="pattern"
                                className="table-curriculum"
                                value={rows.pattern}
                                onChange={(e) => handleRowChange(index, 'pattern', e.target.value)}
                              />
                              {formErrors[index]?.pattern && (
                              <div style={{ color: "red", fontSize: "12px" }}>
                                {formErrors[index].pattern}
                              </div>
                            )}
                            </StyledTableCell>
                            <StyledTableCell align="left" sx={{ padding: 0 }}>
                              <input
                                name="meeting"
                                className="table-curriculum"
                                value={rows.meeting}
                                onChange={(e) => handleRowChange(index, 'meeting', e.target.value)}
                              />
                              {formErrors[index]?.meeting && (
                              <div style={{ color: "red", fontSize: "12px" }}>
                                {formErrors[index].meeting}
                              </div>
                            )}
                            </StyledTableCell>
                            <StyledTableCell align="center" sx={{ padding: 0 }}>
                              <GoPlus
                                style={{
                                  fontSize: "2rem",
                                  color: "#00AEEF",
                                  marginRight: "10px",
                                }}
                                onClick={addRow}
                              />
                              <IoClose
                                style={{ fontSize: "2rem", color: "red" }}
                                onClick={() => deleteRow(row.id)}
                              />
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </LocalizationProvider>
                  </Table>
                </TableContainer>
                <div className="course-row">
                  <button
                    className="submit-btn"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={handleSubmit}
                    disabled={!isFormValid()}
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
        </div>
      ) : (
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="course-category">
              <p>Course Schedule</p>
              <div className="category">
                <div className="category-header">
                  <p style={{ marginBottom: 0 }}>View Schedule Courses</p>
                </div>
                <div className="date-schedule">
                  Start Date
                  <DatePicker
                    value={startDate}
                    onChange={(date) => setStartDate(date)}
                    isClearable
                    sx={{
                      "& .MuiIconButton-root": { color: "#00aeef" },
                    }}
                  />
                  End Date
                  <DatePicker
                    value={endDate}
                    onChange={(date) => setEndDate(date)}
                    isClearable
                    sx={{
                      "& .MuiIconButton-root": { color: "#00aeef" },
                    }}
                  />
                  <button className="filter" onClick={handleDateFilter}>
                    Filter
                  </button>
                </div>
                <div className="entries">
                  <div className="entries-left">
                    <p style={{ marginBottom: "0" }}>Show</p>
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn-number dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {rowsPerPage}
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <a
                            className="dropdown-item"
                            href="#!"
                            onClick={() => handleRowsPerPageChange(10)}
                          > 10
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#!"
                            onClick={() => handleRowsPerPageChange(25)}
                          >  25
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#!"
                            onClick={() => handleRowsPerPageChange(50)}
                          > 50
                          </a>
                        </li>
                      </ul>
                    </div>
                    <p style={{ marginBottom: "0" }}>entries</p>
                  </div>
                  <div className="entries-right">
                    <div
                      className="search-div"
                      role="search"
                      style={{ border: "1px solid #d3d3d3" }}
                    >
                      <input
                        className="search-input"
                        type="search"
                        placeholder="Enter Courses, Category or Keywords"
                        aria-label="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button className="btn-search" type="submit">
                        <IoSearch style={{ fontSize: "2rem" }} />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="btn-category"
                      onClick={handleAddTrendingCourseClick}
                    >
                      <FiPlus /> Add Schedule
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
                  <StyledTableCell align="center">
                    <Checkbox />
                  </StyledTableCell>
                  <StyledTableCell align="center">S.No.</StyledTableCell>
                  <StyledTableCell align="center">Batch ID</StyledTableCell>
                  <StyledTableCell align="center">
                    Category Name
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    Schedule Course Name
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    Schedule Date
                  </StyledTableCell>
                  <StyledTableCell align="center">Week</StyledTableCell>
                  <StyledTableCell align="center">Time</StyledTableCell>
                  <StyledTableCell align="center">Duration</StyledTableCell>
                  <StyledTableCell align="center">Mode</StyledTableCell>
                  <StyledTableCell align="center">Trainer</StyledTableCell>
                  <StyledTableCell align="center">Created Date</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedCategories.length > 0 ? (
                  displayedCategories.map((course, index) => (
                    <StyledTableRow key={course.course_schedule_id}>
                      <StyledTableCell align="center">
                        <Checkbox />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {index + 1 + (currentPage - 1) * rowsPerPage}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {course.batch_id}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {course.schedule_category_name}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {course.schedule_course_name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {course.schedule_date
                          ? dayjs(course.schedule_date).format("MM-DD-YYYY")
                          : "N/A"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {course.schedule_week}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {course.schedule_time} IST
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {course.schedule_duration}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {course.schedule_mode}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {course.trainer_name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {course.created_date
                          ? dayjs(course.created_date).format("MM-DD-YYYY")
                          : "N/A"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                          }}
                        >
                          <FaEdit
                            className="edit"
                            onClick={() => handleClickOpen(course)}
                          />
                          <RiDeleteBin6Line
                            className="delete"
                            onClick={() =>
                              handleDeleteConfirmation(course.course_schedule_id)
                            }
                          />
                        </div>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <StyledTableRow>
                    <StyledTableCell colSpan={12} align="center">
                      No schedules available
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
              totalRows={filteredCourses.length}
              onPageChange={handlePageChange}
            />
          </div>
          {message && <div className="success-message">{message}</div>}
        </div>
      )}
      <Dialog
        className="dialog-box"
        open={open}
        onClose={handleClose}
        aria-labelledby="edit-schedule-dialog"
        PaperProps={{
          style: { borderRadius: 20 },
        }}
      >
        <div className="dialog-title">
          <DialogTitle>Edit Schedule </DialogTitle>
          <Button onClick={handleClose} className="close-btn">
            <IoMdCloseCircleOutline
              style={{ color: "white", fontSize: "2rem" }}
            />
          </Button>
        </div>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="course-row">
              <div className="col">
                <label htmlFor="inputState" className="form-label">
                  Category Name
                </label>
                <select
                  id="inputState"
                  className="form-select"
                  name="schedule_category_name"
                  value={editedRow.schedule_category_name || ""}
                  onChange={handleInputChange}
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {category.map((curr) => (
                    <option key={curr.id} value={curr.name}>
                      {curr.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col">
                <label htmlFor="inputState" className="form-label">
                  Course Name
                </label>
                <select
                  id="inputState"
                  className="form-select"
                  name="schedule_course_name"
                  value={editedRow.schedule_course_name}
                  onChange={handleInputChange}
                >
                  <option value="" disabled>
                    Select Course
                  </option>
                  {catChange
                    ? filterCourse.map((curr) => (
                        <option key={curr.id} value={curr.courseName}>
                          {curr.courseName}
                        </option>
                      ))
                    : courseCategory.map((curr) => (
                        <option key={curr.id} value={curr.courseName}>
                          {curr.courseName}
                        </option>
                      ))}
                </select>
              </div>
            </div>
            <div className="course-row">
              <div className="col">
                <label className="form-label">Trainer</label>
                <input
                  type="text"
                  className="form-select"
                  placeholder="Trainer name"
                  name="trainer_name"
                  value={editedRow.trainer_name || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col">
                <label className="form-label">Date</label>
                <DatePicker
                  sx={{
                    "& .MuiIconButton-root": { color: "#00aeef" },
                  }}
                  value={
                    editedRow.schedule_date
                      ? dayjs(editedRow.schedule_date)
                      : null
                  }
                  onChange={handleEditDateChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </div>
            </div>
            <div className="course-row">
              <div className="col">
                <label className="form-label">Frequency</label>
                <select
                  id="inputState"
                  className="form-select"
                  name="schedule_frequency"
                  value={editedRow.schedule_frequency || ""}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option>Only Weekends</option>
                  <option>Week Days</option>
                  <option>Any Days</option>
                </select>
              </div>
              <div className="col">
                <label className="form-label">Time</label>
                <TimePicker
                  sx={{
                    "& .MuiIconButton-root": { color: "#00aeef" },
                  }}
                  value={
                    editedRow.schedule_time
                      ? dayjs(editedRow.schedule_time, "hh:mm A")
                      : null
                  }
                  ampm={true}
                  onChange={handleEditTimeChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </div>
            </div>
            <div className="course-row">
              <div className="col">
                <label className="form-label">Duration</label>
                <input
                  className="schedule-input"
                  name="schedule_duration"
                  value={editedRow.schedule_duration}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col">
                <label htmlFor="inputState" className="form-label">
                  Mode
                </label>
                <select
                  id="inputState"
                  className="form-select"
                  name="schedule_mode"
                  value={editedRow.schedule_mode || ""}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option>Live Class</option>
                  <option>Live Demo</option>
                </select>
              </div>
              <div className="col">
                <label className="form-label">Pattern</label>
                <input
                  className="schedule-input"
                  name="pattern"
                  value={editedRow.pattern}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="course-row">
              <div className="col">
                <label className="form-label">Meeting</label>
                <input
                  className="schedule-input"
                  name="meeting"
                  value={editedRow.meeting}
                  onChange={handleInputChange}
                />
              </div>
              {/* <div className="col">
                <label className="form-label">Batch ID</label>
                <input
                  className="schedule-input"
                  name="batch_id"
                  value={editedRow.batch_id}
                  onChange={handleInputChange}
                />
              </div> */}
            </div>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} className="update-btn">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}