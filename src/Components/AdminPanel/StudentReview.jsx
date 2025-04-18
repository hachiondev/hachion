import React, { useEffect } from "react";
import { useState } from "react";
import { duration, styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import "./Admin.css";
import dayjs from "dayjs";
import { RiCloseCircleLine } from "react-icons/ri";
import success from "../../Assets/success.gif";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
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
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { MdKeyboardArrowRight } from "react-icons/md";
import AdminPagination from "./AdminPagination";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#00AEEF",
    color: theme.palette.common.white,
    borderRight: "1px solid white", // Add vertical lines
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderRight: "1px solid #e0e0e0", // Add vertical lines for body rows
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

export default function Review() {
  const [course, setCourse] = useState([]);
  const [courseCategory, setCourseCategory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [review, setReview] = useState([]);
  const [filterCourse, setFilterCourse] = useState([]);
  const [filteredReview, setFilteredReview] = useState([]);
  const [open, setOpen] = React.useState(false);
  const currentDate = new Date().toISOString().split("T")[0];
  const [message, setMessage] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [catChange, setCatChange] = useState(0);
  const [selectedRow, setSelectedRow] = useState({
    category_name: "",
    course_name: "",
    student_name: "",
    image: null,
    source: "",
    comment: "",
  });
  const [editedData, setEditedData] = useState({
    category_name: "",
    course_name: "",
    student_name: "",
    image: null,
    source: "",
    comment: "",
    display: "",
    displayPages: [],
  });
  const [reviewData, setReviewData] = useState({
    review_id: "",
    category_name: "",
    course_name: "",
    date: currentDate,
    type: false,
    student_name: "",
    source: "",
    comment: "",
    image: null,
    display: "",
    displayPages: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, window.scrollY);
  };
  const handleEditCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setEditedData((prev) => ({
      ...prev,
      display: checked
        ? [...prev.display, value] // Add value if checked
        : prev.display.filter((item) => item !== value), // Remove if unchecked
    }));
  };

  // Inside your CourseCategory component
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    let updatedPages = [...reviewData.displayPages];

    if (checked) {
      updatedPages.push(value);
    } else {
      updatedPages = updatedPages.filter((page) => page !== value);
    }

    setReviewData({
      ...reviewData,
      displayPages: updatedPages,
      display: updatedPages.length > 0 ? updatedPages.join(", ") : "", // Join values as a string
    });
  };
  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1); // Reset to the first page whenever rows per page changes
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReviewData((prevData) => ({
        ...prevData,
        image: file, // Ensure file object is stored
      }));
    }
  };

  const displayedCategories = filteredReview.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleReset = () => {
    setReviewData({
      review_id: "",
      category_name: "",
      course_name: "",
      date: currentDate,
      student_name: "",
      source: "",
      comment: "",
      image: null,
    });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value, // Updates the corresponding field
    }));
    if (name === "category_name") {
      // alert(name);
      // alert(value);
      setCatChange(1);
      const filtered = courseCategory.filter(
        (course) => course.courseCategory === value
      );
      setFilterCourse(filtered);
    }
  };

  const handleClose = () => {
    setOpen(false); // Close the modal
  };
  useEffect(() => {
    const fetchCourseCategory = async () => {
      try {
        const response = await axios.get("http://localhost:8080/courses/all");
        setCourseCategory(response.data); // Assuming the data contains an array of trainer objects
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };
    fetchCourseCategory();
  }, []);
  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get("http://localhost:8080/userreview");
        const filteredReviews = response.data.filter(
          (review) => review.type === true
        );
        setReview(filteredReviews);
        setFilteredReview(filteredReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error.message);
      }
    };

    fetchReview();
  }, []);

  const handleDeleteConfirmation = (review_id) => {
    if (window.confirm("Are you sure you want to delete this Resume details")) {
      handleDelete(review_id);
    }
  };

  //   const handleDateFilter = () => {
  //     const filtered = review.filter((item) => {
  //       const videoDate = new Date(item.date); // Parse the date field
  //       const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
  //       const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

  //       return (
  //         (!start || videoDate >= start) &&
  //         (!end || videoDate <= end)
  //       );
  //     });

  //     setFilteredReview(filtered);
  //   };
  const handleSave = async () => {
    try {
      const formData = new FormData();

      const updatedReviewObject = {
        name: editedData.student_name,
        social_id: editedData.source,
        display: editedData.display.join(","), // Convert array to comma-separated string
        course_name: editedData.course_name,
        review: editedData.comment,
        email: editedData.email || "",
        type: editedData.type || "",
        trainer_name: editedData.trainer_name || "",
        rating: editedData.rating || "",
        location: editedData.location || "",
        date: new Date().toISOString().split("T")[0],
      };

      formData.append("review", JSON.stringify(updatedReviewObject));

      if (editedData.image instanceof File) {
        formData.append("user_image", editedData.image);
      }

      const response = await axios.put(
        `http://localhost:8080/userreview/update/${editedData.review_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setReview((prev) =>
          prev.map((curr) =>
            curr.review_id === editedData.review_id ? response.data : curr
          )
        );
        setMessage("Review updated successfully!");
        setTimeout(() => setMessage(""), 5000);
        setOpen(false);
      }
    } catch (error) {
      console.error("Error updating review:", error);
      setMessage("Error updating Review.");
    }
  };

  const handleDelete = async (review_id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/userreview/delete/${review_id}`
      );
      console.log("Review deleted successfully:", response.data);
    } catch (error) {
      console.error("Error deleting Review:", error);
    }
  };
  useEffect(() => {
    const filtered = review.filter(
      (review) =>
        review.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.student_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReview(filtered);
  }, [searchTerm, filteredReview]);

  const handleCloseModal = () => {
    setShowAddCourse(false);
  };
  const handleClickOpen = (row) => {
    setSelectedRow(row);
    setEditedData(row);
    console.log("ROW", editedData); // Set the selected row data
    setOpen(true); // Open the modal
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     const currentDate = new Date().toISOString().split("T")[0]; // Today's date

  //     const formData = new FormData();
  //     formData.append("name", reviewData.student_name);
  //     formData.append("social_id", reviewData.source);
  //     formData.append("category_name", reviewData.category_name);
  //     formData.append("course_name", reviewData.course_name);
  //     formData.append("review", reviewData.comment);
  //     formData.append("email",reviewData.email||"");
  //     formData.append("type",reviewData.type||"");
  //     formData.append("trainer_name",reviewData.trainer_name||"");
  //     formData.append("rating",reviewData.rating||"");
  //     formData.append("location",reviewData.location||"");

  //     formData.append("date", currentDate); // Ensure the date is added

  //     if (reviewData.image) {
  //         formData.append("image", reviewData.image); // Append the image
  //     }
  //     for (let pair of formData.entries()) {
  //       console.log(pair[0], pair[1]); // Check key-value pairs
  //   }
  //     try {
  //         const response = await axios.post(
  //             "http://localhost:8080/userreview/add",
  //             formData,
  //             {
  //                 headers: {
  //                     "Content-Type": "multipart/form-data",
  //                 },
  //             }
  //         );

  //         if (response.status === 200) {
  //             alert("Review added successfully!");
  //             setReviewData({ student_name: "", source: "", category_name: "", course_name: "", comment: "", image: null }); // Reset form state
  //         }
  //     } catch (error) {
  //         console.error("Error adding review:", error);
  //         alert("Error adding review.");
  //     }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString().split("T")[0];

    // Create an object to match the backend's expected structure
    const reviewObject = {
      name: reviewData.student_name,
      social_id: reviewData.source,
      display: reviewData.display,
      course_name: reviewData.course_name,
      review: reviewData.comment,
      email: reviewData.email || "",
      type: true,
      trainer_name: reviewData.trainer_name || "",
      rating: reviewData.rating || "",
      location: reviewData.location || "",
      date: currentDate,
    };

    const formData = new FormData();
    formData.append("review", JSON.stringify(reviewObject)); // Convert object to JSON string

    if (reviewData.image) {
      formData.append("user_image", reviewData.image); // Match the backend field name
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/userreview/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        // Use 201 since backend sends CREATED status
        alert("Review added successfully!");
        setReviewData({
          student_name: "",
          source: "",
          display: "",
          category_name: "",
          course_name: "",
          comment: "",
          image: null,
        });
      }
    } catch (error) {
      console.error("Error adding review:", error);
      alert("Error adding review.");
    }
  };

  const handleAddTrendingCourseClick = () => {
    setShowAddCourse(true);
  };
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/course-categories/all"
        );
        setCourse(response.data); // Assuming the data contains an array of trainer objects
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };
    fetchCategory();
  }, []);
  useEffect(() => {
    if (reviewData.category_name) {
      const filtered = courseCategory.filter(
        (course) => course.courseCategory === reviewData.category_name
      );
      setFilterCourse(filtered);
    } else {
      setFilterCourse([]); // Reset when no category is selected
    }
  }, [reviewData.category_name, courseCategory]);

  return (
    <>
      {showAddCourse ? (
        <div className="course-category">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#!" onClick={() => setShowAddCourse(false)}>
                  Review
                </a>{" "}
                <MdKeyboardArrowRight />
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Add Review
              </li>
            </ol>
          </nav>
          <div className="category">
            <div className="category-header">
              <p>Add Review</p>
            </div>
            <div className="course-details">
              <div className="course-row">
                <div class="mb-6">
                  <label for="exampleFormControlTextarea1" class="form-label">
                    Student Name
                  </label>
                  <input
                    type="text"
                    id="inputtext6"
                    class="form-control"
                    aria-describedby="passwordHelpInline"
                    name="student_name"
                    value={reviewData.student_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Image</label>
                  <input
                    type="file"
                    className="form-control"
                    name="image"
                    onChange={handleFileChange}
                    required
                  />
                </div>
                <div class="col-md-3">
                  <label for="inputState" class="form-label">
                    Source
                  </label>
                  <select
                    id="inputState"
                    class="form-select"
                    name="source"
                    value={reviewData.source}
                    onChange={handleChange}
                  >
                    <option selected>Select </option>
                    <option>Linkedin</option>
                    <option>Facebook</option>
                    <option>Twitter</option>
                    <option>Instagram</option>
                    <option>Google</option>
                  </select>
                </div>
              </div>
              <div className="course-row">
                <div class="col-md-3">
                  <label for="inputState" class="form-label">
                    Category Name
                  </label>
                  <select
                    id="inputState"
                    class="form-select"
                    name="category_name"
                    value={reviewData.category_name}
                    onChange={handleChange}
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

                <div className="col-md-3">
                  <label htmlFor="course" className="form-label">
                    Course Name
                  </label>
                  <select
                    id="course"
                    className="form-select"
                    name="course_name"
                    value={reviewData.course_name}
                    onChange={handleChange}
                    disabled={!reviewData.category_name}
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
              </div>

              <div class="mb-6">
                <label for="exampleFormControlTextarea1" class="form-label">
                  Comment
                </label>
                <textarea
                  class="form-control"
                  id="exampleFormControlTextarea1"
                  rows="6"
                  name="comment"
                  value={reviewData.comment}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div style={{ paddingTop: "10px" }}>
                <label htmlFor="display" className="form-label">
                  Display Reviews:
                </label>
              </div>
              <div className="course-row">
                {[
                  { id: "homePage", value: "home", label: "Home Page" },
                  { id: "aboutPage", value: "about", label: "About Us Page" },
                  { id: "coursePage", value: "course", label: "Course Page" },
                  {
                    id: "corporateTrainingPage",
                    value: "corporate",
                    label: "Corporate Training Page",
                  },
                ].map(({ id, value, label }) => (
                  <div className="checkbox-group" key={id}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={id}
                      name="displayPages"
                      value={value}
                      // checked={reviewData.displayPages.includes(value)}
                      onChange={handleCheckboxChange}
                    />
                    <label className="form-check-label" htmlFor={id}>
                      {label}
                    </label>
                  </div>
                ))}
              </div>
              <div>
                <strong>Selected Display:</strong>{" "}
                {reviewData.display || "None"}
              </div>

              <div className="course-row">
                <button
                  className="submit-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  onClick={handleSubmit}
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
      ) : (
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="course-category">
              <div className="category">
                <div className="category-header">
                  <p>Review</p>
                </div>
                <div className="date-schedule">
                  Start Date
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    isClearable
                    sx={{
                      "& .MuiIconButton-root": { color: "#00aeef" },
                    }}
                  />
                  End Date
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    isClearable
                    sx={{
                      "& .MuiIconButton-root": { color: "#00aeef" },
                    }}
                  />
                  <button className="filter">Filter</button>
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
                          >
                            10
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#!"
                            onClick={() => handleRowsPerPageChange(25)}
                          >
                            25
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#!"
                            onClick={() => handleRowsPerPageChange(50)}
                          >
                            50
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
                      <FiPlus /> Add Reviews
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
                  <StyledTableCell align="center" sx={{ width: "100px" }}>
                    <Checkbox />
                  </StyledTableCell>
                  <StyledTableCell align="center" sx={{ width: "100px" }}>
                    S.No.
                  </StyledTableCell>
                  <StyledTableCell align="center">Images</StyledTableCell>
                  <StyledTableCell align="center">Student Name</StyledTableCell>
                  <StyledTableCell align="center">Source</StyledTableCell>
                  <StyledTableCell align="center">Technology</StyledTableCell>
                  <StyledTableCell align="center">Comment </StyledTableCell>
                  <StyledTableCell align="center" sx={{ width: "150px" }}>
                    Action
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedCategories.length > 0 ? (
                  displayedCategories.map((curr, index) => (
                    <StyledTableRow key={curr.review_id}>
                      <StyledTableCell align="center">
                        <Checkbox />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {index + 1 + (currentPage - 1) * rowsPerPage}
                      </StyledTableCell>{" "}
                      {/* S.No. */}
                      <StyledTableCell align="center">
                        {curr.user_image ? (
                          <img
                            src={curr.user_image}
                            alt="User"
                            width="50"
                            height="50"
                          />
                        ) : (
                          "No Image"
                        )}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {curr.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {curr.social_id}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {curr.course_name}
                      </StyledTableCell>
                      <StyledTableCell
                        align="left"
                        style={{
                          maxWidth: "800px",
                          wordWrap: "break-word",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {curr.review}
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
                            onClick={() => handleClickOpen(curr)}
                          />
                          <RiDeleteBin6Line
                            className="delete"
                            onClick={() =>
                              handleDeleteConfirmation(curr.review_id)
                            }
                          />
                        </div>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <p>No Data available</p>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="pagination-container">
            <AdminPagination
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              totalRows={filteredReview.length} // Use the full list for pagination
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
          <DialogTitle id="edit-schedule-dialog">Edit Review</DialogTitle>
          <Button onClick={handleClose} className="close-btn">
            <IoMdCloseCircleOutline
              style={{ color: "white", fontSize: "2rem" }}
            />
          </Button>
        </div>
        <DialogContent>
          <div className="course-row">
            <div class="col">
              <label for="exampleFormControlTextarea1" class="form-label">
                Student Name
              </label>
              <input
                type="text"
                id="inputtext6"
                class="schedule-input"
                aria-describedby="passwordHelpInline"
                name="student_name"
                value={editedData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="col">
              <label className="form-label">Image</label>
              <input
                type="file"
                className="schedule-input"
                name="image"
                onChange={handleFileChange}
                required
              />
            </div>
            <div class="col">
              <label for="inputState" class="form-label">
                Source
              </label>
              <select
                id="inputState"
                class="form-select"
                name="source"
                value={editedData.social_id}
                onChange={handleInputChange}
              >
                <option selected>Select </option>
                <option>Linkedin</option>
                <option>Facebook</option>
                <option>Twitter</option>
                <option>Instagram</option>
                <option>Google</option>
              </select>
            </div>
          </div>

          <div className="course-row">
            <div className="col">
              <label htmlFor="categoryName" className="form-label">
                Category Name
              </label>
              <select
                id="categoryName"
                className="form-select"
                name="category_name"
                value={editedData.category_name || ""}
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
              <label htmlFor="courseName" className="form-label">
                Course Name
              </label>
              <select
                id="courseName"
                className="form-select"
                name="course_name"
                value={editedData.course_name || ""}
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
                {/* {courseCategory.map((curr) => (
                  <option key={curr.id} value={curr.courseName}>
                    {curr.courseName}
                  </option>
                ))} */}
              </select>
            </div>
          </div>
          <div class="mb-6">
            <label for="exampleFormControlTextarea1" class="form-label">
              Comment
            </label>
            <textarea
              class="form-control"
              id="exampleFormControlTextarea1"
              rows="6"
              name="comment"
              value={editedData.review}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div style={{ paddingTop: "10px" }}>
            <label htmlFor="display" className="form-label">
              Display Reviews:
            </label>
          </div>

          <input
            className="form-check-input"
            type="checkbox"
            id="homePage"
            name="displayPages"
            value="home"
            checked={editedData.display?.includes("home")}
            onChange={handleEditCheckboxChange}
          />
          <label className="form-check-label" htmlFor="homePage">
            Home Page
          </label>

          <input
            className="form-check-input"
            type="checkbox"
            id="aboutPage"
            name="displayPages"
            value="about"
            checked={editedData.display?.includes("about")}
            onChange={handleEditCheckboxChange}
          />
          <label className="form-check-label" htmlFor="aboutPage">
            About Us Page
          </label>

          <input
            className="form-check-input"
            type="checkbox"
            id="coursePage"
            name="displayPages"
            value="course"
            checked={editedData.display?.includes("course")}
            onChange={handleEditCheckboxChange}
          />
          <label className="form-check-label" htmlFor="homePage">
            Course Page
          </label>

          <input
            className="form-check-input"
            type="checkbox"
            id="corporatePage"
            name="displayPages"
            value="corporate"
            checked={editedData.display?.includes("corporate")}
            onChange={handleEditCheckboxChange}
          />
          <label className="form-check-label" htmlFor="aboutPage">
            Corporate Page
          </label>
        </DialogContent>
        <DialogActions
          className="update"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Button onClick={handleSave} className="update-btn">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* <div
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
                     Review Added Successfully
                        </p>
                      </div>
                    </div>
                    </div>
                    </div> */}
    </>
  );
}
