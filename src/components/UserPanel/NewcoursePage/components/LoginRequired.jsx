"use client";

import React from "react";
import styles from "./LoginRequired.module.css";

const CloseIcon = (p) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...p}>
    <path fill="currentColor" d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// login_pop.png is a public/ asset — the CRA original referenced it without
// a leading slash (src="login_pop.png"), which resolves relative to the
// current route on any non-root page (e.g. would 404 under
// /courses/:category/:course) rather than the site root the file actually
// lives at. Common/Loginmodal.jsx's copy of the same image already uses the
// correct "/login_pop.png" — matched here.
const StudentImage = () => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src="/login_pop.png" alt="" className={styles.lrImage} />
);

// Ported from the CRA app's
// src/Components/UserPanel/NewcoursePage/components/LoginRequired.jsx.
export default function LoginRequired({
  title = "Login Required",
  subtitle = "To view this course please Login",
  cancelText = "Cancel",
  loginText = "Login",
  onCancel = () => {},
  onLogin = () => {},
  showImage = true,
}) {
  return (
    <div className={styles.lrOverlay}>
      <div className={styles.lrModal}>
        {showImage && (
          <div className={styles.lrImageSection}>
            <StudentImage />
            <button className={styles.lrCloseBtn} onClick={onCancel} aria-label="Close modal">
              <CloseIcon />
            </button>
          </div>
        )}

        <div className={styles.lrContent}>
          <h2 className={styles.lrTitle}>{title}</h2>
          <p className={styles.lrSubtitle}>{subtitle}</p>

          <div className={styles.lrActions}>
            <button className={styles.lrCancelBtn} onClick={onCancel}>
              {cancelText}
            </button>
            <button className={styles.lrLoginBtn} onClick={onLogin}>
              {loginText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
