import React from "react";
import { cn } from "../../utils";
import styles from "./LoginRequired.module.css";

// Close icon
const CloseIcon = (p) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...p}>
    <path
      fill="currentColor"
      d="M18 6L6 18M6 6l12 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const StudentImage = () => (
  <img src="login_pop.png" alt="" srcset="" className={styles.lrImage} />
);

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
        {/* Image Section */}
        {showImage && (
          <div className={styles.lrImageSection}>
            <StudentImage />
            <button
              className={styles.lrCloseBtn}
              onClick={onCancel}
              aria-label="Close modal"
            >
              <CloseIcon />
            </button>
          </div>
        )}

        {/* Content Section */}
        <div className={styles.lrContent}>
          <h2 className={styles.lrTitle}>{title}</h2>
          <p className={styles.lrSubtitle}>{subtitle}</p>

          {/* Action Buttons */}
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
