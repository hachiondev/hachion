import React, { useEffect, useRef, useState } from 'react';
import styles from './EnrollNotification.module.css';

export default function EnrollNotification({ open, onClose, onEnroll }) {
  const [method, setMethod] = useState('email');
  const modalRef = useRef(null);
  const firstFocusRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const prevActive = document.activeElement;
    setTimeout(() => firstFocusRef.current?.focus(), 0);
    function onKey(e) {
      if (e.key === 'Escape') onClose?.();
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      prevActive?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="enroll-heading"
        onMouseDown={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <button className={styles.close} aria-label="Close enrollment modal" onClick={onClose}>
          ✕
        </button>

        <h1 id="enroll-heading" className={styles.heading}>
          Select how you'd like to receive your enrolment details
        </h1>

        <div className={styles.options}>
          <button
            ref={firstFocusRef}
            className={`${styles.option} ${method === 'email' ? styles.selected : ''}`}
            onClick={() => setMethod('email')}
            aria-pressed={method === 'email'}
          >
            <span className={styles.checkbox} aria-hidden>
              {method === 'email' ? (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="1" width="22" height="22" rx="6" stroke="#071133" strokeWidth="1.5" fill="#fff" />
                  <path d="M7 12l3 3 7-8" stroke="#071133" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="1" width="22" height="22" rx="6" stroke="#071133" strokeWidth="1.5" fill="#fff" />
                </svg>
              )}
            </span>

            <span className={styles.labelGroup}>
              <span className={styles.optionTitle}>Email</span>
            </span>
          </button>

          <button
            className={`${styles.option} ${method === 'whatsapp' ? styles.selected : ''}`}
            onClick={() => setMethod('whatsapp')}
            aria-pressed={method === 'whatsapp'}
          >
            <span className={styles.checkbox} aria-hidden>
              {method === 'whatsapp' ? (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="1" width="22" height="22" rx="6" stroke="#071133" strokeWidth="1.5" fill="#fff" />
                  <path d="M7 12l3 3 7-8" stroke="#071133" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="1" width="22" height="22" rx="6" stroke="#071133" strokeWidth="1.5" fill="#fff" />
                </svg>
              )}
            </span>

            <span className={styles.labelGroup}>
              <span className={styles.optionTitle}>WhatsApp</span>
            </span>
          </button>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.primary}
            onClick={() => onEnroll?.(method)}
          >
            Enroll Now
          </button>

          <button className={styles.cancel} onClick={onClose}>
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}

/* Usage example (for README or storybook):

import React, { useState } from 'react';
import EnrollNotification from './EnrollNotification';

export default function Example() {
  const [open, setOpen] = useState(true);
  function handleEnroll(method) {
    // fire enrollment API, show toast, etc.
    console.log('Enroll via', method);
    setOpen(false);
  }
  return (
    <div>
      <EnrollNotification
        open={open}
        onClose={() => setOpen(false)}
        onEnroll={handleEnroll}
      />
    </div>
  );
}

*/