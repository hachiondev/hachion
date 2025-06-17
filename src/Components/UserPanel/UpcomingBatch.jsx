import React, { useState, useEffect } from 'react';
import calendar from '../../Assets/calendar.png';
import './Course.css';
import { useParams } from 'react-router-dom';
import LiveOnlineFees from './LiveOnlineFees';
import CorporateFees from './CorporateFees';
import CrashCourseFee from './CrashCourseFee';
import MentoringModeFees from './MentoringModeFees';
import SelfPlacedFees from './SelfPlacedFees';
import RequestBatch from './RequestBatch';
import axios from 'axios';
import loginPopupImg from '../../Assets/loginpopup.png';

const UpcomingBatch = () => {
  const [activeComponent, setActiveComponent] = useState('LiveOnlineFees');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { courseName } = useParams();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [fees, setFees] = useState({
    live: null,
    mentoring: null,
    self: null,
    crash: null,
    corporate: 'Contact Us',
  });

  const handleRequestBatchClick = () => {
    const user = JSON.parse(localStorage.getItem('loginuserData'));
    if (user) {
      setIsModalOpen(true);
    } else {
      setIsLoginModalVisible(true);
    }
  };

  const hideLoginModal = () => setIsLoginModalVisible(false);
  const handleCloseModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);

        // Get user location and preferred currency
        const geoRes = await axios.get('https://ipinfo.io/json?token=82aafc3ab8d25b');
        const country = geoRes.data.country || 'US';
        const currencyMap = {
          IN: 'INR', US: 'USD', GB: 'GBP', EU: 'EUR', AE: 'AED',
          AU: 'AUD', CA: 'CAD', JP: 'JPY', CN: 'CNY', TH: 'THB',
          RU: 'RUB', BR: 'BRL', KR: 'KRW', MX: 'MXN', SA: 'SAR',
        };
        const userCurrency = currencyMap[country] || 'USD';
        setCurrency(userCurrency);

        // Get conversion rate
        const exRes = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        const rate = exRes.data.rates[userCurrency] || 1;

        // Fetch course data
        const courseRes = await axios.get('https://api.hachion.co/courses/all');
        const courseData = courseRes.data.find(
          (c) => c.courseName.toLowerCase().replace(/\s+/g, '-') === courseName
        );
        setCourse(courseData);

        if (courseData) {
          const getFee = (amount) =>
            amount ? Math.round(parseFloat(amount) * rate) : 'N/A';

          setFees({
            live: getFee(courseData.total),
            mentoring: getFee(courseData.mtotal),
            self: getFee(courseData.stotal),
            crash: getFee(courseData.ctotal),
            corporate: 'Contact Us',
          });
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseName]);

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>Course not found.</div>;

  const renderComponent = () => {
    switch (activeComponent) {
      case 'LiveOnlineFees': return <LiveOnlineFees course={course} />;
      case 'MentoringModeFees': return <MentoringModeFees course={course} />;
      case 'SelfPlacedFees': return <SelfPlacedFees course={course} />;
      case 'CorporateFees': return <CorporateFees course={course} />;
      case 'CrashCourseFee': return <CrashCourseFee course={course} />;
      default: return <LiveOnlineFees course={course} />;
    }
  };

  return (
    <>
      <div className='upcoming-batch'>
        <h1 className='qa-heading'>Upcoming Batches for {course.courseName}</h1>
        <div className='batch-type'>
          <p
            className={`batch-type-content ${activeComponent === 'LiveOnlineFees' ? 'active' : ''}`}
            onClick={() => setActiveComponent('LiveOnlineFees')}
          >
            Live training
            <br />
            <span className="fee-amount">
            {fees.live ? `${currency} ${fees.live}` : 'Loading...'}
          </span>
          </p>

          <p
            className={`batch-type-content ${activeComponent === 'CrashCourseFee' ? 'active' : ''}`}
            onClick={() => setActiveComponent('CrashCourseFee')}
          >
            Crash Course (Fast Track)
            <br />
            <span className="fee-amount">
            {fees.crash ? `${currency} ${fees.crash}` : 'Loading...'}
          </span>
          </p>

          <p
            className={`batch-type-content ${activeComponent === 'MentoringModeFees' ? 'active' : ''}`}
            onClick={() => setActiveComponent('MentoringModeFees')}
          >
            Mentoring mode
            <br />
            <span className="fee-amount">
            {fees.mentoring ? `${currency} ${fees.mentoring}` : 'Loading...'}
          </span>
          </p>

          <p
            className={`batch-type-content ${activeComponent === 'SelfPlacedFees' ? 'active' : ''}`}
            onClick={() => setActiveComponent('SelfPlacedFees')}
          >
            Self-paced Learning
            <br />
            <span className="fee-amount">
            {fees.self ? `${currency} ${fees.self}` : 'Loading...'}
          </span>
          </p>

          <p
            className={`batch-type-content ${activeComponent === 'CorporateFees' ? 'active' : ''}`}
            onClick={() => setActiveComponent('CorporateFees')}
          >
            Corporate Training
          </p>
        </div>

        <div className='batch-content-background'>
          {renderComponent()}

          {/* Optional: Show request batch on specific tabs */}
          {/* {activeComponent === 'LiveOnlineFees' && ( */}
            <p className='schedule'>
              <img src={calendar} alt='calendar' />
              Schedule your way?{' '}
              <span
                className='schedule-span'
                onClick={handleRequestBatchClick}
                style={{ cursor: 'pointer', color: 'blue' }}
              >
                Request Batch
              </span>
            </p>
          {/* )} */}
        </div>
      </div>

      {/* Login Modal */}
      {isLoginModalVisible && (
        <div className='login-modal'>
          <div className='login-modal-content'>
            <button className='close-modal-btn' onClick={hideLoginModal}>×</button>
            <h2 className='modal-title'>Login Required</h2>
            <div className='modal-body-login'>
              <div className='modal-left'>
                <p>
                  Log in to the <span className='web-name'>Hachion website</span> to request a custom batch.
                </p>
                <button
                  className='login-btn'
                  onClick={() => {
                    localStorage.setItem('redirectAfterLogin', window.location.pathname);
                    window.location.href = '/login';
                  }}
                >
                  Login
                </button>
                <button className='cancel-btn' onClick={hideLoginModal}>Cancel</button>
              </div>
              <div className='modal-right'>
                <img src={loginPopupImg} alt='Login Prompt' />
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className='modal-request'>
          <div className='modal-request-content'>
            {/* <button className='request-close' onClick={handleCloseModal}>
              ×
            </button> */}
            <RequestBatch closeModal={handleCloseModal} />
          </div>
        </div>
      )}
    </>
  );
};

export default UpcomingBatch;