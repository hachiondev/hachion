import React, { useState } from 'react';
import EnrollmentForm from '../NewcoursePage/components/EnrollmentForm';
import styles from './Enrollmentpopup.module.css';

const EnrollmentPopup = ({ useAllCourses, isOpen, onClose }) => {
  const [isSuccess, setIsSuccess] = useState(false); // ✅ parent controls success

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className={styles.backdrop}></div>
      
      {/* Popup Container */}
      <div className={styles.popupContainer}>
        <div className={styles.popupContent}>

          {!isSuccess ? (
            <EnrollmentForm
              useAllCourses={useAllCourses}
              onClose={onClose}
              onSuccess={() => setIsSuccess(true)}   // ✅ pass callback
            />
          ) : (
            <div style={{ padding: "30px", textAlign: "center" }}>
              <h2 style={{ color: "green" }}>✅ Thank you!</h2>
              <p>Your enquiry has been submitted. We will contact you shortly.</p>

              <button
                onClick={onClose}
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
