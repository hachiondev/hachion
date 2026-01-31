import React, { useState, useEffect } from 'react';
import EnrollmentForm from '../NewcoursePage/components/EnrollmentForm';
import styles from './Enrollmentpopup.module.css';

const EnrollmentPopup = ({ useAllCourses, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className={styles.backdrop}></div>
      
      {/* Popup Container */}
      <div className={styles.popupContainer}>
        <div className={styles.popupContent}>
          {/* <button 
            className={styles.closeButton} 
            // onClick={onClose}
            aria-label="Close popup"
          >
            ×
          </button> */}
          <EnrollmentForm useAllCourses={useAllCourses} onClose={onClose} />
        </div>
      </div>
    </>
  );
};

export default EnrollmentPopup;