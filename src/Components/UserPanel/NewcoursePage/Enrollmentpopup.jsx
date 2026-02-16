import React, { useState, useEffect } from 'react';
import EnrollmentForm from '../NewcoursePage/components/EnrollmentForm';
import styles from './Enrollmentpopup.module.css';

const EnrollmentPopup = ({ useAllCourses, isOpen, onClose, currentCourse }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  // ✅ Show popup logic based on login status
  useEffect(() => {
    const loginData = localStorage.getItem('loginuserData');

    // ✅ USER IS LOGGED IN → Show only once permanently
    if (loginData) {
      const hasSeenPopup = localStorage.getItem('enrollmentPopupSeen_loggedUser');

      if (hasSeenPopup === 'true') {
        setShouldShow(false);
        onClose();
      } else {
        setShouldShow(true);
      }
    } 
    // ✅ USER NOT LOGGED IN → Always show (even on refresh or next course)
    else {
      setShouldShow(true);
    }
  }, [onClose]);

  // ✅ Additional safety check when isOpen changes
  useEffect(() => {
    if (!isOpen) return;

    const loginData = localStorage.getItem('loginuserData');

    if (loginData) {
      const hasSeenPopup = localStorage.getItem('enrollmentPopupSeen_loggedUser');

      if (hasSeenPopup === 'true') {
        onClose();
      }
    }
  }, [isOpen, onClose]);

  // ✅ Mark popup as seen when user closes it (only for logged-in users)
  const handleClose = () => {
    const loginData = localStorage.getItem('loginuserData');

    if (loginData) {
      localStorage.setItem('enrollmentPopupSeen_loggedUser', 'true');
    }

    setShouldShow(false);
    onClose();
  };

  // ✅ Mark popup as seen when user successfully submits (only for logged-in users)
  const handleSuccess = () => {
    setIsSuccess(true);

    const loginData = localStorage.getItem('loginuserData');

    if (loginData) {
      localStorage.setItem('enrollmentPopupSeen_loggedUser', 'true');
    }
  };

  // ✅ Don't render if shouldn't show or not open
  if (!isOpen || !shouldShow) return null;

  return (
    <>
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={handleClose}></div>
      
      {/* Popup Container */}
      <div className={styles.popupContainer}>
        <div className={styles.popupContent}>

          {!isSuccess ? (
            <EnrollmentForm
              useAllCourses={useAllCourses}
              onClose={handleClose} 
              onSuccess={handleSuccess}
            />
          ) : (
            <div style={{ padding: "30px", textAlign: "center" }}>
              <h2 style={{ color: "green" }}>✅ Thank you!</h2>
              <p>Your enquiry has been submitted. We will contact you shortly.</p>

              <button
                onClick={handleClose}  
                style={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#00bcd4",
                  color: "#fff",
                  cursor: "pointer"
                }}
              >
                Close
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default EnrollmentPopup;
