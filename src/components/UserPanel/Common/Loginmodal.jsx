"use client";

import React from "react";
import styles from "./Loginmodal.module.css";

// Ported from the CRA app's src/Components/UserPanel/Common/Loginmodal.jsx.
export default function LoginModal({ isOpen, onClose, onLogin, description = "To view this course please Login" }) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdropCustom} onClick={onClose}>
      <div className={styles.loginModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeaderCustom}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/login_pop.png" alt="Student with books" className={styles.modalImage} />
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.modalBodyCustom}>
          <h2 className={styles.modalTitleCustom}>Login Required</h2>

          <p className={styles.modalTextCustom}>{description}</p>

          <div className={styles.modalActions}>
            <button className={styles.btnCancel} onClick={onClose}>
              Cancel
            </button>

            <button className={styles.btnLogin} onClick={onLogin}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
