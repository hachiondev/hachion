import React, { useRef, useEffect } from 'react';
import styles from './VideoModal.module.css';

export default function VideoModal({ videoSrc, onClose, title = 'Preview' }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      // attempt to autoplay; browsers may block autoplay without user gesture
      v.play().catch(() => {
        /* ignore autoplay errors */
      });
    }

    return () => {
      if (v) {
        v.pause();
        v.currentTime = 0;
      }
    };
  }, [videoSrc]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.vmOverlay} onClick={handleOverlayClick}>
      <div className={styles.vmModal} role="dialog" aria-label={title}>
        <button className={styles.vmClose} onClick={onClose} aria-label="Close video">
          ×
        </button>

        <div className={styles.vmContent}>
          <video
            ref={videoRef}
            className={styles.vmVideo}
            src={videoSrc}
            controls
            playsInline
          />
        </div>
      </div>
    </div>
  );
}
