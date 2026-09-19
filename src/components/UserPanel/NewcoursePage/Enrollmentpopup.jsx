"use client";

import React, { useState, useEffect } from "react";
import EnrollmentForm from "./components/EnrollmentForm";
import styles from "./Enrollmentpopup.module.css";

// Ported from the CRA app's
// src/Components/UserPanel/NewcoursePage/Enrollmentpopup.jsx.
const EnrollmentPopup = ({ isOpen, onClose }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const loginData = localStorage.getItem("loginuserData");

    if (loginData) {
      const hasSeenPopup = localStorage.getItem("enrollmentPopupSeen_loggedUser");

      if (hasSeenPopup === "true") {
        // Syncs from localStorage (an external source), read once on mount.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setShouldShow(false);
        onClose();
      } else {
        setShouldShow(true);
      }
    } else {
      setShouldShow(true);
    }
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const loginData = localStorage.getItem("loginuserData");

    if (loginData) {
      const hasSeenPopup = localStorage.getItem("enrollmentPopupSeen_loggedUser");

      if (hasSeenPopup === "true") {
        onClose();
      }
    }
  }, [isOpen, onClose]);

  const handleClose = () => {
    const loginData = localStorage.getItem("loginuserData");

    if (loginData) {
      localStorage.setItem("enrollmentPopupSeen_loggedUser", "true");
    }

    setShouldShow(false);
    onClose();
  };

  const handleSuccess = () => {
    setIsSuccess(true);

    const loginData = localStorage.getItem("loginuserData");

    if (loginData) {
      localStorage.setItem("enrollmentPopupSeen_loggedUser", "true");
    }
  };

  if (!isOpen || !shouldShow) return null;

  return (
    <>
      <div className={styles.backdrop} onClick={handleClose}></div>

      <div className={styles.popupContainer}>
        <div className={styles.popupContent}>
          {!isSuccess ? (
            <EnrollmentForm onClose={handleClose} onSuccess={handleSuccess} />
          ) : (
            <div style={{ padding: "30px", textAlign: "center" }}>
              <h2 style={{ color: "green" }}>✅ Thank you!</h2>
              <p>Your enquiry has been submitted. We will contact you shortly.</p>

              <button
                onClick={handleClose}
                style={{ marginTop: "20px", padding: "10px 20px", borderRadius: "6px", border: "none", background: "#00bcd4", color: "#fff", cursor: "pointer" }}
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
