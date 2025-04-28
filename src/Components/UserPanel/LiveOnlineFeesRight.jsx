import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const countryToCurrencyMap = {
  'IN': 'INR', 'US': 'USD', 'GB': 'GBP', 'AU': 'AUD', 'CA': 'CAD',
  'AE': 'AED', 'JP': 'JPY', 'EU': 'EUR', 'TH': 'THB', 'DE': 'EUR',
  'FR': 'EUR', 'QA': 'QAR', 'CN': 'CNY', 'RU': 'RUB', 'KR': 'KRW',
  'BR': 'BRL', 'MX': 'MXN', 'ZA': 'ZAR', 'NL': 'EUR'
};

const LiveOnlineFeesRight = ({ enrollText, modeType, selectedBatchData }) => {
  const { courseName } = useParams();
  const navigate = useNavigate();
  const [fee, setFee] = useState('Not Available');
  const [currency, setCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [message, setMessage] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [resendExceeded, setResendExceeded] = useState(false);
  const [showResend, setShowResend] = useState(false);

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

        const response = await axios.get('/HachionUserDashboad/courses/all');
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
          } else if (modeType === 'mentoring') {
            selectedFeeAmount = parseFloat(matchedCourse.mtotal) || 0;
            selectedOriginalAmount = parseFloat(matchedCourse.mamount) || 0;
          } else if (modeType === 'self') {
            selectedFeeAmount = parseFloat(matchedCourse.stotal) || 0;
            selectedOriginalAmount = parseFloat(matchedCourse.samount) || 0;
          } else if (modeType === 'corporate') {
            setFee('Not Available');
            return;
          }

          setFee((selectedFeeAmount * rate).toFixed(2) || 'Not Available');

          if (selectedOriginalAmount && selectedFeeAmount !== 0 && selectedOriginalAmount > selectedFeeAmount) {
            const calculatedDiscount = selectedOriginalAmount - selectedFeeAmount;
            const calculatedDiscountPercentage = Math.round((calculatedDiscount / selectedOriginalAmount) * 100);
            setDiscount((calculatedDiscount * rate).toFixed(2));
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
      const response = await axios.post('/HachionUserDashboad/enroll/resend-email', {
        email: userEmail,
      });
      alert(response.data);
    } catch (error) {
      console.error('Resend email failed:', error.response?.data || error.message);
      alert('Failed to resend email.');
    }
  };

  const handleResend = async () => {
    const key = getResendKey(selectedBatchData);
    const currentAttempts = key ? parseInt(localStorage.getItem(key), 10) || 0 : 0;

    if (currentAttempts >= 3) {
      alert('Maximum attempts exceeded. Please reach out to the support team to get the schedule.');
      setResendExceeded(true);
      return;
    }

    const user = JSON.parse(localStorage.getItem('loginuserData'));
    const userEmail = user?.email;

    if (!userEmail) {
      alert('No user email found!');
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
      alert('Resend failed. Please try again.');
    }
  };

  const handleEnroll = async () => {
    const user = JSON.parse(localStorage.getItem('loginuserData')) || null;

    if (!user || !user.email) {
      const confirmRegister = window.confirm(
        'Please register on the portal to enroll in demo and live sessions.\n\nClick "OK" to Register Now.'
      );
      if (confirmRegister) {
        navigate('/registerhere');
      }
      return;
    }

    const userEmail = user.email;
    const userName = user.name || '';
    const userMobile = user.mobile || '';

    if (modeType === 'live' && enrollText === 'Enroll Now') {
      const formattedCourseName = courseName.toLowerCase().replace(/\s+/g, '-');
      navigate(`/enroll/${formattedCourseName}`);
      return;
    }

    if (modeType === 'live' && enrollText === 'Enroll Free Demo') {
      try {
        if (!selectedBatchData) {
          alert('Please select a batch before enrolling.');
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
          type: 'Free Demo',
          trainer: selectedBatchData.trainer_name,
          completion_date: selectedBatchData.schedule_duration || "",
          meeting_link: selectedBatchData.meeting_link || "",
          resendCount: 0
        };

        const response = await axios.post('/HachionUserDashboad/enroll/add', payload);

        if (response.data.status === 201) {
          setMessage('Registered Successfully');
        } else {
          setMessage('Registered successfully');
        }

        alert('You have successfully registered for the demo session. You will receive an email shortly.');

        const uniqueBatchKey = `enrolled-${selectedBatchData.schedule_course_name}-${selectedBatchData.schedule_date}-${selectedBatchData.schedule_time}`;
        localStorage.setItem(uniqueBatchKey, true);
        setIsEnrolled(true);
        setShowResend(true);
      } catch (error) {
        console.error('Error enrolling in demo:', error);
        setMessage('Error occurred while enrolling.');
      }
    }
  };

  return (
    <div className='right'>
      {modeType === 'corporate' ? (
        <>
          <p className='free'>Talk to our Advisor</p>
          <button
            onClick={() => navigate('/corporate', { state: { scrollToAdvisor: true } })}
            className="fee-enroll-now text-white"
          >
            Contact Us
          </button>
        </>
      ) : (
        <>
          <p className='batch-date-fee'>Fee:</p>
          <p className='free'>
            {enrollText === 'Enroll Free Demo'
              ? 'FREE'
              : fee !== 'Not Available' && fee !== 'Error Loading Fee'
                ? `${currency} ${Math.round(parseFloat(fee))}`
                : fee
            }
          </p>
        </>
      )}

      {discount > 0 && parseFloat(fee) > 0 && enrollText !== 'Enroll Free Demo' && modeType !== 'corporate' && (
        <p className='discount'>
          Flash Sale! Get <span className="discount-percent">{discountPercentage}% OFF</span> & Save {currency} {Math.round(discount)}/-
        </p>
      )}

      {message && <p className="success-message">{message}</p>}

      {modeType !== 'corporate' && (
        <button
          onClick={handleEnroll}
          disabled={isEnrolled}
          className={`fee-enroll-now ${isEnrolled ? 'enrolled' : ''} text-white`}
        >
          {isEnrolled ? 'Enrolled' : enrollText}
        </button>
      )}

      {showResend && isEnrolled && !resendExceeded && (
        <p className='resend'>
          Didn’t receive the email?{' '}
          <span className="resend-link" onClick={handleResend}>
            Resend
          </span>
        </p>
      )}

      {showResend && isEnrolled && resendExceeded && (
        <p className='attempt'>
          Maximum attempts exceeded. Please reach out to the support team to get the schedule.
        </p>
      )}
    </div>
  );
};

export default LiveOnlineFeesRight;