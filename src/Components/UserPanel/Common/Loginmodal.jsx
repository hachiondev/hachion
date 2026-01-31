import React from "react";
import styles from "./Loginmodal.module.css";

export default function LoginModal({
  isOpen,
  onClose,
  onLogin,
  description = "To view this course please Login",
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdropCustom} onClick={onClose}>
      <div
        className={styles.loginModal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeaderCustom}>
          <img
            src="/login_pop.png"
            alt="Student with books"
            className={styles.modalImage}
          />
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.modalBodyCustom}>
          <h2 className={styles.modalTitleCustom}>Login Required</h2>

          {/* ✅ Dynamic text */}
          <p className={styles.modalTextCustom}>{description}</p>

          <div className={styles.modalActions}>
            <button className={styles.btnCancel} onClick={onClose}>
              Cancel
            </button>

            {/* ✅ Parent controls login behavior */}
            <button className={styles.btnLogin} onClick={onLogin}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
