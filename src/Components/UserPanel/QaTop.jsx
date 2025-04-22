import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdOutlineStar } from "react-icons/md";
import qaheader from '../../Assets/qa-video.png';
import { IoPlayCircleOutline } from 'react-icons/io5';
import { BsFillPlayCircleFill } from 'react-icons/bs';
import './Course.css';
import loginPopupImg from '../../Assets/loginpopup.png';
import logo from '../../Assets/logo.png';

const QaTop = ({ onVideoButtonClick, onEnrollButtonClick }) => {
  const { courseName } = useParams();
  const navigate = useNavigate();
  const [curriculum, setCurriculum] = useState([]);
  const [course, setCourse] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [matchedCourseName, setMatchedCourseName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoPopupOpen, setVideoPopupOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const modalRef = useRef(null);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(1);

  useEffect(() => {
    const fetchGeolocationData = async () => {
      try {
        const geoResponse = await axios.get('https://ipinfo.io?token=9da91c409ab4b2');
        console.log('Geolocation Data:', geoResponse.data);
  
        const currencyMap = {
         'IN': 'INR',
          'US': 'USD',
          'GB': 'GBP',
          'AU': 'AUD',
          'CA': 'CAD',
          'AE': 'AED',
          'JP': 'JPY',
          'EU': 'EUR',
          'TH': 'THB',
          'DE': 'EUR',
          'FR': 'EUR',
          'QA': 'QAR',
          'CN': 'CNY',
          'RU': 'RUB',
          'KR': 'KRW',
          'BR': 'BRL',
          'MX': 'MXN',
          'ZA': 'ZAR',
          'NL': 'EUR'
        };
        
        const countryCode = geoResponse.data.country?.toUpperCase() || 'US';
        const userCurrency = currencyMap[countryCode] || 'USD';
         
        console.log('Detected Currency:', userCurrency);
        setCurrency(userCurrency);
  
        // Fetch Exchange Rate
        const cachedRates = localStorage.getItem('exchangeRates');
        if (cachedRates) {
          const rates = JSON.parse(cachedRates);
          setExchangeRate(rates[userCurrency] || 1);
        } else {
          try {
            const exchangeResponse = await axios.get(`https://api.exchangerate-api.com/v4/latest/USD`);
            const rates = exchangeResponse.data.rates;
            localStorage.setItem('exchangeRates', JSON.stringify(rates));
            setExchangeRate(rates[userCurrency] || 1);
          } catch (error) {
            console.warn('Exchange rate API failed. Using default USD rate.');
            setExchangeRate(1); 
          }
        };
  
      } catch (error) {
        console.error('Error fetching geolocation or exchange rate data:', error);
        setCurrency('USD'); // Fallback to USD if data fails
      }
    };
  
    fetchGeolocationData();
  }, []);

  // Show login modal
  const showLoginModal = () => {
    setIsLoginModalVisible(true);
  };

  // Hide login modal
  const hideLoginModal = () => {
    setIsLoginModalVisible(false);
  };

  // Fetch course & curriculum
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/HachionUserDashboad/courses/all');

        const courseNameFromUrl = courseName?.toLowerCase()?.replace(/\s+/g, '-');
        const matchedCourse = response.data.find(
          (c) => c.courseName.toLowerCase().replace(/\s+/g, '-') === courseNameFromUrl
        );

        if (matchedCourse) {
          setMatchedCourseName(matchedCourse.courseName.trim());

          const curriculumResponse = await axios.get('/HachionUserDashboad/curriculum');
          const matchedCurriculum = curriculumResponse.data.find(
            (item) =>
              item.course_name?.trim().toLowerCase() === matchedCourse.courseName.trim().toLowerCase()
          );

          if (matchedCurriculum && matchedCurriculum.curriculum_pdf) {
            const fullPdfUrl = `/HachionUserDashboad/curriculum/${matchedCurriculum.curriculum_pdf}`;
            setPdfUrl(fullPdfUrl);
          }

          setCourse(matchedCourse);
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

    useEffect(() => {
      if (!matchedCourseName) return;
  
      const fetchCurriculum = async () => {
        try {
          const response = await axios.get('/HachionUserDashboad/curriculum');
          const filteredCurriculum = response.data.filter(
            (item) => item.course_name && item.course_name.trim().toLowerCase() === matchedCourseName.toLowerCase()
          );
          setCurriculum(filteredCurriculum);
        } catch (error) {
          console.error('Error fetching Curriculum:', error.message);
          setError('Failed to load Curriculum.');
        }
      };
  
      fetchCurriculum();
    }, [matchedCourseName]);

  // Download Curriculum
  const downloadPdf = () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      showLoginModal();
      return; // Prevent proceeding to download
    }
  
    if (!curriculum || curriculum.length === 0) {
      alert('No curriculum found for this course.');
      return;
    }

    const userData = JSON.parse(localStorage.getItem('loginuserData'));
    if (!userData) {
      showLoginModal(); // Show login modal if user not logged in
      return;
    }
  
    const curriculumWithPdf = curriculum.find(item => item.curriculum_pdf);
    if (curriculumWithPdf) {
      const fileName = curriculumWithPdf.curriculum_pdf.split('/').pop();
      const fullPdfUrl = `/HachionUserDashboad/curriculum/${curriculumWithPdf.curriculum_pdf}`;
      window.open(fullPdfUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert('No brochure available for this course.');
    }
  }; 

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!course) return <div>Course details not available</div>;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <MdOutlineStar key={i} className={`star-icon ${i <= rating ? 'filled' : ''}`} />
      );
    }
    return stars;
  };

  const convertedTotalFee = (course.total * exchangeRate).toFixed(2);
  const convertedOriginalFee = (course.amount * exchangeRate).toFixed(2);

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
              <img src={`/HachionUserDashboad/${course.courseImage}`} alt='qa-image' />
              <div className='qa-automation-middle'>
                <p className='fee'>
              Fee: <span className='amount'>{currency} {Math.round(convertedTotalFee)}/-</span>
              {course.total !== course.amount && (
              <span className='strike-price'>{currency} {Math.round(convertedOriginalFee)}/-</span>
                          )}
            </p>
                <h6 className='sidebar-course-review'>
                  Rating: {course.starRating} {renderStars(course.starRating)} ({course.ratingByNumberOfPeople})
                </h6>
              </div>
            </div>
            <div className="qa-content" dangerouslySetInnerHTML={{ __html: course.courseHighlight.trim() }} />
          </div>

          <div className='qa-right'>
            <p className='certified'>Certified-students: {course.totalEnrollment}</p>
            <div className="qa-video-container">
              <img src={qaheader} alt='video-frame' className="qa-video-image" />
              {course.youtubeLink && (
                <button
                  className="play-btn-overlay"
                  onClick={() => {
                    const firstVideo = course.youtubeLink.split('\n')[0].trim();
                    const validUrl = firstVideo.startsWith('http') ? firstVideo : `https://${firstVideo}`;
                    setSelectedVideoUrl(validUrl);
                    setVideoPopupOpen(true);
                  }}
                  title="Introduction Video"
                >
                  <BsFillPlayCircleFill size={64} color="#00AEEF" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Buttons Section */}
        <div className='qa-button-container'>
          <div className='qa-button'>
            <button className='enroll-now' onClick={onEnrollButtonClick}>Enroll Now</button>
            <button className="download" onClick={downloadPdf}>Download Brochure</button>
          </div>
          <button className='video-btn' onClick={onVideoButtonClick}>
            <IoPlayCircleOutline className='video-btn-icon' />
            Watch Demo Videos
          </button>
        </div>
      </div>

      {/* Video Modal Popup */}
      {videoPopupOpen && selectedVideoUrl && (
        <div className="video-modal-overlay" onClick={() => setVideoPopupOpen(false)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <iframe
              width="100%"
              height="100%"
              src={selectedVideoUrl.replace("watch?v=", "embed/")}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="Demo Video"
            ></iframe>
            <button className="close-modal" onClick={() => setVideoPopupOpen(false)}>✕</button>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isLoginModalVisible && (
        <div className="login-modal" onClick={hideLoginModal}>
          <div className="login-modal-content" ref={modalRef}>
            <img
                          src={logo}
                          alt="logo"
                          className="hlogo"
                        />
            <button className="close-modal-btn" onClick={hideLoginModal}>×</button>
            <h2 className="modal-title">Download Brochure</h2>
            <div className="modal-body-login">
              <div className="modal-left">
              <h4 style={{color: '#000'}}>Don’t miss out!</h4>
                    <br/>
                      <p>Just log in to the <span className="web-name">Hachion website</span> to unlock this feature.</p>
                <button className="login-btn" onClick={() => window.location.href = '/login'}>Login</button>
                <button className="cancel-btn" onClick={hideLoginModal}>Cancel</button>
              </div>
              <div className="modal-right">
                <img src={loginPopupImg} alt="Login Visual" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QaTop;