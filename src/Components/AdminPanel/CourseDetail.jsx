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
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

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

const CourseDetail = ({
  pageTitle = 'Course',
  headerTitle = 'View Courses List',
  buttonLabel = 'Add Courses',
}) => {
  const [formMode, setFormMode] = useState('Add');
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedMode, setSelectedMode] = useState("");
  const [course, setCourse] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [error, setError] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [message, setMessage] = useState(false);
  const currentDate = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [duplicateError, setDuplicateError] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [aboutCharacterCount, setAboutCharacterCount] = useState(0);
  const [aboutError, setAboutError] = useState("");
  const [trainers, setTrainers] = useState([]);
  const [inrChecked, setInrChecked] = useState(false);
  const [formData, setFormData] = useState({
    course_id: "", title: '', courseName: '', seoH1Title: '',shortCourse: '', courseImage: "", youtubeLink: '', numberOfClasses: '', dailySessions: '', courseCategory: "", defaultTrainer: "",
    starRating: '', level: '', ratingByNumberOfPeople: '', totalEnrollment: '', keyHighlights1: '', keyHighlights2: '', keyHighlights3: '',
    keyHighlights4: '', keyHighlights5: '', keyHighlights6: '', amount: '', discount: '', total: '', samount: '', sdiscount: '', stotal: '', sqamount: '', sqdiscount: '', sqtotal: '', camount: '', cdiscount: '', ctotal: '', mamount: '', mdiscount: '', mtotal: '', iamount: '', idiscount: '', itotal: '', isamount: '', isdiscount: '', istotal: '', isqamount: '', isqdiscount: '', isqtotal: '', icamount: '', icdiscount: '', ictotal: '', imamount: '', imdiscount: '', imtotal: '', mentoring1: '', mentoring2: '', self1: '',
    self2: '', headerTitle: '', courseKeyword: '', courseKeywordDescription: '', aboutCourse: '', courseHighlight: '', courseDescription: '', date: currentDate, whatYouWillLearn: '', numberOfProjects: '', whoIsThisCourseFor: '', careerOpportunities: '', avarageSalaryRange: '', prerequisities: '', liveTraining: '', crashCourse: '', mentoringMode: '', selfPacedLearning: '',
    // Add status field
    status: 'active', // Default to active
  });

  // New state for checkbox selection
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const fetchTrainerNames = async () => {
      if (
        formMode === "Edit" &&
        formData.courseCategory &&
        formData.courseName
      ) {
        try {
          const response = await axios.get(
            "http://localhost:8081/trainernames",
            {
              params: {
                categoryName: formData.courseCategory,
                courseName: formData.courseName,
              },
            }
          );
          setTrainers(response.data);
        } catch (error) {
          console.error("Error fetching trainer names:", error);
          setTrainers([]);
        }
      }
    };

    fetchTrainerNames();
  }, [formMode, formData.courseCategory, formData.courseName]);


  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get("http://localhost:8081/course-categories/all");
        setCourse(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategory();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:8081/courses/allforadmin');
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
      item.seoH1Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.courseCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.shortCourse?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.date?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // Add status to search
        item.status?.toLowerCase().includes(searchTerm.toLowerCase())
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
        item.seoH1Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.courseCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.shortCourse.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // Add status to search
        item.status?.toLowerCase().includes(searchTerm.toLowerCase());

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
    setFormMode("");
    setSelectedPeriod("");
    setSelectedMode(""); // Add this line
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

  // Handle toggle switch change
  const handleStatusToggle = () => {
    setFormData((prevData) => ({
      ...prevData,
      status: prevData.status === 'active' ? 'inactive' : 'active'
    }));
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
      seoH1Title: formData.seoH1Title,
      shortCourse: formData.shortCourse,
      ...(formMode === 'Edit' && { defaultTrainer: formData.defaultTrainer }),
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
      liveTraining: formData.liveTraining,
      crashCourse: formData.crashCourse,
      mentoringMode: formData.mentoringMode,
      selfPacedLearning: formData.selfPacedLearning,
      // Add status to course data
      courseStatus: formData.status,
    };

    const formNewData = new FormData();
    formNewData.append("course", JSON.stringify(courseData));

    if (formData.courseImage && typeof formData.courseImage !== "string") {
      formNewData.append("courseImage", formData.courseImage);
    }

    try {
      if (formMode === "Edit") {
        const response = await axios.put(
          `http://localhost:8081/courses/update/${formData.id}`,
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
        const response = await axios.post("http://localhost:8081/courses/addCourseDetails", formNewData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.status === 201) {
          setSuccessMessage("✅ Course added successfully.");
          setErrorMessage("");
          setCourses((prevCourses) => [...prevCourses, response.data]);
          setShowAddCourse(false);
        }
      }
    }
    catch (error) {
  setSuccessMessage("");

  if (error.response) {
    const backendMessage =
      typeof error.response.data === "string"
        ? error.response.data
        : error.response.data?.message;

    setErrorMessage(`❌ ${backendMessage || "Something went wrong while updating the course."}`);

    if (error.response.status === 409) {
      setDuplicateError(true);
    }
  } else {
    setErrorMessage("❌ Network error. Please try again.");
  }
}

  };

  const handleEditClick = async (courseId) => {
    setShowAddCourse(true);
    try {
      const response = await fetch(`http://localhost:8081/courses/${courseId}`);
      if (response.ok) {
        const course = await response.json();

        setFormData({
          id: course.id,
          courseCategory: course.courseCategory,
          courseName: course.courseName,
          seoH1Title: course.seoH1Title,
          courseImage: course.courseImage,
          shortCourse: course.shortCourse,
          defaultTrainer: course.defaultTrainer || "",
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
          liveTraining: course.liveTraining,
          crashCourse: course.crashCourse,
          mentoringMode: course.mentoringMode,
          selfPacedLearning: course.selfPacedLearning,
          // Add status from course data
          // status: course.status || 'active',
          status: course.courseStatus || 'active',
        });
        setFormMode('Edit');
      } else {
        console.error("Failed to fetch course data");
      }
    } catch (error) {
      console.error("Error fetching course:", error);
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

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    // You'll need to implement mode filtering logic based on your data structure
    // This depends on whether your tools have a mode/type property
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  }

  const displayedCategories = filteredCourses.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleReset = () => {
    setFormData({
      course_id: "",
      title: '',
      courseName: '',
      seoH1Title: '',
      shortCourse: '',
      courseImage: null,
      youtubeLink: '',
      numberOfClasses: '',
      level: '',
      dailySessions: '',
      defaultTrainer: '',
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
      liveTraining: '',
      crashCourse: '',
      mentoringMode: '',
      selfPacedLearning: '',
      // Reset status to default
      status: 'active',
    });
  }

  const handleDeleteConfirmation = (id) => {
    if (window.confirm("Are you sure you want to delete this Courses?")) {
      handleDelete(id);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8081/courses/delete/${id}`);

      if (response.status === 200) {
        setSuccessMessage("✅ Course deleted successfully.");
        setErrorMessage("");

        setCourses((prevCourses) => prevCourses.filter((course) => course.id !== id));
        setCategories((prev) => prev.filter((course) => course.id !== id));
        setFilteredCourses((prev) => prev.filter((course) => course.id !== id));
        setAllCourses((prev) => prev.filter((course) => course.id !== id));
        // Also remove from selectedIds if present
        setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
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
      await axios.get(`http://localhost:8081/courses/shortCourse`, {
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

  //   const AutoHeightQuill = ({ value, onChange, minHeight = 200, maxHeight = 800, ...props }) => {
  //   const quillRef = useRef(null);
  //   const [height, setHeight] = useState(`${minHeight}px`);

  //   useEffect(() => {
  //     const updateHeight = () => {
  //       if (quillRef.current) {
  //         try {
  //           const editor = quillRef.current.getEditor();
  //           const editorElement = editor.root;

  //           // Get the actual content height
  //           const contentHeight = editorElement.scrollHeight;

  //           // Calculate new height with constraints
  //           let newHeight = Math.max(minHeight, contentHeight);
  //           newHeight = Math.min(maxHeight, newHeight);

  //           // Add some padding
  //           setHeight(`${newHeight + 30}px`);
  //         } catch (error) {
  //           console.error('Error updating Quill height:', error);
  //         }
  //       }
  //     };

  //     // Update height on content change
  //     updateHeight();

  //     // Update on window resize
  //     window.addEventListener('resize', updateHeight);

  //     // Update after a short delay to ensure rendering
  //     const timeoutId = setTimeout(updateHeight, 100);

  //     return () => {
  //       window.removeEventListener('resize', updateHeight);
  //       clearTimeout(timeoutId);
  //     };
  //   }, [value, minHeight, maxHeight]);

  //   return (
  //     <div className="auto-height-quill-container">
  //       <ReactQuill
  //         ref={quillRef}
  //         value={value}
  //         onChange={onChange}
  //         style={{ height }}
  //         {...props}
  //       />
  //     </div>
  //   );
  // };

  const areMandatoryFieldsFilled = () => {
    const hasCategory = formData.courseCategory?.trim() !== "";
    const hasCourseName = formData.courseName?.trim() !== "";
    const hasSeoH1Title = formData.seoH1Title?.trim() !== "";
    const hasShortCourse = formData.shortCourse?.trim() !== "";
    const hasDefaultTrainer = formMode === 'Edit'
      ? formData.defaultTrainer?.trim() !== ""
      : true;
    const hasClasses = formData.numberOfClasses?.toString().trim() !== "";
    const hasImage = formMode === 'Add' ? !!formData.courseImage : true;

    const hasProjects = formData.numberOfProjects?.toString().trim() !== "";
    const hasWhatYouWillLearn = formData.whatYouWillLearn?.trim() !== "";
    const hasWhoIsThisCourseFor = formData.whoIsThisCourseFor?.trim() !== "";
    const hasCareerOpportunities = formData.careerOpportunities?.trim() !== "";
    const hasAverageSalaryRange = formData.avarageSalaryRange?.trim() !== "";
    const hasPrerequisites = formData.prerequisities?.trim() !== "";
    // const hasYoutubeLink = formData.youtubeLink?.trim() !== "";
    const hasLevel = formData.level?.trim() !== "";
    const hasStarRating = formData.starRating?.toString().trim() !== "";
    const hasRatingByNumberOfPeople = formData.ratingByNumberOfPeople?.toString().trim() !== "";
    const hasCertifiedStudents = formData.totalEnrollment?.toString().trim() !== "";
    const hasLiveTraining = formData.liveTraining?.trim() !== "";
    const hasCrashCourse = formData.crashCourse?.trim() !== "";
    const hasMentoringMode = formData.mentoringMode?.trim() !== "";
    const hasSelfPacedLearning = formData.selfPacedLearning?.trim() !== "";
    const hasUsdLive =
      formData.amount?.toString().trim() !== "" &&
      formData.discount?.toString().trim() !== "" &&
      formData.total?.toString().trim() !== "";
    const hasAboutCourse = formData.aboutCourse?.trim() !== "";

    const hasUsdCrash =
      formData.camount?.toString().trim() !== "" &&
      formData.cdiscount?.toString().trim() !== "" &&
      formData.ctotal?.toString().trim() !== "";

    const hasUsdSelfQa =
      formData.sqamount?.toString().trim() !== "" &&
      formData.sqdiscount?.toString().trim() !== "" &&
      formData.sqtotal?.toString().trim() !== "";

    const hasUsdSelf =
      formData.samount?.toString().trim() !== "" &&
      formData.sdiscount?.toString().trim() !== "" &&
      formData.stotal?.toString().trim() !== "";
    const hasInrFields =
      formData.iamount?.toString().trim() !== "" &&
      formData.idiscount?.toString().trim() !== "" &&
      formData.itotal?.toString().trim() !== "" &&
      formData.icamount?.toString().trim() !== "" &&
      formData.icdiscount?.toString().trim() !== "" &&
      formData.ictotal?.toString().trim() !== "" &&
      formData.isqamount?.toString().trim() !== "" &&
      formData.isqdiscount?.toString().trim() !== "" &&
      formData.isqtotal?.toString().trim() !== "" &&
      formData.isamount?.toString().trim() !== "" &&
      formData.isdiscount?.toString().trim() !== "" &&
      formData.istotal?.toString().trim() !== "";

    return (
      hasCategory &&
      hasCourseName &&
      hasSeoH1Title &&
      hasShortCourse &&
      hasDefaultTrainer &&
      hasClasses &&
      hasImage &&
      hasProjects &&
      hasWhatYouWillLearn &&
      hasWhoIsThisCourseFor &&
      hasCareerOpportunities &&
      hasAverageSalaryRange &&
      hasPrerequisites &&
      // hasYoutubeLink &&
      hasLevel &&
      hasStarRating &&
      hasRatingByNumberOfPeople &&
      hasCertifiedStudents &&
      hasLiveTraining &&
      hasCrashCourse &&
      hasMentoringMode &&
      hasSelfPacedLearning &&
      hasAboutCourse &&
      hasUsdLive &&
      hasUsdCrash &&
      hasUsdSelfQa &&
      hasUsdSelf &&
      hasInrFields &&

      !shortCourseError
    );


  };
  const isSubmitDisabled = !areMandatoryFieldsFilled() || duplicateError;

  // Handle Select All checkbox
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = displayedCategories.map(course => course.id);
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
      if (newSelectedIds.length === displayedCategories.length) {
        setSelectAll(true);
      }
    }
  };

  // Update selectAll state when page changes
  useEffect(() => {
    const allCurrentPageIds = displayedCategories.map(course => course.id);
    const allSelected = allCurrentPageIds.length > 0 &&
      allCurrentPageIds.every(id => selectedIds.includes(id));
    setSelectAll(allSelected);
  }, [currentPage, displayedCategories, selectedIds]);

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      setErrorMessage("Please select at least one course to delete");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    const confirmMessage = `Are you sure you want to delete ${selectedIds.length} selected ${selectedIds.length === 1 ? 'course' : 'courses'}?`;

    if (window.confirm(confirmMessage)) {
      try {
        // Delete all selected courses
        await Promise.all(
          selectedIds.map(id =>
            axios.delete(`http://localhost:8081/courses/delete/${id}`)
          )
        );

        // Update state
        setCourses(prev => prev.filter(item => !selectedIds.includes(item.id)));
        setCategories(prev => prev.filter(item => !selectedIds.includes(item.id)));
        setFilteredCourses(prev => prev.filter(item => !selectedIds.includes(item.id)));
        setAllCourses(prev => prev.filter(item => !selectedIds.includes(item.id)));

        setSelectedIds([]);
        setSelectAll(false);

        setSuccessMessage(`${selectedIds.length} ${selectedIds.length === 1 ? 'course' : 'courses'} deleted successfully`);
        setErrorMessage("");

        setTimeout(() => {
          setSuccessMessage("");
        }, 6000);
      } catch (error) {
        console.error("Error deleting courses:", error);
        setSuccessMessage("");
        setErrorMessage("Error deleting some courses. Please try again.");
        setTimeout(() => {
          setErrorMessage("");
        }, 6000);
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
                    <label className="form-label">
                      Category Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <select

                      name="courseCategory"
                      value={formData.courseCategory}

                      onChange={(e) => {
                        handleInputChange(e);
                        setErrorMessage("");
                        setDuplicateError(false);
                      }}

                      required

                      disabled={formMode === "Edit"}
                      style={{
                        width: "100%",
                        padding: "0.375rem 0.75rem",
                        border: "1px solid #ced4da",
                        borderRadius: "0.375rem",
                        backgroundColor: formMode === "Edit" ? "#e9ecef" : "#ffffff",
                        color: "#000000",
                        cursor: formMode === "Edit" ? "not-allowed" : "text"
                      }}
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

                  <div className="col-md-4">
                    <label className="form-label">
                      Course Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="courseName"

                      placeholder="Enter Course Name"
                      value={formData.courseName}
                      onChange={(e) => {
                        handleInputChange(e);
                        setErrorMessage("");
                        setDuplicateError(false);
                      }}

                      required

                      disabled={formMode === "Edit"}
                      style={{
                        width: "100%",
                        padding: "0.375rem 0.75rem",
                        border: "1px solid #ced4da",
                        borderRadius: "0.375rem",
                        backgroundColor: formMode === "Edit" ? "#e9ecef" : "#ffffff",
                        color: "#000000",
                        cursor: formMode === "Edit" ? "not-allowed" : "text"
                      }}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">
                      Short Course Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="shortCourse"

                      placeholder="Enter Short Course Name"
                      value={formData.shortCourse}
                      onChange={handleInputChange}
                      onBlur={handleShortCourseBlur}
                      required
                      disabled={formMode === "Edit"}
                      style={{
                        width: "100%",
                        padding: "0.375rem 0.75rem",
                        border: "1px solid #ced4da",
                        borderRadius: "0.375rem",
                        backgroundColor: formMode === "Edit" ? "#e9ecef" : "#ffffff",
                        color: "#000000",
                        cursor: formMode === "Edit" ? "not-allowed" : "text"
                      }}
                    />
                    {shortCourseError && (
                      <div style={{ color: "red" }}>{shortCourseError}</div>
                    )}
                  </div>
                </div>

                <div className="course-row">
                   <div className="col-md-4">
                    <label className="form-label">
                      Seo H1 Title <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="seoH1Title"

                      placeholder="Enter Seo H1 Title"
                      value={formData.seoH1Title}
                      onChange={(e) => {
                        handleInputChange(e);
                        setErrorMessage("");
                        setDuplicateError(false);
                      }}

                      required

                      // disabled={formMode === "Edit"}
                      style={{
                        width: "100%",
                        padding: "0.375rem 0.75rem",
                        border: "1px solid #ced4da",
                        borderRadius: "0.375rem",
                        // backgroundColor: formMode === "Edit" ? "#e9ecef" : "#ffffff",
                       
                      }}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">
                      No. of Projects <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="number"
                      name="numberOfProjects"
                      className="form-control"
                      placeholder="Enter Projects"
                      value={formData.numberOfProjects}
                      onChange={handleInputChange}
                      required
                      min="0"
                    />
                  </div>
                  {/* <div className="col-md-4">
                    <label className="form-label">
                      Self-Paced Learning <span style={{ color: "red" }}>*</span>
                    </label>
                    <textarea
                      type="text"
                      name="selfPacedLearning"
                      className="form-control"
                      placeholder="Enter Self-Paced Learning details"
                      value={formData.selfPacedLearning}
                      onChange={handleInputChange}
                      required
                    />
                  </div> */}

                  <div className="col-md-4">
                    <label className="form-label">
                      What You Will Learn <span style={{ color: "red" }}>*</span>
                    </label>
                    <textarea
                      type="text"
                      name="whatYouWillLearn"
                      className="form-control"
                      placeholder="Enter What You Will Learn"
                      value={formData.whatYouWillLearn}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">
                      Who Is This Course For <span style={{ color: "red" }}>*</span>
                    </label>
                    <textarea
                      type="text"
                      name="whoIsThisCourseFor"
                      className="form-control"
                      placeholder="Enter Who Is This Course For"
                      value={formData.whoIsThisCourseFor}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="course-row">

                  <div className="col-md-4">
                    <label className="form-label">
                      Career Opportunities <span style={{ color: "red" }}>*</span>
                    </label>
                    <textarea
                      type="text"
                      name="careerOpportunities"
                      className="form-control"
                      placeholder="Enter Career Opportunities"
                      value={formData.careerOpportunities}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">
                      Average Salary Range <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="avarageSalaryRange"
                      className="form-control"
                      placeholder="Enter Average Salary Range"
                      value={formData.avarageSalaryRange}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">
                      Prerequisites <span style={{ color: "red" }}>*</span>
                    </label>
                    <textarea
                      type="text"
                      name="prerequisities"
                      className="form-control"
                      placeholder="Enter Prerequisites"
                      value={formData.prerequisities}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="course-row">


                  {/* <div className="col-md-4">
                    <label className="form-label">
                      Live Training <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="mb-3">
                      <ReactQuill
                        theme="snow"
                        id="liveTraining"
                        name="liveTraining"
                        value={formData.liveTraining}
                        onChange={(content) => handleInputChange(null, "liveTraining", content)}
                        style={{ width: "300px", height: "90px", marginBottom: "36%" }}
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
                        placeholder="Enter Live Training details"
                      />
                    </div>
                  </div> */}

                  {/* <div className="col-md-4">
                    <label className="form-label">
                      Crash Course <span style={{ color: "red" }}>*</span>
                    </label>
                    <textarea
                      type="text"
                      name="crashCourse"
                      className="form-control"
                      placeholder="Enter Crash Course details"
                      value={formData.crashCourse}
                      onChange={handleInputChange}
                      required
                    />
                  </div> */}
                </div>

                <div className="course-row">
                  {/* <div className="col-md-4">
                    <label className="form-label">
                      Mentoring Mode <span style={{ color: "red" }}>*</span>
                    </label>
                    <textarea
                      type="text"
                      name="mentoringMode"
                      className="form-control"
                      placeholder="Enter Mentoring Mode details"
                      value={formData.mentoringMode}
                      onChange={handleInputChange}
                      required
                    />
                  </div> */}
                  <div className="col-md-4">
                    <label className="form-label">
                      Course Image {formMode === 'Add' ? <span style={{ color: "red" }}>*</span> : ""}
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      name="courseImage"
                      accept="image/*"
                      onChange={handleFileChange}
                      required={formMode === 'Add'}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">
                      Youtube Link 
                    </label>
                    <input
                      type="text"
                      name="youtubeLink"
                      className="form-control"
                      value={formData.youtubeLink}
                      onChange={handleInputChange}
                      placeholder="Enter Youtube URL"
                      
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">
                      Level <span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      className="form-select"
                      name='level'
                      value={formData.level}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>Select Level</option>
                      <option value="All Levels">All Levels</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>

                </div>

                <div className="course-row">



                  <div className="col-md-4">
                    <label className="form-label">
                      No. of Classes <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="number"
                      name="numberOfClasses"
                      className="form-control"
                      value={formData.numberOfClasses}
                      onChange={handleInputChange}
                      required
                      min="1"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Daily Sessions</label>
                    <input
                      type="text"
                      name="dailySessions"
                      className="form-control"
                      value={formData.dailySessions}
                      onChange={handleInputChange}
                      placeholder="e.g., 2 hours daily"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">
                      Star Rating <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="number"
                      name="starRating"
                      className="form-control"
                      placeholder="Enter rating (1-5)"
                      value={formData.starRating}
                      onChange={handleInputChange}
                      required
                      min="1"
                      max="5"
                      step="0.1"
                    />
                  </div>
                </div>

                <div className="course-row">
                  <div className="col-md-4">
                    <label className="form-label">
                      Rating by No. of People <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="number"
                      name="ratingByNumberOfPeople"
                      className="form-control"
                      placeholder="Enter rating count"
                      value={formData.ratingByNumberOfPeople}
                      onChange={handleInputChange}
                      required
                      min="0"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">
                      Certified Students <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="number"
                      name="totalEnrollment"
                      className="form-control"
                      placeholder="Enter Certified Students"
                      value={formData.totalEnrollment}
                      onChange={handleInputChange}
                      required
                      min="0"
                    />
                  </div>
                  {/* {formMode === 'Edit' && (
  <div className="col-md-4">
    <label className="form-label">
      Default Trainer <span style={{ color: "red" }}>*</span>
    </label>
    <select
      className="form-select"
      name="defaultTrainer"
      value={formData.defaultTrainer}
      onChange={handleInputChange}
      required
    >
      <option value="" disabled>
        Select Trainer
      </option>

      {trainers.map((trainerName, index) => (
        <option key={index} value={trainerName}>
          {trainerName}
        </option>
      ))}
    </select>
  </div>
)} */}

                  {formMode === 'Edit' && (
                    <div className="col-md-4">
                      <label className="form-label">
                        Default Trainer <span style={{ color: "red" }}>*</span>
                      </label>

                      <select
                        className="form-select"
                        name="defaultTrainer"
                        value={formData.defaultTrainer}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="" disabled>
                          Select Trainer
                        </option>

                        {/* Static default option */}
                        {/* <option value="Hachion Certified Trainer">
                          Hachion Certified Trainer
                        </option> */}

                        {/* API trainers */}
                        {trainers.map((trainerName, index) => (
                          <option key={index} value={trainerName}>
                            {trainerName}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                </div>
                <div className="course-row">
                  {/* Live Training Field with ReactQuill */}
                  <div className="col-md-4">
                    <label className="form-label">
                      Live Training <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="mb-3">
                      <ReactQuill
                        theme="snow"
                        id="liveTraining"
                        name="liveTraining"
                        value={formData.liveTraining}
                        onChange={(content) => handleInputChange(null, "liveTraining", content)}
                        style={{ width: "300px", height: "auto", marginBottom: "36%" }}
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
                        placeholder="Enter Live Training details"
                      />
                    </div>
                  </div>

                  {/* Crash Course Field with ReactQuill */}
                  <div className="col-md-4">
                    <label className="form-label">
                      Crash Course <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="mb-3">
                      <ReactQuill
                        theme="snow"
                        id="crashCourse"
                        name="crashCourse"
                        value={formData.crashCourse}
                        onChange={(content) => handleInputChange(null, "crashCourse", content)}
                        style={{ width: "300px", height: "auto", marginBottom: "36%" }}
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
                        placeholder="Enter Crash Course details"
                      />
                    </div>
                  </div>

                  {/* Mentoring Mode Field with ReactQuill */}
                  <div className="col-md-4">
                    <label className="form-label">
                      Mentoring Mode <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="mb-3">
                      <ReactQuill
                        theme="snow"
                        id="mentoringMode"
                        name="mentoringMode"
                        value={formData.mentoringMode}
                        onChange={(content) => handleInputChange(null, "mentoringMode", content)}
                        style={{ width: "300px", height: "auto", marginBottom: "36%" }}
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
                        placeholder="Enter Mentoring Mode details"
                      />
                    </div>
                  </div>

                  {/* Self-Paced Learning Field with ReactQuill */}
                  <div className="col-md-4">
                    <label className="form-label">
                      Self-Paced Learning <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="mb-3">
                      <ReactQuill
                        theme="snow"
                        id="selfPacedLearning"
                        name="selfPacedLearning"
                        value={formData.selfPacedLearning}
                        onChange={(content) => handleInputChange(null, "selfPacedLearning", content)}
                        style={{ width: "300px", height: "auto", marginBottom: "36%" }}
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
                        placeholder="Enter Self-Paced Learning details"
                      />
                    </div>
                  </div>
                </div>
              </div>


              {/* Key Highlights Section */}
              <div className='course-details'>
                <h3>Key Highlights</h3>
                <div className='course-row'>
                  <div className="col-md-4">
                    <label className="form-label">Key Highlights 1 </label>
                    <input type="text" className="form-control" name='keyHighlights1' value={formData.keyHighlights1} onChange={handleInputChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Key Highlights 2</label>
                    <input type="text" className="form-control" name='keyHighlights2' value={formData.keyHighlights2} onChange={handleInputChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Key Highlights 3</label>
                    <input type="text" className="form-control" name='keyHighlights3' value={formData.keyHighlights3} onChange={handleInputChange} />
                  </div>
                </div>
                <div className='course-row'>
                  <div className="col-md-4">
                    <label className="form-label">Key Highlights 4</label>
                    <input type="text" className="form-control" name='keyHighlights4' value={formData.keyHighlights4} onChange={handleInputChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Key Highlights 5</label>
                    <input type="text" className="form-control" name='keyHighlights5' value={formData.keyHighlights5} onChange={handleInputChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Key Highlights 6</label>
                    <input type="text" className="form-control" name='keyHighlights6' value={formData.keyHighlights6} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              {/* USD Fee Section */}
              <h3 style={{ marginTop: 20 }}>Mode Of Training Fee(USD)</h3>
              <div className="course-row">
                {[
                  { label: "Live Training", amount: "amount", discount: "discount", total: "total" },
                  { label: "Crash Course Training", amount: "camount", discount: "cdiscount", total: "ctotal" },
                  { label: "Mentoring Mode", amount: "sqamount", discount: "sqdiscount", total: "sqtotal" },
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
                      <label className="form-label">Amount <span style={{ color: "red" }}>*</span></label>
                      <input
                        type="number"
                        className="form-control-mode"
                        name={mode.amount}
                        value={formData[mode.amount] || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Discount % <span style={{ color: "red" }}>*</span></label>
                      <input
                        type="number"
                        className="form-control-mode"
                        name={mode.discount}
                        value={formData[mode.discount] || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Total <span style={{ color: "red" }}>*</span></label>
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

              {/* INR Fee Section */}
              <h3 style={{ marginTop: 20 }}>Mode Of Training Fee(INR)</h3>
              <div className="course-row">
                {[
                  { label: "Live Training", prefix: "i" },
                  { label: "Crash Course Training", prefix: "ic" },
                  { label: "Mentoring Mode", prefix: "isq" },
                  { label: "Self Paced Training", prefix: "is" },
                ].map((mode, index) => (
                  <div className="course-mode" key={index}>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`inrCheck${index}`}
                        onChange={(e) => setInrChecked(e.target.checked)}
                      />

                      <label className="form-check-label" htmlFor={`inrCheck${index}`}>
                        {mode.label}
                      </label>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Amount <span style={{ color: "red" }}>*</span></label>
                      <input
                        type="number"
                        className="form-control-mode"
                        name={`${mode.prefix}amount`}
                        value={formData[`${mode.prefix}amount`] || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Discount % <span style={{ color: "red" }}>*</span></label>
                      <input
                        type="number"
                        className="form-control-mode"
                        name={`${mode.prefix}discount`}
                        value={formData[`${mode.prefix}discount`] || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Total <span style={{ color: "red" }}>*</span></label>
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

              {/* Sample Session Section */}
              <h3>Sample session</h3>
              <div className='course-row'>
                <div className='course-details'>
                  <h4>Mentoring Training</h4>
                  <div className='course-col'>
                    <div className="col-md-4">
                      <label className="form-label">Day 1</label>
                      <input type="number" className="form-control-sample" name='mentoring1' value={formData.mentoring1} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Day 2</label>
                      <input type="number" className="form-control-sample" name='mentoring2' value={formData.mentoring2} onChange={handleInputChange} />
                    </div>
                  </div>
                </div>
                <div className='course-details'>
                  <h4>Self Paced Training</h4>
                  <div className='course-col'>
                    <div className="col-md-4">
                      <label className="form-label">Day 1</label>
                      <input type="text" className="form-control-sample" name='self1' value={formData.self1} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Day 2</label>
                      <input type="text" className="form-control-sample" name='self2' value={formData.self2} onChange={handleInputChange} />
                    </div>
                  </div>
                </div>
              </div>

              {/* SEO Section */}
              <div className='course-row'>
                <div className="col-md-4">
                  <label className="form-label">Header Title</label>
                  <input type="text" className="form-control" name='headerTitle' value={formData.headerTitle} onChange={handleInputChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Course keyword with comma</label>
                  <input type="text" className="form-control" name='courseKeyword' value={formData.courseKeyword} onChange={handleInputChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Course keyword description</label>
                  <input type="text" className="form-control" name='courseKeywordDescription' value={formData.courseKeywordDescription} onChange={handleInputChange} />
                </div>
              </div>

              {/* About Course Section */}
              <div className="mb-3" style={{ paddingBottom: "20px" }}>
                <label className="form-label">About Course(Add only 160 Characters) <span style={{ color: "red" }}>*</span></label>
                <input
                  type="text"
                  className="form-control"
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

              {/* Course Highlight Section */}
              <div className="mb-3" style={{ paddingBottom: "20px" }}>
                <label className="form-label">Course Highlight(Add only 4 Lines)</label>
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
                <div style={{ marginLeft: '10px', marginTop: '8px', fontSize: '14px', color: characterCount > 360 ? 'red' : 'black' }}>
                  Character Count: {characterCount}/360
                </div>
                {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}
              </div>

              {/* Course Description Section */}
              <div className="mb-3" style={{ paddingBottom: "20px" }}>
                <label className="form-label">Course Description</label>
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

              {/* Status Toggle Switch - New Section */}
              <div className="course-row" style={{ marginBottom: '20px' }}>
                <div className="col-md-12">
                  <label className="form-label" style={{ marginRight: '20px' }}>
                    Status <span style={{ color: "red" }}>*</span>
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '10px', fontWeight: '500', color: formData.status === 'active' ? '#00AEEF' : '#666' }}>
                      {formData.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={formData.status === 'active'}
                        onChange={handleStatusToggle}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}

              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="alert alert-success" role="alert">
                  {successMessage}
                </div>
              )}

              {/* Submit Buttons */}
              <div className="course-row">
                <button
                  className="submit-btn"
                  type="submit"
                  disabled={isSubmitDisabled}
                  style={{
                    backgroundColor: isSubmitDisabled ? "#cccccc" : "#00AAEF",
                    color: isSubmitDisabled ? "#666666" : "#ffffff",
                    cursor: isSubmitDisabled ? "not-allowed" : "pointer",
                    opacity: isSubmitDisabled ? 0.7 : 1,
                  }}
                >
                  {formMode === "Add" ? "Submit" : "Update"}
                </button>
                <button type="button" className="reset-btn" onClick={handleReset}>
                  Reset
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
              <div className='date-schedule'>
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

                {/* First dropdown: Time Period */}
                {/* <select
                  className="form-select period-select"
                  onChange={(e) => handlePeriodChange(e.target.value)}
                  value={selectedPeriod}
                >
                  <option value="">Select Period</option>
                  <option value="thisWeek">This Week</option>
                  <option value="thisMonth">This Month</option>
                  <option value="thisYear">This Year</option>
                </select> */}

                {/* Second dropdown: Mode Filter */}
                {/* <select
                  className="form-select mode-select"
                  onChange={(e) => handleModeChange(e.target.value)}
                  value={selectedMode}
                >
                  <option value="">All Modes</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="both">Both</option>
                </select> */}

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
                      <StyledTableCell align="center" sx={{ width: 100 }}>
                        <Checkbox
                          checked={selectAll}
                          onChange={handleSelectAll}
                          indeterminate={selectedIds.length > 0 && selectedIds.length < displayedCategories.length}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">S.No.</StyledTableCell>
                      <StyledTableCell align="center">Image</StyledTableCell>
                      <StyledTableCell align="center">Category Name</StyledTableCell>
                      <StyledTableCell align="center">Short Course</StyledTableCell>
                      <StyledTableCell align="center">Course Name</StyledTableCell>
                      <StyledTableCell align="center">SEO H1 Title</StyledTableCell>
                      <StyledTableCell align="center">Date</StyledTableCell>
                      {/* New Status Column */}
                      <StyledTableCell align="center">Status</StyledTableCell>
                      <StyledTableCell align="center">Action</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayedCategories.length > 0 ? displayedCategories.map((course, idx) => (
                      <StyledTableRow key={course.id}>
                        <StyledTableCell align="center" sx={{ width: 100 }}>
                          <Checkbox
                            checked={selectedIds.includes(course.id)}
                            onChange={() => handleSelectOne(course.id)}
                          />
                        </StyledTableCell>
                        <StyledTableCell align="center">{idx + 1 + (currentPage - 1) * rowsPerPage}</StyledTableCell>
                        <StyledTableCell align="center">
                          {course.courseImage
                            ? <img src={`http://localhost:8081/${course.courseImage}`} alt="Course" width="50" />
                            : 'No Image'}
                        </StyledTableCell>
                        <StyledTableCell align="left">{course.courseCategory}</StyledTableCell>
                        <StyledTableCell align="left">{course.shortCourse}</StyledTableCell>
                        <StyledTableCell align="left">{course.courseName}</StyledTableCell>
                        <StyledTableCell align="left">{course.seoH1Title}</StyledTableCell>
                        {/* <StyledTableCell align="center">{course.date}</StyledTableCell> */}
                        <StyledTableCell align="center">
                          {course.date
                            ? dayjs(course.date, "YYYY-MM-DD").format("MMM-DD-YYYY").toUpperCase()
                            : "-"}
                        </StyledTableCell>
                        {/* Status Column Display */}
                        <StyledTableCell align="center">
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            backgroundColor: course.courseStatus === 'active' ? '#d4edda' : '#f8d7da',
                            color: course.courseStatus === 'active' ? '#155724' : '#721c24',
                            border: course.courseStatus === 'active' ? '1px solid #c3e6cb' : '1px solid #f5c6cb'
                          }}>
                            {course.courseStatus ? (course.courseStatus.charAt(0).toUpperCase() + course.courseStatus.slice(1)) : 'Active'}
                          </span>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                            <FaEdit className="edit" onClick={() => handleEditClick(course.id)} style={{ cursor: "pointer" }} />
                            <RiDeleteBin6Line className="delete" onClick={() => handleDeleteConfirmation(course.id)} style={{ cursor: "pointer" }} />
                          </div>
                        </StyledTableCell>
                      </StyledTableRow>
                    )) : (
                      <StyledTableRow>
                        <StyledTableCell colSpan={9} align="center">No courses available.</StyledTableCell>
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

export default CourseDetail;