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
//         const response = await axios.get('http://localhost:8080/courses/all');
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

//         const response = await axios.post('http://localhost:8080/enrolldemo', { email: userEmail });

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
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LiveOnlineFeesRight = ({ enrollText, modeType }) => {
  const { courseName } = useParams(); // Get course name from URL
  const navigate = useNavigate();
  const [fee, setFee] = useState('');
  const [discount, setDiscount] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCourseAmount = async () => {
      try {
        const response = await axios.get('http://localhost:8080/courses/all');
        const courses = response.data;

        // Find the matching course by courseName
        const matchedCourse = courses.find(
          (course) => course.courseName.toLowerCase().replace(/\s+/g, '-') === courseName
        );

        if (matchedCourse) {
          let selectedFee, originalFee;

          if (modeType === 'live') {
            if (enrollText.toLowerCase().includes('demo')) {
              selectedFee = '0';
              originalFee = 0;
            } else {
              selectedFee = matchedCourse.total;
              originalFee = matchedCourse.amount;
            }
          } else {
            switch (modeType) {
              case 'mentoring':
                selectedFee = matchedCourse.mtotal;
                originalFee = matchedCourse.mamount;
                break;
              case 'self':
                selectedFee = matchedCourse.stotal;
                originalFee = matchedCourse.samount;
                break;
              case 'corporate':
                selectedFee = matchedCourse.ctotal;
                originalFee = matchedCourse.camount;
                break;
              default:
                selectedFee = 'Not Available';
                originalFee = 0;
            }
          }

          if (originalFee && selectedFee !== 'Free' && originalFee > selectedFee) {
            const calculatedDiscount = originalFee - selectedFee;
            const calculatedDiscountPercentage = Math.round((calculatedDiscount / originalFee) * 100);
            setDiscount(calculatedDiscount);
            setDiscountPercentage(calculatedDiscountPercentage);
          } else {
            setDiscount(0);
            setDiscountPercentage(0);
          }

          setFee(selectedFee || 'Not Available'); // Handle null values
        } else {
          setFee('Not Available');
        }
      } catch (error) {
        console.error("Error fetching course amount:", error.message);
        setFee('Error Loading Fee');
      }
    };

    fetchCourseAmount();
  }, [courseName, modeType, enrollText]);

  const handleEnroll = async () => {
    const isLoggedIn = localStorage.getItem('userToken') ? true : false;

    if (!isLoggedIn) {
      alert('Please log in to enroll.');
      window.location.href = '/login'; // Redirect to login page
      return;
    }

    if (modeType === 'live' && enrollText === 'Enroll Now') {
      // Redirect to Enrollment.jsx page for Live Class
      navigate('/enrollment');
      return;
    }

    if (modeType === 'live' && enrollText === 'Enroll Free Demo') {
      try {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
          alert('User email not found. Please log in again.');
          return;
        }

        const response = await axios.post('http://localhost:8080/enrolldemo', { email: userEmail });

        if (response.data.success) {
          setMessage('Successfully enrolled for the free demo.');
        } else {
          setMessage('Failed to enroll. Please try again.');
        }
      } catch (error) {
        console.error('Error enrolling in demo:', error);
        setMessage('Error occurred while enrolling.');
      }
    } else {
      setMessage('Successfully enrolled.');
    }
  };

  return (
    <div className='right'>
      <p className='batch-date-fee'>Fee:</p>
      <p className='free'>{enrollText === 'Enroll Free Demo' ? 'Free' : `USD ${fee}`}</p>
      {discount > 0 && fee !== 'Free' && (
        <p className='discount'>
         Flash Sale! Get <span className="discount-percent">{discountPercentage}% OFF</span> & Save USD {Math.round(discount)}/-
        </p>
      )}
      
      {message && <p className="success-message">{message}</p>}

      <button className='fee-enroll-now' onClick={handleEnroll}>
        {enrollText}
      </button>
    </div>
  );
};

export default LiveOnlineFeesRight;