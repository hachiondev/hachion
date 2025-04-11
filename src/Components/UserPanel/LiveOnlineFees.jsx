// import React, { useState, useEffect } from 'react';
// import './Course.css';
// import { FaCircle } from "react-icons/fa";
// import LiveOnlineFeesRight from './LiveOnlineFeesRight';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import dayjs from 'dayjs';
// import utc from 'dayjs/plugin/utc';  
// import timezone from 'dayjs/plugin/timezone';

// dayjs.extend(utc);
// dayjs.extend(timezone);
// export const LiveOnlineFees = () => {
//   const { courseName } = useParams(); // Extract courseName from URL
//   const [selectedBatch, setSelectedBatch] = useState('');
//   const [fee, setFee] = useState('');
//   const [courses, setCourses] = useState([]);
//   const [filteredCourses, setFilteredCourses] = useState([]);
//   const [enrollText, setEnrollText] = useState('Enroll Now');
//   const [modeType, setModeType] = useState('live');
//   const [userTimezone, setUserTimezone] = useState('America/New_York'); // Default to EST
//   const [currency, setCurrency] = useState('USD');
//   const [exchangeRate, setExchangeRate] = useState(1);
//   // Fetch User's Geolocation Timezone
//   // Update the timezone detection logic
// useEffect(() => {
//   const fetchGeolocationData = async () => {
//     try {
//       const geoResponse = await axios.get('https://ipinfo.io/json?token=82aafc3ab8d25b');
//       console.log('Geolocation Data:', geoResponse.data);

//       const timezone = geoResponse.data.timezone || 'America/New_York';  // Correct timezone detection
//       setUserTimezone(timezone);

//       const currencyMap = {
//         'IN': 'INR',
//         'US': 'USD',
//         'GB': 'GBP',
//         'AU': 'AUD',
//         'CA': 'CAD',
//         'AE': 'AED',
//         'JP': 'JPY',
//         'EU': 'EUR'
//       };

//       const countryCode = geoResponse.data.country || 'US';
//       const userCurrency = currencyMap[countryCode] || 'USD';

//       console.log('Detected Currency:', userCurrency);
//       setCurrency(userCurrency);

//       localStorage.removeItem('exchangeRates');

//       const exchangeResponse = await axios.get(`https://api.exchangerate-api.com/v4/latest/USD`);
//       localStorage.setItem('exchangeRates', JSON.stringify(exchangeResponse.data.rates));
//       const rate = exchangeResponse.data.rates[userCurrency] || 1;
//       setExchangeRate(rate);

//     } catch (error) {
//       console.error('Error fetching geolocation or exchange rate data:', error);
//       setCurrency('USD'); 
//     }
//   };

//   fetchGeolocationData();
// }, []);

// // Updated Timezone Conversion Function
// // Custom timezone abbreviation mapping
// const timezoneAbbreviationMap = {
//   'Asia/Kolkata': 'IST',    // India
//   'America/New_York': 'EST', // Eastern US
//   'America/Los_Angeles': 'PST', // Pacific US
//   'Europe/London': 'GMT',    // UK
//   'Australia/Sydney': 'AEST' // Australia
// };

// const convertToUserTimezone = (time, date) => {
//   if (!time || !date) return 'TBA'; // Handle missing data

//   const combinedDateTime = `${date} ${time}`;

//   const formattedTime = dayjs.tz(combinedDateTime, userTimezone)
//     .format('MMM DD YYYY - hh:mm A');

//   // Map the abbreviation dynamically
//   const abbreviation = timezoneAbbreviationMap[userTimezone] || 'GMT';

//   return `${formattedTime} ${abbreviation}`;
// };

  
//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const response = await axios.get('http://localhost:8080/schedulecourse');
//         setCourses(response.data);

//         // Filter courses based on the courseName from URL
//         const filteredData = response.data.filter(
//           (course) => course.schedule_course_name.toLowerCase().replace(/\s+/g, '-') === courseName
//         );
//         setFilteredCourses(filteredData);
//       } catch (error) {
//         console.error("Error fetching courses:", error.message);
//       }
//     };
//     fetchCourses();
//   }, [courseName]);
//   // const convertToUserTimezone = (time, date) => {
//   //   const estDateTime = `${date} ${time} EST`;
//   //   return dayjs(estDateTime)
//   //     .tz(userTimezone)
//   //     .format('MMM DD YYYY - hh:mm A z');
//   // };
  


  
//   const handleBatchSelect = (batchId, batchData) => {
//     setSelectedBatch(batchId);

//     // Determine the fee based on schedule_mode
//     let calculatedFee = '';
//     switch (batchData.schedule_mode) {
//       case "Live Class":
//         calculatedFee = batchData.total;
//         setModeType('live');
//         setEnrollText('Enroll Now');
//         break;
//       case "Live Demo":
//         calculatedFee = 'Free';
//         setModeType('live');
//         setEnrollText('Enroll Free Demo');
//         break;
//       case "Mentoring Mode":
//         calculatedFee = batchData.mtotal;
//         setModeType('mentoring');
//         setEnrollText('Enroll Now');
//         break;
//       case "Self-Paced":
//         calculatedFee = batchData.stotal;
//         setModeType('self');
//         setEnrollText('Enroll Now');
//         break;
//       case "Corporate Training":
//         calculatedFee = batchData.ctotal;
//         setModeType('corporate');
//         setEnrollText('Enroll Now');
//         break;
//       default:
//         calculatedFee = batchData.total; // Default to Live Class if no match
//         setModeType('live');
//         setEnrollText('Enroll Now');
//     }

//     // Convert the fee to detected currency
// // Convert the fee to detected currency
// const convertedFee = calculatedFee !== 'Free' 
//   ? (currency === 'INR' 
//       ? (calculatedFee * exchangeRate).toFixed(2) 
//       : calculatedFee)
//   : 'Free';
//   }

//   return (
//     <>
//       <div className='batch-schedule'>
//         <div className='left'>
//           {filteredCourses.length > 0 ? (
//             filteredCourses.map((course, index) => (
//               <div className='partition' key={course.course_schedule_id || index}>
//                 <label className="radio-label">
//                   <input 
//                     type="radio" 
//                     name="batch" 
//                     value={course.course_schedule_id} 
//                     checked={selectedBatch === course.course_schedule_id}
//                     onChange={() => handleBatchSelect(course.course_schedule_id, course)}
//                     className="hidden-radio"
//                   />
//                   <span className="custom-radio"></span>
//                   <div className='partition-schedule'>
//                     {/* <p className='batch-date'>
//                     {dayjs(course.schedule_date).format('MMM DD YYYY')} <span className='date-span'>
//                     ({dayjs(course.schedule_date).format('ddd')})
//                     </span>
//                     </p> */}
                    
//                     <p className='batch-date'>
//                       {convertToUserTimezone(course.schedule_time, course.schedule_date)}
//                     </p>
//                     <p className='batch-date'>
//                     {course.schedule_duration} Days
//                     </p>
//                     <p className={course.schedule_mode === "Live Class" ? 'class' : 'demo'}>
//                       <FaCircle className={course.schedule_mode === "Live Class" ? 'class-icon' : 'demo-icon'} />
//                       {course.schedule_mode}
//                     </p>
//                   </div>
//                 </label>
//               </div>
//             ))
//           ) : (
//             <p className='batch-text'>No batches available for this course.</p>
//           )}
//         </div>

//         <div className='separator'></div>
//         <LiveOnlineFeesRight enrollText={enrollText} modeType={modeType} />
//       </div>
//     </>
//   );
// };

// export default LiveOnlineFees;
import React, { useState, useEffect } from 'react';
import './Course.css';
import { FaCircle } from "react-icons/fa";
import LiveOnlineFeesRight from './LiveOnlineFeesRight';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

export const LiveOnlineFees = () => {
  const { courseName } = useParams(); // Extract courseName from URL
  const [selectedBatch, setSelectedBatch] = useState('');
  const [fee, setFee] = useState('');
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [enrollText, setEnrollText] = useState('Enroll Now');
  const [modeType, setModeType] = useState('live');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:8080/schedulecourse');
        setCourses(response.data);

        // Filter courses based on the courseName from URL
        const filteredData = response.data.filter(
          (course) => course.schedule_course_name.toLowerCase().replace(/\s+/g, '-') === courseName
        );
        setFilteredCourses(filteredData);
      } catch (error) {
        console.error("Error fetching courses:", error.message);
      }
    };
    fetchCourses();
  }, [courseName]);

  const handleBatchSelect = (batchId, batchData) => {
    setSelectedBatch(batchId);

    // Determine the fee based on schedule_mode
    let calculatedFee = '';
    switch (batchData.schedule_mode) {
      case "Live Class":
        calculatedFee = batchData.total;
        setModeType('live');
        setEnrollText('Enroll Now');
        break;
      case "Live Demo":
        calculatedFee = 'Free';
        setModeType('live');
        setEnrollText('Enroll Free Demo');
        break;
      case "Mentoring Mode":
        calculatedFee = batchData.mtotal;
        setModeType('mentoring');
        setEnrollText('Enroll Now');
        break;
      case "Self-Paced":
        calculatedFee = batchData.stotal;
        setModeType('self');
        setEnrollText('Enroll Now');
        break;
      case "Corporate Training":
        calculatedFee = batchData.ctotal;
        setModeType('corporate');
        setEnrollText('Enroll Now');
        break;
      default:
        calculatedFee = batchData.total; // Default to Live Class if no match
        setModeType('live');
        setEnrollText('Enroll Now');
    }

    setFee(calculatedFee);
  };

  return (
    <>
      <div className='batch-schedule'>
        <div className='left'>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course, index) => (
              <div className='partition' key={course.course_schedule_id || index}>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="batch" 
                    value={course.course_schedule_id} 
                    checked={selectedBatch === course.course_schedule_id}
                    onChange={() => handleBatchSelect(course.course_schedule_id, course)}
                    className="hidden-radio"
                  />
                  <span className="custom-radio"></span>
                  <div className='partition-schedule'>
                    <p className='batch-date'>
                    {dayjs(course.schedule_date).format('MMM DD YYYY')} <span className='date-span'>
                    ({dayjs(course.schedule_date).format('ddd')})
                    </span>
                    </p>
                    <p className='batch-date'>
                      {course.schedule_time} EST 
                      {/* <span className='date-span'>({course.schedule_duration} Hour)</span> */}
                    </p>
                    <p className='batch-date'>
                    {course.schedule_duration} Days
                    </p>
                    <p className={course.schedule_mode === "Live Class" ? 'class' : 'demo'}>
                      <FaCircle className={course.schedule_mode === "Live Class" ? 'class-icon' : 'demo-icon'} />
                      {course.schedule_mode}
                    </p>
                  </div>
                </label>
              </div>
            ))
          ) : (
            <p className='batch-text'>No batches available for this course.</p>
          )}
        </div>

        <div className='separator'></div>
        <LiveOnlineFeesRight enrollText={enrollText} modeType={modeType} />
      </div>
    </>
  );
};

export default LiveOnlineFees;