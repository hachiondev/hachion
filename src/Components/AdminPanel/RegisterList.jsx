import  React, { useEffect } from 'react';
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
  const [searchTerm,setSearchTerm]=useState("")
    const [formMode, setFormMode] = useState("Add");
    const [showAddCourse, setShowAddCourse] = useState(false);
    const[registerStudent,setRegisterStudent]=useState([]);
    const[filteredStudent,setFilteredStudent]=useState([])
    const [open, setOpen] = React.useState(false);
    const currentDate = new Date().toISOString().split('T')[0];
    const[message,setMessage]=useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
        
    const [editedData, setEditedData] = useState({student_Id:"",userName:"",email:"",mobile:"",location:"",country:"",time_zone:"",analyst_name:"",source:"",remarks:"",comments:"",date:currentDate,visa_status:"",mode:""});
    const [mobileError, setMobileError] = useState("");
const [anchorElCountry, setAnchorElCountry] = useState(null);
const [selectedCountry, setSelectedCountry] = useState({
  name: '',
  code: '',
  flag: ''
});
    const [studentData, setStudentData] = useState({
        student_Id:"",
        userName:"",
        email:"",
        mobile:"",
        country:"",
        location:"",
       time_zone:"",
       analyst_name:"",
       source:"",
       remarks:"",
       comments:"",
       date:currentDate,
            visa_status:"",
            mode:"Offline",
         });
        
         const [countries, setCountries] = useState([]);

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

         const displayedCourse = filteredStudent.slice(
          (currentPage - 1) * rowsPerPage,
          currentPage * rowsPerPage
        );
         const handleReset=()=>{
            setStudentData({
                student_Id:"",
        userName:"",
        email:"",
        mobile:"",
        country:"",
        location:"",
       time_zone:"",
       analyst_name:"",
       source:"",
       remarks:"",
       comments:"",
       date:currentDate,
        visa_status:"",
        mode: "offline"
                 });
        
         }
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

    useEffect(() => {
      fetch("https://restcountries.com/v3.1/all?fields=name,idd,cca2")
        .then(res => res.json())
        .then(data => {
          const formattedCountries = data
            .filter(c => c.idd?.root) 
            .map(c => {
              const code = c.idd.root + (c.idd.suffixes?.[0] || "");
              return {
                name: c.name.common,
                code,
                flag: c.cca2 
              };
            })
            .sort((a, b) => a.name.localeCompare(b.name)); 
    
          setCountries(formattedCountries);
        })
        .catch(err => {
          console.error("Failed to load countries:", err);
        });
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
              const response = await axios.get('https://api.hachion.co/registerstudent');
              setRegisterStudent(response.data); 
              setFilteredStudent(response.data);
          } catch (error) {
              console.error("Error fetching student list:", error.message);
          }
      };
      fetchStudent();
      setFilteredStudent(registerStudent)
  }, []); 

    
  
      const handleDateFilter = () => {
        const filtered = registerStudent.filter((item) => {
          const regDate = new Date(item.date);
          const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
          const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

      const matchSearch =
      (item.studentId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.userName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.mobile || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.country || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.location || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.analyst_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.source || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.mode || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                `https://api.hachion.co/registerstudent/update/${editedData.student_Id}`,editedData
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
          const response = await axios.delete(`https://api.hachion.co/registerstudent/delete/${id}`); 
          console.log("Register Student deleted successfully:", response.data); 
          setRegisterStudent((prev) => prev.filter((s) => s.id !== id));
setFilteredStudent((prev) => prev.filter((s) => s.id !== id));
          setSuccessMessage("✅ Student deleted successfully.");
    setErrorMessage("");
        } catch (error) { 
          console.error("Error deleting Student:", error); 
           setErrorMessage("❌ Failed to delete student. Please try again.");
    setSuccessMessage("");
        } }; 
       useEffect(() => {
    const filtered = registerStudent.filter(registerStudent =>
        registerStudent.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registerStudent.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registerStudent.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registerStudent.mobile?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registerStudent.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registerStudent.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registerStudent.analyst_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registerStudent.source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registerStudent.mode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registerStudent.date?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registerStudent.visa_status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudent(filtered);
}, [searchTerm, registerStudent]);

    const handleClickOpen = (row) => {
  setFormMode("Edit");


  const [codePart, ...numberParts] = (row.mobile || "").split(" ");
  const numberPart = numberParts.join(" ");

  const matchedCountry = countries.find(c => c.code === codePart);
  if (matchedCountry) {
    setSelectedCountry(matchedCountry);
  }

  setStudentData({
    ...row,
    mobile: numberPart, 
  });

  setShowAddCourse(true);
};
    const handleUpdate = async () => {
     
       try {
    const finalMobile = `${selectedCountry.code} ${studentData.mobile}`;

    const updatedData = {
      ...studentData,
      mobile: finalMobile,
    };

    const response = await axios.put(
      `https://api.hachion.co/registerstudent/update/${studentData.id}`,
      updatedData
    );

        setRegisterStudent((prev) =>
          prev.map((s) => s.id === studentData.id ? response.data : s)
        );
        setMessage("Student updated successfully!");
        setShowAddCourse(false);
        setFormMode("Add");
        handleReset();
      } catch (error) {
        console.error("Error updating student:", error.message);
        setMessage("Error updating student.");
      }
    };

    
    const handleChange = (e) => {
        const { name, value } = e.target;
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
      const handleSubmit = async (e) => {
  e.preventDefault();
const mobileNumber = studentData.mobile?.trim();
  const countryCode = selectedCountry.code?.trim() || "";

  
  if (!mobileNumber || mobileNumber.length !== 10) {
    setErrorMessage("❌ Mobile number must be exactly 10 digits.");
    setSuccessMessage("");
    return;
  }

  const finalMobile = `${countryCode} ${mobileNumber}`;
  const currentDate = new Date().toISOString().split("T")[0];

  const dataToSubmit = {
    ...studentData,
    mobile: finalMobile, 
    date: currentDate,
  };
  console.log("Data being sent:", dataToSubmit);

  try {
    const response = await axios.post("https://api.hachion.co/registerstudent/add", dataToSubmit);
    if (response.status === 200) {
      setSuccessMessage("✅ Student added successfully.");
      setErrorMessage("");
      setStudentData(dataToSubmit);
      handleReset();
    }
  } catch (error) {
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

    const handleAddTrendingCourseClick = () => {setShowAddCourse(true);
    }
    const isFormValid = () => {
  const {
    userName,
    email,
    mobile,
    country,
    location,
    visa_status,
    time_zone,
    analyst_name,
    source,
    remarks,
    comments,
  } = studentData;

  return (
    userName.trim() &&
    email.trim() &&
    mobile.trim() &&
    country.trim() &&
    location.trim() &&
    visa_status !== "Select Visa Status" &&
    time_zone.trim() &&
    analyst_name.trim() &&
    source !== "Select" &&
    remarks.trim().length >= 15 &&
    comments.trim()
  );
};

  return (
    
    <>  
     {showAddCourse ?  (      
       <div className='course-category'>
        <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
          <li className="breadcrumb-item">
                <a href="#!" onClick={() => setShowAddCourse(false)}>Register List</a> <MdKeyboardArrowRight />
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
         <label for="inputEmail4" class="form-label">Student Name</label>
         <input type="text" class="schedule-input" id="inputEmail4" name="userName"
  value={studentData.userName}
  onChange={handleChange}/>
       </div>
       <div class="col">
         <label for="inputPassword4" class="form-label">Email</label>
         <input type="email" class="schedule-input" id="inputPassword4" placeholder='abc@gmail.com'
         name="email"
         value={studentData.email}
         onChange={handleChange}/>
       </div>
       <div class="col">
         <label for="inputPassword4" class="form-label">Location</label>
         <input type="text" class="schedule-input" id="inputPassword4"  name="location"
         value={studentData.location}
         onChange={handleChange}/>
       </div>
       </div>
       <div className="course-row">
       
      <div className="col">
        <label className="form-label">Country <span className="star">*</span></label>
        <Select 
          options={countries.map((country) => ({
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
              country: selected.value
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
              height: '50px',
            }),
            valueContainer: (base) => ({
              ...base,
              height: '50px',
              padding: '0 8px',
            }),
            indicatorsContainer: (base) => ({
              ...base,
              height: '50px',
            }),
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
            onBlur={handleMobileBlur}
            style={{
              paddingLeft: selectedCountry.code ? `${selectedCountry.code.length * 10 + 20}px` : '10px',
              // height: '38px',
              fontSize: '16px',
              fontFamily: 'inherit',
            }}
          />

          {mobileError && (
            <small style={{ color: 'red', marginTop: '4px', display: 'block' }}>{mobileError}</small>
          )}
        </div>
      </div>
       <div class="col">
         <label for="inputState" class="form-label">Time Zone</label>
         <input type="text" class="schedule-input"
         name="time_zone" value={studentData.time_zone} onChange={handleChange}/>
       </div>
       </div>
       <div className="course-row">
         <div class="col">
         <label for="inputState" class="form-label">Entered by</label>
         <input type="text" class="schedule-input"
         name="analyst_name" value={studentData.analyst_name} onChange={handleChange}/>
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
         <label for="inputState" class="form-label">Source of Enquiry</label>
         <select id="inputState" class="form-select" name="source" value={studentData.source} onChange={handleChange}>
           <option selected>Select</option>
           <option>Linkedin</option>
           <option>Instagram</option>
           <option>Facebook</option>
           <option>Twitter</option>
           <option>Other</option>
         </select>
       </div>
       {/* <div class="col">
         <label for="inputState" class="form-label">Course Name</label>
         <select id="inputState" class="form-select" name='course_name' value={studentData.course_name} onChange={handleChange}>
         <option value="" disabled>
          Select Course
        </option>
        {course.map((curr) => (
          <option key={curr.id} value={curr.courseName}>
            {curr.courseName}
          </option>
        ))}
   
         </select>
       </div> */}
       </div>
       <div className='row'>
       <div class="mb-3">
       <label for="exampleFormControlTextarea1" class="form-label">Remarks</label>
       <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"
       name='remarks' value={studentData.remarks} onChange={handleChange}></textarea>
     </div>
     {studentData.remarks.trim().length > 0 && studentData.remarks.trim().length < 15 && (
    <p style={{ color: "red", fontSize: "0.9rem" }}>
      Remarks must be at least 15 characters.
    </p>
  )}
     <div class="mb-3">
       <label for="exampleFormControlTextarea1" class="form-label">Comments</label>
       <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"
       name='comments' value={studentData.comments} onChange={handleChange}></textarea>
     </div>
     </div>
           {/* <RadioGroup
             row
             aria-labelledby="demo-row-radio-buttons-group-label"
             name="row-radio-buttons-group"
           >
             <FormControlLabel value="female" control={<Radio />} label="Send details via only email" />
             <FormControlLabel value="male" control={<Radio />} label="Send details via only whatsapp" />
             <FormControlLabel value="male" control={<Radio />} label="Send details via email and whtsapp" />
           
           </RadioGroup> */}
           {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}
        <div className="course-row">
        {formMode === "Edit" ? (
        <button className='submit-btn' onClick={handleUpdate}>
          Update
        </button>
      ) : (
        <button className='submit-btn' onClick={handleSubmit} disabled={!isFormValid()}>
          Submit
        </button>
      )}
      </div>
     </div>
        
     </div>):(
        <>
<div>
   <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='course-category'>
       
        <div className='category'>
          <div className='category-header'>
            <p style={{ marginBottom: 0 }}>Register List</p>
          </div>
          <div className='date-schedule'>
            Start Date
            <DatePicker 
    selected={startDate} 
    onChange={(date) => setStartDate(date)} 
    isClearable 
    sx={{
      '& .MuiIconButton-root':{color: '#00aeef'}
   }}/>
            End Date
            <DatePicker 
    selected={endDate} 
    onChange={(date) => setEndDate(date)} 
    isClearable 
    sx={{
      '& .MuiIconButton-root':{color: '#00aeef'}
   }}
  />
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
                  onChange={(e) => setSearchTerm(e.target.value)}/>
                <button className="btn-search" type="submit"  ><IoSearch style={{ fontSize: '2rem' }} /></button>
              </div>
              <button type="button" className="btn-category" onClick={handleAddTrendingCourseClick} >
                <FiPlus /> Add Student
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
            <StyledTableCell align='center'>
              <Checkbox />
            </StyledTableCell>
            <StyledTableCell align='center'>S.No.</StyledTableCell>
            <StyledTableCell align="center">Date of Registration</StyledTableCell>
            <StyledTableCell align='center'>Mode</StyledTableCell>
            <StyledTableCell align='center'>Student ID</StyledTableCell>
            <StyledTableCell align='center'>Student Name</StyledTableCell>
            <StyledTableCell align='center'>Email</StyledTableCell>
            <StyledTableCell align="center">Mobile</StyledTableCell>
            <StyledTableCell align="center">Country</StyledTableCell>
            <StyledTableCell align="center">Location</StyledTableCell>
            <StyledTableCell align="center">Time Zone</StyledTableCell>
            <StyledTableCell align="center">Visa Status</StyledTableCell>
            <StyledTableCell align='center'>Entered By</StyledTableCell>
            <StyledTableCell align='center'>Source</StyledTableCell>
            <StyledTableCell align='center'>Remark</StyledTableCell>
            <StyledTableCell align='center'>Comment</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {displayedCourse.length > 0
    ? displayedCourse.map((row, index) => (
    <StyledTableRow key={row.student_Id}>
      <StyledTableCell align='center'>
        <Checkbox />
      </StyledTableCell>
      <StyledTableCell align="center">{index + 1 + (currentPage - 1) * rowsPerPage}
        </StyledTableCell> {/* S.No. */}
         <StyledTableCell align="center">{row.date ? dayjs(row.date).format('MM-DD-YYYY') : ""}</StyledTableCell>

         <StyledTableCell align="center">{row.mode}</StyledTableCell>        
        <StyledTableCell align="center">{row.studentId}</StyledTableCell>
      <StyledTableCell align="left">{row.userName}</StyledTableCell>
      <StyledTableCell align="left">{row.email}</StyledTableCell>
      <StyledTableCell align="center">{row.mobile}</StyledTableCell>
      <StyledTableCell align="center">{row.country}</StyledTableCell>
        <StyledTableCell align="center">{row.location}</StyledTableCell>
        <StyledTableCell align="center">{row.time_zone}</StyledTableCell>
        <StyledTableCell align="center">{row.visa_status}</StyledTableCell>
        <StyledTableCell align="center">{row.analyst_name}</StyledTableCell>
        <StyledTableCell align="center">{row.source}</StyledTableCell>
        <StyledTableCell align="left" style={{ whiteSpace: 'wrap' }}>{row.remarks}</StyledTableCell>
        <StyledTableCell align="left" style={{ whiteSpace: 'wrap' }}>{row.comments}</StyledTableCell> 
      <StyledTableCell align="center">
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
        <FaEdit className="edit" onClick={() => handleClickOpen(row)} />
        <RiDeleteBin6Line className="delete" onClick={() => handleDeleteConfirmation(row.id)} />
        </div>
      </StyledTableCell>
    </StyledTableRow>
  ))
  : (
    <StyledTableRow>
      <StyledTableCell colSpan={17} align="center">
        No data available.
      </StyledTableCell>
    </StyledTableRow>
  )}
</TableBody>
    </Table>
    </TableContainer>
    {successMessage && <p style={{ color: "green", fontWeight: "bold" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}
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

 </> );
}