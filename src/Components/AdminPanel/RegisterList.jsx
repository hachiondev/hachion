import React, { useEffect } from 'react';
import { useState } from 'react';
import { duration, styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import './Admin.css';
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { RiCloseCircleLine } from 'react-icons/ri';
import success from '../../Assets/success.gif';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { IoSearch } from "react-icons/io5";
import { FiPlus } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { IoMdCloseCircleOutline } from "react-icons/io";
import axios from 'axios';
import { GoPlus } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { MdKeyboardArrowRight } from 'react-icons/md';
import AdminPagination from './AdminPagination';
import { AiFillCaretDown } from 'react-icons/ai';
import { Menu, MenuItem } from '@mui/material';
import Flag from 'react-world-flags';
import { countries as staticCountries } from '../../countryUtils';
import Select from 'react-select';
dayjs.extend(customParseFormat);

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
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function RegisterList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [formMode, setFormMode] = useState("Add");
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [registerStudent, setRegisterStudent] = useState([]);
  const [filteredStudent, setFilteredStudent] = useState([])
  const [open, setOpen] = React.useState(false);
  const currentDate = new Date().toISOString().split('T')[0];
  const [message, setMessage] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);
const [isUpdating, setIsUpdating] = useState(false);
  const [editedData, setEditedData] = useState({ student_Id: "", userName: "", email: "", mobile: "", whatsapp: "", location: "", country: "", time_zone: "", analyst_name: "", source: "", remarks: "", comments: "", date: currentDate, visa_status: "", mode: "" });
  const [mobileError, setMobileError] = useState("");
  const [whatsappError, setWhatsappError] = useState("");
const [sendingId, setSendingId] = useState(null);
  const [anchorElCountry, setAnchorElCountry] = useState(null);
  const [allEmployees, setAllEmployees] = useState([]);
const [seoEmployees, setSeoEmployees] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({
    name: '',
    code: '',
    flag: ''
  });
  const [studentData, setStudentData] = useState({
    student_Id: "",
    userName: "",
    email: "",
    mobile: "",
    whatsapp: "",
    country: "",
    location: "",
    time_zone: "",
    analyst_name: "",
    source: "",
    remarks: "",
    comments: "",
    date: currentDate,
    visa_status: "",
    mode: "Offline",

     seoTeam: "",
  technology: "",
  stateCity: "",
  leadStatus: "",
  leadTag: ""   
  });
// ✅ NEW: Update Modal + History States
const [openUpdateModal, setOpenUpdateModal] = useState(false);
const [latestUpdate, setLatestUpdate] = useState(null);
const [history, setHistory] = useState([]);
const [isBulkSending, setIsBulkSending] = useState(false);
const [updateForm, setUpdateForm] = useState({
  remark: "",
  status: "",
  date: "",
  coordinator: ""
});
const [showStatusConfirm, setShowStatusConfirm] = useState(false);
const [pendingStatusChange, setPendingStatusChange] = useState(null);

  const [countries, setCountries] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ADDED: State for checkbox selection
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, window.scrollY);
  };

  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  const displayedCourse = filteredStudent.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleReset = () => {
    setStudentData({
      student_Id: "",
      userName: "",
      email: "",
      mobile: "",
      whatsapp: "",
      country: "",
      location: "",
      time_zone: "",
      analyst_name: "",
      source: "",
      remarks: "",
      comments: "",
      date: currentDate,
      visa_status: "",
      mode: "offline",
 seoTeam: "",
    technology: "",
    stateCity: "",
    leadStatus: "",
    leadTag: ""
    });
  }
  const handleSendEmail = async (studentId) => {
  try {
    setSendingId(studentId);   // 👈 start loading
    setSuccessMessage("");
    setErrorMessage("");

    await axios.post(`https://api.test.hachion.co/send-email/${studentId}`);

    setSuccessMessage("✅ Email sent successfully!");
    setErrorMessage("");

    setTimeout(() => setSuccessMessage(""), 4000);

  } catch (error) {
    console.error(error);

    setErrorMessage("❌ Failed to send email");
    setSuccessMessage("");

    setTimeout(() => setErrorMessage(""), 4000);

  } finally {
    setSendingId(null);   // 👈 stop loading
  }
};
const handleBulkSendEmail = async () => {
  if (selectedIds.length === 0) {
    setErrorMessage("Please select at least one student");
    setTimeout(() => setErrorMessage(""), 3000);
    return;
  }

  if (isBulkSending) return; // ✅ prevent double click

  try {
    setIsBulkSending(true);   // 👈 START LOADING
    setSuccessMessage("");
    setErrorMessage("");

    let successCount = 0;
    let failCount = 0;
    let skippedCount = 0;

    for (let id of selectedIds) {
      const student = registerStudent.find(s => s.id === id);

      if (!student?.remark || student.remark.trim() === "") {
        skippedCount++;
        continue;
      }

      try {
        await axios.post(`https://api.test.hachion.co/send-email/${student.studentId}`);
        successCount++;
      } catch {
        failCount++;
      }
    }

    let message = `✅ ${successCount} emails sent successfully`;

if (skippedCount > 0) {
  message += ` | ⚠️ ${skippedCount} skipped (no remarks)`;
}

setSuccessMessage(message);

if (failCount > 0) {
  setErrorMessage(`❌ ${failCount} failed`);
}

    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 4000);

  } catch (error) {
    console.error(error);
    setErrorMessage("❌ Bulk email failed");
  } finally {
    setIsBulkSending(false);   // 👈 STOP LOADING
  }
};
  const resetFormState = () => {
    setStudentData({
      student_Id: "",
      userName: "",
      email: "",
      mobile: "",
      whatsapp: "",
      country: "",
      location: "",
      time_zone: "",
      analyst_name: "",
      source: "",
      remarks: "",
      comments: "",
      date: currentDate,
      visa_status: "",
      mode: "Offline",
      seoTeam: "",
    technology: "",
    stateCity: "",
    leadStatus: "",
    leadTag : ""
    });

    setSelectedCountry({
      value: "",
      code: "",
      flag: ""
    });

    setMobileError("");
    setWhatsappError("");
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setOpen(false);
  };
// ✅ OPEN MODAL
const openModal = () => setOpenUpdateModal(true);
const closeModal = () => setOpenUpdateModal(false);

// ✅ SAVE UPDATE (FRONTEND ONLY FOR NOW)
const handleSaveUpdate = async () => {
  try {
   const today = new Date();

// ✅ Format: 27-March-2026
const formattedDate = today.toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "long",
  year: "numeric"
}).replace(",", "");

const payload = {
  studentId: studentData.studentId,
  remark: updateForm.remark,

  // ❌ don't send status here
  callMadeOn: formattedDate,          // ✅ current date auto

  lastCallMadeOn: updateForm.date,    // next follow-up

  coordinator: updateForm.coordinator,

  callStatus: updateForm.status       // ✅ correct mapping
};

    const response = await axios.post(
      "https://api.test.hachion.co/register-student/add-remark",
      payload
    );

    const saved = response.data;

   const newUpdate = {
  remark: saved.remark,
  status: saved.callStatus,
  followUpDate: saved.lastCallMadeOn,   // next follow-up
  callDate: saved.callMadeOn,           // actual call date
  coordinator: saved.coordinator
};

    setLatestUpdate(newUpdate);
    setHistory(prev => [newUpdate, ...prev]);

    setUpdateForm({
      remark: "",
      status: "",
      date: "",
      coordinator: ""
    });

    closeModal();

  } catch (error) {
    console.error("Error saving remark:", error);
    alert("Failed to save update");
  }
};
const isUpdateFormValid = () => {
  return (
    updateForm.remark.trim() !== "" &&
    updateForm.status !== "" &&
    updateForm.coordinator !== "" 
    // updateForm.date !== ""   // include if date mandatory
  );
};
  useEffect(() => {
    const formattedCountries = staticCountries.filter(c => c.name && c.code);
    setCountries(formattedCountries);
  }, []);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    const currentMobile = studentData.mobile || "";
    const numberPart = currentMobile.includes(" ") ? currentMobile.split(" ")[1] : currentMobile;
    setStudentData(prev => ({
      ...prev,
      mobile: numberPart.trim(),
    }));
  };

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get('https://api.test.hachion.co/registerstudent-with-remarks');
        const mappedData = response.data.map(item => ({
  ...item,

  // ✅ handle both cases
  time_zone: item.time_zone || item.timeZone || "",
  analyst_name: item.analyst_name || item.analystName || ""
}));
        setRegisterStudent(mappedData);
setFilteredStudent(mappedData);

      } catch (error) {
        console.error("Error fetching student list:", error.message);
      }
    };
    fetchStudent();
    setFilteredStudent(registerStudent)
  }, []);

  useEffect(() => {
  const fetchEmployees = async () => {
    try {
      const allRes = await axios.get("https://api.test.hachion.co/employees/enteredBy");
      const seoRes = await axios.get("https://api.test.hachion.co/employees/seo-team");

      setAllEmployees(allRes.data);
      setSeoEmployees(seoRes.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  fetchEmployees();
}, []);
  const handleDateFilter = () => {
    const filtered = registerStudent.filter((item) => {
      const regDate = new Date(item.date);
      const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
      const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

      // const matchSearch =
      //   (item.studentId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      //   (item.userName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      //   (item.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      //   (item.mobile || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      //   (item.country || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      //   (item.location || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      //   (item.analyst_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      //   (item.source || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      //   (item.mode || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      //   (item.date || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      //   (item.visa_status || "").toLowerCase().includes(searchTerm.toLowerCase());
const matchSearch =
  (item.studentId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
  (item.userName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
  (item.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
  (item.mobile || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
  (item.whatsapp || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
  (item.country || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
  (item.location || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
  (item.time_zone || "").toLowerCase().includes(searchTerm.toLowerCase()) ||

  (item.analyst_name || item.analyst_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
  (item.source || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
  (item.mode || "").toLowerCase().includes(searchTerm.toLowerCase()) ||

  (item.seoTeam || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
  (item.course_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
  (item.stateCity || "").toLowerCase().includes(searchTerm.toLowerCase()) ||

  (item.leadStatus || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
  (item.status || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
  (item.leadTag || "").toLowerCase().includes(searchTerm.toLowerCase()) ||

  (item.remark || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
  (item.remarkCoordinator || "").toLowerCase().includes(searchTerm.toLowerCase()) ||

  (item.callMadeOn || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
  (item.lastCallMadeOn || "").toLowerCase().includes(searchTerm.toLowerCase()) ||

  (item.date || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
  (item.visa_status || "").toLowerCase().includes(searchTerm.toLowerCase());
      const inRange =
        (!start || regDate >= start) &&
        (!end || regDate <= end)

      return matchSearch && inRange;
    });
    setFilteredStudent(filtered);
    setCurrentPage(1);
  };

  const handleDateReset = () => {
    setStartDate(null);
    setEndDate(null);
    setSearchTerm('');
    setFilteredStudent(registerStudent);
    setCurrentPage(1);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `https://api.test.hachion.co/registerstudent/update/${editedData.student_Id}`, editedData
      );
      setRegisterStudent((prev) =>
        prev.map(curr =>
          curr.student_Id === editedData.student_Id ? response.data : curr
        )
      );
      setMessage("Student details updated successfully!");
      setTimeout(() => setMessage(""), 5000);
      setOpen(false);
    } catch (error) {
      setMessage("Error updating student details.");
    }
  };

  const handleDeleteConfirmation = (id) => {
    if (window.confirm("Are you sure you want to delete this Student?")) {
      handleDelete(id);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`https://api.test.hachion.co/registerstudent/delete/${id}`);
      
      setRegisterStudent((prev) => prev.filter((s) => s.id !== id));
      setFilteredStudent((prev) => prev.filter((s) => s.id !== id));
      
      // Remove from selectedIds if present
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
      
      setSuccessMessage("✅ Student deleted successfully.");
      setErrorMessage("");
    } catch (error) {
      console.error("Error deleting Student:", error);
      setErrorMessage("❌ Failed to delete student. Please try again.");
      setSuccessMessage("");
    }
  };
useEffect(() => {
  const filtered = registerStudent.filter(item => {
    const search = searchTerm.toLowerCase();

    return (
      (item.studentId || "").toLowerCase().includes(search) ||
      (item.userName || "").toLowerCase().includes(search) ||
      (item.email || "").toLowerCase().includes(search) ||
      (item.mobile || "").toLowerCase().includes(search) ||
      (item.whatsapp || "").toLowerCase().includes(search) ||

      (item.country || "").toLowerCase().includes(search) ||
      (item.location || "").toLowerCase().includes(search) ||
      (item.time_zone || "").toLowerCase().includes(search) ||

      (item.analyst_name || item.analyst_name || "").toLowerCase().includes(search) ||
      (item.source || "").toLowerCase().includes(search) ||
      (item.mode || "").toLowerCase().includes(search) ||

      (item.seoTeam || "").toLowerCase().includes(search) ||
      (item.course_name || "").toLowerCase().includes(search) ||
      (item.stateCity || "").toLowerCase().includes(search) ||

      (item.leadStatus || "").toLowerCase().includes(search) ||
      (item.status || "").toLowerCase().includes(search) ||
      (item.leadTag || "").toLowerCase().includes(search) ||

      (item.remark || "").toLowerCase().includes(search) ||
      (item.remarkCoordinator || "").toLowerCase().includes(search) ||

      (item.callMadeOn || "").toLowerCase().includes(search) ||
      (item.lastCallMadeOn || "").toLowerCase().includes(search) ||

      (item.date || "").toLowerCase().includes(search) ||
      (item.visa_status || "").toLowerCase().includes(search)
    );
  });

  setFilteredStudent(filtered);
  setCurrentPage(1);
}, [searchTerm, registerStudent]);

const handleClickOpen = async (row) => {
  setFormMode("Edit");
const [codePart, ...numberParts] = (row.mobile || "").split(" ");
const numberPart = numberParts.join(" ");

const [wCode, ...wNumberParts] = (row.whatsapp || "").split(" ");
const wNumberPart = wNumberParts.join(" ");

// ✅ MATCH USING MOBILE COUNTRY CODE (FIX)
const matchedCountry = countries.find(
  (c) => c.code === codePart
);

if (matchedCountry) {
  setSelectedCountry({
    value: matchedCountry.name,
    code: matchedCountry.code,
    flag: matchedCountry.flag,
  });
} else {
  // ✅ FALLBACK (IMPORTANT)
  setSelectedCountry({
    value: row.country || "",
    code: codePart || "",
    flag: ""
  });
}

  setStudentData({
    ...row,
    userName: row.userName ?? "",
    email: row.email ?? "",
     mobile: numberPart || "",
  whatsapp: wNumberPart || "",
    country: row.country ?? "",
    location: row.location ?? "",
    time_zone: row.time_zone ?? "",
    analyst_name: row.analyst_name ?? "",
    source: row.source ?? "Select",
    visa_status: row.visa_status ?? "Select Visa Status",
    remarks: row.remarks ?? "",
    comments: row.comments ?? "",
    seoTeam: row.seoTeam ?? "",
    technology: row.course_name ?? "",
    stateCity: row.stateCity ?? "",
    leadStatus: row.leadStatus ?? "",
    leadTag: row.leadTag ?? "",
    status: (row.status || "").toUpperCase()
  });

  try {
    const res = await axios.get(
      `https://api.test.hachion.co/remarks/${row.studentId}`
    );

    const data = res.data;

    if (data && data.length > 0) {
      // ✅ PICK LATEST (LAST RECORD)
      // const latest = data[data.length - 1];
const latest = data.sort((a, b) => b.id - a.id)[0];
      const latestMapped = {
        remark: latest.remark,
        status: latest.callStatus,
        callDate: latest.callMadeOn,
        followUpDate: latest.lastCallMadeOn,
        coordinator: latest.coordinator
      };

      setLatestUpdate(latestMapped);
      // setHistory(data); // optional (if you want full history)
    const sortedData = data.sort((a, b) => b.id - a.id);

const formattedHistory = sortedData.map(item => ({
  remark: item.remark,
  status: item.callStatus,
  callDate: item.callMadeOn,
  followUpDate: item.lastCallMadeOn,
  coordinator: item.coordinator
}));

setHistory(formattedHistory);
    } else {
      setLatestUpdate(null);
    }

  } catch (error) {
    console.error("Error fetching remarks:", error);
  }

  // ✅ NEW CODE END

  setShowAddCourse(true);
};
  const handleUpdate = async () => {
    if (isUpdating) return; // ✅ prevent multiple clicks
  setIsUpdating(true);
    try {
      const finalMobile = `${selectedCountry.code} ${studentData.mobile}`;
      const finalWhatsapp = `${selectedCountry.code} ${studentData.whatsapp}`;

      const updatedData = {
        ...studentData,
        mobile: finalMobile,
        whatsapp: finalWhatsapp,
        course_name: studentData.technology,
        status: studentData.status || "ACTIVE"
      };

      const response = await axios.put(
        `https://api.test.hachion.co/registerstudent/update/${studentData.id}`,
        updatedData
      );

      setRegisterStudent((prev) =>
        prev.map((s) => s.id === studentData.id ? response.data : s)
      );
      setMessage("Student updated successfully!");
      setIsUpdating(false);
      setShowAddCourse(false);
      setFormMode("Add");
      handleReset();
    } catch (error) {
      setIsUpdating(false);
      console.error("Error updating student:", error.message);
      setMessage("Error updating student.");
    }
  };
const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "status") {
    const currentStatus = (studentData.status || "").toUpperCase();

    // ✅ DISABLED → ACTIVE
    if (currentStatus === "DISABLED" && value === "ACTIVE") {
      setPendingStatusChange(value);
      setShowStatusConfirm(true);
      return;
    }

    // ✅ ACTIVE → DISABLED
    if (currentStatus === "ACTIVE" && value === "DISABLED") {
      setPendingStatusChange(value);
      setShowStatusConfirm(true);
      return;
    }
  }

  setStudentData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

  const handleMobileBlur = () => {
    const mobile = studentData.mobile?.trim();

    if (!mobile || mobile.length !== 10) {
      setMobileError("❌ Mobile number must be exactly 10 digits.");
    } else {
      setMobileError("");
    }
  };
const formatDate = (dateStr) => {
  if (!dateStr) return "";

  // Try multiple input formats
  const parsed = dayjs(dateStr, [
    "YYYY-MM-DD",
    "DD-MMM-YY",
    "DD-MMM-YYYY",
    "DD MMMM YYYY", 
    "DD-MMMM-YYYY",  // ✅ handles "13 April 2026"
    "DD MMM YYYY",
    "MMM-DD-YYYY"
  ], true);


  if (parsed.isValid()) {
    return parsed.format("MMM-DD-YYYY"); // ✅ FINAL FORMAT
  }

  return dateStr; // fallback
};
  const handleWhatsappBlur = () => {
    const whatsapp = studentData.whatsapp?.trim();

    if (!whatsapp || whatsapp.length !== 10) {
      setWhatsappError("❌ WhatsApp number must be exactly 10 digits.");
    } else {
      setWhatsappError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);
    
    const mobileNumber = studentData.mobile?.trim();
    const countryCode = selectedCountry.code?.trim() || "";

    if (!mobileNumber || mobileNumber.length !== 10) {
      setErrorMessage("❌ Mobile number must be exactly 10 digits.");
      setSuccessMessage("");
      return;
    }

    const finalMobile = `${countryCode} ${mobileNumber}`;
    const currentDate = new Date().toISOString().split("T")[0];
    const finalWhatsapp = `${countryCode} ${studentData.whatsapp}`;

    const dataToSubmit = {
      ...studentData,
      mobile: finalMobile,
      whatsapp: finalWhatsapp,
      date: currentDate,
       course_name: studentData.technology,
        status: studentData.status || "New",
        time_zone: studentData.time_zone,
  analyst_name: studentData.analyst_name
    };
    

    try {
      const response = await axios.post("https://api.test.hachion.co/registerstudent/add", dataToSubmit);
      if (response.status === 200) {
        setIsSubmitting(false);
        setSuccessMessage("✅ Student added successfully.");
        setErrorMessage("");
        setStudentData(dataToSubmit);
        handleReset();
      }
    } catch (error) {
      setIsSubmitting(false);
      if (error.response && error.response.data && error.response.data.message) {
        const message = error.response.data.message;

        if (message.includes("Email already exists")) {
          setErrorMessage("❌ Email already exists in the system.");
        } else if (message.includes("Mobile number already exists")) {
          setErrorMessage("❌ Mobile number already exists in the system.");
        } else {
          setErrorMessage("❌ Failed to add student: " + message);
        }
      } else {
        console.error("Error adding student:", error.message);
        setErrorMessage("❌ An unexpected error occurred.");
      }
      setSuccessMessage("");
    }
  };

  const handleAddTrendingCourseClick = () => {
    setFormMode("Add");
    resetFormState();
    setShowAddCourse(true);
  };

  const isFormValid = () => {
    const safeTrim = (val) => (val ?? "").trim();

    return (
      safeTrim(studentData.userName) !== "" &&
      safeTrim(studentData.email) !== "" &&
      safeTrim(studentData.mobile).length === 10 &&
      safeTrim(studentData.whatsapp).length === 10 &&
      safeTrim(studentData.country) !== "" &&
      // safeTrim(studentData.location) !== "" &&
      safeTrim(studentData.time_zone) !== "" &&
      safeTrim(studentData.analyst_name) !== "" && 
      safeTrim(studentData.seoTeam) !== "" &&
      safeTrim(studentData.stateCity) !== "" &&
      safeTrim(studentData.leadStatus) !== "" &&
      safeTrim(studentData.status) !== "" 
      // safeTrim(studentData.remarks).length >= 15 &&
      // safeTrim(studentData.comments) !== ""
    );
  };

  // ADDED: Handle Select All checkbox
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = displayedCourse.map(student => student.id);
      setSelectedIds(allIds);
      setSelectAll(true);
    } else {
      setSelectedIds([]);
      setSelectAll(false);
    }
  };

  // ADDED: Handle individual checkbox
  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
      setSelectAll(false);
    } else {
      const newSelectedIds = [...selectedIds, id];
      setSelectedIds(newSelectedIds);
      // Check if all items are selected
      if (newSelectedIds.length === displayedCourse.length) {
        setSelectAll(true);
      }
    }
  };

  // ADDED: Update selectAll state when page changes
  useEffect(() => {
    const allCurrentPageIds = displayedCourse.map(student => student.id);
    const allSelected = allCurrentPageIds.length > 0 && 
                       allCurrentPageIds.every(id => selectedIds.includes(id));
    setSelectAll(allSelected);
  }, [currentPage, displayedCourse, selectedIds]);

  // ADDED: Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      setErrorMessage("Please select at least one student to delete");
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    const confirmMessage = `Are you sure you want to delete ${selectedIds.length} selected ${selectedIds.length === 1 ? 'student' : 'students'}?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        // Delete all selected students
        await Promise.all(
          selectedIds.map(id =>
            axios.delete(`https://api.test.hachion.co/registerstudent/delete/${id}`)
          )
        );

        // Update state
        const updatedStudents = registerStudent.filter(item => !selectedIds.includes(item.id));
        setRegisterStudent(updatedStudents);
        setFilteredStudent(updatedStudents);
        
        setSelectedIds([]);
        setSelectAll(false);
        
        setSuccessMessage(`${selectedIds.length} ${selectedIds.length === 1 ? 'student' : 'students'} deleted successfully`);
        setErrorMessage("");
        
        setTimeout(() => {
          setSuccessMessage("");
        }, 6000);
      } catch (error) {
        console.error("Error deleting students:", error);
        setSuccessMessage("");
        setErrorMessage("Error deleting some students. Please try again.");
        setTimeout(() => {
          setErrorMessage("");
        }, 6000);
      }
    }
  };
  const validSelectedCount = selectedIds.filter(id => {
  const student = registerStudent.find(s => s.id === id);
  return student?.remark && student.remark.trim() !== "";
}).length;

  return (
    <>
      {showAddCourse ? (
        <div className='course-category'>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#!" onClick={() => {
                  setShowAddCourse(false);
                  setFormMode("Add");
                  resetFormState();
                }} >Register List</a> <MdKeyboardArrowRight />
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {formMode === "Edit" ? "Edit Student" : "Add Student"}
              </li>
            </ol>
          </nav>

          <div className='category'>
            <div className='category-header'>
              <p style={{ marginBottom: 0 }}>{formMode === "Edit" ? "Edit Student" : "Add Student"}</p>
            </div>
            <div className="course-row">
              <div class="col">
                <label for="inputEmail4" class="form-label">Student Name <span className="star">*</span></label>
                <input type="text" class="schedule-input" id="inputEmail4" name="userName"
                  value={studentData.userName}
                  onChange={handleChange} />
              </div>
              <div class="col">
                <label for="inputPassword4" class="form-label">Email <span className="star">*</span></label>
                <input type="email" class="schedule-input" id="inputPassword4" placeholder='abc@gmail.com'
                  name="email"
                  value={studentData.email}
                  onChange={handleChange} />
              </div>
              <div class="col">
                <label for="inputPassword4" class="form-label">Location </label>
                <input type="text" class="schedule-input" id="inputPassword4" name="location"
                  value={studentData.location}
                  onChange={handleChange} />
              </div>
            </div>
            <div className="course-row">

              <div className="col">
                <label className="form-label">
                  Country <span className="star">*</span>
                </label>
                <Select
                  options={countries
                    .filter((country) => country.name && country.code)
                    .map((country) => ({
                      value: country.name,
                      label: (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Flag code={country.flag} style={{ width: '20px', marginRight: '10px' }} />
                          {country.name} ({country.code})
                        </div>
                      ),
                      flag: country.flag,
                      code: country.code
                    }))}
                  onChange={(selected) => {
                    setSelectedCountry(selected);
                    setStudentData((prev) => ({
                      ...prev,
                      country: selected.value,
                      mobile: "",
                      whatsapp: ""
                    }));

                  }}
                  value={
                    selectedCountry.value
                      ? {
                        value: selectedCountry.value,
                        label: (
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Flag code={selectedCountry.flag} style={{ width: '20px', marginRight: '10px' }} />
                            {selectedCountry.value} ({selectedCountry.code})
                          </div>
                        )
                      }
                      : null
                  }
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: '50px',
                      height: '50px'
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      height: '50px',
                      padding: '0 8px'
                    }),
                    indicatorsContainer: (base) => ({
                      ...base,
                      height: '50px'
                    })
                  }}
                />
              </div>

              <div className="col">
                <label className="form-label">Mobile <span className="star">*</span></label>
                <div style={{ position: 'relative' }}>
                  {/* Country code prefix */}
                  <span
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '0',
                      bottom: '0',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '16px',
                      fontFamily: 'inherit',
                      color: '#212529',
                      height: '50px',
                      pointerEvents: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {selectedCountry.code}
                  </span>

                  {/* Input box for mobile */}
                  <input
                    type="text"
                    className="schedule-input"
                    placeholder="Enter mobile number"
                    name="mobile"
                    value={studentData.mobile}
                    onChange={handleChange}
                    onBlur={handleMobileBlur} handleMobileBlur
                    style={{
                      paddingLeft: selectedCountry.code ? `${selectedCountry.code.length * 10 + 20}px` : '10px',
                      fontSize: '16px',
                      fontFamily: 'inherit',
                    }}
                  />

                  {mobileError && (
                    <small style={{ color: 'red', marginTop: '4px', display: 'block' }}>{mobileError}</small>
                  )}
                </div>
              </div>
              <div className="col">
                <label className="form-label">WhatsApp Number <span className="star">*</span></label>

                <div style={{ position: 'relative' }}>
                  {/* Country code prefix */}
                  <span
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '0',
                      bottom: '0',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '16px',
                      fontFamily: 'inherit',
                      color: '#212529',
                      height: '50px',
                      pointerEvents: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {selectedCountry.code}
                  </span>

                  <input
                    type="text"
                    className="schedule-input"
                    placeholder="Enter WhatsApp number"
                    name="whatsapp"
                    value={studentData.whatsapp}
                    onChange={handleChange}
                    onBlur={handleWhatsappBlur}
                    style={{
                      paddingLeft: selectedCountry.code
                        ? `${selectedCountry.code.length * 10 + 20}px`
                        : '10px',
                      fontSize: '16px',
                      fontFamily: 'inherit',
                    }}
                  />
                  {whatsappError && (
                    <small style={{ color: 'red', marginTop: '4px', display: 'block' }}>
                      {whatsappError}
                    </small>
                  )}

                </div>
                
              </div>
{/* ✅ NEW STATUS COLUMN */}
<div className="col">
  <label className="form-label">Status <span className="star">*</span></label>

  <select
    className="schedule-input"
    name="status"
    value={studentData.status || ""}
    onChange={handleChange}
  >
    <option value="">Select Status</option>
    <option value="ACTIVE">ACTIVE</option>
    <option value="SEMI-ACTIVE">SEMI-ACTIVE</option>
    <option value="INACTIVE">INACTIVE</option>
    <option value="DISABLED">DISABLED</option>
  </select>
</div>
            </div>
            <div className="course-row">
              <div class="col">
                <label for="inputState" class="form-label">Time Zone <span className="star">*</span></label>
                <input type="text" class="schedule-input"
                  name="time_zone" value={studentData.time_zone} onChange={handleChange} />
              </div>
              <div class="col">
                <label for="inputState" class="form-label">Entered by <span className="star">*</span></label>
               <select
  className="schedule-input"
  name="analyst_name"
  value={studentData.analyst_name}
  onChange={handleChange}
>
  <option value="">Select Entered By</option>
  {allEmployees.map((emp, index) => (
    <option key={index} value={emp}>{emp}</option>
  ))}
</select>
              </div>
              <div class="col">
                <label for="inputState" class="form-label">Visa Status</label>
                <select id="inputState" class="form-select" name="visa_status" value={studentData.visa_status} onChange={handleChange}>
                  <option selected>Select Visa Status</option>
                  <option>H1B</option>
                  <option>GC</option>
                  <option>EAD</option>
                  <option>F1</option>
                  <option>Not Sure</option>
                </select>
              </div>
              <div class="col">
                <label for="inputState" class="form-label">Source of Enquiry <span className="star">*</span></label>
               <select
  id="inputState"
  className="form-select"
  name="source"
  value={studentData.source || ""}
  onChange={handleChange}
>
  <option value="">Select</option>

  {/* ✅ SHOW DB VALUE IF NOT IN DROPDOWN */}
  {studentData.source &&
    !["Linkedin", "Instagram", "Facebook", "Twitter", "Other"].includes(studentData.source) && (
      <option value={studentData.source}>
        {studentData.source}
      </option>
    )}

  <option value="Linkedin">Linkedin</option>
  <option value="Instagram">Instagram</option>
  <option value="Facebook">Facebook</option>
  <option value="Twitter">Twitter</option>
  <option value="Other">Other</option>
</select>
              </div>
              

            </div>
            <div className="course-row">
  <div class="col">
    <label class="form-label">SEO Team <span className="star">*</span></label>
   <select
  className="schedule-input"
  name="seoTeam"
  value={studentData.seoTeam}
  onChange={handleChange}
>
  <option value="">Select SEO Team</option>
  {seoEmployees.map((emp, index) => (
    <option key={index} value={emp}>{emp}</option>
  ))}
</select>
  </div>

  <div class="col">
    <label class="form-label">Technology </label>
    <input type="text" class="schedule-input"
      name="technology"
      value={studentData.technology}
      onChange={handleChange} />
  </div>

  <div class="col">
    <label class="form-label">State / City <span className="star">*</span></label>
    <input type="text" class="schedule-input"
      name="stateCity"
      value={studentData.stateCity}
      onChange={handleChange} />
  </div>

 <div class="col">
  <label class="form-label">Lead Status <span className="star">*</span></label>
  
  <select
    className="schedule-input"
    name="leadStatus"
    value={studentData.leadStatus}
    onChange={handleChange}
  >
    <option value="">Select Status</option>
    <option value="New Lead">New Lead</option>
    <option value="Contacted">Contacted</option>
    <option value="Interested">Interested</option>
    <option value="Demo Scheduled">Demo Scheduled</option>
    <option value="Demo Attended">Demo Attended</option>
    <option value="Not Interested">Not Interested</option>
    <option value="No Response">No Response</option>
    <option value="Enrolled">Enrolled</option>
    <option value="No Clarity">No Clarity</option>
    <option value="Placements">Placements</option>
  </select>
</div>
<div class="col">
  <label class="form-label">Lead Tag</label>
<select
  className="schedule-input"
  name="leadTag"
  value={studentData.leadTag || ""}
  onChange={handleChange}
>
  <option value="">Select Tag</option>

  {/* ✅ SHOW DB VALUE EVEN IF NOT IN DROPDOWN */}
  {studentData.leadTag &&
    !["Hot", "Warm", "Cold"].includes(studentData.leadTag) && (
      <option value={studentData.leadTag}>
        {studentData.leadTag}
      </option>
    )}

  <option value="Hot">🔥 Hot</option>
  <option value="Warm">🌤️ Warm</option>
  <option value="Cold">❄️ Cold</option>
</select>
</div>
</div>
           
            {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}
            <div className="course-row">
             {formMode === "Edit" ? (
    <div style={{ width: "100%" }}>
     <button 
  className='submit-btn' 
  onClick={handleUpdate} 
  disabled={!isFormValid() || isUpdating}
>
  {isUpdating ? "Updating..." : "Update"}
</button>
{showStatusConfirm && (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.4)",
    zIndex: 9999
  }}>
    <div style={{
      width: "400px",
      background: "#fff",
      margin: "150px auto",
      padding: "20px",
      borderRadius: "8px",
      textAlign: "center"
    }}>
      <h3>Confirmation</h3>
      {/* <p>Are you sure you want to activate this student?</p> */}
<p>
  {pendingStatusChange === "ACTIVE"
    ? "Are you sure you want to activate this student?"
    : "Are you sure you want to disable this student?"}
</p>
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => {
            setStudentData(prev => ({
              ...prev,
              status: pendingStatusChange
            }));
            setShowStatusConfirm(false);
          }}
          style={{
            background: "#28a745",
            color: "#fff",
            padding: "8px 16px",
            marginRight: "10px",
            borderRadius: "5px"
          }}
        >
          Yes
        </button>

        <button
          onClick={() => {
            setShowStatusConfirm(false);
          }}
          style={{
            background: "#ccc",
            padding: "8px 16px",
            borderRadius: "5px"
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
      {/* ✅ FORCE NEW LINE */}
      <div style={{ width: "100%", marginTop: "20px" }}>
{openUpdateModal && (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.4)",
    zIndex: 9999
  }}>

    <div style={{
      width: "600px",
      background: "#fff",
      margin: "60px auto",
      borderRadius: "10px",
      padding: "20px 25px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
    }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Add Follow-up Update</h2>
        <span style={{ cursor: "pointer", fontSize: "22px" }} onClick={closeModal}>✖</span>
      </div>

      {/* STUDENT INFO */}
      <div style={{ display: "flex", alignItems: "center", margin: "20px 0" }}>
        <div style={{
          width: "45px",
          height: "45px",
          borderRadius: "50%",
          background: "#d9eaf7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: "10px"
        }}>
          👤
        </div>
        <div>
          <div>Student Name:</div>
          <div style={{ fontSize: "18px", fontWeight: "500" }}>
            {studentData.userName}
          </div>
        </div>
      </div>

      {/* REMARK */}
      {/* <label>Remark *</label> */}
      <label>
  Remark <span style={{ color: "red", marginLeft: "3px" }}>*</span>
</label>
      <textarea
        rows="3"
        value={updateForm.remark}
        onChange={(e) => setUpdateForm({ ...updateForm, remark: e.target.value })}
        style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
      />

      {/* ROW */}
      <div style={{ display: "flex", gap: "15px" }}>

        <div style={{ flex: 1 }}>
          {/* <label>Call Status *</label> */}
          <label>
  Call Status <span style={{ color: "red", marginLeft: "3px" }}>*</span>
</label>
          <select
            value={updateForm.status}
            onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
            style={{ width: "100%", padding: "10px", borderRadius: "6px" }}
          >
            <option value="" disabled>Select Call Status</option>
            <option>Called</option>
            <option>Not Connected</option>
            <option>Incorrect Number</option>
            <option>Not Picking</option>
            <option>No Number</option>
          </select>
        </div>

        <div style={{ flex: 1 }}>
          <label>Next Follow-up Date</label>
          <input
            type="date"
            value={updateForm.date}
            onChange={(e) => setUpdateForm({ ...updateForm, date: e.target.value })}
            style={{ width: "100%", padding: "10px", borderRadius: "6px" }}
          />
        </div>

      </div>

      {/* COORDINATOR */}
      {/* <label>Coordinator *</label> */}
      <label>
  Coordinator <span style={{ color: "red", marginLeft: "3px" }}>*</span>
</label>
      <select
        value={updateForm.coordinator}
        onChange={(e) => setUpdateForm({ ...updateForm, coordinator: e.target.value })}
        style={{ width: "100%", padding: "10px", borderRadius: "6px" }}
      >
         <option value="" disabled>Select Co-Ordinator</option>
        <option>Priyanka</option>
        <option>Shoeb</option>
        <option>Shireen</option>
        <option>Arathi</option>
      </select>

      {/* BUTTONS */}
      <div style={{ marginTop: "25px", textAlign: "right" }}>
        <button
          onClick={closeModal}
          style={{
            background: "#eee",
            padding: "10px 18px",
            borderRadius: "6px",
            marginRight: "10px"
          }}
        >
          Cancel
        </button>

       <button
  onClick={handleSaveUpdate}
  disabled={!isUpdateFormValid()}
  style={{
    background: isUpdateFormValid() ? "#1e88e5" : "#ccc",
    color: "white",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: isUpdateFormValid() ? "pointer" : "not-allowed",
    opacity: isUpdateFormValid() ? 1 : 0.7
  }}
>
  Save Update
</button>
      </div>

    </div>
  </div>
)}
        {/* ✅ LATEST UPDATE */}
        <div style={{ background: "#fff", padding: "15px", borderRadius: "8px" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
  Latest Update
  <button className="submit-btn" onClick={openModal}>+ Add Update</button>
</h3>

          {latestUpdate ? (
            <div style={{ background: "#e8f5e9", padding: "10px", borderLeft: "5px solid green" }}>
              🟢 {latestUpdate.status} <br />
              📞 Call Date: {latestUpdate.callDate}<br />
              📅 Next Follow-up: {latestUpdate.followUpDate 
  ? dayjs(latestUpdate.followUpDate).format('DD-MMMM-YYYY').toUpperCase() 
  : ""} <br />
              👤 {latestUpdate.coordinator} <br />
              {latestUpdate.remark}
            </div>
          ) : (
            <p>No updates yet</p>
          )}
        </div>

        {/* ✅ HISTORY */}
        <div style={{ marginTop: "20px", background: "#fff", padding: "15px", borderRadius: "8px" }}>
          <h3>
            Follow-up History
            {/* <button className="submit-btn" onClick={openModal} style={{ marginLeft: "10px" }}>
              + Add Update
            </button> */}
          </h3>

         {history.length > 0 ? history.map((item, index) => (
  <div key={index} style={{
    display: "flex",
    marginBottom: "15px"
  }}>

    {/* LEFT DOT + LINE */}
    <div style={{
      width: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <div style={{
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        background: "#1e88e5",
        marginTop: "5px"
      }}></div>

      {index !== history.length - 1 && (
        <div style={{
          width: "2px",
          flex: 1,
          background: "#ccc"
        }}></div>
      )}
    </div>

    {/* RIGHT CONTENT */}
    <div style={{
      background: "#f9f9f9",
      padding: "12px",
      borderRadius: "8px",
      width: "100%",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
    }}>

      <div style={{ fontWeight: "600", color: "#333" }}>
        🟢 {item.status}
      </div>

      <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>
        📞 Call: {item.callDate}
      </div>

      <div style={{ fontSize: "13px", color: "#666" }}>
        📅 Follow-up: {item.followUpDate 
          ? dayjs(item.followUpDate).format('DD-MMMM-YYYY').toUpperCase() 
          : "N/A"}
      </div>

      <div style={{ fontSize: "13px", color: "#666" }}>
        👤 {item.coordinator}
      </div>

      <div style={{
        marginTop: "8px",
        fontSize: "14px",
        color: "#000"
      }}>
        {item.remark}
      </div>

    </div>
  </div>
)) : (
  <p>No history available</p>
)}
        </div>

      </div>
    </div>
  ) : (
                <button 
  className='submit-btn' 
  onClick={handleSubmit} 
  disabled={!isFormValid() || isSubmitting}
>
  {isSubmitting ? "Submitting..." : "Submit"}
</button>
              )}
            </div>
          </div>

        </div>) : (
        <>
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className='course-category'>

                <div className='category'>
                  <div className='category-header'>
                    <p style={{ marginBottom: 0 }}>Register List</p>
                  </div>
                  
                  {/* ADDED: Success and Error Messages */}
                  {successMessage && <p style={{ color: "green", fontWeight: "bold", textAlign: "center", marginTop: "10px" }}>{successMessage}</p>}
                  {errorMessage && <p style={{ color: "red", fontWeight: "bold", textAlign: "center", marginTop: "10px" }}>{errorMessage}</p>}
                  
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
                    
                    {/* ADDED: Time Period Dropdown */}
                    <select
                      className="form-select period-select"
                      onChange={(e) => {
                        // Handle period selection if needed
                        console.log(e.target.value);
                      }}
                      style={{ width: '150px', marginLeft: '10px' }}
                    >
                      <option value="">Select Period</option>
                      <option value="thisWeek">This Week</option>
                      <option value="thisMonth">This Month</option>
                      <option value="thisYear">This Year</option>
                    </select>

                    {/* ADDED: Mode Filter Dropdown */}
                    <select
                      className="form-select mode-select"
                      onChange={(e) => {
                        // Handle mode selection if needed
                        console.log(e.target.value);
                      }}
                      style={{ width: '150px' }}
                    >
                      <option value="">All Modes</option>
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                      <option value="both">Both</option>
                    </select>
                    
                    <button className='filter' onClick={handleDateFilter} >Filter</button>
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
                      
                     {selectedIds.length > 0 && (
  <>
    <button 
      type="button" 
      className="btn-category" 
      onClick={handleBulkDelete}
      style={{ backgroundColor: '#dc3545', marginRight: '10px' }}
    >
      <RiDeleteBin6Line /> Delete Selected ({selectedIds.length})
    </button>
<button 
  type="button" 
  className="btn-category" 
  onClick={handleBulkSendEmail}
  disabled={isBulkSending}
  style={{
    backgroundColor: isBulkSending ? "#ccc" : "#28a745",
    cursor: isBulkSending ? "not-allowed" : "pointer",
    opacity: isBulkSending ? 0.6 : 1
  }}
>
 {isBulkSending 
  ? "Sending..." 
  : `📧 Send Emails (${validSelectedCount})`}
</button>
  </>
)}
                      
                      <button type="button" className="btn-category" onClick={handleAddTrendingCourseClick} >
                        <FiPlus /> Add Student
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </LocalizationProvider>
            <TableContainer component={Paper} >
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    {/* ADDED: Select All Checkbox */}
                    <StyledTableCell align='center'>
                      <Checkbox 
                        checked={selectAll}
                        onChange={handleSelectAll}
                        indeterminate={selectedIds.length > 0 && selectedIds.length < displayedCourse.length}
                      />
                    </StyledTableCell>
                    <StyledTableCell align='center'>S.No.</StyledTableCell>
                    <StyledTableCell align="center">Date of Registration</StyledTableCell>
                    <StyledTableCell align='center'>Mode</StyledTableCell>
                    <StyledTableCell align='center'>Student ID</StyledTableCell>
                    <StyledTableCell align='center'>Student Name</StyledTableCell>
                    <StyledTableCell align='center'>Email</StyledTableCell>
                    <StyledTableCell align="center">Mobile</StyledTableCell>
                    <StyledTableCell align="center">WhatsApp</StyledTableCell>
                    <StyledTableCell align="center">Country</StyledTableCell>
                    {/* <StyledTableCell align="center">Location</StyledTableCell> */}
                    <StyledTableCell align="center">Time Zone</StyledTableCell>
                    {/* <StyledTableCell align="center">Visa Status</StyledTableCell> */}
                    <StyledTableCell align='center'>Entered By</StyledTableCell>
                    <StyledTableCell align='center'>Source</StyledTableCell>
                    {/* <StyledTableCell align='center'>Remark</StyledTableCell> */}
                    {/* <StyledTableCell align='center'>Comment</StyledTableCell> */}
                    <StyledTableCell align='center'>SEO Team</StyledTableCell>
                    <StyledTableCell align='center'>Technology</StyledTableCell>
                    <StyledTableCell align='center'>State/City</StyledTableCell>
                    <StyledTableCell align='center'>Lead Status</StyledTableCell>
                    <StyledTableCell align='center'>Lead Tag</StyledTableCell>
                    <StyledTableCell align='center'>status</StyledTableCell>
                    <StyledTableCell align='center'>Remark</StyledTableCell>
                    <StyledTableCell align='center'>Coordinator</StyledTableCell>
                    <StyledTableCell align='center'>Call Made On</StyledTableCell>
                    <StyledTableCell align='center'>Next Follow Up</StyledTableCell>
                    
                    <StyledTableCell align="center">Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedCourse.length > 0
                    ? displayedCourse.map((row, index) => (
                      <StyledTableRow key={row.student_Id}>
                        {/* ADDED: Individual Checkbox */}
                        <StyledTableCell align='center'>
                          <Checkbox 
                            checked={selectedIds.includes(row.id)}
                            onChange={() => handleSelectOne(row.id)}
                          />
                        </StyledTableCell>
                        <StyledTableCell align="center">{index + 1 + (currentPage - 1) * rowsPerPage}
                        </StyledTableCell> {/* S.No. */}
                        <StyledTableCell align="center">{row.date ? dayjs(row.date).format('MMM-DD-YYYY') : ""}</StyledTableCell>
                        <StyledTableCell align="center">{row.mode}</StyledTableCell>
                        <StyledTableCell align="center">{row.studentId}</StyledTableCell>
                        <StyledTableCell align="left">{row.userName}</StyledTableCell>
                        <StyledTableCell align="left">{row.email}</StyledTableCell>
                        <StyledTableCell align="center">{row.mobile}</StyledTableCell>
                        <StyledTableCell align="center">{row.whatsapp}</StyledTableCell>
                        <StyledTableCell align="center">{row.country}</StyledTableCell>
                        {/* <StyledTableCell align="center">{row.location}</StyledTableCell> */}
                        <StyledTableCell align="center">{row.time_zone}</StyledTableCell>
                        {/* <StyledTableCell align="center">{row.visa_status}</StyledTableCell> */}
                        <StyledTableCell align="center">{row.analyst_name}</StyledTableCell>
                        <StyledTableCell align="center">{row.source}</StyledTableCell>
                        {/* <StyledTableCell align="left" style={{ whiteSpace: 'wrap' }}>{row.remarks}</StyledTableCell> */}
                        {/* <StyledTableCell align="left" style={{ whiteSpace: 'wrap' }}>{row.comments}</StyledTableCell> */}
                        <StyledTableCell align="center">{row.seoTeam}</StyledTableCell>
                        <StyledTableCell align="center">{row.course_name}</StyledTableCell>
                        <StyledTableCell align="center">{row.stateCity}</StyledTableCell>
                        <StyledTableCell align="center">{row.leadStatus}</StyledTableCell>
                        <StyledTableCell align="center">{row.leadTag}</StyledTableCell>
                        <StyledTableCell align="center">{row.status}</StyledTableCell>
                        <StyledTableCell align="center">{row.remark}</StyledTableCell>
                        <StyledTableCell align="center">{row.remarkCoordinator}</StyledTableCell>
                        <StyledTableCell align="center">{formatDate(row.callMadeOn)}</StyledTableCell>
                        <StyledTableCell align="center">
  {formatDate(row.lastCallMadeOn)}
</StyledTableCell>
                        <StyledTableCell align="center">
                          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                            <FaEdit className="edit" onClick={() => handleClickOpen(row)} />
                            <RiDeleteBin6Line className="delete" onClick={() => handleDeleteConfirmation(row.id)} />
                               <button
  disabled={
    !row.remark || 
    row.remark.trim() === "" || 
    sendingId === row.studentId
  }
  style={{
    background: (!row.remark || row.remark.trim() === "" || sendingId === row.studentId)
      ? "#ccc"
      : "#28a745",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: (!row.remark || row.remark.trim() === "" || sendingId === row.studentId)
      ? "not-allowed"
      : "pointer",
    opacity: (!row.remark || row.remark.trim() === "" || sendingId === row.studentId)
      ? 0.6
      : 1
  }}
  onClick={() => handleSendEmail(row.studentId)}
>
  {sendingId === row.studentId ? "Sending..." : "Send Email"}
</button>
                          </div>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                    : (
                      <StyledTableRow>
                        {/* UPDATED: Changed colSpan from 17 to 18 to include checkbox column */}
                        <StyledTableCell colSpan={18} align="center">
                          No data available.
                        </StyledTableCell>
                      </StyledTableRow>
                    )}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* REMOVED: Duplicate messages (already shown above) */}
            {/* {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>} */}
            
            <div className='pagination-container'>
              <AdminPagination
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                totalRows={filteredStudent.length}
                onPageChange={handlePageChange}
              />
            </div>
            {message && <div className="success-message">{message}</div>}

          </div>
        </>)}
    </>);
}