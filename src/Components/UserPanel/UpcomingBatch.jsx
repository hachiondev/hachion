import React, { useState, useEffect } from 'react';
import calendar from '../../Assets/calendar.png';
import './Course.css';
import { useParams } from 'react-router-dom';
import LiveOnlineFees from './LiveOnlineFees';
import CrashCourseFee from './CrashCourseFee';
// import MentoringModeFees from './MentoringModeFees';
import SelfPlacedFees from './SelfPlacedFees';
import SelfPacedQAFees from './SelfPacedQAFees';
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
    live: 0,
    mentoring: 0,
    self: 0,
    selfqa: 0,
    crash: 0,
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

        const geoRes = await axios.get('https://ipinfo.io/json?token=82aafc3ab8d25b');
        const country = geoRes.data.country || 'US';

        const currencyMap = {
          IN: 'INR', US: 'USD', GB: 'GBP', EU: 'EUR', AE: 'AED',
          AU: 'AUD', CA: 'CAD', JP: 'JPY', CN: 'CNY', TH: 'THB',
          RU: 'RUB', BR: 'BRL', KR: 'KRW', MX: 'MXN', SA: 'SAR', NL: 'EUR',
        };
        const userCurrency = currencyMap[country] || 'USD';
        setCurrency(userCurrency);

        const courseRes = await axios.get('https://api.test.hachion.co/courses/all');
        const courseData = courseRes.data.find(
          (c) => c.courseName.toLowerCase().replace(/\s+/g, '-') === courseName
        );
        setCourse(courseData);

        if (!courseData) return;

        const parseOrZero = (val) => {
          const parsed = parseFloat(val);
          return isNaN(parsed) || parsed <= 0 ? 0 : Math.round(parsed);
        };

        let updatedFees = {};

        if (userCurrency === 'INR') {
          updatedFees = {
            live: parseOrZero(courseData.itotal),
            mentoring: parseOrZero(courseData.imtotal),
            self: parseOrZero(courseData.istotal),
            crash: parseOrZero(courseData.ictotal),
            selfqa: parseOrZero(courseData.isqtotal),
          };
        } else if (userCurrency === 'USD') {
          updatedFees = {
            live: parseOrZero(courseData.total),
            mentoring: parseOrZero(courseData.mtotal),
            self: parseOrZero(courseData.stotal),
            crash: parseOrZero(courseData.ctotal),
            selfqa: parseOrZero(courseData.sqtotal),
          };
        } else {
          const exRes = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
          const rate = exRes.data.rates[userCurrency] || 1;

          const convertOrZero = (val) => {
            const parsed = parseFloat(val);
            return isNaN(parsed) || parsed <= 0 ? 0 : Math.round(parsed * rate);
          };

          updatedFees = {
            live: convertOrZero(courseData.total),
            mentoring: convertOrZero(courseData.mtotal),
            self: convertOrZero(courseData.stotal),
            crash: convertOrZero(courseData.ctotal),
            selfqa: convertOrZero(courseData.sqtotal),
          };
        }

        setFees(updatedFees);
      } catch (err) {
        console.error('Error fetching course or location data:', err);
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
      // case 'MentoringModeFees': return <MentoringModeFees course={course} />;
      case 'SelfPlacedFees': return <SelfPlacedFees course={course} />;
      case 'SelfPacedQAFees': return <SelfPacedQAFees course={course} />;
      case 'CrashCourseFee': return <CrashCourseFee course={course} />;
      default: return <LiveOnlineFees course={course} />;
    }
  };

  return (
    <>
      <div className='upcoming-batch'>
        <h2 className='qa-heading'>Upcoming Batches for {course.courseName}</h2>
        <div className='batch-type'>
          {[
            { key: 'LiveOnlineFees', label: 'Live training', fee: fees.live },
            { key: 'CrashCourseFee', label: 'Crash Course (Fast Track)', fee: fees.crash },
            // { key: 'MentoringModeFees', label: 'Mentoring mode', fee: fees.mentoring },
            { key: 'SelfPacedQAFees', label: 'Self-paced with Q&A', fee: fees.selfqa },
            { key: 'SelfPlacedFees', label: 'Self-paced Learning', fee: fees.self }
          ].map(({ key, label, fee }) => (
            <p
              key={key}
              className={`batch-type-content ${activeComponent === key ? 'active' : ''}`}
              onClick={() => setActiveComponent(key)}
            >
              {label}
              <br />
              <span className="fee-amount">{`${currency} ${fee}`}</span>
            </p>
          ))}
        </div>

        <div className='batch-content-background'>
          {renderComponent()}
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

      {/* Batch Request Modal */}
      {isModalOpen && (
        <div className='modal-request'>
          <div className='modal-request-content'>
            <RequestBatch closeModal={handleCloseModal} />
          </div>
        </div>
      )}
    </>
  );
};

export default UpcomingBatch;
