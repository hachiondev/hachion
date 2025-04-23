// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const countryToCurrencyMap = {
//   'IN': 'INR',
//   'US': 'USD',
//   'GB': 'GBP',
//   'AU': 'AUD',
//   'CA': 'CAD',
//   'EU': 'EUR'
//   // Add more country codes as needed
// };

// const LiveOnlineFeesRight = ({ enrollText, modeType }) => {
//   const { courseName } = useParams();
//   const navigate = useNavigate();
//   const [fee, setFee] = useState('');
//   const [currency, setCurrency] = useState('USD');
//   const [exchangeRate, setExchangeRate] = useState(1);
//   const [discount, setDiscount] = useState(0);
//   const [discountPercentage, setDiscountPercentage] = useState(0);
//   const [message, setMessage] = useState('');

//   // Fetch Geolocation and Currency
//   useEffect(() => {
//     const fetchGeolocationData = async () => {
//       try {
//         const geoResponse = await axios.get('https://ipinfo.io/json?token=82aafc3ab8d25b');
//         console.log('Geolocation Data:', geoResponse.data);

//         const countryCode = geoResponse.data.country || 'US';
//         const userCurrency = countryToCurrencyMap[countryCode] || 'USD';

//         console.log('Detected Currency:', userCurrency);
//         setCurrency(userCurrency);

//         // Clear old cached rates to ensure fresh data
//         localStorage.removeItem('exchangeRates');

//         const exchangeResponse = await axios.get(`https://api.exchangerate-api.com/v4/latest/USD`);
//         const rates = exchangeResponse.data.rates;
//         localStorage.setItem('exchangeRates', JSON.stringify(rates));

//         const rate = rates[userCurrency] || 1;
//         setExchangeRate(rate);

//         // ✅ Move `fetchCourseAmount()` here to ensure it's called after setting exchangeRate
//         fetchCourseAmount(rate);
//       } catch (error) {
//         console.error('Error fetching geolocation or exchange rate data:', error);
//         setCurrency('USD');
//         fetchCourseAmount(1);  // Default to 1 (USD)
//       }
//     };

//     const fetchCourseAmount = async (rate) => {
//       try {
//         const response = await axios.get('https://api.hachion.co/courses/all');
//         const courses = response.data;

//         const matchedCourse = courses.find(
//           (course) => course.courseName.toLowerCase().replace(/\s+/g, '-') === courseName
//         );

//         if (matchedCourse) {
//           let selectedFee = 0;
//           let originalFee = 0;

//           if (modeType === 'live') {
//             if (enrollText.toLowerCase().includes('demo')) {
//               selectedFee = 0;
//               originalFee = 0;
//             } else {
//               selectedFee = parseFloat(matchedCourse.total) || 0;
//               originalFee = parseFloat(matchedCourse.amount) || 0;
//             }
//           } else {
//             switch (modeType) {
//               case 'mentoring':
//                 selectedFee = parseFloat(matchedCourse.mtotal) || 0;
//                 originalFee = parseFloat(matchedCourse.mamount) || 0;
//                 break;
//               case 'self':
//                 selectedFee = parseFloat(matchedCourse.stotal) || 0;
//                 originalFee = parseFloat(matchedCourse.samount) || 0;
//                 break;
//               case 'corporate':
//                 selectedFee = parseFloat(matchedCourse.ctotal) || 0;
//                 originalFee = parseFloat(matchedCourse.camount) || 0;
//                 break;
//               default:
//                 selectedFee = 0;
//                 originalFee = 0;
//             }
//           }

//           const convertedFee = (parseFloat(selectedFee) * rate).toFixed(2);

//           if (originalFee && selectedFee !== 'Free' && originalFee > selectedFee) {
//             const calculatedDiscount = originalFee - selectedFee;
//             const calculatedDiscountPercentage = Math.round((calculatedDiscount / originalFee) * 100);
//             setDiscount((calculatedDiscount * rate).toFixed(2));
//             setDiscountPercentage(calculatedDiscountPercentage);
//           } else {
//             setDiscount(0);
//             setDiscountPercentage(0);
//           }

//           setFee(convertedFee || 'Not Available');
//         } else {
//           setFee('Not Available');
//         }
//       } catch (error) {
//         console.error("Error fetching course amount:", error.message);
//         setFee('Error Loading Fee');
//       }
//     };

//     fetchGeolocationData();
// }, [courseName, modeType, enrollText]);

//   const handleEnroll = async () => {
//     const isLoggedIn = localStorage.getItem('userToken') ? true : false;

//     if (!isLoggedIn) {
//       alert('Please log in to enroll.');
//       window.location.href = '/login';
//       return;
//     } else {
//       if (modeType === 'live' && enrollText === 'Enroll Now') {
//         navigate(`/enroll/${courseName}`);
//         return;
//       }
//     }

//     if (modeType === 'live' && enrollText === 'Enroll Free Demo') {
//       try {
//         const userEmail = localStorage.getItem('userEmail');
//         if (!userEmail) {
//           alert('User email not found. Please log in again.');
//           return;
//         }

//         const response = await axios.post('https://api.hachion.co/enrolldemo', { email: userEmail });

//         if (response.data.success) {
//           setMessage('Successfully enrolled for the free demo.');
//         } else {
//           setMessage('Failed to enroll. Please try again.');
//         }
//       } catch (error) {
//         console.error('Error enrolling in demo:', error);
//         setMessage('Error occurred while enrolling.');
//       }
//     } else {
//       setMessage('Successfully enrolled.');
//     }
//   };

//   return (
//     <div className='right'>
//       <p className='batch-date-fee'>Fee:</p>
//       <p className='free'>
//         {enrollText === 'Enroll Free Demo' ? 'Free' : `${currency} ${fee}`}
//       </p>

//       {discount > 0 && fee !== 'Free' && (
//         <p className='discount'>
//           Flash Sale! Get <span className="discount-percent">{discountPercentage}% OFF</span> & Save {currency} {discount}/-
//         </p>
//       )}

//       {message && <p className="success-message">{message}</p>}

//       <button className='fee-enroll-now' onClick={handleEnroll}>
//         {enrollText}
//       </button>
//     </div>
//   );
// };

// export default LiveOnlineFeesRight;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const LiveOnlineFeesRight = ({ enrollText, modeType, selectedBatchData, courseName }) => {
//   const navigate = useNavigate();
//   const [fee, setFee] = useState('');
//   const [discount, setDiscount] = useState(0);
//   const [discountPercentage, setDiscountPercentage] = useState(0);
//   const [message, setMessage] = useState('');
//   const [isEnrolled, setIsEnrolled] = useState(false);
//   const [resendExceeded, setResendExceeded] = useState(false);
//   const [showResend, setShowResend] = useState(false);

//   const getResendKey = (batch) => {
//     return batch
//       ? `resendAttempts-${batch.schedule_course_name}-${batch.schedule_date}-${batch.schedule_time}`
//       : null;
//   };

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem('loginuserData'));

//     const uniqueBatchKey = selectedBatchData
//       ? `enrolled-${selectedBatchData.schedule_course_name}-${selectedBatchData.schedule_date}-${selectedBatchData.schedule_time}`
//       : null;

//       if (user && uniqueBatchKey && localStorage.getItem(uniqueBatchKey)) {
//         setIsEnrolled(true);
//         setShowResend(true);
//       } else {
//         setIsEnrolled(false);
//         setShowResend(false);
//       }
//     }, [selectedBatchData]);

//   useEffect(() => {
//     setMessage('');
//     const key = getResendKey(selectedBatchData);
//     const attempts = key ? parseInt(localStorage.getItem(key), 10) || 0 : 0;
//     setResendExceeded(attempts >= 3);
//   }, [selectedBatchData]);

//   useEffect(() => {
//     const fetchCourseAmount = async () => {
//       try {
//         const response = await axios.get('https://api.hachion.co/courses/all');
//         const courses = response.data;

//         const matchedCourse = courses.find(
//           (course) => course.courseName.toLowerCase().replace(/\s+/g, '-') === courseName
//         );

//         if (matchedCourse) {
//           let selectedFee, originalFee;

//           if (modeType === 'live') {
//             if (enrollText.toLowerCase().includes('demo')) {
//               selectedFee = '0';
//               originalFee = 0;
//             } else {
//               selectedFee = Math.round(matchedCourse.total);
//               originalFee = Math.round(matchedCourse.amount);
//             }
//           } else {
//             switch (modeType) {
//               case 'mentoring':
//                 selectedFee = Math.round(matchedCourse.mtotal);
//                 originalFee = Math.round(matchedCourse.mamount);
//                 break;
//               case 'self':
//                 selectedFee = Math.round(matchedCourse.stotal);
//                 originalFee = Math.round(matchedCourse.samount);
//                 break;
//               case 'corporate':
//                 selectedFee = Math.round(matchedCourse.ctotal);
//                 originalFee = Math.round(matchedCourse.camount);
//                 break;
//               default:
//                 selectedFee = 'Not Available';
//                 originalFee = 0;
//             }
//           }

//           if (originalFee && selectedFee !== 'Free' && originalFee > selectedFee) {
//             const calculatedDiscount = originalFee - selectedFee;
//             const calculatedDiscountPercentage = Math.round((calculatedDiscount / originalFee) * 100);
//             setDiscount(calculatedDiscount);
//             setDiscountPercentage(calculatedDiscountPercentage);
//           } else {
//             setDiscount(0);
//             setDiscountPercentage(0);
//           }

//           setFee(selectedFee || 'Not Available');
//         } else {
//           setFee('Not Available');
//         }
//       } catch (error) {
//         console.error("Error fetching course amount:", error.message);
//         setFee('Error Loading Fee');
//       }
//     };

//     fetchCourseAmount();
//   }, [courseName, modeType, enrollText]);

//   const resendEmail = async (userEmail) => {
//     try {
//       const response = await axios.post('https://api.hachion.co/enroll/resend-email', {
//         email: userEmail,
//       });

//       alert(response.data);
//     } catch (error) {
//       console.error('Resend email failed:', error.response?.data || error.message);
//       alert('Failed to resend email.');
//     }
//   };

//   const handleResend = async () => {
//     const key = getResendKey(selectedBatchData);
//     const currentAttempts = key ? parseInt(localStorage.getItem(key), 10) || 0 : 0;

//     if (currentAttempts >= 3) {
//       alert('Maximum attempts exceeded. Please reach out to the support team to get the schedule.');
//       setResendExceeded(true);
//       return;
//     }

//     const user = JSON.parse(localStorage.getItem('loginuserData'));
//     const userEmail = user?.email;

//     if (!userEmail) {
//       alert('No user email found!');
//       return;
//     }

//     try {
//       await resendEmail(userEmail);
//       const newAttempts = currentAttempts + 1;
//       localStorage.setItem(key, newAttempts);
//       if (newAttempts >= 3) {
//         setResendExceeded(true);
//       }
//     } catch (err) {
//       alert('Resend failed. Please try again.');
//     }
//   };

//   const handleEnroll = async () => {
//     const user = JSON.parse(localStorage.getItem('loginuserData')) || null;

//     if (!user || !user.email) {
//       const confirmRegister = window.confirm(
//         'Please register on the portal to enroll in demo and live sessions.\n\nClick "OK" to Register Now.'
//       );
//       if (confirmRegister) {
//         navigate('/registerhere');
//       }
//       return;
//     }

//     const userEmail = user.email;
//     const userName = user.name || '';
//     const userMobile = user.mobile || '';

//     if (modeType === 'live' && enrollText === 'Enroll Now') {
//       const formattedCourseName = courseName.toLowerCase().replace(/\s+/g, '-');
//       navigate(`/enroll/${formattedCourseName}`);
//       return;
//     }

//     if (modeType === 'live' && enrollText === 'Enroll Free Demo') {
//       try {
//         if (!selectedBatchData) {
//           alert('Please select a batch before enrolling.');
//           return;
//         }

//         const payload = {
//           name: userName,
//           email: userEmail,
//           mobile: userMobile || "",
//           course_name: selectedBatchData.schedule_course_name,
//           enroll_date: selectedBatchData.schedule_date,
//           week: selectedBatchData.schedule_week,
//           time: selectedBatchData.schedule_time,
//           amount: 0,
//           mode: selectedBatchData.schedule_mode,
//           type: 'Free Demo',
//           trainer: selectedBatchData.trainer_name,
//           completion_date: selectedBatchData.schedule_duration || "",
//           meeting_link: selectedBatchData.meeting_link || "",
//           resendCount:0
//         };

//         const response = await axios.post('https://api.hachion.co/enroll/add', payload);

//         if (response.data.status === 201) {
//           setMessage('Registered Successfully');
//         } else {
//           setMessage('Registered successfully');
//         }

//         alert('You have successfully registered for the demo session. You will receive an email shortly with the meeting link, timing, and other details. Please check your registered email and dashboard for updates.');

//         const uniqueBatchKey = `enrolled-${selectedBatchData.schedule_course_name}-${selectedBatchData.schedule_date}-${selectedBatchData.schedule_time}`;
//         localStorage.setItem(uniqueBatchKey, true);
//         setIsEnrolled(true);
//         setShowResend(true); // Show Resend link after enrolling
//       } catch (error) {
//         console.error('Error enrolling in demo:', error);
//         setMessage('Error occurred while enrolling.');
//       }
//     }
//   };

//   return (
//     <div className='right'>
//       <p className='batch-date-fee'>Fee:</p>
//       <p className='free'>{enrollText === 'Enroll Free Demo' ? 'FREE' : `USD ${fee}`}</p>

//       {discount > 0 && fee !== 'Free' && (
//         <p className='discount'>
//           Flash Sale! Get <span className="discount-percent">{discountPercentage}% OFF</span> & Save USD {Math.round(discount)}/-
//         </p>
//       )}

//       {message && <p className="success-message">{message}</p>}

//       <button
//         onClick={handleEnroll}
//         disabled={isEnrolled}
//         className={`fee-enroll-now ${isEnrolled ? 'enrolled' : ''} text-white`}
//       >
//         {isEnrolled ? 'Enrolled' : enrollText}
//       </button>

//       {showResend && isEnrolled && !resendExceeded && (
//         <p className='resend'>
//           Didn’t receive the email?{' '}
//           <span className="resend-link" onClick={handleResend}>
//             Resend
//           </span>
//         </p>
//       )}

//       {showResend && isEnrolled && resendExceeded && (
//         <p className='attempt'>
//           Maximum attempts exceeded. Please reach out to the support team to get the schedule.
//         </p>
//       )}
//     </div>
//   );
// };

// export default LiveOnlineFeesRight;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const countryToCurrencyMap = {
  IN: "INR",
  US: "USD",
  GB: "GBP",
  AU: "AUD",
  CA: "CAD",
  AE: "AED",
  JP: "JPY",
  EU: "EUR",
  TH: "THB",
  DE: "EUR",
  FR: "EUR",
  QA: "QAR",
  CN: "CNY",
  RU: "RUB",
  KR: "KRW",
  BR: "BRL",
  MX: "MXN",
  ZA: "ZAR",
  NL: "EUR",
};

const LiveOnlineFeesRight = ({ enrollText, modeType, selectedBatchData }) => {
  // Added selectedBatchData prop
  const { courseName } = useParams();
  const navigate = useNavigate();
  const [fee, setFee] = useState("Not Available");
  const [currency, setCurrency] = useState("USD");
  const [exchangeRate, setExchangeRate] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [message, setMessage] = useState("");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [resendExceeded, setResendExceeded] = useState(false);
  const [showResend, setShowResend] = useState(false);

  const getResendKey = (batch) => {
    return batch
      ? `resendAttempts-${batch.schedule_course_name}-${batch.schedule_date}-${batch.schedule_time}`
      : null;
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loginuserData"));

    const uniqueBatchKey = selectedBatchData
      ? `enrolled-${selectedBatchData.schedule_course_name}-${selectedBatchData.schedule_date}-${selectedBatchData.schedule_time}`
      : null;

    if (user && uniqueBatchKey && localStorage.getItem(uniqueBatchKey)) {
      setIsEnrolled(true);
      setShowResend(true);
    } else {
      setIsEnrolled(false);
      setShowResend(false);
    }
  }, [selectedBatchData]);

  useEffect(() => {
    setMessage("");
    const key = getResendKey(selectedBatchData);
    const attempts = key ? parseInt(localStorage.getItem(key), 10) || 0 : 0;
    setResendExceeded(attempts >= 3);
  }, [selectedBatchData]);

  useEffect(() => {
    const fetchGeolocationAndCourseData = async () => {
      try {
        // Fetch Geolocation and Currency
        const geoResponse = await axios.get(
          "https://ipinfo.io/json?token=82aafc3ab8d25b"
        );
        const countryCode = geoResponse.data.country || "US";
        const userCurrency = countryToCurrencyMap[countryCode] || "USD";
        setCurrency(userCurrency);

        localStorage.removeItem("exchangeRates");
        const exchangeResponse = await axios.get(
          `https://api.exchangerate-api.com/v4/latest/USD`
        );
        const rates = exchangeResponse.data.rates;
        localStorage.setItem("exchangeRates", JSON.stringify(rates));
        const rate = rates[userCurrency] || 1;
        setExchangeRate(rate);

        // Fetch Course Data and Set Fee Based on modeType
        const response = await axios.get("https://api.hachion.co/courses/all");
        const courses = response.data;
        const matchedCourse = courses.find(
          (course) =>
            course.courseName.toLowerCase().replace(/\s+/g, "-") === courseName
        );

        if (matchedCourse) {
          let selectedFeeAmount = 0;
          let selectedOriginalAmount = 0;

          if (modeType === "live") {
            selectedFeeAmount = parseFloat(matchedCourse.total) || 0;
            selectedOriginalAmount = parseFloat(matchedCourse.amount) || 0;
          } else if (modeType === "mentoring") {
            selectedFeeAmount = parseFloat(matchedCourse.mtotal) || 0;
            selectedOriginalAmount = parseFloat(matchedCourse.mamount) || 0;
          } else if (modeType === "self") {
            selectedFeeAmount = parseFloat(matchedCourse.stotal) || 0;
            selectedOriginalAmount = parseFloat(matchedCourse.samount) || 0;
          } else if (modeType === "corporate") {
            selectedFeeAmount = parseFloat(matchedCourse.ctotal) || 0;
            selectedOriginalAmount = parseFloat(matchedCourse.camount) || 0;
          }

          setFee((selectedFeeAmount * rate).toFixed(2) || "Not Available");

          if (
            selectedOriginalAmount &&
            selectedFeeAmount !== 0 &&
            selectedOriginalAmount > selectedFeeAmount
          ) {
            const calculatedDiscount =
              selectedOriginalAmount - selectedFeeAmount;
            const calculatedDiscountPercentage = Math.round(
              (calculatedDiscount / selectedOriginalAmount) * 100
            );
            setDiscount((calculatedDiscount * rate).toFixed(2));
            setDiscountPercentage(calculatedDiscountPercentage);
          } else {
            setDiscount(0);
            setDiscountPercentage(0);
          }
        } else {
          setFee("Not Available");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setFee("Error Loading Fee");
      }
    };

    fetchGeolocationAndCourseData();
  }, [courseName, modeType]); // Re-run effect when modeType changes

  const resendEmail = async (userEmail) => {
    try {
      const response = await axios.post(
        "https://api.hachion.co/enroll/resend-email",
        {
          email: userEmail,
        }
      );
      alert(response.data);
    } catch (error) {
      console.error(
        "Resend email failed:",
        error.response?.data || error.message
      );
      alert("Failed to resend email.");
    }
  };

  const handleResend = async () => {
    const key = getResendKey(selectedBatchData);
    const currentAttempts = key
      ? parseInt(localStorage.getItem(key), 10) || 0
      : 0;

    if (currentAttempts >= 3) {
      alert(
        "Maximum attempts exceeded. Please reach out to the support team to get the schedule."
      );
      setResendExceeded(true);
      return;
    }

    const user = JSON.parse(localStorage.getItem("loginuserData"));
    const userEmail = user?.email;

    if (!userEmail) {
      alert("No user email found!");
      return;
    }

    try {
      await resendEmail(userEmail);
      const newAttempts = currentAttempts + 1;
      localStorage.setItem(key, newAttempts);
      if (newAttempts >= 3) {
        setResendExceeded(true);
      }
    } catch (err) {
      alert("Resend failed. Please try again.");
    }
  };

  const handleEnroll = async () => {
    const user = JSON.parse(localStorage.getItem("loginuserData")) || null;

    if (!user || !user.email) {
      const confirmRegister = window.confirm(
        'Please register on the portal to enroll in demo and live sessions.\n\nClick "OK" to Register Now.'
      );
      if (confirmRegister) {
        navigate("/registerhere");
      }
      return;
    }

    const userEmail = user.email;
    const userName = user.name || "";
    const userMobile = user.mobile || "";

    if (modeType === "live" && enrollText === "Enroll Now") {
      const formattedCourseName = courseName.toLowerCase().replace(/\s+/g, "-");
      navigate(`/enroll/${formattedCourseName}`);
      return;
    }

    if (modeType === "live" && enrollText === "Enroll Free Demo") {
      try {
        if (!selectedBatchData) {
          alert("Please select a batch before enrolling.");
          return;
        }

        const payload = {
          name: userName,
          email: userEmail,
          mobile: userMobile || "",
          course_name: selectedBatchData.schedule_course_name,
          enroll_date: selectedBatchData.schedule_date,
          week: selectedBatchData.schedule_week,
          time: selectedBatchData.schedule_time,
          amount: 0,
          mode: selectedBatchData.schedule_mode,
          type: "Free Demo",
          trainer: selectedBatchData.trainer_name,
          completion_date: selectedBatchData.schedule_duration || "",
          meeting_link: selectedBatchData.meeting_link || "",
          resendCount: 0,
        };

        const response = await axios.post(
          "https://api.hachion.co/enroll/add",
          payload
        );

        if (response.data.status === 201) {
          setMessage("Registered Successfully");
        } else {
          setMessage("Registered successfully");
        }

        alert(
          "You have successfully registered for the demo session. You will receive an email shortly with the meeting link, timing, and other details. Please check your registered email and dashboard for updates."
        );

        const uniqueBatchKey = `enrolled-${selectedBatchData.schedule_course_name}-${selectedBatchData.schedule_date}-${selectedBatchData.schedule_time}`;
        localStorage.setItem(uniqueBatchKey, true);
        setIsEnrolled(true);
        setShowResend(true); // Show Resend link after enrolling
      } catch (error) {
        console.error("Error enrolling in demo:", error);
        setMessage("Error occurred while enrolling.");
      }
    }
  };

  return (
    <div className="right">
      <p className="batch-date-fee">Fee:</p>
      <p className="free">
        {enrollText === "Enroll Free Demo"
          ? "FREE"
          : fee !== "Not Available" && fee !== "Error Loading Fee"
          ? `${currency} ${Math.round(parseFloat(fee))}`
          : fee}
      </p>

      {discount > 0 &&
        parseFloat(fee) > 0 &&
        enrollText !== "Enroll Free Demo" && (
          <p className="discount">
            Flash Sale! Get{" "}
            <span className="discount-percent">{discountPercentage}% OFF</span>{" "}
            & Save {currency} {Math.round(discount)}/-
          </p>
        )}

      {message && <p className="success-message">{message}</p>}

      <button
        onClick={handleEnroll}
        disabled={isEnrolled}
        className={`fee-enroll-now ${isEnrolled ? "enrolled" : ""} text-white`}
      >
        {isEnrolled ? "Enrolled" : enrollText}
      </button>

      {showResend && isEnrolled && !resendExceeded && (
        <p className="resend">
          Didn’t receive the email?{" "}
          <span className="resend-link" onClick={handleResend}>
            Resend
          </span>
        </p>
      )}

      {showResend && isEnrolled && resendExceeded && (
        <p className="attempt">
          Maximum attempts exceeded. Please reach out to the support team to get
          the schedule.
        </p>
      )}
    </div>
  );
};

export default LiveOnlineFeesRight;
