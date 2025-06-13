  import React, { useState, useRef,useEffect } from 'react';
  import axios from 'axios';
  import Topbar from './Topbar';
  import NavbarTop from './NavbarTop';
  import './Blogs.css';
  import EnrollmentTable from './EnrollmentTable';
  import TextField from '@mui/material/TextField';
  
  import StickyBar from './StickyBar';
  import Footer from './Footer'
  import { AiFillCaretDown } from 'react-icons/ai';
  import { Menu, MenuItem, Button } from '@mui/material';
  import Flag from 'react-world-flags';
  import { useFormik } from 'formik';
  import { LoginSchema } from '../Schemas';
  import { useLocation } from 'react-router-dom';

  
  import { useParams } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

  const initialValues = {
    name: "",
    email: "",
    number:"",
    country:""
  };

  const Enrollment = () => {
    const location = useLocation();
    const { selectedBatchData, enrollText, modeType } = location.state || {};

  const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [successMessage, setSuccessMessage] = useState("");
      const [errorMessage, setErrorMessage] = useState("");
    const [studentData, setStudentData] = useState(null);
    const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
    const [mobileNumber, setMobileNumber] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const mobileInputRef = useRef(null);
    const { courseName } = useParams(); 
const [courseData, setCourseData] = useState(null);
const [loading, setLoading] = useState(true);
const [selectedValue, setSelectedValue] = useState('a');

    const [selectedCountry, setSelectedCountry] = useState({
          code: '+1',
          flag: 'US',
          name: 'United States',
        });
    const { values, errors, handleBlur, touched, handleChange, handleSubmit } = useFormik({
      initialValues: initialValues,
      validationSchema: LoginSchema,
      onSubmit: (values) => {
        console.log(values);
      }
    });

 useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");
    const orderId = urlParams.get("token"); 

      if (status === "success" && orderId) {
    handleCaptureOrder(orderId);
  } else if (status === "cancel") {
    setErrorMessage("❌ Payment was cancelled.");
    setSuccessMessage("");
  }
}, []);
  
  const handleCaptureOrder = async (orderId) => {
    const studentId = localStorage.getItem("studentId");
    const courseName = localStorage.getItem("courseName");
    const batchId = localStorage.getItem("batchId");

    if (!studentId || !courseName || !batchId) {
      alert("Missing payment info. Please try again.");
      return;
    }

    try {
      const response = await axios.post("https://api.hachion.co/capture-order", null, {
        params: {
          orderId,
          studentId,
          courseName,
          batchId,
        },
      });

      console.log("Capture Order Response:", response.data);
      
      localStorage.removeItem("studentId");
      localStorage.removeItem("courseName");
      localStorage.removeItem("batchId");

      setSuccessMessage("✅ Payment successful! You are now enrolled.");
      setErrorMessage("");
    } catch (error) {
      console.error("Error capturing order:", error);
      setSuccessMessage("");
      setErrorMessage("❌ Failed to complete payment.");
    }
  };

    const countries = [
      { name: 'India', code: '+91', flag: 'IN' },
      { name: 'United States', code: '+1', flag: 'US' },
      { name: 'United Kingdom', code: '+44', flag: 'GB' },
      { name: 'Thailand', code: '+66', flag: 'TH' },
      { name: 'Canada', code: '+1', flag: 'CA' },
      { name: 'Australia', code: '+61', flag: 'AU' },
      { name: 'Germany', code: '+49', flag: 'DE' },
      { name: 'France', code: '+33', flag: 'FR' },
      { name: 'United Arab Emirates', code: '+971', flag: 'AE' },
      { name: 'Qatar', code: '+974', flag: 'QA' },
      { name: 'Japan', code: '+81', flag: 'JP' },
      { name: 'China', code: '+86', flag: 'CN' },
      { name: 'Russia', code: '+7', flag: 'RU' },
      { name: 'South Korea', code: '+82', flag: 'KR' },
      { name: 'Brazil', code: '+55', flag: 'BR' },
      { name: 'Mexico', code: '+52', flag: 'MX' },
      { name: 'South Africa', code: '+27', flag: 'ZA' },
      { name: 'Netherlands', code: '+31', flag: 'NL' }
    ];

    const defaultCountry = countries.find((c) => c.flag === "US");
    
        
        useEffect(() => {
          fetch("https://ipwho.is/")
            .then((res) => res.json())
            .then((data) => {
              const userCountryCode = data?.country_code;
              const matchedCountry = countries.find((c) => c.flag === userCountryCode);
              if (matchedCountry) {
                setSelectedCountry(matchedCountry);
              }
            })
            .catch(() => {
            
            });
        }, []);

    const handleCountrySelect = (country) => {
      setSelectedCountry(country);
      closeMenu();
      mobileInputRef.current?.focus();
    };

    const openMenu = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
      setAnchorEl(null);
    };

    useEffect(() => {
  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://api.hachion.co/courses/all');

      const matchedCourse = response.data.find(
        (c) => c.courseName.toLowerCase().replace(/\s+/g, '-') === courseName?.toLowerCase().replace(/\s+/g, '-')
      );

      if (matchedCourse) {
        setCourseData(matchedCourse);
      } else {
        console.error("Course not found.");
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchCourseData();
}, [courseName]);

const handleRadioChange = (event) => {
  setSelectedValue(event.target.value);
};
    useEffect(() => {
      const fetchStudentDetails = async () => {
        const user = JSON.parse(localStorage.getItem('loginuserData'));
        const email = user?.email;

        if (!email) return;

        try {
          const response = await axios.get('https://api.hachion.co/api/v1/user/students');
          const allStudents = response.data;

          const matchedStudent = allStudents.find((student) => student.email === email);

          if (matchedStudent) {
            setStudentData(matchedStudent);
            setMobileNumber(matchedStudent.mobile || '');
          }
        } catch (err) {
          console.error('Error fetching student data:', err);
        }
      };

      fetchStudentDetails();
    }, []);

  const saveEnrollment = async () => {
    const user = JSON.parse(localStorage.getItem('loginuserData')) || null;

    if (!user || !user.email) {
      const currentPath = window.location.pathname + window.location.search;
      localStorage.setItem('redirectAfterLogin', currentPath);
      setShowRegisterPrompt(true);
      return;
    }

    setShowRegisterPrompt(false);
    setSuccessMessage("");  
    setErrorMessage("");

    const userEmail = user.email;
    const userName = user.name || '';
    const userMobile = user.mobile || '';

    let studentId = '';
    let mobile = '';

    try {
      
      const profileResponse = await axios.get(`https://api.hachion.co/api/v1/user/myprofile`, {
        params: { email: userEmail },
      });

      if (profileResponse.data && profileResponse.data.studentId) {
        studentId = profileResponse.data.studentId;
        mobile = profileResponse.data.mobile || '';
      } else {
        setErrorMessage("❌ Unable to find your student ID.");
        return;
      }
    } catch (error) {
      console.error('Error fetching studentId:', error);
      setErrorMessage("❌ Unable to fetch your student ID. Please try again later.");
      return;
    }

    const payload = {
      name: userName,
      studentId: studentId,
      email: user.email,
      mobile: mobile || '',
      course_name: selectedBatchData.schedule_course_name,
      enroll_date: selectedBatchData.schedule_date,
      week: selectedBatchData.schedule_week,
      time: selectedBatchData.schedule_time,
      amount: 0,
      mode: selectedBatchData.schedule_mode,
      type: 'Live Class',
      trainer: selectedBatchData.trainer_name,
      completion_date: selectedBatchData.schedule_duration || '',
      meeting_link: selectedBatchData.meeting_link || '',
      resendCount: 0,
      batchId: selectedBatchData.batchId
    };

    try {
      const response = await axios.post('https://api.hachion.co/enroll/add', payload);

      if (response.data.status === 201) {
        setSuccessMessage("✅ Registered Successfully.");
        setErrorMessage("");
      } else {
        setSuccessMessage("✅ Registered Successfully.");  
        setErrorMessage("");
      }
    } catch (error) {
      console.error('Error during enrollment:', error);
      setSuccessMessage("");
      setErrorMessage("❌ Something went wrong during registration. Please try again.");
    }
  };

  // const handlePayment = async () => {
  //     try {
  //       // const amount = courseData.total || "N/A";
  //       const amount = 1.00;
  
  //       const response = await axios.post("https://api.hachion.co/create-order", null, {
  //         params: { amount: amount }
  //       });
  
  //       const approvalUrl = response.data;
  
  //        if (approvalUrl.startsWith("https://www.paypal.com")) {
          
  //         window.location.href = approvalUrl;
  //       } else {
  //         alert("Unexpected response: " + approvalUrl);
  //       }
  //     } catch (error) {
  //       console.error("Error creating order:", error);
  //       alert("Failed to start payment. Please try again.");
  //     }
  //   };
// const handlePayment = async () => {
//   try {
//     const amount = 1.00;

//     const user = JSON.parse(localStorage.getItem('loginuserData')) || null;

//     if (!user || !user.email) {
//       alert("Please log in before making payment.");
//       return;
//     }

//     const userEmail = user.email;

//     const profileResponse = await axios.get("https://api.hachion.co/api/v1/user/myprofile", {
//       params: { email: userEmail }
//     });

//     const studentId = profileResponse.data?.studentId;
//     const batchId = selectedBatchData?.batchId;
//     const courseName = selectedBatchData?.schedule_course_name;

//     if (!studentId || !batchId || !courseName) {
//       alert("Missing required details to proceed with payment.");
//       return;
//     }

//     // Store temporarily in localStorage
//     localStorage.setItem("studentId", studentId);
//     localStorage.setItem("courseName", courseName);
//     localStorage.setItem("batchId", batchId);

//     const response = await axios.post("https://api.hachion.co/create-order", null, {
//       params: { amount }
//     });

//     const approvalUrl = response.data;

//     if (approvalUrl.startsWith("https://www.paypal.com")) {
//       window.location.href = approvalUrl;
//     } else {
//       alert("Unexpected response: " + approvalUrl);
//     }
//   } catch (error) {
//     console.error("Error creating order:", error);
//     alert("Failed to start payment.");
//   }
// };
// const handleCaptureOrder = async () => {
//   const urlParams = new URLSearchParams(window.location.search);
//   const orderId = urlParams.get("token");

//   const studentId = localStorage.getItem("studentId");
//   const courseName = localStorage.getItem("courseName");
//   const batchId = localStorage.getItem("batchId");

//   if (!orderId || !studentId || !courseName || !batchId) {
//     alert("Missing required details to capture order.");
//     return;
//   }

//   try {
//     const response = await axios.post("https://api.hachion.co/capture-order", null, {
//       params: {
//         orderId,
//         studentId,
//         courseName,
//         batchId
//       }
//     });

//     alert(response.data); // Show success or failure message

//     // Clear localStorage
//     localStorage.removeItem("studentId");
//     localStorage.removeItem("courseName");
//     localStorage.removeItem("batchId");
//   } catch (error) {
//     console.error("Capture error:", error);
//     alert("Failed to capture order.");
//   }
// };

const handlePayment = async () => {
  try {
    const amount = 1.00;

    const user = JSON.parse(localStorage.getItem('loginuserData')) || null;
    if (!user || !user.email) {
      alert("Please log in before making payment.");
      return;
    }

    const userEmail = user.email;

    const profileResponse = await axios.get("https://api.hachion.co/api/v1/user/myprofile", {
      params: { email: userEmail }
    });

    const studentId = profileResponse.data?.studentId;
    const batchId = selectedBatchData?.batchId;
    const courseName = selectedBatchData?.schedule_course_name;

    if (!studentId || !batchId || !courseName) {
      alert("Missing required details to proceed with payment.");
      return;
    }

    
    localStorage.setItem("studentId", studentId);
    localStorage.setItem("courseName", courseName);
    localStorage.setItem("batchId", batchId);

  
    const slug = courseName.toLowerCase().replace(/\s+/g, '-');
    // const returnUrl = `http://localhost:3000/enroll/${slug}`;
    const returnUrl = `https://hachion.co/enroll/${slug}`;
console.log("return url :" +returnUrl);

    const response = await axios.post("https://api.hachion.co/create-order", null, {
      params: {
        amount,
        returnUrl
      }
    });

    const approvalUrl = response.data;
    if (approvalUrl.startsWith("https://www.paypal.com")) {
      window.location.href = approvalUrl;
    } else {
      alert("Unexpected response: " + approvalUrl);
    }
  } catch (error) {
    console.error("Error creating order:", error);
    alert("Failed to start payment.");
  }
};
    return (
      <>
      <Topbar/>
      <NavbarTop/>
      <div className='enrollment'>
          <p>Enrollment Details</p>
      </div>
      <div className='enrollment-details'>
      <div className='personal-details'>
          <div className='personal-details-header'>
              <p>1. Personal Details</p>
          </div>
        
          <form className='details'>
        <div className='input-row'>
          <div className="col-md-5">
            <label htmlFor="inputName4" className="form-label">
              Full Name<span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              
              placeholder='Enter your full name'
              value={studentData?.userName || ''}
              readOnly
              required
            />
          </div>
          <div className="col-md-5">
            <label htmlFor="inputEmail4" className="form-label">
              Email ID<span className="required">*</span>
            </label>
            <input
              type="email"
              className="form-control"
              
              placeholder='abc@gmail.com'
              value={studentData?.email || ''}
              readOnly
            />
          </div>
        </div>

        <div className='input-row'>
          <div className="col-md-5">
            <label className='form-label'>Mobile Number</label>
            <div className="input-wrapper" style={{ position: 'relative' }}>
          <button
                variant="text"
                onClick={openMenu}
                className='mobile-button'
              >
                <Flag code={selectedCountry.flag} className="country-flag me-1" />
                <span style={{ marginRight: '5px' }}>{selectedCountry.code}</span>
                <AiFillCaretDown />
              </button>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
                {countries.map((country) => (
                  <MenuItem key={country.code} onClick={() => handleCountrySelect(country)}>
                    <Flag code={country.flag} className="country-flag me-2" />
                    {country.name} ({country.code})
                  </MenuItem>
                ))}
              </Menu>
              <input
                type='tel'
                className="form-control"
                ref={mobileInputRef}
                
                placeholder='Enter your mobile number'
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              style={{paddingLeft: '100px' }}/>
            </div>
          </div>

          <div className="col-md-5">
            <label htmlFor="inputCity" className="form-label">
              Country<span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              
              placeholder='Enter your country'
              value={studentData?.country || ''}
              readOnly
              required
            />
          </div>
        </div>
      </form>
    
          </div>
          <div className='personal-details'>
          <div className='personal-details-header'>
              <p>2. Course Details</p>
              </div>
              <div className='enroll-table'>
              <EnrollmentTable/>
              </div>
              <div className='coupon-div'>
              <p>Have a coupon code ?</p>
              <div className='coupon'>
              <TextField
          placeholder='Enter coupon code'
            id="filled-start-adornment"
            className='coupon-field'
            slotProps={{
            
            }}
            variant="filled"
          />
          <button className='apply-btn'>Apply</button>
          </div>
          </div>
              </div>
              <div className='personal-details'>
              <div className='personal-details-header'>
                  <p>3. Order summary</p>
                  </div>
                {/* <TotalOrder/> */}
                {loading ? (
  <div>Loading...</div>
) : courseData ? (
  <TableContainer component={Paper} className="table-container">
    <Table aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell className="table-cell-left">Course Name</TableCell>
          <TableCell align="right" className="table-cell-right">{courseData.courseName}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell className="table-cell-left">Course Fee</TableCell>
          <TableCell align="right" className="table-cell-right">USD {courseData.amount != null ? courseData.amount : 0}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="table-cell-left">% Discount</TableCell>
          <TableCell align="right" className="table-cell-right">{courseData.discount !=null ? courseData.discount : 0}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="table-cell-left">Total</TableCell>
          <TableCell align="right" className="table-cell-right">USD {courseData.total !=null ? courseData.total : 0}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="table-cell-left">Tax</TableCell>
          <TableCell align="right" className="table-cell-right">USD {courseData.tax !=null ? courseData.tax : 0}</TableCell>
        </TableRow>
        <TableRow className="net-amount">
          <TableCell className="net-amount-left">Net Payable amount:</TableCell>
          <TableCell align="right" className="net-amount-right">USD {courseData.total || 0}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
) : (
  <div>No matching course found.</div>
)}
                <div className="input-row">
                
                 {successMessage && (<p style={{ color: "green", fontWeight: "bold", margin: 0 }}>{successMessage}</p>)}
    {errorMessage && (<p style={{ color: "red", fontWeight: "bold", margin: 0 }}>{errorMessage}</p>)}
                <button className="payment-btn" onClick={handlePayment}>Proceed to Pay</button>
                
                <div className="paylater">
                  {successMessage && (<p style={{ color: "green", fontWeight: "bold", margin: 0 }}>{successMessage}</p>)}
    {errorMessage && (<p style={{ color: "red", fontWeight: "bold", margin: 0 }}>{errorMessage}</p>)}
                <button className="payment-btn" onClick={saveEnrollment}>Enroll Now, Pay Later</button>
                <p>(<span className="note">*Note</span> : Payment must be made after the first 3 trial sessions)</p>
                </div>
                </div>
                  </div>
      </div>
      <Footer/>
      <StickyBar/>
      </>
    )
  }

  export default Enrollment