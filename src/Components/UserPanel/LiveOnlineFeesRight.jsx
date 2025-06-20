import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const countryToCurrencyMap = {
  IN: 'INR',
  US: 'USD',
  GB: 'GBP',
  AU: 'AUD',
  CA: 'CAD',
  AE: 'AED',
  JP: 'JPY',
  EU: 'EUR',
  TH: 'THB',
  DE: 'EUR',
  FR: 'EUR',
  QA: 'QAR',
  CN: 'CNY',
  RU: 'RUB',
  KR: 'KRW',
  BR: 'BRL',
  MX: 'MXN',
  ZA: 'ZAR',
  NL: 'EUR',
};

const LiveOnlineFeesRight = ({ enrollText, modeType, selectedBatchData }) => {
  const batchId = selectedBatchData?.batchId;
  console.log("Batch ID:", batchId);
  const { courseName } = useParams();
  const navigate = useNavigate();

  const [fee, setFee] = useState('Not Available');
  const [currency, setCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [resendExceeded, setResendExceeded] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);

  const getResendKey = (batch) => {
    return batch
      ? `resendAttempts-${batch.schedule_course_name}-${batch.schedule_date}-${batch.schedule_time}`
      : null;
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loginuserData'));
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
    setMessage('');
    setMessageType('');
    const key = getResendKey(selectedBatchData);
    const attempts = key ? parseInt(localStorage.getItem(key), 10) || 0 : 0;
    setResendExceeded(attempts >= 3);
  }, [selectedBatchData]);

  useEffect(() => {
    const fetchGeolocationAndCourseData = async () => {
      try {
        const geoResponse = await axios.get('https://ipinfo.io/json?token=82aafc3ab8d25b');
        const countryCode = geoResponse.data.country || 'US';
        const userCurrency = countryToCurrencyMap[countryCode] || 'USD';
        setCurrency(userCurrency);

        localStorage.removeItem('exchangeRates');
        const exchangeResponse = await axios.get(`https://api.exchangerate-api.com/v4/latest/USD`);
        const rates = exchangeResponse.data.rates;
        localStorage.setItem('exchangeRates', JSON.stringify(rates));
        const rate = rates[userCurrency] || 1;
        setExchangeRate(rate);

        const response = await axios.get('https://api.hachion.co/courses/all');
        const courses = response.data;
        const matchedCourse = courses.find(
          (course) => course.courseName.toLowerCase().replace(/\s+/g, '-') === courseName
        );

        if (matchedCourse) {
          let selectedFeeAmount = 0;
          let selectedOriginalAmount = 0;

          if (modeType === 'live') {
            selectedFeeAmount = parseFloat(matchedCourse.total) || 0;
            selectedOriginalAmount = parseFloat(matchedCourse.amount) || 0;
          } else if (modeType === 'crash') {
            selectedFeeAmount = parseFloat(matchedCourse.ctotal) || 0;
            selectedOriginalAmount = parseFloat(matchedCourse.camount) || 0;
          }else if (modeType === 'mentoring') {
            selectedFeeAmount = parseFloat(matchedCourse.mtotal) || 0;
            selectedOriginalAmount = parseFloat(matchedCourse.mamount) || 0;
          } else if (modeType === 'self') {
            selectedFeeAmount = parseFloat(matchedCourse.stotal) || 0;
            selectedOriginalAmount = parseFloat(matchedCourse.samount) || 0;
          } else if (modeType === 'selfqa') {
            selectedFeeAmount = parseFloat(matchedCourse.sqtotal) || 0;
            selectedOriginalAmount = parseFloat(matchedCourse.sqamount) || 0;
            setFee('Not Available');
            return;
          }

          setFee(selectedFeeAmount * rate || 'Not Available');

          if (
            selectedOriginalAmount &&
            selectedFeeAmount !== 0 &&
            selectedOriginalAmount > selectedFeeAmount
          ) {
            const calculatedDiscount = selectedOriginalAmount - selectedFeeAmount;
            const calculatedDiscountPercentage = Math.round(
              (calculatedDiscount / selectedOriginalAmount) * 100
            );
            setDiscount(calculatedDiscount * rate);
            setDiscountPercentage(calculatedDiscountPercentage);
          } else {
            setDiscount(0);
            setDiscountPercentage(0);
          }
        } else {
          setFee('Not Available');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setFee('Error Loading Fee');
      }
    };

    fetchGeolocationAndCourseData();
  }, [courseName, modeType]);

  const resendEmail = async (userEmail) => {
    try {
      const response = await axios.post('https://api.hachion.co/enroll/resend-email', {
        email: userEmail,
      });
      setMessage(response.data || 'Email resent successfully.');
      setMessageType('success');
    } catch (error) {
      console.error('Resend email failed:', error.response?.data || error.message);
      setMessage('Failed to resend email.');
      setMessageType('error');
    }
  };

  const handleResend = async () => {
    const key = getResendKey(selectedBatchData);
    const currentAttempts = key ? parseInt(localStorage.getItem(key), 10) || 0 : 0;

    if (currentAttempts >= 3) {
      setMessage('Maximum attempts exceeded. Please reach out to the support team to get the schedule.');
      setMessageType('error');
      setResendExceeded(true);
      return;
    }

    const user = JSON.parse(localStorage.getItem('loginuserData'));
    const userEmail = user?.email;

    if (!userEmail) {
      setMessage('No user email found!');
      setMessageType('error');
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
      setMessage('Resend failed. Please try again.');
      setMessageType('error');
    }
  };
  const isEnrollDisabled = fee === 'Not Available' || fee === 'Error Loading Fee';

  const handleEnroll = async () => {
    if (isEnrollDisabled && enrollText !== 'Enroll Free Demo') {
    return; // Don't proceed if fee is not available and not a demo
  }
    const user = JSON.parse(localStorage.getItem('loginuserData')) || null;

 if (modeType === 'live' && !selectedBatchData) {
    setMessage('⚠️ Please select a batch before enrolling.');
    setMessageType('error');
    return;
  }

    if (!user || !user.email) {
      const currentPath = window.location.pathname + window.location.search;
      localStorage.setItem('redirectAfterLogin', currentPath);
      setShowRegisterPrompt(true);
      return;
    }

    setShowRegisterPrompt(false);
    setMessage('');
    setMessageType('');

    const userEmail = user.email;
    const userName = user.name || '';
    const userMobile = user.mobile || '';

    let studentId = '';
    let mobile = '';
    try {
      // Fetch studentId via API
      const profileResponse = await axios.get(`https://api.hachion.co/api/v1/user/myprofile`, {
        params: { email: userEmail },
      });

      if (profileResponse.data && profileResponse.data.studentId) {
        studentId = profileResponse.data.studentId;
        mobile = profileResponse.data.mobile || '';
      } else {
        // setMessage('Unable to find your student ID.');
        setMessage('Your account is not exist please contact our hachion support team.');
        setMessageType('error');
        return;
      }
    } catch (error) {
      console.error('Error fetching studentId:', error);
      // setMessage('Unable to fetch your student ID. Please try again later.');
      setMessage('Your account is not exist please contact our hachion support team.');
      setMessageType('error');
      return;
    }

    if ( enrollText === 'Enroll Now') {
      const formattedCourseName = courseName.toLowerCase().replace(/\s+/g, '-');
      
        navigate(`/enroll/${formattedCourseName}`, {
    state: {
      selectedBatchData,
      enrollText,
      modeType
    }
  });
      
      return;
    }

    if (modeType === 'live' && enrollText === 'Enroll Free Demo') {
      try {
        if (!selectedBatchData) {
          setMessage('Please select a batch before enrolling.');
          setMessageType('error');
          return;
        }

        const payload = {
          name: userName,
          studentId: studentId,
          email: userEmail,
          mobile: mobile || '',
          course_name: selectedBatchData.schedule_course_name,
          enroll_date: selectedBatchData.schedule_date,
          week: selectedBatchData.schedule_week,
          time: selectedBatchData.schedule_time,
          batchId:batchId, 
          amount: 0,
          mode: selectedBatchData.schedule_mode,
          type: 'Free Demo',
          trainer: selectedBatchData.trainer_name,
          completion_date: selectedBatchData.schedule_duration || '',
          meeting_link: selectedBatchData.meeting_link || '',
          resendCount: 0,
        };

        const response = await axios.post('https://api.hachion.co/enroll/add', payload);

        if (response.data.status === 201) {
          setMessage('Registered Successfully');
          setMessageType('success');
        } else {
          setMessage('Registered successfully');
          setMessageType('success');
        }

        const uniqueBatchKey = `enrolled-${selectedBatchData.schedule_course_name}-${selectedBatchData.schedule_date}-${selectedBatchData.schedule_time}`;
        localStorage.setItem(uniqueBatchKey, true);
        setIsEnrolled(true);
        setShowResend(true);
      } catch (error) {
        console.error('Error enrolling in demo:', error);
        setMessage('Error occurred while enrolling.');
        setMessageType('error');
      }
    }
  };

  return (
    <div className="right">
      {/* {modeType === 'corporate' ? (
        <>
          <p className="free">Talk to our Advisor</p>
          <button
            onClick={() => navigate('/corporate', { state: { scrollToAdvisor: true } })}
            className="fee-enroll-now text-white"
          >
            Contact Us
          </button>
        </>
      ) : ( */}
        <>
          <p className="batch-date-fee">Fee:</p>
          <p className="free">
            {enrollText === 'Enroll Free Demo'
              ? 'FREE'
              : fee !== 'Not Available' && fee !== 'Error Loading Fee'
              ? `${currency} ${Math.round(parseFloat(fee))}`
              : fee}
          </p>
        </>
      {/* )} */}

      {discount > 0 && parseFloat(fee) > 0 && enrollText !== 'Enroll Free Demo' && (
        <p className="discount">
          Flash Sale! Get{' '}
          <span className="discount-percent">{discountPercentage}% OFF</span> & Save {currency}{' '}
          {Math.round(discount)}/-
        </p>
      )}

      {/* Inline Success/Error message */}
      {message && (
        <p
          style={{
            color: messageType === 'success' ? 'green' : 'red',
            marginTop: '10px',
            marginBottom: '10px',
          }}
          className={messageType === 'success' ? 'success-message' : 'error-message'}
        >
          {message}
        </p>
      )}

      {/* Register prompt instead of popup */}
      {showRegisterPrompt && (
        <div className='prompt'>
          <p>Please Login to the portal to enroll in demo and live sessions.</p>
          <button
            className='log'
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          <button className='cancel' onClick={() => setShowRegisterPrompt(false)}>Cancel</button>
        </div>
      )}

      {modeType !== 'corporate' && (
        <button
          onClick={handleEnroll}
          disabled={isEnrollDisabled || isEnrolled}
          className={`fee-enroll-now ${isEnrolled ? 'enrolled' : ''} text-white`}
        >
          {isEnrolled ? 'Enrolled' : enrollText}
        </button>
      )}

      {showResend && isEnrolled && !resendExceeded && (
        <p className="resend">
          Didn’t receive the email?{' '}
          <span className="resend-link" onClick={handleResend}>
            Resend
          </span>
        </p>
      )}

      {showResend && isEnrolled && resendExceeded && (
        <p className="attempt">
          Maximum attempts exceeded. Please reach out to the support team to get the schedule.
        </p>
      )}
    </div>
  );
};

export default LiveOnlineFeesRight;
