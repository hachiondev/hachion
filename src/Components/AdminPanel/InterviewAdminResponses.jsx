import React, { useState, useEffect} from 'react';
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
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import './Admin.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { IoSearch } from 'react-icons/io5';
import { FiPlus } from 'react-icons/fi';
import { MdKeyboardArrowRight } from 'react-icons/md';
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
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
const InterviewTemplate = ({
  pageTitle = 'Course',
  headerTitle = 'View Courses List',
  buttonLabel = 'Add Courses',
}) => {
  const [formMode, setFormMode] = useState('Add'); 
  const [course,setCourse]=useState([]);
  const [allCourses,setAllCourses]=useState([]);
  const [error,setError]=useState([]);
  const [searchTerm,setSearchTerm]=useState("");
  const[courses,setCourses]=useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddCourse,setShowAddCourse]=useState(false);
  const [filteredCourses,setFilteredCourses]=useState([])
  const[message,setMessage]=useState(false);
  const currentDate = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
  const [characterCount, setCharacterCount] = useState(0);
  const [aboutCharacterCount, setAboutCharacterCount] = useState(0);
const [aboutError, setAboutError] = useState("");
  const [formData, setFormData] = useState({course_id:"",title: '',courseName: '',shortCourse: '',courseImage: "",youtubeLink: '',numberOfClasses: '',dailySessions: '',courseCategory:"",starRating: '',level: '',
    ratingByNumberOfPeople: '',totalEnrollment: '',keyHighlights1:'',keyHighlights2:'',keyHighlights3:'',
    keyHighlights4:'',keyHighlights5:'',keyHighlights6:'',amount:'',discount:'',total:'',samount:'',sdiscount:'',stotal:'',sqamount:'',sqdiscount:'',sqtotal:'',camount:'',cdiscount:'',ctotal:'',mamount:'',mdiscount:'',mtotal:'',iamount:'',idiscount:'',itotal:'',isamount:'',isdiscount:'',istotal:'',isqamount:'',isqdiscount:'',isqtotal:'',icamount:'',icdiscount:'',ictotal:'',imamount:'',imdiscount:'',imtotal:'',mentoring1:'',mentoring2:'',self1:'',
    self2:'',headerTitle:'',courseKeyword:'',courseKeywordDescription:'',aboutCourse:'',courseHighlight:'',courseDescription:'',date:currentDate,
  });
  console.log(formData);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get("https://api.test.hachion.co/course-categories/all");
        setCourse(response.data); 
      } catch (error) {
      }
    };
    fetchCategory();
  }, []);
useEffect(() => {
    const fetchCourses = async () => {
        try {
            const response = await axios.get('https://api.test.hachion.co/courses/all');
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
  const currentDate = new Date().toISOString().split("T")[0]; // Today's date
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
    amount: formData.amount,discount: formData.discount,total: formData.total,
    mamount: formData.mamount,mdiscount: formData.mdiscount,mtotal: formData.mtotal,
    samount: formData.samount,sdiscount: formData.sdiscount,stotal: formData.stotal,
    sqamount: formData.sqamount,sqdiscount: formData.sqdiscount,sqtotal: formData.sqtotal,
    camount: formData.camount,cdiscount: formData.cdiscount,ctotal: formData.ctotal,
    iamount: formData.iamount,idiscount: formData.idiscount,itotal: formData.itotal,
    imamount: formData.imamount,imdiscount: formData.imdiscount,imtotal: formData.imtotal,
    isamount: formData.isamount,isdiscount: formData.isdiscount,istotal: formData.istotal,
    isqamount: formData.isqamount,isqdiscount: formData.isqdiscount,isqtotal: formData.isqtotal,
    icamount: formData.icamount,icdiscount: formData.icdiscount,ictotal: formData.ictotal,
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
  };
  const formNewData = new FormData();
  formNewData.append("course", JSON.stringify(courseData));
  if (formData.courseImage && typeof formData.courseImage !== "string") {
    formNewData.append("courseImage", formData.courseImage);
  }
  try {
    if (formMode === "Edit") {
      const response = await axios.put(
        `https://api.test.hachion.co/courses/update/${formData.id}`,
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
      
      const response = await axios.post("https://api.test.hachion.co/courses/add", formNewData, {
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
    const response = await fetch(`https://api.test.hachion.co/courses/${courseId}`);
    if (response.ok) {
      const course = await response.json();
      
      setFormData({
        id: course.id, 
       courseCategory: course.courseCategory ,
        courseName: course.courseName ,
        courseImage: course.courseImage, 
        shortCourse: course.shortCourse,
        youtubeLink: course.youtubeLink ,
        numberOfClasses: course.numberOfClasses ,
        level: course.level,
        dailySessions: course.dailySessions ,
        starRating: course.starRating ,
        ratingByNumberOfPeople: course.ratingByNumberOfPeople,
        totalEnrollment: course.totalEnrollment,
        keyHighlights1:course.keyHighlights1,
        keyHighlights2:course.keyHighlights2,
        keyHighlights3:course.keyHighlights3,
        keyHighlights4:course.keyHighlights4,
        keyHighlights5:course.keyHighlights5,
        keyHighlights6:course.keyHighlights6,
        amount:course.amount,discount:course.discount,total:course.total,
        mamount:course.mamount,mdiscount:course.mdiscount,mtotal:course.mtotal,
        samount:course.samount,sdiscount:course.sdiscount,stotal:course.stotal,
        sqamount:course.sqamount,sqdiscount:course.sqdiscount,sqtotal:course.sqtotal,
        camount:course.camount,cdiscount:course.cdiscount,ctotal:course.ctotal,
        iamount:course.iamount,idiscount:course.idiscount,itotal:course.itotal,
        imamount:course.imamount,imdiscount:course.imdiscount,imtotal:course.imtotal,
        isamount:course.isamount,isdiscount:course.isdiscount,istotal:course.istotal,
        isqamount:course.isqamount,isqdiscount:course.isqdiscount,isqtotal:course.isqtotal,
        icamount:course.icamount,icdiscount:course.icdiscount,ictotal:course.ictotal,
        mentoring1:course.mentoring1,
        mentoring2:course.mentoring2,
        self1:course.self1,
    self2:course.self2,
    // metaTitle:course.headerTitle,
    headerTitle: course.metaTitle, 
    // metaKeyword:course.courseKeyword,
    courseKeyword: course.metaKeyword, 
    // metaDescription:course.courseDescription,
    courseKeywordDescription: course.metaDescription, 
    aboutCourse:course.aboutCourse,
    courseHighlight:course.courseHighlight,
    courseDescription:course.courseDescription
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
const handleReset=()=>{
  setFormData({
    course_id:"",
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
    date:""
       });
}
const handleDeleteConfirmation = (id) => {
  if (window.confirm("Are you sure you want to delete this Courses?")) {
    handleDelete(id);
  }
};
const handleDelete = async (id) => {
  try {
    const response = await axios.delete(`https://api.test.hachion.co/courses/delete/${id}`);
    
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
    await axios.get(`https://api.test.hachion.co/courses/shortCourse`, {
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

  return (
    <>
      {showAddCourse ? (
        <div className="course-category">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#!" onClick={() => { setShowAddCourse(false); setFormMode('Add'); handleReset(); }}>
                  Course Details
                </a>
                <MdKeyboardArrowRight />
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {formMode === 'Add' ? 'Add Course Details' : 'Edit Course Details'}
              </li>
            </ol>
          </nav>
          <div className="category">
            <div className="category-header">
              <p style={{ marginBottom: 0 }}>{formMode === 'Add' ? 'Add Course Details' : 'Edit Course Details'}</p>
            </div>
            {message.text && (
              <div className={`alert alert-${message.type}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="course-details">
                <div className="course-row">
                  <div className="col-md-4">
                    <label className="form-label">Category Name</label>
                    <select className="form-select" name='courseCategory' value={formData.courseCategory} onChange={handleInputChange}>
                      <option value="" disabled>Select Category</option>
                      {course.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Course Name</label>
                    <input type="text" name="courseName" className="form-control" placeholder="Enter Course Name"
                      value={formData.courseName} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-4">
  <label className="form-label">Short Course Name</label>
  <input
    type="text"
    name="shortCourse"
    className="form-control"
    placeholder="Enter Short Course Name"
    value={formData.shortCourse}
    onChange={handleInputChange}
    onBlur={handleShortCourseBlur} 
    required
  />
  {shortCourseError && <div style={{ color: "red" }}>{shortCourseError}</div>}  {/* ✅ Optional error display */}
</div>
                  </div>
                  <div className="course-row">
                  <div className="col-md-4">
                    <label className="form-label">Course Image</label>
                    <input type="file" className="form-control" name="courseImage" accept="image/*" onChange={handleFileChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Youtube Link</label>
                    <input type="text" name="youtubeLink" className="form-control" value={formData.youtubeLink}
                      onChange={handleInputChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">No. of Classes</label>
                    <input type="number" name="numberOfClasses" className="form-control" value={formData.numberOfClasses}
                      onChange={handleInputChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Daily Sessions</label>
                    <input type="text" name="dailySessions" className="form-control" value={formData.dailySessions}
                      onChange={handleInputChange} />
                  </div>
                </div>
                <div className="course-row">
                <div class="col-md-4">
                  <label for="inputState" class="form-label">Level</label>
                  <select id="inputState" class="form-select" name='level' value={formData.level} onChange={handleInputChange}>
                    <option selected>Select </option>
                    <option>All Levels</option>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Expert</option>
                  </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Star Rating</label>
                <input
                  type="text"
                  name="starRating"
                  className="form-control"
                  placeholder="Enter rating"
                  value={formData.starRating}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Rating by No. of People</label>
                <input
                  type="text"
                  name="ratingByNumberOfPeople"
                  className="form-control"
                  placeholder="Enter rating count"
                  value={formData.ratingByNumberOfPeople}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Certified Students</label>
                <input
                  type="text"
                  name="totalEnrollment"
                  className="form-control"
                  placeholder="Enter Certified Students"
                  value={formData.totalEnrollment}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            </div>
            <div className='course-details'>
            <h3>Key Highlights</h3>
              <div className='course-row'>
                <div class="col-md-4">
                  <label for="inputEmail4" class="form-label">Key Highlights 1</label>
                  <input type="text" class="form-control" id="inputEmail4" name='keyHighlights1' value={formData.keyHighlights1} onChange={handleInputChange} />
                </div>
                <div class="col-md-4">
                  <label for="inputEmail4" class="form-label">Key Highlights 2</label>
                  <input type="text" class="form-control" id="inputEmail4" name='keyHighlights2' value={formData.keyHighlights2} onChange={handleInputChange}  />
                </div>
                <div class="col-md-4">
                  <label for="inputEmail4" class="form-label">Key Highlights 3</label>
                  <input type="text" class="form-control" id="inputEmail4" name='keyHighlights3' value={formData.keyHighlights3} onChange={handleInputChange}  />
                </div>
              </div>
              <div className='course-row'>
                <div class="col-md-4">
                <label for="inputEmail4" class="form-label">Key Highlights 4</label>
                <input type="text" class="form-control" id="inputEmail4" name='keyHighlights4' value={formData.keyHighlights4} onChange={handleInputChange}  />
                </div>
                <div class="col-md-4">
                <label for="inputEmail4" class="form-label">Key Highlights 5</label>
                <input type="text" class="form-control" id="inputEmail4" name='keyHighlights5' value={formData.keyHighlights5} onChange={handleInputChange}  />
                </div>
                <div class="col-md-4">
                <label for="inputEmail4" class="form-label">Key Highlights 6</label>
                <input type="text" class="form-control" id="inputEmail4" name='keyHighlights6' value={formData.keyHighlights6} onChange={handleInputChange}  />
                </div>
                </div>
                </div> 
                <h3 style={{marginTop: 20}}>Mode Of Training Fee(USD)</h3>
                <div className="course-row">
                  {[
                    { label: "Live Training", amount: "amount", discount: "discount", total: "total" },
                    { label: "Crash Course Training", amount: "camount", discount: "cdiscount", total: "ctotal" },
                    // { label: "Mentoring Mode", amount: "mamount", discount: "mdiscount", total: "mtotal" },
                    { label: "Self Paced with Q&A", amount: "sqamount", discount: "sqdiscount", total: "sqtotal" },
                    { label: "Self Paced Training", amount: "samount", discount: "sdiscount", total: "stotal" },
                  ].map((mode, index) => (
                    <div className="course-mode" key={index}>
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id={`flexCheck${index}`} />
                        <label className="form-check-label" htmlFor={`flexCheck${index}`}>
                          {mode.label}
                        </label>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Amount</label>
                        <input
                          type="number"
                          className="form-control-mode"
                          name={mode.amount}
                          value={formData[mode.amount] || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Discount %</label>
                        <input
                          type="number"
                          className="form-control-mode"
                          name={mode.discount}
                          value={formData[mode.discount] || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Total</label>
                        <input
                          type="number"
                          className="form-control-mode"
                          name={mode.total}
                          value={formData[mode.total] || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <button className='filter' onClick={handleCalculate}>
                        Calculate
                      </button>
                    </div>
                  ))}
                </div>

                <h3 style={{marginTop: 20}}>Mode Of Training Fee(INR)</h3>
                <div className="course-row">
                  {[
                    { label: "Live Training", prefix: "i" },
                    { label: "Crash Course Training", prefix: "ic" },
                    // { label: "Mentoring Mode", prefix: "im" },
                    { label: "Self Paced with Q&A", prefix: "isq" },
                    { label: "Self Paced Training", prefix: "is" },
                  ].map((mode, index) => (
                    <div className="course-mode" key={index}>
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id={`inrCheck${index}`} />
                        <label className="form-check-label" htmlFor={`inrCheck${index}`}>
                          {mode.label}
                        </label>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Amount</label>
                        <input
                          type="number"
                          className="form-control-mode"
                          name={`${mode.prefix}amount`}
                          value={formData[`${mode.prefix}amount`] || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Discount %</label>
                        <input
                          type="number"
                          className="form-control-mode"
                          name={`${mode.prefix}discount`}
                          value={formData[`${mode.prefix}discount`] || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Total</label>
                        <input
                          type="number"
                          className="form-control-mode"
                          name={`${mode.prefix}total`}
                          value={formData[`${mode.prefix}total`] || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <button className="filter" onClick={handleCalculateIndia}>
                        Calculate
                      </button>
                    </div>
                  ))}
                </div>
                    <h3>Sample session</h3>
                <div className='course-row'>
                <div className='course-details'>
                <h4>Mentoring Training</h4>
                <div className='course-col'>
                <div class="col-md-4">
                <label for="inputEmail4" class="form-label">Day 1</label>
                <input type="number" class="form-control-sample" id="inputEmail4" name='mentoring1' value={formData.mentoring1} onChange={handleInputChange} />
                </div>
                <div class="col-md-4">
                <label for="inputEmail4" class="form-label">Day 2</label>
                <input type="number" class="form-control-sample" id="inputEmail4" name='mentoring2' value={formData.mentoring2} onChange={handleInputChange}/>
                </div>
                </div>
                </div>
                <div className='course-details'>
                <h4>Self Paced Training</h4>
                <div className='course-col'>
                <div class="col-md-4">
                <label for="inputEmail4" class="form-label">Day 1</label>
                <input type="text" class="form-control-sample" id="inputEmail4" name='self1' value={formData.self1} onChange={handleInputChange}/>
                </div>
                <div class="col-md-4">
                <label for="inputEmail4" class="form-label">Day 2</label>
                <input type="text" class="form-control-sample" id="inputEmail4" name='self2' value={formData.self2} onChange={handleInputChange}/>
                </div>
                </div>
                </div>
                </div>
                <div className='course-row'>
                <div class="col-md-4">
                <label for="inputEmail4" class="form-label">Header Title</label>
                <input type="text" class="form-control" id="inputEmail4" name='headerTitle' value={formData.headerTitle} onChange={handleInputChange}/>
                </div>
                <div class="col-md-4">
                <label for="inputEmail4" class="form-label">Course keyword with comma</label>
                <input type="text" class="form-control" id="inputEmail4" name='courseKeyword' value={formData.courseKeyword} onChange={handleInputChange} />
                </div>
                <div class="col-md-4">
                <label for="inputEmail4" class="form-label">Course keyword description</label>
                <input type="text" class="form-control" id="inputEmail4" name='courseKeywordDescription' value={formData.courseKeywordDescription} onChange={handleInputChange} />
                </div>
                </div>
                <div class="mb-3" style={{ paddingBottom: "20px" }}>
                <label for="exampleFormControlTextarea1" class="form-label">About Course(Add only 160 Characters)</label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputEmail4"
                    name="aboutCourse"
                    value={formData.aboutCourse}
                    onChange={(e) => {
                      const text = e.target.value;
                      const count = text.length;
                      if (count > 160) {
                        setAboutError("Character limit exceeded. Please keep it within 160 characters.");
                      } else {
                        setAboutError("");
                      }
                      handleInputChange(null, "aboutCourse", text);
                      setAboutCharacterCount(count);
                    }}
                  />

                  <div style={{ marginLeft: '10px', marginTop: '8px', fontSize: '14px', color: aboutCharacterCount > 160 ? 'red' : 'black' }}>
                    Character Count: {aboutCharacterCount}/160
                  </div>
                  {aboutError && <p className="error-message" style={{ color: "red" }}>{aboutError}</p>}
                </div>
                <div class="mb-3" style={{ paddingBottom: "20px" }}>
                <label for="exampleFormControlTextarea1" class="form-label">Course Highlight(Add only 4 Lines)</label>
                  <ReactQuill
                    theme="snow"
                    id="courseHighlight"
                    name="courseHighlight"
                    value={formData.courseHighlight}
                    onChange={(content) => {
                      const plainText = content.replace(/<[^>]*>/g, ""); 
                      const count = plainText.length;
                      if (count > 360) {
                        setError("Character limit exceeded. Please keep it within 360 characters.");
                      } else {
                        setError("");
                      }
                      handleInputChange(null, "courseHighlight", content);
                      setCharacterCount(count);
                    }}
                  style={{ height: "200px" }}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, 4, 5, 6, false] }],
                      ["bold", "italic", "underline"],
                      [{ list: "ordered" }, { list: "bullet" }], 
                      [{ align: [] }],
                      [{ indent: "-1" }, { indent: "+1" }], 
                      ["blockquote"],
                      ["link"], 
                      [{ color: [] }],
                      ["clean"], 
                    ],
                  }}
                  formats={[
                    "header",
                    "bold",
                    "italic",
                    "underline",
                    "list",
                    "bullet",
                    "align",
                    "indent",
                    "blockquote",
                    "link",
                    "color",
                  ]}
                />
                <div style={{marginLeft: '10px',marginTop: '8px', fontSize: '14px', color: characterCount > 360 ? 'red' : 'black' }}>
                    Character Count: {characterCount}/360
                  </div>
                  {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}
                </div>
                <div class="mb-3" style={{ paddingBottom: "20px" }}>
                <label for="exampleFormControlTextarea1" class="form-label">Course Description</label>
                  <ReactQuill
                    theme="snow"
                    id="courseDescription"
                    name="courseDescription"
                    value={formData.courseDescription}
                    onChange={(content) => handleInputChange(null, "courseDescription", content)}
                  style={{ height: "500px" }} 
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, 4, 5, 6, false] }], 
                      ["bold", "italic", "underline"], 
                      [{ list: "ordered" }, { list: "bullet" }],
                      [{ align: [] }], 
                      [{ indent: "-1" }, { indent: "+1" }],
                      ["blockquote"],
                      ["image"],
                      ["link"], 
                      [{ color: [] }],
                      ["clean"],
                    ],
                  }}
                  formats={[
                    "header",
                    "bold",
                    "italic",
                    "underline",
                    "list",
                    "bullet",
                    "align",
                    "indent",
                    "blockquote",
                    "image",
                    "link",
                    "color",
                  ]}
                />
                {error && <p className="error-message">{error}</p>}
                </div> 
                <div className="course-row">
                <button className='submit-btn' type='submit'>
                  {formMode === 'Add' ? 'Submit' : 'Update'}
                </button>
                <button type="button" className="reset-btn" onClick={handleReset}>Reset</button>
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
                            ? <img src={`https://api.test.hachion.co/${course.courseImage}`} alt="Course" width="50" />
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
export default InterviewTemplate;
