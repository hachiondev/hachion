import React, { useState, useEffect } from 'react';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from 'axios';
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
const Project = ({
  pageTitle = 'Project',
  headerTitle = 'View Projects List',
  buttonLabel = 'Add Projects',
}) => {
  const [formMode, setFormMode] = useState('Add');
  const [course, setCourse] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [error, setError] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState([])
  const [message, setMessage] = useState(false);
  const currentDate = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [characterCount, setCharacterCount] = useState(0);
  const [aboutCharacterCount, setAboutCharacterCount] = useState(0);
  const [aboutError, setAboutError] = useState("");
  const [formData, setFormData] = useState({
    course_id: "", title: '', courseName: '', shortCourse: '', courseImage: "", youtubeLink: '', numberOfClasses: '', dailySessions: '', courseCategory: "", starRating: '', level: '',
    ratingByNumberOfPeople: '', totalEnrollment: '', keyHighlights1: '', keyHighlights2: '', keyHighlights3: '',
    keyHighlights4: '', keyHighlights5: '', keyHighlights6: '', amount: '', discount: '', total: '', samount: '', sdiscount: '', stotal: '', sqamount: '', sqdiscount: '', sqtotal: '', camount: '', cdiscount: '', ctotal: '', mamount: '', mdiscount: '', mtotal: '', iamount: '', idiscount: '', itotal: '', isamount: '', isdiscount: '', istotal: '', isqamount: '', isqdiscount: '', isqtotal: '', icamount: '', icdiscount: '', ictotal: '', imamount: '', imdiscount: '', imtotal: '', mentoring1: '', mentoring2: '', self1: '',
    self2: '', headerTitle: '', courseKeyword: '', courseKeywordDescription: '', aboutCourse: '', courseHighlight: '', courseDescription: '', date: currentDate, whatYouWillLearn: '', numberOfProjects: '', whoIsThisCourseFor: '', careerOpportunities: '', avarageSalaryRange: '', prerequisities: ''
  });
  console.log(formData);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get("https://api.hachion.co/course-categories/all");
        setCourse(response.data);
      } catch (error) {
      }
    };
    fetchCategory();
  }, []);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('https://api.hachion.co/courses/all');
        setCategories(response.data);
        setFilteredCourses(response.data);
        setAllCourses(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCourses();
  }, []);
  useEffect(() => {
    if (!startDate && !endDate) {
      const filtered = allCourses.filter((item) =>
        item.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.courseCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.shortCourse?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.date?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  }, [searchTerm, allCourses, startDate, endDate]);

  const handleDateFilter = () => {
    const filtered = allCourses.filter((item) => {
      const courseDate = new Date(item.date);
      const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
      const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

      const matchSearch =
        item.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.courseCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.shortCourse.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.date.toLowerCase().includes(searchTerm.toLowerCase());

      const inRange =
        (!start || courseDate >= start) &&
        (!end || courseDate <= end);

      return matchSearch && inRange;
    });

    setFilteredCourses(filtered);
  };

  const handleDateReset = () => {
    setStartDate(null);
    setEndDate(null);
    setSearchTerm('');
    setFilteredCourses(allCourses);
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
  const handleCalculate = (e) => {
    e.preventDefault();
    setFormData((prevData) => {
      const updatedData = { ...prevData };
      const modes = ["", "m", "s", "sq", "c"];
      modes.forEach((mode) => {
        const amountKey = `${mode}amount`;
        const discountKey = `${mode}discount`;
        const totalKey = `${mode}total`;
        const amount = parseFloat(updatedData[amountKey]);
        const discount = parseFloat(updatedData[discountKey]);
        const total = parseFloat(updatedData[totalKey]);
        const hasAmount = !isNaN(amount);
        const hasDiscount = !isNaN(discount);
        const hasTotal = !isNaN(total);
        if (hasAmount && hasDiscount && !hasTotal) {
          updatedData[totalKey] = Math.round(amount - (amount * discount) / 100);
        } else if (hasAmount && hasTotal && !hasDiscount && amount !== 0) {
          updatedData[discountKey] = Math.round(((amount - total) / amount) * 100);
        } else if (hasDiscount && hasTotal && !hasAmount && discount !== 100) {
          updatedData[amountKey] = Math.round(total / (1 - discount / 100));
        }
      });
      return updatedData;
    });
  };
  const handleCalculateIndia = (e) => {
    e.preventDefault();
    setFormData((prevData) => {
      const updatedData = { ...prevData };
      const modes = ['i', 'im', 'is', 'isq', 'ic'];

      modes.forEach((mode) => {
        const amountKey = `${mode}amount`;
        const discountKey = `${mode}discount`;
        const totalKey = `${mode}total`;

        const amount = parseFloat(updatedData[amountKey]);
        const discount = parseFloat(updatedData[discountKey]);
        const total = parseFloat(updatedData[totalKey]);

        const hasAmount = !isNaN(amount);
        const hasDiscount = !isNaN(discount);
        const hasTotal = !isNaN(total);

        if (hasAmount && hasDiscount && !hasTotal) {
          updatedData[totalKey] = Math.round(amount - (amount * discount) / 100);
        } else if (hasAmount && hasTotal && !hasDiscount && amount !== 0) {
          updatedData[discountKey] = Math.round(((amount - total) / amount) * 100);
        } else if (hasDiscount && hasTotal && !hasAmount && discount !== 100) {
          updatedData[amountKey] = Math.round(total / (1 - discount / 100));
        }
      });

      return updatedData;
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFormData({ ...formData, courseImage: file });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString().split("T")[0];
    const courseData = {
      courseCategory: formData.courseCategory,
      courseName: formData.courseName,
      shortCourse: formData.shortCourse,
      date: currentDate,
      youtubeLink: formData.youtubeLink,
      numberOfClasses: formData.numberOfClasses,
      level: formData.level,
      starRating: formData.starRating,
      ratingByNumberOfPeople: formData.ratingByNumberOfPeople,
      totalEnrollment: formData.totalEnrollment,
      keyHighlights1: formData.keyHighlights1,
      keyHighlights2: formData.keyHighlights2,
      keyHighlights3: formData.keyHighlights3,
      keyHighlights4: formData.keyHighlights4,
      keyHighlights5: formData.keyHighlights5,
      keyHighlights6: formData.keyHighlights6,
      amount: formData.amount, discount: formData.discount, total: formData.total,
      mamount: formData.mamount, mdiscount: formData.mdiscount, mtotal: formData.mtotal,
      samount: formData.samount, sdiscount: formData.sdiscount, stotal: formData.stotal,
      sqamount: formData.sqamount, sqdiscount: formData.sqdiscount, sqtotal: formData.sqtotal,
      camount: formData.camount, cdiscount: formData.cdiscount, ctotal: formData.ctotal,
      iamount: formData.iamount, idiscount: formData.idiscount, itotal: formData.itotal,
      imamount: formData.imamount, imdiscount: formData.imdiscount, imtotal: formData.imtotal,
      isamount: formData.isamount, isdiscount: formData.isdiscount, istotal: formData.istotal,
      isqamount: formData.isqamount, isqdiscount: formData.isqdiscount, isqtotal: formData.isqtotal,
      icamount: formData.icamount, icdiscount: formData.icdiscount, ictotal: formData.ictotal,
      mentoring1: formData.mentoring1,
      mentoring2: formData.mentoring2,
      self1: formData.self1,
      self2: formData.self2,
      dailySessions: formData.dailySessions,
      metaTitle: formData.headerTitle,
      metaKeyword: formData.courseKeyword,
      metaDescription: formData.courseKeywordDescription,
      aboutCourse: formData.aboutCourse,
      courseHighlight: formData.courseHighlight,
      courseDescription: formData.courseDescription,
      whatYouWillLearn: formData.whatYouWillLearn,
      numberOfProjects: formData.numberOfProjects,
      whoIsThisCourseFor: formData.whoIsThisCourseFor,
      careerOpportunities: formData.careerOpportunities,
      avarageSalaryRange: formData.avarageSalaryRange,
      prerequisities: formData.prerequisities,

    };
    const formNewData = new FormData();
    formNewData.append("course", JSON.stringify(courseData));
    if (formData.courseImage && typeof formData.courseImage !== "string") {
      formNewData.append("courseImage", formData.courseImage);
    }
    try {
      if (formMode === "Edit") {
        const response = await axios.put(
          `https://api.hachion.co/courses/update/${formData.id}`,
          formNewData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        if (response.status === 200) {

          setSuccessMessage("✅ Course updated successfully.");
          setErrorMessage("");
          setCourses((prevCourses) =>
            prevCourses.map((course) =>
              course.id === formData.id ? response.data : course
            )
          );
          setShowAddCourse(false);
        }
      } else {

        const response = await axios.post("https://api.hachion.co/courses/add", formNewData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.status === 201) {
          setSuccessMessage("✅ Course added successfully.");
          setErrorMessage("");
          setCourses((prevCourses) => [...prevCourses, response.data]);
          setShowAddCourse(false);
        }
      }
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage("❌ Error submitting course.");
    }
  };

  const handleEditClick = async (courseId) => {
    setShowAddCourse(true);
    try {
      const response = await fetch(`https://api.hachion.co/courses/${courseId}`);
      if (response.ok) {
        const course = await response.json();

        setFormData({
          id: course.id,
          courseCategory: course.courseCategory,
          courseName: course.courseName,
          courseImage: course.courseImage,
          shortCourse: course.shortCourse,
          youtubeLink: course.youtubeLink,
          numberOfClasses: course.numberOfClasses,
          level: course.level,
          dailySessions: course.dailySessions,
          starRating: course.starRating,
          ratingByNumberOfPeople: course.ratingByNumberOfPeople,
          totalEnrollment: course.totalEnrollment,
          keyHighlights1: course.keyHighlights1,
          keyHighlights2: course.keyHighlights2,
          keyHighlights3: course.keyHighlights3,
          keyHighlights4: course.keyHighlights4,
          keyHighlights5: course.keyHighlights5,
          keyHighlights6: course.keyHighlights6,
          amount: course.amount, discount: course.discount, total: course.total,
          mamount: course.mamount, mdiscount: course.mdiscount, mtotal: course.mtotal,
          samount: course.samount, sdiscount: course.sdiscount, stotal: course.stotal,
          sqamount: course.sqamount, sqdiscount: course.sqdiscount, sqtotal: course.sqtotal,
          camount: course.camount, cdiscount: course.cdiscount, ctotal: course.ctotal,
          iamount: course.iamount, idiscount: course.idiscount, itotal: course.itotal,
          imamount: course.imamount, imdiscount: course.imdiscount, imtotal: course.imtotal,
          isamount: course.isamount, isdiscount: course.isdiscount, istotal: course.istotal,
          isqamount: course.isqamount, isqdiscount: course.isqdiscount, isqtotal: course.isqtotal,
          icamount: course.icamount, icdiscount: course.icdiscount, ictotal: course.ictotal,
          mentoring1: course.mentoring1,
          mentoring2: course.mentoring2,
          self1: course.self1,
          self2: course.self2,

          headerTitle: course.metaTitle,

          courseKeyword: course.metaKeyword,

          courseKeywordDescription: course.metaDescription,
          aboutCourse: course.aboutCourse,
          courseHighlight: course.courseHighlight,
          courseDescription: course.courseDescription,
          whatYouWillLearn: course.whatYouWillLearn,
          numberOfProjects: course.numberOfProjects,
          whoIsThisCourseFor: course.whoIsThisCourseFor,
          careerOpportunities: course.careerOpportunities,
          avarageSalaryRange: course.avarageSalaryRange,
          prerequisities: course.prerequisities,
        });
        setFormMode('Edit');
      } else {
      }
    } catch (error) {
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
  const displayedCategories = filteredCourses.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const handleReset = () => {
    setFormData({
      course_id: "",
      title: '',
      courseName: '',
      shortCourse: '',
      courseImage: null,
      youtubeLink: '',
      numberOfClasses: '',
      level: '',
      dailySessions: '',
      starRating: '',
      ratingByNumberOfPeople: '',
      totalEnrollment: '',
      courseCategory: '',
      date: "",
      whatYouWillLearn: '',
      numberOfProjects: '',
      whoIsThisCourseFor: '',
      careerOpportunities: '',
      avarageSalaryRange: '',
      prerequisities: '',

    });
  }
  const handleDeleteConfirmation = (id) => {
    if (window.confirm("Are you sure you want to delete this Courses?")) {
      handleDelete(id);
    }
  };
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`https://api.hachion.co/courses/delete/${id}`);

      if (response.status === 200) {
        setSuccessMessage("✅ Course deleted successfully.");
        setErrorMessage("");

        setCourses((prevCourses) => prevCourses.filter((course) => course.id !== id));
        setCategories((prev) => prev.filter((course) => course.id !== id));
        setFilteredCourses((prev) => prev.filter((course) => course.id !== id));
        setAllCourses((prev) => prev.filter((course) => course.id !== id));
      } else {
        setSuccessMessage("");
        setErrorMessage("❌ Failed to delete the course.");
      }
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage("❌ Something went wrong while deleting the course.");
    }
  };

  const handleAddTrendingCourseClick = () => {
    setFormMode('Add');
    setShowAddCourse(true);
    handleReset();
  };
  const [shortCourseError, setShortCourseError] = useState("");

  const handleShortCourseBlur = async () => {
    const shortCourseValue = formData.shortCourse;

    if (!shortCourseValue) return;

    try {
      await axios.get(`https://api.hachion.co/courses/shortCourse`, {
        params: { shortCourse: shortCourseValue },
      });

      setShortCourseError("");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === "ShortCourse already exists in the system"
      ) {
        setShortCourseError("❌ ShortCourse already exists");
      } else {
        setShortCourseError("❌ Unable to verify ShortCourse");
      }
    }
  };
  const areMandatoryFieldsFilled = () => {
    const hasCategory = formData.courseCategory?.trim() !== "";
    const hasCourseName = formData.courseName?.trim() !== "";
    const hasShortCourse = formData.shortCourse?.trim() !== "";
    const hasClasses = formData.numberOfClasses?.toString().trim() !== "";
    const hasImage = !!formData.courseImage;

    return (
      hasCategory &&
      hasCourseName &&
      hasShortCourse &&
      hasClasses &&
      hasImage &&
      !shortCourseError
    );
  };

  const isSubmitDisabled = !areMandatoryFieldsFilled();


  return (
    <>
      {showAddCourse ? (
        <div className="course-category">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#!" onClick={() => { setShowAddCourse(false); setFormMode('Add'); handleReset(); }}>
                  Project
                </a>
                <MdKeyboardArrowRight />
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {formMode === 'Add' ? 'Add Project Details' : 'Edit Project Details'}
              </li>
            </ol>
          </nav>
          <div className="category">
            <div className="category-header">
              <p style={{ marginBottom: 0 }}>{formMode === 'Add' ? 'Add Project Details' : 'Edit Project Details'}</p>
            </div>
            {message.text && (
              <div className={`alert alert-${message.type}`}>
                {message.text}
              </div>
            )}

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
                    >
                      <option value="" disabled>
                        Select Category
                      </option>
                      {course.map((cat) => (
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
                      name="courseCategory"
                      value={formData.courseCategory}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>
                        Select Category
                      </option>
                      {course.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>

                  </div>
                </div>

              </div>
              

            </form>
                        <TableContainer component={Paper}>
                          <Table sx={{ minWidth: 650, marginTop: 5 }} aria-label="customized table">
                            <TableHead>
                              <TableRow>
                                <StyledTableCell align='center' sx={{ fontSize: '16px', width: '25%' }}> Project</StyledTableCell>
                                <StyledTableCell align="center" sx={{ fontSize: '16px', width: '30%' }}>Description</StyledTableCell>
                                <StyledTableCell align="center" sx={{ fontSize: '16px', width: '120px' }}>Add/Delete Row</StyledTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {/* {rows.map((row, index) => ( */}
                                <StyledTableRow 
                                // key={row.id}
                                >
                                  <StyledTableCell align='center'>
                                    <input
                                      className='table-curriculum'
                                      name='title'
                                    //   value={row.title}
                                    //   onChange={(e) => handleRowChange(index, 'title', e.target.value)}
                                    />
                                  </StyledTableCell>
                                  <StyledTableCell align='center' style={{ maxWidth: 500, overflow: 'hidden' }}>
                                    <div style={{ maxWidth: '100%' }}>
                                      <ReactQuill
                                        theme="snow"
                                        // modules={quillModules}
                                        // value={row.topic}
                                        // onChange={(value) =>
                                        //   setRows((prevRows) =>
                                        //     prevRows.map((r) =>
                                        //       r.id === row.id ? { ...r, topic: value } : r
                                        //     )
                                        //   )
                                        // }
                                        style={{
                                          width: '100%',
                                          wordWrap: 'break-word',
                                          overflowWrap: 'break-word',
                                        }}
                                      />
                                    </div>
                                  </StyledTableCell>          
                                  <StyledTableCell align='center'>
                                    <GoPlus 
                                    // onClick={addRow} 
                                    style={{ fontSize: '2rem', color: '#00AEEF', marginRight: '10px' }} /> 
                                    <IoClose 
                                    // onClick={() => deleteRow(row.id)} 
                                    style={{ fontSize: '2rem', color: 'red' }} />
                                  </StyledTableCell>
                                </StyledTableRow>
                              {/* ))} */}
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
                <DatePicker value={startDate} onChange={setStartDate}
                  sx={{ '& .MuiIconButton-root': { color: '#00aeef' } }} />
                End Date
                <DatePicker value={endDate} onChange={setEndDate}
                  sx={{ '& .MuiIconButton-root': { color: '#00aeef' } }} />
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
                      <input type="search" className="search-input" placeholder="Search..." value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} />
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
                      <StyledTableCell align="center">Image</StyledTableCell>
                      <StyledTableCell align="center">Category Name</StyledTableCell>
                      <StyledTableCell align="center">Short Course</StyledTableCell>
                      <StyledTableCell align="center">Course Name</StyledTableCell>
                      <StyledTableCell align="center">Date</StyledTableCell>
                      <StyledTableCell align="center">Action</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayedCategories.length > 0 ? displayedCategories.map((course, idx) => (
                      <StyledTableRow key={course.id}>
                        <StyledTableCell align="center"><Checkbox /></StyledTableCell>
                        <StyledTableCell align="center">{idx + 1 + (currentPage - 1) * rowsPerPage}</StyledTableCell>
                        <StyledTableCell align="center">
                          {course.courseImage
                            ? <img src={`https://api.hachion.co/${course.courseImage}`} alt="Course" width="50" />
                            : 'No Image'}
                        </StyledTableCell>
                        <StyledTableCell align="left">{course.courseCategory}</StyledTableCell>
                        <StyledTableCell align="left">{course.shortCourse}</StyledTableCell>
                        <StyledTableCell align="left">{course.courseName}</StyledTableCell>
                        <StyledTableCell align="center">{course.date}</StyledTableCell>
                        <StyledTableCell align="center">
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                            <FaEdit className="edit" onClick={() => handleEditClick(course.id)} style={{ cursor: "pointer" }} />
                            <RiDeleteBin6Line className="delete" onClick={() => handleDeleteConfirmation(course.id)} style={{ cursor: "pointer" }} />
                          </div>
                        </StyledTableCell>
                      </StyledTableRow>
                    )) : (
                      <StyledTableRow>
                        <StyledTableCell colSpan={6} align="center">No courses available.</StyledTableCell>
                      </StyledTableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
              {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}
              <div className="pagination-container">
                <AdminPagination
                  currentPage={currentPage}
                  rowsPerPage={rowsPerPage}
                  totalRows={filteredCourses.length}
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
export default Project;
