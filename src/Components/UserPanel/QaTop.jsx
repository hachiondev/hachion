// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { MdOutlineStar } from "react-icons/md";
// import qaheader from '../../Assets/qa-video.png';
// import { IoPlayCircleOutline } from 'react-icons/io5';
// import './Course.css';

// const QaTop = ({ onVideoButtonClick }) => {
//   const { courseName } = useParams(); // Extract course_id from URL params
//   const navigate = useNavigate();
//   const [curriculumData, setCurriculumData] = useState({
//     course_name: "",
//     curriculum_pdf: null,
//   });
//   const [course, setCourse] = useState(null);
//    const [faq, setFaq] = useState([]);
//      const [pdfUrl, setPdfUrl] = useState(null); 
//      const [matchedCourseName, setMatchedCourseName] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currency, setCurrency] = useState('USD');
//   const [exchangeRate, setExchangeRate] = useState(1);

//   // Fetch Geolocation and Currency Conversion
//   useEffect(() => {
//     const fetchGeolocationData = async () => {
//       try {
//         const geoResponse = await axios.get('https://ipinfo.io?token=82aafc3ab8d25b');
//         console.log('Geolocation Data:', geoResponse.data);
  
//         // Country-to-Currency Mapping
//         const currencyMap = {
//           'IN': 'INR',
//           'US': 'USD',
//           'GB': 'GBP',
//           'AU': 'AUD',
//           'CA': 'CAD',
//           'AE': 'AED',
//           'JP': 'JPY',
//           'EU': 'EUR'
//         };
        
//         // Improved Fallback Logic
//         const countryCode = geoResponse.data.country?.toUpperCase() || 'US';
//         const userCurrency = currencyMap[countryCode] || 'USD';
        
  
//         console.log('Detected Currency:', userCurrency);
//         setCurrency(userCurrency);
  
//         // Fetch Exchange Rate
//         const cachedRates = localStorage.getItem('exchangeRates');
//         if (cachedRates) {
//           const rates = JSON.parse(cachedRates);
//           setExchangeRate(rates[userCurrency] || 1);
//         } else {
//           try {
//             const exchangeResponse = await axios.get(`https://api.exchangerate-api.com/v4/latest/USD`);
//             const rates = exchangeResponse.data.rates;
//             localStorage.setItem('exchangeRates', JSON.stringify(rates));
//             setExchangeRate(rates[userCurrency] || 1);
//           } catch (error) {
//             console.warn('Exchange rate API failed. Using default USD rate.');
//             setExchangeRate(1);  // Safe fallback
//           }
//         };
  
//       } catch (error) {
//         console.error('Error fetching geolocation or exchange rate data:', error);
//         setCurrency('USD'); // Fallback to USD if data fails
//       }
//     };
  
//     fetchGeolocationData();
//   }, []);
  
  

//   useEffect(() => {
//     const fetchCourse = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get('http://localhost:8080/courses/all');
//         console.log('API response:', response.data); // Check course data
    
//         const courseNameFromUrl = courseName?.toLowerCase()?.replace(/\s+/g, '-');
//         console.log('Course name from URL:', courseNameFromUrl);
    
//         const matchedCourse = response.data.find(
//           (c) => c.courseName.toLowerCase().replace(/\s+/g, '-') === courseNameFromUrl
//         );
    
//         if (matchedCourse) {
//           setMatchedCourseName(matchedCourse.courseName.trim());
//           console.log('Matched Course:', matchedCourse);
    
//           // Fetch curriculum details
//           const curriculumResponse = await axios.get('http://localhost:8080/curriculum');
//           console.log('Curriculum API response:', curriculumResponse.data); // Log the curriculum data
    
//           // Normalize both names for reliable comparison
//           const matchedCurriculum = curriculumResponse.data.find(
//             (item) => item.course_name?.trim().toLowerCase() === matchedCourse.courseName.trim().toLowerCase()
//           );
  
//           console.log('Matched Curriculum:', matchedCurriculum); // Debugging log
  
//           // Set the PDF URL if found
//           if (matchedCurriculum && matchedCurriculum.curriculum_pdf) {
//             const fullPdfUrl = `http://localhost:8080/curriculum/${matchedCurriculum.curriculum_pdf}`; // Ensure full URL
//             setPdfUrl(fullPdfUrl);
//             console.log('PDF URL Set:', fullPdfUrl);
//           } else {
//             console.log('No PDF found in FAQ for this course');
           
//           }
//         } else {
//           setError('Course not found.');
//         }
//       } catch (error) {
//         console.error('Error fetching course details:', error);
//         setError('Failed to load course details.');
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchCourse();
//   }, [courseName]);
//   const downloadPdf = () => {
//     if (!pdfUrl) {
//       alert('No brochure available for this course.');
//       return;
//     }
//   else{
//     // Programmatically trigger download
//     const link = document.createElement('a');
//     link.href = pdfUrl; // Now, pdfUrl contains the correct full URL
//     link.setAttribute('download', pdfUrl.split('/').pop()); // Extract file name
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };
//   }

//   useEffect(() => {
//     const fetchCourse = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get('http://localhost:8080/courses/all');
//         const courseData = response.data.find(
//           (c) => c.courseName.toLowerCase().replace(/\s+/g, '-') === courseName
//         );
//         setCourse(courseData);
//       } catch (error) {
//         console.error('Error fetching course details:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCourse();
//   }, [courseName]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;
//   if (!course) return <div>Course details not available</div>;
//   const convertedTotalFee = (course.total * exchangeRate).toFixed(2);
//   const convertedOriginalFee = (course.amount * exchangeRate).toFixed(2);
//   // Function to render stars dynamically based on rating
//   const renderStars = (rating) => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       stars.push(
//         i <= rating ? (
//           <MdOutlineStar key={i} className="star-icon filled" />
//         ) : (
//           <MdOutlineStar key={i} className="star-icon" />
//         )
//       );
//     }
//     return stars;
//   };

//   return (
//     <>
//       <div className='qa-automation'>
//         <div className='qa-inside'>
//         <div className='qa-left-part'>
//           <div className='top-course-data-mob'>
//           <h3 className='top-course-name'>{course?.courseName}</h3>
//         <h4 className='top-course-name-mob'>{course?.courseName}</h4>
//           <p className='mob-cert'>Certified-students: {course.totalEnrollment}</p>
//           </div>
//           <div className='qa-automation-left'>
//             <img src={`http://localhost:8080/${course.courseImage}`} alt='qa-image' />
//             <div className='qa-automation-middle'>
//               {/* <p className='fee'>Fee: <span className='amount'>USD {course.total}/-</span>
//               {course.total !== course.amount && (
//               <span className='strike-price'> USD {course.amount}/-</span>
//             )}</p> */}
//              <p className='fee'>
//             Fee: <span className='amount'>{currency} {convertedTotalFee}/-</span>
//             {course.total !== course.amount && (
//               <span className='strike-price'>{currency} {convertedOriginalFee}/-</span>
//             )}
//           </p>
//               <h6 className='sidebar-course-review'>
//                 Rating: {course.starRating} {renderStars(course.starRating)} ({course.ratingByNumberOfPeople})
//               </h6>
//             </div>
//           </div>
//           <div className="qa-content" dangerouslySetInnerHTML={{ __html: course.courseHighlight.trim() }} />
//         </div>
        
//         <div className='qa-right'>
//           <p className='certified'>Certified-students: {course.totalEnrollment}</p>
//           <img src={qaheader} alt='video-frame' />
//         </div>
//         </div>

//       {/* Buttons Section */}
//       <div className='qa-button-container'>
//         <div className='qa-button'>
//           <button className='enroll-now' onClick={() => navigate(`/enroll/${courseName}`)}>Enroll Now</button>
//           <button className="download" onClick={downloadPdf}>Download Brochure</button>
//           </div>
//           <button className='video-btn' onClick={onVideoButtonClick}>
//             <IoPlayCircleOutline className='video-btn-icon' />
//             Watch Demo Videos
//           </button>
//           </div>
//           </div>
//     </>
//   );
// };

// export default QaTop;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdOutlineStar } from "react-icons/md";
import qaheader from '../../Assets/qa-video.png';
import { IoPlayCircleOutline } from 'react-icons/io5';
import './Course.css';

const QaTop = ({ onVideoButtonClick }) => {
  const { courseName } = useParams(); // Extract course_id from URL params
  const navigate = useNavigate();
  const [curriculumData, setCurriculumData] = useState({
    course_name: "",
    curriculum_pdf: null,
  });
  const [course, setCourse] = useState(null);
   const [faq, setFaq] = useState([]);
     const [pdfUrl, setPdfUrl] = useState(null); 
     const [matchedCourseName, setMatchedCourseName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/courses/all');
        console.log('API response:', response.data); // Check course data
    
        const courseNameFromUrl = courseName?.toLowerCase()?.replace(/\s+/g, '-');
        console.log('Course name from URL:', courseNameFromUrl);
    
        const matchedCourse = response.data.find(
          (c) => c.courseName.toLowerCase().replace(/\s+/g, '-') === courseNameFromUrl
        );
    
        if (matchedCourse) {
          setMatchedCourseName(matchedCourse.courseName.trim());
          console.log('Matched Course:', matchedCourse);
    
          // Fetch curriculum details
          const curriculumResponse = await axios.get('http://localhost:8080/curriculum');
          console.log('Curriculum API response:', curriculumResponse.data); // Log the curriculum data
    
          // Normalize both names for reliable comparison
          const matchedCurriculum = curriculumResponse.data.find(
            (item) => item.course_name?.trim().toLowerCase() === matchedCourse.courseName.trim().toLowerCase()
          );
  
          console.log('Matched Curriculum:', matchedCurriculum); // Debugging log
  
          // Set the PDF URL if found
          if (matchedCurriculum && matchedCurriculum.curriculum_pdf) {
            const fullPdfUrl = `http://localhost:8080/curriculum/${matchedCurriculum.curriculum_pdf}`; // Ensure full URL
            setPdfUrl(fullPdfUrl);
            console.log('PDF URL Set:', fullPdfUrl);
          } else {
            console.log('No PDF found in FAQ for this course');
           
          }
        } else {
          setError('Course not found.');
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
        setError('Failed to load course details.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchCourse();
  }, [courseName]);
  const downloadPdf = () => {
    if (!pdfUrl) {
      alert('No brochure available for this course.');
      return;
    }
  else{
    // Programmatically trigger download
    const link = document.createElement('a');
    link.href = pdfUrl; // Now, pdfUrl contains the correct full URL
    link.setAttribute('download', pdfUrl.split('/').pop()); // Extract file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  }

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/courses/all');
        const courseData = response.data.find(
          (c) => c.courseName.toLowerCase().replace(/\s+/g, '-') === courseName
        );
        setCourse(courseData);
      } catch (error) {
        console.error('Error fetching course details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseName]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!course) return <div>Course details not available</div>;

  // Function to render stars dynamically based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <MdOutlineStar key={i} className="star-icon filled" />
        ) : (
          <MdOutlineStar key={i} className="star-icon" />
        )
      );
    }
    return stars;
  };

  return (
    <>
      <div className='qa-automation'>
        <div className='qa-inside'>
        <div className='qa-left-part'>
          <div className='top-course-data-mob'>
          <h3 className='top-course-name'>{course?.courseName}</h3>
        <h4 className='top-course-name-mob'>{course?.courseName}</h4>
          <p className='mob-cert'>Certified-students: {course.totalEnrollment}</p>
          </div>
          <div className='qa-automation-left'>
            <img src={`http://localhost:8080/${course.courseImage}`} alt='qa-image' />
            <div className='qa-automation-middle'>
              <p className='fee'>Fee: <span className='amount'>USD {course.total}/-</span>
              {course.total !== course.amount && (
              <span className='strike-price'> USD {course.amount}/-</span>
            )}</p>
              <h6 className='sidebar-course-review'>
                Rating: {course.starRating} {renderStars(course.starRating)} ({course.ratingByNumberOfPeople})
              </h6>
            </div>
          </div>
          <div className="qa-content" dangerouslySetInnerHTML={{ __html: course.courseHighlight.trim() }} />
        </div>
        
        <div className='qa-right'>
          <p className='certified'>Certified-students: {course.totalEnrollment}</p>
          <img src={qaheader} alt='video-frame' />
        </div>
        </div>

      {/* Buttons Section */}
      <div className='qa-button-container'>
        <div className='qa-button'>
          <button className='enroll-now' onClick={() => navigate(`/enroll/${courseName}`)}>Enroll Now</button>
          <button className="download" onClick={downloadPdf}>Download Brochure</button>
          </div>
          <button className='video-btn' onClick={onVideoButtonClick}>
            <IoPlayCircleOutline className='video-btn-icon' />
            Watch Demo Videos
          </button>
          </div>
          </div>
    </>
  );
};

export default QaTop;