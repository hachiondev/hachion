  import React, { useState, useRef,useEffect } from 'react';
  import axios from 'axios';
  import Topbar from './Topbar';
  import NavbarTop from './NavbarTop';
  import './Blogs.css';
  import StickyBar from './StickyBar';
  import Footer from './Footer'
  import { useLocation } from 'react-router-dom';
  import { MdKeyboardArrowRight } from 'react-icons/md';
  import logo from '../../Assets/logo.png';
  import Python from '../../Assets/python.png';
  import paymentsuccess from '../../Assets/paymentsuccess.gif';
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

  const EnrollPayment = () => {
    const location = useLocation();
    const { selectedBatchData, enrollText, modeType,  sendEmail,
  sendWhatsApp,
  sendText } = location.state || {};

    const [successMessage, setSuccessMessage] = useState("");
      const [errorMessage, setErrorMessage] = useState("");
    const [studentData, setStudentData] = useState(null);
    const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
    const [mobileNumber, setMobileNumber] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const mobileInputRef = useRef(null);
const [isEnrollDisabled, setIsEnrollDisabled] = useState(false);
const [currency, setCurrency] = useState('USD');
const [exchangeRate, setExchangeRate] = useState(1);
    const [selectedCountry, setSelectedCountry] = useState({
          code: '+1',
          flag: 'US',
          name: 'United States',
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
const batchData = JSON.parse(localStorage.getItem("selectedBatchData")) || {};
  const discount = batchData.discount ?? 0;

    try {
      const response = await axios.post("https://api.hachion.co/capture-order", null, {
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
  const response = await axios.post('https://api.hachion.co/enroll/add', payload);
 
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
    const mobile = profileResponse.data?.mobile || '';
    const batchId = selectedBatchData?.batchId;
    const courseName = selectedBatchData?.schedule_course_name;

    if (!studentId || !batchId || !courseName) {
      alert("Missing required details to proceed with payment.");
      
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

      const orderRes = await axios.post("https://api.hachion.co/razorpay/create-razorpay-order", null, {
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
            
            const captureRes = await axios.post("https://api.hachion.co/razorpay/capture-razorpay", null, {
              params: {
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                signature: razorpay_signature,
                studentId,
                courseName,
                batchId,
                discount: courseData?.discount ?? 0
              }
            });

            // alert(captureRes.data);
            setSuccessMessage("✅ " + captureRes.data);
setErrorMessage("");
          } catch (error) {
            // console.error("❌ Error capturing Razorpay payment:", error);
            // if (error.response) {
            //   console.error("Response:", error.response.data);
            // }
            // alert("Payment verification failed.");
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
  
  alert("Failed to open Razorpay modal.");
}

    } else {
      
      const paypalRes = await axios.post("https://api.hachion.co/create-order", null, {
        params: {
          amount,
          returnUrl
        }
      });
      
      const approvalUrl = paypalRes.data;

      if (approvalUrl.startsWith("https://www.paypal.com")) {
        
        window.location.href = approvalUrl;
      } else {
        
        // alert("Unexpected response: " + approvalUrl);
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

  const navigate = useNavigate();

  const courseData = {
    courseName: "Full Stack Web Development",
    courseImage: Python,
    trainer: "Navya",
    duration: "6 Months",
    mode: "Live Training",
    batchStartDate: "August 15, 2024",
    batchTime: "07:30 PM EST",
  };

  const paymentData = {
    orderId: "#H001",
    paymentMethod: "Credit Card",
    paymentDate: "08-28-2025",
    courseFee: "15000",
    discount: "500",
    gst: "500",
    total: "15000",
    netAmount: "15000"
  };
    return (
      <>
      <div className="enrollpayment">
        <img src={logo} alt="logo" className="enrollpayment-logo" />
        <p>Enrollment Confirmation</p>
        </div>
        <div className='enrollment-details'>
            <div className="input-row">
                <div>
                <button className="EnrollPay-outline-btn" >Download Invoice</button>
                </div>
                <div>
                <button className="EnrollPay-btn" onClick={() => navigate('/userdashboard')}> Go to Dashboard </button>
                </div>
                </div>
      <div className='personal-details'>
          <div className='personal-details-header'>
              <p>1. Payment Confirmation</p>
          </div>
          <div className="payment-success-section">
      <img
        src={paymentsuccess}
        alt="Payment Successful"
        className="payment-success-gif"
      />
      <h3>Payment Successful!</h3>
      <p>You have successfully enrolled in the course.</p>
    </div>
          </div>
            <div className="details-row">
                {/* Student Details */}
                <div className="Pay-details">
                <div className="personal-details-header">
                    <p>2. Student Details</p>
                </div>
                <div className="details-box">
                    <div className="pay-row">
                    <span className="detail-label">Full Name :</span>
                    <span className="detail-value">{studentData?.userName || ''}</span>
                </div>
                <div className="pay-row">
                    <span className="detail-label">Email ID :</span>
                    <span className="detail-value">{studentData?.email || ''}</span>
                </div>
                <div className="pay-row">
                    <span className="detail-label">Mobile Number :</span>
                    <span className="detail-value">{mobileNumber}</span>
                </div>
                <div className="pay-row">
                    <span className="detail-label">Country :</span>
                    <span className="detail-value">{studentData?.country || ''}</span>
                </div>
                </div>
                </div>

                {/* Course Details */}
                <div className="Pay-details">
                <div className="personal-details-header">
                    <p>3. Course Details</p>
                </div>
                <div className="details-box">
                    <div className="pay-row">
                    <span className="detail-label">Course Name :</span>
                    <span className="detail-value">
                <img
                  src={courseData.courseImage}
                  alt="Course"
                  style={{ width: "40px", height: "40px", marginRight: "10px" }}
                />
                {courseData.courseName}
                </span></div>
                <div className="pay-row">
                <span className="detail-label">Trainer : </span>
                    <span className="detail-value">{courseData.trainer}</span>
                    </div>
                <div className="pay-row">
                <span className="detail-label">Duration : </span>
                    <span className="detail-value">{courseData.duration}</span>
                    </div>
                <div className="pay-row">
                <span className="detail-label">Mode : </span>
                    <span className="detail-value">{courseData.mode}</span>
                    </div>
                <div className="pay-row">
                <span className="detail-label">Batch Start Date : </span>
                    <span className="detail-value">{courseData.batchStartDate} @ {courseData.batchTime}</span>
                    </div>
                </div>
                </div>
            </div>
              <div className='personal-details'>
              <div className='personal-details-header'>
                  <p>4. Payment summary</p>
                  </div>
                  <div className='details-box'>
                    <div className="pay-row">
                    <span className="summary-label">Order ID :</span>
                    <span className="detail-value">{paymentData.orderId}</span>
                </div>
                <div className="pay-row">
                    <span className="summary-label">Payment Method :</span>
                    <span className="detail-value">{paymentData.paymentMethod}</span>
                </div>
                <div className="pay-row">
                    <span className="summary-label">Payment Date :</span>
                    <span className="detail-value">{paymentData.paymentDate}</span>
                </div>
                <div className="pay-row">
                    <span className="summary-label">Course Fee :</span>
                    <span className="detail-value">{paymentData.courseFee}</span>
                </div>
                <div className="pay-row">
                    <span className="summary-label">Discount(%) :</span>
                    <span className="detail-value">{paymentData.discount}</span>
                </div>
                <div className="pay-row">
                    <span className="summary-label">GST(18%) :</span>
                    <span className="detail-value">{paymentData.gst}</span>
                </div>
                <div className="pay-row">
                    <span className="summary-label">Total :</span>
                    <span className="detail-value">{paymentData.total}</span>
                </div>
                <TableRow className="net-amount">
                <TableCell className="net-amount-left">Net Payable amount:</TableCell>
                <TableCell align="right" className="net-amount-right">
                  {paymentData.netAmount}
                </TableCell>
                </TableRow>
                </div>
                </div>
                <div className="details-row" style={{textAlign: 'center'}}>
                <p>A confirmation email has been sent to :
                <strong>{studentData?.email || ''}</strong>
                </p>
                </div>
                <div className="input-row">
                <div>
                <button className="EnrollPay-outline-btn" onClick={() => navigate('/')}>Go to Home</button>
                </div>
                <div>
                <button className="EnrollPay-btn" onClick={() => navigate('/coursedetails')}> Browse Courses </button>
                </div>
                </div>
      </div>
      </>
    )
  }

  export default EnrollPayment