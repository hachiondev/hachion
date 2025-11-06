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
  sendWhatsApp, email,
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
const { courseName } = useParams(); 
 const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState({
    orderId: "",
    paymentMethod: "",
    paymentDate: "",
    courseFee: "",
    discount: "",
    gst: "",
    total: "",
    netAmount: ""
  });
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
    
    const batchId = localStorage.getItem("batchId");

    if (!studentId || !courseName || !batchId) {
      alert("Missing payment info. Please try again.");
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

  const navigate = useNavigate();
  

useEffect(() => {
  const fetchCourse = async () => {
    try {
      setLoading(true);

      let formattedCourseName = courseName;

      formattedCourseName = decodeURIComponent(formattedCourseName);
      formattedCourseName = formattedCourseName.replace(/-/g, " ");      
      formattedCourseName = formattedCourseName
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");

      const response = await axios.get(
        `https://api.test.hachion.co/courses/getByCourseName/${formattedCourseName}`
      );

      

      if (response.data && response.data.length > 0) {
        const course = response.data[0]; 

        const mappedCourse = {
          courseName: course.courseName,
          courseImage: course.courseImage,
          duration: course.numberOfClasses,
          iamount: course.iamount,
          idiscount: course.idiscount,
        };

        setCourseData(mappedCourse);
        
      }
    } catch (err) {
      console.error("Error fetching course:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchCourse();
}, [courseName]);

 useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        
        let courseName = selectedBatchData?.schedule_course_name || "";

        if (!email || !courseName) {
          console.warn("Missing email or courseName, skipping API call");
          return;
        }

        const response = await axios.get(
          `https://api.test.hachion.co/razorpay/getByEmailAndCourse?email=${email}&courseName=${encodeURIComponent(courseName)}`
        );

        let payment = Array.isArray(response.data) && response.data.length > 0
          ? response.data[0]
          : response.data;

        
        if (payment && !payment.paymentMethod && payment.rawResponseJson) {
          try {
            const parsedRaw = JSON.parse(payment.rawResponseJson);
            payment.paymentMethod = parsedRaw.method || null;
          } catch (err) {
            console.error("Error parsing rawResponseJson:", err);
          }
        }
        setPaymentData(payment);
      } catch (error) {
        console.error("Error fetching payment data:", error);
      }
    };

    fetchPaymentData();
  }, [email, selectedBatchData]);

  if (!paymentData) return <p>Loading...</p>;
   if (loading) return <p>Loading...</p>;
  if (!courseData) return <p>No course found</p>;

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
                   src={`https://api.test.hachion.co/${courseData.courseImage}`}
                  alt="Course"
                  style={{ width: "40px", height: "40px", marginRight: "10px" }}
                />
                {selectedBatchData.schedule_course_name}
                </span></div>
                <div className="pay-row">
                <span className="detail-label">Trainer : </span>
                    <span className="detail-value">{selectedBatchData.trainer_name}</span>
                    </div>
                <div className="pay-row">
                <span className="detail-label">Duration : </span>
                    <span className="detail-value">{courseData.duration }</span>
                    </div>
                <div className="pay-row">
                <span className="detail-label">Mode : </span>
                    <span className="detail-value">{selectedBatchData.schedule_mode}</span>
                    </div>
                <div className="pay-row">
                <span className="detail-label">Batch Start Date : </span>
                    <span className="detail-value">{selectedBatchData.schedule_date} @ {selectedBatchData.schedule_time}</span>
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
                    <span className="detail-value">{courseData?.iamount ?? "0"}</span>
                </div>
                <div className="pay-row">
                    <span className="summary-label">Discount(%) :</span>
                    <span className="detail-value">{courseData.idiscount}</span>
                </div>
                <div className="pay-row">
                    <span className="summary-label">GST(18%) :</span>
                    <span className="detail-value">{0}</span>
                </div>
                {/* <div className="pay-row">
                    <span className="summary-label">Total :</span>
                    <span className="detail-value">{}</span>
                </div> */}
                <div className="pay-row">
  <span className="summary-label">Total :</span>
  <span className="detail-value">
    {(
      courseData.iamount -
      (courseData.iamount * courseData.idiscount) / 100
    ).toFixed(2)}
  </span>
</div>
                <TableRow className="net-amount">
                <TableCell className="net-amount-left">Net Payable amount:</TableCell>
                <TableCell align="right" className="net-amount-right">
                  {/* {paymentData.netAmount} */}
                   {(
    courseData.iamount -
    (courseData.iamount * courseData.idiscount) / 100
  ).toFixed(2)}
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