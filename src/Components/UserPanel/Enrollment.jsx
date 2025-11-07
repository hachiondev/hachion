  import React, { useState, useRef,useEffect } from 'react';
  import axios from 'axios';
  import Topbar from './Topbar';
  import NavbarTop from './NavbarTop';
  import './Blogs.css';
  import EnrollmentTable from './EnrollmentTable';
  import TextField from '@mui/material/TextField';
  import StickyBar from './StickyBar';
  import Footer from './Footer'
  import { Dialog, DialogContent } from "@mui/material";
  import { useFormik } from 'formik';
  import { LoginSchema } from '../Schemas';
  import { useLocation } from 'react-router-dom';
  import { MdKeyboardArrowRight } from 'react-icons/md';
  import { Link } from 'react-router-dom';
  import RequestInstallment from "./RequestInstallment";
  import { useParams } from 'react-router-dom';
  import Table from '@mui/material/Table';
  import TableBody from '@mui/material/TableBody';
  import TableCell from '@mui/material/TableCell';
  import TableContainer from '@mui/material/TableContainer';
  import TableHead from '@mui/material/TableHead';
  import TableRow from '@mui/material/TableRow';
  import Paper from '@mui/material/Paper';
  import { useNavigate } from 'react-router-dom';

  const initialValues = {
    name: "",
    email: "",
    number:"",
    country:""
  };

  const Enrollment = () => {
    const [couponData, setCouponData] = useState(null);
const [couponCode, setCouponCode] = useState("");
    const location = useLocation();
    const [openInstallmentPopup, setOpenInstallmentPopup] = useState(false);
    const { selectedBatchData, enrollText, modeType,  sendEmail,
  sendWhatsApp, requestStatus,
  sendText } = location.state || {};
  console.log("location.state:", location.state);
  console.log("requestStatus from location.state:", requestStatus);
  console.log("requestStatus from localStorage:", localStorage.getItem("requestStatus"));
  
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
const [isEnrollDisabled, setIsEnrollDisabled] = useState(false);
const [currency, setCurrency] = useState('USD');
const [exchangeRate, setExchangeRate] = useState(1);
  const navigate = useNavigate();
    const [selectedCountry, setSelectedCountry] = useState({
          code: '+1',
          flag: 'US',
          name: 'United States',
        });

    const { values, errors, handleBlur, touched, handleChange, handleSubmit } = useFormik({
      initialValues: initialValues,
      validationSchema: LoginSchema,
      onSubmit: (values) => {
        
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
      
      setErrorMessage("❌ Missing payment info. Please try again.");
  setSuccessMessage("");
      return;
    }
const batchData = JSON.parse(localStorage.getItem("selectedBatchData")) || {};
  const discount = batchData.discount ?? 0;

    try {
      const response = await axios.post("https://api.test.hachion.co/capture-order", null, {
        params: {
          orderId,
          studentId,
          courseName,
          batchId,
          discount: discount
        },
      });
      
      localStorage.removeItem("studentId");
      localStorage.removeItem("courseName");
      localStorage.removeItem("batchId");
 localStorage.removeItem("selectedBatchData");

      setSuccessMessage("✅ Payment successful! You are now enrolled.");
      setErrorMessage("");
    } catch (error) {
      
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
  fetch("https://api.country.is")
    .then((res) => res.json())
    .then((data) => {
      data.country_code = (data.country || "").toUpperCase();
      const userCountryCode = data?.country_code;
      const matchedCountry = countries.find((c) => c.flag === userCountryCode);
      if (matchedCountry) {
        setSelectedCountry(matchedCountry);
      }
    })
    .catch(() => {});
}, []);


    const handleCountrySelect = (country) => {
      setSelectedCountry(country);
      closeMenu();
      mobileInputRef.current?.focus();
    };

    useEffect(() => {
  if (mobileNumber) {
    const dialCodeMatch = countries.find((c) =>
      mobileNumber.replace(/\s+/g, '').startsWith(c.code)
    );
    if (dialCodeMatch) {
      setStudentData((prev) => ({
        ...prev,
        country: dialCodeMatch.name,
      }));
    }
  }
}, [mobileNumber]);

    const openMenu = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
      setAnchorEl(null);
    };

useEffect(() => {
  const detectCurrency = async () => {
    try {
        const res = await axios.get('https://ipinfo.io?token=9da91c409ab4b2');
        const country = res.data.country || 'US';
        const currencyMap = {
          IN: 'INR', US: 'USD', GB: 'GBP', EU: 'EUR', AE: 'AED',
          AU: 'AUD', CA: 'CAD', JP: 'JPY', CN: 'CNY', TH: 'THB',
          RU: 'RUB', BR: 'BRL', KR: 'KRW', MX: 'MXN', SA: 'SAR', NL: 'EUR',RO: 'RON'
        };

        const userCurrency = currencyMap[country] || 'USD';
        setCurrency(userCurrency);

        if (userCurrency !== 'USD' && userCurrency !== 'INR') {
          const rateRes = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
          const rate = rateRes.data.rates[userCurrency] || 1;
          setExchangeRate(rate);
        }
      } catch (err) {
        
        setCurrency('USD');
        setExchangeRate(1);
      }
    };

  detectCurrency();
}, []);

const getField = (baseField) => {
  const prefixMap = {
    mentoring: 'm',
    self: 's',
    selfqa: 'sq',
    crash: 'c',
    live: '',
  };
  const prefix = prefixMap[modeType || 'live'] || '';
  const keyINR = `i${prefix}${baseField}`;
  const keyUSD = `${prefix}${baseField}`;

  
  if (baseField === 'discount') {
    if (currency === 'INR') {
      return courseData?.[keyINR] ?? 0;
    } else {
      return courseData?.[keyUSD] ?? 0;
    }
  }
  if (currency === 'INR') {
    return courseData?.[keyINR] ?? 0;
  } else if (currency === 'USD') {
    return courseData?.[keyUSD] ?? 0;
  } else {
    const usdValue = courseData?.[keyUSD] ?? 0;
    return (usdValue * exchangeRate).toFixed(2);
  }
};

    useEffect(() => {
  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://api.test.hachion.co/courses/all');

      const matchedCourse = response.data.find(
        (c) => c.courseName.toLowerCase().replace(/\s+/g, '-') === courseName?.toLowerCase().replace(/\s+/g, '-')
      );

      if (matchedCourse) {
        setCourseData(matchedCourse);
      } else {
        
      }
    } catch (error) {
      
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
          const response = await axios.get('https://api.test.hachion.co/api/v1/user/students');
          const allStudents = response.data;

          const matchedStudent = allStudents.find((student) => student.email === email);

          if (matchedStudent) {
            setStudentData(matchedStudent);
            setMobileNumber(matchedStudent.mobile || '');
          }
        } catch (err) {
          
        }
      };

      fetchStudentDetails();
    }, []);

const handleApplyCoupon = async () => {
  try {
    const res = await axios.get(`https://api.test.hachion.co/coupon-code/discount/${couponCode}`);
    if (res.data && Object.keys(res.data).length > 0) {
      const { 
        discountType, 
        discountValue, 
        courses: allowedCourses, 
        countries: allowedCountries, 
        endDate, 
        usageLimit, 
        numberOfHits 
      } = res.data;

      
      if (endDate) {
        const [year, month, day] = endDate.split("-").map(Number);
        const couponEndDate = new Date(year, month - 1, day); 
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (today > couponEndDate) {
                  setErrorMessage("Coupon code is expired");
  setSuccessMessage("");
          setCouponData(null);
          return;
        }
      }

      
      const userCountryName = selectedCountry?.name;
      if (allowedCountries && !allowedCountries.includes(userCountryName)) {
        setErrorMessage("Coupon not valid for your country");
  setSuccessMessage("");
        setCouponData(null);
        return;
      }

      
      if (usageLimit !== null && numberOfHits > usageLimit) {
        setErrorMessage("Coupon usage limit has been reached");
  setSuccessMessage("");
        setCouponData(null);
        return;
      }

      
      const currentCourse = courseData?.courseName;
      if (allowedCourses && !allowedCourses.includes(currentCourse)) {
        setErrorMessage("Coupon not applicable for this course");
  setSuccessMessage("");
        setCouponData(null);
        return;
      }

      
      setCouponData({ discountType, discountValue });
    } else {
      setErrorMessage("Invalid coupon code");
  setSuccessMessage("");
      setCouponData(null);
    }
  } catch (err) {
    console.error("Error applying coupon:", err);
    setErrorMessage("Failed to apply coupon");
  setSuccessMessage("");
  }
};

const baseAmount = Math.round(getField('amount'));
const baseDiscount = getField('discount') || 0;
const baseTotal = Math.round(getField('total'));

let finalDiscount = baseDiscount;
let finalTotal = baseTotal;


if (couponData) {
  const type = couponData.discountType;  
  const value = couponData.discountValue || 0;

  if (type === "percent") {
    finalDiscount += value; 
    finalTotal = baseAmount - (baseAmount * finalDiscount / 100);
  } else if (type === "fixed") {
    finalTotal = baseTotal + value;
    if (finalTotal < 0) finalTotal = 0;
  }
}

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
      const profileResponse = await axios.get(`https://api.test.hachion.co/api/v1/user/myprofile`, {
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
  batchId: selectedBatchData.batchId,
  sendEmail,
  sendWhatsApp,
  sendText
};
try {
  const response = await axios.post('https://api.test.hachion.co/enroll/add', payload);
 
  if (response.status >= 200 && response.status < 300) {
    setSuccessMessage("✅ Registered Successfully.");
    setErrorMessage("");
  
    const allBatchData = JSON.parse(localStorage.getItem('allEnrolledBatches')) || {};
allBatchData[selectedBatchData.schedule_course_name] = selectedBatchData;
localStorage.setItem('allEnrolledBatches', JSON.stringify(allBatchData));

localStorage.setItem('selectedBatchId', selectedBatchData.batchId);
  } else {
    setErrorMessage("❌ Something went wrong during registration. Please try again.");
    setSuccessMessage("");
  }
} catch (error) {
  
  const errorMessage = error?.response?.data;

  if (errorMessage === "This enrollment record already exists for Live Class in the database.") {
    setErrorMessage("❌ You are already enrolled in this Live Class.");
    setIsEnrollDisabled(true); 
  } else {
    setErrorMessage("❌ Something went wrong during registration. Please try again.");
  }

  setSuccessMessage("");
}
  };

useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  document.body.appendChild(script);
  return () => {
    document.body.removeChild(script);
  };
}, []);

const handlePayment = async () => {
   
  try {
    const amount = Math.round(getField('total'));
    // const amount = 1.00;

    const user = JSON.parse(localStorage.getItem('loginuserData')) || null;
    
    if (!user || !user.email) {
      alert("Please log in before making payment.");
      return;
    }

    const userEmail = user.email;
        
    const profileResponse = await axios.get("https://api.test.hachion.co/api/v1/user/myprofile", {
      params: { email: userEmail }
    });

    const studentId = profileResponse.data?.studentId;
    const mobile = profileResponse.data?.mobile || '';
    const batchId = selectedBatchData?.batchId;
    const courseName = selectedBatchData?.schedule_course_name;

    
    if (!studentId || !batchId || !courseName) {
      setErrorMessage("Missing required details to proceed with payment.");
  setSuccessMessage("");
      return;
    }

    localStorage.setItem("studentId", studentId);
    localStorage.setItem("courseName", courseName);
    localStorage.setItem("batchId", batchId);
    localStorage.setItem("selectedBatchData", JSON.stringify({
      ...selectedBatchData,
      discount: courseData?.discount ?? 0 
    }));

    const slug = courseName.toLowerCase().replace(/\s+/g, '-');
    const returnUrl = `https://hachion.co/enroll/${slug}`;
    
    if (mobile.startsWith('+91')) {
      
      const orderRes = await axios.post("https://api.test.hachion.co/razorpay/create-razorpay-order", null, {
        params: { amount }
      });

      const razorpayOrder = orderRes.data;
      const razorpayOrderId = razorpayOrder.id;

      const options = {
        key: "rzp_live_1g4Axfq4KHi3kl",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Hachion",
        description: `Payment for ${courseName}`,
        order_id: razorpayOrderId,
        handler: async function (response) {

          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

          try {
            
            const captureRes = await axios.post("https://api.test.hachion.co/razorpay/capture-razorpay", null, {
              params: {
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                signature: razorpay_signature,
                studentId,
                courseName,
                batchId,
              }
            });
 
       const slug = courseName.toLowerCase().replace(/\s+/g, '-');
    
                   navigate(`/payment/${slug}`, {
              state: {
                selectedBatchData,
                enrollText,
                modeType,
                sendEmail,
                sendWhatsApp,
                sendText,
                email: user.email,
              },
            });

    
            setSuccessMessage("✅ " + captureRes.data);
setErrorMessage("");
          } catch (error) {
            
            console.error("❌ Error capturing Razorpay payment:", error);
const errMsg = error?.response?.data || "❌ Payment verification failed.";
setErrorMessage(errMsg);
setSuccessMessage("");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: mobile.replace('+91', '')
        },
        theme: {
          color: "#3399cc"
        }
      };

     try {
  
  const rzp = new window.Razorpay(options);

  rzp.open();
} catch (err) {
  
  setErrorMessage("Failed to open Razorpay modal.");
    setSuccessMessage("");
}

    } else {
      
      const paypalRes = await axios.post("https://api.test.hachion.co/create-order", null, {
        params: {
          amount,
          returnUrl
        }
      });

      const approvalUrl = paypalRes.data;

      if (approvalUrl.startsWith("https://www.paypal.com")) {
        
        window.location.href = approvalUrl;
      } else {
        
        setErrorMessage("❌ Unexpected PayPal response.");
setSuccessMessage("");
      }
    }

} catch (error) {
  
  if (error instanceof Error) {
  
  } else if (typeof error === "object" && error !== null) {
    
  } else {
   
  }
    setErrorMessage("❌ Failed to start payment.");
setSuccessMessage("");
  }
};

const disallowedModes = ['crash', 'mentoring', 'self', 'selfqa'];
const isDisallowedMode = disallowedModes.includes(modeType);
const courseSlug = courseData?.courseName?.toLowerCase().replace(/\s+/g, '-');

    return (
      <>
      <Topbar/>
      <NavbarTop/>
              <div className='blogs-header'>
                <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                <li className="breadcrumb-item">
        <Link to="/coursedetails">Courses</Link> <MdKeyboardArrowRight />
      </li>
      <li className="breadcrumb-item">
        <Link to="/coursedetails">
          {courseData?.courseCategory}
        </Link> <MdKeyboardArrowRight />
      </li>
      <li className="breadcrumb-item">
         <Link to={`/coursedetails/${courseSlug}`}>
  {courseData?.courseName}
</Link> <MdKeyboardArrowRight />
      </li>
      <li className="breadcrumb-item active" aria-current="page">
       Enroll {courseData?.courseName} 
      </li>
                </ol>
              </nav>
              </div>
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
  <label className="form-label">Mobile Number</label>
  <div className="input-wrapper">
    <input
      type="tel"
      className="form-control"
      ref={mobileInputRef}
      placeholder="Enter your mobile number"
      value={mobileNumber}
      onChange={(e) => setMobileNumber(e.target.value)}
      readOnly
    />
  </div>
</div>
          <div className="col-md-5"> 
  <label htmlFor="inputCity" className="form-label">
    Country<span className="required">*</span>
  </label>
  <input
    type="text"
    className="form-control"
    placeholder="Enter your country"
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
              <div className='details-box'>
              <div className='enroll-table'>
              {/* <EnrollmentTable/> */}
              <EnrollmentTable couponData={couponData} />
              </div>
              <div className='coupon-div'>
              <p>Have a coupon code ?</p>
              
          <div className='coupon'>
  <TextField
    placeholder='Enter coupon code'
    value={couponCode}
    onChange={(e) => setCouponCode(e.target.value)}
    className='coupon-field'
    variant="filled"
  />
  <button className='apply-btn' onClick={handleApplyCoupon}>Apply</button>
</div>
          </div>
              </div>
              </div>
              <div className='personal-details'>
              <div className='personal-details-header'>
                  <p>3. Order summary</p>
                  </div>
                  <div className='details-box'>
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
  <TableCell align="right" className="table-cell-right">
     {Math.round(getField('amount'))}
  </TableCell>
</TableRow>

<TableRow>
  <TableCell className="table-cell-left">% Discount</TableCell>
  <TableCell align="right" className="table-cell-right">
    {/* {getField('discount')} */}
    {finalDiscount}
  </TableCell>
</TableRow>

<TableRow>
  <TableCell className="table-cell-left">Total</TableCell>
  <TableCell align="right" className="table-cell-right">
     {/* {Math.round(getField('total'))} */}
     {Math.round(finalTotal)}
  </TableCell>
</TableRow>

<TableRow>
  <TableCell className="table-cell-left">Tax</TableCell>
  <TableCell align="right" className="table-cell-right">
    {Math.floor(getField('tax'))}
  </TableCell>
</TableRow>
  <TableRow className="net-amount">
  <TableCell className="net-amount-left">Net Payable amount:</TableCell>
  <TableCell align="right" className="net-amount-right">
    {/* {currency} {Math.round(getField('total'))} */}
     {currency} {Math.round(finalTotal)}
  </TableCell>
</TableRow>
</TableBody>

    </Table>
  </TableContainer>
) : (
  <div>No matching course found.</div>
)}
                <div>
                  {successMessage && (<p style={{ color: "green", fontWeight: "bold", margin: 0 }}>{successMessage}</p>)}
                  {errorMessage && (<p style={{ color: "red", fontWeight: "bold", margin: 0 }}>{errorMessage}</p>)}
                                {/* {successMessage && (<p style={{ color: "green", fontWeight: "bold", margin: 0 }}>{successMessage}</p>)}
                  {errorMessage && (<p style={{ color: "red", fontWeight: "bold", margin: 0 }}>{errorMessage}</p>)} */}    
              </div>
                <div className="input-row">
                <button className="payment-btn" onClick={handlePayment}>Proceed to Pay</button>
             {/* <button className="payment-btn"  onClick={() => setOpenInstallmentPopup(true)}>Request for Installments</button> */}
                
                {/* {requestStatus === "rejected" ? (
  <button className="payment-btn" style={{ backgroundColor: "red", cursor: "default" }}>
    Your request has been rejected
  </button>
) : (
  <button className="payment-btn" onClick={() => setOpenInstallmentPopup(true)}>
    Request for Installments
  </button>
)} */}
{/* <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
  <button 
    className="payment-btn" 
    onClick={() => setOpenInstallmentPopup(true)}
  >
    Request for Installments
  </button>

  {requestStatus === "rejected" && (
    <p style={{ color: "red", marginTop: "8px" }}>
      Your request has been rejected
    </p>
  )}
</div> */}
<div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
  <button
    className="payment-btn"
    onClick={() => setOpenInstallmentPopup(true)}
    disabled={requestStatus == null} // disable only if waiting
    style={{
      opacity: requestStatus == null ? 0.6 : 1,
      cursor: requestStatus == null ? "not-allowed" : "pointer",
    }}
  >
    Request for Installments
  </button>

  {requestStatus === "rejected" && (
    <p style={{ color: "red", marginTop: "8px" }}>
      Your request has been rejected
    </p>
  )}

  {requestStatus == null && (
    <p style={{ color: "orange", marginTop: "8px" }}>
      Your request sent to admin. Please wait for approval
    </p>
  )}
</div>


                <div className="paylater">
                <button
                  onClick={saveEnrollment}
                  disabled={isEnrollDisabled || isDisallowedMode}
                className={`enroll-now-btn ${(isEnrollDisabled || isDisallowedMode) ? 'disabled' : ''}`}
                >
                  Enroll Now, Pay Later
                </button>
                <p>(<span className="note">*Note</span> : Payment must be made after the first 3 trial sessions)</p>
                </div>
                </div>
                </div>
                  </div>
      </div>
      <Footer/>
      <StickyBar/>
      <Dialog
        open={openInstallmentPopup}
        onClose={() => setOpenInstallmentPopup(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <RequestInstallment 
            selectedBatchData={selectedBatchData} 
            closeModal={() => setOpenInstallmentPopup(false)}
            courseFee={courseData?.iamount || 0} 
            email={studentData?.email || ''}
            studentId={studentData?.studentId || ''}
            studentName = {studentData?.userName || ''}
            courseData={courseData} 
            mobile={mobileNumber}
          />
        </DialogContent>
      </Dialog>
      </>
    )
  }

  export default Enrollment