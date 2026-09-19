"use client";

import styles from "./Loginmodal.module.css";

// Generic single-button acknowledgment dialog, reusing LoginModal's
// established backdrop/card visual pattern (see Loginmodal.jsx) instead of
// a plain window.alert() or an inline error line.
export default function AlertModal({ isOpen, onClose, title = "Hachion says", message }) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdropCustom} onClick={onClose}>
      <div className={styles.loginModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalBodyCustom} style={{ paddingTop: 30 }}>
          <h2 className={styles.modalTitleCustom}>{title}</h2>
          <p className={styles.modalTextCustom}>{message}</p>
          <div className={styles.modalActions}>
            <button className={styles.btnLogin} onClick={onClose}>
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
